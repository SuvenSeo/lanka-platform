/** Curated LDFLK ministry datasets — synced from ldflk.github.io/datasets */
export type LdflkDataset = {
  id: string;
  title: string;
  ministry: string;
  description: string;
  years: string;
  format: string;
  url: string;
  source: "ldflk";
  provenance: {
    publisher: string;
    license: string;
    cleaned_by: string;
  };
};

const LDFLK_CATALOG: LdflkDataset[] = [
  {
    id: "cbsl-monetary",
    title: "CBSL Monetary Statistics",
    ministry: "Central Bank of Sri Lanka",
    description: "Cleaned monetary aggregates, interest rates, and reserve data.",
    years: "2020–2025",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "CBSL", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "education-enrollment",
    title: "School Enrollment by District",
    ministry: "Ministry of Education",
    description: "District-level enrollment statistics cleaned from ministry releases.",
    years: "2020–2024",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "MoE", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "health-facilities",
    title: "Health Facilities Registry",
    ministry: "Ministry of Health",
    description: "Hospitals, PHMs, and clinics with district codes.",
    years: "2021–2025",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "MoH", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "transport-vehicle",
    title: "Vehicle Registrations",
    ministry: "Department of Motor Traffic",
    description: "Monthly vehicle registration counts by category.",
    years: "2020–2025",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "DMT", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "agriculture-production",
    title: "Crop Production Statistics",
    ministry: "Department of Census and Statistics",
    description: "Paddy, tea, coconut production by district.",
    years: "2019–2024",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "DCS", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "tourism-arrivals",
    title: "Tourist Arrivals",
    ministry: "Sri Lanka Tourism Development Authority",
    description: "Monthly tourist arrivals by country of origin.",
    years: "2020–2025",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "SLTDA", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "energy-generation",
    title: "Power Generation Mix",
    ministry: "Ceylon Electricity Board",
    description: "Daily/hourly generation by source (hydro, thermal, solar).",
    years: "2021–2025",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "CEB", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
  {
    id: "labour-employment",
    title: "Labour Force Survey Indicators",
    ministry: "Department of Census and Statistics",
    description: "Unemployment, labour participation by province.",
    years: "2020–2024",
    format: "JSON",
    url: "https://ldflk.github.io/datasets/",
    source: "ldflk",
    provenance: { publisher: "DCS", license: "Open Data", cleaned_by: "Lanka Data Foundation" },
  },
];

export function searchLdflk(q: string, limit = 20): {
  query: string;
  count: number;
  total: number;
  source: string;
  results: LdflkDataset[];
} {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let list = LDFLK_CATALOG;
  if (tokens.length) {
    list = LDFLK_CATALOG.filter((d) => {
      const hay = `${d.title} ${d.ministry} ${d.description}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }
  return {
    query: q,
    count: Math.min(limit, list.length),
    total: LDFLK_CATALOG.length,
    source: "LDFLK/datasets",
    results: list.slice(0, limit),
  };
}

export function listLdflk(limit = 20) {
  return {
    count: Math.min(limit, LDFLK_CATALOG.length),
    total: LDFLK_CATALOG.length,
    source: "LDFLK/datasets",
    catalog_url: "https://ldflk.github.io/datasets/",
    datasets: LDFLK_CATALOG.slice(0, limit),
  };
}
