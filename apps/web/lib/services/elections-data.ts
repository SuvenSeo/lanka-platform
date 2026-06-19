import { fetchRemoteJson } from "./remote-fetch";

const BASE = "https://raw.githubusercontent.com/nuuuwan/elections_lk_2023/data";

const HIGHLIGHT_FILES = [
  { file: "gen_elec_sl.ec.results.2020.json", label: "Parliamentary 2020" },
  { file: "elections_lk.presidential.2019.json", label: "Presidential 2019" },
  { file: "gen_elec_sl.ec.results.2015.json", label: "Parliamentary 2015" },
] as const;

type PartyRow = {
  party_code: string;
  party_name: string;
  vote_count: number;
  vote_percentage: string;
  seat_count?: number;
};

type DistrictResult = {
  ed_name?: string;
  ed_code?: string;
  by_party?: PartyRow[];
};

export type ElectionHighlightRow = {
  election: string;
  district: string;
  party: string;
  votes: string;
  pct: string;
};

export type ElectionHighlights = {
  header: string[];
  rows: ElectionHighlightRow[];
  synced_at: string;
  source: string;
  files_indexed: string[];
};

let cache: { at: number; data: ElectionHighlights } | null = null;
const CACHE_MS = 6 * 60 * 60 * 1000;

export async function fetchElectionHighlights(limitPerFile = 8): Promise<ElectionHighlights> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.data;

  const rows: ElectionHighlightRow[] = [];
  const files_indexed: string[] = [];

  for (const { file, label } of HIGHLIGHT_FILES) {
    try {
      const districts = await fetchRemoteJson<DistrictResult[]>(`${BASE}/${file}`, {
        revalidate: 86400,
      });
      files_indexed.push(file);
      for (const district of districts.slice(0, 3)) {
        const top = [...(district.by_party ?? [])]
          .sort((a, b) => b.vote_count - a.vote_count)
          .slice(0, limitPerFile);
        for (const party of top) {
          rows.push({
            election: label,
            district: district.ed_name ?? district.ed_code ?? "",
            party: party.party_name,
            votes: party.vote_count.toLocaleString(),
            pct: party.vote_percentage,
          });
        }
      }
    } catch {
      // skip missing file
    }
  }

  const data: ElectionHighlights = {
    header: ["election", "district", "party", "votes", "pct"],
    rows,
    synced_at: new Date().toISOString(),
    source: "nuuuwan/elections_lk_2023",
    files_indexed,
  };

  cache = { at: now, data };
  return data;
}
