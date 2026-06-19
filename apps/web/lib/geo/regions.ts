export type Region = {
  id: string;
  name: string;
  capital: string;
  districts: string[];
  keywords: string[];
  population_approx?: string;
};

export const PROVINCES: Region[] = [
  {
    id: "LK-1",
    name: "Western",
    capital: "Colombo",
    districts: ["Colombo", "Gampaha", "Kalutara"],
    keywords: ["colombo", "gampaha", "kalutara", "western"],
    population_approx: "5.8M",
  },
  {
    id: "LK-2",
    name: "Central",
    capital: "Kandy",
    districts: ["Kandy", "Matale", "Nuwara Eliya"],
    keywords: ["kandy", "matale", "nuwara eliya", "central"],
    population_approx: "2.6M",
  },
  {
    id: "LK-3",
    name: "Southern",
    capital: "Galle",
    districts: ["Galle", "Matara", "Hambantota"],
    keywords: ["galle", "matara", "hambantota", "southern"],
    population_approx: "2.5M",
  },
  {
    id: "LK-4",
    name: "Northern",
    capital: "Jaffna",
    districts: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"],
    keywords: ["jaffna", "kilinochchi", "mannar", "vavuniya", "mullaitivu", "northern"],
    population_approx: "1.1M",
  },
  {
    id: "LK-5",
    name: "Eastern",
    capital: "Trincomalee",
    districts: ["Trincomalee", "Batticaloa", "Ampara"],
    keywords: ["trincomalee", "batticaloa", "ampara", "eastern"],
    population_approx: "1.6M",
  },
  {
    id: "LK-6",
    name: "North Western",
    capital: "Kurunegala",
    districts: ["Kurunegala", "Puttalam"],
    keywords: ["kurunegala", "puttalam", "north western"],
    population_approx: "2.4M",
  },
  {
    id: "LK-7",
    name: "North Central",
    capital: "Anuradhapura",
    districts: ["Anuradhapura", "Polonnaruwa"],
    keywords: ["anuradhapura", "polonnaruwa", "north central"],
    population_approx: "1.3M",
  },
  {
    id: "LK-8",
    name: "Uva",
    capital: "Badulla",
    districts: ["Badulla", "Monaragala"],
    keywords: ["badulla", "monaragala", "uva"],
    population_approx: "1.3M",
  },
  {
    id: "LK-9",
    name: "Sabaragamuwa",
    capital: "Ratnapura",
    districts: ["Ratnapura", "Kegalle"],
    keywords: ["ratnapura", "kegalle", "sabaragamuwa"],
    population_approx: "2.0M",
  },
];

export function getRegion(id: string): Region | undefined {
  const normalized = id.toUpperCase().replace(/^LK-?/, "LK-");
  return PROVINCES.find((p) => p.id === normalized || p.id === `LK-${id}`);
}

export function regionSearchQuery(region: Region): string {
  return region.keywords.join(" ");
}
