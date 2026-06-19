import Link from "next/link";
import { getElectionsOverview } from "@/lib/services/platform";
import { fetchElectionHighlights } from "@/lib/services/elections-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ElectionsPage() {
  const data = getElectionsOverview();
  const highlights = await fetchElectionHighlights().catch(() => null);

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.elections}</p>
        <h1>Elections Explorer</h1>
        <p className="text-muted">{data.description}</p>
        {highlights && (
          <SyncBadge syncedAt={highlights.synced_at} source={highlights.source} />
        )}
      </section>

      <div className="card-grid mb-2">
        <Link href="/apps/elections_lk" className="card">
          <h3>Elections Lk</h3>
          <p className="card-desc">Full catalog entry · interactive app</p>
        </Link>
        <Link href="/datasets?domain=elections" className="card">
          <h3>All election datasets</h3>
          <p className="card-desc">{data.datasets.length} repos in catalog</p>
        </Link>
      </div>

      {highlights && highlights.rows.length > 0 && (
        <>
          <h2 className="section-title">Recent results (top parties by district)</h2>
          <LiveDataTable header={highlights.header} rows={highlights.rows} maxRows={40} />
        </>
      )}

      <h2 className="section-title">Election datasets</h2>
      <div className="dataset-list">
        {data.datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description || ds.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
