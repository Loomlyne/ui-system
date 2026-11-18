# 2026-11-18: logo placement "left" / "right" is logical (start / end) — SIGNED

Status: **signed by the owner, 2026-11-18**, in the question form after seeing the Arabic before/after pictures (`/Users/koss/Developer/ui-system-rtl-pictures-261118/compare/14-placement-right-*.png`, `after/19-nav-placements-*`). His answer, relayed by the ALMAR controller: "Logical".

## Question

ALMAR RTL defect 14: `data-placement="right"` is built with `flex-direction: row-reverse` (`uis-minimal`, `uis-sidebar__head`). In Arabic that puts the logo on the left. Is placement physical (always the named edge) or logical (left = start, right = end)?

## Options

1. **Logical (recommended).** `left` = start, `right` = end. No CSS change: `row-reverse`, the grid navs (island, bar, stacked, topbar) and `justify-content: flex-end` already follow the direction. The default `left` gives Arabic pages the logo on the right, which is what Arabic sites do. Drawer `side` follows the same rule (`end` default, `start`; `right`/`left` kept as old names). Table `align: 'right'` = end.
2. Physical. `right` always means the right edge. Needs a `[dir="rtl"]` twin for every nav plus React re-ordering per direction, and the default config would put the Arabic logo on the left unless every product sets `right` for Arabic.

## Chosen

Option 1, logical (owner, 2026-11-18: "Logical"). Same answer on the pictures: "Yes, release" → 0.3.3.
