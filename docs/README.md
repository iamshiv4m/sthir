# Frontend Documentation (sthir)

UI-only docs for the Next.js frontend repo.

**Platform docs (API, architecture, coach, compliance, growth, QA, ops)** → **[../sthir-api/docs/README.md](../sthir-api/docs/README.md)**

## This repo

| Document | Purpose |
|----------|---------|
| [designer-review-checklist.md](product/designer-review-checklist.md) | shadcn UI review for designer sign-off |
| [operations/runbook-local-dev.md](operations/runbook-local-dev.md) | Frontend local setup |
| [README.md](../README.md) | Frontend setup & Vercel deploy |
| [AGENTS.md](../AGENTS.md) | Cursor agent context |

## Designer review

1. Run `pnpm dev` (with API on :4000)
2. Review `/`, `/intake`, `/waitlist`, `/admin`, `/design-system`
3. Log feedback per [designer-review-checklist.md](product/designer-review-checklist.md)
