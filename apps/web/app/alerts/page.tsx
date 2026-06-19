import Link from "next/link";
import { getDatasets } from "@/lib/api";
import { fetchLiveDataset } from "@/lib/services/live-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function AlertsPage() {
  const env = await getDatasets({ domain: "environment", limit: 12 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  let alerts = null;
  let dmc = null;
  try {
    alerts = await fetchLiveDataset("alert_data", { limit: 50 });
  } catch {
    /* optional */
  }
  try {
    dmc = await fetchLiveDataset("lk_dmc", { limit: 50 });
  } catch {
    /* optional */
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">අනතුරු ඇඟවීම් · எச்சரிக்கைகள் · Disaster Alerts</p>
        <h1>Disaster & Weather Alerts</h1>
        <p className="text-muted">
          Live environment and disaster data synced in-platform from nuuuwan pipelines.
        </p>
        {(alerts || dmc) && (
          <SyncBadge
            syncedAt={alerts?.synced_at ?? dmc?.synced_at}
            source="alert_data · lk_dmc"
          />
        )}
      </section>

      <div className="card-grid mb-2">
        <Link href="/apps/alert" className="card">
          <h3>Alert dataset</h3>
          <p className="card-desc">Full alert corpus explorer</p>
        </Link>
        <Link href="/apps/lk_dmc_vis" className="card">
          <h3>DMC flood data</h3>
          <p className="card-desc">Disaster Management Centre bulletins</p>
        </Link>
        <Link href="/environment" className="card">
          <h3>Environment hub</h3>
          <p className="card-desc">All environment datasets</p>
        </Link>
      </div>

      {alerts?.rows && alerts.rows.length > 0 && (
        <>
          <h2 className="section-title">Recent alerts</h2>
          <LiveDataTable header={alerts.header} rows={alerts.rows} maxRows={30} />
        </>
      )}

      {dmc?.rows && dmc.rows.length > 0 && (
        <>
          <h2 className="section-title">DMC bulletins</h2>
          <LiveDataTable header={dmc.header} rows={dmc.rows} maxRows={30} />
        </>
      )}

      <h2 className="section-title">Environment datasets</h2>
      <div className="dataset-list">
        {env.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
