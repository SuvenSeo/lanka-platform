const CABINET_TSV =
  "https://raw.githubusercontent.com/nuuuwan/lk_cabinet_decisions/data/data/lk_cabinet_decisions/docs_last1000.tsv";

export type CabinetDecision = {
  doc_id: string;
  date: string;
  description: string;
  title?: string;
  body_snippet?: string;
  lang?: string;
  url?: string;
};

let cache: { at: number; rows: Record<string, string>[] } | null = null;
const TTL_MS = 60 * 60 * 1000;

async function loadRows(): Promise<Record<string, string>[]> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.rows;

  const res = await fetch(CABINET_TSV, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error("Failed to fetch cabinet TSV");
  const text = await res.text();
  const lines = text.trim().split("\n");
  const header = lines[0]?.split("\t") ?? [];
  const rows: Record<string, string>[] = [];
  for (const line of lines.slice(1)) {
    const cols = line.split("\t");
    const row: Record<string, string> = {};
    header.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    rows.push(row);
  }
  cache = { at: now, rows };
  return rows;
}

function tokenize(q: string) {
  return q.toLowerCase().match(/[\w\u0D80-\u0DFF\u0B80-\u0BFF]{3,}/g) ?? [];
}

export async function searchCabinet(q: string, limit = 20): Promise<{
  query: string;
  count: number;
  total_indexed: number;
  source: string;
  results: CabinetDecision[];
}> {
  const tokens = tokenize(q);
  const rows = await loadRows();
  if (!tokens.length) {
    return { query: q, count: 0, total_indexed: rows.length, source: "nuuuwan/lk_cabinet_decisions", results: [] };
  }

  const scored: { score: number; row: Record<string, string> }[] = [];
  for (const row of rows) {
    const hay = [
      row.description,
      row.decision_details_title,
      row.decision_details_body,
    ]
      .join(" ")
      .toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += row.description?.toLowerCase().includes(t) ? 2 : 1;
    }
    if (score > 0) scored.push({ score, row });
  }

  scored.sort((a, b) => b.score - a.score || (b.row.date_str ?? "").localeCompare(a.row.date_str ?? ""));

  const results = scored.slice(0, limit).map(({ row }) => ({
    doc_id: row.doc_id ?? "",
    date: row.date_str ?? "",
    description: row.description ?? "",
    title: row.decision_details_title,
    body_snippet: (row.decision_details_body ?? "").slice(0, 500),
    lang: row.lang,
    url: row.url_metadata,
  }));

  return {
    query: q,
    count: results.length,
    total_indexed: rows.length,
    source: "nuuuwan/lk_cabinet_decisions",
    results,
  };
}

export async function getRecentCabinet(limit = 15) {
  const rows = await loadRows();
  const sorted = [...rows].sort((a, b) => (b.date_str ?? "").localeCompare(a.date_str ?? ""));
  return sorted.slice(0, limit).map((row) => ({
    doc_id: row.doc_id,
    date: row.date_str,
    description: row.description,
    lang: row.lang,
    url: row.url_metadata,
  }));
}
