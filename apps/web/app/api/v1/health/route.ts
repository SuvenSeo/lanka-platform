import { jsonOk } from "../_lib/response";

export async function GET() {
  return jsonOk({
    status: "ok",
    engine: "vercel-native",
    version: "0.3.0",
    timestamp: new Date().toISOString(),
  });
}
