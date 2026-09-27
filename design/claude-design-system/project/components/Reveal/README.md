# Reveal

Entrance animation powered by anime.js v4. Wrap a section or a list; with `stagger` each direct child animates in turn when it scrolls into view.

Effects: `fade-up` (default), `fade`, `scale-in`, `slide-left`, `slide-right`, `blur-in`. Timing follows Root `motionIntensity` (subtle 620ms, expressive 950ms). Nothing moves when `motion` is false or the visitor prefers reduced motion.

**Props:** `effect`, `stagger` (ms), `delay`, `duration`, `trigger` view|mount, `as`. Anything custom: `UIS.anime.animate(targets, params)`, `stagger`, `createTimeline`, `onScroll`.
