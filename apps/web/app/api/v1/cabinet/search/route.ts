import { searchCabinet } from "@/lib/services/cabinet";
import { jsonError, jsonOk } from "../../_lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    if (q.length < 2) return jsonError("Query must be at least 2 characters", 400);
    const limit = Number(searchParams.get("limit") ?? 20);
    return jsonOk(await searchCabinet(q, limit));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Cabinet search failed", 502);
  }
}
