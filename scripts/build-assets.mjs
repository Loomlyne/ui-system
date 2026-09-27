// Builds the asset files for the Claude Design System "Assets" section:
//   Icons   every UI System icon as a standalone SVG (ink #1C1B19, 24px grid)
//   Marks   the generated logo marks as SVG templates
//   Avatars DiceBear samples for each bundled style (CC0)
// Output: design/assets/<Group>/<file>.svg (uploaded to the design system as assets)
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { ICONS, avatarSvg, AVATAR_STYLES } = await import(join(root, 'packages/react/dist/index.js'));
const out = join(root, 'design/assets');
if (existsSync(out)) rmSync(out, { recursive: true });
const put = (rel, text) => { const p = join(out, rel); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, text); };
const INK = '#1C1B19';

for (const [name, d] of Object.entries(ICONS)) {
  put(`Icons/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>\n`);
}

const mark = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32">${body}</svg>\n`;
put('Marks/monogram.svg', mark(`<rect width="32" height="32" rx="9" fill="${INK}"/><text x="16" y="16.5" text-anchor="middle" dominant-baseline="central" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="17">B</text>`));
put('Marks/ring.svg', mark(`<circle cx="16" cy="16" r="13.5" fill="none" stroke="${INK}" stroke-width="3"/><text x="16" y="16.5" text-anchor="middle" dominant-baseline="central" fill="${INK}" font-family="Inter, Arial, sans-serif" font-weight="700" font-size="17">B</text>`));
put('Marks/spark.svg', mark(`<path d="M16 2c1 8.6 4.8 12.9 14 14-9.2 1.1-13 5.4-14 14-1-8.6-4.8-12.9-14-14 9.2-1.1 13-5.4 14-14z" fill="${INK}"/>`));
put('Marks/stack.svg', mark(`<rect x="4" y="5" width="20" height="5.5" rx="2.5" fill="${INK}"/><rect x="8" y="13.25" width="20" height="5.5" rx="2.5" fill="${INK}" opacity="0.72"/><rect x="4" y="21.5" width="14" height="5.5" rx="2.5" fill="${INK}" opacity="0.45"/>`));
put('Marks/orbit.svg', mark(`<circle cx="14" cy="18" r="10" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="24.5" cy="7.5" r="4.5" fill="${INK}"/>`));

const seeds = ['Amira', 'Omar', 'Lina', 'Sami'];
for (const style of AVATAR_STYLES.filter((s) => s !== 'initials')) {
  for (const seed of seeds) put(`Avatars/${style}-${seed.toLowerCase()}.svg`, avatarSvg(seed, style));
}
console.log('assets written to', out);
