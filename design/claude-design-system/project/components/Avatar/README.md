# Avatar

A person or account. With a `src` it shows the real photo; without one it draws a DiceBear avatar seeded by the name, so the same person always gets the same face. Never a stock or invented photo.

Styles (all CC0, no attribution): `notionists-neutral` (default), `lorelei-neutral`, `thumbs`, `glass`, `shapes`, or `initials` for themed letters. Set it once with Root `avatarStyle` (config `avatars.style`), or per avatar with `avatarStyle`.

Shape follows roundness: softened square at low roundness, circle from 70 or in pill mode.

**Props:** `name` (seed and label), `src`, `initials`, `avatarStyle`, `size` sm|md|lg|xl. `AvatarGroup` overlaps several. `UIS.avatarSvg(seed, style)` returns the SVG markup.
