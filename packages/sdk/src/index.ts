/** Lightweight TypeScript SDK for Lanka Platform API */
export class LankaClient {
  constructor(private baseUrl = "") {}

  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`Lanka API ${res.status}: ${path}`);
    return res.json() as Promise<T>;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Lanka API ${res.status}: ${path}`);
    return res.json() as Promise<T>;
  }

  stats() {
    return this.get<Record<string, unknown>>("/api/v1/stats");
  }

  datasets(params?: { domain?: string; q?: string; limit?: number }) {
    const qs = new URLSearchParams();
    if (params?.domain) qs.set("domain", params.domain);
    if (params?.q) qs.set("q", params.q);
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return this.get<Record<string, unknown>>(`/api/v1/datasets${q ? `?${q}` : ""}`);
  }

  search(q: string) {
    return this.get<Record<string, unknown>>(`/api/v1/search?q=${encodeURIComponent(q)}`);
  }

  cabinetSearch(q: string) {
    return this.get<Record<string, unknown>>(
      `/api/v1/cabinet/search?q=${encodeURIComponent(q)}`,
    );
  }

  newsTimeline(limit = 30) {
    return this.get<Record<string, unknown>>(`/api/v1/analytics/news/timeline?limit=${limit}`);
  }

  ragQuery(question: string, corpus?: string) {
    return this.post<Record<string, unknown>>("/api/v1/rag/query", { question, corpus });
  }
}

export function createLankaClient(baseUrl = "") {
  return new LankaClient(baseUrl);
}
