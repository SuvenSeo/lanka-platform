import Link from "next/link";
import { fetchLiveDataset } from "@/lib/services/live-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";
import { getDatasets } from "@/lib/api";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function FuelPage() {
  const fuelDatasets = await getDatasets({ q: "fuel", limit: 12 }).catch(() => ({
    datasets: [],
    total: 0,
    count: 0,
  }));

  let live = null;
  try {
    live = await fetchLiveDataset("fuel_lk", { limit: 100 });
  } catch {
    /* no live file */
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ඉන්ධන · எரிபொருள் · Fuel Prices</p>
        <h1>Fuel & Energy Dashboard</h1>
        <p className="text-muted">Live fuel price data synced from nuuuwan/fuel_lk — no external apps.</p>
        {live && <SyncBadge syncedAt={live.synced_at} source="fuel_lk pipeline" />}
      </section>

      {live?.rows && live.rows.length > 0 && (
        <>
          <h2 className="section-title">Latest fuel prices</h2>
          <LiveDataTable header={live.header} rows={live.rows} maxRows={50} />
        </>
      )}

      {live?.text && !live.rows?.length && (
        <div className="card mt-2">
          <h3>Pipeline log</h3>
          <pre className="code-block doc-body">{live.text.slice(0, 12000)}</pre>
        </div>
      )}

      {live?.data != null && (
        <div className="card mt-2">
          <h3>Price summary</h3>
          <pre className="code-block">{JSON.stringify(live.data, null, 2).slice(0, 8000)}</pre>
        </div>
      )}

      {!live && <p className="text-muted">Syncing fuel data — check back shortly.</p>}

      <h2 className="section-title">Related datasets</h2>
      <div className="dataset-list">
        {fuelDatasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
