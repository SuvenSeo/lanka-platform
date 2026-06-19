"use client";

import { useState } from "react";
import Link from "next/link";
import { TRILINGUAL } from "@/lib/i18n";

type Decision = {
  doc_id: string;
  date: string;
  description: string;
  body_snippet?: string;
  lang?: string;
  url?: string;
};

export default function CabinetPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/cabinet/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.cabinet}</p>
        <h1>Cabinet Tracker</h1>
        <p className="text-muted">
          Search 1,000+ recent cabinet decisions from nuuuwan/lk_cabinet_decisions.
        </p>
      </section>

      <h2 className="section-title">Search decisions</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="search"
          placeholder="e.g. fuel, education, tax, appointment..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {searched && (
        <p className="text-muted mb-2">
          {results.length} decision{results.length !== 1 ? "s" : ""} found
        </p>
      )}

      <div className="dataset-list">
        {results.map((d) => (
          <article key={d.doc_id} className="card">
            <h3>{d.description}</h3>
            {d.body_snippet && <p className="card-desc">{d.body_snippet}</p>}
            <p className="card-meta">
              {d.date && <span className="badge">{d.date}</span>}
              {d.lang && <span className="badge">{d.lang}</span>}
              {d.url && (
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="badge">
                  Official source
                </a>
              )}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/datasets/lk_cabinet_decisions">Cabinet dataset</Link>
        {" · "}
        <Link href="/legal">Legal research</Link>
      </p>
    </div>
  );
}
