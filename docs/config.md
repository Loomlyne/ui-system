# ui.config.json reference

Every key is optional. Missing keys fall back to the neutral defaults in `packages/core/src/config.ts`. Add `"$schema": "./node_modules/@ui-system/core/schema.json"` (or the repo path `packages/core/schema.json`) for autocomplete.

## name
Project name. Used by exports.

## brand

| Key | Type | Default | Notes |
| --- | --- | --- | --- |
| `wordmark` | string | `"Brand"` | Logo text. |
| `caption` | string | `"Tagline"` | Small mono line under the wordmark. `""` hides it. |
| `initials` | string | first letter of wordmark | Used by the `monogram` and `ring` marks. |
| `mark` | `monogram` `ring` `spark` `stack` `orbit` `none` `custom` | `monogram` | Generated mark. `custom` uses `markSrc` or `markSvg`. |
| `logoSrc` | URL | | Full logo image. Replaces the generated lockup in every nav. |
| `markSrc` | URL | | Mark-only image for rails, docks, favicons and `variant: mark`. |
| `markSvg` | SVG string | | Inline SVG mark. Use `currentColor` so it follows the text color. |
| `variant` | `lockup` `stacked` `mark` `wordmark` | `lockup` | Default arrangement. |
| `placement` | `left` `center` `right` | `left` | Default logo position in every nav. |
| `wordmarkCase` | `normal` `upper` | `normal` | Upper adds wide tracking. |
| `wordmarkFont` | `display` `body` | `display` | |
| `markTone` | `current` `primary` | `current` | `current` follows the text color (works on photos and dark bars); `primary` fills with the brand color. |

## color

| Key | Default | Notes |
| --- | --- | --- |
| `primary` | `#1C1B19` | Primary fills, active states, links. Kept exactly in its scale. |
| `accent` | `#E0562B` | Highlights, badges, focus, charts. |
| `neutral` | `#77736B` | Tints every grey. `"auto"` borrows the primary's hue. |
| `success` `warning` `danger` `info` | green, amber, red, blue | Status roles. |
| `mode` | `light` | Default theme. Dark is always generated too. |

Generated per role: `{role}`, `{role}-hover`, `{role}-ink` (text on the fill), `{role}-soft` (tinted background), `{role}-soft-ink`, `{role}-text` (the role as text on the page). Neutral roles: `bg`, `surface`, `surface-2`, `surface-3`, `line`, `line-strong`, `ink`, `ink-2`, `ink-3`, `inverse`, `inverse-ink`, `on-image`, `scrim`, `image-scrim`, `float-bg`, `float-border`, `focus`. Scales: `primary-50…950`, `accent-50…950`, `neutral-0…975`, and the status scales. All as CSS variables prefixed `--uis-`.

## radius

| Key | Default | Notes |
| --- | --- | --- |
| `roundness` | `60` | 0–100. Scales every role. |
| `pill` | `false` | Full pills for `chip`, `control`, `field`, `shell`. |
| `overrides` | | Pin any role in px: `{ "card": 8 }`. |

See [radius.md](radius.md).

## type

| Key | Default | Notes |
| --- | --- | --- |
| `preset` | `modern` | `modern` Inter Tight/Inter, `geometric` Geist, `editorial` Fraunces/Inter, `grotesk` Space Grotesk/Inter, `humanist` Manrope, `classic` Instrument Serif/Instrument Sans. |
| `display` `body` `mono` | | Any Google Fonts family, overrides the preset. |
| `buttonCase` | `normal` | `upper` for spaced capitals on buttons. |

## density
`compact` (32/38/46 px controls), `comfortable` (36/44/52), `spacious` (40/48/56).

## surface

| Key | Default | Notes |
| --- | --- | --- |
| `float` | `solid` | `glass` frosts floating navs, docks and popovers. |
| `shadow` | `medium` | `none`, `soft`, `medium`, `deep`. |
| `border` | `hairline` | `none` removes card borders. |

## nav

| Key | Default | Values |
| --- | --- | --- |
| `front` | `island` | `island` `bar` `stacked` `dock` `minimal` |
| `back` | `sidebar` | `sidebar` `rail` `inset` `topbar` `dock` |

`<SiteNav>` and `<AppShell>` read these when no `variant` is passed.
