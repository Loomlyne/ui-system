# UI System: notes for Claude

Brand-agnostic design system. One `ui.config.json` per project drives colors, radius, type, logo and navigation. Nothing client-specific is ever baked into the defaults.

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
- People without a photo: `Avatar` (DiceBear, CC0). Never stock or invented photos.
- Animation: anime.js v4 through `Reveal`, `CountUp`, `anime`. Respect `config.motion` and reduced motion.
- Extra effects: React Bits (`npx shadcn@latest add @react-bits/<Name>-TS-TW`), recolored with `--uis-*`.
- Extra app components: Untitled UI React + `@ui-system/core/untitled-ui.css`.
- Search Mobbin for references before designing a new screen or section; cite the links.
- `node scripts/build-assets.mjs` regenerates design/assets (icons, marks, avatars); new files must be uploaded as design-system assets and recorded in design/assets.json.

## Claude Design
- Design system: "UI System" (namespace `UIS`, canvas folder `uis`). Publish changed files from `design/claude-design-system/project`; the index `design-system.json` goes last, keeping `createdOnFiles` from the live copy and updating `lastChange`.
- Canvas: "UI System", 20 boards. Each board wraps content in `UIS.Root` with the shared Tweaks (primary, accent, neutral, mode, roundness, pill, fontPreset, buttonCase, surface, density, wordmark, caption, logoMark, logoVariant, logoPlacement, logoSrc, markSrc). After a design system update, re-copy `tokens.json`, `components/bundle.js`, `components/bundle.css` into `project/ds/uis/` and bump the `designSystems` record.
