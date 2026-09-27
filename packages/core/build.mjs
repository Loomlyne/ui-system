import { build } from 'esbuild';
import { writeFileSync } from 'node:fs';

await build({ entryPoints: ['src/index.ts'], outfile: 'dist/index.js', bundle: true, format: 'esm', platform: 'neutral', target: 'es2020' });
await build({ entryPoints: ['src/cli.ts'], outfile: 'dist/cli.js', bundle: true, format: 'esm', platform: 'node', target: 'node18', banner: { js: '#!/usr/bin/env node' } });

// Regenerate the static Tailwind mapping so it never drifts from the engine.
const { toTailwind } = await import('./dist/index.js');
writeFileSync('styles/tailwind.css', toTailwind());
console.log('core built');
