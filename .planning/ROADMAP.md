# Roadmap: UI System

## Overview

The engine, components, two presets (ledger, atelier), the canvas and the `/ui` plugin are shipped on `main`. Milestone v0.1 "Published and current" makes them usable outside this repo: publish both packages to npm (Caractère waits on it), bring the docs in line with what shipped, then add the three remaining presets one at a time, each picture-first and signed by Koss.

## Milestones

- ✅ **Pre-GSD** — shipped on `main` through PR #9 (2026-11-13), recorded below as history
- 🚧 **v0.1 Published and current** — Phases 1-5 (in progress, started 2026-11-15)

<details>
<summary>✅ Shipped before GSD (through PR #9, 2026-11-13)</summary>

Source: .planning/intel/git-history.txt. Not GSD phases; no plan folders.

- 2026-09-27 — Config-driven engine and playground (2933bea); DiceBear avatars, anime.js motion (65131c1); dashboard-first scope (0404be9)
- 2026-11-07 — retail-editorial preset (b6dabcc, 05e6083); ledger preset (80cc611); PRESETS and contrastReport on window.UIS (f752db2); seed change drops pins (8bc4a71)
- 2026-11-08 — Hugeicons for every icon, design system names (b105f30); password eye (aebdb5c); per-product preset sheets (adb655e, ff3cb31; later superseded)
- 2026-11-09 — atelier rename, kinds, preset rules (b758b2f, PR #6); one sheet per preset, Start and Kinds boards (7cc430b); one page per component family (9cfdbe7); Tweaks over copies, skin Tweak (7281bd3, PR #7); field hint slot (9f28079)
- 2026-11-10 — grouped Tweaks, font preset beats preset fonts (d29bc88; merged PR #9 2026-11-13)
- 2026-11-13 — motion split, phone shells, honest check (44cead0); `/ui` plugin with step router (277913a, PR #8); merge of grouped Tweaks (331dfb4, PR #9)

</details>

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: npm publish** - `@ui-system/core` and `@ui-system/react` 0.1.0 public on npm via `publish.yml` (in progress)
- [ ] **Phase 2: Docs refresh** - README, CLAUDE.md and docs/*.md match shipped code and owner decisions
- [ ] **Phase 3: Preset mist** - glass, soft preset, picture-first, contrast-safe, full canvas sheet
- [ ] **Phase 4: Preset signal** - bold pill and yellow preset, same gates
- [ ] **Phase 5: Preset studio** - colour pop preset, same gates

## Phase Details

### Phase 1: npm publish
**Goal**: A product repo (first Caractère) installs `@ui-system/core` and `@ui-system/react` 0.1.0 from npm
**Depends on**: Nothing (first phase)
**Requirements**: PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06
**Success Criteria** (what must be TRUE; owner runbook, .planning/decisions/2026-11-15-npm-publish.md, verbatim; every password, 2FA or token step is Koss's, one numbered step at a time, wait for "done", then check):
  1. Koss: `npm login` (browser). Check: `npm whoami`.
  2. Check scope: `npm view @ui-system/core`; `npm org ls ui-system`. If org missing, Koss: npmjs.com → avatar → Add Organization → `ui-system` → Free. If the name is taken, STOP and ask about renaming the scope (e.g. `@loomlyne/*`), done by PR.
  3. Koss: npmjs.com → Access Tokens → Generate New Token → Granular. Name `ui-system-publish`, 90 days, Packages and scopes Read and write, only the ui-system org, Bypass 2FA if shown. Copy once.
  4. Koss: `gh secret set NPM_TOKEN -R Loomlyne/ui-system` (hidden prompt). Check: `gh secret list`.
  5. Claude: `pnpm install --frozen-lockfile && pnpm build && pnpm typecheck` pass on main.
  6. Ask Koss: "Publish @ui-system/core and @ui-system/react 0.1.0 publicly to npm now?" On yes: `gh workflow run publish.yml -R Loomlyne/ui-system`, then `gh run watch`.
  7. Verify: `npm view @ui-system/core version` and `@ui-system/react version` print 0.1.0; `npm pack @ui-system/react --dry-run` lists dist/index.js and dist/index.d.ts.
  8. Record in .planning/ and report verified / not verified / failed. Last line: PUBLISHED @ui-system/core@<v> @ui-system/react@<v>, or what blocked.
  9. (Added, milestone success metric, PUB-06) A clean folder outside the repo installs both packages from npm and `npx -p @ui-system/core ui-system check` runs.
**Plans**: TBD

### Phase 2: Docs refresh
**Goal**: Anyone reading README, CLAUDE.md or docs/*.md gets instructions that match the shipped code, the owner decisions and the published packages
**Depends on**: Phase 1 (install and `npx` steps must be true when the docs say so)
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06, DOCS-07, DOCS-08
**Success Criteria** (what must be TRUE):
  1. Every INFO entry in .planning/INGEST-CONFLICTS.md about a stale doc is fixed in the doc it names (claude-design, config, navigation, radius, logo, presets, README, CLAUDE.md layout)
  2. README install, plugin and `npx -p @ui-system/core ui-system check` steps, run as written in a clean folder, work against npm
  3. Claude Design names, canvas pages and Tweak groups in the docs match D-02, D-06, D-09 and the live canvas
  4. A doc reader finds `brand.caption` default `''`, the motion split, phone shell behaviour and the `search` radius role, matching the code
**Plans**: TBD

### Phase 3: Preset mist
**Goal**: A product can set `"preset": "mist"` and get a glass, soft look that passes the contrast gate and is shown on the canvas
**Depends on**: Phase 2
**Requirements**: MIST-01, MIST-02, MIST-03, MIST-04
**Success Criteria** (what must be TRUE):
  1. Koss has seen the mist options as pictures and signed one; the decision file exists before any preset code
  2. `ui-system init --preset mist --kind app` prints mist's rules, never and questions; a config with `"preset": "mist"` validates against `schema.json`
  3. `pnpm design` passes with mist: every text role 4.5:1 in light and dark
  4. The canvas Presets page shows mist's full design sheet (D-08) with skins side by side, measured locally (C-10), and the design system is republished (C-09)
**Plans**: TBD
**UI hint**: yes

### Phase 4: Preset signal
**Goal**: A product can set `"preset": "signal"` and get a bold pill and yellow look that passes the contrast gate and is shown on the canvas
**Depends on**: Phase 3 (one preset at a time, D-05)
**Requirements**: SIGN-01, SIGN-02, SIGN-03, SIGN-04
**Success Criteria** (what must be TRUE):
  1. Koss has seen the signal options as pictures and signed one before any preset code
  2. `ui-system init --preset signal` prints its rules, never and questions; `"preset": "signal"` validates
  3. `pnpm design` passes with signal: every text role 4.5:1 in light and dark, including ink on the yellow fill
  4. The canvas Presets page shows signal's full design sheet, measured locally, design system republished
**Plans**: TBD
**UI hint**: yes

### Phase 5: Preset studio
**Goal**: A product can set `"preset": "studio"` and get a colour-pop look that passes the contrast gate and is shown on the canvas
**Depends on**: Phase 4 (one preset at a time, D-05)
**Requirements**: STUD-01, STUD-02, STUD-03, STUD-04
**Success Criteria** (what must be TRUE):
  1. Koss has seen the studio options as pictures and signed one before any preset code
  2. `ui-system init --preset studio` prints its rules, never and questions; `"preset": "studio"` validates
  3. `pnpm design` passes with studio: every text role 4.5:1 in light and dark
  4. The canvas Presets page shows studio's full design sheet, measured locally, design system republished
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:** 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. npm publish | 0/TBD | In progress | - |
| 2. Docs refresh | 0/TBD | Not started | - |
| 3. Preset mist | 0/TBD | Not started | - |
| 4. Preset signal | 0/TBD | Not started | - |
| 5. Preset studio | 0/TBD | Not started | - |
