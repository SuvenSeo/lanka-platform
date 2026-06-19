import { fetchRemoteJson } from "./remote-fetch";

const BASE = "https://raw.githubusercontent.com/nuuuwan/fuel_lk/data";

const STATUS_LABELS: Record<number, string> = {
  0: "Unknown",
  1: "Available",
  2: "Limited",
  3: "Out of stock",
};

type ShedBase = {
  shed_code: string;
  shed_name: string;
  address: string;
};

type ExtendedShed = {
  fuel_type?: string;
  fuel_status_idx?: number;
  fuel_capacity?: number;
  time_last_updated?: string;
};

export type FuelRow = {
  shed_code: string;
  shed_name: string;
  address: string;
  fuel_type: string;
  status: string;
  capacity: string;
  last_updated: string;
};

export type FuelDashboard = {
  total_sheds: number;
  sampled: number;
  header: string[];
  rows: FuelRow[];
  synced_at: string;
  source: string;
  data_note: string;
};

let cache: { at: number; data: FuelDashboard } | null = null;
const CACHE_MS = 30 * 60 * 1000;

export async function fetchFuelDashboard(sampleSize = 30): Promise<FuelDashboard> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.data;

  const sheds = await fetchRemoteJson<ShedBase[]>(`${BASE}/base_shed_list.json`, {
    revalidate: 3600,
  });

  const step = Math.max(1, Math.floor(sheds.length / sampleSize));
  const sample = sheds.filter((_, i) => i % step === 0).slice(0, sampleSize);

  const rows: FuelRow[] = await Promise.all(
    sample.map(async (shed) => {
      const base: FuelRow = {
        shed_code: shed.shed_code,
        shed_name: shed.shed_name,
        address: shed.address,
        fuel_type: "",
        status: "—",
        capacity: "",
        last_updated: "",
      };
      try {
        const ext = await fetchRemoteJson<ExtendedShed>(
          `${BASE}/latest/extended_shed.${shed.shed_code}.json`,
          { revalidate: 3600 },
        );
        const idx = ext.fuel_status_idx ?? 0;
        return {
          ...base,
          fuel_type: ext.fuel_type ?? "",
          status: STATUS_LABELS[idx] ?? String(idx),
          capacity: ext.fuel_capacity != null ? String(ext.fuel_capacity) : "",
          last_updated: ext.time_last_updated ?? "",
        };
      } catch {
        return base;
      }
    }),
  );

  const data: FuelDashboard = {
    total_sheds: sheds.length,
    sampled: rows.length,
    header: ["shed_code", "shed_name", "address", "fuel_type", "status", "capacity", "last_updated"],
    rows,
    synced_at: new Date().toISOString(),
    source: "nuuuwan/fuel_lk",
    data_note: "Snapshot from fuel_lk data branch (last pipeline update 2022). Sampled across island sheds.",
  };

  cache = { at: now, data };
  return data;
}
