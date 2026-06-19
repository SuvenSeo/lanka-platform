import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatagovPackage, fetchDatagovResource } from "@/lib/services/datagov-detail";
import { LiveDataTable } from "@/components/LiveDataTable";
import { SyncBadge } from "@/components/SyncBadge";

export const dynamic = "force-dynamic";

export default async function GovernmentDatasetPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  let pkg;
  try {
    pkg = await getDatagovPackage(decodeURIComponent(name));
  } catch {
    notFound();
  }

  const resource = pkg.resources?.find((r) =>
    ["JSON", "CSV", "XLS", "XLSX"].includes((r.format ?? "").toUpperCase()),
  );

  let preview: { format: string; header?: string[]; rows?: Record<string, string>[]; data?: unknown; text?: string } | null = null;
  if (resource?.url) {
    try {
      preview = await fetchDatagovResource(resource.url, resource.format);
    } catch {
      /* preview unavailable */
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">රජයේ දත්ත · அரசுத் தரவு · Government dataset</p>
        <h1>{pkg.title}</h1>
        <p className="text-muted">{(pkg.notes ?? "").replace(/<[^>]+>/g, "").slice(0, 500)}</p>
        <SyncBadge source={`data.gov.lk · ${pkg.organization?.title ?? "Government"}`} />
      </section>

      {resource && (
        <div className="card mb-2">
          <h3>Resource: {resource.name ?? resource.format}</h3>
          <p className="card-desc">Format: {resource.format}</p>
        </div>
      )}

      {preview?.format === "csv" && preview.rows && (
        <LiveDataTable header={preview.header} rows={preview.rows} />
      )}

      {preview?.format === "json" && (
        <pre className="code-block">{JSON.stringify(preview.data, null, 2).slice(0, 12_000)}</pre>
      )}

      {preview?.format === "text" && <pre className="doc-body">{preview.text}</pre>}

      {!preview && (
        <p className="text-muted">No previewable resource for this dataset yet.</p>
      )}

      <p className="mt-2">
        <Link href="/government">← Government search</Link>
      </p>
    </div>
  );
}
