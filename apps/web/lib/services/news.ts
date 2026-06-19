const NEWS_TSV =
  "https://raw.githubusercontent.com/nuuuwan/lk_news/data/docs_last10000.tsv";

export type NewsArticle = {
  doc_id: string;
  date: string;
  newspaper_name: string;
  lang: string;
  description: string;
  url: string;
};

let cache: { at: number; articles: NewsArticle[] } | null = null;
const TTL_MS = 30 * 60 * 1000;

export async function fetchNewsTimeline(limit = 30, outlet?: string): Promise<{
  count: number;
  articles: NewsArticle[];
  source: string;
}> {
  const now = Date.now();
  if (!cache || now - cache.at > TTL_MS) {
    const res = await fetch(NEWS_TSV, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error("Failed to fetch news TSV");
    const text = await res.text();
    const lines = text.trim().split("\n");
    const header = lines[0]?.split("\t") ?? [];
    const articles: NewsArticle[] = [];
    for (const line of lines.slice(1)) {
      const cols = line.split("\t");
      const row: Record<string, string> = {};
      header.forEach((h, i) => {
        row[h] = cols[i] ?? "";
      });
      articles.push({
        doc_id: row.doc_id ?? "",
        date: row.date_str ?? row.date ?? "",
        newspaper_name: row.newspaper_name ?? row.outlet ?? "",
        lang: row.lang ?? "",
        description: row.description ?? row.title ?? "",
        url: row.url_metadata ?? row.url ?? "",
      });
    }
    cache = { at: now, articles };
  }

  let list = [...cache.articles].sort((a, b) => b.date.localeCompare(a.date));
  if (outlet) {
    const o = outlet.toLowerCase();
    list = list.filter((a) => a.newspaper_name.toLowerCase().includes(o));
  }
  return {
    count: Math.min(limit, list.length),
    articles: list.slice(0, limit),
    source: "nuuuwan/lk_news",
  };
}
