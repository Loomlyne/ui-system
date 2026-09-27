# Using UI System in each stack

## Next.js (App Router)
```tsx
// app/layout.tsx
import '@ui-system/react/ui.css';
import { Root } from '@ui-system/react';
import config from '../ui.config.json';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Root config={config}>{children}</Root>
      </body>
    </html>
  );
}
```
`Root` is a client-safe component that renders a `div` with the theme variables. For zero-JS theming, import the generated `theme.css` instead and pass `vars={false}` to `Root`.

Dark mode toggle: render `<Root config={{ ...config, color: { ...config.color, mode } }}>`, or with `theme.css` set `data-uis-mode="dark"` on `<html>`.

## Tailwind v4
```css
@import "tailwindcss";
@import "./ui-theme/theme.css";
@import "./ui-theme/tailwind.css";
```
Utilities follow the live theme: `bg-surface text-ink border-line`, `bg-primary text-primary-ink`, `rounded-control`, `rounded-card`, `rounded-panel`, `font-display`, `shadow-float`, `h-control-md`, `dark:` variant tied to `data-uis-mode="dark"`.

## Plain HTML
```html
<link rel="stylesheet" href="/ui-theme/theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Loomlyne/ui-system@main/packages/core/styles/ui.css">
<body class="uis uis-page">
  <button class="uis-btn uis-btn--primary">Book a call</button>
</body>
```
Every component has a class API: `uis-btn` (+ `--primary|--outline|--ghost|--sm|--lg`), `uis-badge`, `uis-input`, `uis-card`, `uis-tabs`, `uis-bar`, `uis-island`, `uis-dock`, `uis-sidebar`, `uis-navitem`…

## Framer
- Quickest: paste `theme.css` + `ui.css` into *Site Settings › Custom Code › Head* (inside `<style>`), then use the classes in Embed components.
- Code components: import from `@ui-system/react` in a Framer code component and wrap it in `Root`.
- Framer variables: map `theme.json` values (`light` / `dark` objects) to Framer color styles.

## Shopify (Online Store 2.0)
- Upload `theme.css` and `ui.css` to `assets/`, include them in `layout/theme.liquid`:
  `{{ 'theme.css' | asset_url | stylesheet_tag }}` `{{ 'ui.css' | asset_url | stylesheet_tag }}`
- Build the header section with the `uis-stacked` markup (utility row, logo row, link row); it is the commerce nav.
- Keep the brand in `ui.config.json` in the theme repo and rebuild when it changes.

## Claude Design
See [claude-design.md](claude-design.md).
