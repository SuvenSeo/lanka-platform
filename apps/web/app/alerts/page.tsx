import Link from "next/link";
import { getDatasets } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const ALERT_TOOLS = [
  {
    name: "Alert.lk",
    url: "https://alert.lk",
    desc: "Real-time disaster alerts — floods, landslides, dengue, weather.",
  },
  {
    name: "DMC Flood Map",
    url: "https://nuuuwan.github.io/lk_dmc_vis",
    desc: "Disaster Management Centre flood visualisation.",
  },
  {
    name: "Meteorology Department",
    url: "https://www.meteo.gov.lk",
    desc: "Official weather warnings and forecasts.",
  },
];

export default async function AlertsPage() {
  const env = await getDatasets({ domain: "environment", limit: 12 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">අනතුරු ඇඟවීම් · எச்சரிக்கைகள் · Citizen Alerts</p>
        <h1>Disaster & Weather Alerts</h1>
        <p className="text-muted">
          Live tools for floods, landslides, and weather — integrated with nuuuwan environment pipelines.
        </p>
      </section>

      <div className="map-embed">
        <iframe src="https://alert.lk" title="Alert.lk" loading="lazy" />
      </div>

      <h2 className="section-title">Alert tools</h2>
      <div className="card-grid mb-2">
        {ALERT_TOOLS.map((t) => (
          <a key={t.url} href={t.url} target="_blank" rel="noopener noreferrer" className="card">
            <h3>{t.name}</h3>
            <p className="card-desc">{t.desc}</p>
          </a>
        ))}
      </div>

      <h2 className="section-title">Environment datasets</h2>
      <div className="dataset-list">
        {env.datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/environment">{TRILINGUAL.environment}</Link>
      </p>
    </div>
  );
}
