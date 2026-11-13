/**
 * The one file you edit per project. Every value is optional: anything you
 * leave out falls back to DEFAULT_CONFIG, a deliberately neutral starting
 * point with no brand baked in.
 */

import { PRESETS } from './presets';

export type Mode = 'light' | 'dark';
export type LogoVariant = 'lockup' | 'stacked' | 'mark' | 'wordmark';
export type LogoMark = 'monogram' | 'ring' | 'spark' | 'stack' | 'orbit' | 'none' | 'custom';
export type Placement = 'left' | 'center' | 'right';
export type FontPresetId = 'modern' | 'geometric' | 'editorial' | 'grotesk' | 'humanist' | 'classic' | 'retail';
/**
 * Presets are ways of designing, not products (see presets.ts): `ledger` is round and clean,
 * `atelier` is sharp and editorial. Opt-in: the defaults never change.
 */
export type PresetId = 'atelier' | 'ledger';
/** Old preset names that still resolve. `retail-editorial` was renamed `atelier` on 2026-11-09. */
export type LegacyPresetId = 'retail-editorial';
export const PRESET_ALIASES: Record<LegacyPresetId, PresetId> = { 'retail-editorial': 'atelier' };
/** What you build, picked separately from the preset: it brings a page set and the questions to ask (see kinds.ts). */
export type KindId = 'shop' | 'app' | 'website' | 'booking' | 'portfolio';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type FloatSurface = 'solid' | 'glass';
export type ShadowDepth = 'none' | 'soft' | 'medium' | 'deep';
export type FrontNav = 'dock' | 'island' | 'bar' | 'stacked' | 'minimal';
export type BackNav = 'sidebar' | 'rail' | 'inset' | 'topbar' | 'dock';
export type AvatarStyle = 'notionists-neutral' | 'lorelei-neutral' | 'thumbs' | 'glass' | 'shapes' | 'initials';
export type MotionIntensity = 'subtle' | 'expressive';
export type RadiusRole = 'chip' | 'control' | 'field' | 'search' | 'card' | 'panel' | 'media' | 'shell';
export type SizeKey = 'sm' | 'md' | 'lg' | 'pad' | 'gap' | 'ring' | 'check' | 'hint';
export type ShadowKey = 'sm' | 'md' | 'lg' | 'float';

export interface BrandConfig {
  /** Text of the wordmark. */
  wordmark: string;
  /** Small line under or beside the wordmark (city, product line, tagline). Empty hides it. */
  caption: string;
  /** Letters used by the monogram mark. Defaults to the wordmark's first letter. */
  initials?: string;
  /** Generated mark shape, or 'custom' to use markSrc / markSvg. */
  mark: LogoMark;
  /** Full logo image (SVG/PNG URL). When set it replaces the generated lockup. */
  logoSrc?: string;
  /** Mark-only image (SVG/PNG URL) used for 'mark' variant, rails and favicons. */
  markSrc?: string;
  /** Inline SVG markup for a custom mark. Use currentColor so it recolors. */
  markSvg?: string;
  /** Which arrangement to show by default. */
  variant: LogoVariant;
  /** Default logo position inside navigation. */
  placement: Placement;
  /** Wordmark letter case. */
  wordmarkCase: 'normal' | 'upper';
  /** Wordmark typeface. */
  wordmarkFont: 'display' | 'body';
  /** Mark color: follow the text color, or the brand primary. */
  markTone: 'current' | 'primary';
  /** Wordmark color (hex). Unset follows the text color. Dark mode derives a 4.5:1 step from its scale. */
  wordmarkColor?: string;
}

export interface ColorConfig {
  /** Main brand color: primary buttons, active states, links. */
  primary: string;
  /** Secondary highlight: badges, focus accents, charts. */
  accent: string;
  /** Tint for every grey. 'auto' borrows the primary's hue. */
  neutral: string | 'auto';
  success: string;
  warning: string;
  danger: string;
  info: string;
  /** Which mode Root renders by default. */
  mode: Mode;
  /**
   * Pin exact light-mode values on generated roles, e.g. { "line": "#E5E2DE" }.
   * Keys are the role names without --uis- (bg, ink-2, primary-hover, focus, search-bg…).
   * Text pairs are checked by contrastReport().
   */
  pin?: Partial<Record<string, string>>;
  /** Same as `pin`, for dark mode. Unpinned dark roles are derived from the scales. */
  pinDark?: Partial<Record<string, string>>;
}

export interface RadiusConfig {
  /** 0 = razor sharp, 100 = fully rounded. Scales every radius role together. */
  roundness: number;
  /** Buttons, chips, inputs and nav shells become full pills regardless of roundness. */
  pill: boolean;
  /** Pin any single role (or avatar) to an exact px value; 999 means a full pill or circle. */
  overrides?: Partial<Record<RadiusRole | 'avatar', number>>;
}

export interface TypeConfig {
  preset: FontPresetId;
  /** Override any family from the preset with a Google Fonts family name. */
  display?: string;
  body?: string;
  mono?: string;
  /** Button and label letter case. */
  buttonCase: 'normal' | 'upper';
}

export interface SurfaceConfig {
  /** Floating navs, docks and popovers: opaque or frosted glass. */
  float: FloatSurface;
  shadow: ShadowDepth;
  /** Hairline borders on cards and panels. */
  border: 'hairline' | 'none';
  /** Pin exact light-mode shadows (CSS box-shadow, rgba colors). Dark mode follows `shadow`. */
  shadows?: Partial<Record<ShadowKey, string>>;
}

export interface NavConfig {
  front: FrontNav;
  back: BackNav;
}

export interface AvatarConfig {
  /** DiceBear style for people without a photo (all CC0). 'initials' uses themed letters instead. */
  style: AvatarStyle;
}

export interface MotionConfig {
  /** Entrance and interaction animations (anime.js). Always off under prefers-reduced-motion. */
  enabled: boolean;
  intensity: MotionIntensity;
  /** Pin durations (ms), easings and the press effect. Unset keys keep the engine values. */
  timing?: MotionTiming;
}

export interface MotionTiming {
  fast?: number;
  base?: number;
  slow?: number;
  easeOut?: string;
  easeInOut?: string;
  /** Transform on :active for buttons, e.g. "scale(0.96)". */
  press?: string;
}

export interface UIConfig {
  /** Project name, used by exports and docs. */
  name: string;
  /** Start from a preset (a way of designing); every key below still wins over it. Old names resolve through PRESET_ALIASES. */
  preset?: PresetId | LegacyPresetId;
  /** What you build: shop, app, website, booking or portfolio. Sets no values; tools read it for the page set and questions. */
  kind?: KindId;
  brand: BrandConfig;
  color: ColorConfig;
  radius: RadiusConfig;
  type: TypeConfig;
  density: Density;
  /** Pin control heights, card padding/gap, field focus ring width and checkbox edge width in px over the density values. */
  sizes?: Partial<Record<SizeKey, number>>;
  /** Spacing scale in px for token exports. Default 4 8 12 16 20 24 32 40 48 64 80 96. */
  space?: number[];
  surface: SurfaceConfig;
  nav: NavConfig;
  avatars: AvatarConfig;
  motion: MotionConfig;
}

export interface Preset {
  id: PresetId;
  /** The code name, shown as the label. */
  label: string;
  /** How it looks and feels, in one or two sentences. */
  note: string;
  /** Products that use this preset as their base (examples only; they may override anything). */
  seenIn: string[];
  /** Rules to keep while designing in this preset. */
  rules: string[];
  /** What never to do in this preset. */
  never: string[];
  /** Questions this preset asks before any design. */
  questions: string[];
  /** Where each value came from. */
  source: string;
  config: UIConfigInput;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type UIConfigInput = DeepPartial<UIConfig>;

export const DEFAULT_CONFIG: UIConfig = {
  name: 'New Project',
  brand: {
    wordmark: 'Brand',
    caption: '',
    mark: 'monogram',
    variant: 'lockup',
    placement: 'left',
    wordmarkCase: 'normal',
    wordmarkFont: 'display',
    markTone: 'current',
  },
  color: {
    primary: '#1C1B19',
    accent: '#E0562B',
    neutral: '#77736B',
    success: '#1E8E4E',
    warning: '#C27803',
    danger: '#D0342C',
    info: '#2F6BD8',
    mode: 'light',
  },
  radius: { roundness: 60, pill: false },
  type: { preset: 'modern', buttonCase: 'normal' },
  density: 'comfortable',
  surface: { float: 'solid', shadow: 'medium', border: 'hairline' },
  nav: { front: 'island', back: 'sidebar' },
  avatars: { style: 'notionists-neutral' },
  motion: { enabled: true, intensity: 'subtle' },
};

/** Named starting points for shape. Pick one, then fine-tune roundness. */
export const RADIUS_PRESETS: Record<string, Pick<RadiusConfig, 'roundness' | 'pill'>> = {
  sharp: { roundness: 0, pill: false },
  crisp: { roundness: 25, pill: false },
  soft: { roundness: 50, pill: false },
  rounded: { roundness: 75, pill: false },
  round: { roundness: 90, pill: true },
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

function merge<T>(base: T, patch: unknown): T {
  if (!isObj(patch)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === null) continue;
    out[k] = isObj(v) && isObj(out[k]) ? merge(out[k], v) : v;
  }
  return out as T;
}

/** Fill a partial config with defaults, then the named preset, then the input. Safe to call on user JSON. */
export function resolveConfig(input?: UIConfigInput): UIConfig {
  const id = presetId(input?.preset);
  const out = merge(merge(DEFAULT_CONFIG, id ? PRESETS[id].config : undefined), input ?? {});
  // A font preset the input picks wins over the preset's own display/body fonts (fonts the input names still win).
  const t = input?.type;
  if (t?.preset) {
    if (t.display === undefined) delete out.type.display;
    if (t.body === undefined) delete out.type.body;
  }
  if (id) out.preset = id;
  else delete out.preset;
  return out;
}

/** The current id for a preset name (old names map through PRESET_ALIASES); undefined when unknown. */
export function presetId(name?: string): PresetId | undefined {
  if (!name) return undefined;
  if (Object.hasOwn(PRESET_ALIASES, name)) return PRESET_ALIASES[name as LegacyPresetId];
  return Object.hasOwn(PRESETS, name) ? (name as PresetId) : undefined;
}

/** Identity helper for typed config files: export default defineConfig({...}). */
export function defineConfig(config: UIConfigInput): UIConfigInput {
  return config;
}
