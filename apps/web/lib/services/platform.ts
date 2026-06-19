import { getDataset, getDatasets } from "@/lib/catalog";
import { queryActsRag } from "@/lib/services/acts-rag";
import { routeQuery } from "@/lib/services/chunk-rag";

export function getElectionsOverview() {
  const electionDatasets = getDatasets({ q: "election", limit: 24 }).datasets;
  return {
    title: "Sri Lanka Elections",
    description: "Election data from 1947–2025 via nuuuwan's elections_lk ecosystem.",
    live_app: "https://nuuuwan.github.io/election",
    pypi: "elections_lk-nuuuwan",
    datasets: electionDatasets,
    years_covered: "1947–2025",
    types: ["Presidential", "Parliamentary", "Provincial", "Local Government"],
  };
}

export function getCabinetOverview() {
  const cabinet = getDataset("lk_cabinet_decisions");
  return {
    description: "Track government decisions and manifesto accountability.",
    cabinet_dataset: cabinet,
    manifesto_monitoring: {
      name: "NPP Manifesto vs Cabinet",
      description: "Embedding-based matching of 2024 manifesto promises to cabinet actions.",
      note: "Paused Oct 2025 — unique accountability layer worth reviving.",
      github_url: "https://github.com/nuuuwan/manifesto_monitoring",
    },
    sample_topics: [
      "economic policy",
      "education reform",
      "infrastructure",
      "agriculture",
      "health",
      "defence",
    ],
  };
}

export function getGeoLayers() {
  const provinces = [
    { id: "LK-1", name: "Western", capital: "Colombo" },
    { id: "LK-2", name: "Central", capital: "Kandy" },
    { id: "LK-3", name: "Southern", capital: "Galle" },
    { id: "LK-4", name: "Northern", capital: "Jaffna" },
    { id: "LK-5", name: "Eastern", capital: "Trincomalee" },
    { id: "LK-6", name: "North Western", capital: "Kurunegala" },
    { id: "LK-7", name: "North Central", capital: "Anuradhapura" },
    { id: "LK-8", name: "Uva", capital: "Badulla" },
    { id: "LK-9", name: "Sabaragamuwa", capital: "Ratnapura" },
  ];
  return {
    provinces_list: provinces,
    region_id_format: "DCS region_id (e.g. LK-1 = Western Province)",
    topojson: {
      provinces:
        "https://raw.githubusercontent.com/nuuuwan/lk_admin_regions/main/data/geo/provinces.topojson",
      districts:
        "https://raw.githubusercontent.com/nuuuwan/lk_admin_regions/main/data/geo/districts.topojson",
    },
    locator_app: "https://nuuuwan.github.io/lk_locator/",
  };
}

export function getFederationOverview() {
  return {
    title: "Federated Data Sources",
    sources: [
      {
        id: "nuuuwan",
        name: "nuuuwan ecosystem",
        description: "379 GitHub repos, 269K+ documents, daily pipelines",
        url: "https://github.com/nuuuwan",
        type: "community",
        api: "/api/v1/datasets",
      },
      {
        id: "datagov_lk",
        name: "Sri Lanka Open Data Portal",
        description: "Official ICTA government open data (CKAN)",
        url: "https://data.gov.lk",
        type: "government",
        api: "/api/v1/federation/datagov",
      },
      {
        id: "ldflk",
        name: "Lanka Data Foundation",
        description: "175+ cleaned ministry datasets (2020–2025)",
        url: "https://ldflk.github.io/datasets/",
        type: "civic",
        api: "/api/v1/federation/ldflk",
      },
    ],
    suggest_dataset: "https://www.data.gov.lk/en/request-dataset",
    rti_hub: "/rti",
    trilingual_note:
      "Lanka Platform prioritises සිංහල · தமிழ் · English access — addressing the English-only gap in official digitalisation.",
  };
}

export async function queryLegal(question: string, deep = false) {
  const matched = getDatasets({ domain: "legal", q: question, limit: 12 }).datasets;

  const result: Record<string, unknown> = {
    question,
    answer_summary: `Found ${matched.length} legal corpus match(es) for "${question}".`,
    matched_datasets: matched.map((d) => ({
      dataset_id: d.id,
      name: d.name,
      description: d.description,
      github_url: `https://github.com/${d.source_repo}`,
      huggingface_url: d.huggingface_id
        ? `https://huggingface.co/datasets/${d.huggingface_id}`
        : undefined,
      doc_count: d.doc_count,
    })),
    deep,
    engine: "vercel-native",
  };

  if (deep) {
    try {
      const routed = await routeQuery(question, 10);
      result.deep_rag = {
        answer: routed.answer,
        corpus: routed.corpus,
        chunks: routed.chunks.map((c) => ({
          chunk_id: c.chunk_id,
          act_description: c.title,
          snippet: c.snippet,
          act_source_url: c.source_url,
          score: c.score,
          corpus: c.corpus,
        })),
        source: `nuuuwan/lk-${routed.corpus}-chunks`,
        engine: routed.engine,
      };
      if (routed.chunks.length > 0) {
        result.answer_summary = routed.answer.slice(0, 500);
      } else {
        const rag = await queryActsRag(question, 10);
        result.deep_rag = {
          answer: rag.answer,
          corpus: "acts",
          chunks: rag.chunks.map((c) => ({
            chunk_id: c.chunk_id,
            act_description: c.act_description,
            snippet: c.snippet,
            act_source_url: c.act_source_url,
            score: c.score,
            corpus: "acts",
          })),
          source: rag.source,
          engine: rag.engine,
        };
        result.answer_summary = rag.answer.slice(0, 500);
      }
    } catch (e) {
      result.deep_rag = {
        answer: `Deep search unavailable: ${e instanceof Error ? e.message : "error"}. Showing catalog matches.`,
        chunks: matched.slice(0, 5).map((d, i) => ({
          chunk_id: `${d.id}-${i}`,
          act_description: d.name,
          snippet: d.description,
          act_source_url: `https://github.com/${d.source_repo}`,
        })),
        engine: "catalog-fallback",
      };
    }
  }

  return result;
}
