"use client";

import { useState } from "react";
import Link from "next/link";
import { TRILINGUAL } from "@/lib/i18n";

type GovResult = {
  title: string;
  description: string;
  internal_url?: string;
  name?: string;
  organization?: string;
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
      setGovResults(
        (gov.results ?? []).map((r: Record<string, string>) => ({
          title: r.title,
          description: r.description,
          internal_url: r.internal_url ?? `/government/dataset/${r.name}`,
          name: r.name,
          organization: r.organization,
        })),
      );
      setLdflkResults(
        (ldf.results ?? []).map((d: Record<string, string>) => ({
          title: d.title,
          description: `${d.ministry ?? "LDFLK"} · ${d.year ?? ""}`,
          internal_url: d.internal_url ?? `/government/ldflk/${d.year}/${encodeURIComponent(d.title)}`,
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
          Official and community data — searched and previewed inside Lanka Platform.
        </p>
      </section>

      <div className="dataset-list mb-2">
        {sources.map((src) => (
          <div key={String(src.id)} className="card">
            <h3>{String(src.name)}</h3>
            <p className="card-desc">{String(src.description)}</p>
            <span className="badge badge-maroon">{String(src.type)}</span>
            {src.api != null && (
              <span className="badge">{String(src.api)}</span>
            )}
          </div>
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
              <Link key={r.internal_url} href={r.internal_url!} className="card">
                <h3>{r.title}</h3>
                <p className="card-desc">{r.description}</p>
                {r.organization && <span className="badge">{r.organization}</span>}
                <span className="badge badge-active">View in-platform</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {ldflkResults.length > 0 && (
        <>
          <h2 className="section-title">LDFLK results</h2>
          <div className="dataset-list">
            {ldflkResults.map((r) => (
              <Link key={r.title} href={r.internal_url!} className="card">
                <h3>{r.title}</h3>
                <p className="card-desc">{r.description}</p>
                {r.organization && <span className="badge">{r.organization}</span>}
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="mt-2 text-muted">
        <Link href="/rti">RTI resource hub</Link>
      </p>
    </div>
  );
}
