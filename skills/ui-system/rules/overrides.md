# UI System overrides for outside skills

Read when: you are about to load, or have just loaded, any skill named in the SKILL.md step table. These lines win over that skill's own text. Where a skill says nothing below, follow it as written.

## Applies to every outside skill

1. UI System's hard rules (SKILL.md §3) and the repo's preset come first. A skill's advice that breaks one is a conflict: go to SKILL.md §4 (two pictures, ask). Never bend a rule silently.
2. Every value a skill gives (a colour, radius, size, duration, curve or shadow) goes into `ui.config.json` or a `--uis-*` variable. Never put it inline in a component.
3. Icons in any example become Hugeicons through `Icon`. Emoji and other icon sets are dropped.
4. People in any example become `Avatar` (DiceBear). Sample data is labelled as sample. No invented prices, metrics, logos or quotes.
5. If the skill is not installed (a cloud session or another machine), use the summary here and in SKILL.md. Install it only on the owner's yes.

## Per skill

| Skill | Keep | Override |
|---|---|---|
| `frontend-design` | Thinking about direction, hierarchy and one strong idea per page | **The preset always wins.** No new fonts or palettes. A different font only when the owner names it for this project; record it in `ui.config.json` (`type`). "Bold" happens inside the preset and brand seeds. References come from Mobbin or Appllama, never imagination. |
| `better-ui` | Concentric radius, optical alignment, hit areas, surface depth, its exact values | Motion follows `rules/motion.md`. Radii come from radius roles (`--uis-r-*`). Icons are Hugeicons. |
| `better-layout` | Grouping, reading order, progressive disclosure | Dashboards use UI System shells (AppShell, sidebar, rail, topbar, dock). Spacing comes from density tokens. |
| `better-typography` | Wrapping, tabular numbers, line length, OpenType details | Fonts and the scale come from the font preset (`type.ts`). Never pick a font on its advice. |
| `better-colors` | Contrast thinking, semantic roles, how to choose seeds | The engine derives every role from seeds (OKLCH). Change seeds, never hand-pick hex. Text roles must pass `contrast()` at 4.5:1 in both themes. |
| `better-accessibility` | Everything | Reduced motion is `config.motion` plus the media query, already wired in `Root` and `ui.css`. |
| `better-writing` | Everything | Add SKILL.md §3.8 honesty: no invented prices, rates, legal copy or amounts; ask. |
| `better-interface` | The combined review across the `better-*` skills | Add `ui-system check` and the SKILL.md §3 list to the review. Report as verified, not verified, failed. |
| `good-css` | Modern CSS (container queries, `:has`, logical properties, fewer wrappers) | Values come from `--uis-*`. Component styles live in `ui.css` as `uis-*` classes, not per screen. |
| `web-perf` | Everything | Only on a deployed or built site. Fonts load through `Root`'s `fontsUrl`; don't add a second font loader. |
| `theme-factory`, `brand-guidelines` | The idea of a reusable theme or brand pack | A brand or theme enters only as `ui.config.json` seeds (primary, accent, neutral, mode, fontPreset, logo). Never use their built-in palettes or Anthropic's brand. |
| `web-artifacts-builder` | Building a larger HTML page or artifact | Load `dist/uis.bundle.js` (`window.UIS`) so the page uses real components and tokens. |
| `gsd-ui-phase`, `gsd-ui-review`, `gsd-sketch` | The UI-SPEC contract, the 6-pillar score, quick sketches | Only in a repo with `.planning/`. The spec names preset, kind, track and cited references. Sketches use the UI System bundle and always show at least 2 options. |
| `webapp-testing` | Playwright on the local app | Also check light and dark, 375 px width, keyboard, and `ui-system check` (SKILL.md §8). |
| `canvas-design`, `algorithmic-art`, `dataviz`, `artifact-design`, `artifact-diagramming` | Their own craft for posters, art, charts and published pages | For a UI System product, colours come from the theme (`UIS.buildTheme`), Hugeicons for icons, and no fake data in charts. |
| `anatomy` | Everything | Follow `rules/anatomy.md`. |
