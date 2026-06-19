import type { Dataset } from "@/lib/catalog";

export function getDatasetProvenance(dataset: Dataset) {
  return {
    dataset_id: dataset.id,
    source_repo: dataset.source_repo,
    source_url: dataset.source_url ?? `https://github.com/${dataset.source_repo}`,
    license: "MIT (nuuuwan ecosystem)",
    citation: "arXiv:2510.04124",
    languages: dataset.languages ?? ["si", "ta", "en"],
    update_cadence: dataset.update_cadence ?? "varies",
    last_github_update: dataset.github_updated_at,
    huggingface: dataset.huggingface_id
      ? `https://huggingface.co/datasets/${dataset.huggingface_id}`
      : undefined,
    pypi: dataset.pypi_package,
    provenance_chain: [
      { step: "scrape", actor: dataset.source_repo },
      { step: "index", actor: "lanka-platform" },
      { step: "serve", actor: "vercel-native API" },
    ],
    suggest_correction: "https://github.com/nuuuwan/lk_datasets/issues",
    icta_request: "https://www.data.gov.lk/en/request-dataset",
  };
}
