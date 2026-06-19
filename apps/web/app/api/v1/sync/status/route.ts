import { loadSyncStatus } from "@/lib/services/sync-store";
import { jsonOk } from "../../_lib/response";

export async function GET() {
  const blob = await loadSyncStatus();
  return jsonOk({
    synced_at: blob?.synced_at ?? null,
    datasets_ok: blob?.datasets_ok ?? null,
    datasets_failed: blob?.datasets_failed ?? null,
    source: blob ? "vercel-blob" : "memory-only",
  });
}
