import { listCorpora } from "@/lib/services/chunk-rag";
import { jsonOk } from "../../_lib/response";

export async function GET() {
  return jsonOk({ corpora: listCorpora() });
}
