/**
 * ui-system CLI
 *
 *   ui-system init [--preset sharp|crisp|soft|rounded|round] [--name "Client"]
 *   ui-system build [ui.config.json] [--out ui-theme] [--system]
 *
 * build writes: theme.css, tailwind.css, tokens.json (Claude Design), theme.json
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { DEFAULT_CONFIG, RADIUS_PRESETS, type UIConfigInput } from './config';
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
  const preset = flag('preset');
  const config = structuredClone(DEFAULT_CONFIG);
  if (preset && RADIUS_PRESETS[preset]) Object.assign(config.radius, RADIUS_PRESETS[preset]);
  const name = flag('name');
  if (name) { config.name = name; config.brand.wordmark = name; }
  writeFileSync(file, JSON.stringify({ $schema: './node_modules/@ui-system/core/schema.json', ...config }, null, 2) + '\n');
  console.log(`Created ui.config.json${preset ? ` (radius preset: ${preset})` : ''}. Edit it, then run: ui-system build`);
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
  console.log('ui-system init [--preset sharp|crisp|soft|rounded|round] [--name "Client"]');
  console.log('ui-system build [ui.config.json] [--out ui-theme] [--system]');
}
