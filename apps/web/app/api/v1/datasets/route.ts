import { getDatasets } from "@/lib/catalog";
import { jsonOk } from "../_lib/response";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return jsonOk(
    getDatasets({
      domain: searchParams.get("domain") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      limit: Number(searchParams.get("limit") ?? 50),
      offset: Number(searchParams.get("offset") ?? 0),
    }),
  );
}
