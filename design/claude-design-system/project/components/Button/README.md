# Button

The button: `primary` for the one main action on a screen, `secondary`/`outline`/`ghost` for the rest.

Height follows density (`--uis-h-sm|md|lg`), corners follow `--uis-r-control` (full pill when Root `pill` is on), letter case follows `buttonCase`.

**Props:** `variant` primary|accent|secondary|outline|ghost|soft|danger|light|glass, `size` sm|md|lg, `icon`, `iconRight`, `iconOnly` (+ `label`), `block`, `href` (renders a link), `disabled`.

Use `light` and `glass` only on photography. One `primary` per view. Labels are verbs in sentence case ("Book a table", not "Submit").
