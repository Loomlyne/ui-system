# Quick 261118 summary: right-to-left safe ui.css

Status: built and verified 2026-11-18 10:15 +0400. Owner's answers (question form, relayed by the ALMAR controller, 2026-11-18): pictures "Yes, release"; defect 14 "Logical" (decision signed). Both packages bumped to **0.3.3** in this PR; release by `publish.yml` (OIDC) after the squash merge.

## What changed

- `packages/core/styles/ui.css`: all 49 ALMAR-audit defects get a right-to-left path. Logical properties for defects 1-13; `--uis-dir` (`[dir="ltr"]` 1 / `[dir="rtl"]` -1) for the switch knob twin, the `uis-slide` keyframe (now `translate: calc(24px * var(--uis-dir, 1)) 0`) and the menu-arrow offset twin; `[dir="rtl"] .uis-icon[data-dir] { scale: var(--uis-dir) 1 }` for direction icons (15). `.uis-drawer--start` added (`--left` kept). Row 14 kept as `row-reverse` = logical (signed by the owner 2026-11-18: `.planning/decisions/2026-11-18-rtl-placement-logical.md`).
- Password family (not a defect, owner rule): eye stays physical right; the control stays physical in RTL so nothing lands on the eye (lock icon left, kbd left of the eye, floating label after the eye: `[dir="rtl"]` rest offsets 48px / 92px).
- Found beyond the 15 and fixed: kbd + eye over-constraint in RTL (`inset-inline-end: auto` reset), appdock tooltip over-constraint (`inset-inline: auto` reset), floating label under the eye in RTL, island inline padding (React), topbar avatar / logo margins (React), Table `align` left/right → start/end (React).
- React: `Icon directional` → `data-dir`; marked on PageHeader crumbs, NavMobile sheet rows, NavMinimal menu arrow. `Drawer side` end|start (default end; `right`/`left` aliases render the same classes as before).
- `packages/core/test/rtl.test.mjs` + `rtl-audit.mjs`, `pnpm test`; CI `rtl` job (no install); `publish.yml` runs `pnpm test`. `ci.yml` brought to the CI rules (PR opened/ready only, paths-ignore, concurrency, timeouts, ubuntu-24.04, pinned SHAs, blobless).
- Docs: `docs/rtl.md` (new), `docs/config.md` placement row, `design-catalog.mjs` (Icon, Drawer) → `pnpm design`.

## Verified

- ALMAR audit on the new ui.css: 53 → 8 rows (6 intentional password eye, 2 row-14 `row-reverse`, logical by the proposal). UI System audit: 0 open, 8 allowed with reasons. `AUDIT.md`.
- `pnpm test` 6/6; each guard proven to bite (put back `text-align: left` on `.uis-table th` and dropped `directional` from the crumbs chevron → 2 failures; restored by copy).
- LTR pixel proof: 20 scenes × 390/768/1440 × light/dark = 120 LTR-only pictures, 0.3.2 vs this branch, **0 pixels differ** (canvas compare; the compare was proven to bite: a swapped picture reports 415,568 px).
- "Before" render is byte-identical to ALMAR's `rtl/before/8-drawer-768-light.png`, so the before/after pipeline is ALMAR's.
- `pnpm build`, `pnpm typecheck`, `pnpm design`, `pnpm playground:build` green locally; `ci.yml` and `publish.yml` pass the ci-audit checks locally.

## Pictures

Kept outside the repo, because they show ALMAR's brand and Arabic strings (ALMAR's content, not UI System's): `/Users/koss/Developer/ui-system-rtl-pictures-261118/`
- `compare/<n>-<slug>-<width>-<mode>.png`: 90 sheets (15 components × 390/768/1440 × light/dark), BEFORE 0.3.2 (red outline) over AFTER (green outline), English left, Arabic right.
- `before/`, `after/`: 120 each (scenes 1-20); 16-20 are the extra scenes (password fields, drawer start + floating, menu drawer, nav placements, dock + transparent bar).
- `ltr-before/`, `ltr-after/`: the 120 + 120 LTR-only pictures of the pixel proof.
- `rtl-pictures.mjs`: the script (adapted from ALMAR's; reads ALMAR copy read-only).

## Open

- After merge: run "Publish packages", verify a clean install; sync the Claude Design System (Icon, Drawer README, bundle) and re-copy `tokens.json`/`bundle.*` into the canvas `ds/uis/`.
- Not done, recommendation for later: `Button iconRight="arrow-right"` cannot be marked directional (needs a prop); `Reveal` effects `slide-left`/`slide-right` are physical (anime.js); a kbd `⌘K` shows as `K⌘` in RTL (bidi, not CSS sides). `pages.yml` keeps its old CI findings (untouched).
