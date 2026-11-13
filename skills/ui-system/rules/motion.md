# Motion: the split rule

Read when: adding or changing any animation, transition, hover, press or loading effect.

Decided 2026-11-13: Jev judged four questions and code picked option A, the split. The owner approved it.

## Who does what

| Size | Done by | Examples |
|---|---|---|
| Small and instant | CSS in `ui.css` (`uis-*` classes) | Hover, press, focus, switch thumb, checkbox, tooltip fade |
| Big and showy | anime.js v4 through `Reveal`, `CountUp`, `anime` | Sections entering, lists staggering, toasts, numbers counting up, scroll moments |

Why: CSS works the moment the page shows, even before any script loads on a slow phone. anime.js is for the moments worth waiting for.

## Rules

1. Both sides read the same timing from `config.motion.timing` → `--uis-dur-fast` (160 ms), `--uis-dur` (280 ms), `--uis-dur-slow` (500 ms), `--uis-ease-out`, `--uis-ease-in-out`, `--uis-press`. When set, `Reveal` uses `timing.slow`, `CountUp` uses twice `timing.slow`, and both turn `timing.easeOut` (a CSS `cubic-bezier`) into the same anime.js curve.
2. Never write a raw duration or curve in a component. A new value goes into `config.motion.timing` or a new `--uis-*` variable in `theme.ts`.
3. Never run a hover or press through JavaScript. Never add GSAP or Framer Motion.
4. Off switches: `prefers-reduced-motion` and `motion.enabled: false` both stop CSS motion (`data-uis-motion="off"` on `Root`) and anime.js motion (`useMotionEnabled`). Content must still show, with no motion, when motion is off.
5. Dashboards stay `intensity: 'subtle'`. A site gets at most one expressive moment per page.
6. `CountUp` shows real figures only.

## Check

- [ ] No `transition` or `animation` value outside `ui.css` and `Motion.tsx`
- [ ] No JavaScript hover or press handlers that animate
- [ ] Page reads fine with reduced motion on and with `motion.enabled: false`
- [ ] Buttons react before scripts load (throttle the network in devtools)
