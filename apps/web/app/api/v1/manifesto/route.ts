import { getManifestoOverview } from "@/lib/services/manifesto";
import { jsonOk } from "../_lib/response";

export async function GET() {
  return jsonOk(getManifestoOverview());
}
