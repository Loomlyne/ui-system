# Quick 261118: right-to-left safe ui.css (logical properties)

- Opened: 2026-11-18 09:54 +0400, work session started by the ALMAR controller (owner approved in a question form, 2026-11-18: "Approved, start it").
- Branch: `fix/rtl-logical-properties` from `8f50b57` (0.3.2).
- Input (read-only): ALMAR `19-RTL-DEFECTS.md` (15 defects), `scripts/uis-rtl-audit.mjs`, before pictures, branch `gsd/phase-19-02-rtl-defects`. Owner decision D-08 (ALMAR): the fix lives in UI System, logical properties only, no RTL stylesheet, LTR pixels identical, Arabic pictures to the owner first.

## Tasks

1. `ui.css`: every physical side → logical (`inset-inline-*`, `margin-inline-*`, `padding-inline-*` / `padding-block-*`, `border-inline-*`, `text-align: start`). Defects 1-13, 15.
2. One `--uis-dir` variable (`[dir="ltr"]` 1, `[dir="rtl"]` -1) for the switch knob, the `uis-slide` keyframe and the menu arrow offset. `[dir="rtl"]` twins where LTR must stay byte-identical.
3. Direction icons: `Icon directional` → `data-dir`; `[dir="rtl"] .uis-icon[data-dir] { scale: var(--uis-dir) 1 }`. Marked: breadcrumbs, mobile sheet rows, full-screen menu arrow. Neutral icons never.
4. Password eye stays physical right (owner rule). The whole password control stays physical so nothing collides with the eye in RTL (icon left, kbd left of the eye, label after the eye).
5. Row 14 (`data-placement="right"` + `row-reverse`): recommend **logical** and document it (docs/rtl.md, config.ts, ui.css comment). Owner signs with the pictures.
6. React: island padding, topbar margins, Table `align` (left/right → start/end), Drawer `side` end|start (right|left kept as aliases, same classes for old callers).
7. Test: `packages/core/test/rtl.test.mjs` + `rtl-audit.mjs` (`pnpm test`); CI job `rtl`; `publish.yml` runs `pnpm test` before publishing.
8. Pictures: Arabic before/after, 15 components × 390/768/1440 × light/dark, plus 5 extra scenes for the other touched parts; LTR before/after pixel proof on all 20 scenes.
9. Stop: owner sees the pictures through the controller. No merge, no publish before his yes. After yes + merge: 0.3.3 for both packages via `publish.yml` (OIDC).

## Not in scope

ALMAR files; Arabic copy; colours, radii, spacing, fonts; LTR output; `pages.yml`.
