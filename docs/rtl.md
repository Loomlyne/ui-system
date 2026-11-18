# Right-to-left (Arabic)

Set `dir="rtl"` on `<html>` (or on any wrapper) and every UI System component mirrors. There is no separate RTL stylesheet and nothing to configure.

## How it works

- **Logical sides.** `ui.css` places things with `inset-inline-start/end`, `margin-inline-*`, `padding-inline-*`, `border-inline-*` and `text-align: start`, never with `left`/`right`. In left-to-right every value is the same pixel as before; in right-to-left the start side is the right.
- **`--uis-dir`.** `[dir="ltr"]` sets it to `1`, `[dir="rtl"]` to `-1`; the nearest `dir` attribute wins, so an English block inside an Arabic page stays English. It drives the few movements CSS has no logical form for: the switch knob, the drawer slide-in (`uis-slide`) and the menu arrow.
- **Direction icons mirror, neutral icons do not.** A chevron or arrow that points along the reading direction is marked: `<Icon name="chevron-right" directional />` in React, `data-dir` on the `svg` in plain HTML. `[dir="rtl"] .uis-icon[data-dir]` flips it. Moon, sun, close, search, eye and up/down chevrons are never marked. The icon name alone never decides. Marked today: breadcrumbs (`PageHeader`), mobile sheet rows (`NavMobile`), the full-screen menu arrow (`NavMinimal`).

## Placement is logical

`brand.placement` / `logoPlacement` and `Drawer side` are logical:

| Value | Left-to-right | Right-to-left |
| --- | --- | --- |
| `left` (default) | logo on the left | logo on the right |
| `center` | centre | centre |
| `right` | logo on the right | logo on the left |
| Drawer `end` (default, was `right`) | opens from the right | opens from the left |
| Drawer `start` (was `left`) | opens from the left | opens from the right |

So the default config gives the layout Arabic readers expect (logo at the right, tools at the left) with no change. Table columns follow the same rule: `align: 'right'` means the end side.

## Physical on purpose

- **The password eye** (`uis-reveal`, `uis-control--reveal`) stays on the physical right in both directions (owner rule). The whole password control stays physical so nothing lands on the eye: a leading icon stays left, a kbd hint sits left of the eye, and in Arabic the label and text start after the eye.

## The check

`pnpm test` runs `packages/core/test/rtl.test.mjs`: any physical-side declaration in `ui.css` (`left`, `right`, `margin-left`, `padding-right`, `border-left`, `text-align: left`, an uneven four-value shorthand, `translateX`, an x movement in a keyframe) without a logical form, a `[dir="rtl"]` twin or `var(--uis-dir)` fails, unless it is on the allow-list in `packages/core/test/rtl-audit.mjs` with its reason. Direction icons in the React package must carry `directional`; neutral ones must not. Run the audit table with `node packages/core/test/rtl-audit.mjs`.

## Limits

- Set `dir` to exactly `ltr` or `rtl`. `dir="auto"` does not set `--uis-dir`, so the switch knob and the drawer slide would move the LTR way.
- An English block inside an Arabic page (`dir="ltr"` inside `dir="rtl"`) is right everywhere except the password field label offset, which follows the outer `rtl`.
- `Reveal` effects `slide-left` / `slide-right` are physical by name and do not mirror. `Button iconRight="arrow-right"` cannot be marked directional yet. `untitled-ui.css` (third-party) is not covered by the check.
- 0.3.3 changes nothing in left-to-right. In right-to-left, `Drawer side="right"` / `"left"` and logo placement now follow the reading direction (end / start): an Arabic page that set `side="left"` to get a right-hand drawer should drop it.
