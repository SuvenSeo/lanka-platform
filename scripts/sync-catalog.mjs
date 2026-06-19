#!/usr/bin/env node
/** Sync nuuuwan repos into catalog manifest */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "packages/catalog/manifests");
const webData = join(root, "apps/web/data");

mkdirSync(outDir, { recursive: true });
mkdirSync(webData, { recursive: true });

const raw = execSync(
  'gh api "users/nuuuwan/repos?per_page=100" --paginate',
  { encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 },
);
const repos = JSON.parse(raw);

function classify(name, desc = "") {
  const n = name.toLowerCase();
  const d = desc.toLowerCase();
  const hay = `${n} ${d}`;
  if (/legal|acts|court|hansard|cabinet|constitution|gazette|eroc/.test(hay)) return "legal";
  if (/news|press/.test(hay)) return "news";
  if (/election|manifesto|parliament|prespoll|candidates/.test(hay)) return "elections";
  if (/weather|dmc|irrigation|river|alert|flood|landslide|tsunami/.test(hay)) return "environment";
  if (/census|cbsl|trade|tourism|food|fisheries|fuel|gig/.test(hay)) return "economic";
  if (/bus|traffic|train|rail|air_travel/.test(hay)) return "transport";
  if (/map|geo|region|locator|cartogram|topojson/.test(hay)) return "geospatial";
  if (/tamil|sinhala|education|tts/.test(hay)) return "language";
  if (/covid|health|dengue/.test(hay)) return "health";
  return "other";
}

const ENRICHMENTS = {
  lk_legal_docs: { doc_count: 114107, priority: 1, huggingface_id: "nuuuwan/lk-acts-docs" },
  lk_news: { doc_count: 119006, priority: 1, update_cadence: "every_2h" },
  lk_hansard: { doc_count: 252, size_gb: 13.4, priority: 1 },
  lk_cabinet_decisions: { doc_count: 10903, priority: 1 },
  elections_lk: { priority: 1, live_app_url: "https://nuuuwan.github.io/election" },
  lk_admin_regions: { priority: 1, live_app_url: "https://nuuuwan.github.io/lk_locator" },
  alert: { live_app_url: "https://alert.lk", priority: 1 },
  weather_lk: { doc_count: 6243, size_gb: 43, priority: 1 },
};

const datasets = repos.map((r) => {
  const id = r.name;
  const base = {
    id,
    name: id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    domain: classify(id, r.description ?? ""),
    description: r.description ?? "",
    source_repo: `nuuuwan/${id}`,
    status: r.archived ? "archived" : r.size > 500 ? "active" : "stub",
    github_stars: r.stargazers_count ?? 0,
    github_updated_at: r.updated_at,
    languages: ["si", "ta", "en"],
  };
  return { ...base, ...(ENRICHMENTS[id] ?? {}) };
});

const catalog = {
  version: 1,
  synced_at: new Date().toISOString(),
  source: "nuuuwan",
  datasets,
};

const catalogPath = join(outDir, "datasets.json");
writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
copyFileSync(catalogPath, join(webData, "datasets.json"));
console.log(`Synced ${datasets.length} datasets → ${catalogPath}`);
