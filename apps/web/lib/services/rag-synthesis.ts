/**
 * Optional LLM synthesis over RAG chunks with numbered citations.
 */
import type { ChunkResult } from "./chunk-rag";

export type SynthesisCitation = {
  index: number;
  chunk_id: string;
  title: string;
  source_url?: string;
  corpus: string;
};

export type SynthesisResult = {
  answer: string;
  citations: SynthesisCitation[];
  model: string;
  engine: "openai";
};

export function isSynthesisConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function synthesizeFromChunks(
  question: string,
  chunks: ChunkResult[],
): Promise<SynthesisResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || chunks.length === 0) return null;

  const context = chunks
    .map((c, i) => `[${i + 1}] (${c.corpus}) ${c.title}\n${c.snippet}`)
    .join("\n\n");

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a research assistant for Sri Lanka public data. Answer only from the provided excerpts. " +
            "Cite sources inline as [1], [2], etc. Be concise and factual. If sources are insufficient, say so.",
        },
        { role: "user", content: `Question: ${question}\n\nSources:\n${context}` },
      ],
      temperature: 0.2,
      max_tokens: 900,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) return null;

  const citations: SynthesisCitation[] = chunks.map((c, i) => ({
    index: i + 1,
    chunk_id: c.chunk_id,
    title: c.title ?? "",
    source_url: c.source_url,
    corpus: c.corpus,
  }));

  return { answer, citations, model, engine: "openai" };
}
