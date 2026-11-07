import { resolveConfig, type Mode, type UIConfig, type UIConfigInput } from './config';
import { PRESETS } from './presets';
import {
  alpha, bestOn, contrast, hexToOklch, isHex, mix, neutralFrom, scaleFrom, stepWithContrast,
  type NeutralScale, type Scale, type ScaleStep,
} from './color';
import { buildRadius, px, type RadiusTokens } from './radius';
import { googleFontsUrl, resolveType, TYPE_SCALE, type ResolvedType } from './type';

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

/** Roles each seed generates; a pin on one of them was measured against the preset's seed. */
const SEEDS = ['primary', 'accent', 'success', 'warning', 'danger', 'info'] as const;
const NEUTRAL_ROLES = new Set(['bg', 'surface', 'surface-2', 'surface-3', 'line', 'line-strong', 'ink', 'ink-2', 'ink-3', 'inverse', 'inverse-ink', 'scrim', 'float-border', 'search-bg', 'search-border', 'search-border-hover', 'nav-bg']);

/**
 * A preset's pins only hold while its seeds do. When a project changes a seed (primary, accent,
 * neutral…), the preset's own pins on that seed's roles are dropped so the engine derives them
 * again (a cream primary must not keep white text). Pins the project wrote itself always stay.
 */
function activePins(config: UIConfig, pins: Partial<Record<string, string>>, key: 'pin' | 'pinDark'): Partial<Record<string, string>> {
  const preset = config.preset ? PRESETS[config.preset] : undefined;
  const pc = preset?.config.color;
  if (!pc) return pins;
  const same = (a?: string, b?: string) => (a ?? '').toLowerCase() === (b ?? '').toLowerCase();
  const changed = SEEDS.filter((s) => pc[s] !== undefined && !same(config.color[s], pc[s]));
  const neutralChanged = pc.neutral !== undefined && !same(config.color.neutral, pc.neutral);
  const presetPins = (pc[key] ?? {}) as Record<string, string | undefined>;
  const out: Partial<Record<string, string>> = {};
  for (const [k, val] of Object.entries(pins)) {
    const reseeded = changed.some((s) => k === s || k.startsWith(`${s}-`)) || (neutralChanged && NEUTRAL_ROLES.has(k));
    if (reseeded && same(val, presetPins[k])) continue;
    out[k] = val;
  }
  return out;
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

  const pins = { light: activePins(config, c.pin ?? {}, 'pin'), dark: activePins(config, c.pinDark ?? {}, 'pinDark') };
  const wordmarkSeed = isHex(config.brand.wordmarkColor) ? safe(config.brand.wordmarkColor, '#000000') : undefined;

  const build = (mode: Mode): Vars => {
    const dark = mode === 'dark';
    // Pins are exact values per mode; anything unpinned is derived from the scales.
    const pin: Partial<Record<string, string>> = pins[mode];
    const v: Vars = {};
    const set = (k: string, value: string) => {
      const p = pin[k];
      if (p !== undefined && !(isHex(p) || p === 'transparent' || /^rgba?\(/.test(p))) throw new Error(`color.${dark ? 'pinDark' : 'pin'}: "${k}" must be a hex, rgb()/rgba() or transparent, got "${p}"`);
      v[k] = p ?? value;
    };
    set('bg', dark ? n[975] : n[25]);
    set('surface', dark ? n[950] : n[0]);
    const bg = v.bg, surface = v.surface;
    set('surface-2', dark ? n[900] : n[50]);
    set('surface-3', dark ? n[800] : n[100]);
    set('line', dark ? n[800] : n[200]);
    set('line-strong', dark ? n[700] : n[300]);
    set('ink', dark ? n[50] : n[950]);
    set('ink-2', dark ? n[300] : n[700]);
    set('ink-3', dark ? n[400] : n[600]);
    set('inverse', dark ? n[50] : n[950]);
    set('inverse-ink', dark ? n[950] : n[25]);
    set('on-image', n[0]);
    set('scrim', alpha(n[975], dark ? 0.62 : 0.42));
    set('image-scrim', `linear-gradient(180deg, ${alpha(n[975], 0.55)} 0%, ${alpha(n[975], 0.35)} 45%, ${alpha(n[975], 0.75)} 100%)`);
    const roles = { primary: scales.primary, accent: scales.accent, success: scales.success, warning: scales.warning, danger: scales.danger, info: scales.info };
    const seeds: Record<string, string> = { primary: primarySeed, accent: accentSeed, success: safe(c.success, '#1E8E4E'), warning: safe(c.warning, '#C27803'), danger: safe(c.danger, '#D0342C'), info: safe(c.info, '#2F6BD8') };
    for (const [name, scale] of Object.entries(roles)) {
      const r = role(seeds[name], scale as Scale & { anchor: ScaleStep }, bg, surface, white, black, mode);
      set(name, r.base);
      set(`${name}-hover`, r.hover);
      set(`${name}-ink`, r.ink);
      set(`${name}-soft`, r.soft);
      set(`${name}-soft-ink`, r.softInk);
      set(`${name}-text`, r.text);
    }
    set('focus', v['accent-text']);
    set('focus-field', v.focus);
    set('focus-ring', alpha(v.focus, 0.35));
    const glass = config.surface.float === 'glass';
    set('float-bg', glass ? alpha(dark ? n[900] : n[0], dark ? 0.6 : 0.72) : dark ? n[900] : n[0]);
    set('float-border', glass ? alpha(n[0], dark ? 0.12 : 0.55) : dark ? n[800] : n[200]);
    set('card-border', config.surface.border === 'none' ? 'transparent' : v.line);
    set('search-bg', v.surface);
    set('search-border', v['line-strong']);
    set('search-border-hover', v['ink-3']);
    // App side navigation: panel, active item fill and text, and the start bar (transparent = none).
    set('nav-bg', v.surface);
    set('nav-active-bg', v['primary-soft']);
    set('nav-active-ink', v['primary-soft-ink']);
    set('nav-active-bar', 'transparent');
    const ws = wordmarkSeed && scaleFrom(wordmarkSeed);
    set('wordmark', !ws ? 'currentColor' : dark ? stepWithContrast(ws, bg, 4.5, ws.anchor, -1) : wordmarkSeed!);
    for (const k of Object.keys(pin)) if (!(k in v)) throw new Error(`color.${dark ? 'pinDark' : 'pin'}: unknown role "${k}"`);
    const sh = shadows(config.surface.shadow, n[975], mode);
    if (!dark) for (const [k, val] of Object.entries(config.surface.shadows ?? {})) if (val) sh[`shadow-${k}`] = val;
    Object.assign(v, sh);
    return v;
  };

  const radius = buildRadius(config.radius);
  const type = resolveType(config.type);
  const d = { ...(DENSITY[config.density] ?? DENSITY.comfortable), ...config.sizes };
  const tm = config.motion.timing ?? {};
  const btn = type.button;
  const heading = type.headings === 'display';
  const pxOr = (n: number | undefined, fallback: number) => `${typeof n === 'number' && Number.isFinite(n) ? n : fallback}px`;
  const ms = (n: number | undefined, fallback: number) => `${typeof n === 'number' && Number.isFinite(n) ? n : fallback}ms`;
  const glass = config.surface.float === 'glass';

  const shared: Vars = {
    'r-chip': px(radius.chip),
    'r-control': px(radius.control),
    'r-field': px(radius.field),
    'r-search': px(radius.search),
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
    'display-case': type.displayCase,
    'display-stretch': type.displayStretch,
    'heading-font': heading ? type.stacks.display : type.stacks.body,
    'heading-weight': heading ? String(type.displayWeight) : String(TYPE_SCALE.h1[2]),
    'heading-case': heading ? type.displayCase : 'none',
    'heading-stretch': heading ? type.displayStretch : '100%',
    'h1-tracking': heading ? type.displayTracking : TYPE_SCALE.h1[3],
    'h2-tracking': heading ? type.displayTracking : TYPE_SCALE.h2[3],
    'h3-tracking': heading ? type.displayTracking : TYPE_SCALE.h3[3],
    'btn-case': type.buttonCase === 'upper' ? 'uppercase' : 'none',
    'btn-tracking': btn ? btn.tracking : type.buttonCase === 'upper' ? '0.06em' : '0',
    'btn-size': btn ? `${btn.size}px` : type.buttonCase === 'upper' ? '12.5px' : '14px',
    'btn-font': btn?.font === 'display' ? type.stacks.display : type.stacks.body,
    'btn-weight': String(btn?.weight ?? 600),
    'btn-stretch': btn?.stretch ?? '100%',
    'wordmark-case': config.brand.wordmarkCase === 'upper' ? 'uppercase' : 'none',
    'wordmark-tracking': type.wordmark?.tracking ?? (config.brand.wordmarkCase === 'upper' ? '0.12em' : '-0.02em'),
    'wordmark-font': config.brand.wordmarkFont === 'body' ? type.stacks.body : type.stacks.display,
    'wordmark-weight': String(type.wordmark?.weight ?? 650),
    'wordmark-stretch': type.wordmark?.stretch ?? '100%',
    'focus-ring-width': pxOr(config.sizes?.ring, 4),
    'check-border': pxOr(config.sizes?.check, 1.5),
    'h-sm': pxOr(d.sm, DENSITY.comfortable.sm),
    'h-md': pxOr(d.md, DENSITY.comfortable.md),
    'h-lg': pxOr(d.lg, DENSITY.comfortable.lg),
    'pad-card': pxOr(d.pad, DENSITY.comfortable.pad),
    gap: pxOr(d.gap, DENSITY.comfortable.gap),
    'float-blur': glass ? 'blur(20px) saturate(180%)' : 'none',
    'ease-out': tm.easeOut || 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-in-out': tm.easeInOut || 'cubic-bezier(0.4, 0, 0.2, 1)',
    'dur-fast': ms(tm.fast, 160),
    dur: ms(tm.base, 280),
    'dur-slow': ms(tm.slow, 500),
    press: tm.press || 'translateY(1px)',
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

/** Text-on-background pairs the engine promises at 4.5:1 (WCAG AA body text). */
export const TEXT_PAIRS: Array<[fg: string, bg: string]> = [
  ...['ink', 'ink-2', 'ink-3'].flatMap((fg) => ['bg', 'surface', 'surface-2'].map((bg) => [fg, bg] as [string, string])),
  ['ink', 'surface-3'],
  ['ink-3', 'surface-3'],
  ['ink-3', 'search-bg'],
  ['inverse-ink', 'inverse'],
  ['ink-2', 'nav-bg'],
  ['ink-3', 'nav-bg'],
  ['ink-3', 'nav-active-bg'],
  ['nav-active-ink', 'nav-active-bg'],
  ...['primary', 'accent', 'success', 'warning', 'danger', 'info'].flatMap((r) => [
    [`${r}-ink`, r], [`${r}-soft-ink`, `${r}-soft`], [`${r}-text`, 'bg'],
  ] as Array<[string, string]>),
];

export interface ContrastCheck { mode: Mode; fg: string; bg: string; ratio: number; pass: boolean }

/** Every TEXT_PAIRS check in both modes. Gate with `.filter((c) => !c.pass)`. */
export function contrastReport(theme: Theme, target = 4.5): ContrastCheck[] {
  const out: ContrastCheck[] = [];
  for (const mode of ['light', 'dark'] as Mode[]) {
    const v = theme.colors[mode];
    for (const [fg, bg] of TEXT_PAIRS) {
      const ratio = Math.round(contrast(v[fg], v[bg]) * 100) / 100;
      out.push({ mode, fg, bg, ratio, pass: ratio >= target });
    }
  }
  return out;
}
