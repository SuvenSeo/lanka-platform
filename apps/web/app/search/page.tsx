"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dataset } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Dataset[]>([]);
  const [engine, setEngine] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setEngine(data.engine ?? "");
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
        <h1>Search</h1>
        <p className="text-muted">Search across all 379 catalogued Sri Lanka datasets.</p>
      </section>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="input"
          type="search"
          placeholder="Try: legal, flood, census, election, news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {searched && (
        <p className="text-muted mb-2">
          {results.length} results {engine && `(engine: ${engine})`}
        </p>
      )}

      <div className="dataset-list">
        {results.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
            <span className="badge">{ds.domain}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
