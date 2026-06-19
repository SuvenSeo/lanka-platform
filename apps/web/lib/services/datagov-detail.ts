import { fetchRemoteJson } from "./remote-fetch";

const CKAN = "https://data.gov.lk/api/3/action";

type PackageShow = {
  success: boolean;
  result?: {
    name: string;
    title: string;
    notes?: string;
    organization?: { title?: string };
    resources?: Array<{
      id: string;
      name?: string;
      format?: string;
      url?: string;
      last_modified?: string;
    }>;
  };
};

export async function getDatagovPackage(name: string) {
  const data = await fetchRemoteJson<PackageShow>(
    `${CKAN}/package_show?id=${encodeURIComponent(name)}`,
    { revalidate: 3600 },
  );
  if (!data.result) throw new Error("Package not found");
  return data.result;
}

export async function fetchDatagovResource(url: string, format?: string) {
  const text = await (await import("./remote-fetch")).fetchRemoteText(url, { revalidate: 3600 });
  const fmt = (format ?? "").toUpperCase();
  if (fmt === "JSON" || url.endsWith(".json")) {
    return { format: "json" as const, data: JSON.parse(text) };
  }
  if (fmt === "CSV" || url.endsWith(".csv")) {
    const lines = text.trim().split("\n");
    const header = lines[0]?.split(",") ?? [];
    const rows = lines.slice(1, 201).map((line) => {
      const cols = line.split(",");
      const row: Record<string, string> = {};
      header.forEach((h, i) => {
        row[h.trim()] = cols[i]?.trim() ?? "";
      });
      return row;
    });
    return { format: "csv" as const, header, rows };
  }
  return { format: "text" as const, text: text.slice(0, 20_000) };
}
