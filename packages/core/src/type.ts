import type { FontPresetId, TypeConfig } from './config';

export interface FontPreset {
  id: FontPresetId;
  label: string;
  display: string;
  body: string;
  mono: string;
  displayWeight: number;
  /** Letter spacing for display sizes. */
  displayTracking: string;
  note: string;
}

/** Google Fonts families only, so every preset loads anywhere with one <link>. */
export const FONT_PRESETS: Record<FontPresetId, FontPreset> = {
  modern: { id: 'modern', label: 'Modern', display: 'Inter Tight', body: 'Inter', mono: 'JetBrains Mono', displayWeight: 600, displayTracking: '-0.03em', note: 'Tight neutral sans. Works for SaaS, agencies, dashboards.' },
  geometric: { id: 'geometric', label: 'Geometric', display: 'Geist', body: 'Geist', mono: 'Geist Mono', displayWeight: 600, displayTracking: '-0.035em', note: 'Clean geometric sans with a technical edge.' },
  editorial: { id: 'editorial', label: 'Editorial', display: 'Fraunces', body: 'Inter', mono: 'JetBrains Mono', displayWeight: 500, displayTracking: '-0.015em', note: 'Soft serif headlines over a neutral sans. Hospitality, food, lifestyle.' },
  grotesk: { id: 'grotesk', label: 'Grotesk', display: 'Space Grotesk', body: 'Inter', mono: 'Space Mono', displayWeight: 600, displayTracking: '-0.03em', note: 'Characterful grotesk. Tech, creative studios, launches.' },
  humanist: { id: 'humanist', label: 'Humanist', display: 'Manrope', body: 'Manrope', mono: 'JetBrains Mono', displayWeight: 700, displayTracking: '-0.025em', note: 'Friendly and open. Consumer apps, services.' },
  classic: { id: 'classic', label: 'Classic', display: 'Instrument Serif', body: 'Instrument Sans', mono: 'JetBrains Mono', displayWeight: 400, displayTracking: '-0.01em', note: 'Elegant high-contrast serif. Luxury, real estate, fashion.' },
};

const AXES: Record<string, string> = {
  Inter: 'wght@400..700',
  'Inter Tight': 'wght@400..700',
  Geist: 'wght@400..700',
  'Geist Mono': 'wght@400..600',
  Fraunces: 'ital,wght@0,400..700;1,400..700',
  'Space Grotesk': 'wght@400..700',
  'Space Mono': 'wght@400;700',
  Manrope: 'wght@400..800',
  'Instrument Serif': 'ital@0;1',
  'Instrument Sans': 'wght@400..700',
  'JetBrains Mono': 'wght@400..600',
};

export interface ResolvedType {
  display: string;
  body: string;
  mono: string;
  displayWeight: number;
  displayTracking: string;
  buttonCase: 'normal' | 'upper';
  stacks: { display: string; body: string; mono: string };
}

const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const SERIF = "ui-serif, Georgia, 'Times New Roman', serif";
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const SERIFS = ['Fraunces', 'Instrument Serif', 'Playfair Display', 'DM Serif Display', 'Cormorant Garamond', 'Libre Caslon Text', 'Newsreader', 'Lora'];

const stack = (family: string, fallback: string) => `'${family}', ${fallback}`;

export function resolveType(cfg: TypeConfig): ResolvedType {
  const preset = FONT_PRESETS[cfg.preset] ?? FONT_PRESETS.modern;
  const display = cfg.display || preset.display;
  const body = cfg.body || preset.body;
  const mono = cfg.mono || preset.mono;
  return {
    display, body, mono,
    displayWeight: cfg.display ? 600 : preset.displayWeight,
    displayTracking: preset.displayTracking,
    buttonCase: cfg.buttonCase,
    stacks: {
      display: stack(display, SERIFS.includes(display) ? SERIF : SANS),
      body: stack(body, SERIFS.includes(body) ? SERIF : SANS),
      mono: stack(mono, MONO),
    },
  };
}

/** One Google Fonts css2 URL for the given families (deduplicated). */
export function googleFontsUrl(families: string[]): string {
  const uniq = [...new Set(families.filter(Boolean))];
  const params = uniq.map((f) => `family=${f.trim().replace(/ /g, '+')}${AXES[f] ? ':' + AXES[f] : ':wght@400..700'}`);
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`;
}

/** URL that loads every preset at once (used by the canvas and playground). */
export function allPresetFontsUrl(): string {
  const fams = Object.values(FONT_PRESETS).flatMap((p) => [p.display, p.body, p.mono]);
  return googleFontsUrl(fams);
}

/** Type scale: [size px, line-height, weight, tracking]. Display sizes shrink on small screens in CSS. */
export const TYPE_SCALE = {
  'display-2xl': [80, 0.96, 'display', 'display'],
  'display-xl': [64, 1, 'display', 'display'],
  'display-l': [48, 1.04, 'display', 'display'],
  'display-m': [36, 1.1, 'display', 'display'],
  h1: [30, 1.2, 600, '-0.02em'],
  h2: [24, 1.25, 600, '-0.015em'],
  h3: [20, 1.35, 600, '-0.01em'],
  'body-l': [18, 1.6, 400, '0'],
  body: [16, 1.55, 400, '0'],
  'body-s': [14, 1.5, 400, '0'],
  label: [13, 1.2, 600, '0.01em'],
  caption: [12, 1.4, 400, '0.01em'],
  overline: [11, 1.2, 600, '0.14em'],
} as const;
export type TypeStyle = keyof typeof TYPE_SCALE;
