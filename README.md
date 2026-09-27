# UI System

One config for brand colors, radius, logos and navigation. Every project starts from the same system and gets its own brand: set a few values and the whole interface follows, from sharp to round, light to dark, solid to glass.

**Live playground:** https://loomlyne.github.io/ui-system/

```
ui.config.json  ──►  @ui-system/core  ──►  theme.css · tailwind.css · tokens.json (Claude Design)
                          │
                          └──►  @ui-system/react  ──►  Next.js / React apps
                                     │
                                     └──►  uis.bundle.js (window.UIS)  ──►  Claude Design canvases
```

## What's inside

| Path | What it is |
| --- | --- |
| `packages/core` | The engine. Config schema and defaults, OKLCH color scales, contrast-checked roles, the radius engine, font presets, and exporters for CSS variables, Tailwind v4 and Claude Design tokens. Ships the `ui-system` CLI and `styles/ui.css` (every component as plain CSS classes). |
| `packages/react` | React components: `Root` (theme provider), `Logo`, primitives, 6 frontend navs, 5 backend app shells. Also builds `uis.bundle.js`, a browser bundle exposing `window.UIS`. |
| `apps/playground` | Next.js playground: set the brand, preview a website and an app on desktop and mobile, export the config and code. Deployed to GitHub Pages. |
| `design/claude-design-system` | The generated Claude Design System (tokens, README, bundle, component guidelines and previews). |
| `docs/` | Guides for every part of the system. |

## Start a new project

1. **Set the brand.** Open the [playground](https://loomlyne.github.io/ui-system/), pick a starter, set colors, roundness, fonts, logo and navs, then *Export › ui.config.json*. Or write it by hand:

   ```json
   {
     "name": "Client",
     "brand": { "wordmark": "Client", "caption": "Dubai", "mark": "monogram", "placement": "left" },
     "color": { "primary": "#2F5D50", "accent": "#C4952E", "neutral": "#8A7F6A", "mode": "light" },
     "radius": { "roundness": 90, "pill": true },
     "type": { "preset": "editorial", "buttonCase": "upper" },
     "surface": { "float": "glass" },
     "nav": { "front": "dock", "back": "inset" }
   }
   ```

2. **Build the theme files.**

   ```bash
   pnpm install && pnpm build
   node packages/core/dist/cli.js build path/to/ui.config.json --out path/to/project/ui-theme
   # → theme.css, tailwind.css, tokens.json, theme.json
   ```

3. **Use it** in whatever the project runs on:

   - **Next.js / React**: wrap the app in `<Root config={config}>` and use the components.
     ```tsx
     import '@ui-system/react/ui.css';
     import { Root, SiteNav, AppShell, Button } from '@ui-system/react';
     import config from './ui.config.json';

     <Root config={config}>
       <SiteNav links={[{ label: 'Home', href: '/', active: true }]} cta={{ label: 'Contact', href: '/contact' }} />
     </Root>
     ```
   - **Tailwind v4**: `@import "tailwindcss"; @import "./ui-theme/theme.css"; @import "./ui-theme/tailwind.css";` then `bg-primary text-primary-ink rounded-control font-display shadow-float`.
   - **Plain HTML, Framer embeds, Shopify**: link `theme.css` and `ui.css`, then use the classes (`uis-btn uis-btn--primary`, `uis-bar`, `uis-card`…). `ui.css` is served by jsDelivr: `https://cdn.jsdelivr.net/gh/Loomlyne/ui-system@main/packages/core/styles/ui.css`.
   - **Claude Design**: pick *UI System* in the Theme menu of any Design canvas, wrap each artboard in `UIS.Root` with the brand props. See [docs/claude-design.md](docs/claude-design.md).

## The controls

| Control | Values | What it changes |
| --- | --- | --- |
| `color.primary` / `accent` / `neutral` | any hex | Full 11-step scales, hover states, tints, text-on-fill (auto black or white), dark theme. Text roles pass WCAG 4.5:1. |
| `color.mode` | `light`, `dark` | Default theme. Both are always generated. |
| `radius.roundness` | 0–100 | Every radius role together: chip, control, field, card, panel, media, shell. 0 is sharp, 100 is round. |
| `radius.pill` | boolean | Buttons, chips, inputs and floating nav shells become full pills on their own. |
| `type.preset` | `modern`, `geometric`, `editorial`, `grotesk`, `humanist`, `classic` | Display, body and mono families (Google Fonts). Override with `type.display` / `type.body`. |
| `type.buttonCase` | `normal`, `upper` | Button and menu label case. |
| `density` | `compact`, `comfortable`, `spacious` | Control heights and card padding. |
| `surface.float` | `solid`, `glass` | Floating navs, docks and popovers. |
| `surface.shadow` / `border` | `none`…`deep` / `hairline`, `none` | Depth and card borders. |
| `brand.*` | wordmark, caption, mark, variant, placement, logoSrc, markSrc… | The logo everywhere, see below. |
| `avatars.style` | `notionists-neutral`, `lorelei-neutral`, `thumbs`, `glass`, `shapes`, `initials` | DiceBear style for people without a photo. |
| `motion.enabled` / `intensity` | boolean / `subtle`, `expressive` | anime.js entrances and counters. |
| `nav.front` / `nav.back` | `island`, `bar`, `stacked`, `dock`, `minimal` / `sidebar`, `rail`, `inset`, `topbar`, `dock` | Default website nav and app shell. |

Full reference: [docs/config.md](docs/config.md).

## Logos

Four arrangements (`lockup`, `stacked`, `mark`, `wordmark`), five generated marks until the client's logo exists (`monogram`, `ring`, `spark`, `stack`, `orbit`), and real logos through `logoSrc` (full logo) and `markSrc` (mark only). Placement (`left`, `center`, `right`) is set once and every nav follows; each nav can still override it. [docs/logo.md](docs/logo.md)

## Navigation

| Frontend | Best for |
| --- | --- |
| `NavIsland` | Marketing sites, SaaS, agencies. Floating top bar. |
| `NavBar` | Content-heavy and service sites. Full-width, `transparent` over heroes. |
| `NavStacked` | Commerce and editorial. Utility strip, logo row, link row. |
| `NavDock` | Image-led and mobile-first brands. Floating bottom bar with an explore panel. |
| `NavMinimal` | Studios, luxury, one-pagers. Logo + Menu button, full-screen menu. |
| `NavMobile` | Phones: `sheet`, `tabbar` or `floating`. |

| Backend (`AppShell variant=`) | Best for |
| --- | --- |
| `sidebar` | Dashboards (default). |
| `rail` | Tools that need width. |
| `inset` | A softer premium frame; content in a floating panel. |
| `topbar` | Apps with 3–6 sections. |
| `dock` | Canvas-style editors. |

[docs/navigation.md](docs/navigation.md)

## Avatars, motion and outside libraries

- **Avatars:** people without a photo get a [DiceBear](https://github.com/dicebear/dicebear) avatar seeded by their name (CC0 styles, set with `avatars.style`). Never stock or invented photos.
- **Motion:** [anime.js v4](https://github.com/juliangarnier/anime) powers `Reveal` and `CountUp`, and is exported as `anime` for custom animation (`motion.enabled`, `motion.intensity`).
- **React Bits** for animated text and backgrounds, **Untitled UI React** for extra app components (`@ui-system/core/untitled-ui.css` maps its theme to yours), **Mobbin** for references before designing.

See [docs/libraries.md](docs/libraries.md).

## Commands

```bash
pnpm install          # once
pnpm build            # core + react (+ browser bundle)
pnpm dev              # playground on http://localhost:3000
pnpm design           # regenerate design/claude-design-system from the packages
node scripts/build-assets.mjs   # regenerate icon, mark and avatar SVGs for the design system
pnpm theme            # build ./ui.config.json into ./ui-theme
pnpm typecheck
```

## Keeping everything in sync

The packages are the source of truth. After changing a component or the engine:

1. `pnpm build && pnpm design`
2. Commit. CI builds everything and redeploys the playground.
3. Publish `design/claude-design-system/project` to the *UI System* design system in Claude Design (ask Claude: "sync the UI System design system from the repo"). Canvases pick up the new version when their design system is updated.

## License

MIT
