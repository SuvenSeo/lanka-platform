import Link from "next/link";
import { getDatasets } from "@/lib/catalog";
import { fetchFuelDashboard } from "@/lib/services/fuel";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function FuelPage() {
  const fuelDatasets = getDatasets({ q: "fuel", limit: 12 });
  const fuel = await fetchFuelDashboard(30).catch(() => null);

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ඉන්ධන · எரிபொருள் · Fuel Prices</p>
        <h1>Fuel & Energy Dashboard</h1>
        <p className="text-muted">
          {fuel?.total_sheds.toLocaleString() ?? "1,300+"} fuel sheds from nuuuwan/fuel_lk — sampled
          live status in-platform.
        </p>
        {fuel && <SyncBadge syncedAt={fuel.synced_at} source={fuel.source} />}
      </section>

      {fuel && (
        <>
          <p className="text-muted mb-2">{fuel.data_note}</p>
          <h2 className="section-title">
            Shed status sample ({fuel.sampled} of {fuel.total_sheds})
          </h2>
          <LiveDataTable header={fuel.header} rows={fuel.rows} maxRows={30} />
        </>
      )}

      {!fuel && <p className="text-muted">Fuel data temporarily unavailable.</p>}

      <h2 className="section-title">Related datasets</h2>
      <div className="dataset-list">
        {fuelDatasets.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description || ds.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
