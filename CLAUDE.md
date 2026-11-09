# UI System: notes for Claude

Brand-agnostic design system. One `ui.config.json` per project drives colors, radius, type, logo and navigation. Nothing client-specific is ever baked into the defaults.

## Scope

- **Dashboards and back-office apps:** built from UI System components end to end.
- **Websites and mobile apps:** layout, flows and motion come from real references, Mobbin for web and Appllama for mobile. UI System supplies the tokens (color, radius, type, logo), avatars and motion engine, and its components where they fit.

## Layout
- `packages/core`: engine (`config.ts` defaults, `color.ts` OKLCH scales, `radius.ts`, `type.ts` font presets, `theme.ts` buildTheme, `exports.ts` CSS/Tailwind/Claude Design tokens, `cli.ts`). `styles/ui.css` holds every component as `uis-*` classes reading `--uis-*` variables. `styles/tailwind.css` is generated.
- `packages/react`: components (`Root`, `Logo`, `primitives.tsx`, `nav/front.tsx`, `nav/back.tsx`). `build.mjs` emits the ESM library and `dist/uis.bundle.js` (IIFE, `window.UIS`, React from `window.React`).
- `apps/playground`: Next.js 16 static export, deployed to GitHub Pages.
- `scripts/build-design.mjs` + `scripts/design-catalog.mjs`: generate the Claude Design System into `design/claude-design-system/project` (tokens.json, README, bundle, per-component README + preview, cover).

## Commands
`pnpm build` · `pnpm typecheck` · `pnpm design` · `pnpm dev` · `pnpm playground:build`

## Rules
- New visual values go through the engine and become `--uis-*` variables; components never hard-code colors or radii.
- Every component works three ways: React props, plain CSS classes, and `x-import` attributes in Claude Design (so props must accept plain data; slots also accept children).
- Text roles must keep 4.5:1 contrast in both themes (`contrast()` in core).
- When a component or prop changes: update `design-catalog.mjs` (README + preview), run `pnpm build && pnpm design`, then sync the Claude Design System.

## Libraries (see docs/libraries.md)
- Icons: always Hugeicons (https://hugeicons.com), free stroke-rounded set via `@hugeicons/core-free-icons`, through `ICONS`/`SOURCE` in `packages/react/src/Icon.tsx`. Never hand-draw a path, use emoji or another set, in code or on a canvas board (owner, 2026-11-08).
- People without a photo: `Avatar` (DiceBear, CC0). Never stock or invented photos.
- Animation: anime.js v4 through `Reveal`, `CountUp`, `anime`. Respect `config.motion` and reduced motion.
- Extra effects: React Bits (`npx shadcn@latest add @react-bits/<Name>-TS-TW`), recolored with `--uis-*`.
- Extra app components: Untitled UI React + `@ui-system/core/untitled-ui.css`.
- Search Mobbin for references before designing a new screen or section; cite the links.
- `node scripts/build-assets.mjs` regenerates design/assets (icons, marks, avatars); new files must be uploaded as design-system assets and recorded in design/assets.json.

## Claude Design
- Names (owner, 2026-11-08): design system "UI System · Design System", canvas "UI System · Canvas", archive "UI System · Retail decisions (archive)".
- Design system: "UI System · Design System" (namespace `UIS`, canvas folder `uis`). Publish changed files from `design/claude-design-system/project`; the index `design-system.json` goes last, keeping `createdOnFiles` from the live copy and updating `lastChange`.
- Presets are ways of designing, not products (owner, 2026-11-09): `ledger` (round), `atelier` (sharp, was `retail-editorial`); later `mist`, `signal`, `studio`. Labels are code names only; products are "seen in" examples and skins. What you build is a separate `kind` (shop, app, website, booking, portfolio). Three picks: preset, kind, brand on top; a product may override anything. Improvements found in a product come back as a picture-first proposal for the preset, landing on the owner's yes.
- Canvas: "UI System · Canvas", pages Start here / Foundations / Presets / Kinds / Components · overview / one page per component family (Components › Button … › Nav · App) / Patterns / Navigation · shells / Use cases / Archive (owner, 2026-11-09). Each family page has one generated board (`scripts/canvas/componentpages.py`, layout by `scripts/canvas/reorganise.py` from the live canvas.json): every state, size and icon drawn once, re-themed by its Tweaks, with a live contrast line. Tweaks over copies (owner, 2026-11-09): never draw the same component again per preset, palette, skin or shape; the `skin` Tweak (none + the 8 products) fills Root's `config`, a Tweak left at its default follows the skin and preset, one you change wins. The older per-skin Themes grids are on Archive. The coverage row checks nine states (default, hover, focus, active, selected, disabled, loading, error, empty); a state UI System lacks is marked Gap, never drawn as a working control. Measured board heights live in `scripts/canvas/componentpages_heights.json` (tallest across every skin and preset). Superseded boards move to Archive, never deleted. The older multi-family sheets (every variant, size, icon placement, state, shape, type, preset, plus rules) are on Archive; Patterns holds articles, places, website sections, commerce and app blocks. Boards are never slim: a new component gets its full sheet (owner, 2026-11-08). Every preset gets one full design sheet on Presets (rules, never, questions, colour roles with source/seed/derived, contrast, type, shape, buttons, forms, status, feedback, cards and data, nav, a sample screen, its ui.config.json), computed live with `UIS.buildTheme`, with the products that use it as skins side by side and a skin Tweak (owner, 2026-11-09; replaces the per-product sheets of 2026-11-08). Start here asks the preset, kind and brand questions; Kinds draws each kind's page set. Check boards before publishing: serve the board, `ds/uis/components/bundle.{js,css}` and the type's `artifact-type/dc-runtime.js` saved as `support.js` from one local folder, open it in the browser pane and measure the real height. Each board wraps content in `UIS.Root` with the shared Tweaks (skin, preset, primary, accent, neutral, mode, roundness, pill, fontPreset, buttonCase, surface, density, wordmark, caption, logoMark, logoVariant, logoPlacement, logoSrc, markSrc). After a design system update, re-copy `tokens.json`, `components/bundle.js`, `components/bundle.css` into `project/ds/uis/` and bump the `designSystems` record.
