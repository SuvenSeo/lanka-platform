import { fetchRemoteJson } from "./remote-fetch";

const CKAN_BASE = "https://data.gov.lk/api/3/action";

type CkanSearchResult = {
  success: boolean;
  result?: {
    count: number;
    results: Array<{
      id: string;
      name: string;
      title: string;
      notes?: string;
      metadata_modified?: string;
      organization?: { title?: string };
      license_title?: string;
      resources?: Array<{ url?: string; format?: string }>;
    }>;
  };
};

export type DatagovDataset = {
  id: string;
  name: string;
  title: string;
  description: string;
  organization?: string;
  license?: string;
  modified?: string;
  url: string;
  internal_url: string;
  source: "data.gov.lk";
  provenance: {
    publisher: string;
    license: string;
    official: true;
  };
};

export async function searchDatagov(q: string, limit = 20): Promise<{
  query: string;
  count: number;
  source: string;
  results: DatagovDataset[];
}> {
  const url = `${CKAN_BASE}/package_search?q=${encodeURIComponent(q)}&rows=${limit}`;
  const data = await fetchRemoteJson<CkanSearchResult>(url, { revalidate: 3600 });
  const results = (data.result?.results ?? []).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    title: pkg.title,
    description: (pkg.notes ?? "").replace(/<[^>]+>/g, "").slice(0, 500),
    organization: pkg.organization?.title,
    license: pkg.license_title,
    modified: pkg.metadata_modified,
    url: `https://data.gov.lk/dataset/${pkg.name}`,
    internal_url: `/government/dataset/${pkg.name}`,
    source: "data.gov.lk" as const,
    provenance: {
      publisher: pkg.organization?.title ?? "Government of Sri Lanka",
      license: pkg.license_title ?? "Open Government Licence",
      official: true as const,
    },
  }));

  return {
    query: q,
    count: results.length,
    source: "data.gov.lk CKAN",
    results,
  };
}

export async function listDatagovRecent(limit = 15): Promise<DatagovDataset[]> {
  const url = `${CKAN_BASE}/package_search?rows=${limit}&sort=metadata_modified desc`;
  const data = await fetchRemoteJson<CkanSearchResult>(url, { revalidate: 3600 });
  return (data.result?.results ?? []).map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    title: pkg.title,
    description: (pkg.notes ?? "").replace(/<[^>]+>/g, "").slice(0, 300),
    organization: pkg.organization?.title,
    license: pkg.license_title,
    modified: pkg.metadata_modified,
    url: `https://data.gov.lk/dataset/${pkg.name}`,
    internal_url: `/government/dataset/${pkg.name}`,
    source: "data.gov.lk" as const,
    provenance: {
      publisher: pkg.organization?.title ?? "Government of Sri Lanka",
      license: pkg.license_title ?? "Open Government Licence",
      official: true as const,
    },
  }));
}
