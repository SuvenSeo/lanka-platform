import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchLdflkDataset } from "@/lib/services/ldflk-sync";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";

export default async function LdflkDatasetViewPage({
  params,
}: {
  params: Promise<{ year: string; title: string }>;
}) {
  const { year, title } = await params;
  let payload;
  try {
    payload = await fetchLdflkDataset(year, title);
  } catch {
    notFound();
  }

  const rows = Array.isArray(payload.data)
    ? (payload.data as Record<string, string>[])
    : null;

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">LDFLK · {year}</p>
        <h1>{payload.title}</h1>
        <SyncBadge syncedAt={payload.synced_at} source="LDFLK/datasets" />
      </section>

      {rows && rows.length > 0 && typeof rows[0] === "object" && (
        <LiveDataTable rows={rows} maxRows={100} maxCols={8} />
      )}

      {!rows && (
        <pre className="code-block">{JSON.stringify(payload.data, null, 2).slice(0, 20_000)}</pre>
      )}

      {payload.metadata != null && (
        <div className="card mt-2">
          <h3>Metadata</h3>
          <pre className="doc-body">{JSON.stringify(payload.metadata, null, 2)}</pre>
        </div>
      )}

      <p className="mt-2">
        <Link href="/government">← Government search</Link>
      </p>
    </div>
  );
}
