/**
 * ui-system CLI
 *
 *   ui-system init [--preset ledger|atelier] [--kind shop|app|website|booking|portfolio] [--radius sharp|crisp|soft|rounded|round] [--name "Client"]
 *   ui-system build [ui.config.json] [--out ui-theme] [--system]
 *   ui-system check [dir] [--allow path,path]
 *
 * check scans source files for rule breaks (hard-coded colors, emoji, non-Hugeicons icon sets, banned motion and
 * avatar libraries) and exits 1 when it finds any.
 *
 * build writes: theme.css, tailwind.css, tokens.json (Claude Design), theme.json
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative, extname, sep, basename } from 'node:path';
import { DEFAULT_CONFIG, RADIUS_PRESETS, presetId, type KindId, type UIConfigInput } from './config';
import { PRESETS } from './presets';
import { KINDS } from './kinds';
import { buildTheme } from './theme';
import { toCSS, toDesignTokens, toJSON, toTailwind } from './exports';

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  const v = i >= 0 ? args[i + 1] : undefined;
  return v === undefined || v.startsWith('--') ? undefined : v;
};
const own = (o: object, k?: string): k is string => k !== undefined && Object.hasOwn(o, k);
const has = (name: string) => args.includes(`--${name}`);

function init() {
  const file = resolve('ui.config.json');
  if (existsSync(file) && !has('force')) {
    console.error('ui.config.json already exists (use --force to overwrite).');
    process.exit(1);
  }
  const presetFlag = flag('preset');
  const radiusFlag = flag('radius');
  const id = presetId(presetFlag);
  // --preset used to take a radius preset; those names still work and act like --radius.
  const presetIsRadius = !id && own(RADIUS_PRESETS, presetFlag);
  if (presetFlag && !id && !presetIsRadius) {
    console.error(`Unknown preset "${presetFlag}". Presets: ${Object.keys(PRESETS).join(', ')}.`);
    process.exit(1);
  }
  if (radiusFlag && !own(RADIUS_PRESETS, radiusFlag)) {
    console.error(`Unknown radius "${radiusFlag}". Radius presets: ${Object.keys(RADIUS_PRESETS).join(', ')}.`);
    process.exit(1);
  }
  if (presetIsRadius && radiusFlag && radiusFlag !== presetFlag) {
    console.error(`--preset ${presetFlag} is a radius name and --radius ${radiusFlag} conflicts with it. Use one.`);
    process.exit(1);
  }
  const radius = radiusFlag ?? (presetIsRadius ? presetFlag : undefined);
  const kindFlag = flag('kind');
  if (kindFlag && !own(KINDS, kindFlag)) {
    console.error(`Unknown kind "${kindFlag}". Kinds: ${Object.keys(KINDS).join(', ')}.`);
    process.exit(1);
  }
  const kind = kindFlag as KindId | undefined;
  const out: UIConfigInput & { $schema: string } = { $schema: './node_modules/@ui-system/core/schema.json' };
  if (id) out.preset = id;
  if (kind) out.kind = kind;
  if (id) {
    // A preset fills everything else; the file holds only what this project sets on top.
    const name = flag('name');
    if (name) { out.name = name; out.brand = { wordmark: name }; }
    if (radius) out.radius = { ...RADIUS_PRESETS[radius] };
  } else {
    const config = structuredClone(DEFAULT_CONFIG);
    if (radius) Object.assign(config.radius, RADIUS_PRESETS[radius]);
    const name = flag('name');
    if (name) { config.name = name; config.brand.wordmark = name; }
    Object.assign(out, config);
  }
  writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  const parts = [id && `preset ${id}`, kind && `kind ${kind}`, radius && `radius ${radius}`].filter(Boolean);
  console.log(`Created ui.config.json${parts.length ? ` (${parts.join(', ')})` : ''}.`);
  if (id) {
    const p = PRESETS[id];
    console.log(`\n${p.label}: ${p.note}\nRules:\n${p.rules.map((r) => `  - ${r}`).join('\n')}\nNever:\n${p.never.map((r) => `  - ${r}`).join('\n')}\nAsk first:\n${p.questions.map((q) => `  - ${q}`).join('\n')}`);
  }
  if (kind) {
    const k = KINDS[kind];
    console.log(`\n${k.label}: pages ${k.pages.join(', ')}.\nAsk first:\n${k.questions.map((q) => `  - ${q}`).join('\n')}`);
  }
  console.log('\nEdit it, then run: ui-system build');
}

function build() {
  const src = args[1] && !args[1].startsWith('--') ? args[1] : 'ui.config.json';
  const file = resolve(src);
  if (!existsSync(file)) {
    console.error(`No config at ${file}. Run: ui-system init`);
    process.exit(1);
  }
  const raw = JSON.parse(readFileSync(file, 'utf8')) as UIConfigInput & { $schema?: string };
  delete raw.$schema;
  const theme = buildTheme(raw);
  const out = resolve(flag('out') ?? 'ui-theme');
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, 'theme.css'), toCSS(theme, { system: has('system') }));
  writeFileSync(join(out, 'tailwind.css'), toTailwind());
  writeFileSync(join(out, 'tokens.json'), JSON.stringify(toDesignTokens(theme), null, 2) + '\n');
  writeFileSync(join(out, 'theme.json'), JSON.stringify(toJSON(theme), null, 2) + '\n');
  console.log(`Built "${theme.config.name}" into ${out}: theme.css, tailwind.css, tokens.json, theme.json`);
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'out', 'build', 'ui-theme', 'coverage', '.turbo', '.claude', '.planning']);
const SRC_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html', '.vue', '.svelte', '.astro', '.liquid']);
const COLOR_FN_RE = /\b(?:rgba?|hsla?|oklch|oklab)\(/;
/* A hex colour, not an HTML entity (&#123;) or a word that ends in #. */
const HEX_RE = /(?<![&\w])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
/* All-digit 4 or 8 long (#1042, #20261113) reads as an order number or date, not a colour. */
const isColor = (hex: string) => /[a-fA-F]/.test(hex) || hex.length === 3 || hex.length === 6;
const hasColor = (line: string) => COLOR_FN_RE.test(line) || [...line.matchAll(HEX_RE)].some((m) => isColor(m[1]));
const EMOJI_RE = /\p{Extended_Pictographic}/u;
const BANNED_LIBS = 'lucide-react|lucide|react-icons|@heroicons|heroicons|@fortawesome|font-awesome|fontawesome|@tabler\\/icons|tabler-icons|@phosphor-icons|phosphor-icons|@radix-ui\\/react-icons|framer-motion|motion\\/react|gsap';
/* import x from 'gsap', import 'gsap', import('gsap'), require('gsap') */
const BANNED_IMPORT_RE = new RegExp(`(?:from\\s+|import\\s*\\(?\\s*|require\\s*\\(\\s*)['"](${BANNED_LIBS})(?:[/'"])`);
/* <script src=".../gsap/3.12.5/gsap.min.js">, <link href=".../font-awesome/..."> */
const BANNED_SRC_RE = new RegExp(`(?:src|href)\\s*=\\s*['"][^'"]*[/@](${BANNED_LIBS})[@/.-]`);
const BANNED_URL_RE = /pravatar\.cc|randomuser\.me|unsplash\.com\/photos|thispersondoesnotexist/;

function walk(dir: string, out: string[]) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (SRC_EXT.has(extname(name))) out.push(full);
  }
}

function check() {
  const root = resolve(args[1] && !args[1].startsWith('--') ? args[1] : '.');
  const allow = (flag('allow') ?? '').split(',').filter(Boolean);
  const files: string[] = [];
  const single = statSync(root).isFile();
  if (single) files.push(root);
  else walk(root, files);
  const found: string[] = [];
  for (const f of files) {
    const rel = single ? basename(f) : relative(root, f).split(sep).join('/');
    if (allow.some((a) => rel === a || rel.startsWith(a))) continue;
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (line.includes('ui-system-allow')) return;
      const at = `${rel}:${i + 1}`;
      if (hasColor(line)) found.push(`${at}  hard-coded color: use a --uis-* variable or token`);
      if (EMOJI_RE.test(line)) found.push(`${at}  emoji: use a Hugeicons icon`);
      const m = BANNED_IMPORT_RE.exec(line) ?? BANNED_SRC_RE.exec(line);
      if (m) found.push(`${at}  banned library "${m[1]}": icons are Hugeicons, motion is anime.js (Reveal, CountUp)`);
      if (BANNED_URL_RE.test(line)) found.push(`${at}  fake or stock avatar source: use Avatar (DiceBear)`);
    });
  }
  if (found.length) {
    console.error(found.join('\n'));
    console.error(`\n${found.length} UI System rule break(s) in ${files.length} files. Fix them, or ask the owner to allow one (add "ui-system-allow" on the line, or --allow <path>).`);
    process.exit(1);
  }
  console.log(`UI System check: ${files.length} files, no rule breaks.`);
}

if (cmd === 'init') init();
else if (cmd === 'build') build();
else if (cmd === 'check') check();
else {
  console.log('ui-system init [--preset ledger|atelier] [--kind shop|app|website|booking|portfolio] [--radius sharp|crisp|soft|rounded|round] [--name "Client"]');
  console.log('ui-system build [ui.config.json] [--out ui-theme] [--system]');
  console.log('ui-system check [dir] [--allow path,path]');
}
