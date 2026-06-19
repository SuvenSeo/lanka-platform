import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset } from "@/lib/catalog";
import { fetchLiveDataset } from "@/lib/services/live-data";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NATIVE_APP_IDS: Record<string, { title: string; route?: string }> = {
  alert: { title: "Disaster Alerts", route: "/alerts" },
  elections_lk: { title: "Elections Explorer", route: "/elections" },
  lk_admin_regions: { title: "Island Map", route: "/map" },
  fuel_lk_app: { title: "Fuel Prices", route: "/fuel" },
  fuel_lk: { title: "Fuel Data", route: "/fuel" },
  lk_dmc_vis: { title: "Flood & DMC Data", route: "/environment" },
};

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ds = getDataset(id);
  if (!ds) notFound();

  const native = NATIVE_APP_IDS[id];
  let live = null;
  try {
    live = await fetchLiveDataset(id, { limit: 100 });
  } catch {
    /* no live file */
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">{ds.domain}</p>
        <h1>{native?.title ?? ds.name}</h1>
        <p className="text-muted">{ds.description || "Live data served in-platform from nuuuwan pipelines."}</p>
        {live && <SyncBadge syncedAt={live.synced_at} source={live.source_path} />}
      </section>

      {native?.route && (
        <Link href={native.route} className="btn" style={{ display: "inline-block", marginBottom: "1rem" }}>
          Open {native.title} dashboard →
        </Link>
      )}

      {live?.rows && live.rows.length > 0 && (
        <>
          <h2 className="section-title">Live data ({live.row_count} rows)</h2>
          <LiveDataTable header={live.header} rows={live.rows} maxRows={50} />
        </>
      )}

      {live?.format === "json" && live.data != null && (
        <div className="card mt-2">
          <h3>Summary data</h3>
          <pre className="code-block">{JSON.stringify(live.data, null, 2).slice(0, 8000)}</pre>
        </div>
      )}

      {live?.text && (
        <div className="card mt-2">
          <h3>README</h3>
          <pre className="doc-body">{live.text.slice(0, 6000)}</pre>
        </div>
      )}

      {!live && (
        <p className="text-muted">
          Live file not found for this dataset yet. Browse the{" "}
          <Link href={`/datasets/${id}`}>dataset page</Link> for catalog metadata.
        </p>
      )}

      <p className="mt-2">
        <Link href="/apps">← All apps</Link>
        {" · "}
        <Link href={`/datasets/${id}`}>Dataset details</Link>
      </p>
    </div>
  );
}
