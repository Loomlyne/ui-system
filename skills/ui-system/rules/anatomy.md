# Anatomy figures inside UI System

Read when: a page, doc, landing section or onboarding needs to explain how something works (a flow, an engine, a process), or the owner asks for an isometric or explainer figure.

`anatomy` is a separate skill (github.com/wheresryan22/anatomy, MIT). It draws detailed isometric SVG figures of a real-looking object with calm motion. UI System uses it as its explainer style.

## Steps

1. Load the `anatomy` skill. If it is missing, ask the owner to install it: `npx skills add wheresryan22/anatomy`.
2. Pick the object that matches the idea, using the anatomy skill's own guidance.
3. Recolour with the theme. The four shading tones come from the theme scales (`UIS.buildTheme(config)`: primary or neutral steps, light to dark), never from anatomy's default palette. Text and readouts use `--uis-font-body` and `--uis-ink*`.
4. Frame it in UI System: the card is a `Card` (or `uis-card`) with radius `--uis-r-card`. Title and hint follow `better-writing` plus `rules/overrides.md`.
5. Motion follows `rules/motion.md`: anatomy's own eased loop is the page's one expressive moment, it stops under reduced motion or `motion.enabled: false`, and any entrance uses `Reveal`.
6. Readouts and labels show real or clearly labelled sample values only.
7. Check in light and dark themes and at 375 px width. Figure text keeps 4.5:1 contrast.

## Never

- Copy anatomy's files into this repo. Use the installed skill.
- Use its WebGL shaders on dashboards. They are for websites and docs only.
- Publish to the Anatomy community gallery without the owner's yes.
