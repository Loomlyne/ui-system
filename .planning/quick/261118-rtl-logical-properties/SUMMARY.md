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

## Review (PR #12)

- Grok 4.7 (jev-review tier standard) failed: Grok usage balance exhausted (402). Fallback per jev-review: Sonnet `reviewer`: approve with nits.
- Fixed: the RTL twin for the menu arrow double-flipped (scale applies after transform; measured -8px RTL with the twin, +8px without) → twin removed, base offset allow-listed with the reason; audit twins now cover only the properties they set; allow-list matches whole class names; audit also checks uneven border-radius, side keywords (transform-origin, background-position) and side gradients; icon scan reads whole `<Icon … />` tags; new test: no direction icon name reaches the React UI unmarked (e.g. `icon="chevron-left"`). Tests 7/7; LTR proof re-run: 0 px differ. Limits documented in docs/rtl.md (`dir="auto"`, nested ltr password label, Motion slide presets, drawer side change in RTL).
- Kept: CI runs on PR opened / ready_for_review only (owner CI-minutes rule); later pushes re-run by `workflow_dispatch`.

## Pictures

Kept outside the repo, because they show ALMAR's brand and Arabic strings (ALMAR's content, not UI System's): `/Users/koss/Developer/ui-system-rtl-pictures-261118/`
- `compare/<n>-<slug>-<width>-<mode>.png`: 90 sheets (15 components × 390/768/1440 × light/dark), BEFORE 0.3.2 (red outline) over AFTER (green outline), English left, Arabic right.
- `before/`, `after/`: 120 each (scenes 1-20); 16-20 are the extra scenes (password fields, drawer start + floating, menu drawer, nav placements, dock + transparent bar).
- `ltr-before/`, `ltr-after/`: the 120 + 120 LTR-only pictures of the pixel proof.
- `rtl-pictures.mjs`: the script (adapted from ALMAR's; reads ALMAR copy read-only).

## Shipped (2026-11-18)

- PR https://github.com/Loomlyne/ui-system/pull/12, reviewed head `92d3aea` (CI run `44263546260`: build, rtl green), squash-merged as `2ee3522`; `main` tree identical to the reviewed head. Tags on GitHub: `archive/main-before-0.3.3` (`8f50b57`), `archive/fix-rtl-logical-properties` (`92d3aea`).
- Publish run `44285103323` (OIDC, `pnpm test` included) on `2ee3522`: `@loomlyne/ui-system-core@0.3.3` (shasum `cd96e1155d2c130991830b02c60bb60aa6388c52`, 2026-11-18T10:26:54Z) and `@loomlyne/ui-system-react@0.3.3` (shasum `824ced54d58f1dcdbf0c51f76033902f91cd3e0d`, 2026-11-18T10:27:32Z, depends on core `0.3.3`); both provenance-signed, dist-tag `latest`. Registry served both at 14:27:33 +0400 (about 2 minutes of processing lag).
- Clean install (empty folder, `--ignore-scripts`): both 0.3.3, core deduped; installed `ui.css` byte-identical to `main`; `Icon directional` renders `data-dir`, `Drawer side="start"` → `uis-drawer--start`, `side="left"` still `uis-drawer--left`.
- Claude Design System (https://claude.ai/artifact/XTKikX3yqayDRfUixvkNrS): live files were identical to 0.3.2 before the sync; version 44 = Icon + Drawer README, bundle.js, bundle.css, index.d.ts; version 45 = index `design-system.json` (only `lastChange` changed, `createdOnFiles` kept).

- Canvas (https://claude.ai/artifact/SqnaiuSLGdB9Q9GNrau13X), owner "Yes, copy it" (2026-11-18, relayed by the ALMAR controller): `project/ds/uis/` tokens.json, components/bundle.js, components/bundle.css copied server-side from Design System version 45; `designSystems` record bumped to version `1794997556-6ba1`, `copiedAt` 2026-11-18T10:52:08Z, nothing else in `canvas.json` changed. Canvas version 86 (`1794999142-49d0`). The copied files match `main` (bundle.js `41fe138c`, bundle.css `7e612097`, tokens.json `4c8aa885`).
- Main checkout `/Users/koss/Developer/ui-system` fast-forwarded to `ea0e55d` (it was clean, with no other session's worktree on it).

## Open

- Not done, recommendation for later: `Button iconRight="arrow-right"` cannot be marked directional (needs a prop); `Reveal` effects `slide-left`/`slide-right` are physical (anime.js); a kbd `⌘K` shows as `K⌘` in RTL (bidi, not CSS sides). `pages.yml` keeps its old CI findings (untouched).
