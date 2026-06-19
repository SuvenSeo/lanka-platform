import Link from "next/link";
import { getDatasets } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function TransportPage() {
  const datasets = getDatasets({ domain: "transport", limit: 16 });

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ප්‍රවාහනය · போக்குவரத்து · Transport</p>
        <h1>Bus, Rail & Transport</h1>
        <p className="text-muted">Transport datasets browsable in-platform with live sync.</p>
      </section>

      <div className="card-grid mb-2">
        <Link href="/apps/bus_routes_lk" className="card">
          <h3>Bus routes</h3>
          <p className="card-desc">Sri Lanka bus route statistics</p>
        </Link>
        <Link href="/datasets?domain=transport" className="card">
          <h3>All transport data</h3>
          <p className="card-desc">Browse full transport catalog</p>
        </Link>
      </div>

      <h2 className="section-title">Transport datasets</h2>
      <div className="dataset-list">
        {datasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
