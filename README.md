# Lanka Platform

Vercel-native Sri Lanka open data portal — federates [nuuuwan](https://github.com/nuuuwan)'s 379-repo ecosystem.

**No external API required.** All `/api/v1/*` routes run as Next.js Route Handlers on Vercel.

## Quick start

```bash
npm install
npm run catalog:sync   # refresh 379 repos from GitHub (needs gh CLI)
npm run web:dev        # http://localhost:3000
```

## Deploy

```bash
vercel deploy --prod
```

Single Vercel project — web + API together.

## API (built-in)

- `GET /api/v1/stats` — platform stats
- `GET /api/v1/datasets` — browse catalog
- `GET /api/v1/search?q=` — keyword search
- `GET /api/v1/analytics/news/timeline` — live news from lk_news TSV
- `GET /api/v1/cabinet/search?q=` — cabinet decision search
- `POST /api/v1/rag/legal` — legal corpus routing
