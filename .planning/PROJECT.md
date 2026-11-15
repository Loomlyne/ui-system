# UI System

## What This Is

A brand-agnostic design system. One `ui.config.json` per project drives colors, radius, type, logo and navigation; nothing client-specific is baked into the defaults. It ships as `@loomlyne/ui-system-core` (engine, CLI, CSS), `@loomlyne/ui-system-react` (components, nav, app shells) and a `window.UIS` bundle for Claude Design. Owner: Koss. Users: Koss's product repos (Caractère, Senorita, ALMAR, Invios, Clickit, Vamos, Sahti, Obox, Koussay) and Claude sessions building them.

## Core Value

A product repo picks a preset, a kind and a brand, installs UI System from npm, and gets a themed, contrast-safe UI that passes `ui-system check`.

## Requirements

### Validated

<!-- Shipped on main through PR #9 (2026-11-13), before GSD. Source: .planning/intel/git-history.txt -->

- ✓ Config-driven engine (OKLCH color scales, radius roles, type presets, buildTheme, CSS/Tailwind/Claude Design exports) and playground on GitHub Pages — 2933bea, 2026-09-27
- ✓ DiceBear avatars, anime.js v4 motion (Reveal, CountUp) — 65131c1, 2026-09-27
- ✓ Dashboard-first scope; websites via Mobbin, mobile via Appllama — 0404be9, 2026-09-27
- ✓ `atelier` preset (was `retail-editorial`, alias kept), designed dark palette — b6dabcc … b758b2f, 2026-11-07 to 2026-11-09
- ✓ `ledger` preset — 80cc611, 2026-11-07
- ✓ `PRESETS` and `contrastReport` on `window.UIS`; seed change drops preset pins — f752db2, 8bc4a71, 2026-11-07
- ✓ Hugeicons free set for every icon; Claude Design names — b105f30, 2026-11-08
- ✓ Password eye input; field hint slot — aebdb5c, 9f28079
- ✓ Kinds (shop, app, website, booking, portfolio) with preset rules, never, questions — b758b2f, PR #6, 2026-11-09
- ✓ Canvas: one sheet per preset, Start here and Kinds boards, one generated page per component family, Tweaks over copies with skin Tweak — 7cc430b, 9cfdbe7, 7281bd3, PR #7, 2026-11-09
- ✓ Grouped canvas Tweaks; font preset beats a preset's own fonts — d29bc88, PR #9, 2026-11-13
- ✓ `/ui` Claude Code plugin with step router and rule files — 277913a, PR #8, 2026-11-13
- ✓ Motion split (`motion.enabled: false` stops CSS micro states), phone shells hand off to dock below 768px, honest `ui-system check` — 44cead0, 2026-11-13

### Active

Milestone v0.1 "Published and current". Detail and IDs in REQUIREMENTS.md.

- [ ] `@loomlyne/ui-system-core` and `@loomlyne/ui-system-react` 0.1.0 on npm via `publish.yml` (driver: Caractère Phase 1). Both `0.1.0` are public as of 2026-11-15, published from the terminal, not from `publish.yml`. PR #11 is on main. Both packages trust that workflow. The workflow has not published a version.
- [ ] Docs match shipped code and owner decisions
- [ ] Preset `mist` (glass, soft)
- [ ] Preset `signal` (bold pill and yellow)
- [ ] Preset `studio` (colour pop)

### Out of Scope

- atelier resting search pill has no edge (1.10:1 light, 1.26:1 dark) — accepted gap, kept as in the Senorita source (docs/presets.md)
- ledger has no own active nav colour; engine sidebar active state applies — accepted gap (docs/presets.md)
- ALMAR moving onto atelier, Clickit moving onto ledger — work in those product repos (one product per session)
- Presets named after products — presets are ways of designing; products are skins (D-05)
- Vercel hosting — default stack is Cloudflare/GitHub Pages; playground stays on GitHub Pages

## Context

- Monorepo, pnpm. `packages/core/src/*` (cli, color, config, exports, index, kinds, presets, radius, theme, type), `packages/core/styles/ui.css` (`uis-*` classes on `--uis-*` vars), `packages/react` (Root, Logo, primitives, nav/front, nav/back, Icon, Motion; `build.mjs` emits ESM + IIFE bundle), `apps/playground` (Next.js 16 static export), `scripts/` (design build, catalog, assets, `canvas/*.py`).
- CI: `ci.yml`, `pages.yml`, `publish.yml` (manual dispatch, `--access public`; moves to trusted publishing after 0.1.0).
- Live playground: https://loomlyne.github.io/ui-system/
- Claude Design artifacts: "UI System · Design System" (namespace `UIS`), "UI System · Canvas", "UI System · Retail decisions (archive)".
- Skins in the canvas skin Tweak: Senorita, ALMAR (atelier); Invios, Clickit (ledger); Vamos, Koussay, Sahti, Obox (no engine preset).
- Known state 2026-11-15: packages not yet on npm (E404); Koss logged in as koussayz and owns org `loomlyne`; publish workflow never run.
- Stale docs list: .planning/INGEST-CONFLICTS.md (INFO entries).

## Constraints

- **Runtime**: browsers — React 19 library (peer `react >=18`), plain CSS classes, Claude Design IIFE bundle (`window.UIS`, React from `window.React`); playground is a Next.js 16 static export on GitHub Pages.
- **Engine-only values**: new visual values go through the engine as `--uis-*`; components never hard-code colors or radii (D-10).
- **Three ways**: every component works as React props, plain CSS classes and `x-import` in Claude Design; props accept plain data (D-11).
- **Contrast**: every text role 4.5:1 in light and dark; `pnpm design` fails below (D-12, C-03).
- **Libraries**: Hugeicons, DiceBear, anime.js v4, React Bits, Untitled UI only (C-07); `ui-system check` enforces.
- **Change protocol**: component/prop change → `design-catalog.mjs`, `pnpm build && pnpm design`, publish design system with `design-system.json` last, re-copy bundle into canvas `ds/uis/` (C-09); check boards locally before publishing (C-10).
- **Secrets**: npm login, org and 2FA are Koss's steps in his terminal; never typed into chat or a file.
- **Gates**: publish to npm, merge, push `main` need Koss's word.

## Key Decisions

<decisions>
Locked (owner word, dated). Full text: .planning/intel/decisions.md.

| ID | Decision | Date | Status |
|----|----------|------|--------|
| D-01 | Icons are Hugeicons free stroke-rounded only, via `ICONS`/`SOURCE` in Icon.tsx | 2026-11-08 | Locked, shipped |
| D-02 | Names: "UI System · Design System" (`UIS`, folder `uis`), "UI System · Canvas", "UI System · Retail decisions (archive)" | 2026-11-08 | Locked, shipped |
| D-03 | Boards are never slim: a new component gets its full sheet | 2026-11-08 | Locked, shipped |
| D-04 | Per-product preset sheets | 2026-11-08 | Superseded by D-08 |
| D-05 | Presets are ways of designing (ledger, atelier; later mist, signal, studio, one at a time, pictures first); kind is separate; preset, kind, brand on top; product improvements return as picture-first proposals | 2026-11-09 | Locked; mist/signal/studio pending |
| D-06 | Canvas pages Start here … Archive; one generated board per component family; nine-state coverage row, missing state marked Gap | 2026-11-09 | Locked, shipped |
| D-07 | Tweaks over copies; skin Tweak (none + 8 products) | 2026-11-09 | Locked, shipped |
| D-08 | One full design sheet per preset on Presets, computed live with `UIS.buildTheme`, skins side by side | 2026-11-09 | Locked, shipped |
| D-09 | Grouped Tweaks: Style, Colour, Shape and type, Logo (nav boards only); all but Style start at `style` | 2026-11-10 | Locked, shipped |
| D-10 | Engine-only visual values as `--uis-*` | undated | Locked |
| D-11 | Every component works three ways (React, CSS, x-import) | undated | Locked |
| D-12 | Text contrast 4.5:1 both themes; `pnpm design` gate | undated | Locked, shipped |
| D-13 | DiceBear avatars, anime.js v4 motion, respect `config.motion` and reduced motion | undated | Locked, shipped |
| D-14 | Dashboards first; websites/mobile from real references | 2026-09-27 | Locked |
| D-15 | Atelier info tone is ink on grey | 2026-11-07 | Locked, shipped |
| D-16 | Atelier designed dark palette (option A) | 2026-11-07 | Locked, shipped |
| D-17 | `retail-editorial` renamed `atelier`, alias kept | 2026-11-09 | Locked, shipped |
| D-18 | Ledger follows Invios D-05/D-12 and signed sketch; pins nothing | 2026-11-07 | Locked, shipped |
| D-19 | Merge order defaults → preset → your keys; seed change drops that seed's pins | 2026-11-07 | Locked, shipped |
| D-20 | Publish `@loomlyne/ui-system-core` and `@loomlyne/ui-system-react` 0.1.0 to npm in milestone 1 (scope `@ui-system` taken → `@loomlyne`); first publish by Koss locally with 2FA, then trusted publishing; decisions/2026-11-15-npm-*.md | 2026-11-15 | Locked, in progress |
</decisions>

## Evolution

After each phase: move shipped requirements to Validated with phase reference, invalidated ones to Out of Scope with reason, log new decisions (file in `.planning/decisions/`), re-check "What This Is". After the milestone: full review, Core Value check.

---
*Last updated: 2026-11-15 after GSD ingest (new-project-from-ingest)*
