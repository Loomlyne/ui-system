# Icon

Every icon comes from **Hugeicons** (https://hugeicons.com), free stroke-rounded set, MIT (`@hugeicons/core-free-icons`). 24px grid, 1.5 stroke, round caps and joins; icons inherit `currentColor`. Never draw a custom icon or mix in another set: pick the closest Hugeicons glyph and add it to `SOURCE` in `packages/react/src/Icon.tsx` under a short name.

Use by name: `<Icon name="search" />`. Names: menu, x, search, bell, home, grid, chart, activity, trend, users, user, settings, target, sliders, bag, cart, calendar, inbox, file, folder, plus, check, chevron-down, chevron-up, chevron-right, chevron-left, chevrons-updown, arrow-right, arrow-up-right, clock, pin, phone, mail, message, logout, command, sun, moon, sparkle, layers, box, card, help, filter, more, star, heart, globe, lock, download, upload, copy, edit, trash, eye, link, bolt, tag, truck, image, play, sidebar, currency, briefcase, building, receipt, wallet, map, car, shield, share, refresh, ruler, bookmark, camera, store, list, route, check-circle, alert-circle, info, warning, x-circle, health.

Sizes: 16 in dense tables and badges, 18 in buttons and nav items, 20–24 standalone. Stroke stays 1.5; pass `strokeWidth` only for a deliberate heavy style.

**Do** pair icon-only buttons with a `label` and status icons with a word. **Don't** mix in emoji, filled glyphs from another library, or hand-drawn paths.
