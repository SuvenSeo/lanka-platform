import Link from "next/link";
import { getElections } from "@/lib/api";
import { fetchLiveDataset } from "@/lib/services/live-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ElectionsPage() {
  const data = await getElections().catch(() => null);
  const datasets =
    (data?.datasets as Array<{ id: string; name: string; description: string }>) ?? [];

  let live = null;
  try {
    live = await fetchLiveDataset("elections_lk", { limit: 80 });
  } catch {
    /* fallback to catalog only */
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.elections}</p>
        <h1>Elections Explorer</h1>
        <p className="text-muted">{String(data?.description ?? "Election data 1947–2025")}</p>
        {live && <SyncBadge syncedAt={live.synced_at} source="elections_lk pipeline" />}
      </section>

      <Link href="/apps/elections_lk" className="btn" style={{ display: "inline-block", marginBottom: "1rem" }}>
        Full elections dataset →
      </Link>

      {live?.rows && live.rows.length > 0 && (
        <>
          <h2 className="section-title">Recent election records</h2>
          <LiveDataTable header={live.header} rows={live.rows} maxRows={40} />
        </>
      )}

      {live?.data != null && (
        <div className="card mt-2">
          <h3>Election summary</h3>
          <pre className="code-block">{JSON.stringify(live.data, null, 2).slice(0, 6000)}</pre>
        </div>
      )}

      <h2 className="section-title">Election datasets</h2>
      <div className="dataset-list">
        {datasets.map((ds) => (
          <Link key={ds.id} href={`/apps/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
