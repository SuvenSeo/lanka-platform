import Link from "next/link";
import { getElections } from "@/lib/api";
import { TRILINGUAL } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function ElectionsPage() {
  const data = await getElections().catch(() => null);
  const datasets =
    (data?.datasets as Array<{ id: string; name: string; description: string }>) ?? [];

  return (
    <div className="container">
      <section className="hero">
        <p className="trilingual">{TRILINGUAL.elections}</p>
        <h1>Elections</h1>
        <p className="text-muted">{String(data?.description ?? "Election data 1947–2025")}</p>
      </section>

      {data?.live_app != null && (
        <a
          href={String(data.live_app)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{ display: "inline-block", marginBottom: "1rem" }}
        >
          Open live election explorer →
        </a>
      )}

      <h2 className="section-title">Election datasets</h2>
      <div className="dataset-list">
        {datasets.map((ds) => (
          <Link key={ds.id} href={`/datasets/${ds.id}`} className="card">
            <h3>{ds.name}</h3>
            <p className="card-desc">{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
