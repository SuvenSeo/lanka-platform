import Link from "next/link";
import { getDatasets, getLiveApps } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function TransportPage() {
  const [datasets, apps] = await Promise.all([
    getDatasets({ domain: "transport", limit: 16 }).catch(() => ({
      datasets: [],
      total: 0,
      count: 0,
    })),
    getLiveApps().catch(() => []),
  ]);

  const transportApps = apps.filter((a) => a.domain === "transport");

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ප්‍රවාහනය · போக்குவரத்து · Transport</p>
        <h1>Bus, Rail & Transport</h1>
        <p className="text-muted">Live transport data and datasets from the nuuuwan ecosystem.</p>
      </section>

      <div className="card-grid mb-2">
        {transportApps.map((app) => (
          <a key={app.url} href={app.url} target="_blank" rel="noopener noreferrer" className="card">
            <h3>{app.name}</h3>
            <p className="card-desc">{app.domain}</p>
          </a>
        ))}
        <Link href="/datasets?domain=transport" className="card">
          <h3>All transport datasets</h3>
          <p className="card-desc">Bus routes, railway, vehicle registrations.</p>
        </Link>
      </div>

      <h2 className="section-title">Transport datasets</h2>
      <div className="dataset-list">
        {datasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
