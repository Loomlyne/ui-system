UI System is a brand-agnostic design system. It ships structure, not a brand: every project sets its own colors, shape, type and logo through one config, and every component follows. Nothing from a previous client is prebuilt.

## Start every design here

1. Mount the bundle and wrap each artboard or page in `UIS.Root`. Pass the project's brand as props on Root, never on individual components:
   `<x-import component-from-global-scope="UIS.Root" primary="#…" accent="#…" roundness="{{60}}" pill="{{false}}" font-preset="modern" wordmark="Client" logo-mark="monogram" logo-placement="left">…</x-import>`
2. Build screens from the real components (`UIS.NavIsland`, `UIS.AppShell`, `UIS.Button`…). Style your own markup with the `--uis-*` variables Root writes (`var(--uis-primary)`, `var(--uis-ink-2)`, `var(--uis-r-card)`), never raw hex.
3. Load fonts with one Google Fonts link in `<helmet>`: `https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400..700&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..600&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&family=Fraunces:ital,wght@0,400..700;1,400..700&family=Space+Grotesk:wght@400..700&family=Space+Mono:wght@400;700&family=Manrope:wght@400..800&family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400..700&display=swap` (every preset), or the single-preset URL `theme.fontsUrl` returns.
4. When the brand is unknown, keep the neutral defaults and write placeholders like [BRAND], [AMOUNT], [DOMAIN]. Never invent figures, testimonials or client names.

The same config drives code: `ui.config.json` in the repo builds theme.css, a Tailwind v4 theme and this tokens.json (`ui-system build`).

## Color

Set three seeds and the system derives everything else, checked for contrast:
- `primary`: primary buttons, active nav items, selected states, links. The exact hex lives in its scale. Default `#1C1B19` (ink), so a new project looks finished before it has a brand.
- `accent`: highlights, "new" badges, counts, focus ring, charts. Use sparingly: one accent moment per view.
- `neutral`: tints every grey (warm seed, warm greys). `auto` borrows the primary's hue.

Roles and rules:
- Page on `bg`; cards, inputs and sheets on `surface`; subtle wells on `surface-2`; hover fills `surface-3`.
- Text: `ink` for primary copy, `ink-2` for secondary, `ink-3` for captions and placeholders. All three pass 4.5:1 on `bg` and `surface` in both themes.
- Text on a fill always uses its pair: `primary-ink` on `primary`, `accent-ink` on `accent` (black or white, chosen by contrast). Tinted chips use `*-soft` with `*-soft-ink`. Brand color as text uses `primary-text`/`accent-text` (4.5:1 on `bg`).
- Status: `success`, `warning`, `danger`, `info`, each with `-soft`, `-soft-ink`, `-text`. Always pair status color with a word or icon.
- Dark mode (`mode="dark"`) is derived, not designed separately: fills that would vanish are lifted, an ink primary flips to near-white.
- Over photography use `on-image` text on the `image-scrim` gradient; buttons there use the `light` or `glass` variants.

## Shape: radius from sharp to round

One `roundness` value (0–100) scales every radius role together; `pill` turns controls, chips, inputs and floating nav shells into full pills independently.

| role | token | used for | at 0 | at 100 |
|---|---|---|---|---|
| chip | `radius-chip` | badges, tags | 0 | 10 |
| control | `radius-control` | buttons, nav items, tabs | 0 | 14 (pill: 999) |
| field | `radius-field` | inputs, selects | 0 | 14 (pill: 999) |
| card | `radius-card` | cards, tables | 0 | 24 |
| panel | `radius-panel` | popovers, drawers, dialogs, inset panels | 0 | 32 |
| media | `radius-media` | images, video | 0 | 22 |
| shell | `radius-shell` | floating navs, docks, islands | 0 | 22 (pill: 999) |

Presets: sharp 0, crisp 25, soft 50, rounded 75, round 90 + pill. Nested elements use `radius-inner` (panel minus its padding). Avatars become circles from 70 or in pill mode.

## Type

Pick a preset with `fontPreset` (all Google Fonts), or override `displayFont`/`bodyFont` with any Google family.

| preset | display | body | mono | fits |
|---|---|---|---|---|
| `modern` | Inter Tight | Inter | JetBrains Mono | Tight neutral sans. Works for SaaS, agencies, dashboards. |
| `geometric` | Geist | Geist | Geist Mono | Clean geometric sans with a technical edge. |
| `editorial` | Fraunces | Inter | JetBrains Mono | Soft serif headlines over a neutral sans. Hospitality, food, lifestyle. |
| `grotesk` | Space Grotesk | Inter | Space Mono | Characterful grotesk. Tech, creative studios, launches. |
| `humanist` | Manrope | Manrope | JetBrains Mono | Friendly and open. Consumer apps, services. |
| `classic` | Instrument Serif | Instrument Sans | JetBrains Mono | Elegant high-contrast serif. Luxury, real estate, fashion. |

Styles: `display-2xl` 80, `display-xl` 64, `display-l` 48, `display-m` 36 in the display face (they shrink on small screens); `h1` 30, `h2` 24, `h3` 20, `body-l` 18, `body` 16, `body-s` 14, `label` 13, `caption` 12, `overline` 11 uppercase. CSS classes carry the same names with a `uis-` prefix. `buttonCase="upper"` sets buttons and the menu button in spaced capitals. Sentence case everywhere else.

## Logo

- Variants: `lockup` (mark + wordmark, the default in navs), `stacked` (splash, covers, footers only), `mark` (rails, docks, favicons, tight mobile bars), `wordmark`.
- Generated marks until the client's logo exists: `monogram` (initials in a tile whose corners follow roundness), `ring`, `spark`, `stack`, `orbit`, or `none`.
- The client's real logo: upload it and pass `logoSrc` (full logo) and `markSrc` (mark only) on Root. Never redraw a real company's mark.
- `markTone="current"` follows the text color (works on images and dark bars); `primary` fills the mark with the brand color.
- Placement: `logoPlacement` left|center|right on Root sets the default for every nav; each nav also takes its own `logoPlacement`.
- Keep clear space equal to the mark's height. Minimum: mark 20px, lockup 96px wide.

## Navigation

Frontend (websites):
- `NavIsland`: floating top bar. Default for marketing, SaaS, agencies.
- `NavBar`: full-width top bar; `transparent` over a hero. Content-heavy and service sites.
- `NavStacked`: utility strip + logo row + link row. Commerce and editorial.
- `NavDock`: floating bottom bar with an explore panel; logo at the top. Immersive, image-led, mobile-first brands.
- `NavMinimal`: logo + Menu button opening a full-screen menu. Studios, luxury, one-pagers.
- `NavMobile`: `sheet`, `tabbar` or `floating` for phones.

Backend (apps), through `AppShell variant=…`:
- `sidebar` for dashboards (default), `rail` when content needs width, `inset` for a softer premium frame, `topbar` for 3–6 sections, `dock` for canvas-style editors. `PageHeader` tops every page.

Mark the current page with `active: true` on its link. Keep 4–6 top-level links; more go into the dock panel, the stacked link row or the sidebar.

## Surfaces, depth and motion

- `surface="glass"` frosts floating navs, docks and popovers (`float-bg`, `float-border`, 20px blur); `solid` keeps them opaque. Use glass over photography, solid over busy UI.
- Shadows: `shadow-sm` resting cards, `shadow-md` menus, `shadow-lg` drawers and dialogs, `shadow-float` floating navs. `shadow="none"` flattens everything for border-led brands; `border="none"` removes card hairlines for shadow-led brands.
- Density sets control heights (`control-sm|md|lg`: 36/44/52 comfortable) and card padding. Touch targets stay at least 44px at comfortable.
- Motion: panels ease out with `cubic-bezier(0.16, 1, 0.3, 1)` over 280ms; drawers slide over 500ms. Everything collapses under reduced motion.

## Iconography

Use `UIS.Icon` by name: stroke icons on a 24px grid at 1.75 stroke with round joins, drawn for this system and inheriting text color. No emoji, no second icon set. Icon-only buttons always carry a `label`.

## Content fundamentals

Sentence case for headings, buttons and labels. Buttons are verbs ("Book a table", "Send invoice"). Short, specific copy; the layout carries the meaning, not paragraphs. Numbers in tabular figures. Placeholders in brackets until real content exists.
