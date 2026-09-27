# Radius: sharp to round

One value, `radius.roundness` (0–100), drives every corner in the system, so a project moves from razor-sharp to soft and round in one step. `radius.pill` turns controls into full pills independently, which gives combinations like sharp cards with pill buttons.

| Role | Variable | Used for | 0 | 50 | 100 | pill |
| --- | --- | --- | --- | --- | --- | --- |
| chip | `--uis-r-chip` | badges, tags | 0 | 5 | 10 | 999 |
| control | `--uis-r-control` | buttons, nav items, tabs | 0 | 7 | 14 | 999 |
| field | `--uis-r-field` | inputs, selects | 0 | 7 | 14 | 999 |
| card | `--uis-r-card` | cards, tables | 0 | 12 | 24 | |
| panel | `--uis-r-panel` | popovers, drawers, dialogs, inset panels | 0 | 16 | 32 | |
| media | `--uis-r-media` | images, video | 0 | 11 | 22 | |
| shell | `--uis-r-shell` | floating navs, docks, islands | 0 | 11 | 22 | 999 |
| avatar | `--uis-r-avatar` | avatars | square → circle from 70 or pill | | | |
| inner | `--uis-r-inner` | content nested in a panel | panel − 8 | | | |

## Presets

| Preset | roundness | pill |
| --- | --- | --- |
| `sharp` | 0 | no |
| `crisp` | 25 | no |
| `soft` | 50 | no |
| `rounded` | 75 | no |
| `round` | 90 | yes |

```ts
import { RADIUS_PRESETS } from '@ui-system/core';
const config = { radius: RADIUS_PRESETS.round };
```

## Rules
- Never hard-code a radius: use the role variable, or Tailwind `rounded-control`, `rounded-card`, `rounded-panel`…
- Nested surfaces use `--uis-r-inner` so corners stay concentric.
- Textareas cap at 20px so pill mode never produces a lozenge.
- The generated monogram mark follows roundness too, so the logo tile matches the UI.
- Need one exception? `radius.overrides: { "card": 4 }`.
