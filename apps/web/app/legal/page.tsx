"use client";

import { useState } from "react";
import Link from "next/link";
import { TRILINGUAL } from "@/lib/i18n";

export default function LegalPage() {
  const [question, setQuestion] = useState("");
  const [deep, setDeep] = useState(true);
  const [synthesize, setSynthesize] = useState(false);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/rag/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, deep, synthesize }),
      });
      setResult(await res.json());
    } catch {
      setResult({ answer_summary: "Request failed. Try again." });
    } finally {
      setLoading(false);
    }
  }

  const matches =
    (result?.matched_datasets as Array<{
      dataset_id: string;
      name: string;
      description: string;
      github_url: string;
      doc_count?: number;
    }>) ?? [];

  const deepRag = result?.deep_rag as {
    answer?: string;
    synthesis?: {
      answer: string;
      citations: Array<{ index: number; title: string; source_url?: string; corpus: string }>;
      model: string;
    };
    chunks?: Array<{ snippet?: string; act_description?: string; act_source_url?: string }>;
  } | undefined;

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.legal}</p>
        <h1>Legal Research</h1>
        <p className="text-muted">
          Route questions to legal corpora — acts, gazettes, courts, Hansard.
        </p>
      </section>

      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="search"
          placeholder="e.g. minimum wage, labour law, land acquisition..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)" }}>
          <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} />
          Deep search
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)" }}>
          <input
            type="checkbox"
            checked={synthesize}
            onChange={(e) => setSynthesize(e.target.checked)}
            disabled={!deep}
          />
          AI synthesis with citations
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching…" : "Ask"}
        </button>
      </form>

      {result?.answer_summary != null && (
        <div className="card mt-2">
          <p>{String(result.answer_summary)}</p>
        </div>
      )}

      {deepRag?.synthesis && (
        <div className="card mt-2">
          <h3>AI synthesis</h3>
          <p className="card-desc">{deepRag.synthesis.answer}</p>
          <p className="text-muted" style={{ fontSize: "0.75rem" }}>
            Model: {deepRag.synthesis.model}
          </p>
          {deepRag.synthesis.citations.length > 0 && (
            <ul className="citation-list">
              {deepRag.synthesis.citations.map((c) => (
                <li key={c.index}>
                  [{c.index}] {c.title}
                  {c.source_url && (
                    <>
                      {" — "}
                      <a href={c.source_url} target="_blank" rel="noopener noreferrer">
                        source
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {deepRag?.answer && !deepRag?.synthesis && (
        <div className="card mt-2">
          <h3>Deep RAG</h3>
          <p className="card-desc">{deepRag.answer}</p>
        </div>
      )}

      {deepRag?.chunks && deepRag.chunks.length > 0 && (
        <>
          <h2 className="section-title">Matching sections</h2>
          <div className="dataset-list">
            {deepRag.chunks.map((c, i) => (
              <article key={i} className="card">
                <h3>{c.act_description}</h3>
                <p className="card-desc">{c.snippet}</p>
              </article>
            ))}
          </div>
        </>
      )}

      {matches.length > 0 && (
        <>
          <h2 className="section-title">Matched datasets</h2>
          <div className="dataset-list">
            {matches.map((m) => (
              <Link key={m.dataset_id} href={`/datasets/${m.dataset_id}`} className="card">
                <h3>{m.name}</h3>
                <p className="card-desc">{m.description}</p>
                {m.doc_count != null && (
                  <span className="badge">{m.doc_count.toLocaleString()} docs</span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
