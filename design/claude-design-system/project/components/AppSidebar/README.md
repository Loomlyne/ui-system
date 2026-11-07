# AppSidebar

The full backend sidebar: logo, search, grouped links with icons and counts, and one account block at the bottom. When a `workspace` is given with a `user`, they merge into that block (name, workspace · plan, switcher), so nothing is shown twice.

The panel is `--uis-nav-bg`; the current page is `--uis-nav-active-bg` with `--uis-nav-active-ink` and a 2px start bar in `--uis-nav-active-bar` (transparent by default; off-white panel, white item, ink bar in retail-editorial).

**Props:** `sections`, `workspace`, `search` (true or placeholder), `user`, `logoPlacement` left|center|right, `logoVariant`, `footer`.
