import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/api";
import { fetchLiveDataset } from "@/lib/services/live-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ds = await getDataset(id).catch(() => null);
  if (!ds) notFound();

  let live = null;
  try {
    live = await fetchLiveDataset(id, { limit: 50 });
  } catch {
    /* preview optional */
  }

  const provenance = (ds as { provenance?: Record<string, unknown> }).provenance;

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">{ds.domain}</p>
        <h1>{ds.name}</h1>
        <p>{ds.description || "No description available."}</p>
        {live && <SyncBadge syncedAt={live.synced_at} source={ds.source_repo} />}
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <strong>{ds.status}</strong>
          <span className="text-muted">status</span>
        </div>
        {ds.doc_count != null && (
          <div className="stat-card">
            <strong>{ds.doc_count.toLocaleString()}</strong>
            <span className="text-muted">documents</span>
          </div>
        )}
        {ds.size_gb != null && (
          <div className="stat-card">
            <strong>{ds.size_gb} GB</strong>
            <span className="text-muted">data size</span>
          </div>
        )}
      </div>

      <Link href={`/apps/${id}`} className="btn" style={{ display: "inline-block", margin: "1rem 0" }}>
        Open live data explorer →
      </Link>

      {live?.rows && live.rows.length > 0 && (
        <>
          <h2 className="section-title">Live data ({live.row_count} rows)</h2>
          <LiveDataTable header={live.header} rows={live.rows} maxRows={25} />
        </>
      )}

      {live?.text && (
        <div className="card mt-2">
          <h3>README</h3>
          <pre className="doc-body">{live.text.slice(0, 4000)}</pre>
        </div>
      )}

      {provenance && (
        <div className="card mt-2">
          <h3>Provenance</h3>
          <p className="card-desc">Source: {ds.source_repo}</p>
          <p className="card-desc">Citation: arXiv:2510.04124</p>
        </div>
      )}

      <p className="mt-2">
        <Link href="/datasets">← All datasets</Link>
        {" · "}
        <Link href={`/search?q=${encodeURIComponent(ds.id)}`}>Search related</Link>
      </p>
    </div>
  );
}
