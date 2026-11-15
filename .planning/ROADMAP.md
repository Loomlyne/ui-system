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

- [ ] **Phase 1: npm publish** - `@loomlyne/ui-system-core` and `@loomlyne/ui-system-react` 0.1.0 public on npm via `publish.yml` (in progress)
- [ ] **Phase 2: Docs refresh** - README, CLAUDE.md and docs/*.md match shipped code and owner decisions
- [ ] **Phase 3: Preset mist** - glass, soft preset, picture-first, contrast-safe, full canvas sheet
- [ ] **Phase 4: Preset signal** - bold pill and yellow preset, same gates
- [ ] **Phase 5: Preset studio** - colour pop preset, same gates

## Phase Details

### Phase 1: npm publish
**Goal**: A product repo (first Caractère) installs `@loomlyne/ui-system-core` and `@loomlyne/ui-system-react` 0.1.0 from npm
**Depends on**: Nothing (first phase)
**Requirements**: PUB-01, PUB-02, PUB-03, PUB-04, PUB-05, PUB-06
**Success Criteria** (what must be TRUE; owner runbook .planning/decisions/2026-11-15-npm-publish.md as amended by decisions/2026-11-15-npm-scope-loomlyne.md, decisions/2026-11-15-npm-first-publish-local.md and decisions/2026-11-15-npm-stage-first-publish.md; every password or 2FA step is Koss's, one numbered step at a time, wait for "done", then check):
  1. [x] Koss: `npm login` (browser). Check: `npm whoami` → koussayz (2026-11-15).
  2. [x] Scope: `@ui-system` taken → Koss chose org `loomlyne`, packages `@loomlyne/ui-system-core` + `@loomlyne/ui-system-react`; `npm org ls loomlyne` → koussayz - owner; rename by PR #10 (2026-11-15).
  3. ~~Token + `NPM_TOKEN` secret~~ dropped (Koss, 2026-11-15): bypass-2FA tokens lose direct publish ~Jan 2027; first publish is local.
  4. [x] Claude: `pnpm install --frozen-lockfile && pnpm build && pnpm typecheck` pass on `main` after PR #10 merges (2026-11-15, `01ae60c`).
  5. [x] Koss said yes (2026-11-15). Direct publish returns 403 with no browser challenge, and CLI `npm stage approve` returns 404 with no 2FA, so both versions were approved on the Staged Packages tab. Core `0.1.0` published `2026-11-15T16:03:05.800Z`, shasum `3ea4f5042b76c1d33f5e37d608a83a1224c7803f`, `"license": "MIT"`, no `LICENSE` file, bin `ui-system` kept. React `0.1.0` published `2026-11-15T16:10:39.606Z`, stage `01620e4e-1391-4a67-b0be-ae63c70334c1`, shasum `f46e4d26a0863054873afcc1c37ebe2676938bba`. The green banner can show while the row is still on screen; `npm stage list` was already empty.
  6. [x] 2026-11-15 20:12 +0400: `npm view` of both packages prints `0.1.0`, dist-tag `latest`. `npm pack @loomlyne/ui-system-react@0.1.0 --dry-run` lists `dist/index.js` and `dist/index.d.ts`. Live react tarball shasum matches the stage, depends on `@loomlyne/ui-system-core@0.1.0`, and includes `LICENSE`.
  7. [x] Trusted publishing: PR #11 squash-merged as `29cb7b6` (2026-11-15). `publish.yml` has no `NPM_TOKEN`. pnpm 10.28 calls the npm that ships with Node 24. The job exits if npm is below 11.5.1. Both packages trust GitHub Actions `Loomlyne/ui-system` workflow `publish.yml` with permissions publish and stage publish. Core trust id `3e344fd3-6608-43b1-b086-fef8edd98936`. React returned "Trust configuration created successfully". Do not dispatch while the version is `0.1.0`.
  8. [x] Recorded 2026-11-15. Report: PUBLISHED @loomlyne/ui-system-core@0.1.0 @loomlyne/ui-system-react@0.1.0.
  9. [x] (PUB-06, 2026-11-15 20:13 +0400) `/tmp/ui-system-pub06` installed both `0.1.0`. `npx -p @loomlyne/ui-system-core@0.1.0 ui-system check /tmp/ui-system-pub06/app` printed `UI System check: 0 files, no rule breaks.` and exited 0.
**Plans**: TBD

### Phase 2: Docs refresh
**Goal**: Anyone reading README, CLAUDE.md or docs/*.md gets instructions that match the shipped code, the owner decisions and the published packages
**Depends on**: Phase 1 (install and `npx` steps must be true when the docs say so)
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06, DOCS-07, DOCS-08
**Success Criteria** (what must be TRUE):
  1. Every INFO entry in .planning/INGEST-CONFLICTS.md about a stale doc is fixed in the doc it names (claude-design, config, navigation, radius, logo, presets, README, CLAUDE.md layout)
  2. README install, plugin and `npx -p @loomlyne/ui-system-core ui-system check` steps, run as written in a clean folder, work against npm
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
