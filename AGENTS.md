# AGENTS.md — Cursor / AI Agent Context

Frontend-only repo for **Sthir**. Backend: `../sthir-api` (NestJS).

## Product

**Sthir** — India-first strength sports platform. Phase 1 = coach-reviewed programs (meet prep, strength, powerbuilding) delivered in 12 hours.

**This repo:** marketing pages, intake/waitlist forms, admin UI, tracker UI. All data via API.

## Git

All commits: **Shivam Jha** `<shivamjha190@gmail.com>`. Set locally:

```bash
git config user.name "Shivam Jha"
git config user.email "shivamjha190@gmail.com"
```

## Stack

- **Next.js 16** App Router, React 19, TypeScript
- **Tailwind CSS 4** + **shadcn/ui** — `src/components/ui/`, dark + amber theme
- **pnpm** — package manager
- **No API routes** — use `apiUrl()` from `src/lib/api.ts`

## Key directories

```
src/
  app/           # Pages only
  components/    # Landing etc.
  lib/
    api.ts       # NEXT_PUBLIC_API_URL helper
    constants.ts # Goals, federations (display)
    pricing.ts   # formatInr, getPriceForGoal (display)
```

Backend logic → **`../sthir-api`**

## Conventions

- Path alias: `@/` → `src/`
- Admin UI sends `x-admin-key` header to API
- New endpoints → implement in `sthir-api`, call via `apiUrl()`

## Common tasks

| Task                   | Where                                  |
| ---------------------- | -------------------------------------- |
| Add training goal (UI) | `constants.ts`, landing + intake forms |
| New page               | `src/app/`                             |
| Pricing display        | `pricing.ts`, `constants.ts` PRICING   |
| API / business logic   | `../sthir-api`                         |

## Scripts

```bash
pnpm dev      # :3000 — requires sthir-api on :4000
pnpm build
pnpm lint
```

## References

- [../sthir-api/docs/product/prd-phase1.md](../sthir-api/docs/product/prd-phase1.md)
- [../sthir-api/docs/architecture/overview.md](../sthir-api/docs/architecture/overview.md)
- [../sthir-api/README.md](../sthir-api/README.md)
