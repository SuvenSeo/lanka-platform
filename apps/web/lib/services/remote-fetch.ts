const DEFAULT_HEADERS = {
  Accept: "text/plain, application/json, */*",
  "User-Agent": "LankaPlatform/1.0 (https://lanka-platform-sand.vercel.app)",
};

export async function fetchRemoteText(
  url: string,
  opts?: { revalidate?: number; retries?: number },
): Promise<string> {
  const retries = opts?.retries ?? 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: DEFAULT_HEADERS,
        next: { revalidate: opts?.revalidate ?? 1800 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error("fetch failed");
      if (attempt < retries) await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error("fetch failed");
}

export async function fetchRemoteJson<T>(
  url: string,
  opts?: { revalidate?: number; retries?: number },
): Promise<T> {
  const text = await fetchRemoteText(url, opts);
  return JSON.parse(text) as T;
}

export function parseTsv(text: string): Record<string, string>[] {
  const lines = text.trim().split("\n");
  if (!lines.length) return [];
  const header = lines[0]?.split("\t") ?? [];
  const rows: Record<string, string>[] = [];
  for (const line of lines.slice(1)) {
    const cols = line.split("\t");
    const row: Record<string, string> = {};
    header.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    rows.push(row);
  }
  return rows;
}
