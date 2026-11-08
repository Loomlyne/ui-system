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
- Canvas: "UI System · Canvas", pages Start here / Foundations / Components / Patterns / Navigation / Use cases / Presets / Preset sheets. Components has one sheet per family (every variant, size, icon placement, state, shape, type, preset, plus rules); Patterns holds articles, places, website sections, commerce and app blocks. Boards are never slim: a new component gets its full sheet (owner, 2026-11-08). Every product preset gets its own full design sheet on Preset sheets (rules, colour roles with source/seed/derived, contrast, type, shape, buttons, forms, status, feedback, cards and data, nav, a sample screen, its ui.config.json), computed live with `UIS.buildTheme` from that config, with a variant Tweak for shipped vs planned (owner, 2026-11-08). Check boards before publishing: serve the board, `ds/uis/components/bundle.{js,css}` and the type's `artifact-type/dc-runtime.js` saved as `support.js` from one local folder, open it in the browser pane and measure the real height. Each board wraps content in `UIS.Root` with the shared Tweaks (primary, accent, neutral, mode, roundness, pill, fontPreset, buttonCase, surface, density, wordmark, caption, logoMark, logoVariant, logoPlacement, logoSrc, markSrc). After a design system update, re-copy `tokens.json`, `components/bundle.js`, `components/bundle.css` into `project/ds/uis/` and bump the `designSystems` record.
