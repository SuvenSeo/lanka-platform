import { fetchLdflkDataset } from "@/lib/services/ldflk-sync";
import { jsonError, jsonOk } from "../../../_lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");
    const name = searchParams.get("name");
    if (!year || !name) return jsonError("year and name required", 400);
    return jsonOk(await fetchLdflkDataset(year, name));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "LDFLK fetch failed", 404);
  }
}
