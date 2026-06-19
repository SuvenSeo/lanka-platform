import { fetchElectionHighlights } from "@/lib/services/elections-data";
import { jsonError, jsonOk } from "../../_lib/response";

export async function GET() {
  try {
    return jsonOk(await fetchElectionHighlights());
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Elections fetch failed", 502);
  }
}
