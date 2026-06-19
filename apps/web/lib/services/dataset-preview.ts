import { getDataset } from "@/lib/catalog";

const LIVE_PATHS = ["docs_last100.tsv", "docs_last1000.tsv", "summary.json", "README.md"];

export async function fetchDatasetPreview(datasetId: string) {
  const ds = getDataset(datasetId);
  if (!ds) return { error: `Dataset '${datasetId}' not found` };

  const repo = ds.source_repo;
  const branch = ds.data_branch ?? "data";
  const base = `https://raw.githubusercontent.com/${repo}`;

  const preview: Record<string, unknown> = {
    id: datasetId,
    name: ds.name,
    description: ds.description,
    domain: ds.domain,
    doc_count: ds.doc_count,
    links: {
      github: `https://github.com/${repo}`,
      huggingface: ds.huggingface_id
        ? `https://huggingface.co/datasets/${ds.huggingface_id}`
        : null,
      live_app: ds.live_app_url ?? null,
    },
  };

  for (const branchName of ["main", "master", branch]) {
    try {
      const readmeRes = await fetch(`${base}/${branchName}/README.md`, {
        next: { revalidate: 3600 },
      });
      if (readmeRes.ok) {
        preview.readme_excerpt = (await readmeRes.text()).slice(0, 3000);
        break;
      }
    } catch {
      /* try next branch */
    }
  }

  for (const file of LIVE_PATHS) {
    for (const p of [`${base}/${branch}/${file}`, `${base}/${branch}/data/${datasetId}/${file}`]) {
      try {
        const res = await fetch(p, { next: { revalidate: 600 } });
        if (!res.ok) continue;
        if (file.endsWith(".tsv")) {
          const lines = (await res.text()).trim().split("\n");
          const header = lines[0]?.split("\t") ?? [];
          const rows = lines.slice(1, 11).map((line) => {
            const cols = line.split("\t");
            const row: Record<string, string> = {};
            header.forEach((h, i) => {
              row[h] = cols[i] ?? "";
            });
            return row;
          });
          preview.live_sample = { format: "tsv", source_url: p, header, rows };
          return preview;
        }
        if (file.endsWith(".json")) {
          preview.live_sample = { format: "json", source_url: p, data: await res.json() };
          return preview;
        }
        preview.live_sample = {
          format: "markdown",
          source_url: p,
          text: (await res.text()).slice(0, 4000),
        };
        return preview;
      } catch {
        /* next path */
      }
    }
  }

  return preview;
}
