/** NPP 2024 manifesto themes — cross-referenced with cabinet search */
export const MANIFESTO_THEMES = [
  {
    id: "cost-of-living",
    title: "Cost of living & economic relief",
    keywords: ["fuel", "tax", "price", "subsidy", "wage", "pension"],
    status: "tracking",
  },
  {
    id: "anti-corruption",
    title: "Anti-corruption & governance reform",
    keywords: ["corruption", "audit", "transparency", "commission", "investigation"],
    status: "tracking",
  },
  {
    id: "education",
    title: "Education reform",
    keywords: ["education", "school", "university", "teacher", "curriculum"],
    status: "tracking",
  },
  {
    id: "health",
    title: "Universal healthcare",
    keywords: ["health", "hospital", "medicine", "doctor", "NHSL"],
    status: "tracking",
  },
  {
    id: "agriculture",
    title: "Agriculture & food security",
    keywords: ["agriculture", "paddy", "fertilizer", "farmer", "food"],
    status: "tracking",
  },
  {
    id: "infrastructure",
    title: "Infrastructure & digitalisation",
    keywords: ["road", "railway", "port", "digital", "broadband", "ICT"],
    status: "tracking",
  },
  {
    id: "environment",
    title: "Environment & renewable energy",
    keywords: ["environment", "solar", "renewable", "climate", "forest"],
    status: "tracking",
  },
  {
    id: "devolution",
    title: "Devolution & provincial councils",
    keywords: ["provincial", "devolution", "council", "13th amendment"],
    status: "tracking",
  },
];

export function getManifestoOverview() {
  return {
    title: "Manifesto Accountability Tracker",
    election: "2024 Presidential / Parliamentary",
    party: "NPP (National People's Power)",
    description:
      "Cross-reference 2024 manifesto themes with cabinet decisions indexed by nuuuwan/lk_cabinet_decisions.",
    github: "https://github.com/nuuuwan/manifesto_monitoring",
    note: "Embedding-based matching paused Oct 2025 — keyword cross-reference active on Lanka Platform.",
    themes: MANIFESTO_THEMES,
    search_api: "/api/v1/cabinet/search",
  };
}
