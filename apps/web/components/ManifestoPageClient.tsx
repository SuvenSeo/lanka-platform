"use client";

import { useState } from "react";
import Link from "next/link";

type Theme = {
  id: string;
  title: string;
  keywords: string[];
};

type Decision = {
  doc_id: string;
  date: string;
  description: string;
  url?: string;
};

export default function ManifestoPageClient({ themes }: { themes: Theme[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [results, setResults] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);

  async function trackTheme(theme: Theme) {
    setActive(theme.id);
    setLoading(true);
    try {
      const q = theme.keywords[0] ?? theme.title;
      const res = await fetch(`/api/v1/cabinet/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">ජනපති ප්‍රකාශනය · கொள்கை அறிக்கை · Manifesto Tracker</p>
        <h1>Manifesto Accountability</h1>
        <p className="text-muted">
          Cross-reference 2024 NPP manifesto themes with searchable cabinet decisions.
        </p>
      </section>

      <div className="dataset-list">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`card card-button${active === t.id ? " active" : ""}`}
            onClick={() => trackTheme(t)}
          >
            <h3>{t.title}</h3>
            <p className="card-desc">Keywords: {t.keywords.join(", ")}</p>
          </button>
        ))}
      </div>

      {loading && <p className="text-muted mt-2">Searching cabinet decisions…</p>}

      {results.length > 0 && (
        <>
          <h2 className="section-title">Related cabinet decisions</h2>
          <div className="dataset-list">
            {results.map((d) => (
              <article key={d.doc_id} className="card">
                <h3>{d.description}</h3>
                <p className="card-meta">
                  {d.date && <span className="badge">{d.date}</span>}
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer">
                      Official source →
                    </a>
                  )}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <p className="mt-2 text-muted">
        <Link href="/cabinet">Cabinet search</Link>
        {" · "}
        <a
          href="https://github.com/nuuuwan/manifesto_monitoring"
          target="_blank"
          rel="noopener noreferrer"
        >
          manifesto_monitoring
        </a>
      </p>
    </div>
  );
}
