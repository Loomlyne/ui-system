'use client';
import * as React from 'react';
import { DEFAULT_CONFIG, resolveConfig } from '@ui-system/core';
import { Badge, Button, IconButton, Root, Tabs } from '@ui-system/react';
import Controls from './Controls';
import ExportPanel from './ExportPanel';
import { UploadField } from './fields';
import { AppPreview, ComponentsPreview, SitePreview, TokensPreview } from './Previews';
import { clone, decodeHash, encodeHash, fromStarter, type Config } from '@/lib/state';

type View = 'site' | 'app' | 'components' | 'tokens' | 'export';

/** The playground's own chrome uses the system too, with a fixed theme so it never moves while you edit. */
const CHROME = {
  name: 'Playground',
  color: { primary: '#1C1B19', accent: '#E0562B', neutral: '#737373', mode: 'dark' as const },
  radius: { roundness: 55, pill: false },
  type: { preset: 'modern' as const, buttonCase: 'normal' as const },
  density: 'compact' as const,
  surface: { float: 'glass' as const, shadow: 'medium' as const, border: 'hairline' as const },
  brand: { wordmark: 'UI System', caption: '', mark: 'stack' as const, markTone: 'current' as const },
};

export default function Playground() {
  const [config, setConfig] = React.useState<Config>(() => clone(DEFAULT_CONFIG));
  const [view, setView] = React.useState<View>('site');
  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');
  const [hero, setHero] = React.useState<string | undefined>();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const fromHash = decodeHash(window.location.hash);
    if (fromHash) setConfig(fromHash);
    else {
      try {
        const saved = window.localStorage.getItem('uis-playground');
        if (saved) setConfig(resolveConfig(JSON.parse(saved)));
      } catch { /* storage unavailable */ }
    }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem('uis-playground', JSON.stringify(config)); } catch { /* storage unavailable */ }
    window.history.replaceState(null, '', `#c=${encodeHash(config)}`);
  }, [config, ready]);

  const [shared, setShared] = React.useState(false);
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setShared(true); setTimeout(() => setShared(false), 1400); } catch { /* clipboard blocked */ }
  };

  return (
    <Root config={CHROME} className="pg">
      <aside className="pg-side">
        <div className="pg-head">
          <div className="pg-title"><strong>UI System</strong><span>Playground · v0.1</span></div>
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton icon="arrow-up-right" label="GitHub repo" href="https://github.com/Loomlyne/ui-system" />
            <IconButton icon="x" label="Reset to defaults" onClick={() => setConfig(clone(DEFAULT_CONFIG))} />
          </div>
        </div>
        <Controls config={config} onChange={setConfig} onStarter={(id) => setConfig(fromStarter(id, config.brand))} />
        <section className="pg-section">
          <h2>Preview only</h2>
          <UploadField label="Hero photo" value={hero} onChange={setHero} />
        </section>
      </aside>

      <main className="pg-main">
        <div className="pg-toolbar">
          <Tabs value={view} onChange={(v) => setView(v as View)} items={[{ label: 'Website', value: 'site', icon: 'globe' }, { label: 'App', value: 'app', icon: 'grid' }, { label: 'Components', value: 'components', icon: 'layers' }, { label: 'Tokens', value: 'tokens', icon: 'sliders' }, { label: 'Export', value: 'export', icon: 'download' }]} />
          <span style={{ flex: 1 }} />
          {view === 'site' || view === 'app' ? (
            <Tabs value={device} onChange={(v) => setDevice(v as 'desktop' | 'mobile')} items={[{ label: 'Desktop', value: 'desktop' }, { label: 'Mobile', value: 'mobile' }]} />
          ) : null}
          <Badge tone="accent" dot>{config.nav.front} · {config.nav.back}</Badge>
          <Button size="sm" variant="secondary" icon={shared ? 'check' : 'link'} onClick={share}>{shared ? 'Link copied' : 'Share link'}</Button>
          <Button size="sm" icon="download" onClick={() => setView('export')}>Export</Button>
        </div>
        <div className="pg-stage">
          {view === 'site' ? <SitePreview config={config} hero={hero} device={device} /> : null}
          {view === 'app' ? <AppPreview config={config} device={device} /> : null}
          {view === 'components' ? <ComponentsPreview config={config} /> : null}
          {view === 'tokens' ? <TokensPreview config={config} /> : null}
          {view === 'export' ? <ExportPanel config={config} onImport={setConfig} /> : null}
        </div>
      </main>
    </Root>
  );
}
