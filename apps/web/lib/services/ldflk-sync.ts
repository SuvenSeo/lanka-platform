import { fetchRemoteJson } from "./remote-fetch";

const LDFLK_BASE = "https://raw.githubusercontent.com/LDFLK/datasets/main";
const GITHUB_API = "https://api.github.com/repos/LDFLK/datasets/git/trees/main?recursive=1";

export type LdflkIndexEntry = {
  id: string;
  title: string;
  year: string;
  path: string;
  ministry: string;
  internal_url: string;
};

let indexCache: { at: number; entries: LdflkIndexEntry[] } | null = null;
const INDEX_TTL = 24 * 60 * 60 * 1000;

function slugify(title: string) {
  return encodeURIComponent(title);
}

function ministryFromPath(path: string): string {
  const parts = path.split("/");
  const yearIdx = parts.indexOf("statistics") + 1;
  return parts[yearIdx + 1] ?? "Government of Sri Lanka";
}

async function buildIndex(): Promise<LdflkIndexEntry[]> {
  const res = await fetch(GITHUB_API, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("LDFLK index fetch failed");
  const data = (await res.json()) as { tree: Array<{ path: string }> };

  const entries: LdflkIndexEntry[] = [];
  for (const node of data.tree) {
    const m = node.path.match(/^data\/statistics\/(\d{4})\/datasets\/(.+)\/data\.json$/);
    if (!m) continue;
    const [, year, title] = m;
    entries.push({
      id: `${year}-${title}`.toLowerCase().replace(/\s+/g, "-").slice(0, 80),
      title,
      year,
      path: node.path,
      ministry: ministryFromPath(node.path),
      internal_url: `/government/ldflk/${year}/${slugify(title)}`,
    });
  }
  return entries;
}

export async function getLdflkIndex(): Promise<LdflkIndexEntry[]> {
  const now = Date.now();
  if (indexCache && now - indexCache.at < INDEX_TTL) return indexCache.entries;
  const entries = await buildIndex();
  indexCache = { at: now, entries };
  return entries;
}

export async function searchLdflkIndex(q: string, limit = 30) {
  const entries = await getLdflkIndex();
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let list = entries;
  if (tokens.length) {
    list = entries.filter((e) => {
      const hay = `${e.title} ${e.ministry} ${e.year}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }
  return {
    query: q,
    count: Math.min(limit, list.length),
    total: entries.length,
    source: "LDFLK/datasets",
    results: list.slice(0, limit),
  };
}

export async function fetchLdflkDataset(year: string, encodedTitle: string) {
  const title = decodeURIComponent(encodedTitle);
  const path = `data/statistics/${year}/datasets/${title}/data.json`;
  const metaPath = `data/statistics/${year}/datasets/${title}/metadata.json`;

  const data = await fetchRemoteJson<unknown>(`${LDFLK_BASE}/${path}`, { revalidate: 3600 });
  let metadata: unknown = null;
  try {
    metadata = await fetchRemoteJson(`${LDFLK_BASE}/${metaPath}`, { revalidate: 3600 });
  } catch {
    /* optional */
  }

  return {
    title,
    year,
    path,
    synced_at: new Date().toISOString(),
    data,
    metadata,
    source: "LDFLK/datasets",
  };
}

export async function listLdflkRecent(limit = 20) {
  const entries = await getLdflkIndex();
  const sorted = [...entries].sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title));
  return {
    count: Math.min(limit, sorted.length),
    total: entries.length,
    source: "LDFLK/datasets",
    datasets: sorted.slice(0, limit),
  };
}
