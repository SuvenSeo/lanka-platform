import Link from "next/link";
import { getStats, getDomains, getDatasets } from "@/lib/catalog";
import { formatNumber } from "@/lib/utils";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const FEATURES = [
  { href: "/datasets", label: "379 Datasets", desc: "Browse all nuuuwan repos" },
  { href: "/search", label: "Search", desc: "Keyword search across catalog" },
  { href: "/news", label: "News Timeline", desc: "Live articles from lk_news" },
  { href: "/legal", label: "Legal Research", desc: "Acts, courts, Hansard routing" },
  { href: "/cabinet", label: "Cabinet Search", desc: "10K+ government decisions" },
  { href: "/map", label: "Island Map", desc: "9 provinces · lk_locator" },
];

export default async function HomePage() {
  const [stats, domains, top] = await Promise.all([
    Promise.resolve(getStats()),
    Promise.resolve(getDomains()),
    Promise.resolve(getDatasets({ status: "active", limit: 8 })),
  ]);

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.platform}</p>
        <h1>Sri Lanka Open Data Platform</h1>
        <p>
          Federated portal over nuuuwan&apos;s 379-repo ecosystem — legal, news, elections,
          environment, and more. Fully hosted on Vercel.
        </p>
      </section>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{stats.total_datasets}</strong>
            <span className="text-muted">datasets</span>
          </div>
          <div className="stat-card">
            <strong>{formatNumber(stats.total_documents_indexed)}</strong>
            <span className="text-muted">documents indexed</span>
          </div>
          <div className="stat-card">
            <strong>{stats.active_datasets}</strong>
            <span className="text-muted">active pipelines</span>
          </div>
          <div className="stat-card">
            <strong>{stats.engine ?? "native"}</strong>
            <span className="text-muted">API engine</span>
          </div>
        </div>
      )}

      <h2 className="section-title">Explore</h2>
      <div className="card-grid mb-2">
        {FEATURES.map((f) => (
          <Link key={f.href} href={f.href} className="card">
            <h3>{f.label}</h3>
            <p className="card-desc">{f.desc}</p>
          </Link>
        ))}
      </div>

      {domains.length > 0 && (
        <>
          <h2 className="section-title">Domains</h2>
          <div className="filter-row">
            {domains
              .filter((d) => (d.count ?? 0) > 0)
              .slice(0, 10)
              .map((d) => (
                <Link key={d.id} href={`/datasets?domain=${d.id}`}>
                  {d.name} ({d.count})
                </Link>
              ))}
          </div>
        </>
      )}

      <h2 className="section-title">Featured datasets</h2>
      <div className="dataset-list">
        {top.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description || ds.id}</p>
            <span className="badge badge-active">{ds.domain}</span>
            {ds.doc_count != null && (
              <span className="badge">{ds.doc_count.toLocaleString()} docs</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
