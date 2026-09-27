import { resolveConfig, type Mode, type UIConfig, type UIConfigInput } from './config';
import {
  alpha, bestOn, contrast, hexToOklch, isHex, mix, neutralFrom, scaleFrom, stepWithContrast,
  type NeutralScale, type Scale, type ScaleStep,
} from './color';
import { buildRadius, px, type RadiusTokens } from './radius';
import { googleFontsUrl, resolveType, type ResolvedType } from './type';

export type Vars = Record<string, string>;

export interface Theme {
  config: UIConfig;
  scales: { primary: Scale; accent: Scale; neutral: NeutralScale; success: Scale; warning: Scale; danger: Scale; info: Scale };
  colors: Record<Mode, Vars>;
  radius: RadiusTokens;
  type: ResolvedType;
  fontsUrl: string;
  /** Mode-independent CSS variables (radius, fonts, density, motion). */
  shared: Vars;
  /** Full variable set for a mode, ready for a style attribute or :root. */
  vars(mode?: Mode): Vars;
}

const safe = (hex: string | undefined, fallback: string) => (isHex(hex) ? (hex!.startsWith('#') ? hex! : `#${hex}`) : fallback);

interface RoleColors { base: string; hover: string; ink: string; soft: string; softInk: string; text: string }

function role(seed: string, scale: Scale & { anchor: ScaleStep }, bg: string, surface: string, white: string, black: string, mode: Mode): RoleColors {
  const dark = mode === 'dark';
  const seedLch = hexToOklch(seed);
  // An ink-like primary (near black, near grey) inverts in dark mode instead of turning muddy grey.
  const inkLike = seedLch.c < 0.04 && seedLch.l < 0.4;
  const base = !dark || contrast(seed, bg) >= 3 ? seed : inkLike ? scale[100] : stepWithContrast(scale, bg, 3, scale.anchor, -1);
  const L = hexToOklch(base).l;
  const hover = dark
    ? mix(base, L > 0.85 ? black : white, 0.14)
    : mix(base, L < 0.32 ? white : black, 0.14);
  const ink = bestOn(base, [white, black]);
  const soft = dark ? mix(bg, base, 0.2) : mix(surface, base, 0.11);
  const text = dark
    ? stepWithContrast(scale, bg, 4.5, scale.anchor, -1)
    : stepWithContrast(scale, bg, 4.5, scale.anchor, 1);
  const softInk = dark
    ? stepWithContrast(scale, soft, 6, 200, -1)
    : stepWithContrast(scale, soft, 6, 800, 1);
  return { base, hover, ink, soft, softInk, text };
}

const DENSITY = {
  compact: { sm: 32, md: 38, lg: 46, pad: 16, gap: 12 },
  comfortable: { sm: 36, md: 44, lg: 52, pad: 24, gap: 16 },
  spacious: { sm: 40, md: 48, lg: 56, pad: 32, gap: 20 },
};

const SHADOW_K = { none: 0, soft: 0.6, medium: 1, deep: 1.6 };

function shadows(depth: keyof typeof SHADOW_K, tint: string, mode: Mode): Vars {
  const k = SHADOW_K[depth] * (mode === 'dark' ? 2.2 : 1);
  const c = mode === 'dark' ? '#000000' : tint;
  const a = (n: number) => alpha(c, Math.min(0.8, n * k));
  if (k === 0) return { 'shadow-sm': 'none', 'shadow-md': 'none', 'shadow-lg': 'none', 'shadow-float': 'none' };
  return {
    'shadow-sm': `0 1px 2px ${a(0.07)}`,
    'shadow-md': `0 10px 24px -8px ${a(0.16)}, 0 2px 6px ${a(0.06)}`,
    'shadow-lg': `0 28px 56px -16px ${a(0.28)}, 0 10px 20px -10px ${a(0.12)}`,
    'shadow-float': `0 18px 40px -10px ${a(0.3)}, 0 4px 10px -4px ${a(0.1)}`,
  };
}

export function buildTheme(input?: UIConfigInput | UIConfig): Theme {
  const config = resolveConfig(input as UIConfigInput);
  const c = config.color;
  const primarySeed = safe(c.primary, '#1C1B19');
  const accentSeed = safe(c.accent, '#E0562B');
  const neutralSeed = c.neutral === 'auto' ? primarySeed : safe(c.neutral, '#77736B');

  const scales = {
    primary: scaleFrom(primarySeed),
    accent: scaleFrom(accentSeed),
    neutral: neutralFrom(neutralSeed),
    success: scaleFrom(safe(c.success, '#1E8E4E')),
    warning: scaleFrom(safe(c.warning, '#C27803')),
    danger: scaleFrom(safe(c.danger, '#D0342C')),
    info: scaleFrom(safe(c.info, '#2F6BD8')),
  };
  const n = scales.neutral;
  const white = n[0], black = n[975];

  const build = (mode: Mode): Vars => {
    const dark = mode === 'dark';
    const bg = dark ? n[975] : n[25];
    const surface = dark ? n[950] : n[0];
    const v: Vars = {
      bg, surface,
      'surface-2': dark ? n[900] : n[50],
      'surface-3': dark ? n[800] : n[100],
      line: dark ? n[800] : n[200],
      'line-strong': dark ? n[700] : n[300],
      ink: dark ? n[50] : n[950],
      'ink-2': dark ? n[300] : n[700],
      'ink-3': dark ? n[400] : n[600],
      inverse: dark ? n[50] : n[950],
      'inverse-ink': dark ? n[950] : n[25],
      'on-image': n[0],
      scrim: alpha(n[975], dark ? 0.62 : 0.42),
      'image-scrim': `linear-gradient(180deg, ${alpha(n[975], 0.55)} 0%, ${alpha(n[975], 0.35)} 45%, ${alpha(n[975], 0.75)} 100%)`,
    };
    const roles = { primary: scales.primary, accent: scales.accent, success: scales.success, warning: scales.warning, danger: scales.danger, info: scales.info };
    const seeds: Record<string, string> = { primary: primarySeed, accent: accentSeed, success: safe(c.success, '#1E8E4E'), warning: safe(c.warning, '#C27803'), danger: safe(c.danger, '#D0342C'), info: safe(c.info, '#2F6BD8') };
    for (const [name, scale] of Object.entries(roles)) {
      const r = role(seeds[name], scale as Scale & { anchor: ScaleStep }, bg, surface, white, black, mode);
      v[name] = r.base;
      v[`${name}-hover`] = r.hover;
      v[`${name}-ink`] = r.ink;
      v[`${name}-soft`] = r.soft;
      v[`${name}-soft-ink`] = r.softInk;
      v[`${name}-text`] = r.text;
    }
    v.focus = v['accent-text'];
    v['focus-ring'] = alpha(v['accent-text'], 0.35);
    const glass = config.surface.float === 'glass';
    v['float-bg'] = glass ? alpha(dark ? n[900] : n[0], dark ? 0.6 : 0.72) : dark ? n[900] : n[0];
    v['float-border'] = glass ? alpha(n[0], dark ? 0.12 : 0.55) : dark ? n[800] : n[200];
    v['card-border'] = config.surface.border === 'none' ? 'transparent' : v.line;
    Object.assign(v, shadows(config.surface.shadow, n[975], mode));
    return v;
  };

  const radius = buildRadius(config.radius);
  const type = resolveType(config.type);
  const d = DENSITY[config.density] ?? DENSITY.comfortable;
  const glass = config.surface.float === 'glass';

  const shared: Vars = {
    'r-chip': px(radius.chip),
    'r-control': px(radius.control),
    'r-field': px(radius.field),
    'r-card': px(radius.card),
    'r-panel': px(radius.panel),
    'r-media': px(radius.media),
    'r-shell': px(radius.shell),
    'r-avatar': radius.avatar,
    'r-inner': px(radius.inner),
    'font-display': type.stacks.display,
    'font-body': type.stacks.body,
    'font-mono': type.stacks.mono,
    'display-weight': String(type.displayWeight),
    'display-tracking': type.displayTracking,
    'btn-case': type.buttonCase === 'upper' ? 'uppercase' : 'none',
    'btn-tracking': type.buttonCase === 'upper' ? '0.06em' : '0',
    'btn-size': type.buttonCase === 'upper' ? '12.5px' : '14px',
    'wordmark-case': config.brand.wordmarkCase === 'upper' ? 'uppercase' : 'none',
    'wordmark-tracking': config.brand.wordmarkCase === 'upper' ? '0.12em' : '-0.02em',
    'wordmark-font': config.brand.wordmarkFont === 'body' ? type.stacks.body : type.stacks.display,
    'h-sm': `${d.sm}px`,
    'h-md': `${d.md}px`,
    'h-lg': `${d.lg}px`,
    'pad-card': `${d.pad}px`,
    gap: `${d.gap}px`,
    'float-blur': glass ? 'blur(20px) saturate(180%)' : 'none',
    'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    'dur-fast': '160ms',
    dur: '280ms',
    'dur-slow': '500ms',
  };

  const scaleVars: Vars = {};
  for (const [name, scale] of Object.entries(scales)) {
    for (const [step, hex] of Object.entries(scale)) {
      if (step === 'anchor') continue;
      scaleVars[`${name}-${step}`] = hex as string;
    }
  }

  const colors = { light: build('light'), dark: build('dark') };
  const fontsUrl = googleFontsUrl([type.display, type.body, type.mono]);

  return {
    config, scales, colors, radius, type, fontsUrl, shared,
    vars(mode = config.color.mode) {
      const out: Vars = {};
      const all = { ...scaleVars, ...shared, ...colors[mode] };
      for (const [k, val] of Object.entries(all)) out[`--uis-${k}`] = val;
      return out;
    },
  };
}
