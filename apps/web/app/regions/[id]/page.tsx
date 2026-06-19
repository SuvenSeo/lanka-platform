import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatasets } from "@/lib/api";
import { getRegion, regionSearchQuery } from "@/lib/geo/regions";

export const dynamic = "force-dynamic";

export default async function RegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const region = getRegion(id);
  if (!region) notFound();

  const query = regionSearchQuery(region);
  const datasets = await getDatasets({ q: query, limit: 12 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{region.id} · {region.name} Province</p>
        <h1>{region.name}</h1>
        <p className="text-muted">
          Capital: {region.capital}
          {region.population_approx && ` · ~${region.population_approx} population`}
        </p>
      </section>

      <h2 className="section-title">Districts</h2>
      <div className="filter-row">
        {region.districts.map((d) => (
          <span key={d} className="badge badge-active">
            {d}
          </span>
        ))}
      </div>

      <h2 className="section-title">Regional datasets</h2>
      <div className="dataset-list">
        {datasets.datasets.length === 0 && (
          <p className="text-muted">No keyword matches — browse all datasets.</p>
        )}
        {datasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
            <span className="badge">{ds.domain}</span>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Explore</h2>
      <div className="card-grid">
        <Link href={`/search?q=${encodeURIComponent(region.capital)}`} className="card">
          <h3>Search {region.capital}</h3>
          <p className="card-desc">Keyword search for regional news and data</p>
        </Link>
        <Link href="/elections" className="card">
          <h3>Elections</h3>
          <p className="card-desc">Provincial and national election data</p>
        </Link>
        <Link href="/alerts" className="card">
          <h3>Disaster alerts</h3>
          <p className="card-desc">Floods, landslides, weather warnings</p>
        </Link>
        <Link href="/apps/lk_admin_regions" className="card">
          <h3>Regional explorer</h3>
          <p className="card-desc">Interactive map for {region.name}</p>
        </Link>
      </div>

      <p className="mt-2 text-muted">
        <Link href="/map">← All provinces</Link>
      </p>
    </div>
  );
}
