# UI System in Claude Design

Two artifacts live in Claude Design:

1. **UI System (design system).** Tokens, the brand book README, all 36 components with guidelines and live previews, and the component bundle (`window.UIS`). Any Design canvas can install it from the Theme menu. Its content is generated from this repo: `design/claude-design-system/project`.
2. **UI System (canvas).** The dedicated project with 20 boards: Overview, Color, Radius, Type, Logo, Components, six frontend navs, six backend navs and two full examples. Every board has the same Tweaks panel.

## Designing a new project
1. Create a Design canvas and choose *UI System* as its design system.
2. Wrap each artboard in `UIS.Root` and pass the brand:
   ```html
   <x-import component-from-global-scope="UIS.Root"
     primary="#2F5D50" accent="#C4952E" neutral="#8A7F6A" mode="light"
     roundness="{{90}}" pill="{{true}}" font-preset="editorial" button-case="upper"
     surface="glass" wordmark="Client" logo-mark="ring" logo-placement="center"
     logo-src="/_blob/…" style="display: block;">
     …artboard
   </x-import>
   ```
3. Mount the real components (`UIS.NavIsland`, `UIS.AppShell`, `UIS.Button`…) and style your own markup with `var(--uis-*)`.
4. Load fonts once per artboard with the Google Fonts link from the design system README.

Declaring the brand values as `data-props` tweaks (as the UI System canvas does) makes them editable from the Tweaks panel.

## Updating after a code change
1. `pnpm build && pnpm design`
2. Ask Claude to publish `design/claude-design-system/project` to the UI System design system (changed files only, index last).
3. In each canvas, update the installed design system to the new version so boards load the new bundle.
