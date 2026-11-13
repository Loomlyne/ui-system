---
name: ui-system
description: Use whenever the user mentions UI System, "my design system", "the universal design system", or asks to build, restyle or review any dashboard, back office, website, landing page, shop, booking flow, portfolio or mobile app UI in any repo. The rules below are mandatory, not suggestions.
---

# UI System: critical rules

UI System (github.com/Loomlyne/ui-system) is the one design system for every project. When this skill applies, every rule below is binding. If a request conflicts with a rule, say which rule and ask; never bend it silently.

## 0. Is it set up here?

Check the open repo for `ui.config.json` and a dependency on `@ui-system/react` or `@ui-system/core`.

- Missing: run the `/ui-system:ui` command (setup) before designing anything.
- Present: read `ui.config.json`. Its `preset`, `kind` and `brand` are the contract for this repo. Do not change them without being asked.

## 1. Three picks, in this order

1. **Preset** = how it looks (`ledger` round and clean, `atelier` sharp and editorial). A preset is a way of designing, never a product name.
2. **Kind** = what is built (`shop`, `app`, `website`, `booking`, `portfolio`).
3. **Brand** on top (wordmark, mark, colors). A product may override anything; the preset is the base.

Print the preset's own rules, never-list and questions with `npx -p @ui-system/core ui-system init --preset <id> --kind <id>` (or read `packages/core/src/presets.ts` and `kinds.ts` in the UI System repo). Those printed rules are part of this skill. Follow them. Ask the printed questions before designing when the answers are not already in the repo.

## 2. Track

| Building | Layout and flows come from | UI System supplies |
|---|---|---|
| Dashboard, admin, back office, internal tool | UI System components end to end (AppShell, sidebar/rail/topbar/dock, PageHeader, Table, Stat, forms) | Everything |
| Website, landing, shop, booking, portfolio | Real references: Mobbin (search_sections, search_screens, search_flows), 5 to 10 per section, cite the links | Tokens (color, radius, type, logo), Avatar, motion, front navs and components where they fit |
| Mobile app (Expo / React Native) | Real references: Appllama (get_credits first, free), cite `app_id/screen_id` | Exported tokens (`tokens.json`), DiceBear `avatarSvg` through react-native-svg. Motion per the Appllama skill (Reanimated), not anime.js |

Never design a website or app from imagination. Never copy another product's branding, copy, logo or watermark.

## 3. Hard rules (never break)

1. **No hard-coded color, radius, font or shadow.** Web uses `--uis-*` variables or the Tailwind utilities from `@ui-system/core/tailwind.css`. Mobile uses the exported tokens. A new visual value goes into the engine (`ui.config.json`), never inline.
2. **Contrast.** Every text role keeps 4.5:1 in light and dark. Seed colors change, roles are re-derived; never pin a role that fails.
3. **Icons: Hugeicons only** (free stroke-rounded set, `@hugeicons/core-free-icons`, through UI System's `Icon`). No emoji, no hand-drawn paths, no other icon set. Mobile follows the Appllama skill.
4. **People without a photo: `Avatar`** (DiceBear, CC0, name as seed). A real photo only when the user supplies one. No stock photos, AI faces, pravatar or randomuser.
5. **Motion: the split rule (`rules/motion.md`).** CSS in `ui.css` for hover, press and focus; anime.js v4 through `Reveal`, `CountUp`, `anime` for entrances, reveals and counts; both on the shared `--uis-dur*` / `--uis-ease*` tokens. No GSAP, no Framer Motion. Respect `motion.enabled` and reduced motion. Dashboards stay subtle; a site gets at most one expressive moment per page. `CountUp` shows real figures only.
6. **Components first.** Use UI System components before anything else. Extra effects: React Bits (`npx shadcn@latest add @react-bits/<Name>-TS-TW`), recolored with `--uis-*`. Extra app components: Untitled UI React plus `@ui-system/core/untitled-ui.css`.
7. **Every component works three ways:** React props, plain `uis-*` CSS classes, and plain data props (slots also accept children).
8. **Honest UI.** No fake testimonials, logos of real companies, invented metrics or people. Sample data is labelled as sample. Never invent prices, rates, legal copy or amounts, not even placeholders: ask.
9. **A shown control works end to end.** No dead buttons, no fake toggles, no placeholder links.
10. **One theme source.** One `ui.config.json` per project drives color, radius, type, logo and navigation. Never fork the CSS to restyle one screen.

## 4. Conflicts: stop and ask with two pictures

If a request, an existing design, a reference or a library conflicts with a rule in section 3 or with the preset's rules and never-list, do not pick a side and do not bend the rule. Stop, then:

1. Name the rule and what conflicts with it, in one sentence.
2. Show two pictures: option A follows the rule, option B follows the request. Render real mockups (images or a local page), not descriptions.
3. Ask one question, recommended option first, and wait. The owner's answer for this case is final; if he says it should become a standing exception, record it in the repo's `CLAUDE.md` or a preset proposal, never silently.

## 5. Automatic check

`npx -p @ui-system/core ui-system check` scans source for hard-coded colors, emoji, non-Hugeicons icon sets, banned motion libraries (framer-motion, gsap) and fake avatar sources. It exits 1 on any break. Run it before saying done and keep it in the repo's gate (`package.json` script `ui:check`). Never silence it by editing the check or adding `ui-system-allow` yourself: a flagged line is a conflict, so go through section 4.

## 6. When the user must choose

Every UI choice the user is asked to make comes with a picture of each option first (a rendered mockup, not words). One decision per question, recommended option first.

## 7. Existing repos

Restyling a repo that already has UI: keep its content, routes and logic, replace only the visual layer. First list what in the repo conflicts with the rules (colors, icon set, motion, avatars, fonts), group the conflicts, and take each through section 4 before changing anything that changes how the product looks. Map existing brand colors into `ui.config.json` seeds, not into code.

## 8. Before saying done

- Typecheck and build pass, and `ui-system check` exits 0.
- Open the page, look at it in light and dark, and at phone width.
- Check against section 3, one rule at a time, and list any rule that is not met.
- Report three lists: verified, not verified, failed.

## 9. Step guides: load only what the step needs

The craft lives in separate skills, so a session loads none of them until a step calls for one. At each step, load the named skill, then read `rules/overrides.md` (UI System wins where they disagree). Never load them all up front.

| Step | Load | Then read |
|---|---|---|
| Plan a screen or section | `frontend-design` (direction only); in a `.planning/` repo `gsd-ui-phase` | overrides: the preset always wins |
| Show the owner options or a conflict | `gsd-sketch` (or a local page on `dist/uis.bundle.js`) | §4, §6 |
| Lay out | `better-layout` | overrides |
| Type | `better-typography` | overrides |
| Colour or brand | `better-colors`; a brand pack goes through `theme-factory` / `brand-guidelines` ideas only | overrides: seeds only |
| CSS | `good-css` | overrides |
| Polish | `better-ui` | `rules/motion.md` |
| Motion | none | `rules/motion.md` |
| Accessibility | `better-accessibility` | overrides |
| Copy | `better-writing` | §3.8 |
| Explainer figure | `anatomy` | `rules/anatomy.md` |
| Poster, art, chart, published page | `canvas-design`, `algorithmic-art`, `dataviz`, `artifact-design` / `artifact-diagramming` | overrides |
| Larger HTML page or artifact | `web-artifacts-builder` | overrides |
| Speed (built or live site) | `web-perf` | overrides |
| Test | `webapp-testing` | §8 |
| Review | `better-interface`; in a `.planning/` repo also `gsd-ui-review` | §8 |

If a skill is not installed, work from SKILL.md plus `rules/overrides.md`, and say which skill was missing.

## 10. When the library itself changes

Only inside the ui-system repo (see its `CLAUDE.md`): update `scripts/design-catalog.mjs`, run `pnpm build && pnpm design`, then sync the Claude Design System. Improvements found in a product come back as a picture-first proposal for the preset, landing on the owner's yes.
