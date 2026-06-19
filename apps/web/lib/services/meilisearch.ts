/**
 * Optional Meilisearch Cloud index for fast catalog search.
 */
import { Meilisearch } from "meilisearch";
import { loadCatalog, type Dataset } from "@/lib/catalog";

const INDEX_UID = "lanka_datasets";

function getClient(): Meilisearch | null {
  const host = process.env.MEILISEARCH_URL;
  const apiKey = process.env.MEILISEARCH_API_KEY;
  if (!host || !apiKey) return null;
  return new Meilisearch({ host, apiKey });
}

export function isMeilisearchConfigured(): boolean {
  return Boolean(process.env.MEILISEARCH_URL && process.env.MEILISEARCH_API_KEY);
}

export async function indexCatalog(): Promise<{ ok: boolean; indexed?: number; reason?: string }> {
  const client = getClient();
  if (!client) return { ok: false, reason: "not_configured" };

  const catalog = loadCatalog();
  const docs = catalog.datasets.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    domain: d.domain,
    status: d.status,
    priority: d.priority ?? 0,
    github_stars: d.github_stars ?? 0,
  }));

  const index = client.index(INDEX_UID);
  await index.updateSettings({
    searchableAttributes: ["name", "description", "id", "domain"],
    filterableAttributes: ["domain", "status"],
    sortableAttributes: ["priority", "github_stars"],
  });
  await index.addDocuments(docs, { primaryKey: "id" });
  return { ok: true, indexed: docs.length };
}

export async function searchMeilisearch(
  q: string,
  opts?: { domain?: string; status?: string; limit?: number },
): Promise<{
  query: string;
  count: number;
  results: Dataset[];
  engine: "meilisearch";
} | null> {
  const client = getClient();
  if (!client) return null;

  const filters: string[] = [];
  if (opts?.domain) filters.push(`domain = "${opts.domain}"`);
  if (opts?.status) filters.push(`status = "${opts.status}"`);

  const index = client.index(INDEX_UID);
  const result = await index.search(q, {
    limit: opts?.limit ?? 50,
    filter: filters.length ? filters.join(" AND ") : undefined,
  });

  const catalog = loadCatalog();
  const byId = new Map(catalog.datasets.map((d) => [d.id, d]));
  const results = result.hits
    .map((h) => byId.get(String(h.id)))
    .filter((d): d is Dataset => Boolean(d));

  return { query: q, count: results.length, results, engine: "meilisearch" };
}
