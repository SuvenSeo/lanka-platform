import { getDataset } from "@/lib/catalog";
import { jsonError, jsonOk } from "../../_lib/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const dataset = getDataset(id);
  if (!dataset) return jsonError(`Dataset '${id}' not found`, 404);
  return jsonOk(dataset);
}
