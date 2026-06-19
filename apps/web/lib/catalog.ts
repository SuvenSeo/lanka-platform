import catalogData from "@/data/datasets.json";

export type Dataset = {
  id: string;
  name: string;
  domain: string;
  description: string;
  source_repo: string;
  data_branch?: string;
  doc_count?: number;
  size_gb?: number;
  languages?: string[];
  update_cadence?: string;
  source_url?: string;
  live_app_url?: string;
  huggingface_id?: string;
  pypi_package?: string;
  status: string;
  priority?: number;
  github_stars?: number;
  github_updated_at?: string;
};

export type Catalog = {
  version: number;
  synced_at: string;
  source: string;
  datasets: Dataset[];
};

const DOMAIN_META: Record<string, { name: string; color: string }> = {
  legal: { name: "Legal & Government", color: "#8b1538" },
  news: { name: "News & Media", color: "#c9a227" },
  elections: { name: "Elections & Politics", color: "#8b1538" },
  environment: { name: "Environment & Disasters", color: "#0d7377" },
  economic: { name: "Economic & Social", color: "#c9a227" },
  transport: { name: "Transport", color: "#0d7377" },
  geospatial: { name: "Geospatial", color: "#0d7377" },
  language: { name: "Language & Education", color: "#c9a227" },
  health: { name: "Health", color: "#0d7377" },
  other: { name: "Other", color: "#6b7280" },
};

export function loadCatalog(): Catalog {
  return catalogData as Catalog;
}

export function getDomains() {
  const catalog = loadCatalog();
  const counts: Record<string, number> = {};
  for (const d of catalog.datasets) {
    counts[d.domain] = (counts[d.domain] ?? 0) + 1;
  }
  return Object.entries(DOMAIN_META).map(([id, meta]) => ({
    id,
    name: meta.name,
    color: meta.color,
    count: counts[id] ?? 0,
  }));
}

export function getStats() {
  const catalog = loadCatalog();
  const ds = catalog.datasets;
  const byDomain: Record<string, number> = {};
  let active = 0;
  let stale = 0;
  let archived = 0;
  let stub = 0;
  let docs = 0;
  let sizeGb = 0;

  for (const d of ds) {
    byDomain[d.domain] = (byDomain[d.domain] ?? 0) + 1;
    if (d.status === "active") active++;
    else if (d.status === "archived") archived++;
    else if (d.status === "stub") stub++;
    else stale++;
    docs += d.doc_count ?? 0;
    sizeGb += d.size_gb ?? 0;
  }

  return {
    total_datasets: ds.length,
    active_datasets: active,
    stale_datasets: stale,
    archived_datasets: archived,
    stub_datasets: stub,
    substantive_datasets: active,
    total_documents_indexed: docs,
    total_size_gb_indexed: Math.round(sizeGb * 10) / 10,
    source_repos_total: ds.length,
    citation: "arXiv:2510.04124",
    catalog_repo: "nuuuwan/lk_datasets",
    by_domain: byDomain,
    last_synced: catalog.synced_at,
    engine: "vercel-native",
  };
}

export function getLiveApps() {
  return loadCatalog()
    .datasets.filter((d) => d.live_app_url)
    .map((d) => ({
      name: d.name,
      url: d.live_app_url!,
      domain: d.domain,
    }));
}

export function getDataset(id: string): Dataset | undefined {
  return loadCatalog().datasets.find((d) => d.id === id);
}

export function getDatasets(opts?: {
  domain?: string;
  status?: string;
  q?: string;
  region?: string;
  limit?: number;
  offset?: number;
}) {
  let list = [...loadCatalog().datasets];

  if (opts?.domain) list = list.filter((d) => d.domain === opts.domain);
  if (opts?.status) list = list.filter((d) => d.status === opts.status);
  if (opts?.region) {
    const r = opts.region.toLowerCase();
    list = list.filter(
      (d) =>
        d.name.toLowerCase().includes(r) ||
        d.description.toLowerCase().includes(r) ||
        d.id.toLowerCase().includes(r),
    );
  }
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    list = list.filter(
      (d) =>
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    );
  }

  list.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || (b.github_stars ?? 0) - (a.github_stars ?? 0));

  const offset = opts?.offset ?? 0;
  const limit = opts?.limit ?? 50;
  return {
    count: Math.min(limit, list.length - offset),
    total: list.length,
    offset,
    datasets: list.slice(offset, offset + limit),
  };
}

export function searchDatasets(
  q: string,
  opts?: { domain?: string; status?: string; region?: string; limit?: number },
) {
  const result = getDatasets({
    q,
    domain: opts?.domain,
    status: opts?.status,
    region: opts?.region,
    limit: opts?.limit ?? 50,
  });
  return {
    query: q,
    count: result.datasets.length,
    results: result.datasets,
    engine: "keyword",
  };
}
