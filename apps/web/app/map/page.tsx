import Link from "next/link";
import { getGeoLayers } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const geo = await getGeoLayers().catch(() => null);
  const provinces =
    (geo?.provinces_list as Array<{ id: string; name: string; capital: string }>) ?? [];

  return (
    <div className="container">
      <section className="hero">
        <h1>Island Map</h1>
        <p className="text-muted">
          Explore Sri Lanka&apos;s administrative regions via lk_locator.
        </p>
      </section>

      <div className="map-embed">
        <iframe
          src="https://nuuuwan.github.io/lk_locator/"
          title="LK Locator"
          loading="lazy"
        />
      </div>

      <h2 className="section-title">9 Provinces</h2>
      <div className="card-grid">
        {provinces.map((p) => (
          <Link key={p.id} href={`/regions/${p.id}`} className="card">
            <h3>{p.name}</h3>
            <p className="card-meta">Capital: {p.capital}</p>
            <p className="card-meta">{p.id}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
