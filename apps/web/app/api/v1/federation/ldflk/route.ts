import { searchLdflk, listLdflk } from "@/lib/services/ldflk";
import { jsonOk } from "../../_lib/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (q) return jsonOk(searchLdflk(q, Number(searchParams.get("limit") ?? 20)));
  return jsonOk(listLdflk(Number(searchParams.get("limit") ?? 20)));
}
