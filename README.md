# Sthir — Frontend (Next.js)

Marketing site, intake funnel, admin UI, and tracker for **Sthir** — India's strength sports platform.

**Backend is a separate repo:** [`../sthir-api`](../sthir-api) (NestJS).

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, **shadcn/ui** |
| Backend | **sthir-api** (NestJS) — not in this repo |
| Hosting | Vercel (this repo) |

## Local setup

Run **both** repos:

```bash
# Terminal 1 — API
cd ../sthir-api
cp .env.example .env
pnpm install && pnpm start:dev    # :4000

# Terminal 2 — Web
cd sthir
cp .env.example .env.local
pnpm install && pnpm dev          # :3000
```

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `http://localhost:4000`) |
| `NEXT_PUBLIC_APP_URL` | This app's public URL |

All payment, DB, and admin auth env vars live in **sthir-api**.

## Deploy

| Repo | Platform | URL |
|------|----------|-----|
| **sthir** (this) | Vercel | `sthir.in` |
| **sthir-api** | Railway / Render / Fly | `api.sthir.in` |

Set `NEXT_PUBLIC_API_URL=https://api.sthir.in` on Vercel.

## Documentation

**Platform docs (API, architecture, coach, ops):** [../sthir-api/docs/README.md](../sthir-api/docs/README.md)

**Frontend (this repo):** [docs/](docs/) — designer UI review only
