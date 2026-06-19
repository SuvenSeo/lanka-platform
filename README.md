# Lanka Platform

Vercel-native Sri Lanka open data portal — federates [nuuuwan](https://github.com/nuuuwan)'s 379-repo ecosystem.

**No external API required.** All `/api/v1/*` routes run as Next.js Route Handlers on Vercel.

**Live:** https://lanka-platform-sand.vercel.app

## Environment

Copy `.env.example` to `apps/web/.env.local` (or set in Vercel):

| Variable | Purpose |
|----------|---------|
| `CRON_SECRET` | Protect `/api/cron/sync` (required on Vercel production) |
| `BLOB_READ_WRITE_TOKEN` | Persistent sync cache |
| `MEILISEARCH_URL` + `MEILISEARCH_API_KEY` | Fast search |
| `OPENAI_API_KEY` | LLM synthesis with citations |
| `CURSOR_API_KEY` + `ADMIN_SECRET` | Catalog agent |

## Quick start

```bash
npm install
npm run catalog:sync   # refresh 379 repos from GitHub (needs gh CLI)
npm run web:dev        # http://localhost:3000
```

## Pages

`/datasets` · `/search` · `/news` · `/legal` · `/cabinet` · `/map` · `/regions/LK-1` · `/elections` · `/government` · `/environment` · `/alerts` · `/fuel` · `/transport` · `/manifesto` · `/rti` · `/developers`

## Deploy

Push to `master` — Vercel auto-deploys from GitHub.

## API (built-in)

- `GET /api/v1/stats` — platform stats
- `GET /api/v1/datasets` — browse catalog
- `GET /api/v1/search?q=` — keyword search
- `GET /api/v1/analytics/news/timeline` — live news from lk_news TSV
- `GET /api/v1/cabinet/search?q=` — cabinet decision search
- `GET /api/v1/federation/datagov?q=` — data.gov.lk CKAN search
- `POST /api/v1/rag/query` — multi-corpus document search (acts/news/hansard)
- `POST /api/v1/rag/legal` — legal corpus routing
- `GET /api/v1/health` — health check
- `GET /api/v1/sync/status` — last cron sync status
- `GET /api/v1/fuel?sample=30` — fuel shed status sample
- `GET /api/v1/elections/highlights` — election results highlights
- `GET /api/v1/live/{datasetId}` — live synced dataset

## SDK

```typescript
import { createLankaClient } from "@lanka/sdk";
const lanka = createLankaClient("https://lanka-platform-sand.vercel.app");
await lanka.stats();
```

See [docs/ROADMAP.md](docs/ROADMAP.md) for full phase history.
