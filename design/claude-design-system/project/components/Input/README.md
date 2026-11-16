# Input

A text field with optional label, hint, error, leading icon and keyboard hint.

**Floating label (default in every theme):** the `label` sits inside the field as its hint; when the field is focused or filled it rises onto the top border on the start side (left, right in Arabic), shrinks to 12px and cuts the border. A `placeholder` then shows only while focused. Select's label always sits on the border; Textarea's rests on its first line. `labelPlacement="above"` on a field, `fieldLabel="above"` on Root or `"fields": { "label": "above" }` in ui.config.json brings back the label line over the field. Plain CSS: `<div class="uis-control uis-control--float"><input class="uis-input" placeholder=" " id="e"><label class="uis-flabel" for="e">Email</label></div>`. `type="password"` adds a show/hide eye button on the physical right (also in RTL), 40px hit area, `aria-pressed`.

Every labelled field keeps one line under it for the hint or error (`--uis-hint-reserve`, `sizes.hint`), so fields in a row or column line up whether or not they show a hint. Unlabelled fields reserve nothing, and `sizes.hint: 0` removes the slot. **Write hints and errors as one line:** a longer message wraps and pushes what is below it.

Corners follow `--uis-r-field`. Focus draws a `--uis-focus-field` border and a `--uis-focus-ring-width` ring. `variant="search"` reads `--uis-r-search`, `--uis-search-bg`, `--uis-search-border` and `--uis-search-border-hover` (a grey pill in atelier). **Props:** `label`, `hint`, `error`, `icon`, `kbd`, `size` sm|md, `variant` default|search, plus any native input attribute.

Always give a visible `label` in forms; a placeholder is not a label. **Props:** also `labelPlacement` float|above.
