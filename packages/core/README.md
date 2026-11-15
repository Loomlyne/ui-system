# @loomlyne/ui-system-core

The engine of [UI System](https://github.com/Loomlyne/ui-system): one `ui.config.json` drives brand colors (OKLCH scales, contrast-checked roles), radius, type presets, logo and navigation. Exports CSS variables, Tailwind v4 tokens and Claude Design tokens, and ships the `ui-system` CLI.

```sh
npm i @loomlyne/ui-system-core
npx -p @loomlyne/ui-system-core ui-system init --preset ledger --kind app --name "Acme"
npx -p @loomlyne/ui-system-core ui-system check
```

```ts
import { buildTheme, resolveConfig, toCSS } from '@loomlyne/ui-system-core';
```

Also exported: `@loomlyne/ui-system-core/ui.css` (every component as plain `uis-*` classes), `/tailwind.css`, `/untitled-ui.css`, `/schema.json`.

ESM only. React components: [`@loomlyne/ui-system-react`](https://www.npmjs.com/package/@loomlyne/ui-system-react). Playground: https://loomlyne.github.io/ui-system/ · MIT
