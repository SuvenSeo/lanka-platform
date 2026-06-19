/**
 * Deep RAG over nuuuwan/lk-acts-chunks — parquet keyword search with warm cache.
 */
import { parquetRead } from "hyparquet";

const PARQUET_URL =
  "https://huggingface.co/datasets/nuuuwan/lk-acts-chunks/resolve/main/data/train-00000-of-00001.parquet";

export type ActChunk = {
  chunk_id: string;
  chunk_text: string;
  act_id: string;
  act_description: string;
  act_year?: number;
  act_type?: string;
  act_source_url?: string;
  language?: string;
  snippet: string;
  score: number;
};

type Row = Record<string, unknown>;

let chunkCache: Row[] | null = null;
let cacheAt = 0;
const CACHE_MS = 6 * 60 * 60 * 1000;

async function loadChunks(): Promise<Row[]> {
  const now = Date.now();
  if (chunkCache && now - cacheAt < CACHE_MS) return chunkCache;

  const res = await fetch(PARQUET_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch acts parquet: ${res.status}`);

  const buffer = await res.arrayBuffer();
  const rows: Row[] = [];

  await parquetRead({
    file: buffer,
    onComplete: (data) => {
      const list = data as unknown[];
      for (const item of list) {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          rows.push(item as Row);
        }
      }
    },
  });

  chunkCache = rows;
  cacheAt = now;
  return rows;
}

function tokenize(q: string): string[] {
  return (q.toLowerCase().match(/[\w\u0D80-\u0DFF\u0B80-\u0BFF]{3,}/g) ?? []).slice(0, 12);
}

function rowToChunk(row: Row, score: number): ActChunk {
  const text = String(row.chunk_text ?? "");
  return {
    chunk_id: String(row.chunk_id ?? row.id ?? ""),
    chunk_text: text,
    act_id: String(row.act_id ?? ""),
    act_description: String(row.act_description ?? ""),
    act_year: row.act_year != null ? Number(row.act_year) : undefined,
    act_type: row.act_type != null ? String(row.act_type) : undefined,
    act_source_url: row.act_source_url != null ? String(row.act_source_url) : undefined,
    language: row.language != null ? String(row.language) : undefined,
    snippet: text.slice(0, 320),
    score,
  };
}

export async function queryActsRag(question: string, limit = 10): Promise<{
  question: string;
  answer: string;
  chunks: ActChunk[];
  source: string;
  engine: string;
  chunk_count: number;
}> {
  const tokens = tokenize(question);
  const rows = await loadChunks();

  if (!tokens.length) {
    return {
      question,
      answer: "Please provide a more specific legal question.",
      chunks: [],
      source: "nuuuwan/lk-acts-chunks",
      engine: "hyparquet",
      chunk_count: 0,
    };
  }

  const scored: { score: number; row: Row }[] = [];
  for (const row of rows) {
    const text = String(row.chunk_text ?? "").toLowerCase();
    const desc = String(row.act_description ?? "").toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (desc.includes(t)) score += 3;
      if (text.includes(t)) score += 1;
    }
    if (score > 0) scored.push({ score, row });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, limit).map(({ score, row }) => rowToChunk(row, score));

  const answer =
    top.length > 0
      ? `Found ${top.length} relevant section(s) in Sri Lanka Acts. ${top
          .slice(0, 3)
          .map((c, i) => `[${i + 1}] ${c.act_description}: ${c.snippet}`)
          .join(" ")}`
      : `No act sections matched "${question}" in the chunk index.`;

  return {
    question,
    answer,
    chunks: top,
    source: "nuuuwan/lk-acts-chunks",
    engine: "hyparquet",
    chunk_count: top.length,
  };
}
