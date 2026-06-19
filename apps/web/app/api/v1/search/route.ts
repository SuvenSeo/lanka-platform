import { searchDatasets } from "@/lib/catalog";
import { searchMeilisearch } from "@/lib/services/meilisearch";
import { jsonOk } from "../_lib/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) {
    return jsonOk({ query: "", count: 0, results: [], engine: "keyword" });
  }

  const opts = {
    domain: searchParams.get("domain") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 50),
  };

  try {
    const meili = await searchMeilisearch(q, opts);
    if (meili && meili.count > 0) return jsonOk(meili);
  } catch {
    // fall through to keyword search
  }

  return jsonOk(searchDatasets(q, opts));
}
