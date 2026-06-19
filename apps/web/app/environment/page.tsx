import Link from "next/link";
import { getDatasets, getLiveApps } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const ENV_APPS = [
  { name: "Alert.lk", url: "https://alert.lk", desc: "Disaster alerts" },
  { name: "DMC Flood Map", url: "https://nuuuwan.github.io/lk_dmc_vis", desc: "Flood visualisation" },
];

export default async function EnvironmentPage() {
  const [datasets, apps] = await Promise.all([
    getDatasets({ domain: "environment", limit: 24 }).catch(() => ({
      datasets: [],
      total: 0,
      count: 0,
    })),
    getLiveApps().catch(() => []),
  ]);

  const envApps = apps.filter((a) => a.domain === "environment");

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.environment}</p>
        <h1>Environment & Disasters</h1>
        <p className="text-muted">Flood warnings, weather, DMC bulletins, and alert tools.</p>
      </section>

      <h2 className="section-title">Live tools</h2>
      <div className="card-grid mb-2">
        {[...ENV_APPS, ...envApps].map((app) => (
          <a key={app.url} href={app.url} target="_blank" rel="noopener noreferrer" className="card">
            <h3>{app.name}</h3>
            <p className="card-desc">{"desc" in app ? app.desc : app.domain}</p>
          </a>
        ))}
      </div>

      <h2 className="section-title">Environment datasets</h2>
      <div className="dataset-list">
        {datasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
            <span className="badge badge-active">{ds.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
