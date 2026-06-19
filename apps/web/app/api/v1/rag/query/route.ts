import { routeQuery, type CorpusId } from "@/lib/services/chunk-rag";
import { jsonError, jsonOk } from "../../_lib/response";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string; corpus?: string; limit?: number };
    const question = body.question?.trim();
    if (!question) return jsonError("question is required", 400);

    const corpus = body.corpus as CorpusId | undefined;
    const valid: CorpusId[] = ["acts", "news", "hansard"];
    const chosen = corpus && valid.includes(corpus) ? corpus : undefined;

    return jsonOk(await routeQuery(question, body.limit ?? 8, chosen));
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "RAG query failed", 500);
  }
}
