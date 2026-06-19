import Link from "next/link";
import { getDataset, getDatasets } from "@/lib/catalog";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";

const ALERT_DATASETS = [
  "alert",
  "lk_dmc_vis",
  "lk_dmc",
  "alert_data",
  "environment_lk",
] as const;

export default async function AlertsPage() {
  const env = getDatasets({ domain: "environment", limit: 12 });
  const alertDs = ALERT_DATASETS.map((id) => getDataset(id)).filter(
    (ds): ds is NonNullable<typeof ds> => Boolean(ds),
  );

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">අනතුරු ඇඟවීම් · எச்சரிக்கைகள் · Disaster Alerts</p>
        <h1>Disaster & Weather Alerts</h1>
        <p className="text-muted">
          Environment and disaster datasets — DMC bulletins, flood visualizations, and civic alert
          tools indexed in-platform.
        </p>
        <SyncBadge source="environment · disaster corpora" />
      </section>

      <div className="card-grid mb-2">
        <Link href="/apps/alert" className="card">
          <h3>Alert.lk corpus</h3>
          <p className="card-desc">Community disaster alert dataset</p>
        </Link>
        <Link href="/apps/lk_dmc_vis" className="card">
          <h3>DMC flood data</h3>
          <p className="card-desc">Disaster Management Centre visualizations</p>
        </Link>
        <Link href="/environment" className="card">
          <h3>Environment hub</h3>
          <p className="card-desc">All environment datasets</p>
        </Link>
      </div>

      <div className="card mt-2">
        <p className="card-desc">
          Real-time alert feeds depend on upstream pipeline cadence. Browse dataset explorers below
          for the latest synced files, or use{" "}
          <Link href="/news">News</Link> and <Link href="/cabinet">Cabinet</Link> for related
          government bulletins.
        </p>
      </div>

      {alertDs.length > 0 && (
        <>
          <h2 className="section-title">Alert datasets</h2>
          <div className="dataset-list">
            {alertDs.map((ds) => (
              <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
                <h3>{ds.name}</h3>
                <p className="card-desc">{ds.description || ds.id}</p>
                <span className="badge">{ds.status}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <h2 className="section-title">Environment datasets</h2>
      <div className="dataset-list">
        {env.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description || ds.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
