const TOPO_BASE =
  "https://raw.githubusercontent.com/nuuuwan/lk_admin_regions/main/data/geo/topojson/e2_tiny";

const TOPOJSON_URLS: Record<string, string> = {
  provinces: `${TOPO_BASE}/provinces.topojson`,
  districts: `${TOPO_BASE}/districts.topojson`,
};

export async function fetchTopojson(layer: string) {
  const url = TOPOJSON_URLS[layer];
  if (!url) throw new Error(`Unknown layer: ${layer}`);
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Topojson fetch failed: ${res.status}`);
  return res.json();
}
