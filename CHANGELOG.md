# Changelog

All notable user-facing changes to Sthir are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Landing page with 8 training goals, waitlist, and pricing display
- Adaptive intake questionnaire with federation selector (IPF/PI, WRPF, Other)
- Rules-based program template engine with auto load calculation (% / RPE / mixed)
- Razorpay checkout integration with webhook payment confirmation (mock mode for local dev)
- Admin review queue with approve / deliver / reject actions
- Program export as CSV download and PDF generation
- 12-hour SLA deadline tracking on intake submissions
- JSON file store bootstrap (`data/db.json`) for Phase 1 MVP
- Audit log for intake, payment, and program actions
- Basic workout session logging API (Phase 2 foundation)
- Gym partner and concierge beta tracking in data model
- Documentation scaffold and GitLab workflow templates (Section 49)
- Vitest unit tests for program engine

### Changed

- (none yet)

### Fixed

- (none yet)

### Security

- Admin routes protected by `ADMIN_API_KEY` header in production
- Razorpay webhook signature verification

---

## Release process

1. Move `[Unreleased]` items to a new version section on release
2. Tag: `git tag v0.x.y`
3. Deploy production from tagged commit

Internal refactors with no user/ops impact skip CHANGELOG unless deploy-relevant.
