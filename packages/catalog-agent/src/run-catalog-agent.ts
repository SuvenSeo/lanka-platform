/**
 * Run nuuuwan catalog sync via Cursor SDK agent.
 * Requires: CURSOR_API_KEY, gh CLI authenticated
 *
 * Usage: npm run sync --workspace=@lanka/catalog-agent
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Agent, CursorAgentError } from "@cursor/sdk";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");

async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error("CURSOR_API_KEY required — get one at https://cursor.com/dashboard/integrations");
    process.exit(1);
  }

  console.log("Running catalog sync script...");
  execSync("node scripts/sync-catalog.mjs", { cwd: root, stdio: "inherit" });

  const catalogPath = join(root, "apps/web/data/datasets.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
    datasets: unknown[];
    synced_at: string;
  };

  const prompt = `You are maintaining Lanka Platform — a Sri Lanka open data portal federating nuuuwan's repos.

Catalog just synced: ${catalog.datasets.length} datasets at ${catalog.synced_at}.

Tasks:
1. Identify the top 10 highest-value active datasets missing rich descriptions
2. Suggest trilingual (si/ta/en) one-line descriptions for each
3. Flag any datasets that should be added to the priority sync manifest (news, legal, elections, environment)
4. Output a concise markdown report — do NOT modify files unless critical issues found

Repo root: ${root}`;

  try {
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: root, settingSources: [] },
    });

    if (result.status === "error") {
      console.error("Agent run failed:", result.id);
      process.exit(2);
    }

    console.log("\n--- Catalog Agent Report ---\n");
    console.log(result.result ?? "(no output)");
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error("Agent startup failed:", err.message, "retryable=", err.isRetryable);
      process.exit(1);
    }
    throw err;
  }
}

main();
