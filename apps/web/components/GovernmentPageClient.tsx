"use client";

import { useState } from "react";
import Link from "next/link";
import { TRILINGUAL } from "@/lib/i18n";

type GovResult = {
  title: string;
  description: string;
  url: string;
  organization?: string;
  license?: string;
};

export default function GovernmentPageClient({
  sources,
}: {
  sources: Array<Record<string, unknown>>;
}) {
  const [query, setQuery] = useState("");
  const [govResults, setGovResults] = useState<GovResult[]>([]);
  const [ldflkResults, setLdflkResults] = useState<GovResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const [gov, ldf] = await Promise.all([
        fetch(`/api/v1/federation/datagov?q=${encodeURIComponent(query)}`).then((r) => r.json()),
        fetch(`/api/v1/federation/ldflk?q=${encodeURIComponent(query)}`).then((r) => r.json()),
      ]);
      setGovResults(gov.results ?? []);
      setLdflkResults(
        (ldf.results ?? []).map((d: Record<string, string>) => ({
          title: d.title,
          description: d.description,
          url: d.url,
          organization: d.ministry,
        })),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.government}</p>
        <h1>Government & Federation</h1>
        <p className="text-muted">
          Official and community open data sources federated for Sri Lankans.
        </p>
      </section>

      <div className="dataset-list mb-2">
        {sources.map((src) => (
          <a
            key={String(src.id)}
            href={String(src.url)}
            target="_blank"
            rel="noopener noreferrer"
            className="card"
          >
            <h3>{String(src.name)}</h3>
            <p className="card-desc">{String(src.description)}</p>
            <span className="badge badge-maroon">{String(src.type)}</span>
            {src.api != null && (
              <span className="badge">{String(src.api)}</span>
            )}
          </a>
        ))}
      </div>

      <h2 className="section-title">Search government data</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="input"
          type="search"
          placeholder="e.g. health, transport, census..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {govResults.length > 0 && (
        <>
          <h2 className="section-title">data.gov.lk results</h2>
          <div className="dataset-list">
            {govResults.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="card">
                <h3>{r.title}</h3>
                <p className="card-desc">{r.description}</p>
                {r.organization && <span className="badge">{r.organization}</span>}
              </a>
            ))}
          </div>
        </>
      )}

      {ldflkResults.length > 0 && (
        <>
          <h2 className="section-title">LDFLK results</h2>
          <div className="dataset-list">
            {ldflkResults.map((r) => (
              <a key={r.title} href={r.url} target="_blank" rel="noopener noreferrer" className="card">
                <h3>{r.title}</h3>
                <p className="card-desc">{r.description}</p>
                {r.organization && <span className="badge">{r.organization}</span>}
              </a>
            ))}
          </div>
        </>
      )}

      <p className="mt-2 text-muted">
        <Link href="/rti">RTI resource hub</Link>
        {" · "}
        <a
          href="https://www.data.gov.lk/en/request-dataset"
          target="_blank"
          rel="noopener noreferrer"
        >
          Suggest a dataset
        </a>
      </p>
    </div>
  );
}
