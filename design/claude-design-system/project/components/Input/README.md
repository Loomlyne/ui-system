# Input

A text field with optional label, hint, error, leading icon and keyboard hint. `type="password"` adds a show/hide eye button on the physical right (also in RTL), 40px hit area, `aria-pressed`.

Every labelled field keeps one line under it for the hint or error (`--uis-hint-reserve`, `sizes.hint`), so fields in a row or column line up whether or not they show a hint. Unlabelled fields reserve nothing, and `sizes.hint: 0` removes the slot. **Write hints and errors as one line:** a longer message wraps and pushes what is below it.

Corners follow `--uis-r-field`. Focus draws a `--uis-focus-field` border and a `--uis-focus-ring-width` ring. `variant="search"` reads `--uis-r-search`, `--uis-search-bg`, `--uis-search-border` and `--uis-search-border-hover` (a grey pill in atelier). **Props:** `label`, `hint`, `error`, `icon`, `kbd`, `size` sm|md, `variant` default|search, plus any native input attribute.

Always give a visible `label` in forms; a placeholder is not a label.
