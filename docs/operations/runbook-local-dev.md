# Runbook: Local Development — sthir (frontend)

Requires **sthir-api** running on port 4000.

## Setup

```bash
# Terminal 1 — API (see ../sthir-api/docs/operations/runbook-local-dev.md)
cd ../sthir-api && pnpm start:dev

# Terminal 2 — Frontend
cd sthir
cp .env.example .env.local
pnpm install && pnpm dev    # http://localhost:3000
```

## `.env.local`

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Full platform docs: [../sthir-api/docs/README.md](../sthir-api/docs/README.md)
