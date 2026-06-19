import Link from "next/link";
import { getDatasets } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function FuelPage() {
  const fuel = await getDatasets({ q: "fuel", limit: 12 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ඉන්ධන · எரிபொருள் · Fuel Prices</p>
        <h1>Fuel & Energy Dashboard</h1>
        <p className="text-muted">
          Track fuel prices and energy data from nuuuwan pipelines and civic apps.
        </p>
      </section>

      <div className="card-grid mb-2">
        <a
          href="https://nuuuwan.github.io/fuel_lk_app/"
          target="_blank"
          rel="noopener noreferrer"
          className="card"
        >
          <h3>Fuel LK App</h3>
          <p className="card-desc">Live fuel price tracker — petrol, diesel, kerosene.</p>
        </a>
        <Link href="/datasets?domain=economic" className="card">
          <h3>Economic datasets</h3>
          <p className="card-desc">CBSL, treasury, and price index data.</p>
        </Link>
      </div>

      <h2 className="section-title">Related datasets</h2>
      <div className="dataset-list">
        {fuel.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
