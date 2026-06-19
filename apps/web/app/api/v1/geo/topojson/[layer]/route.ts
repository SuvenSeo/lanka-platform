import { fetchTopojson } from "@/lib/services/geo-proxy";
import { jsonError, jsonOk } from "../../../_lib/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ layer: string }> },
) {
  try {
    const { layer } = await params;
    return jsonOk(await fetchTopojson(layer));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Geo fetch failed", 404);
  }
}
