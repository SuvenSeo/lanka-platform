# Lanka Platform — Roadmap

**Live:** https://lanka-platform-sand.vercel.app  
**Stack:** Next.js 15 on Vercel (web + API unified)

## Completed phases

| Phase | Status | Summary |
|-------|--------|---------|
| A–D | ✅ | Catalog, search, news, cabinet, legal RAG, dataset previews |
| 6 | ✅ | Live data proxy, cabinet search, federation overview |
| 7 | ✅ | data.gov.lk CKAN, LDFLK catalog, provenance, RTI hub |
| 8 | ✅ | Trilingual i18n (si/ta/en) + locale switcher |
| 9 | ✅ | Geo spine, `/regions/[id]` provincial hubs |
| 10 | ✅ | Multi-corpus RAG (acts, news, hansard) |
| 11 | ✅ | Citizen alerts, fuel, transport pages |
| 12 | ✅ | TypeScript SDK, `/developers`, OpenAPI spec |
| 13 | ✅ | Manifesto accountability tracker |
| 14 | ✅ | CI workflow, PWA manifest, health endpoint |

## API routes

- `GET /api/v1/stats`, `/domains`, `/datasets`, `/search`
- `GET /api/v1/analytics/news/timeline`
- `GET /api/v1/cabinet/search`
- `GET /api/v1/federation`, `/federation/datagov`, `/federation/ldflk`
- `POST /api/v1/rag/legal`, `/rag/query`
- `GET /api/v1/rag/corpora`, `/health`
- `GET /api/openapi.json`

## Future enhancements

- Meilisearch Cloud for sub-50ms search at scale
- Full LDFLK auto-sync from GitHub (175 datasets)
- LLM synthesis layer with citations
- WhatsApp/Telegram alert bot
- Mobile app (React Native)
- Postgres for API keys and saved searches
