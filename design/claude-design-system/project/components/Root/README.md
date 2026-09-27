# Root

The theme provider: wrap every page or artboard in it and pass the project's brand as props.

Every other component reads its CSS variables and brand context. Root computes the whole theme (color scales, contrast-safe text colors, radius roles, fonts, shadows) from a handful of inputs, so one change restyles everything.

**Props (all optional, defaults in brackets)**
- Color: `primary` [#1C1B19], `accent` [#E0562B], `neutral` [#77736B, or 'auto'], `mode` light|dark [light]
- Shape: `roundness` 0–100 [60], `pill` boolean [false]
- Type: `fontPreset` modern|geometric|editorial|grotesk|humanist|classic [modern], `displayFont`, `bodyFont` (any Google Fonts family), `buttonCase` normal|upper
- Feel: `density` compact|comfortable|spacious, `surface` solid|glass (floating navs and popovers), `shadow` none|soft|medium|deep, `border` hairline|none
- Brand: `wordmark`, `caption`, `initials`, `logoMark` monogram|ring|spark|stack|orbit|none|custom, `logoVariant` lockup|stacked|mark|wordmark, `logoPlacement` left|center|right, `logoSrc`, `markSrc`, `markSvg`, `wordmarkCase`, `markTone` current|primary
- Nav defaults: `frontNav` dock|island|bar|stacked|minimal, `backNav` sidebar|rail|inset|topbar|dock
- Rendering: `config` (a whole ui.config object), `page` [true] paints bg and ink, `fill` stretches to parent height, `vars` [true] writes variables (false = inherit them from tokens.css), `loadFonts` [true]

**Do** set brand props once on Root, never per component. **Don't** hard-code hex values in markup: use `var(--uis-primary)`, `var(--uis-ink)` and the other `--uis-*` variables.
