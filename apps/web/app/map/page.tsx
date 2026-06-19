import Link from "next/link";
import { ProvinceMap } from "@/components/ProvinceMap";
import { getGeoLayers } from "@/lib/api";
import { PROVINCES } from "@/lib/geo/regions";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const geo = await getGeoLayers().catch(() => null);
  const provinces =
    (geo?.provinces_list as Array<{ id: string; name: string; capital: string }>) ?? PROVINCES;

  return (
    <div className="container">
      <section className="hero">
        <h1>Island Map</h1>
        <p className="text-muted">
          Explore Sri Lanka&apos;s 9 provinces — click a region for datasets, elections, and alerts.
        </p>
      </section>

      <ProvinceMap />

      <div className="province-map-grid">
        {provinces.map((p) => (
          <Link key={p.id} href={`/regions/${p.id}`} className="province-tile card">
            <span className="province-id">{p.id}</span>
            <h3>{p.name}</h3>
            <p className="card-meta">Capital: {p.capital}</p>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Geo datasets</h2>
      <div className="card-grid">
        <Link href="/apps/lk_admin_regions" className="card">
          <h3>Admin regions</h3>
          <p className="card-desc">Provinces, districts, DSD — DCS region_id spine</p>
        </Link>
        <Link href="/datasets?domain=geospatial" className="card">
          <h3>Geospatial catalog</h3>
          <p className="card-desc">All geo datasets in the platform</p>
        </Link>
      </div>
    </div>
  );
}
