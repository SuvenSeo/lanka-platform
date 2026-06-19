/**
 * Unified live data layer — fetches nuuuwan repo files and caches in-process.
 */
import { getDataset, type Dataset } from "@/lib/catalog";
import { fetchFuelDashboard } from "./fuel";
import { fetchRemoteJson, fetchRemoteText, parseTsv } from "./remote-fetch";
import { getSyncManifest } from "@/lib/sync/manifest";

const LIVE_FILES = ["docs_last100.tsv", "docs_last1000.tsv", "summary.json", "README.md"] as const;

export type LiveDataResult = {
  dataset_id: string;
  name: string;
  domain: string;
  format: "tsv" | "json" | "markdown";
  source_path: string;
  synced_at: string;
  row_count: number;
  header?: string[];
  rows?: Record<string, string>[];
  data?: unknown;
  text?: string;
};

type CacheEntry = { at: number; result: LiveDataResult };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 30 * 60 * 1000;

function dataUrls(ds: Dataset, file: string): string[] {
  const branch = ds.data_branch ?? "data";
  const base = `https://raw.githubusercontent.com/${ds.source_repo}`;
  return [`${base}/${branch}/${file}`, `${base}/${branch}/data/${ds.id}/${file}`];
}

export function getPrioritySyncDatasets(): string[] {
  return getSyncManifest();
}

export async function fetchLiveDataset(
  datasetId: string,
  opts?: { limit?: number; force?: boolean },
): Promise<LiveDataResult> {
  const limit = opts?.limit ?? 500;
  const cacheKey = `${datasetId}:${limit}`;
  const now = Date.now();
  const hit = cache.get(cacheKey);
  if (!opts?.force && hit && now - hit.at < TTL_MS) return hit.result;

  const ds = getDataset(datasetId);
  if (!ds) throw new Error(`Dataset '${datasetId}' not found`);

  if (datasetId === "fuel_lk" || datasetId === "fuel_lk_app") {
    const fuel = await fetchFuelDashboard(Math.min(limit, 40));
    const result: LiveDataResult = {
      dataset_id: datasetId,
      name: ds.name,
      domain: ds.domain,
      format: "tsv",
      source_path: "nuuuwan/fuel_lk/data/latest/",
      synced_at: fuel.synced_at,
      row_count: fuel.total_sheds,
      header: fuel.header,
      rows: fuel.rows.map((r) => ({ ...r })),
      text: fuel.data_note,
    };
    cache.set(cacheKey, { at: now, result });
    return result;
  }

  for (const file of LIVE_FILES) {
    for (const url of dataUrls(ds, file)) {
      try {
        if (file.endsWith(".tsv")) {
          const text = await fetchRemoteText(url, { revalidate: 600 });
          const allRows = parseTsv(text);
          const header = allRows[0] ? Object.keys(allRows[0]) : [];
          const rows = allRows.slice(0, limit);
          const result: LiveDataResult = {
            dataset_id: datasetId,
            name: ds.name,
            domain: ds.domain,
            format: "tsv",
            source_path: url,
            synced_at: new Date().toISOString(),
            row_count: allRows.length,
            header,
            rows,
          };
          cache.set(cacheKey, { at: now, result });
          return result;
        }
        if (file.endsWith(".json")) {
          const data = await fetchRemoteJson<unknown>(url, { revalidate: 600 });
          const result: LiveDataResult = {
            dataset_id: datasetId,
            name: ds.name,
            domain: ds.domain,
            format: "json",
            source_path: url,
            synced_at: new Date().toISOString(),
            row_count: Array.isArray(data) ? data.length : 1,
            data,
          };
          cache.set(cacheKey, { at: now, result });
          return result;
        }
        const text = await fetchRemoteText(url, { revalidate: 3600 });
        const result: LiveDataResult = {
          dataset_id: datasetId,
          name: ds.name,
          domain: ds.domain,
          format: "markdown",
          source_path: url,
          synced_at: new Date().toISOString(),
          row_count: 1,
          text: text.slice(0, 50_000),
        };
        cache.set(cacheKey, { at: now, result });
        return result;
      } catch {
        /* try next path */
      }
    }
  }

  throw new Error(`No live data file found for ${datasetId}`);
}

export async function warmPriorityDatasets(ids: string[]) {
  const results: { id: string; ok: boolean; error?: string; synced_at?: string }[] = [];
  for (const id of ids) {
    try {
      const r = await fetchLiveDataset(id, { limit: 200, force: true });
      results.push({ id, ok: true, synced_at: r.synced_at });
    } catch (e) {
      results.push({ id, ok: false, error: e instanceof Error ? e.message : "error" });
    }
  }
  return results;
}
