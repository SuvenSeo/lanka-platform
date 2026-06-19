import Link from "next/link";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/stats", desc: "Platform statistics" },
  { method: "GET", path: "/api/v1/datasets", desc: "Browse catalog" },
  { method: "GET", path: "/api/v1/live/{datasetId}", desc: "Live synced dataset (TSV/JSON)" },
  { method: "GET", path: "/api/v1/search?q=", desc: "Meilisearch or keyword fallback" },
  { method: "GET", path: "/api/v1/sync/status", desc: "Last cron sync (Vercel Blob)" },
  { method: "GET", path: "/api/v1/analytics/news/timeline", desc: "News feed" },
  { method: "GET", path: "/api/v1/cabinet/search?q=", desc: "Cabinet search" },
  { method: "GET", path: "/api/v1/federation/datagov?q=", desc: "data.gov.lk CKAN" },
  { method: "GET", path: "/api/v1/federation/ldflk", desc: "LDFLK index (175+ datasets)" },
  { method: "GET", path: "/api/v1/federation/ldflk/data?year=&name=", desc: "LDFLK JSON payload" },
  { method: "GET", path: "/api/v1/geo/topojson/{layer}", desc: "Proxied provinces/districts geo" },
  { method: "POST", path: "/api/v1/rag/query", desc: "Multi-corpus RAG (+ synthesize)" },
  { method: "POST", path: "/api/v1/agent/catalog", desc: "Cursor SDK catalog agent (admin)" },
  { method: "GET", path: "/api/cron/sync", desc: "Warm sync cache (cron)" },
];

export default function DevelopersPage() {
  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">සංවර්ධකයින් · உருவாக்குனர்கள் · Developers</p>
        <h1>API, SDK & Agents</h1>
        <p className="text-muted">
          All data is served in-platform via REST. Optional Cursor SDK automates catalog quality.
        </p>
      </section>

      <h2 className="section-title">Lanka TypeScript SDK</h2>
      <pre className="code-block">{`import { createLankaClient } from "@lanka/sdk";

const lanka = createLankaClient("https://lanka-platform-sand.vercel.app");
const stats = await lanka.stats();
const live = await fetch("/api/v1/live/fuel_lk").then(r => r.json());
const rag = await lanka.ragQuery("minimum wage labour law");`}</pre>

      <h2 className="section-title">Cursor SDK (catalog automation)</h2>
      <p className="text-muted mb-2">
        Use <code>@cursor/sdk</code> to run agents that review catalog sync, enrich descriptions, and
        report data gaps. Package: <code>packages/catalog-agent</code>
      </p>
      <pre className="code-block">{`# Get API key: https://cursor.com/dashboard/integrations
export CURSOR_API_KEY="cursor_..."

# After catalog sync — agent reviews 379 datasets
npm run catalog:agent

# Enrich empty descriptions
npm run enrich --workspace=@lanka/catalog-agent

# HTTP trigger (set ADMIN_SECRET + CURSOR_API_KEY on Vercel)
curl -X POST /api/v1/agent/catalog \\
  -H "Authorization: Bearer $ADMIN_SECRET" \\
  -d '{"task":"Audit priority sync manifest"}'`}</pre>

      <h2 className="section-title">Optional environment variables</h2>
      <pre className="code-block">{`CRON_SECRET              # Protect /api/cron/sync
BLOB_READ_WRITE_TOKEN    # Persistent sync cache across cold starts
MEILISEARCH_URL          # Meilisearch Cloud host
MEILISEARCH_API_KEY      # Meilisearch admin key
OPENAI_API_KEY           # LLM synthesis (legal + RAG)
OPENAI_MODEL             # Default: gpt-4o-mini
CURSOR_API_KEY           # Catalog agent automation
ADMIN_SECRET             # POST /api/v1/agent/catalog`}</pre>

      <h2 className="section-title">REST endpoints</h2>
      <div className="dataset-list">
        {ENDPOINTS.map((ep) => (
          <article key={ep.path} className="card">
            <h3>
              <span className="badge badge-maroon">{ep.method}</span> {ep.path}
            </h3>
            <p className="card-desc">{ep.desc}</p>
          </article>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/api/openapi.json">OpenAPI spec</Link>
        {" · "}
        <Link href="/datasets">Dataset catalog</Link>
      </p>
    </div>
  );
}
