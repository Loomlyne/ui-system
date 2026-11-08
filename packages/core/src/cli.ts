/**
 * ui-system CLI
 *
 *   ui-system init [--preset ledger|atelier] [--kind shop|app|website|booking|portfolio] [--radius sharp|crisp|soft|rounded|round] [--name "Client"]
 *   ui-system build [ui.config.json] [--out ui-theme] [--system]
 *
 * build writes: theme.css, tailwind.css, tokens.json (Claude Design), theme.json
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { DEFAULT_CONFIG, RADIUS_PRESETS, presetId, type KindId, type UIConfigInput } from './config';
import { PRESETS } from './presets';
import { KINDS } from './kinds';
import { buildTheme } from './theme';
import { toCSS, toDesignTokens, toJSON, toTailwind } from './exports';

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const has = (name: string) => args.includes(`--${name}`);

function init() {
  const file = resolve('ui.config.json');
  if (existsSync(file) && !has('force')) {
    console.error('ui.config.json already exists (use --force to overwrite).');
    process.exit(1);
  }
  const presetFlag = flag('preset');
  // --preset used to take a radius preset; those names still work and act like --radius.
  const radius = flag('radius') ?? (presetFlag && RADIUS_PRESETS[presetFlag] ? presetFlag : undefined);
  const id = presetId(presetFlag);
  if (presetFlag && !id && !RADIUS_PRESETS[presetFlag]) {
    console.error(`Unknown preset "${presetFlag}". Presets: ${Object.keys(PRESETS).join(', ')}.`);
    process.exit(1);
  }
  const kindFlag = flag('kind');
  if (kindFlag && !(kindFlag in KINDS)) {
    console.error(`Unknown kind "${kindFlag}". Kinds: ${Object.keys(KINDS).join(', ')}.`);
    process.exit(1);
  }
  const kind = kindFlag as KindId | undefined;
  const out: UIConfigInput & { $schema: string } = { $schema: './node_modules/@ui-system/core/schema.json' };
  if (id) out.preset = id;
  if (kind) out.kind = kind;
  if (id) {
    // A preset fills everything else; the file holds only what this project sets on top.
    out.name = flag('name') ?? DEFAULT_CONFIG.name;
    out.brand = { wordmark: out.name };
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
    console.log(`\n${p.label}: ${p.note}\nAsk first:\n${p.questions.map((q) => `  - ${q}`).join('\n')}`);
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

if (cmd === 'init') init();
else if (cmd === 'build') build();
else {
  console.log('ui-system init [--preset ledger|atelier] [--kind shop|app|website|booking|portfolio] [--radius sharp|crisp|soft|rounded|round] [--name "Client"]');
  console.log('ui-system build [ui.config.json] [--out ui-theme] [--system]');
}
