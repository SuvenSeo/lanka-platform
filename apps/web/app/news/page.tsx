import Link from "next/link";
import { getNewsTimeline } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

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
      url: string;
    }>) ?? [];

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.news}</p>
        <h1>News Timeline</h1>
        <p className="text-muted">
          Latest articles from lk_news — trilingual stories from Sri Lankan outlets.
        </p>
      </section>

      {!timeline && (
        <p className="text-muted">Could not load news feed. Try again shortly.</p>
      )}

      <div className="dataset-list">
        {articles.map((a) => (
          <article key={a.doc_id} className="card">
            <h3>
              {a.url ? (
                <a href={a.url} target="_blank" rel="noopener noreferrer">
                  {a.description}
                </a>
              ) : (
                a.description
              )}
            </h3>
            <p className="card-meta">
              <span className="badge">{a.date}</span>
              <span className="badge">{a.newspaper_name}</span>
              <span className="badge">{a.lang}</span>
            </p>
          </article>
        ))}
      </div>

      <p className="mt-2 text-muted">
        Source:{" "}
        <a href="https://github.com/nuuuwan/lk_news" target="_blank" rel="noopener noreferrer">
          nuuuwan/lk_news
        </a>
        {" · "}
        <Link href="/datasets/lk_news">Dataset</Link>
      </p>
    </div>
  );
}
