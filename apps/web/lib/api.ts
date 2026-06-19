import { getApiBaseUrl } from "./api-url";

export type { Dataset } from "./catalog";

export interface Stats {
  total_datasets: number;
  active_datasets: number;
  total_documents_indexed: number;
  total_size_gb_indexed: number;
  source_repos_total: number;
  by_domain: Record<string, number>;
  last_synced?: string;
  engine?: string;
}

export interface Domain {
  id: string;
  name: string;
  color: string;
  count?: number;
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}${path}`, { next: { revalidate: 120 }, ...init });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const getStats = () => fetchApi<Stats>("/api/v1/stats");
export const getDomains = () => fetchApi<Domain[]>("/api/v1/domains");
export const getLiveApps = () =>
  fetchApi<{ name: string; url: string; domain: string }[]>("/api/v1/live-apps");

export function getDatasets(params?: {
  domain?: string;
  status?: string;
  q?: string;
  region?: string;
  limit?: number;
  offset?: number;
}) {
  const search = new URLSearchParams();
  if (params?.domain) search.set("domain", params.domain);
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  if (params?.region) search.set("region", params.region);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));
  const qs = search.toString();
  return fetchApi<{ count: number; total: number; datasets: import("./catalog").Dataset[] }>(
    `/api/v1/datasets${qs ? `?${qs}` : ""}`,
  );
}

export const getDataset = (id: string) =>
  fetchApi<import("./catalog").Dataset>(`/api/v1/datasets/${id}`);

export function searchDatasets(q: string, domain?: string, region?: string) {
  const params = new URLSearchParams({ q });
  if (domain) params.set("domain", domain);
  if (region) params.set("region", region);
  return fetchApi<{ query: string; count: number; results: import("./catalog").Dataset[]; engine?: string }>(
    `/api/v1/search?${params}`,
  );
}

export async function getNewsTimeline(limit = 30) {
  return fetchApi<Record<string, unknown>>(`/api/v1/analytics/news/timeline?limit=${limit}`);
}

export async function searchCabinet(q: string) {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/cabinet/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function postLegalRag(question: string, deep = true) {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/rag/legal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, deep }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const getElections = () => fetchApi<Record<string, unknown>>("/api/v1/elections");
export const getCabinet = () => fetchApi<Record<string, unknown>>("/api/v1/cabinet");
export const getGeoLayers = () => fetchApi<Record<string, unknown>>("/api/v1/geo/layers");
export const getFederation = () => fetchApi<Record<string, unknown>>("/api/v1/federation");

export const getDatasetPreview = (id: string) =>
  fetchApi<Record<string, unknown>>(`/api/v1/datasets/${id}/preview`);
