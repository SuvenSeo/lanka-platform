import { getLiveApps } from "@/lib/catalog";
import { jsonOk } from "../_lib/response";

export async function GET() {
  return jsonOk(getLiveApps());
}
