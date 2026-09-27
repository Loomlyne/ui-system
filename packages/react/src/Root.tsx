import * as React from 'react';
import {
  buildTheme, resolveConfig,
  type AvatarStyle, type BackNav, type Density, type MotionIntensity, type FloatSurface, type FontPresetId, type FrontNav, type LogoMark, type LogoVariant,
  type Mode, type Placement, type ShadowDepth, type UIConfigInput,
} from '@ui-system/core';
import { UISContext, cx } from './context';

/**
 * Flat props mirror ui.config.json so the same component works from code
 * (pass `config`) and from visual tools like Claude Design (pass attributes).
 * Flat props win over `config`.
 */
export interface RootProps {
  config?: UIConfigInput;
  // color
  primary?: string;
  accent?: string;
  neutral?: string;
  mode?: Mode;
  // shape
  roundness?: number;
  pill?: boolean;
  // type
  fontPreset?: FontPresetId;
  displayFont?: string;
  bodyFont?: string;
  buttonCase?: 'normal' | 'upper';
  // feel
  density?: Density;
  surface?: FloatSurface;
  shadow?: ShadowDepth;
  border?: 'hairline' | 'none';
  // brand
  projectName?: string;
  wordmark?: string;
  caption?: string;
  initials?: string;
  logoMark?: LogoMark;
  logoVariant?: LogoVariant;
  logoPlacement?: Placement;
  logoSrc?: string;
  markSrc?: string;
  markSvg?: string;
  wordmarkCase?: 'normal' | 'upper';
  wordmarkFont?: 'display' | 'body';
  markTone?: 'current' | 'primary';
  // people and motion
  avatarStyle?: AvatarStyle;
  motion?: boolean;
  motionIntensity?: MotionIntensity;
  // nav defaults
  frontNav?: FrontNav;
  backNav?: BackNav;
  // rendering
  /** Inject the Google Fonts stylesheet for the active fonts. Default true. */
  loadFonts?: boolean;
  /** Paint the page background and text color. Default true. */
  page?: boolean;
  /**
   * Write the theme's CSS variables on this element. Default true. Set false
   * when a stylesheet already provides them (theme.css, or the Claude Design
   * tokens.css bridge) and Root should only supply brand context and fonts.
   */
  vars?: boolean;
  /** Stretch to the parent's height. */
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const def = <T,>(v: T | undefined | null | '') => (v === undefined || v === null || v === '' ? undefined : v);

export function configFromProps(p: RootProps): UIConfigInput {
  const base = p.config ?? {};
  return {
    ...base,
    name: def(p.projectName) ?? base.name,
    brand: {
      ...base.brand,
      wordmark: def(p.wordmark) ?? base.brand?.wordmark,
      caption: p.caption !== undefined && p.caption !== null ? p.caption : base.brand?.caption,
      initials: def(p.initials) ?? base.brand?.initials,
      mark: def(p.logoMark) ?? base.brand?.mark,
      variant: def(p.logoVariant) ?? base.brand?.variant,
      placement: def(p.logoPlacement) ?? base.brand?.placement,
      logoSrc: def(p.logoSrc) ?? base.brand?.logoSrc,
      markSrc: def(p.markSrc) ?? base.brand?.markSrc,
      markSvg: def(p.markSvg) ?? base.brand?.markSvg,
      wordmarkCase: def(p.wordmarkCase) ?? base.brand?.wordmarkCase,
      wordmarkFont: def(p.wordmarkFont) ?? base.brand?.wordmarkFont,
      markTone: def(p.markTone) ?? base.brand?.markTone,
    },
    color: {
      ...base.color,
      primary: def(p.primary) ?? base.color?.primary,
      accent: def(p.accent) ?? base.color?.accent,
      neutral: def(p.neutral) ?? base.color?.neutral,
      mode: def(p.mode) ?? base.color?.mode,
    },
    radius: {
      ...base.radius,
      roundness: typeof p.roundness === 'number' ? p.roundness : p.roundness !== undefined ? Number(p.roundness) : base.radius?.roundness,
      pill: typeof p.pill === 'boolean' ? p.pill : p.pill !== undefined ? String(p.pill) === 'true' : base.radius?.pill,
    },
    type: {
      ...base.type,
      preset: def(p.fontPreset) ?? base.type?.preset,
      display: def(p.displayFont) ?? base.type?.display,
      body: def(p.bodyFont) ?? base.type?.body,
      buttonCase: def(p.buttonCase) ?? base.type?.buttonCase,
    },
    density: def(p.density) ?? base.density,
    surface: {
      ...base.surface,
      float: def(p.surface) ?? base.surface?.float,
      shadow: def(p.shadow) ?? base.surface?.shadow,
      border: def(p.border) ?? base.surface?.border,
    },
    nav: { ...base.nav, front: def(p.frontNav) ?? base.nav?.front, back: def(p.backNav) ?? base.nav?.back },
    avatars: { ...base.avatars, style: def(p.avatarStyle) ?? base.avatars?.style },
    motion: {
      ...base.motion,
      enabled: typeof p.motion === 'boolean' ? p.motion : p.motion !== undefined ? String(p.motion) === 'true' : base.motion?.enabled,
      intensity: def(p.motionIntensity) ?? base.motion?.intensity,
    },
  };
}

function useFonts(url: string, enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;
    const exists = Array.from(document.querySelectorAll('link[data-uis-fonts]')).some((l) => (l as HTMLLinkElement).href === url);
    if (exists) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('data-uis-fonts', '');
    document.head.appendChild(link);
  }, [url, enabled]);
}

/** Theme provider. Computes every variable from the config and scopes it to this subtree. */
export function Root(props: RootProps) {
  const input = configFromProps(props);
  const key = JSON.stringify(input);
  const theme = React.useMemo(() => buildTheme(resolveConfig(input)), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const mode = theme.config.color.mode;
  useFonts(theme.fontsUrl, props.loadFonts !== false);
  const ctx = React.useMemo(() => ({ theme, brand: theme.config.brand }), [theme]);
  const style: React.CSSProperties = {
    ...(props.vars === false ? null : (theme.vars(mode) as React.CSSProperties)),
    ...(props.fill ? { height: '100%' } : null),
    ...(props.page !== false ? { background: 'var(--uis-bg)', color: 'var(--uis-ink)' } : null),
    colorScheme: mode,
    ...props.style,
  };
  return (
    <UISContext.Provider value={ctx}>
      <div className={cx('uis', props.className)} data-uis-mode={props.vars === false ? undefined : mode} style={style}>
        {props.children}
      </div>
    </UISContext.Provider>
  );
}
