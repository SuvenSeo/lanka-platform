/**
 * Multi-corpus chunk RAG — keyword search over HF parquet indexes.
 */
import { parquetRead } from "hyparquet";

export type CorpusId = "acts" | "news" | "hansard";

export type ChunkResult = {
  chunk_id: string;
  snippet: string;
  score: number;
  corpus: CorpusId;
  title?: string;
  source_url?: string;
  metadata?: Record<string, string | number | undefined>;
};

type CorpusConfig = {
  id: CorpusId;
  label: string;
  parquetUrl: string;
  textField: string;
  titleField: string;
  sourceField?: string;
};

const CORPORA: CorpusConfig[] = [
  {
    id: "acts",
    label: "Sri Lanka Acts",
    parquetUrl:
      "https://huggingface.co/datasets/nuuuwan/lk-acts-chunks/resolve/main/data/train-00000-of-00001.parquet",
    textField: "chunk_text",
    titleField: "act_description",
    sourceField: "act_source_url",
  },
  {
    id: "news",
    label: "Sri Lanka News",
    parquetUrl:
      "https://huggingface.co/datasets/nuuuwan/lk-news-chunks/resolve/main/data/train-00000-of-00001.parquet",
    textField: "chunk_text",
    titleField: "description",
    sourceField: "url_metadata",
  },
  {
    id: "hansard",
    label: "Parliamentary Hansard",
    parquetUrl:
      "https://huggingface.co/datasets/nuuuwan/lk-hansard-2020s-chunks/resolve/main/data/train-00000-of-00001.parquet",
    textField: "chunk_text",
    titleField: "speech_title",
    sourceField: "source_url",
  },
];

type Row = Record<string, unknown>;

const cache = new Map<CorpusId, { at: number; rows: Row[] }>();
const CACHE_MS = 6 * 60 * 60 * 1000;

async function loadCorpus(corpusId: CorpusId): Promise<Row[]> {
  const cfg = CORPORA.find((c) => c.id === corpusId);
  if (!cfg) throw new Error(`Unknown corpus: ${corpusId}`);

  const now = Date.now();
  const hit = cache.get(corpusId);
  if (hit && now - hit.at < CACHE_MS) return hit.rows;

  const res = await fetch(cfg.parquetUrl, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch ${corpusId} parquet: ${res.status}`);

  const buffer = await res.arrayBuffer();
  const rows: Row[] = [];
  await parquetRead({
    file: buffer,
    onComplete: (data) => {
      for (const item of data as unknown[]) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          rows.push(item as Row);
        }
      }
    },
  });

  cache.set(corpusId, { at: now, rows });
  return rows;
}

function tokenize(q: string): string[] {
  return (q.toLowerCase().match(/[\w\u0D80-\u0DFF\u0B80-\u0BFF]{3,}/g) ?? []).slice(0, 12);
}

function scoreRow(row: Row, tokens: string[], cfg: CorpusConfig): number {
  const text = String(row[cfg.textField] ?? "").toLowerCase();
  const title = String(row[cfg.titleField] ?? "").toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (title.includes(t)) score += 3;
    if (text.includes(t)) score += 1;
  }
  return score;
}

function rowToChunk(row: Row, score: number, cfg: CorpusConfig): ChunkResult {
  const text = String(row[cfg.textField] ?? "");
  return {
    chunk_id: String(row.chunk_id ?? row.id ?? ""),
    snippet: text.slice(0, 320),
    score,
    corpus: cfg.id,
    title: String(row[cfg.titleField] ?? ""),
    source_url: cfg.sourceField ? String(row[cfg.sourceField] ?? "") : undefined,
  };
}

export function listCorpora() {
  return CORPORA.map((c) => ({
    id: c.id,
    label: c.label,
    engine: "hyparquet",
  }));
}

export function routeCorpus(question: string): CorpusId {
  const q = question.toLowerCase();
  if (/news|article|media|virakesari|adaderana|mirror/.test(q)) return "news";
  if (/hansard|parliament|mp|debate|speech/.test(q)) return "hansard";
  return "acts";
}

export async function queryCorpus(
  corpusId: CorpusId,
  question: string,
  limit = 8,
): Promise<{ corpus: CorpusId; chunks: ChunkResult[]; chunk_count: number }> {
  const cfg = CORPORA.find((c) => c.id === corpusId);
  if (!cfg) throw new Error(`Unknown corpus: ${corpusId}`);

  const tokens = tokenize(question);
  const rows = await loadCorpus(corpusId);
  if (!tokens.length) return { corpus: corpusId, chunks: [], chunk_count: 0 };

  const scored: { score: number; row: Row }[] = [];
  for (const row of rows) {
    const score = scoreRow(row, tokens, cfg);
    if (score > 0) scored.push({ score, row });
  }
  scored.sort((a, b) => b.score - a.score);
  const chunks = scored.slice(0, limit).map(({ score, row }) => rowToChunk(row, score, cfg));
  return { corpus: corpusId, chunks, chunk_count: chunks.length };
}

export async function findByDocId(
  corpusId: CorpusId,
  docId: string,
): Promise<{ chunks: Array<{ chunk_id: string; text: string; title: string }>; corpus: CorpusId }> {
  const cfg = CORPORA.find((c) => c.id === corpusId);
  if (!cfg) throw new Error(`Unknown corpus: ${corpusId}`);

  const rows = await loadCorpus(corpusId);
  const normalized = docId.toLowerCase();
  const matches = rows.filter((r) => {
    const id = String(r.doc_id ?? r.id ?? "").toLowerCase();
    return id === normalized || id.includes(normalized) || normalized.includes(id);
  });

  return {
    corpus: corpusId,
    chunks: matches.slice(0, 20).map((r) => ({
      chunk_id: String(r.chunk_id ?? r.id ?? ""),
      text: String(r.chunk_text ?? ""),
      title: String(r[cfg.titleField] ?? ""),
    })),
  };
}

export async function routeQuery(question: string, limit = 8, corpus?: CorpusId) {
  const target = corpus ?? routeCorpus(question);
  try {
    const result = await queryCorpus(target, question, limit);
    const answer =
      result.chunks.length > 0
        ? `Found ${result.chunks.length} section(s) in ${target}. ${result.chunks
            .slice(0, 2)
            .map((c, i) => `[${i + 1}] ${c.title}: ${c.snippet}`)
            .join(" ")}`
        : `No matches in ${target} for "${question}".`;
    return {
      question,
      corpus: target,
      answer,
      chunks: result.chunks,
      engine: "hyparquet",
      chunk_count: result.chunk_count,
    };
  } catch (e) {
    return {
      question,
      corpus: target,
      answer: `Corpus ${target} unavailable: ${e instanceof Error ? e.message : "error"}`,
      chunks: [] as ChunkResult[],
      engine: "hyparquet",
      chunk_count: 0,
      error: true,
    };
  }
}
