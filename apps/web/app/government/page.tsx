import { getFederation } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function GovernmentPage() {
  const data = await getFederation().catch(() => null);
  const sources = (data?.sources as Array<Record<string, unknown>>) ?? [];

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.government}</p>
        <h1>Government & Federation</h1>
        <p className="text-muted">
          Official and community open data sources federated for Sri Lankans.
        </p>
      </section>

      <div className="dataset-list">
        {sources.map((src) => (
          <a
            key={String(src.id)}
            href={String(src.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            <h3>{String(src.name)}</h3>
            <p className="card-desc">{String(src.description)}</p>
            <span className="badge badge-maroon">{String(src.type)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
