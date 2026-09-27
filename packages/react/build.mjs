import { build } from 'esbuild';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const shared = { bundle: true, target: 'es2019', jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment', logLevel: 'warning' };

// 1. ESM library for apps (React is a peer dependency, core is bundled in).
await build({ ...shared, entryPoints: ['src/index.ts'], outfile: 'dist/index.js', format: 'esm', external: ['react', 'react-dom'], banner: { js: "'use client';" } });

// 2. Classic browser bundle: window.UIS, React read from window.React.
//    This is what Claude Design, CodePen or a plain <script> tag load.
const reactGlobal = {
  name: 'react-global',
  setup(b) {
    b.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'react-global' }));
    b.onLoad({ filter: /.*/, namespace: 'react-global' }, () => ({ contents: 'module.exports = window.React;', loader: 'js' }));
  },
};
await build({
  ...shared, entryPoints: ['src/bundle.ts'], outfile: 'dist/uis.bundle.js', format: 'iife', globalName: 'UIS', minify: true,
  plugins: [reactGlobal], banner: { js: '/* UI System bundle: window.UIS (needs window.React 18+) */' },
  footer: { js: 'window.UIS = UIS;' },
});

mkdirSync('dist', { recursive: true });
copyFileSync('../core/styles/ui.css', 'dist/ui.css');
const js = readFileSync('dist/uis.bundle.js', 'utf8');
if (js.includes('</script')) throw new Error('bundle contains </script');
writeFileSync('dist/uis.bundle.js', js);
console.log('react built', (js.length / 1024).toFixed(1) + ' KB bundle');
