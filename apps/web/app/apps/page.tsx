import { getLiveApps } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AppsPage() {
  const apps = await getLiveApps().catch(() => []);

  return (
    <div className="container">
      <section className="hero">
        <h1>Live Apps</h1>
        <p className="text-muted">nuuuwan GitHub Pages apps and live tools.</p>
      </section>

      <div className="card-grid">
        {apps.map((app) => (
          <a key={app.url} href={app.url} target="_blank" rel="noopener noreferrer" className="card">
            <h3>{app.name}</h3>
            <p className="card-desc">{app.domain}</p>
          </a>
        ))}
      </div>

      {apps.length === 0 && (
        <p className="text-muted">No live apps tagged in catalog yet.</p>
      )}
    </div>
  );
}
