import { getCabinetOverview } from "@/lib/services/platform";
import { jsonOk } from "../_lib/response";

export async function GET() {
  return jsonOk(getCabinetOverview());
}
