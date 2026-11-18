# 2026-11-18: logo placement "left" / "right" is logical (start / end) — PROPOSED, NOT SIGNED

Status: proposal by the RTL work session. **Not signed.** The owner signs (or picks physical) after seeing `/Users/koss/Developer/ui-system-rtl-pictures-261118/compare/14-placement-right-*.png` and `after/19-nav-placements-*`.

## Question

ALMAR RTL defect 14: `data-placement="right"` is built with `flex-direction: row-reverse` (`uis-minimal`, `uis-sidebar__head`). In Arabic that puts the logo on the left. Is placement physical (always the named edge) or logical (left = start, right = end)?

## Options

1. **Logical (recommended).** `left` = start, `right` = end. No CSS change: `row-reverse`, the grid navs (island, bar, stacked, topbar) and `justify-content: flex-end` already follow the direction. The default `left` gives Arabic pages the logo on the right, which is what Arabic sites do. Drawer `side` follows the same rule (`end` default, `start`; `right`/`left` kept as old names). Table `align: 'right'` = end.
2. Physical. `right` always means the right edge. Needs a `[dir="rtl"]` twin for every nav plus React re-ordering per direction, and the default config would put the Arabic logo on the left unless every product sets `right` for Arabic.

## Chosen

Pending the owner's word.
