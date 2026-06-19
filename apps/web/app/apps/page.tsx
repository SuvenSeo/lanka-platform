import Link from "next/link";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const NATIVE_APP_IDS = new Set([
  "fuel_lk",
  "fuel_lk_app",
  "elections_lk",
  "elections_lk_2023",
  "lk_news",
  "lk_cabinet_decisions",
  "lk_admin_regions",
  "alert",
  "lk_dmc_vis",
  "bus_routes_lk",
]);

export default function AppsPage() {
  const catalog = loadCatalog();
  const withApps = catalog.datasets.filter(
    (d) => NATIVE_APP_IDS.has(d.id) || d.live_app_url,
  );

  const merged = new Map<string, { id: string; name: string; domain: string; native: boolean }>();
  for (const d of withApps) {
    merged.set(d.id, {
      id: d.id,
      name: d.name,
      domain: d.domain,
      native: NATIVE_APP_IDS.has(d.id),
    });
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>Live Apps</h1>
        <p className="text-muted">
          {merged.size} tools with in-platform explorers — data syncs from nuuuwan pipelines.
        </p>
      </section>

      <div className="card-grid">
        {Array.from(merged.values()).map((app) => (
          <Link key={app.id} href={`/apps/${app.id}`} className="card">
            <h3>{app.name}</h3>
            <p className="card-desc">{app.domain}</p>
            <span className="badge badge-active">
              {app.native ? "In-platform" : "Catalog + external"}
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-2 text-muted">
        <Link href="/datasets">Browse all {catalog.datasets.length} datasets →</Link>
      </p>
    </div>
  );
}
