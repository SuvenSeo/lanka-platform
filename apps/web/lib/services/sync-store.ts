/**
 * Persistent sync status via Vercel Blob (optional — fail-open without token).
 */
import { list, put } from "@vercel/blob";

const BLOB_PATH = "sync/latest.json";

export async function saveSyncStatus(payload: unknown): Promise<{ saved: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { saved: false };
  try {
    await put(BLOB_PATH, JSON.stringify(payload), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return { saved: true };
  } catch {
    return { saved: false };
  }
}

export async function loadSyncStatus(): Promise<Record<string, unknown> | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: "sync/", limit: 5 });
    const latest = blobs.find((b) => b.pathname === BLOB_PATH) ?? blobs[0];
    if (!latest?.url) return null;
    const res = await fetch(latest.url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
