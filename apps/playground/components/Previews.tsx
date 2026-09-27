'use client';
import * as React from 'react';
import { buildTheme, NEUTRAL_STEPS, SCALE_STEPS, contrast } from '@ui-system/core';
import {
  Alert, AppShell, Avatar, AvatarGroup, Badge, Button, Card, Checkbox, Chips, Icon, Input, Kbd, Logo, Menu, NavMobile,
  PageHeader, Popover, Progress, Reveal, Root, Select, SiteNav, Stat, Switch, Table, Tabs, Textarea, Toast, Tooltip,
} from '@ui-system/react';
import type { Config } from '@/lib/state';

/* ---------- Scaled device frame ---------- */
export function ScaledFrame({ width, height, phone, children }: { width: number; height: number; phone?: boolean; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [avail, setAvail] = React.useState(width);
  React.useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const cs = window.getComputedStyle(el);
      setAvail(el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1, avail / width);
  return (
    <div ref={ref} className="pg-framebox" style={{ width: width * scale, height: height * scale }}>
      <div className={phone ? 'pg-frame pg-frame--phone' : 'pg-frame'} style={{ width, height, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

const LINKS = [{ label: 'Home', active: true }, { label: 'Services' }, { label: 'Work' }, { label: 'About' }, { label: 'Contact' }];

function HeroMedia({ hero }: { hero?: string }) {
  return (
    <>
      {hero ? <img src={hero} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--uis-image-scrim)' }} />
    </>
  );
}

/* ---------- Website ---------- */
export function SitePreview({ config, hero, device }: { config: Config; hero?: string; device: 'desktop' | 'mobile' }) {
  if (device === 'mobile') {
    return (
      <ScaledFrame width={390} height={844} phone>
        <Root config={config} fill>
          <div style={{ position: 'relative', height: 844, overflow: 'hidden', background: 'var(--uis-neutral-900)' }}>
            <HeroMedia hero={hero} />
            <NavMobile variant="floating" transparent links={LINKS.slice(0, 4).map((l, i) => ({ ...l, icon: ['home', 'layers', 'grid', 'user'][i] }))} actions={[{ icon: 'search', label: 'Search' }]} />
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 120, display: 'flex', flexDirection: 'column', gap: 14, color: 'var(--uis-on-image)' }}>
              <span className="uis-overline" style={{ color: 'inherit', opacity: 0.75 }}>[What you do]</span>
              <h1 className="uis-display-m" style={{ color: 'inherit', fontSize: 38 }}>{config.name === 'New Project' ? 'A headline sized for thumbs.' : config.name}</h1>
              <Button variant="light" size="lg" block>Get in touch</Button>
            </div>
          </div>
        </Root>
      </ScaledFrame>
    );
  }
  return (
    <ScaledFrame width={1280} height={1640}>
      <Root config={config} fill>
        <section style={{ position: 'relative', height: 760, overflow: 'hidden', background: 'var(--uis-neutral-900)' }}>
          <HeroMedia hero={hero} />
          <div style={{ position: 'absolute', left: 72, bottom: 96, maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 20, color: 'var(--uis-on-image)' }}>
            <span className="uis-overline" style={{ color: 'inherit', opacity: 0.75 }}>[What you do] · [Where]</span>
            <h1 className="uis-display-2xl" style={{ color: 'inherit' }}>The one sentence your customer needs to hear.</h1>
            <p className="uis-body-l" style={{ opacity: 0.86, maxWidth: 520 }}>Who it is for and what happens when they get in touch.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="light" size="lg" iconRight="arrow-right">Primary action</Button>
              <Button variant="glass" size="lg">Secondary</Button>
            </div>
          </div>
          <SiteNav links={LINKS} actions={[{ icon: 'search', label: 'Search' }]} cta={{ label: 'Get in touch' }} tone="image" transparent utility={{ text: '[Announcement]', links: [{ label: 'Help' }, { label: 'EN / AR' }] }} />
        </section>
        <section style={{ padding: '80px 72px 56px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 640 }}>
              <span className="uis-overline">Services</span>
              <h2 className="uis-display-l">What the business offers, in plain words.</h2>
            </div>
            <Button variant="outline" iconRight="arrow-right">All services</Button>
          </div>
          <Reveal key={`${config.motion.enabled}-${config.motion.intensity}`} stagger={90} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
            {(['layers', 'sparkle', 'bolt'] as const).map((ic, i) => (
              <Card key={ic} interactive>
                <div style={{ width: 46, height: 46, borderRadius: 'var(--uis-r-control)', background: 'var(--uis-primary-soft)', color: 'var(--uis-primary-soft-ink)', display: 'grid', placeItems: 'center', marginBottom: 16 }}><Icon name={ic} size={22} /></div>
                <h3 className="uis-h3">[Service {i + 1}]</h3>
                <p className="uis-body-s uis-muted" style={{ marginTop: 8 }}>One or two lines on the outcome the customer gets.</p>
              </Card>
            ))}
          </Reveal>
        </section>
        <section style={{ margin: '0 72px', padding: 56, borderRadius: 'var(--uis-r-panel)', background: 'var(--uis-primary)', color: 'var(--uis-primary-ink)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32 }}>
          <h2 className="uis-display-l" style={{ maxWidth: 640 }}>A closing line that asks for the action.</h2>
          <Button variant="accent" size="lg" iconRight="arrow-right">Get in touch</Button>
        </section>
        <footer style={{ margin: '56px 72px 0', padding: '32px 0', borderTop: '1px solid var(--uis-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="lg" />
          <span className="uis-caption">© [Year] {config.brand.wordmark}. All rights reserved.</span>
        </footer>
      </Root>
    </ScaledFrame>
  );
}

/* ---------- App ---------- */
const SECTIONS = [
  { items: [{ label: 'Overview', icon: 'home', active: true }, { label: 'Projects', icon: 'folder', badge: 12 }, { label: 'Clients', icon: 'users' }, { label: 'Invoices', icon: 'file', badge: 3 }, { label: 'Calendar', icon: 'calendar' }] },
  { label: 'Workspace', items: [{ label: 'Reports', icon: 'chart' }, { label: 'Settings', icon: 'settings' }] },
];
const ROWS = [
  { client: { strong: '[Client A]' }, project: 'Website redesign', due: 'Oct 14', status: { tone: 'success' as const, label: 'Paid' }, amount: '[AMOUNT]' },
  { client: { strong: '[Client B]' }, project: 'Brand identity', due: 'Oct 21', status: { tone: 'warning' as const, label: 'Pending' }, amount: '[AMOUNT]' },
  { client: { strong: '[Client C]' }, project: 'Online store', due: 'Sep 30', status: { tone: 'danger' as const, label: 'Overdue' }, amount: '[AMOUNT]' },
];
const COLUMNS = [{ key: 'client', label: 'Client' }, { key: 'project', label: 'Project' }, { key: 'due', label: 'Due' }, { key: 'status', label: 'Status' }, { key: 'amount', label: 'Amount', align: 'right' as const }];

function Dashboard() {
  return (
    <>
      <PageHeader title="Overview" description="Everything happening across your projects this month." crumbs={['Workspace', 'Overview']} actions={<><Button variant="outline" icon="download">Export</Button><Button icon="plus">New project</Button></>} />
      <div style={{ padding: '0 32px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
          <Card><Stat label="Revenue" value="[AMOUNT]" delta="+12%" icon="currency" /></Card>
          <Card><Stat label="Active projects" value="24" delta="+3" icon="folder" /></Card>
          <Card><Stat label="Open invoices" value="7" delta="-2" trend="down" icon="file" /></Card>
          <Card><Stat label="Hours this week" value="36" delta="+4" icon="clock" /></Card>
        </div>
        <Table columns={COLUMNS} rows={ROWS} />
      </div>
    </>
  );
}

export function AppPreview({ config, device }: { config: Config; device: 'desktop' | 'mobile' }) {
  if (device === 'mobile') {
    return (
      <ScaledFrame width={390} height={844} phone>
        <Root config={config} fill>
          <div style={{ position: 'relative', height: 844, overflow: 'hidden' }}>
            <NavMobile variant="floating" links={[{ label: 'Home', icon: 'home', active: true }, { label: 'Projects', icon: 'folder' }, { label: 'Invoices', icon: 'file' }, { label: 'Inbox', icon: 'inbox' }]} actions={[{ icon: 'bell', label: 'Notifications', dot: true }]} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h1 className="uis-h1">Overview</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Card style={{ padding: 16 }}><Stat label="Revenue" value="[AMOUNT]" delta="+12%" /></Card>
                <Card style={{ padding: 16 }}><Stat label="Projects" value="24" /></Card>
              </div>
              <Card style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>[Project]</strong><Badge tone="warning">Review</Badge></div>
                <Progress value={72} />
              </Card>
            </div>
          </div>
        </Root>
      </ScaledFrame>
    );
  }
  return (
    <ScaledFrame width={1280} height={800}>
      <Root config={config} fill>
        <AppShell sections={SECTIONS} user={{ name: 'Your Name', meta: 'Owner' }} workspace={{ name: '[Workspace]', plan: 'Pro plan' }} actions={[{ icon: 'bell', label: 'Notifications', dot: true }]} style={{ height: 800 }}>
          <Dashboard />
        </AppShell>
      </Root>
    </ScaledFrame>
  );
}

/* ---------- Components ---------- */
export function ComponentsPreview({ config }: { config: Config }) {
  return (
    <Root config={config} style={{ borderRadius: 16, border: '1px solid var(--uis-line)', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button>Primary</Button><Button variant="accent">Accent</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="soft">Soft</Button><Button variant="danger" icon="trash">Delete</Button><Button iconOnly icon="plus" label="Add" />
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Email" placeholder="you@example.com" icon="mail" hint="We reply within a day." />
            <Select label="Service" options={['Website', 'Branding', 'Online store']} />
          </div>
          <Textarea label="Project details" placeholder="Tell us what you are building" />
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}><Switch label="Email updates" defaultChecked /><Checkbox label="I agree" defaultChecked /><span style={{ flex: 1 }} /><Button>Send</Button></div>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Alert title="Heads up">Your trial ends in 3 days.</Alert>
          <Alert tone="success" title="Published">The site is live.</Alert>
          <Toast title="Saved">Your changes are live.</Toast>
          <Progress value={68} />
        </Card>
      </div>
      <Card style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge>Neutral</Badge><Badge tone="primary">Primary</Badge><Badge tone="accent">New</Badge><Badge tone="success" dot>Paid</Badge><Badge tone="warning" dot>Pending</Badge><Badge tone="danger" dot>Overdue</Badge>
        <Tabs items={['Day', 'Week', 'Month']} /><Tabs items={['All', 'Active']} variant="pill" />
        <Avatar name="Amira Haddad" /><AvatarGroup people={[{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }]} /><Kbd>⌘K</Kbd><Tooltip>Tooltip</Tooltip>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 280px 1fr', gap: 20, alignItems: 'start' }}>
        <Popover title="Account"><Menu items={[{ label: 'Profile', icon: 'user' }, { label: 'Billing', icon: 'card' }, { label: 'Sign out', icon: 'logout' }]} /></Popover>
        <Popover title="Explore"><Chips items={[{ label: 'Work' }, { label: 'Services' }, { label: 'About' }, { label: 'Contact' }]} /></Popover>
        <Table columns={COLUMNS} rows={ROWS} />
      </div>
    </Root>
  );
}

/* ---------- Tokens ---------- */
export function TokensPreview({ config }: { config: Config }) {
  const t = React.useMemo(() => buildTheme(config), [config]);
  const mono: React.CSSProperties = { font: '500 11px/1 var(--uis-font-mono)' };
  const strip = (name: string, scale: Record<string, string>, steps: readonly (number | string)[]) => (
    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ ...mono, width: 64, color: 'var(--uis-ink-3)' }}>{name}</span>
      <div style={{ display: 'flex', flex: 1, height: 52, borderRadius: 'var(--uis-r-media)', overflow: 'hidden' }}>
        {steps.map((s) => {
          const hex = scale[String(s)];
          const ink = contrast(hex, '#FFFFFF') >= contrast(hex, '#111111') ? '#FFFFFF' : '#111111';
          return <div key={s} title={`${name}-${s} ${hex}`} style={{ flex: 1, background: hex, color: ink, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 0 6px 7px', ...mono, gap: 3 }}><span>{s}</span><span style={{ opacity: 0.7, fontSize: 9.5 }}>{hex}</span></div>;
        })}
      </div>
    </div>
  );
  const roles: Array<[string, string, string]> = [['bg', 'ink', 'Page'], ['surface', 'ink-2', 'Surface'], ['surface', 'ink-3', 'Captions'], ['primary', 'primary-ink', 'Primary'], ['accent', 'accent-ink', 'Accent'], ['primary-soft', 'primary-soft-ink', 'Primary soft'], ['success-soft', 'success-soft-ink', 'Success'], ['danger-soft', 'danger-soft-ink', 'Danger']];
  return (
    <Root config={config} style={{ borderRadius: 16, border: '1px solid var(--uis-line)', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {strip('primary', t.scales.primary as unknown as Record<string, string>, SCALE_STEPS)}
        {strip('accent', t.scales.accent as unknown as Record<string, string>, SCALE_STEPS)}
        {strip('neutral', t.scales.neutral as unknown as Record<string, string>, NEUTRAL_STEPS)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
        {(['light', 'dark'] as const).map((m) => (
          <div key={m} style={{ padding: 18, borderRadius: 'var(--uis-r-card)', background: t.colors[m].bg, color: t.colors[m].ink, border: `1px solid ${t.colors[m].line}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ ...mono, textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>{m} theme · WCAG contrast</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
              {roles.map(([bg, fg, label]) => (
                <div key={label} style={{ height: 62, padding: '10px 12px', borderRadius: 'var(--uis-r-control)', background: t.colors[m][bg], color: t.colors[m][fg], boxShadow: `inset 0 0 0 1px ${t.colors[m].line}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ font: '600 12.5px/1.1 var(--uis-font-body)' }}>{label}</span>
                  <span style={mono}>{contrast(t.colors[m][bg], t.colors[m][fg]).toFixed(1)} : 1</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 12 }}>
        {(['chip', 'control', 'field', 'card', 'panel', 'media', 'shell'] as const).map((r) => (
          <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 96, background: 'var(--uis-surface-2)', border: '1.5px solid var(--uis-line-strong)', borderRadius: `var(--uis-r-${r})` }} />
            <span style={{ font: '600 12.5px/1 var(--uis-font-body)' }}>{r} · {t.radius[r] >= 999 ? 'pill' : `${t.radius[r]}px`}</span>
          </div>
        ))}
      </div>
    </Root>
  );
}
