# AppShell

The backend layout: picks a navigation pattern by name and places your page in the main area.

`variant`: `sidebar` (full sidebar, default for dashboards), `rail` (icon rail, for tools that need width), `inset` (sidebar on a tinted frame, content in a floating panel), `topbar` (horizontal tabs, for apps with 3–6 sections), `dock` (floating command dock, for canvas-style editors).

**Props:** `variant`, `sections` [{label, items: [{label, icon, href, active, badge}]}], `user` {name, meta}, `workspace` {name, plan}, `search`, `actions`, `footerItems`, `tip`, `header`, `logoPlacement`, children. Give it a sized parent.
