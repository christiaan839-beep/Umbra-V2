# CLAUDE.md — Umbra V2 (Sovereign Matrix)

Guidance for AI assistants working in this repo. Everything below is verified against the
actual source — when in doubt, read the file, don't assume.

> Naming note: the GitHub repo is `christiaan839-beep/umbra-v2` and `deploy.sh` calls the
> deployment "UMBRA V3", but `package.json` declares `"name": "sovereign-v2"` and most code,
> branding, and comments refer to **"Sovereign Matrix"**. Treat "Umbra" and "Sovereign Matrix"
> as the same product.

## Project overview

Next.js 16 (App Router) SaaS platform marketed as an "autonomous AI marketing workforce."
The core of the app is a large fleet of HTTP "agent" endpoints under `src/app/api/agents/`
(81 agent directories, ~121 total `route.ts` files) that call LLMs through a single unified
router, plus a marketing site, client/dashboard portals, a Drizzle/Postgres data layer, and a
set of standalone Python "swarm" daemons under `server/python-agents/` (not bundled into the
Next.js build).

The product framing in `README.md` is heavy marketing copy ("market domination", "extinction
calculators"). Ignore the theatrics — the engineering reality is a Next.js app + Postgres +
multi-provider LLM routing.

## Tech stack

- **Framework:** Next.js `16.1.6` (App Router) + React `19.2.3`
- **Language:** TypeScript `^5.9.3` (ESM, `moduleResolution: bundler`)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/postcss`), Framer Motion, Lucide icons
- **3D / visual:** three.js, `@react-three/fiber` + drei, `cobe`, `three-globe`, `@xyflow/react`
- **Database:** PostgreSQL via Neon Serverless (`@neondatabase/serverless`)
- **ORM:** Drizzle ORM `^0.45.1` + drizzle-kit `^0.31.9`
- **Auth:** Clerk (`@clerk/nextjs` ^7)
- **Vector memory:** Pinecone (`@pinecone-database/pinecone`)
- **AI SDKs:** `@anthropic-ai/sdk`, `@google/generative-ai`, `@ai-sdk/google`, `ai` (Vercel AI SDK),
  plus NVIDIA NIM accessed via raw `fetch` (see `src/lib/nvidia.ts`)
- **Web search:** Tavily (`@tavily/core`)
- **Realtime / comms:** Pusher, `ws`, Twilio, Resend (email)
- **Cache / KV:** Upstash Redis, `@vercel/kv`
- **Deploy target:** Vercel (primary) and Google Cloud Run / Docker (`deploy.sh`, `docker-compose.yml`)

## Key commands (verbatim from `package.json` scripts)

```bash
npm run dev      # next dev  — local dev server (http://localhost:3000)
npm run build    # next build
npm run start    # next start  — serve production build
npm run lint     # eslint
npm run ws       # ts-node server/ws.ts  — standalone WebSocket voice daemon
npm test         # vitest run  — test suite
```

Notes / gotchas about commands:
- `README.md` and `boot_matrix.sh` show `bun run dev` / `npm run dev`; either works, but the
  defined scripts use **npm**. There is no `bun.lockb` — `package-lock.json` is the lockfile.
- There is **no `db` / migration npm script.** Drizzle is driven directly via the CLI:
  ```bash
  npx drizzle-kit generate   # generate SQL migrations from src/db/schema.ts
  npx drizzle-kit push       # push schema to the DB
  ```
- `boot_matrix.sh` boots the Python swarm + `npm run dev` together (macOS-oriented; expects a
  `server/python-agents/venv`). It is convenience tooling, not required for normal web work.

## Directory structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/
│   │   ├── agents/         # 81 LLM agent endpoints (closer, content, leads, nemoclaw, …)
│   │   └── <feature>/      # ai, checkout, payments, webhooks, cron, health, settings, user, …
│   ├── dashboard/ client/ client-portal/ portal/   # authed app surfaces
│   ├── (marketing pages)   # about, blog, pricing, case-studies, locations, demo, roi, scan, …
│   ├── layout.tsx page.tsx globals.css
│   ├── robots.ts sitemap.ts
│   └── not-found.tsx
├── agents/                 # agent persona/orchestration modules (closer, coder, designer,
│                           #   orchestrator, war-room, prospector, seo-dominator, ghost-mode, …)
├── components/             # React UI (3d/, dashboard/, sovereign/, ui/, providers/, …)
├── db/                     # schema.ts (Drizzle source of truth) + index.ts (Neon client)
├── lib/                    # ~30 shared modules — see "Lib" below
│   └── agents/             # governor.ts, memory-router.ts
├── hooks/                  # useUsage.ts
├── types/                  # index.ts (AIOptions, etc.)
├── middleware.ts           # edge middleware (rate limit + A/B testing)
└── __tests__/              # api.test.ts (vitest)
server/
├── ws.ts                   # WebSocket voice daemon (run via `npm run ws`)
├── Dockerfile              # builds the ws.ts daemon
├── python-agents/          # standalone Python swarm (NOT bundled in Next.js)
├── pdf-generator/  n8n/
scripts/                    # shell/js/py helpers (telegram, n8n import, war_room_stream, …)
public/                     # static assets
drizzle.config.ts           # drizzle-kit config (out: ./drizzle, dialect: postgresql)
docker-compose.yml          # web + postgres + nemoclaw-daemon + n8n
deploy.sh                   # gcloud Cloud Run deploy
boot_matrix.sh              # local "boot everything" script (macOS)
nemo_ghost.py               # standalone computer-use / GUI-automation stub
```

## AI routing — the most important architecture detail

**`src/lib/ai.ts` is the single entry point for LLM calls.** Prefer it over hand-rolling
provider SDK calls. Its `ai(prompt, options)` routes by priority:

1. **Ollama** (local, $0) — if a user has an `ollama` key configured
2. **NVIDIA NIM** (free open-source models, e.g. `nvidia/llama-3.1-nemotron-ultra-253b`) — when
   `model === "nim"` or a user NVIDIA key is present
3. **Claude** (`claude-sonnet-4-20250514`) — BYOK / when `model === "claude"`
4. **Gemini** (`gemini-2.0-flash`) — default

Other exports in `ai.ts`: `research_ai()` (Tavily web search + synthesis), `adaptive_ai()`
(injects learned directives recalled from Pinecone), `embed()` (Gemini `text-embedding-004`).

**BYOK (bring-your-own-key) is central.** Per-user API keys are stored as a JSON string in the
`settings.apiKeys` column and read via `getUserKeys()` (in `ai.ts`) / `getNimKey()` (in
`nvidia.ts`). When adding agent routes, pull keys through these helpers rather than reading
`process.env` directly — recent commits ("Batch BYOK upgrade", "zero raw env var references")
deliberately migrated agents onto `getNimKey()`. Note: some older routes (e.g.
`api/agents/closer/route.ts`) still hit Gemini via raw `fetch` + `process.env.GEMINI_API_KEY`;
that's legacy, not the pattern to copy.

Direct NIM calls go through `nimChat(model, messages, options)` in `src/lib/nvidia.ts`.

## `src/lib/` — shared modules (read before reimplementing)

- **AI / agents:** `ai.ts`, `nvidia.ts`, `llm-router.ts`, `factory.ts`, `swarm.ts`,
  `agent-auth.ts`, `agent-reliability.ts`, `agents/governor.ts`, `agents/memory-router.ts`
- **Data / memory:** `db.ts`, `persist.ts`, `memory.ts`, `pinecone.ts`, `cache.ts`
- **Security / guards:** `auth-guard.ts` (`requireAuth()`), `api-guard.ts`, `validation.ts`,
  `rate-limit.ts`, `env.ts` (`validateEnv()`, `getRequiredEnv()`, `getOptionalEnv()`)
- **Domain:** `clients.ts`, `competitor.ts`, `content-engine.ts`, `payments.ts`, `email.ts`,
  `events.ts`, `webhooks.ts`, `whatsapp-agent.ts`, `pusher.ts`

`requireAuth()` (from `auth-guard.ts`) is the standard auth pattern for protected routes:
```ts
const auth = await requireAuth();
if (auth.error) return auth.error;
const email = auth.email;
```

## Database / schema

- **Source of truth:** `src/db/schema.ts` (Drizzle pgTable definitions). The DB client is
  `src/db/index.ts` (Neon HTTP + drizzle, schema-bound — use `db.query.<table>`).
- **Tables:** `tenants`, `activeSwarms`, `globalTelemetry`, `users`, `settings`,
  `scheduledContent`, `whitelabelConfig`, `customSkills`, `bookings`, `leads`, `adCreatives`,
  `emailSequences`, `sequenceSteps`, `generations`, `voiceCalls`.
- **`settings`** is keyed by `userEmail` (unique, no formal FK) and holds three JSON-string
  columns: `config`, `apiKeys` (BYOK vault), `webhooks`. Always `JSON.parse` them.
- Migrations are configured to output to `./drizzle` (per `drizzle.config.ts`), but **no
  `drizzle/` migration folder is checked in yet** — generate with `npx drizzle-kit generate`.
- `src/db/index.ts` falls back to a dummy connection string when `DATABASE_URL` is unset so the
  Vercel static build phase doesn't crash. Don't remove that fallback.

## Middleware (`src/middleware.ts`)

Edge middleware matches `/landing/:path*` and `/api/agents/:path*`. It does:
- **Rate limiting** on `/api/agents/*`: in-memory map, **100 req/min per client** (keyed by
  `x-api-key` header or IP), returns 429 over the limit. This is per-edge-instance and not
  durable — for hard limits use `lib/rate-limit.ts` (Upstash).
- Adds `X-Sovereign-*` metering headers and permissive CORS (`Access-Control-Allow-Origin: *`)
  for external integrations (Zapier/Make/n8n).
- **A/B testing** on `/landing/*`: assigns a `sovereign_cohort` cookie and rewrites the path.

## Build & deploy

- **Next config (`next.config.ts`):** `output: "standalone"`; `typescript.ignoreBuildErrors:
  true` (TS errors do **not** fail the build — don't rely on `next build` for type safety, run
  `npx tsc --noEmit` if you need it); `compress`, `experimental.optimizeCss`; security headers
  (X-Frame-Options DENY, HSTS, nosniff, etc.); rewrite `/client/:id/:path*` → `/portal/:id/:path*`.
- **Vercel** is the primary target (the app is edge/serverless-oriented).
- **Cloud Run:** `./deploy.sh` builds via `gcloud builds submit` and `gcloud run deploy`
  (us-central1, 4 CPU / 8Gi, 3600s timeout, `--allow-unauthenticated`). Requires prior
  `gcloud auth login` + project set.
- **docker-compose** runs four services: `sovereign-matrix` (Next.js, port 3000),
  `db` (postgres:15-alpine, port 5432), `nemoclaw-daemon` (Python, privileged), `n8n` (5678).
  ⚠️ The web service's `build.dockerfile: Dockerfile` references a **root `Dockerfile` that does
  not exist** in the repo (only `server/Dockerfile` and `server/python-agents/Dockerfile*`
  exist). `docker-compose up --build` will fail until a root Dockerfile is added.

## Testing & linting

- **Tests:** Vitest (`npm test` → `vitest run`). Only `src/__tests__/api.test.ts` exists today;
  it imports route modules via the `@/` alias and asserts handler exports / response shapes with
  mocked `db`. There is no `vitest.config.*` file — config is implicit. `tsconfig.json` excludes
  `src/__tests__` and `server` from the TS program.
- **Lint:** flat config in `eslint.config.mjs` (extends `eslint-config-next` core-web-vitals +
  typescript). A legacy `.eslintrc.json` also exists with relaxed rules
  (`no-explicit-any: off`, etc.). Run `npm run lint`.

## Conventions & gotchas (read these before editing)

- **Import alias:** `@/*` → `./src/*` (from `tsconfig.json`). Use it.
- **Route LLM calls go through `src/lib/ai.ts` / `src/lib/nvidia.ts`,** and keys come from the
  BYOK helpers (`getUserKeys` / `getNimKey`), not raw `process.env`. New agents should follow
  this; the codebase has been actively migrating off raw env-var reads.
- **Auth:** use `requireAuth()` from `src/lib/auth-guard.ts` for protected routes.
- **API routes must tolerate a missing/unconfigured DB** — `src/db/index.ts` ships a dummy
  fallback connection string for the build phase; routes should degrade gracefully, not crash.
- **`typescript.ignoreBuildErrors: true`** means a green `next build` does NOT mean type-clean.
  Verify types separately with `npx tsc --noEmit` when correctness matters.
- **Secrets:** never commit `.env*` (gitignored). Env keys are validated by `src/lib/env.ts`
  (`validateEnv()`); required keys include `GOOGLE_GENERATIVE_AI_API_KEY`, `DATABASE_URL`,
  `PINECONE_API_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- **Python swarm (`server/python-agents/`) is separate** from the Next.js app — it is not built
  or imported by the web build. `nemo_ghost.py` and the swarm scripts are local/daemon tooling
  (computer-use, scraping, Telegram closer, etc.), several of them explicitly labeled stubs.
- **`server/ws.ts`** is a standalone WebSocket voice daemon (`npm run ws`), not part of the
  Next.js server. `server/` is excluded from the app's `tsconfig`.
- **Two front doors, one product:** "Umbra" (repo/deploy name) and "Sovereign Matrix"
  (code/branding) are the same system. Don't let the README's hype copy mislead architecture
  decisions.
