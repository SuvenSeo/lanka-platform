import Link from "next/link";

const ENDPOINTS = [
  { method: "GET", path: "/api/v1/stats", desc: "Platform statistics" },
  { method: "GET", path: "/api/v1/datasets", desc: "Browse catalog (domain, q, region filters)" },
  { method: "GET", path: "/api/v1/search?q=", desc: "Keyword search" },
  { method: "GET", path: "/api/v1/analytics/news/timeline", desc: "News feed from lk_news" },
  { method: "GET", path: "/api/v1/cabinet/search?q=", desc: "Cabinet decision search" },
  { method: "GET", path: "/api/v1/federation/datagov?q=", desc: "data.gov.lk CKAN search" },
  { method: "GET", path: "/api/v1/federation/ldflk", desc: "LDFLK ministry datasets" },
  { method: "GET", path: "/api/v1/rag/corpora", desc: "Available RAG corpora" },
  { method: "POST", path: "/api/v1/rag/query", desc: "Multi-corpus document search" },
  { method: "POST", path: "/api/v1/rag/legal", desc: "Legal research routing" },
  { method: "GET", path: "/api/v1/health", desc: "Health check" },
];

export default function DevelopersPage() {
  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">සංවර්ධකයින් · உருவாக்குனர்கள் · Developers</p>
        <h1>API & SDK</h1>
        <p className="text-muted">
          Vercel-native REST API — no external backend required. Use from any language via HTTP.
        </p>
      </section>

      <h2 className="section-title">TypeScript SDK</h2>
      <pre className="code-block">{`import { createLankaClient } from "@lanka/sdk";

const lanka = createLankaClient("https://lanka-platform-sand.vercel.app");
const stats = await lanka.stats();
const news = await lanka.newsTimeline(20);
const rag = await lanka.ragQuery("minimum wage labour law");`}</pre>

      <h2 className="section-title">Endpoints</h2>
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
        <a href="https://github.com/SuvenSeo/lanka-platform" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        {" · "}
        <a href="https://arxiv.org/abs/2510.04124" target="_blank" rel="noopener noreferrer">
          Cite arXiv:2510.04124
        </a>
      </p>
    </div>
  );
}
