import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsArticleFull } from "@/lib/services/news-full";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const article = await getNewsArticleFull(decodeURIComponent(docId));
  if (!article) notFound();

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">පුවත් · செய்தி · News article</p>
        <h1>{article.description}</h1>
        <SyncBadge source={article.source} />
      </section>

      <div className="card">
        <p className="card-meta">
          <span className="badge">{article.date}</span>
          <span className="badge">{article.newspaper_name}</span>
          <span className="badge">{article.lang}</span>
        </p>
        <div className="doc-body mt-2">
          <p>{article.full_text}</p>
        </div>
        {article.body_chunks.length > 1 && (
          <p className="text-muted mt-2" style={{ fontSize: "0.8rem" }}>
            Assembled from {article.body_chunks.length} indexed chunks
          </p>
        )}
      </div>

      <p className="mt-2">
        <Link href="/news">← News timeline</Link>
        {" · "}
        <Link href="/legal">Search related in corpora</Link>
      </p>
    </div>
  );
}
