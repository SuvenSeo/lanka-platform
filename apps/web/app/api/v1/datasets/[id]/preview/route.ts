import { fetchDatasetPreview } from "@/lib/services/dataset-preview";
import { jsonOk } from "../../../_lib/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return jsonOk(await fetchDatasetPreview(id));
}
