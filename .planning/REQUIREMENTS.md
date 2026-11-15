# Requirements: UI System

**Defined:** 2026-11-15
**Core Value:** A product repo picks a preset, a kind and a brand, installs UI System from npm, and gets a themed, contrast-safe UI that passes `ui-system check`.
**Milestone:** v0.1 "Published and current"

## v1 Requirements (milestone v0.1)

### Publish (PUB) — owner runbook, .planning/decisions/2026-11-15-npm-publish.md

- [ ] **PUB-01**: Koss is logged in to npm on this Mac (`npm whoami` prints his user) — his step
- [ ] **PUB-02**: The `@ui-system` npm org exists and Koss can publish to it (`npm org ls ui-system`); if the name is taken, work stops and the scope rename is his decision, done by PR
- [ ] **PUB-03**: Repo secret `NPM_TOKEN` holds a granular token (`ui-system-publish`, 90 days, read and write, ui-system org only); `gh secret list -R Loomlyne/ui-system` shows it — his steps
- [ ] **PUB-04**: `pnpm install --frozen-lockfile && pnpm build && pnpm typecheck` pass on `main`
- [ ] **PUB-05**: After Koss's yes, the "Publish packages" workflow publishes both packages at 0.1.0 publicly: `npm view @loomlyne/core version` and `npm view @loomlyne/react version` print 0.1.0; `npm pack @loomlyne/react --dry-run` lists `dist/index.js` and `dist/index.d.ts`
- [ ] **PUB-06**: A clean folder outside this repo installs both packages from npm and `npx -p @loomlyne/core ui-system check` runs (milestone success metric); result recorded in `.planning/` with verified / not verified / failed

### Docs (DOCS) — stale docs from .planning/INGEST-CONFLICTS.md

- [ ] **DOCS-01**: docs/claude-design.md uses the owner names (D-02), the canvas page structure (D-06), grouped Tweaks (D-09), 5 backend shells, and no unverified component count
- [ ] **DOCS-02**: docs/config.md shows `brand.caption` default `''` and the motion split (`motion.enabled: false` stops CSS micro states; Reveal and CountUp read `motion.timing`)
- [ ] **DOCS-03**: docs/navigation.md describes phone shells: below 768px sidebar, inset and rail hand off to the dock, dock search folds to an icon, tables scroll sideways, PageHeader gutter
- [ ] **DOCS-04**: docs/radius.md lists the `search` radius role
- [ ] **DOCS-05**: README.md names "UI System · Design System", lists 7 font presets incl. `retail`, and its npm install and `npx` steps (plus docs/frameworks.md and docs/libraries.md imports) work against the published packages
- [ ] **DOCS-06**: CLAUDE.md § Layout lists real paths `packages/core/src/*` including `kinds.ts` and `presets.ts`
- [ ] **DOCS-07**: docs/presets.md names the 4 skins without an engine preset (Vamos, Koussay, Sahti, Obox)
- [ ] **DOCS-08**: docs/logo.md says logo Tweaks live on nav boards only (D-09)

### Preset mist (MIST) — glass, soft

- [ ] **MIST-01**: Koss signs a picture-first proposal for `mist` (options shown as pictures, his yes recorded in `.planning/decisions/`) before any build
- [ ] **MIST-02**: `mist` is in `PRESETS` with rules, never and questions, uses only normal config keys, is accepted by `schema.json`, and `ui-system init --preset mist --kind <id>` prints them
- [ ] **MIST-03**: `mist` passes the 4.5:1 contrast gate in light and dark (`contrastReport()`, `pnpm design` green)
- [ ] **MIST-04**: `mist` has one full design sheet on the canvas Presets page (D-08), checked locally per C-10, and the design system is republished per C-09

### Preset signal (SIGN) — bold pill and yellow

- [ ] **SIGN-01**: Koss signs a picture-first proposal for `signal` before any build
- [ ] **SIGN-02**: `signal` is in `PRESETS` with rules, never and questions, accepted by `schema.json`, printed by `ui-system init --preset signal`
- [ ] **SIGN-03**: `signal` passes the 4.5:1 contrast gate in light and dark
- [ ] **SIGN-04**: `signal` has one full design sheet on the canvas Presets page, checked locally, design system republished

### Preset studio (STUD) — colour pop

- [ ] **STUD-01**: Koss signs a picture-first proposal for `studio` before any build
- [ ] **STUD-02**: `studio` is in `PRESETS` with rules, never and questions, accepted by `schema.json`, printed by `ui-system init --preset studio`
- [ ] **STUD-03**: `studio` passes the 4.5:1 contrast gate in light and dark
- [ ] **STUD-04**: `studio` has one full design sheet on the canvas Presets page, checked locally, design system republished

## v2 Requirements

None yet.

## Out of Scope / accepted gaps

| Item | Reason |
|------|--------|
| atelier resting search pill has no edge (1.10:1 light, 1.26:1 dark, under WCAG 1.4.11) | Accepted gap, kept as in the Senorita source (docs/presets.md § atelier Known gaps) |
| ledger has no own active nav colour | Accepted gap; engine sidebar active state applies (docs/presets.md § ledger Known gaps) |
| ALMAR moves onto atelier | Work in the ALMAR repo (one product per session) |
| Clickit moves onto ledger | Work in the Clickit repo (one product per session) |
| Presets named after products | Presets are ways of designing; products are skins (D-05) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PUB-01 | Phase 1 | In Progress |
| PUB-02 | Phase 1 | Pending |
| PUB-03 | Phase 1 | Pending |
| PUB-04 | Phase 1 | Pending |
| PUB-05 | Phase 1 | Pending |
| PUB-06 | Phase 1 | Pending |
| DOCS-01 | Phase 2 | Pending |
| DOCS-02 | Phase 2 | Pending |
| DOCS-03 | Phase 2 | Pending |
| DOCS-04 | Phase 2 | Pending |
| DOCS-05 | Phase 2 | Pending |
| DOCS-06 | Phase 2 | Pending |
| DOCS-07 | Phase 2 | Pending |
| DOCS-08 | Phase 2 | Pending |
| MIST-01 | Phase 3 | Pending |
| MIST-02 | Phase 3 | Pending |
| MIST-03 | Phase 3 | Pending |
| MIST-04 | Phase 3 | Pending |
| SIGN-01 | Phase 4 | Pending |
| SIGN-02 | Phase 4 | Pending |
| SIGN-03 | Phase 4 | Pending |
| SIGN-04 | Phase 4 | Pending |
| STUD-01 | Phase 5 | Pending |
| STUD-02 | Phase 5 | Pending |
| STUD-03 | Phase 5 | Pending |
| STUD-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 26 total
- Mapped to phases: 26
- Unmapped: 0

---
*Requirements defined: 2026-11-15*
*Last updated: 2026-11-15 after roadmap creation*
