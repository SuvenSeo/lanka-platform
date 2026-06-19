import { searchDatagov, listDatagovRecent } from "@/lib/services/datagov";
import { jsonError, jsonOk } from "../../_lib/response";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    if (q) return jsonOk(await searchDatagov(q, Number(searchParams.get("limit") ?? 20)));
    return jsonOk({ recent: await listDatagovRecent(15), source: "data.gov.lk CKAN" });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "data.gov.lk fetch failed", 502);
  }
}
