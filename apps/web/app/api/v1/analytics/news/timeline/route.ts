import { fetchNewsTimeline } from "@/lib/services/news";
import { jsonError, jsonOk } from "../../../_lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 30);
    const outlet = searchParams.get("outlet") ?? undefined;
    return jsonOk(await fetchNewsTimeline(limit, outlet));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "News fetch failed", 502);
  }
}
