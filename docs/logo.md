# Logo

`<Logo />` renders the brand set on `<Root>`. Everything below can also be passed as props for a one-off.

## Arrangements (`brand.variant`)
- `lockup`: mark + wordmark (+ caption). Default in navs.
- `stacked`: mark above wordmark. Splash screens, covers, footers. Never inside a nav bar.
- `mark`: mark only. Rails, docks, favicons, tight mobile bars.
- `wordmark`: text only.

## Generated marks (`brand.mark`)
Placeholders that feel finished until the client's logo exists:
`monogram` (initials in a tile whose corners follow roundness), `ring`, `spark`, `stack`, `orbit`, `none`.

`markTone: "current"` draws the mark in the text color and knocks the letter out, so it works on photos, dark bars and primary fills. `markTone: "primary"` fills it with the brand color.

## The client's real logo
```json
{ "brand": { "logoSrc": "/brand/logo.svg", "markSrc": "/brand/mark.svg" } }
```
- `logoSrc` replaces the lockup, stacked and wordmark arrangements.
- `markSrc` replaces the mark everywhere (rails, docks, `variant: mark`) unless a specific generated mark is requested.
- Or inline SVG: `markSvg: "<svg viewBox='0 0 32 32'>…fill='currentColor'…</svg>"`.
- In Claude Design: upload the image to the canvas, copy its link, paste it into the board's Tweaks `logoSrc` / `markSrc`.

Never redraw a real company's mark. Use the files the client provides.

## Placement
`brand.placement` (`left`, `center`, `right`) is the default for every nav. Each nav also takes `logoPlacement`:

| Nav | left | center | right |
| --- | --- | --- | --- |
| Island | logo · links · actions | links · logo · actions | actions · links · logo |
| Bar | logo · links · actions | links · logo · actions | links · actions · logo |
| Stacked | logo row left | large centered logo | logo row right |
| Dock | header logo left | header logo centered | header logo right (`dock` puts the mark inside the dock) |
| Minimal | logo left, menu right | menu · logo · CTA | logo right |
| Sidebar | logo left + collapse button | centered logo | logo right |
| Topbar | logo · tabs · search | tabs · logo · search | tabs · search · logo |

## Clear space and sizes
- Clear space on every side: the mark's height.
- Minimum: mark 20px, lockup 96px wide.
- Sizes: `sm` (nav bars, sidebars), `md` (default), `lg` (footers, heroes), `xl` (splash).
