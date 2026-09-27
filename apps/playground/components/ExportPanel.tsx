'use client';
import * as React from 'react';
import { buildTheme, resolveConfig, toCSS, toDesignTokens, toTailwind } from '@ui-system/core';
import { Alert, Button, Tabs } from '@ui-system/react';
import { portable, type Config } from '@/lib/state';

type Kind = 'config' | 'css' | 'tailwind' | 'tokens' | 'react' | 'html';

const FILES: Record<Kind, { label: string; file: string; mime: string }> = {
  config: { label: 'ui.config.json', file: 'ui.config.json', mime: 'application/json' },
  css: { label: 'theme.css', file: 'theme.css', mime: 'text/css' },
  tailwind: { label: 'tailwind.css', file: 'tailwind.css', mime: 'text/css' },
  tokens: { label: 'tokens.json (Claude Design)', file: 'tokens.json', mime: 'application/json' },
  react: { label: 'React', file: 'layout.tsx', mime: 'text/plain' },
  html: { label: 'Plain HTML', file: 'index.html', mime: 'text/html' },
};

function reactSnippet(c: Config) {
  return `// npm i @ui-system/react @ui-system/core
import '@ui-system/react/ui.css';
import { Root, SiteNav, AppShell, Button } from '@ui-system/react';
import config from './ui.config.json';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Root config={config}>
      <SiteNav
        links={[{ label: 'Home', href: '/', active: true }, { label: 'Work', href: '/work' }]}
        cta={{ label: 'Get in touch', href: '/contact' }}
      />
      {children}
    </Root>
  );
}

// Backend: <AppShell variant="${c.nav.back}" sections={[...]} user={{ name: '…' }}>{page}</AppShell>
// Website nav follows config.nav.front ("${c.nav.front}"); pass variant="…" to override.
`;
}

function htmlSnippet(c: Config) {
  return `<!-- Plain HTML, Framer embeds or Shopify: theme.css + ui.css, then use the classes. -->
<link rel="stylesheet" href="/theme.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Loomlyne/ui-system@main/packages/core/styles/ui.css">

<body class="uis uis-page">
  <header class="uis-bar">
    <div><a class="uis-logo" href="/"><span class="uis-logo__text"><span class="uis-logo__word">${c.brand.wordmark}</span></span></a></div>
    <nav>
      <a class="uis-navlink" aria-current="page" href="/">Home</a>
      <a class="uis-navlink" href="/work">Work</a>
    </nav>
    <div><a class="uis-btn uis-btn--primary uis-btn--sm" href="/contact">Get in touch</a></div>
  </header>

  <section style="padding: 96px 48px">
    <h1 class="uis-display-xl">Headline</h1>
    <button class="uis-btn uis-btn--primary uis-btn--lg">Primary action</button>
    <span class="uis-badge uis-badge--accent">New</span>
  </section>
</body>
`;
}

export default function ExportPanel({ config, onImport }: { config: Config; onImport: (c: Config) => void }) {
  const [kind, setKind] = React.useState<Kind>('config');
  const [copied, setCopied] = React.useState(false);
  const [importText, setImportText] = React.useState('');
  const [error, setError] = React.useState('');
  const theme = React.useMemo(() => buildTheme(config), [config]);

  const text = React.useMemo(() => {
    const p = portable(config);
    switch (kind) {
      case 'config': return JSON.stringify({ $schema: './node_modules/@ui-system/core/schema.json', ...p }, null, 2) + '\n';
      case 'css': return toCSS(buildTheme(p));
      case 'tailwind': return toTailwind();
      case 'tokens': return JSON.stringify(toDesignTokens(buildTheme(p)), null, 2) + '\n';
      case 'react': return reactSnippet(config);
      case 'html': return htmlSnippet(config);
    }
  }, [kind, config, theme]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* clipboard blocked */ }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: FILES[kind].mime }));
    const a = document.createElement('a');
    a.href = url; a.download = FILES[kind].file; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const apply = () => {
    try {
      const parsed = JSON.parse(importText);
      delete parsed.$schema;
      onImport(resolveConfig(parsed));
      setError('');
      setImportText('');
    } catch (e) {
      setError('That is not valid JSON. Paste the contents of a ui.config.json file.');
    }
  };

  const hasUploads = config.brand.logoSrc?.startsWith('data:') || config.brand.markSrc?.startsWith('data:');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 20, alignItems: 'start' }}>
      <div>
        <div className="pg-export-head">
          <Tabs items={(Object.keys(FILES) as Kind[]).map((k) => ({ label: FILES[k].label, value: k }))} value={kind} onChange={(v) => setKind(v as Kind)} />
          <span style={{ flex: 1 }} />
          <Button size="sm" variant="secondary" icon={copied ? 'check' : 'copy'} onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
          <Button size="sm" icon="download" onClick={download}>Download</Button>
        </div>
        <pre className="pg-code">{text}</pre>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {hasUploads ? <Alert tone="warning" title="Uploaded logos">Exports point to /brand/logo.svg and /brand/mark.svg. Put the files there in your project.</Alert> : null}
        <Alert title="Where each file goes">
          ui.config.json lives in the project root; run <code>npx ui-system build</code> to regenerate theme.css, tailwind.css and tokens.json. tokens.json updates the Claude Design System.
        </Alert>
        <div className="pg-field">
          <span className="pg-label">Import a ui.config.json</span>
          <textarea className="uis-textarea" rows={6} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder='{ "color": { "primary": "#2F5D50" } }' />
          {error ? <span className="uis-hint uis-hint--error">{error}</span> : null}
          <Button size="sm" variant="outline" onClick={apply} disabled={!importText.trim()}>Apply config</Button>
        </div>
      </div>
    </div>
  );
}
