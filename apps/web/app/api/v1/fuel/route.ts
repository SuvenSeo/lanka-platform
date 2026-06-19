import { fetchFuelDashboard } from "@/lib/services/fuel";
import { jsonError, jsonOk } from "../_lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sample = Number(searchParams.get("sample") ?? 30);
    return jsonOk(await fetchFuelDashboard(sample));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Fuel fetch failed", 502);
  }
}
