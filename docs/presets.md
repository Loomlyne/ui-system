# Presets

A preset is a whole design language: colors, shape, type, control sizes, spacing, shadows and motion. A project opts in; the defaults never change.

```json
{ "preset": "retail-editorial", "brand": { "wordmark": "Client" } }
```

Order: defaults, then the preset, then every key you write. Anything you set wins over the preset. In React and Claude Design: `<Root preset="retail-editorial">`. In the playground: **Start from › Retail editorial (Senorita)**.

Presets live in `packages/core/src/presets.ts` (`PRESETS`). They use only normal config keys, so a preset is also a readable example of the pin options:

| Key | What it pins |
| --- | --- |
| `color.pin` | Exact light-mode values on generated roles (`line`, `ink-2`, `primary-hover`, `focus-field`, `search-bg`, `nav-bg`…). |
| `color.pinDark` | Exact dark-mode values on the same roles. Unpinned dark roles are derived from the scales. |
| `radius.overrides` | Any radius role in px, including `search` and `avatar`. 999 = full pill or circle. |
| `type.preset` | The font pairing; a pairing can carry heading, button and wordmark metrics. |
| `sizes` | Control heights `sm`/`md`/`lg`, card `pad` and `gap`, field focus `ring` width, in px. |
| `space` | Spacing scale for token exports. |
| `surface.shadows` | Exact light-mode `sm`/`md`/`lg`/`float` shadows. Dark mode follows `surface.shadow`. |
| `motion.timing` | `fast`/`base`/`slow` in ms, `easeOut`, `easeInOut`, `press`. |

Every preset passes the contrast gate in `pnpm design`: `contrastReport()` checks each text pair (`ink*` on `bg`/`surface`/`surface-2`, `*-ink` on fills, `*-soft-ink` on `*-soft`, `*-text` on `bg`) at 4.5:1 in light and dark, and the build fails below that.

## retail-editorial

Label "Retail editorial (Senorita)". Source: Senorita Store Phase 1 storefront and admin CSS (`_s_css.html`, `_s_err.html`, `_a_css.html`) and `01-UI-SPEC.md`, 2026-11-07. Light values come from the source; none was invented. Two choices were designed where the source has none (info tone, dark mode) and signed off on 2026-11-07.

### Color (light)

| Role | Value | Source use |
| --- | --- | --- |
| `primary`, `ink`, `inverse`, `focus` | `#2D2A26` | All text, dark buttons, selected states, focus outline |
| `bg`, `surface` | `#FFFFFF` | Page, cards, drawers |
| `ink-2`, `ink-3` | `#6F6C69` | Secondary text, captions (5.22:1 on white) |
| `surface-2` | `#FAF8F5` | Off-white panels, admin side nav |
| `surface-3`, `search-bg` | `#F4F4F4` | Photo wells, search pill |
| `line` | `#E5E2DE` | Hairlines, decorative only |
| `line-strong` | `#8F8B86` | Input, size box, radio and checkbox edges (3.38:1) |
| `accent`, `accent-text`, `primary-hover`, `focus-field`, `focus-ring` | `#8C6250` | Tan tags, button hover, focused field edge |
| `accent-soft` / `-ink` | `#B49A87` / `#2D2A26` | Sand sale banner, ink text (white fails at 2.65:1) |
| `danger`, `danger-text` | `#CD2D2D` | Sale price, errors |
| `danger-hover`, `danger-soft`, `danger-soft-ink` | `#A82424`, `#FCEDED`, `#B42626` | Delete hover, error pills |
| `success` | `#1F7A4D` | WhatsApp, success |
| `success-hover`, `success-soft`, `success-soft-ink` | `#18633E`, `#E7F2EB`, `#1A6B43` | WhatsApp hover, ok pills |
| `warning` | `#8C6250` | Notices use tan in the source |
| `warning-soft`, `warning-soft-ink` | `#F6ECE5`, `#7A5444` | Warn pills |
| `scrim` | `#2D2A2699` | Drawer overlay, ink at 60% |
| `brand.wordmarkColor` | `#7E1F33` | Burgundy, wordmark only. Follows the text on photos and inverse panels. |
| `info`, `info-soft-ink` / `info-soft` | `#2D2A26` / `#F4F4F4` | The source has no info color: info is ink on grey, apart from tan warning (signed off 2026-11-07). |
| `search-border-hover` | `#8F8B86` | Search pill edge on hover |
| `nav-bg` | `#FAF8F5` | Admin side nav |
| `nav-active-bg`, `nav-active-ink`, `nav-active-bar` | `#FFFFFF`, `#2D2A26`, `#2D2A26` | Current page: white item, ink text, 2px ink start bar |

### Color (dark, designed)

The source has no dark mode. These values were designed for the preset and signed off on 2026-11-07 (canvas "UI System · Retail preset options", option A). Every text pair passes 4.5:1; field edges 3.64:1 (the resting search pill excepted, see Known gaps).

| Role | Value |
| --- | --- |
| `bg`, `surface`, `surface-2`, `surface-3` | `#141210`, `#1B1916`, `#221F1C`, `#2A2724` |
| `line`, `line-strong` | `#35312D`, `#77716A` |
| `ink`, `ink-2`, `ink-3` | `#F3EFEA`, `#C2BBB3`, `#A39C94` |
| `primary` / `-ink` / `-hover`, `inverse`, `focus` | `#F3EFEA` / `#1B1916` / `#C59A83` |
| `accent` / `-ink`, `accent-text`, `focus-field`, `focus-ring` | `#B4876F` / `#1B1916`, `#C59A83` |
| `accent-soft` / `-ink` | `#B49A87` / `#2D2A26` (sand stays sand) |
| `warning-soft` / `-ink` | `#2B211C` / `#E6C9B9` |
| `danger-text` | `#F07068` |
| `info-soft` / `-ink`, `search-bg` | `#2A2724` / `#F3EFEA` |
| `nav-bg`, `nav-active-bg`, `nav-active-ink`, `nav-active-bar` | `#1B1916`, `#36322E` (one step above the `#2A2724` hover), `#F3EFEA`, `#F3EFEA` |
| `wordmark` | `#D27A89` (burgundy lifted to 6.13:1) |

### Shape

2px: `chip`, `control`, `field`, `panel`, `shell`. 0: `card`, `media` (square tiles and photos). 999: `search` (grey pill), `avatar` (circle).

### Type

Font preset `retail`: Archivo (wdth 75–125, wght 700–900) for display, h1–h3, buttons and wordmark; Inter 400/700 body.

- Display and headings: weight 900, uppercase, tracking 0.025em, width 92%.
- Buttons: Archivo 900, 16px, uppercase, tracking 0.025em, width 88%.
- Wordmark: 900, uppercase, tracking 0.06em, width 110%.

### Sizes, spacing, borders

- Controls: `sm` 44 (icon buttons, tabs, size boxes, search), `md` 52 (buttons, inputs), `lg` 56. Card padding 16, gap 16.
- Spacing scale: 2 4 8 12 16 20 24 32 40 56 72. `space-1` (2px) is the gap between product tiles.
- Borders 1px everywhere, checkbox edge included (`sizes.check: 1`). Field focus: tan edge plus a 1px tan ring. Keyboard focus: 2px ink outline, 2px offset.

### Shadows and motion

- Cards have none (`sm: none`). Menus `0 8px 24px rgba(0, 0, 0, 0.08)`, toasts and drawers `0 8px 24px rgba(0, 0, 0, 0.18)`, floating buttons `0 6px 18px rgba(0, 0, 0, 0.2)`.
- 150ms state changes, 200ms hovers and menus, 300ms drawers and slides. Ease-out `cubic-bezier(0, 0, 0.2, 1)`, ease-in-out `cubic-bezier(0.42, 0, 0.58, 1)`. Buttons scale to 0.96 on press. Reduced motion turns all of it off.

### Navigation and people

Website nav `bar`, app nav `sidebar`, wordmark-only logo, `initials` avatars.

### Known gaps

- The resting search pill has no edge (`search-border: transparent`, as in the source): fill to page is 1.10:1 light, 1.26:1 dark, under WCAG 1.4.11. Placeholder, icon and shape identify it; hover shows the 3:1 edge.
- The source's product grid, mega menu, size boxes and drawers are layouts, not engine components. Build them from these tokens.
