import { unstable_cache } from "next/cache";
import { loadCatalog } from "@/lib/catalog";

/** Datasets to warm on cron — priority active + domain leaders */
export function getSyncManifest(): string[] {
  const catalog = loadCatalog();
  const ids = new Set<string>([
    "lk_news",
    "lk_cabinet_decisions",
    "fuel_lk",
    "elections_lk",
    "alert_data",
    "lk_dmc",
    "bus_routes_lk",
    "lk_legal_docs",
    "lk_hansard",
    "lk_admin_regions",
    "fuel_lk_app",
  ]);

  for (const d of catalog.datasets) {
    if (d.status === "active" && (d.priority ?? 0) >= 1) ids.add(d.id);
    if (d.status === "active" && (d.doc_count ?? 0) > 1000) ids.add(d.id);
  }

  return [...ids].slice(0, 80);
}

export const cachedTag = (datasetId: string) => `live-data-${datasetId}`;

export function withDatasetCache<T>(
  datasetId: string,
  fn: () => Promise<T>,
  revalidate = 1800,
): Promise<T> {
  return unstable_cache(fn, [datasetId], {
    revalidate,
    tags: [cachedTag(datasetId)],
  })();
}
