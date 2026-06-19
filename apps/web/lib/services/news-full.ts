import { getNewsArticle, type NewsArticle } from "./news";
import { findByDocId } from "./chunk-rag";

export type NewsArticleFull = NewsArticle & {
  body_chunks: Array<{ chunk_id: string; text: string }>;
  full_text: string;
  source: string;
};

export async function getNewsArticleFull(docId: string): Promise<NewsArticleFull | null> {
  const article = await getNewsArticle(docId);
  if (!article) return null;

  let chunks: Array<{ chunk_id: string; text: string }> = [];
  try {
    const found = await findByDocId("news", docId);
    chunks = found.chunks.map((c) => ({ chunk_id: c.chunk_id, text: c.text }));
  } catch {
    /* corpus unavailable */
  }

  const fullText = chunks.length
    ? chunks.map((c) => c.text).join("\n\n")
    : article.description;

  return {
    ...article,
    body_chunks: chunks,
    full_text: fullText,
    source: chunks.length ? "nuuuwan/lk-news-chunks" : "nuuuwan/lk_news",
  };
}
