import { searchLdflkIndex, listLdflkRecent } from "@/lib/services/ldflk-sync";
import { jsonOk } from "../../_lib/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (q) return jsonOk(await searchLdflkIndex(q, Number(searchParams.get("limit") ?? 20)));
  return jsonOk(await listLdflkRecent(Number(searchParams.get("limit") ?? 20)));
}
