import * as React from 'react';
import type { BackNav, LogoVariant, Placement } from '@ui-system/core';
import { cx, pick, usePlacement, useUIS } from '../context';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { Avatar, IconButton, Input } from '../primitives';
import { A, arr, type AppUser, type NavAction, type NavLink, type NavSection, type Workspace } from './shared';

interface BaseBackProps {
  sections?: NavSection[];
  user?: AppUser | null;
  logoPlacement?: Placement;
  logoVariant?: LogoVariant;
  className?: string;
  style?: React.CSSProperties;
}

const initialsOf = (name: string) => (name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('') || '·').toUpperCase();

/* ---------- Sidebar ---------- */
export interface AppSidebarProps extends BaseBackProps {
  workspace?: Workspace | null;
  search?: boolean | string;
  footer?: React.ReactNode;
}
export function AppSidebar({ sections, user, workspace, search = true, logoPlacement, logoVariant, footer, className, style }: AppSidebarProps) {
  const { brand } = useUIS();
  const placement = usePlacement(logoPlacement);
  const variant = pick(logoVariant, brand.variant === 'stacked' ? 'lockup' : brand.variant);
  return (
    <aside className={cx('uis-sidebar', className)} style={style} aria-label="Sidebar">
      <div className="uis-sidebar__head" data-placement={placement}>
        <Logo variant={variant} size="sm" href="#" />
        {placement !== 'center' ? <IconButton icon="sidebar" label="Collapse sidebar" /> : null}
      </div>
      {workspace ? (
        <button type="button" className="uis-workspace">
          <span className="uis-workspace__glyph">{workspace.initials ?? initialsOf(workspace.name)}</span>
          <span className="uis-workspace__meta">
            <span className="uis-workspace__name">{workspace.name}</span>
            {workspace.plan ? <span className="uis-workspace__plan">{workspace.plan}</span> : null}
          </span>
          <Icon name="chevrons-updown" size={16} style={{ color: 'var(--uis-ink-3)' }} />
        </button>
      ) : null}
      {search ? <Input size="sm" icon="search" placeholder={typeof search === 'string' ? search : 'Search'} kbd="⌘K" aria-label="Search" /> : null}
      {arr(sections).map((s, i) => (
        <nav key={i} className="uis-navgroup" aria-label={s.label ?? 'Navigation'}>
          {s.label ? <span className="uis-navgroup__label">{s.label}</span> : null}
          {arr(s.items).map((it, j) => (
            <A key={j} link={it} className="uis-navitem">
              <Icon name={it.icon ?? 'grid'} />{it.label}
              {it.badge !== undefined && it.badge !== '' ? <span className="uis-navitem__badge">{it.badge}</span> : null}
            </A>
          ))}
        </nav>
      ))}
      {footer}
      {user ? (
        <div className="uis-sidebar__foot">
          <Avatar size="sm" name={user.name} initials={user.initials} src={user.src} />
          <span className="uis-user"><span className="uis-user__name">{user.name}</span>{user.meta ? <span className="uis-user__meta">{user.meta}</span> : null}</span>
          <IconButton icon="more" label="Account menu" />
        </div>
      ) : null}
    </aside>
  );
}

/* ---------- Rail: icon-only, tooltips on hover ---------- */
export interface AppRailProps extends BaseBackProps {
  footerItems?: NavLink[];
  /** Label of an item whose tooltip is pinned open (for static mockups). */
  tip?: string;
}
const RailItem = ({ it, tip }: { it: NavLink; tip?: string }) => (
  <A link={it} className="uis-railitem" title={it.label}>
    <Icon name={it.icon ?? 'grid'} />
    {it.badge !== undefined && it.badge !== '' ? <span className="uis-dot" /> : null}
    <span className="uis-tooltip" data-show={tip === it.label || undefined}>{it.label}</span>
  </A>
);
export function AppRail({ sections, user, footerItems, tip, className, style }: AppRailProps) {
  return (
    <aside className={cx('uis-rail', className)} style={style} aria-label="Sidebar">
      <div className="uis-rail__head"><Logo variant="mark" size="sm" href="#" /></div>
      {arr(sections).map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <hr className="uis-divider" style={{ width: 28, margin: '6px 0' }} /> : null}
          <nav className="uis-rail__group" aria-label={s.label ?? 'Navigation'}>{arr(s.items).map((it, j) => <RailItem key={j} it={it} tip={tip} />)}</nav>
        </React.Fragment>
      ))}
      <div className="uis-rail__foot">
        {arr(footerItems).map((it, j) => <RailItem key={j} it={it} tip={tip} />)}
        {user ? <Avatar size="sm" name={user.name} initials={user.initials} src={user.src} /> : null}
      </div>
    </aside>
  );
}

/* ---------- Topbar: horizontal app header with tabs ---------- */
export interface AppTopbarProps extends BaseBackProps {
  links?: NavLink[];
  actions?: NavAction[];
  search?: boolean | string;
}
export function AppTopbar({ links, sections, actions, user, search = true, logoPlacement, logoVariant, className, style }: AppTopbarProps) {
  const { brand } = useUIS();
  const placement = usePlacement(logoPlacement);
  const L = links ?? arr(sections).flatMap((s) => arr(s.items)).slice(0, 6);
  const variant = pick(logoVariant, brand.variant === 'stacked' ? 'lockup' : brand.variant);
  const logo = <Logo variant={variant} size="sm" href="#" />;
  const nav = <nav className="uis-topbar__nav" aria-label="Main">{L.map((l, i) => <A key={i} link={l} className="uis-navlink">{l.label}</A>)}</nav>;
  const end = (
    <div className="uis-topbar__end">
      {search ? <Input className="uis-topbar__search" size="sm" icon="search" placeholder={typeof search === 'string' ? search : 'Search'} kbd="⌘K" aria-label="Search" /> : null}
      {arr(actions).map((a, i) => <IconButton key={i} icon={a.icon} label={a.label} count={a.count} dot={a.dot} href={a.href} />)}
      {user ? <Avatar size="sm" name={user.name} initials={user.initials} src={user.src} style={{ marginLeft: 6 }} /> : null}
    </div>
  );
  return (
    <header className={cx('uis-topbar', className)} style={style} data-placement={placement === 'center' ? 'center' : undefined}>
      {placement === 'center' ? <>{nav}{logo}{end}</> : placement === 'right' ? <>{nav}{end}<span style={{ marginLeft: 12 }}>{logo}</span></> : <>{logo}<span className="uis-navsep" />{nav}{end}</>}
    </header>
  );
}

/* ---------- Dock: floating command dock for canvas-style apps ---------- */
export interface AppDockProps extends BaseBackProps {
  items?: NavLink[];
  search?: boolean | string;
  tip?: string;
}
export function AppDock({ items, sections, user, search = true, tip, className, style }: AppDockProps) {
  const I = items ?? arr(sections).flatMap((s) => arr(s.items)).slice(0, 7);
  return (
    <div className={cx('uis-appdocklayer', className)} style={style}>
      <nav className="uis-float uis-appdock" aria-label="Main">
        <Logo variant="mark" size="sm" href="#" style={{ padding: '0 8px' }} />
        <span className="uis-navsep" />
        {I.map((it, i) => <RailItem key={i} it={it} tip={tip} />)}
        {search ? (
          <>
            <span className="uis-navsep" />
            <button type="button" className="uis-appdock__search"><Icon name="search" />{typeof search === 'string' ? search : 'Search'}<span className="uis-kbd">⌘K</span></button>
          </>
        ) : null}
        {user ? <Avatar size="sm" name={user.name} initials={user.initials} src={user.src} style={{ margin: '0 4px' }} /> : null}
      </nav>
    </div>
  );
}

/* ---------- AppShell: pick a backend layout by name ---------- */
export interface AppShellProps extends BaseBackProps {
  variant?: BackNav;
  workspace?: Workspace | null;
  search?: boolean | string;
  actions?: NavAction[];
  footerItems?: NavLink[];
  tip?: string;
  /** Extra content for the slim header used by the dock layout. */
  header?: React.ReactNode;
  children?: React.ReactNode;
}
export function AppShell({ variant, children, header, ...p }: AppShellProps) {
  const { theme } = useUIS();
  const v = pick(variant, theme.config.nav.back);
  const main = <main className="uis-app__main">{children}</main>;
  const cls = cx('uis-app', `uis-app--${v}`, p.className);
  if (v === 'rail') return <div className={cls} style={p.style}><AppRail {...p} className={undefined} style={undefined} />{main}</div>;
  if (v === 'topbar') return <div className={cls} style={p.style}><AppTopbar {...p} className={undefined} style={undefined} />{main}</div>;
  if (v === 'dock') {
    return (
      <div className={cls} style={p.style}>
        <header className="uis-apphead">
          <Logo variant="lockup" size="sm" href="#" />
          {header}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {arr(p.actions).map((a, i) => <IconButton key={i} icon={a.icon} label={a.label} dot={a.dot} count={a.count} />)}
          </div>
        </header>
        {main}
        <AppDock sections={p.sections} user={p.user} search={p.search} tip={p.tip} />
      </div>
    );
  }
  return <div className={cls} style={p.style}><AppSidebar {...p} className={undefined} style={undefined} />{main}</div>;
}

/* ---------- PageHeader ---------- */
export interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: string[];
  actions?: React.ReactNode;
  /** Children render in the actions slot (handy from visual tools). */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export function PageHeader({ title, description, crumbs, actions, children, className, style }: PageHeaderProps) {
  const act = actions ?? children;
  return (
    <div className={cx('uis-pagehead', className)} style={style}>
      <div>
        {crumbs && crumbs.length ? (
          <div className="uis-crumbs">
            {crumbs.map((c, i) => <React.Fragment key={i}>{i > 0 ? <Icon name="chevron-right" /> : null}<a href="#">{c}</a></React.Fragment>)}
          </div>
        ) : null}
        <h1 className="uis-pagehead__title">{title}</h1>
        {description ? <p className="uis-pagehead__desc">{description}</p> : null}
      </div>
      {act ? <div className="uis-pagehead__actions">{act}</div> : null}
    </div>
  );
}
