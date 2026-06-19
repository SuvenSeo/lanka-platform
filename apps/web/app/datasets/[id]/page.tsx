import Link from "next/link";
import { notFound } from "next/navigation";
import { getDataset, getDatasetPreview } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [ds, preview] = await Promise.all([
    getDataset(id).catch(() => null),
    getDatasetPreview(id).catch(() => null),
  ]);
  if (!ds) notFound();

  const github = `https://github.com/${ds.source_repo}`;
  const readme = preview?.readme_excerpt as string | undefined;
  const sample = preview?.live_sample as {
    format?: string;
    source_url?: string;
    rows?: Record<string, string>[];
    header?: string[];
  } | undefined;

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual text-muted">{ds.domain}</p>
        <h1>{ds.name}</h1>
        <p>{ds.description || "No description available."}</p>
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
        {ds.github_stars != null && (
          <div className="stat-card">
            <strong>{ds.github_stars}</strong>
            <span className="text-muted">GitHub stars</span>
          </div>
        )}
      </div>

      {sample?.rows && sample.rows.length > 0 && (
        <div className="card mt-2">
          <h3>Live data sample</h3>
          <p className="card-desc text-muted" style={{ fontSize: "0.75rem" }}>
            {sample.source_url}
          </p>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", fontSize: "0.8rem", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {(sample.header ?? Object.keys(sample.rows[0])).slice(0, 5).map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "0.35rem",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sample.rows.slice(0, 8).map((row, i) => (
                  <tr key={i}>
                    {(sample.header ?? Object.keys(row)).slice(0, 5).map((h) => (
                      <td
                        key={h}
                        style={{
                          padding: "0.35rem",
                          borderBottom: "1px solid var(--border)",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {String(row[h] ?? "").slice(0, 120)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {readme && (
        <div className="card mt-2">
          <h3>README</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginTop: "0.5rem",
            }}
          >
            {readme}
          </pre>
        </div>
      )}

      <div className="card mt-2">
        <h3>Links</h3>
        <p className="card-desc mt-2">
          <a href={github} target="_blank" rel="noopener noreferrer">
            GitHub → {ds.source_repo}
          </a>
        </p>
        {ds.live_app_url && (
          <p className="card-desc">
            <a href={ds.live_app_url} target="_blank" rel="noopener noreferrer">
              Live app →
            </a>
          </p>
        )}
        {ds.huggingface_id && (
          <p className="card-desc">
            <a
              href={`https://huggingface.co/datasets/${ds.huggingface_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              HuggingFace → {ds.huggingface_id}
            </a>
          </p>
        )}
      </div>

      <p className="mt-2">
        <Link href="/datasets">← All datasets</Link>
        {" · "}
        <Link href={`/search?q=${encodeURIComponent(ds.id)}`}>Search related</Link>
        {" · "}
        <Link href="/legal">Legal research</Link>
      </p>
    </div>
  );
}
