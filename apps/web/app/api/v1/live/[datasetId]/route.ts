import { fetchLiveDataset } from "@/lib/services/live-data";
import { jsonError, jsonOk } from "../../_lib/response";

export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ datasetId: string }> },
) {
  try {
    const { datasetId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? 200);
    const force = searchParams.get("force") === "1";
    return jsonOk(await fetchLiveDataset(datasetId, { limit, force }));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Live data fetch failed", 404);
  }
}
