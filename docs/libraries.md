# Libraries and references

UI System stays the source of truth for tokens (color, radius, type). These are the only outside pieces a project adds, each wired to the theme.

| Need | Use | License |
| --- | --- | --- |
| Avatars for people without a photo | [DiceBear](https://github.com/dicebear/dicebear), built into `Avatar` | MIT code, CC0 styles |
| Animation | [anime.js v4](https://github.com/juliangarnier/anime), built into `Reveal`, `CountUp`, `anime` | MIT |
| Animated text, backgrounds, effects | [React Bits](https://github.com/DavidHDev/react-bits) | MIT + Commons Clause |
| Extra app components (date pickers, file upload, charts…) | [Untitled UI React](https://github.com/untitleduico/react) open-source set | MIT |
| Design references | Mobbin (connected in Claude) | Reference only |

## Avatars (DiceBear)
- `<Avatar name="Amira Haddad" />` draws a deterministic avatar: same name, same face, on every page and device.
- A real photo always wins: `<Avatar name="…" src="/team/amira.jpg" />`.
- Style for the whole project: `"avatars": { "style": "notionists-neutral" }` (`lorelei-neutral`, `thumbs`, `glass`, `shapes`, `initials`).
- Raw SVG for emails or exports: `avatarSvg('Amira Haddad', 'thumbs')`.
- Never use stock photos or AI faces for people who are not real.

## Motion (anime.js)
```tsx
<Reveal stagger={80}>{cards}</Reveal>          // children animate in when scrolled into view
<CountUp to={128} suffix="+" />                 // real numbers only
anime.animate('.hero h1', { opacity: [0, 1], translateY: [24, 0], ease: 'out(3)' });
```
`"motion": { "enabled": true, "intensity": "subtle" | "expressive" }`. Reduced-motion visitors see the final state.

## React Bits
1. Pick a component on reactbits.dev (SplitText, BlurText, CountUp, AnimatedContent, SpotlightCard, Magnet, Aurora…).
2. Install the TypeScript variant that matches the project: `npx shadcn@latest add @react-bits/<Name>-TS-TW` (Tailwind) or `-TS-CSS`.
3. Replace hard-coded colors with `var(--uis-primary)`, `var(--uis-accent)`, `var(--uis-ink)`; radii with `var(--uis-r-card)` etc.
4. One effect per section. Backgrounds behind text must keep 4.5:1 contrast.

## Untitled UI React
1. Follow its installation guide (Tailwind v4 + React Aria), add components with its CLI.
2. After its `theme.css`, import `@ui-system/core/untitled-ui.css`: brand scale → `primary`, greys → `neutral`, fonts → the preset.
3. Use UI System components first; reach for Untitled UI for what this library does not have.

## Mobbin
Before designing a new screen, flow or website section, search Mobbin (screens, flows, sections) for 5–10 real examples, pick one pattern, and cite the Mobbin links in the design notes. Adapt the pattern with UI System components; never copy a product's branding.
