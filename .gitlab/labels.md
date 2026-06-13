# GitLab Labels

Create these labels in the GitLab project UI: **Settings → Labels** (or via API).

Copy each row: **title**, **description**, suggested **color**.

## Type labels

| Label | Color | Description |
|-------|-------|-------------|
| `type::requirement` | `#428BCA` (blue) | New feature or enhancement |
| `type::bug` | `#D9534F` (red) | Defect in production or staging |
| `type::hotfix` | `#F0AD4E` (orange) | Urgent production fix |
| `type::spike` | `#A9A9A9` (gray) | Research or POC — no production merge expected |

## Phase labels

| Label | Color | Description |
|-------|-------|-------------|
| `phase::1` | `#6B4C9A` | Phase 1 — Programming-as-a-Service MVP |
| `phase::2` | `#7B68AE` | Phase 2 — Workout tracker |
| `phase::3` | `#8B7CC8` | Phase 3 — Community |
| `phase::4` | `#9B90E2` | Phase 4 — Coach marketplace |
| `phase::5` | `#ABA4FC` | Phase 5 — Event OS |

## Classification labels

| Label | Color | Description |
|-------|-------|-------------|
| `class::build-now` | `#5CB85C` (green) | Approved to build this sprint |
| `class::validate-first` | `#F7E967` (yellow) | Needs experiment before build |
| `class::build-later` | `#A9A9A9` (gray) | Backlog — not now |
| `class::rejected` | `#D9534F` (red) | Will not build — reason in issue |

## Status labels

| Label | Color | Description |
|-------|-------|-------------|
| `status::triage` | `#CCCCCC` | Awaiting PM review |
| `status::spec` | `#B3D9FF` | Spec or mini-PRD in progress |
| `status::pending-approval` | `#FFD700` | Waiting for approver sign-off |
| `status::approved` | `#5CB85C` | Cleared for development |
| `status::in-progress` | `#428BCA` | Active sprint work |
| `status::in-review` | `#9B59B6` | MR open, awaiting review |
| `status::done` | `#2ECC71` | Merged and deployed |

## Priority labels

| Label | Color | Description |
|-------|-------|-------------|
| `priority::p0` | `#8B0000` (dark red) | SLA/revenue blocker — drop everything |
| `priority::p1` | `#D9534F` | Major — fix this sprint |
| `priority::p2` | `#F0AD4E` | Normal — scheduled work |
| `priority::p3` | `#A9A9A9` | Low — backlog nice-to-have |

## Documentation labels

| Label | Color | Description |
|-------|-------|-------------|
| `docs::updated` | `#17A2B8` (teal) | MR includes documentation updates |
| `docs::missing` | `#DC3545` | Blocker — docs not updated when required |

## Area labels (optional)

| Label | Color | Description |
|-------|-------|-------------|
| `area::intake` | `#6C757D` | Questionnaire and onboarding |
| `area::program-engine` | `#6C757D` | Template and load calculation |
| `area::payments` | `#6C757D` | Razorpay and billing |
| `area::admin` | `#6C757D` | Coach review dashboard |
| `area::infra` | `#6C757D` | Deploy, CI, database |

## Milestones

Create milestones aligned with roadmap:

| Milestone | Description |
|-----------|-------------|
| `M1-Validate` | Landing, waitlist, experiments E1–E5 |
| `M2-Concierge` | 10 manual programs, NPS validation |
| `M3-MVP` | Full MVP launch |
| `M4-Quality` | SLA tooling, email delivery, 80+ programs |
| `M5-Tracker-Discovery` | Phase 2 prep |
| `M6-Scale` | Reviewer hire, PostgreSQL migration |
| `M12-Year1` | Year 1 targets hit |

## Label usage rules

1. Every issue gets exactly one `type::*` label
2. Every requirement gets one `class::*` label after triage
3. Status label updated as issue progresses through workflow (Section 48)
4. `class::build-now` requires `status::approved` before sprint assignment
5. MRs that touch docs should add `docs::updated`; reviewers add `docs::missing` if blocked

## Quick-create (GitLab API)

```bash
# Example — replace PROJECT_ID and TOKEN
curl --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
  --data "name=type::requirement&color=#428BCA&description=New feature or enhancement" \
  "https://gitlab.com/api/v4/projects/PROJECT_ID/labels"
```

## Related

- [CONTRIBUTING.md](../CONTRIBUTING.md) — full workflow
- [docs/README.md](../docs/README.md) — documentation index
