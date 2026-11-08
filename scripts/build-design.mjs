// Builds the Claude Design System export from the packages:
//   design/claude-design-system/project/…  (tokens.json, README, bundle, previews, cover, index)
// Run after `pnpm build`:  node scripts/build-design.mjs
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG, PRELUDE } from './design-catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const core = await import(join(root, 'packages/core/dist/index.js'));
const ICON_COUNT = Object.keys((await import(join(root, 'packages/react/dist/index.js'))).ICONS).length;
const out = join(root, 'design/claude-design-system/project');
const TITLE = 'UI System · Design System';
const NS = 'UIS';

// Keep the index's identity across rebuilds: Claude Design expects createdOnFiles to stay put.
const indexPath = join(out, 'design-system.json');
const previous = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : null;
if (existsSync(join(root, 'design/claude-design-system'))) rmSync(join(root, 'design/claude-design-system'), { recursive: true });
const write = (rel, text) => {
  const p = join(out, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, text);
};

// ---------- tokens.json ----------
const theme = core.buildTheme(core.DEFAULT_CONFIG);
const tokens = core.toDesignTokens(theme);
tokens.name = TITLE;
tokens.meta = { source: 'ui-system', repo: 'https://github.com/Loomlyne/ui-system', config: core.DEFAULT_CONFIG };
write('tokens.json', JSON.stringify(tokens, null, 2) + '\n');
const colorNames = new Set(tokens.color.tokens.map((t) => t.name));

// ---------- bundle.css: bridge from tokens.css names to --uis-* + component styles ----------
const light = theme.vars('light');
const bridge = [];
for (const key of Object.keys(light)) {
  const k = key.replace(/^--uis-/, '');
  let v;
  if (colorNames.has(k)) v = `var(--${k})`;
  else if (k.startsWith('r-') && ['chip', 'control', 'field', 'search', 'card', 'panel', 'media', 'shell', 'inner'].includes(k.slice(2))) v = `var(--radius-${k.slice(2)})`;
  else if (k === 'font-display' || k === 'font-body' || k === 'font-mono') v = `var(--${k})`;
  else if (k === 'h-sm' || k === 'h-md' || k === 'h-lg') v = `var(--control-${k.slice(2)})`;
  else if (k.startsWith('shadow-')) v = `var(--${k})`;
  else if (k === 'focus-ring') v = 'color-mix(in srgb, var(--focus) 35%, transparent)';
  else if (k === 'image-scrim') v = 'linear-gradient(180deg, color-mix(in srgb, var(--neutral-975) 55%, transparent) 0%, color-mix(in srgb, var(--neutral-975) 35%, transparent) 45%, color-mix(in srgb, var(--neutral-975) 75%, transparent) 100%)';
  else v = light[key];
  bridge.push(`  ${key}: ${v};`);
}
const uiCss = readFileSync(join(root, 'packages/core/styles/ui.css'), 'utf8');
write('components/bundle.css', `/* UI System. The bridge maps this system's tokens.css onto the --uis-* variables the components read.
   <UIS.Root> overrides them per project (brand colors, roundness, fonts). */
:root, [data-theme] {
${bridge.join('\n')}
}
[data-theme="dark"] { color-scheme: dark; }

${uiCss}`);

// ---------- bundle.js ----------
let js = readFileSync(join(root, 'packages/react/dist/uis.bundle.js'), 'utf8').replace(/^\/\*[^\n]*\*\/\n?/, '');
const header = { format: 4, namespace: NS, components: CATALOG.map((c) => ({ name: c.name })) };
js = `/* @ds-bundle: ${JSON.stringify(header)} */\n${js}`;
if (/<\/script|<!--/i.test(js)) throw new Error('bundle.js contains </script or <!--');
write('components/bundle.js', js);

// ---------- libraries (React 18 UMD, carried so previews never depend on a CDN) ----------
const pnpmDir = join(root, 'node_modules/.pnpm');
const find = (prefix) => readdirSync(pnpmDir).find((d) => d.startsWith(prefix));
copyFileSync(join(pnpmDir, find('react@18'), 'node_modules/react/umd/react.production.min.js'), (mkdirSync(join(out, 'components/lib'), { recursive: true }), join(out, 'components/lib/react.production.min.js')));
copyFileSync(join(pnpmDir, find('react-dom@18'), 'node_modules/react-dom/umd/react-dom.production.min.js'), join(out, 'components/lib/react-dom.production.min.js'));

// ---------- index.d.ts (types as documentation) ----------
const dts = [];
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const reactDist = join(root, 'packages/react/dist');
for (const f of walk(reactDist).filter((f) => f.endsWith('.d.ts') && !f.endsWith('bundle.d.ts') && !f.endsWith('index.d.ts'))) {
  dts.push(`// ${f.slice(reactDist.length + 1)}\n` + readFileSync(f, 'utf8').replace(/^import[^\n]*\n/gm, '').replace(/^export \{[^}]*\} from[^\n]*\n/gm, ''));
}
write('components/index.d.ts', `// UI System components (window.${NS}). Types are documentation.
type Mode = 'light' | 'dark';
type Placement = 'left' | 'center' | 'right';
type LogoVariant = 'lockup' | 'stacked' | 'mark' | 'wordmark';
type LogoMark = 'monogram' | 'ring' | 'spark' | 'stack' | 'orbit' | 'none' | 'custom';
type FontPresetId = 'modern' | 'geometric' | 'editorial' | 'grotesk' | 'humanist' | 'classic' | 'retail';
type PresetId = 'atelier' | 'ledger';
type KindId = 'shop' | 'app' | 'website' | 'booking' | 'portfolio';
type Density = 'compact' | 'comfortable' | 'spacious';
type FloatSurface = 'solid' | 'glass';
type ShadowDepth = 'none' | 'soft' | 'medium' | 'deep';
type FrontNav = 'dock' | 'island' | 'bar' | 'stacked' | 'minimal';
type BackNav = 'sidebar' | 'rail' | 'inset' | 'topbar' | 'dock';
type UIConfigInput = Record<string, unknown>;
type BrandConfig = Record<string, unknown>;
type Theme = Record<string, unknown>;

${dts.join('\n')}`);

// ---------- components: README + preview ----------
const esc = (s) => s.replace(/"/g, '&quot;');
for (const c of CATALOG) {
  write(`components/${c.name}/README.md`, `# ${c.name}\n\n${c.readme}\n`);
  const body = c.rootless ? c.preview : `h(U.Root, { vars: false, page: false }, ${c.preview})`;
  write(`components/${c.name}/preview.html`, `<!-- @dsCard group="${esc(c.group)}" height=${c.height} -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${c.name}: preview</title>
<link rel="stylesheet" href="${core.allPresetFontsUrl()}">
<style>body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-body); }</style>
</head>
<body>
<div id="root"></div>
<script>
${PRELUDE}
ReactDOM.createRoot(document.getElementById('root')).render(${body});
</script>
</body>
</html>
`);
}

// ---------- Cover ----------
write('components/Cover/preview.html', `<!-- @dsCard height=340 -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>UI System: cover</title>
<link rel="stylesheet" href="${core.googleFontsUrl(['Inter Tight', 'Inter'])}">
<style>
  html, body { margin: 0; }
  body { width: 960px; height: 340px; position: relative; overflow: hidden; background: var(--bg); font-family: var(--font-body); }
  svg { position: absolute; left: 480px; top: 0; width: 480px; height: 340px; }
  .ink { fill: var(--primary); }
  .signal { fill: var(--accent); }
  .tint { fill: var(--primary-soft); }
  .ground2 { fill: var(--surface-3); }
  .cut { fill: var(--bg); }
  .r0 { rx: 0; } .r1 { rx: var(--radius-chip); } .r2 { rx: var(--radius-control); } .r3 { rx: var(--radius-media); }
  .r4 { rx: var(--radius-card); } .r5 { rx: var(--radius-panel); } .disc { rx: 20px; }
  .text { position: absolute; left: 48px; bottom: 44px; width: 420px; }
  h1 { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: 120px; line-height: 0.93; letter-spacing: -0.035em; color: var(--ink); }
  p { margin: 18px 0 0; font-size: 14px; line-height: 1.4; color: var(--ink-3); }
</style>
</head>
<body>
<!--
  blocks: primary slab 216x356 bleeding off top and bottom, accent block 96x96 bleeding off the top-right, primary-soft 120x152, surface-3 strip 480x72
  arrangement: one tall slab with satellites, all right of x = 480
  pattern: the roundness dial, because the README opens with "one value moves the interface from sharp to round": eight 40px tiles in reading order, corners stepping 0, radius-chip, radius-control, radius-media, radius-card, radius-panel, then two discs
  steps and radii: spacing 8/16/24/48; tile 40, gap 16; radii 0, radius-chip, radius-control, radius-media, radius-card, radius-panel, disc = half the tile
-->
<svg viewBox="0 0 480 340" aria-hidden="true">
  <rect class="ground2" x="0" y="268" width="480" height="72" />
  <rect class="tint" x="24" y="48" width="120" height="152" />
  <rect class="ink" x="168" y="-8" width="216" height="356" />
  <rect class="signal" x="384" y="0" width="96" height="96" />
  <g>
    <rect class="cut r0" x="48" y="96" width="40" height="40" />
    <rect class="cut r1" x="184" y="40" width="40" height="40" />
    <rect class="cut r2" x="240" y="40" width="40" height="40" />
    <rect class="cut r3" x="296" y="40" width="40" height="40" />
    <rect class="cut r4" x="184" y="96" width="40" height="40" />
    <rect class="cut r5" x="240" y="96" width="40" height="40" />
    <rect class="cut disc" x="296" y="96" width="40" height="40" />
    <rect class="signal disc" x="240" y="152" width="40" height="40" />
  </g>
</svg>
<div class="text">
  <h1>UI<br>System</h1>
  <p>One config for brand colors, radius, logos and navigation.</p>
</div>
</body>
</html>
`);

// ---------- contrast gate: defaults and every preset, both modes ----------
// Each preset also runs with a pale and a saturated primary, so pins that a new seed invalidates are caught.
for (const [label, cfg] of [['defaults', core.DEFAULT_CONFIG], ...Object.values(core.PRESETS).flatMap((p) => [[p.id, { preset: p.id }], [`${p.id} + primary #F2E8A0`, { preset: p.id, color: { primary: '#F2E8A0' } }], [`${p.id} + primary #2F6BD8`, { preset: p.id, color: { primary: '#2F6BD8' } }]])]) {
  const fails = core.contrastReport(core.buildTheme(cfg)).filter((c) => !c.pass);
  if (fails.length) throw new Error(`Contrast below 4.5:1 in ${label}: ${fails.map((f) => `${f.mode} ${f.fg} on ${f.bg} ${f.ratio}`).join(', ')}`);
}

// ---------- README (brand book for agents) ----------
const designPresetRows = Object.values(core.PRESETS).map((p) => `| \`${p.id}\` | ${p.note} | ${p.seenIn.join(', ')} | ${p.questions.join(' ')} |`).join('\n');
const kindRows = Object.values(core.KINDS).map((k) => `| \`${k.id}\` | ${k.note} | ${k.pages.join(', ')} | ${k.questions.join(' ')} |`).join('\n');
const presetRows = Object.values(core.FONT_PRESETS).map((p) => `| \`${p.id}\` | ${p.display} | ${p.body} | ${p.mono} | ${p.note} |`).join('\n');
write('README.md', `UI System is a brand-agnostic design system. It ships structure, not a brand: every project sets its own colors, shape, type and logo through one config, and every component follows. Nothing from a previous client is prebuilt.

## What is inside

| part | what it gives you | where |
|---|---|---|
| Engine | Three color seeds, a roundness dial, a font preset and a density become every \`--uis-*\` variable, light and dark, contrast-checked at 4.5:1. | Root props, \`ui.config.json\` |
| Presets | Ways of designing on top of the engine: \`ledger\` (round and clean) and \`atelier\` (sharp and editorial). Not tied to a product. | Root \`preset\` |
| Kinds | What you build, picked separately: shop, app, website, booking, portfolio. Each names its pages and questions; sets no values. | Root \`kind\` |
| ${CATALOG.length} components | Buttons, forms, feedback, data, overlays, 6 website navs, 5 app shells, motion. | Components in this design system |
| Icons | Hugeicons free stroke-rounded set (MIT), ${ICON_COUNT} named icons. | \`UIS.Icon\`, Assets › Icons |
| Marks and avatars | Placeholder logo marks until the client's logo exists; DiceBear avatars for people without a photo. | Assets › Marks, Avatars |

The working canvas is **UI System · Canvas**: Start here (the preset, kind and brand questions), Foundations, Components, Patterns, Navigation, Use cases, Presets (one sheet per preset, products shown as skins side by side) and Kinds (page sets), every board driven by the same Tweaks.

## Start every design here

1. Mount the bundle and wrap each artboard or page in \`UIS.Root\`. Pass the project's brand as props on Root, never on individual components:
   \`<x-import component-from-global-scope="UIS.Root" primary="#…" accent="#…" roundness="{{60}}" pill="{{false}}" font-preset="modern" wordmark="Client" logo-mark="monogram" logo-placement="left">…</x-import>\`
2. Build screens from the real components (\`UIS.NavIsland\`, \`UIS.AppShell\`, \`UIS.Button\`…). Style your own markup with the \`--uis-*\` variables Root writes (\`var(--uis-primary)\`, \`var(--uis-ink-2)\`, \`var(--uis-r-card)\`), never raw hex.
3. Load fonts with one Google Fonts link in \`<helmet>\`: \`${core.allPresetFontsUrl()}\` (every preset), or the single-preset URL \`theme.fontsUrl\` returns.
4. Before any design, ask the preset questions (corners square or round, headings condensed caps or calm sans, photos or numbers lead) and the kind questions (see Kinds). Then add \`preset="ledger"\` or \`preset="atelier"\` and \`kind="…"\` on Root; any other prop still wins, and the brand goes on top.
5. When the brand is unknown, keep the neutral defaults and write placeholders like [BRAND], [AMOUNT], [DOMAIN]. Never invent figures, testimonials or client names.

The same config drives code: \`ui.config.json\` in the repo builds theme.css, a Tailwind v4 theme and this tokens.json (\`ui-system build\`).

## Color

Set three seeds and the system derives everything else, checked for contrast:
- \`primary\`: primary buttons, active nav items, selected states, links. The exact hex lives in its scale. Default \`#1C1B19\` (ink), so a new project looks finished before it has a brand.
- \`accent\`: highlights, "new" badges, counts, focus ring, charts. Use sparingly: one accent moment per view.
- \`neutral\`: tints every grey (warm seed, warm greys). \`auto\` borrows the primary's hue.

Roles and rules:
- Page on \`bg\`; cards, inputs and sheets on \`surface\`; subtle wells on \`surface-2\`; hover fills \`surface-3\`.
- Text: \`ink\` for primary copy, \`ink-2\` for secondary, \`ink-3\` for captions and placeholders. All three pass 4.5:1 on \`bg\` and \`surface\` in both themes.
- Text on a fill always uses its pair: \`primary-ink\` on \`primary\`, \`accent-ink\` on \`accent\` (black or white, chosen by contrast). Tinted chips use \`*-soft\` with \`*-soft-ink\`. Brand color as text uses \`primary-text\`/\`accent-text\` (4.5:1 on \`bg\`).
- Status: \`success\`, \`warning\`, \`danger\`, \`info\`, each with \`-soft\`, \`-soft-ink\`, \`-text\`. Always pair status color with a word or icon.
- Dark mode (\`mode="dark"\`) is derived, not designed separately: fills that would vanish are lifted, an ink primary flips to near-white.
- Over photography use \`on-image\` text on the \`image-scrim\` gradient; buttons there use the \`light\` or \`glass\` variants.

## Shape: radius from sharp to round

One \`roundness\` value (0–100) scales every radius role together; \`pill\` turns controls, chips, inputs and floating nav shells into full pills independently.

| role | token | used for | at 0 | at 100 |
|---|---|---|---|---|
| chip | \`radius-chip\` | badges, tags | 0 | 10 |
| control | \`radius-control\` | buttons, nav items, tabs | 0 | 14 (pill: 999) |
| field | \`radius-field\` | inputs, selects | 0 | 14 (pill: 999) |
| search | \`radius-search\` | search fields | 0 | 14 (pill: 999) |
| card | \`radius-card\` | cards, tables | 0 | 24 |
| panel | \`radius-panel\` | popovers, drawers, dialogs, inset panels | 0 | 32 |
| media | \`radius-media\` | images, video | 0 | 22 |
| shell | \`radius-shell\` | floating navs, docks, islands | 0 | 22 (pill: 999) |

Presets: sharp 0, crisp 25, soft 50, rounded 75, round 90 + pill. Nested elements use \`radius-inner\` (panel minus its padding). Avatars become circles from 70 or in pill mode.

## Type

Pick a preset with \`fontPreset\` (all Google Fonts), or override \`displayFont\`/\`bodyFont\` with any Google family.

| preset | display | body | mono | fits |
|---|---|---|---|---|
${presetRows}

Styles: \`display-2xl\` 80, \`display-xl\` 64, \`display-l\` 48, \`display-m\` 36 in the display face (they shrink on small screens); \`h1\` 30, \`h2\` 24, \`h3\` 20, \`body-l\` 18, \`body\` 16, \`body-s\` 14, \`label\` 13, \`caption\` 12, \`overline\` 11 uppercase. CSS classes carry the same names with a \`uis-\` prefix. \`buttonCase="upper"\` sets buttons and the menu button in spaced capitals. Sentence case everywhere else.

## Presets

A preset is a way of designing, not a product (color pins, shape, type, sizes, shadows, motion, plus rules and questions). Products appear only as "seen in" examples and may override anything. \`retail-editorial\` is the old name of \`atelier\` and still works. A project opts in with \`preset\` on Root or \`"preset"\` in ui.config.json; every other prop still wins, and the defaults never change. \`color.pin\` holds exact light-mode values and \`color.pinDark\` exact dark-mode values; roles a preset leaves unpinned are derived. A new seed drops the preset's pins for that seed's roles, so the contrast gate still holds.

| preset | look | seen in | ask first |
|---|---|---|---|
${designPresetRows}

\`atelier\`: ink \`#2D2A26\` on white, hairlines \`#E5E2DE\` (decorative only), control borders \`#8F8B86\`, grey \`#F4F4F4\` photo wells and search pill, off-white \`#FAF8F5\` panels, tan \`#8C6250\` tags and hover, sand \`#B49A87\` (accent-soft) with ink text, never white, sale red \`#CD2D2D\`, green \`#1F7A4D\` for WhatsApp and success, burgundy \`#7E1F33\` for the wordmark only. 2px controls, square cards and media, pill search. Archivo 900 uppercase headings and buttons over Inter 400/700. 52px buttons and inputs, 44px icon buttons and tabs, 56px large. 2px gaps between product tiles (\`space-1\`). No card shadows. 150/200/300ms motion, press scales to 0.96.

Atelier decisions (signed 2026-11-07 as retail-editorial): app sidebar on off-white \`#FAF8F5\` with a white current item and a 2px ink start bar; info is ink on grey \`#F4F4F4\` (the source has no info color, warning stays tan); a designed dark mode (ground \`#141210\`, ink \`#F3EFEA\`, sand stays sand, wordmark \`#D27A89\`); search pill edge \`#8F8B86\` on hover; 1px checkbox edge like every other control.

\`ledger\`: near-black ink \`#0d0d0d\` on warm off-white \`#FBF9F6\`, gold \`#eab308\` for the one primary action per page, warm greys from \`#78736a\`, green, orange and red status shown as dot plus word. Radius preset round: pill controls, 22px cards, 29px panels. Poppins 400/500/600 with Geist Mono for tabular money. Comfortable 36/44/52 controls, hairlines, no shadows, motion off. Pins nothing, so dark mode is derived.

## Kinds

What you build, picked separately from the preset; any kind works in any preset and sets no values. Ask its questions first, then draw its pages in the chosen preset.

| kind | for | pages | ask first |
|---|---|---|---|
${kindRows}

## Logo

- Variants: \`lockup\` (mark + wordmark, the default in navs), \`stacked\` (splash, covers, footers only), \`mark\` (rails, docks, favicons, tight mobile bars), \`wordmark\`.
- Generated marks until the client's logo exists: \`monogram\` (initials in a tile whose corners follow roundness), \`ring\`, \`spark\`, \`stack\`, \`orbit\`, or \`none\`.
- The client's real logo: upload it and pass \`logoSrc\` (full logo) and \`markSrc\` (mark only) on Root. Never redraw a real company's mark.
- \`markTone="current"\` follows the text color (works on images and dark bars); \`primary\` fills the mark with the brand color.
- Placement: \`logoPlacement\` left|center|right on Root sets the default for every nav; each nav also takes its own \`logoPlacement\`.
- Keep clear space equal to the mark's height. Minimum: mark 20px, lockup 96px wide.

## Navigation

Frontend (websites):
- \`NavIsland\`: floating top bar. Default for marketing, SaaS, agencies.
- \`NavBar\`: full-width top bar; \`transparent\` over a hero. Content-heavy and service sites.
- \`NavStacked\`: utility strip + logo row + link row. Commerce and editorial.
- \`NavDock\`: floating bottom bar with an explore panel; logo at the top. Immersive, image-led, mobile-first brands.
- \`NavMinimal\`: logo + Menu button opening a full-screen menu. Studios, luxury, one-pagers.
- \`NavMobile\`: \`sheet\`, \`tabbar\` or \`floating\` for phones.

Backend (apps), through \`AppShell variant=…\`:
- \`sidebar\` for dashboards (default), \`rail\` when content needs width, \`inset\` for a softer premium frame, \`topbar\` for 3–6 sections, \`dock\` for canvas-style editors. \`PageHeader\` tops every page.

Mark the current page with \`active: true\` on its link. Keep 4–6 top-level links; more go into the dock panel, the stacked link row or the sidebar.

## Surfaces, depth and motion

- \`surface="glass"\` frosts floating navs, docks and popovers (\`float-bg\`, \`float-border\`, 20px blur); \`solid\` keeps them opaque. Use glass over photography, solid over busy UI.
- Shadows: \`shadow-sm\` resting cards, \`shadow-md\` menus, \`shadow-lg\` drawers and dialogs, \`shadow-float\` floating navs. \`shadow="none"\` flattens everything for border-led brands; \`border="none"\` removes card hairlines for shadow-led brands.
- Density sets control heights (\`control-sm|md|lg\`: 36/44/52 comfortable) and card padding. Touch targets stay at least 44px at comfortable.
- Motion: panels ease out with \`cubic-bezier(0.16, 1, 0.3, 1)\` over 280ms; drawers slide over 500ms. Everything collapses under reduced motion.

## People and avatars

Never show stock or invented photos of people. \`UIS.Avatar\` shows a real photo when \`src\` exists; otherwise it draws a DiceBear avatar seeded by the name (same person, same face). Pick the style once with Root \`avatarStyle\`: \`notionists-neutral\` (default), \`lorelei-neutral\`, \`thumbs\`, \`glass\`, \`shapes\`, or \`initials\`. All CC0. Sample files are in Assets › Avatars.

## Motion

Use \`UIS.Reveal\` for entrances (fade-up, fade, scale-in, slide, blur-in, with \`stagger\`) and \`UIS.CountUp\` for real numbers; both run on anime.js v4 and respect \`motion\` / \`motionIntensity\` on Root and reduced motion. For anything custom call \`UIS.anime.animate\`, \`stagger\`, \`createTimeline\` or \`onScroll\`. Motion supports the content: one entrance per section, no looping decoration.

## Beyond this library

- **References first:** before designing a screen or section, look at real products on Mobbin (screens, flows, website sections) and cite what you borrowed.
- **React Bits** (reactbits.dev): animated text, backgrounds and effects. Install the TS-TW or TS-CSS variant (\`npx shadcn@latest add @react-bits/<Name>-TS-TW\`) and replace its colors with \`var(--uis-*)\`.
- **Untitled UI React** (MIT open-source components): install with its CLI, then import \`@ui-system/core/untitled-ui.css\` so its brand scale, greys and fonts follow this system.
- Avatars come from DiceBear, animation from anime.js. Icons come from Hugeicons only. Do not add a second icon set, avatar source or animation library.

## Iconography

Every icon comes from **Hugeicons** (hugeicons.com), the free stroke-rounded set (MIT, \`@hugeicons/core-free-icons\`). Use \`UIS.Icon\` by name: 24px grid, 1.5 stroke, round caps and joins, inheriting text color. Sizes: 16 in tables and badges, 18 in buttons and nav items, 20–24 standalone. Status tones carry their own icon (\`info\`, \`check-circle\`, \`warning\`, \`x-circle\`). Need a new one? Pick the closest Hugeicons glyph and add a name; never draw a path, use emoji or mix in another set. Icon-only buttons always carry a \`label\`.

## Content fundamentals

Sentence case for headings, buttons and labels. Buttons are verbs ("Book a table", "Send invoice"). Short, specific copy; the layout carries the meaning, not paragraphs. Numbers in tabular figures. Placeholders in brackets until real content exists.
`);

// ---------- asset groups (uploads recorded in design/assets.json by id) ----------
const assetsPath = join(root, 'design/assets.json');
const uploaded = existsSync(assetsPath) ? JSON.parse(readFileSync(assetsPath, 'utf8')) : {};
const GROUP_README = {
  Avatars: '# Avatars\n\nDiceBear samples for every bundled style (all CC0, no attribution). Components draw these live from a name with `UIS.Avatar`; these files are for decks, mockups and handoff. Never use stock or invented photos of people.\n',
  Icons: '# Icons\n\nEvery UI System icon (Hugeicons free stroke-rounded, MIT) as a standalone 24px SVG, stroke 1.5, ink `#1C1B19` (an image cannot inherit text color). In components use `UIS.Icon` by name so icons follow the theme.\n',
  Marks: '# Marks\n\nThe five generated logo marks in ink `#1C1B19`, for placeholders until the client logo exists. In components use `UIS.Logo` / `logoMark`; its monogram corners follow roundness.\n',
};
const assetGroups = {};
for (const [group, files] of Object.entries(uploaded)) {
  assetGroups[group] = { name: group, tile: group === 'Icons' ? 'xs' : group === 'Marks' ? 'm' : 's', order: Object.keys(files).sort(), files };
  write(`assets/${group}/README.md`, GROUP_README[group] ?? `# ${group}\n`);
}

// ---------- index ----------
const now = new Date().toISOString();
write('design-system.json', JSON.stringify({
  v: 3,
  layout: 'files',
  createdOnFiles: previous?.createdOnFiles ?? { v: 1, at: now },
  title: TITLE,
  namespace: NS,
  libraries: [
    { name: 'react', version: '18.3.1', global: 'React', file: 'components/lib/react.production.min.js' },
    { name: 'react-dom', version: '18.3.1', global: 'ReactDOM', file: 'components/lib/react-dom.production.min.js' },
  ],
  sections: {},
  groups: Object.keys(assetGroups).sort((a, b) => ['Marks', 'Icons', 'Avatars'].indexOf(a) - ['Marks', 'Icons', 'Avatars'].indexOf(b)),
  assetGroups,
  blobs: {},
  docs: { sections: [] },
  lastChange: { by: 'Koussay Zayani', at: now, via: 'Claude Code', note: process.env.DESIGN_NOTE || 'Built from github.com/Loomlyne/ui-system' },
}, null, 2) + '\n');

console.log(`Claude Design System written to ${out} (${CATALOG.length} components)`);
