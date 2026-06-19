import { Agent, CursorAgentError } from "@cursor/sdk";
import { NextResponse } from "next/server";

export const maxDuration = 300;

/** Vercel serverless: uses Cursor Cloud agent (not local executor). */
export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET ?? process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "CURSOR_API_KEY not configured on server" },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { task?: string };
  const task =
    body.task ??
    "Audit Lanka Platform catalog sync manifest and report datasets missing live data files.";

  const repo = process.env.VERCEL_GIT_REPO_SLUG
    ? `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : "https://github.com/SuvenSeo/lanka-platform";

  try {
    const result = await Agent.prompt(
      `${task}\n\nRepository: ${repo}\nFocus on apps/web and packages/catalog-agent.`,
      {
        apiKey,
        model: { id: "composer-2.5" },
        cloud: {
          repos: [{ url: repo, startingRef: process.env.VERCEL_GIT_COMMIT_REF ?? "master" }],
        },
      },
    );

    if (result.status === "error") {
      return NextResponse.json({ error: "Agent run failed", run_id: result.id }, { status: 500 });
    }

    return NextResponse.json({
      status: result.status,
      report: result.result,
      run_id: result.id,
      runtime: "cloud",
    });
  } catch (err) {
    if (err instanceof CursorAgentError) {
      return NextResponse.json(
        { error: err.message, retryable: err.isRetryable },
        { status: 502 },
      );
    }
    throw err;
  }
}
