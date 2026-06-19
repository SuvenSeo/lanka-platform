import Link from "next/link";
import { getDatasets, getDomains } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DatasetsPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [data, domains] = await Promise.all([
    getDatasets({
      domain: params.domain,
      status: params.status ?? "active",
      q: params.q,
      limit: 60,
    }).catch(() => ({ datasets: [], total: 0, count: 0 })),
    getDomains().catch(() => []),
  ]);

  return (
    <div className="container">
      <section className="hero">
        <h1>Datasets</h1>
        <p className="text-muted">
          {data.total} repositories in the nuuuwan Sri Lanka open data ecosystem.
        </p>
      </section>

      <div className="filter-row">
        <Link href="/datasets" className={!params.domain ? "active" : ""}>
          All
        </Link>
        {domains.map((d) => (
          <Link
            key={d.id}
            href={`/datasets?domain=${d.id}`}
            className={params.domain === d.id ? "active" : ""}
          >
            {d.name}
          </Link>
        ))}
      </div>

      <div className="dataset-list">
        {data.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description || "No description"}</p>
            <div className="card-meta">
              <span className="badge badge-active">{ds.status}</span>
              <span className="badge">{ds.domain}</span>
              {ds.github_stars != null && ds.github_stars > 0 && (
                <span className="badge">★ {ds.github_stars}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
