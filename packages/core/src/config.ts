/**
 * The one file you edit per project. Every value is optional: anything you
 * leave out falls back to DEFAULT_CONFIG, a deliberately neutral starting
 * point with no brand baked in.
 */

export type Mode = 'light' | 'dark';
export type LogoVariant = 'lockup' | 'stacked' | 'mark' | 'wordmark';
export type LogoMark = 'monogram' | 'ring' | 'spark' | 'stack' | 'orbit' | 'none' | 'custom';
export type Placement = 'left' | 'center' | 'right';
export type FontPresetId = 'modern' | 'geometric' | 'editorial' | 'grotesk' | 'humanist' | 'classic';
export type Density = 'compact' | 'comfortable' | 'spacious';
export type FloatSurface = 'solid' | 'glass';
export type ShadowDepth = 'none' | 'soft' | 'medium' | 'deep';
export type FrontNav = 'dock' | 'island' | 'bar' | 'stacked' | 'minimal';
export type BackNav = 'sidebar' | 'rail' | 'inset' | 'topbar' | 'dock';
export type RadiusRole = 'chip' | 'control' | 'field' | 'card' | 'panel' | 'media' | 'shell';

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
}

export interface RadiusConfig {
  /** 0 = razor sharp, 100 = fully rounded. Scales every radius role together. */
  roundness: number;
  /** Buttons, chips, inputs and nav shells become full pills regardless of roundness. */
  pill: boolean;
  /** Pin any single role to an exact px value. */
  overrides?: Partial<Record<RadiusRole, number>>;
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
}

export interface NavConfig {
  front: FrontNav;
  back: BackNav;
}

export interface UIConfig {
  /** Project name, used by exports and docs. */
  name: string;
  brand: BrandConfig;
  color: ColorConfig;
  radius: RadiusConfig;
  type: TypeConfig;
  density: Density;
  surface: SurfaceConfig;
  nav: NavConfig;
}

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type UIConfigInput = DeepPartial<UIConfig>;

export const DEFAULT_CONFIG: UIConfig = {
  name: 'New Project',
  brand: {
    wordmark: 'Brand',
    caption: 'Tagline',
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

/** Fill a partial config with defaults. Safe to call on user JSON. */
export function resolveConfig(input?: UIConfigInput): UIConfig {
  return merge(DEFAULT_CONFIG, input ?? {});
}

/** Identity helper for typed config files: export default defineConfig({...}). */
export function defineConfig(config: UIConfigInput): UIConfigInput {
  return config;
}
