import { getSyncManifest } from "@/lib/sync/manifest";
import { warmPriorityDatasets } from "@/lib/services/live-data";
import { fetchNewsTimeline } from "@/lib/services/news";
import { getRecentCabinet } from "@/lib/services/cabinet";
import { getLdflkIndex } from "@/lib/services/ldflk-sync";
import { indexCatalog } from "@/lib/services/meilisearch";
import { saveSyncStatus } from "@/lib/services/sync-store";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (process.env.VERCEL_ENV === "production" && !secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const manifest = getSyncManifest();
  const [datasets, news, cabinet, ldflk, meili] = await Promise.all([
    warmPriorityDatasets(manifest),
    fetchNewsTimeline(50).catch((e) => ({ error: String(e) })),
    getRecentCabinet(50).catch((e) => ({ error: String(e) })),
    getLdflkIndex().catch((e) => ({ error: String(e) })),
    indexCatalog().catch((e) => ({ ok: false, reason: String(e) })),
  ]);

  const ok = datasets.filter((d) => d.ok).length;
  const failed = datasets.filter((d) => !d.ok).length;

  const payload = {
    synced_at: new Date().toISOString(),
    manifest_size: manifest.length,
    datasets: { ok, failed, results: datasets },
    news: "error" in news ? news : { count: news.count },
    cabinet: "error" in cabinet ? cabinet : { count: cabinet.length },
    ldflk: Array.isArray(ldflk) ? { indexed: ldflk.length } : ldflk,
    meilisearch: meili,
    blob: await saveSyncStatus({
      synced_at: new Date().toISOString(),
      datasets_ok: ok,
      datasets_failed: failed,
    }),
  };

  return NextResponse.json(payload);
}
