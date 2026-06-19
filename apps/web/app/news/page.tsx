import Link from "next/link";
import { getNewsTimeline } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const timeline = await getNewsTimeline(40).catch(() => null);
  const articles =
    (timeline?.articles as Array<{
      doc_id: string;
      date: string;
      newspaper_name: string;
      lang: string;
      description: string;
    }>) ?? [];

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.news}</p>
        <h1>News Timeline</h1>
        <p className="text-muted">
          Latest articles from lk_news — read in-platform, synced from nuuuwan pipelines.
        </p>
        <SyncBadge source="nuuuwan/lk_news" />
      </section>

      {!timeline && (
        <p className="text-muted">Could not load news feed. Sync will retry automatically.</p>
      )}

      <div className="dataset-list">
        {articles.map((a) => (
          <Link key={a.doc_id} href={`/news/${encodeURIComponent(a.doc_id)}`} className="card">
            <h3>{a.description}</h3>
            <p className="card-meta">
              <span className="badge">{a.date}</span>
              <span className="badge">{a.newspaper_name}</span>
              <span className="badge">{a.lang}</span>
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/datasets/lk_news">News dataset explorer</Link>
        {" · "}
        <Link href="/legal">Search news corpus</Link>
      </p>
    </div>
  );
}
