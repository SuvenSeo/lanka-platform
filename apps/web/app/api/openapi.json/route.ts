import { NextResponse } from "next/server";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Lanka Platform API",
    version: "0.3.0",
    description: "Vercel-native Sri Lanka open data federation API",
  },
  servers: [{ url: "https://lanka-platform-sand.vercel.app" }],
  paths: {
    "/api/v1/stats": { get: { summary: "Platform statistics" } },
    "/api/v1/datasets": { get: { summary: "List datasets" } },
    "/api/v1/search": { get: { summary: "Keyword search" } },
    "/api/v1/cabinet/search": { get: { summary: "Cabinet decision search" } },
    "/api/v1/analytics/news/timeline": { get: { summary: "News timeline" } },
    "/api/v1/rag/query": { post: { summary: "Multi-corpus RAG query" } },
    "/api/v1/rag/legal": { post: { summary: "Legal research" } },
    "/api/v1/federation/datagov": { get: { summary: "data.gov.lk CKAN search" } },
    "/api/v1/federation/ldflk": { get: { summary: "LDFLK datasets" } },
    "/api/v1/health": { get: { summary: "Health check" } },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
