import { queryLegal } from "@/lib/services/platform";
import { jsonError, jsonOk } from "../../_lib/response";

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = (await request.json()) as { question?: string; deep?: boolean };
  const question = body.question?.trim() ?? "";
  if (question.length < 3) return jsonError("Question must be at least 3 characters", 400);
  return jsonOk(await queryLegal(question, body.deep ?? false));
}
