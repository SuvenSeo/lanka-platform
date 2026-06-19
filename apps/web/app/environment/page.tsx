import Link from "next/link";
import { getDatasets } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function EnvironmentPage() {
  const datasets = await getDatasets({ domain: "environment", limit: 24 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.environment}</p>
        <h1>Environment & Disasters</h1>
        <p className="text-muted">Flood warnings, weather, DMC bulletins — all in-platform.</p>
      </section>

      <h2 className="section-title">Live tools</h2>
      <div className="card-grid mb-2">
        <Link href="/alerts" className="card">
          <h3>Disaster alerts</h3>
          <p className="card-desc">Synced alert_data & DMC feeds</p>
        </Link>
        <Link href="/apps/lk_dmc_vis" className="card">
          <h3>DMC flood data</h3>
          <p className="card-desc">Flood visualisation dataset</p>
        </Link>
        <Link href="/apps/alert" className="card">
          <h3>Alert corpus</h3>
          <p className="card-desc">Full alert.lk indexed data</p>
        </Link>
      </div>

      <h2 className="section-title">Environment datasets</h2>
      <div className="dataset-list">
        {datasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
            <span className="badge badge-active">{ds.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
