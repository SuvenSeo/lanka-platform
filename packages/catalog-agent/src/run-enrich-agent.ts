/**
 * Enrich dataset descriptions using Cursor SDK — reviews catalog gaps.
 * Usage: npm run enrich --workspace=@lanka/catalog-agent
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Agent, CursorAgentError } from "@cursor/sdk";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error("CURSOR_API_KEY required");
    process.exit(1);
  }

  const catalog = JSON.parse(
    readFileSync(join(root, "apps/web/data/datasets.json"), "utf-8"),
  ) as { datasets: Array<{ id: string; name: string; description: string; status: string }> };

  const stubs = catalog.datasets
    .filter((d) => d.status === "active" && !d.description?.trim())
    .slice(0, 15)
    .map((d) => d.id);

  const prompt = `Review these active nuuuwan datasets with empty descriptions and draft English descriptions (max 120 chars each):

${stubs.join("\n")}

Context: Sri Lanka open data — legal, news, elections, environment, transport.
Output as JSON array: [{ "id": "...", "description": "..." }]`;

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: root, settingSources: [] },
    });

    if (result.status === "error") {
      console.error("Enrich agent failed");
      process.exit(2);
    }

    console.log(result.result);
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(err.message);
      process.exit(1);
    }
    throw err;
  }
}

main();
