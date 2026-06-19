import { searchDatasets } from "@/lib/catalog";
import { jsonOk } from "../_lib/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q.trim()) {
    return jsonOk({ query: "", count: 0, results: [], engine: "keyword" });
  }
  return jsonOk(
    searchDatasets(q, {
      domain: searchParams.get("domain") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      limit: Number(searchParams.get("limit") ?? 50),
    }),
  );
}
