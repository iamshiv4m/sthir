# Designer Review Checklist — Phase 1 UI (shadcn)

**Status:** v0.2 — final eng self-review complete (June 2026)  
**Component library:** [shadcn/ui](https://ui.shadcn.com) — `base-nova` style, dark mode, amber primary  
**No Figma required** — review in browser or export screenshots from preview URL.

---

## How to review

1. Run locally (or open Vercel preview from MR):
   ```bash
   # API + frontend — see sthir-api/docs/operations/runbook-local-dev.md
   open http://localhost:3000
   ```
2. Walk through pages below (mobile **375px** + desktop **1280px**).
3. Open **design system showcase:** http://localhost:3000/design-system
4. Log feedback as **GitLab issue** — label `design-review`, attach PNG/PDF if needed.

---

## Pages to review

| # | URL | Persona | Focus |
|---|-----|---------|-------|
| 1 | `/` | Arjun (first meet) | Hero, training strip, goal carousel, trust, FAQ accordion |
| 2 | `/waitlist` | Founding lifter | Form simplicity, ₹99 deposit clarity, success timeline |
| 3 | `/intake` | All | 6-step flow, injury chips, progress bar, legal links |
| 4 | `/intake/success` | Athlete | Post-payment timeline (no admin link) |
| 5 | `/legal/*` | All | Disclaimer, refund, privacy |
| 6 | `/admin` | Coach | Queue scan, SLA urgency, approve/deliver |
| 7 | `/partners` | Vikram (gym) | Referral code visibility |
| 8 | `/design-system` | Designer | Tokens, components, sign-off list |

**Not in main nav (Phase 2):** `/tracker`

---

## Brand direction (v0.2)

| Token | Value | Notes |
|-------|-------|-------|
| Mode | Dark-first | `html.dark` + subtle `gym-surface` grain |
| Primary | Amber (~oklch 0.78 0.16 75) | CTAs, SBD accents, links |
| Background | Near zinc-950 | Warehouse / serious tone |
| Font | Geist Sans | Via Next.js font |
| Radius | 0.625rem | shadcn default |
| Motifs | Barbell divider, SBD load bars, training metrics strip | Workout-native, not generic SaaS |

Designer may still propose: logo wordmark, hero photography/video, Hindi subcopy.

---

## Final review — eng self-review (v0.2)

Mark designer **Pass / Revise / N/A** in GitLab issue to confirm.

| Criterion | Status | Notes |
|-----------|--------|-------|
| **Trust** — credible PL brand | **Pass** | Coach-reviewed card, federation copy, trust section, legal pages |
| **Conversion** — primary CTA obvious | **Pass** | Hero “Get Your Training Block”, sticky mobile CTA, header “Start Block” |
| **Mobile** — tap targets ≥ 44px on intake | **Pass** *(fixed)* | Back/Next/Pay min-h-11; injury chips min-h-9; carousel arrows 44px |
| **Mobile** — no accidental horizontal scroll | **Pass** *(fixed)* | Only goal carousel scrolls horizontally (hint + progress bar); page scroll stable |
| **Accessibility** — contrast on dark bg | **Pass** | Amber on dark meets readable; muted text for secondary |
| **Admin UX** — queue in ≤3 clicks | **Pass** | Select row → Approve/Deliver/Reject; urgent = red border |
| **Consistency** — forms match | **Pass** | shadcn Input/Card/Badge across waitlist + intake |
| **India context** — ₹, federations | **Pass** | ₹ pricing, IPF/PI & WRPF labels, en-IN date on review step |

### Revise (designer backlog — not blocking launch)

1. **`/partners`** — add hero band like intake/waitlist for visual consistency.
2. **`/admin`** — show human-readable goal labels (currently raw `goal` id in detail panel).
3. **Hero photography** — optional warehouse gym / platform photo or loop (brand exploration).
4. **Logo** — wordmark STHIR. is type-only; custom mark TBD.
5. **`/design-system`** — add Accordion + landing-only components to gallery.
6. **Hindi subcopy** — optional secondary line on hero for Tier-2 cities (brand exploration).

### Pass highlights (ship-ready)

- Landing: split hero + program preview, training activity strip, swipeable goals, FAQ accordion, closing CTA
- Intake: step validation, federation/meet copy, review labels, legal checkbox links
- Waitlist + success: athlete-friendly timelines
- Footer: legal links; design-system dev-only

---

## Sign-off criteria (designer copy)

Mark each **Pass / Revise / N/A** in GitLab issue comment:

- [ ] **Trust:** Looks like a credible strength sports brand (not Cult/Fitbod clone)
- [ ] **Conversion:** Primary CTA obvious on landing + intake step 1
- [ ] **Mobile:** Tap targets ≥ 44px on intake; goal carousel scroll is intentional
- [ ] **Accessibility:** Text contrast readable on dark bg
- [ ] **Admin UX:** Coach can review queue in <3 clicks
- [ ] **Consistency:** Buttons/inputs match across waitlist + intake
- [ ] **India context:** Pricing in ₹, federation labels clear

**Revise** items must include: page URL, screenshot, specific change (not vague “make it pop”).

---

## Feedback format (GitLab issue template)

```markdown
## Designer review — [date]

**Preview URL:** ...
**Reviewer:**

### Pass
- Landing hero + program preview card
- ...

### Revise
1. `/partners` — add hero band to match intake
   - Screenshot: attached

### Brand exploration (optional)
- Direction A / B sketches attached
```

---

## After sign-off

1. PM triages revisions into sized GitLab issues (XS/S).
2. Eng implements in `sthir` repo only (no API unless copy affects validation).
3. Re-review on Vercel preview before merge.

## Related

- [team.md](../../sthir-api/docs/product/team.md) — designer role & handoff
- [personas.md](../../sthir-api/docs/product/personas.md)
- `/design-system` — live component gallery
