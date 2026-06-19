import { fetchRemoteText, parseTsv } from "./remote-fetch";

const NEWS_TSV =
  "https://raw.githubusercontent.com/nuuuwan/lk_news/data/data/lk_news/docs_last10000.tsv";

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
    const text = await fetchRemoteText(NEWS_TSV, { revalidate: 1800 });
    const articles: NewsArticle[] = [];
    for (const row of parseTsv(text)) {
      articles.push({
        doc_id: row.doc_id ?? "",
        date: row.date_str ?? row.date ?? "",
        newspaper_name: row.newspaper_name ?? row.newspaper_id ?? row.outlet ?? "",
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

export async function getNewsArticle(docId: string): Promise<NewsArticle | null> {
  const { articles } = await fetchNewsTimeline(10_000);
  return articles.find((a) => a.doc_id === docId) ?? null;
}
