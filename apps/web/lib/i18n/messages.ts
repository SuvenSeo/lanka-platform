export type Locale = "en" | "si" | "ta";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
];

export const DEFAULT_LOCALE: Locale = "en";

export const messages = {
  en: {
    platform: "Sri Lanka Open Data Platform",
    tagline: "Federated portal over nuuuwan's 379-repo ecosystem — legal, news, elections, environment, and more.",
    nav: {
      datasets: "Datasets",
      search: "Search",
      news: "News",
      legal: "Legal",
      cabinet: "Cabinet",
      map: "Map",
      elections: "Elections",
      apps: "Apps",
      government: "Government",
      environment: "Environment",
      alerts: "Alerts",
      developers: "Developers",
      manifesto: "Manifesto",
      rti: "RTI",
    },
    explore: "Explore",
    domains: "Domains",
    featured: "Featured datasets",
    footer: "Sri Lanka Open Data",
  },
  si: {
    platform: "ශ්‍රී ලංකා විවෘත දත්ත වේදිකාව",
    tagline: "nuuuwan ගේ 379-repo පරිසරය මත ගොඩනැගූ සම්බන්ධිත දත්ත ද්වාරය — නීති, පුවත්, මැතිවරණ, පරිසරය.",
    nav: {
      datasets: "දත්ත කට්ටල",
      search: "සෙවීම",
      news: "පුවත්",
      legal: "නීතිමය",
      cabinet: "ආණ්ඩුව",
      map: "සිතියම",
      elections: "මැතිවරණ",
      apps: "යෙදුම්",
      government: "රජය",
      environment: "පරිසරය",
      alerts: "අනතුරු ඇඟවීම්",
      developers: "සංවර්ධකයින්",
      manifesto: "ජනපති ප්‍රකාශනය",
      rti: "තොරතුරු අයිතිය",
    },
    explore: "ගවේෂණය",
    domains: "වසංගත",
    featured: "විශේෂිත දත්ත කට්ටල",
    footer: "ශ්‍රී ලංකාවේ විවෘත දත්ත",
  },
  ta: {
    platform: "இலங்கை திறந்த தரவு தளம்",
    tagline: "nuuuwan இன் 379-repo சுற்றுச்சூழலில் ஒருங்கிணைந்த தரவு வாயில் — சட்டம், செய்திகள், தேர்தல், சுற்றுச்சூழல்.",
    nav: {
      datasets: "தரவுத்தொகுப்புகள்",
      search: "தேடல்",
      news: "செய்திகள்",
      legal: "சட்டம்",
      cabinet: "அமைச்சரவை",
      map: "வரைபடம்",
      elections: "தேர்தல்",
      apps: "பயன்பாடுகள்",
      government: "அரசு",
      environment: "சுற்றுச்சூழல்",
      alerts: "எச்சரிக்கைகள்",
      developers: "உருவாக்குனர்கள்",
      manifesto: "கொள்கை அறிக்கை",
      rti: "தகவல் உரிமை",
    },
    explore: "ஆராயுங்கள்",
    domains: "துறைகள்",
    featured: "சிறப்பு தரவுத்தொகுப்புகள்",
    footer: "இலங்கை திறந்த தரவு",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];

export function t(locale: Locale, key: string): string {
  const parts = key.split(".");
  let node: unknown = messages[locale];
  for (const p of parts) {
    if (node && typeof node === "object" && p in node) {
      node = (node as Record<string, unknown>)[p];
    } else {
      node = messages.en;
      for (const fp of parts) {
        if (node && typeof node === "object" && fp in node) {
          node = (node as Record<string, unknown>)[fp];
        } else {
          return key;
        }
      }
      break;
    }
  }
  return typeof node === "string" ? node : key;
}
