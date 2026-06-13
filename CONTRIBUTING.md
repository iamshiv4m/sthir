# Contributing to Sthir

Thank you for contributing. Sthir uses a **GitLab-first workflow** — no code without an approved issue, no merge without docs.

## Golden rules

1. **WhatsApp pe idea aaya ≠ approved.** Open a GitLab issue first.
2. **`class::build-now` issues need `status::approved`** before sprint work starts.
3. **Every merged MR updates docs** — at minimum CHANGELOG `[Unreleased]` for user-visible changes.
4. **Conventional commits** with issue reference: `feat(intake): add WRPF branch #42`

Full process: **Section 48** of the founding plan (Requirements & Change Management Workflow).

## Workflow overview

```
Intake (issue) → Triage (48h) → Classify → Spec/Experiment → Approval → Sprint → MR → Review → Deploy → Measure → Close
```

### Step-by-step

| Step        | Action                                           | Owner                   | SLA            |
| ----------- | ------------------------------------------------ | ----------------------- | -------------- |
| 1. Intake   | Create GitLab issue using a template             | Anyone                  | —              |
| 2. Triage   | Duplicate check, phase alignment, priority       | PM                      | 48h            |
| 3. Classify | Build Now / Validate First / Build Later / Never | PM (+ CEO if strategic) | 48h            |
| 4. Spec     | Mini-PRD in issue or linked doc                  | PM                      | 3 days         |
| 5. Approval | Required sign-offs per matrix below              | See matrix              | 48h after spec |
| 6. Sprint   | Assign milestone + sprint                        | EngMgr                  | Next planning  |
| 7. Build    | Feature branch, conventional commits             | FE/BE                   | Per sprint     |
| 8. Review   | Code + QA + **docs updated**                     | QA + peer               | 24–48h         |
| 9. Deploy   | Staging → prod via CI                            | DevOps                  | Same day       |
| 10. Measure | Post-launch metrics on issue                     | Data/PM                 | 2 weeks        |
| 11. Close   | Issue closed, learnings logged                   | PM                      | —              |

## Issue templates

Use the correct template from [`.gitlab/issue_templates/`](.gitlab/issue_templates/):

- **Requirement.md** — new features, enhancements
- **Bug.md** — production defects
- **Hotfix.md** — urgent P0 production fixes

Labels reference: [`.gitlab/labels.md`](.gitlab/labels.md)

## Merge requests

Use [`.gitlab/merge_request_templates/Default.md`](.gitlab/merge_request_templates/Default.md). MR must:

- Reference issue: `Closes #<number>`
- Pass CI (lint, test)
- Include docs checklist (Section 49)
- Have rollback plan for risky changes

Reviewers block merge if `docs::missing` — CHANGELOG not updated for user-visible changes.

## Approval matrix

| Requirement type                    | Approvers                           |
| ----------------------------------- | ----------------------------------- |
| Cosmetic / copy                     | PM (+ Designer if visual)           |
| UI / new page / funnel              | PM + Designer                       |
| Phase 1 feature                     | PM + CEO                            |
| Phase 2+ feature                    | PM + CEO + Architect                |
| Pricing change                      | CEO + Finance                       |
| Health / injury / programming logic | PM + CoachOps + Legal               |
| Payment / PII / auth                | Architect + Legal                   |
| Hotfix P0                           | EngMgr (+ CEO notify); spec skip OK |

### Solo founder mode

When team = founder only:

- Self-check against Phase 1 scope and Never Build list
- Comment on issue: _"Self-approved: aligns Phase 1, success metric defined"_
- **24-hour cooling period** for effort ≥ 5 story points

## Requirement sizing

| Size | Effort      | Process                                      |
| ---- | ----------- | -------------------------------------------- |
| XS   | <4h         | Issue + PM self-approve → direct MR          |
| S    | 4h–2d       | Mini spec → PM approve → MR                  |
| M    | 2d–1 sprint | Mini-PRD → approval matrix → sprint          |
| L    | >1 sprint   | PRD update → CEO + Architect → own milestone |

## Documentation obligations

See [../sthir-api/docs/README.md](../sthir-api/docs/README.md) for platform documentation obligations. Frontend MRs: update [docs/](docs/) if UI review docs change.

On every feature MR:

- [ ] CHANGELOG updated (user-visible) — in repo that changed
- [ ] API docs in **sthir-api** if backend changed
- [ ] Designer checklist if UI changed

## Weekly rituals

| Ritual          | When          | Output                         |
| --------------- | ------------- | ------------------------------ |
| Triage Tuesday  | Weekly 30 min | All `status::triage` cleared   |
| Sprint Planning | Bi-weekly Mon | Approved issues only in sprint |
| Demo + Retro    | Bi-weekly Fri | Metrics review                 |
| Roadmap Check   | Monthly       | Phase on track?                |

## Scope creep guardrails

Before adding to sprint, confirm:

1. Linked to Phase 1 goal?
2. Not on Never Build list?
3. Paid program delivery possible without it? → defer
4. Validation experiment needed first?
5. Success metric defined?

## Getting help

- Product scope: [../sthir-api/docs/product/prd-phase1.md](../sthir-api/docs/product/prd-phase1.md)
- Architecture: [../sthir-api/docs/architecture/overview.md](../sthir-api/docs/architecture/overview.md)
- Local dev: [../sthir-api/docs/operations/runbook-local-dev.md](../sthir-api/docs/operations/runbook-local-dev.md)
- Agent context: [AGENTS.md](AGENTS.md)
