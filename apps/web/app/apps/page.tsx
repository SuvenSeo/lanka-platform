import Link from "next/link";
import { getLiveApps } from "@/lib/api";
import { loadCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const apps = await getLiveApps().catch(() => []);
  const withApps = loadCatalog().datasets.filter(
    (d) => d.live_app_url || ["fuel_lk", "lk_dmc_vis", "fuel_lk_app"].includes(d.id),
  );

  const merged = new Map<string, { id: string; name: string; domain: string }>();
  for (const a of apps) {
    const ds = loadCatalog().datasets.find((d) => d.live_app_url === a.url);
    if (ds) merged.set(ds.id, { id: ds.id, name: ds.name, domain: ds.domain });
  }
  for (const d of withApps) {
    merged.set(d.id, { id: d.id, name: d.name, domain: d.domain });
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>Live Apps</h1>
        <p className="text-muted">
          All tools run inside Lanka Platform — data syncs from nuuuwan pipelines automatically.
        </p>
      </section>

      <div className="card-grid">
        {Array.from(merged.values()).map((app) => (
          <Link key={app.id} href={`/apps/${app.id}`} className="card">
            <h3>{app.name}</h3>
            <p className="card-desc">{app.domain}</p>
            <span className="badge badge-active">In-platform</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
