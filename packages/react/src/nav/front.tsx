import * as React from 'react';
import type { FrontNav, LogoVariant, Placement } from '@ui-system/core';
import { cx, pick, usePlacement, useUIS } from '../context';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { Button, Chips, IconButton, Scrim } from '../primitives';
import { A, arr, type NavAction, type NavCta, type NavLink } from './shared';

interface BaseFrontProps {
  links?: NavLink[];
  actions?: NavAction[];
  cta?: NavCta | null;
  /** Where the logo sits. Defaults to the brand's placement. */
  logoPlacement?: Placement;
  logoVariant?: LogoVariant;
  /** 'image' = sits on photography: light text, transparent where it applies. */
  tone?: 'default' | 'image';
  className?: string;
  style?: React.CSSProperties;
}

const Links = ({ links }: { links: NavLink[] }) => (
  <>{links.map((l, i) => <A key={i} link={l} className="uis-navlink">{l.icon ? <Icon name={l.icon} /> : null}{l.label}</A>)}</>
);
const Actions = ({ actions }: { actions: NavAction[] }) => (
  <>{actions.map((a, i) => <IconButton key={i} icon={a.icon} label={a.label} href={a.href} count={a.count} dot={a.dot} onClick={a.onClick} />)}</>
);
const Cta = ({ cta, size = 'sm', tone }: { cta?: NavCta | null; size?: 'sm' | 'md'; tone?: string }) =>
  cta ? <Button size={size} variant={cta.variant ?? (tone === 'image' ? 'light' : 'primary')} href={cta.href ?? '#'} icon={cta.icon} onClick={cta.onClick}>{cta.label}</Button> : null;

/* ---------- Dock: floating bottom bar, logo at the top of the page ---------- */
export interface NavDockProps extends Omit<BaseFrontProps, 'logoPlacement'> {
  /** Header logo position, 'dock' puts the mark inside the dock, 'none' hides it. */
  logoPlacement?: Placement | 'dock' | 'none';
  /** Show the menu toggle that opens the explore panel. */
  menu?: boolean;
  /** Explore panel open. */
  open?: boolean;
  panelTitle?: string;
  panel?: React.ReactNode;
  fixed?: boolean;
}

export function NavDock({ links, actions, cta, logoPlacement, logoVariant, tone, menu = true, open, panelTitle = 'Explore', panel, fixed, className, style }: NavDockProps) {
  const { brand } = useUIS();
  const placement = pick(logoPlacement, brand.placement as NavDockProps['logoPlacement']);
  const [isOpen, setOpen] = React.useState(!!open);
  React.useEffect(() => setOpen(!!open), [open]);
  const L = arr(links), Ac = arr(actions);
  return (
    <div className={cx('uis-docklayer', className)} style={style} data-fixed={fixed || undefined} data-tone={tone === 'image' ? 'image' : undefined}>
      <div className="uis-docklayer__head" data-placement={placement}>
        {placement !== 'dock' && placement !== 'none' ? <Logo variant={logoVariant} href="#" /> : null}
      </div>
      <div className="uis-dockwrap">
        {isOpen ? (
          <div className="uis-float uis-dock__panel">
            {panel ?? (<><span className="uis-overline">{panelTitle}</span><Chips items={L} /></>)}
          </div>
        ) : null}
        <nav className="uis-float uis-dock" aria-label="Main">
          {menu ? <IconButton icon={isOpen ? 'x' : 'menu'} label={isOpen ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!isOpen)} /> : null}
          {placement === 'dock' ? <Logo variant="mark" size="sm" href="#" style={{ padding: '0 6px' }} /> : null}
          <Links links={L} />
          {Ac.length ? <span className="uis-navsep" /> : null}
          <Actions actions={Ac} />
          <Cta cta={cta} />
        </nav>
      </div>
    </div>
  );
}

/* ---------- Island: detached floating top bar ---------- */
export interface NavIslandProps extends BaseFrontProps { fixed?: boolean; width?: number }
export function NavIsland({ links, actions, cta, logoPlacement, logoVariant, tone, fixed, width, className, style }: NavIslandProps) {
  const placement = usePlacement(logoPlacement);
  const L = arr(links), Ac = arr(actions);
  const logo = <Logo variant={logoVariant === 'stacked' ? 'lockup' : logoVariant} size="sm" href="#" />;
  const end = <><Actions actions={Ac} /><Cta cta={cta} /></>;
  const pad = placement === 'left' ? '6px 6px 6px 18px' : placement === 'right' ? '6px 18px 6px 6px' : '6px';
  return (
    <div className={cx('uis-islandlayer', className)} style={style} data-fixed={fixed || undefined} data-tone={tone === 'image' ? 'image' : undefined}>
      <nav className="uis-float uis-island" aria-label="Main" style={{ padding: pad, width: width ? `min(100%, ${width}px)` : undefined }}>
        {placement === 'left' && <><div>{logo}</div><div><Links links={L} /></div><div>{end}</div></>}
        {placement === 'center' && <><div><Links links={L} /></div><div>{logo}</div><div>{end}</div></>}
        {placement === 'right' && <><div>{end}</div><div><Links links={L} /></div><div>{logo}</div></>}
      </nav>
    </div>
  );
}

/* ---------- Bar: classic full-width top bar ---------- */
export interface NavBarProps extends BaseFrontProps { transparent?: boolean; sticky?: boolean; secondary?: NavCta | null }
export function NavBar({ links, actions, cta, secondary, logoPlacement, logoVariant, tone, transparent, sticky, className, style }: NavBarProps) {
  const placement = usePlacement(logoPlacement);
  const L = arr(links), Ac = arr(actions);
  const imageTone = transparent || tone === 'image';
  const logo = <Logo variant={logoVariant === 'stacked' ? 'lockup' : logoVariant} href="#" />;
  const end = (
    <>
      <Actions actions={Ac} />
      {secondary ? <Button size="sm" variant={imageTone ? 'glass' : 'ghost'} href={secondary.href ?? '#'}>{secondary.label}</Button> : null}
      <Cta cta={cta} tone={imageTone ? 'image' : undefined} />
    </>
  );
  return (
    <header className={cx('uis-bar', className)} style={style} data-transparent={transparent || undefined} data-sticky={sticky || undefined} data-tone={imageTone ? 'image' : undefined}>
      {placement === 'left' && <><div>{logo}</div><nav aria-label="Main"><Links links={L} /></nav><div>{end}</div></>}
      {placement === 'center' && <><nav aria-label="Main"><Links links={L} /></nav><div>{logo}</div><div>{end}</div></>}
      {placement === 'right' && <><nav aria-label="Main"><Links links={L} /></nav><div /><div>{end}{logo}</div></>}
    </header>
  );
}

/* ---------- Stacked: utility row, logo row, link row ---------- */
export interface NavStackedProps extends BaseFrontProps {
  utility?: { text?: string; links?: NavLink[] } | null;
  search?: boolean;
}
export function NavStacked({ links, actions, logoPlacement, logoVariant, utility, search = true, className, style }: NavStackedProps) {
  const placement = usePlacement(logoPlacement);
  const L = arr(links), Ac = arr(actions);
  const logo = <Logo variant={logoVariant} size={placement === 'center' ? 'lg' : 'md'} href="#" />;
  const searchBtn = search ? <Button variant="ghost" size="sm" icon="search">Search</Button> : <span />;
  return (
    <header className={cx('uis-stacked', className)} style={style}>
      {utility ? (
        <div className="uis-stacked__utility">
          <div>{utility.text}</div>
          <div>{arr(utility.links).map((l, i) => <A key={i} link={l} className="">{l.label}</A>)}</div>
        </div>
      ) : null}
      <div className="uis-stacked__main">
        {placement === 'left' && <><div>{logo}</div><div /><div><Actions actions={Ac} /></div></>}
        {placement === 'center' && <><div>{searchBtn}</div><div>{logo}</div><div><Actions actions={Ac} /></div></>}
        {placement === 'right' && <><div>{searchBtn}</div><div /><div><Actions actions={Ac} /><span style={{ width: 12 }} />{logo}</div></>}
      </div>
      <nav className="uis-stacked__links" aria-label="Main"><Links links={L} /></nav>
    </header>
  );
}

/* ---------- Minimal: logo + menu button, full-screen menu ---------- */
export interface NavMinimalProps extends BaseFrontProps {
  open?: boolean;
  menuLabel?: string;
  /** Content for the open menu's side column (contact, address). Children work too. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}
export function NavMinimal({ links, cta, logoPlacement, logoVariant, tone, open, menuLabel = 'Menu', aside, children, className, style }: NavMinimalProps) {
  const placement = usePlacement(logoPlacement);
  const [isOpen, setOpen] = React.useState(!!open);
  React.useEffect(() => setOpen(!!open), [open]);
  const L = arr(links);
  const logo = <Logo variant={logoVariant === 'stacked' ? 'lockup' : logoVariant} href="#" />;
  const menuBtn = (
    <button type="button" className="uis-menubtn" onClick={() => setOpen(!isOpen)} aria-expanded={isOpen}>
      <Icon name={isOpen ? 'x' : 'menu'} />{isOpen ? 'Close' : menuLabel}
    </button>
  );
  return (
    <>
      {isOpen ? (
        <div className="uis-overlaymenu">
          <nav className="uis-overlaymenu__links" aria-label="Main">
            {L.map((l, i) => <A key={i} link={l} className=""><span>{String(i + 1).padStart(2, '0')}</span>{l.label}</A>)}
          </nav>
          <div className="uis-overlaymenu__aside">{aside ?? children}</div>
        </div>
      ) : null}
      <header className={cx('uis-minimal', className)} style={style} data-placement={placement} data-tone={!isOpen && tone === 'image' ? 'image' : undefined}>
        {placement === 'center' ? (
          <><div>{menuBtn}</div>{logo}<div className="uis-minimal__actions"><Cta cta={cta} size="md" tone={!isOpen ? tone : undefined} /></div></>
        ) : (
          <>{logo}<div className="uis-minimal__actions"><Cta cta={cta} size="md" tone={!isOpen ? tone : undefined} />{menuBtn}</div></>
        )}
      </header>
    </>
  );
}

/* ---------- Mobile: top bar + sheet, or bottom tab bar ---------- */
export interface NavMobileProps extends BaseFrontProps {
  variant?: 'sheet' | 'tabbar' | 'floating';
  open?: boolean;
  transparent?: boolean;
}
export function NavMobile({ variant = 'sheet', links, actions, cta, logoPlacement, logoVariant, tone, open, transparent, className, style }: NavMobileProps) {
  const p = usePlacement(logoPlacement);
  const placement = p === 'right' ? 'left' : p;
  const [isOpen, setOpen] = React.useState(!!open);
  React.useEffect(() => setOpen(!!open), [open]);
  const L = arr(links), Ac = arr(actions);
  const logo = <Logo variant={logoVariant === 'stacked' ? 'lockup' : logoVariant} size="sm" href="#" />;
  const menuBtn = variant === 'sheet' ? <IconButton icon="menu" label="Open menu" onClick={() => setOpen(true)} /> : null;
  const imageTone = transparent || tone === 'image';
  return (
    <>
      <header className={cx('uis-mbar', className)} style={style} data-placement={placement} data-transparent={transparent || undefined} data-tone={imageTone ? 'image' : undefined}>
        {placement === 'center' ? (
          <><div>{menuBtn ?? <span />}</div>{logo}<div className="uis-mbar__actions"><Actions actions={Ac} /></div></>
        ) : (
          <>{logo}<div className="uis-mbar__actions"><Actions actions={Ac} />{menuBtn}</div></>
        )}
      </header>
      {variant === 'sheet' && isOpen ? (
        <>
          <Scrim onClick={() => setOpen(false)} />
          <div className="uis-sheet" role="dialog" aria-label="Menu">
            <div className="uis-sheet__handle" />
            {L.map((l, i) => <A key={i} link={l} className="uis-sheet__link">{l.label}<Icon name="chevron-right" /></A>)}
            {cta ? <div className="uis-sheet__foot"><Button block variant={cta.variant ?? 'primary'} href={cta.href ?? '#'}>{cta.label}</Button></div> : null}
          </div>
        </>
      ) : null}
      {variant !== 'sheet' ? (
        <nav className={cx('uis-tabbar', variant === 'floating' && 'uis-tabbar--floating')} aria-label="Main">
          {L.slice(0, 5).map((l, i) => <A key={i} link={l} className="uis-tabbar__item"><Icon name={l.icon ?? 'grid'} />{l.label}</A>)}
        </nav>
      ) : null}
    </>
  );
}

/* ---------- SiteNav: pick a front nav by name (defaults to config.nav.front) ---------- */
export type SiteNavProps = { variant?: FrontNav } & NavDockProps & NavIslandProps & NavBarProps & NavStackedProps & NavMinimalProps;
export function SiteNav({ variant, ...props }: SiteNavProps) {
  const { theme } = useUIS();
  const v = pick(variant, theme.config.nav.front);
  if (v === 'dock') return <NavDock {...props} />;
  if (v === 'bar') return <NavBar {...(props as NavBarProps)} />;
  if (v === 'stacked') return <NavStacked {...(props as NavStackedProps)} />;
  if (v === 'minimal') return <NavMinimal {...(props as NavMinimalProps)} />;
  return <NavIsland {...(props as NavIslandProps)} />;
}
