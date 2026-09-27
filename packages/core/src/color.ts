/**
 * Color engine. Everything runs in OKLCH so generated scales keep an even
 * perceived lightness across hues. Zero dependencies.
 */

export type RGB = [number, number, number]; // sRGB, 0..1
export type OKLCH = { l: number; c: number; h: number };

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function hexToRgb(hex: string): RGB {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(h)) throw new Error(`Invalid hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
}

export function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value.trim());
}

export function rgbToHex([r, g, b]: RGB): string {
  const to = (n: number) => Math.round(clamp01(n) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function rgbToOklab([r, g, b]: RGB): [number, number, number] {
  const R = toLinear(r), G = toLinear(g), B = toLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinear([L, a, b]: [number, number, number]): RGB {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

export function hexToOklch(hex: string): OKLCH {
  const [l, a, b] = rgbToOklab(hexToRgb(hex));
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l, c, h: c < 1e-4 ? 0 : h };
}

const inGamut = (rgb: RGB) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLCH to hex, reducing chroma until the color fits in sRGB. */
export function oklchToHex({ l, c, h }: OKLCH): string {
  const L = clamp01(l);
  const rad = (h * Math.PI) / 180;
  let lo = 0, hi = Math.max(0, c);
  let lin = oklabToLinear([L, hi * Math.cos(rad), hi * Math.sin(rad)]);
  if (!inGamut(lin)) {
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      const test = oklabToLinear([L, mid * Math.cos(rad), mid * Math.sin(rad)]);
      if (inGamut(test)) lo = mid; else hi = mid;
    }
    lin = oklabToLinear([L, lo * Math.cos(rad), lo * Math.sin(rad)]);
  }
  return rgbToHex(lin.map((v) => toGamma(clamp01(v))) as RGB);
}

/** WCAG 2.x relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colors (1..21). */
export function contrast(a: string, b: string): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Mix two colors in OKLab. t = 0 returns a, t = 1 returns b. */
export function mix(a: string, b: string, t: number): string {
  const A = rgbToOklab(hexToRgb(a)), B = rgbToOklab(hexToRgb(b));
  const lab = A.map((v, i) => v + (B[i] - v) * t) as [number, number, number];
  return rgbToHex(oklabToLinear(lab).map((v) => toGamma(clamp01(v))) as RGB);
}

/** Hex plus alpha, as rgba(). */
export function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex).map((v) => Math.round(v * 255));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`;
}

/** Hex plus alpha, as #RRGGBBAA (for token files that only accept hex). */
export function alphaHex(hex: string, a: number): string {
  return rgbToHex(hexToRgb(hex)) + Math.round(clamp01(a) * 255).toString(16).padStart(2, '0').toUpperCase();
}

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];
export type Scale = Record<ScaleStep, string>;

const L_TARGETS = [0.975, 0.945, 0.89, 0.815, 0.725, 0.635, 0.555, 0.47, 0.39, 0.31, 0.235];
const C_CURVE = [0.16, 0.28, 0.48, 0.7, 0.88, 1, 1, 0.94, 0.82, 0.68, 0.54];

/**
 * An 11-step scale from one seed color. The step closest to the seed's
 * lightness is the seed itself, so the exact brand hex always lives in it.
 */
export function scaleFrom(seed: string): Scale & { anchor: ScaleStep } {
  const base = hexToOklch(seed);
  let anchor = 0, best = Infinity;
  L_TARGETS.forEach((l, i) => {
    const d = Math.abs(l - base.l);
    if (d < best) { best = d; anchor = i; }
  });
  const peak = base.c / Math.max(C_CURVE[anchor], 0.2);
  const out = {} as Scale & { anchor: ScaleStep };
  SCALE_STEPS.forEach((step, i) => {
    out[step] = i === anchor ? rgbToHex(hexToRgb(seed)) : oklchToHex({ l: L_TARGETS[i], c: peak * C_CURVE[i], h: base.h });
  });
  out.anchor = SCALE_STEPS[anchor];
  return out;
}

export const NEUTRAL_STEPS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 975] as const;
export type NeutralStep = (typeof NEUTRAL_STEPS)[number];
export type NeutralScale = Record<NeutralStep, string>;

const N_L = [0.998, 0.984, 0.968, 0.942, 0.9, 0.845, 0.71, 0.57, 0.47, 0.38, 0.285, 0.215, 0.172, 0.14];
const N_C = [0.1, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.9, 0.85, 0.75, 0.6, 0.5, 0.42, 0.36];

/**
 * A 14-step neutral scale tinted by the seed's hue. Chroma is capped so greys
 * stay grey: a warm seed gives warm greys, a cool seed cool greys.
 */
export function neutralFrom(seed: string, maxChroma = 0.022): NeutralScale {
  const base = hexToOklch(seed);
  const c = Math.min(base.c, maxChroma);
  const out = {} as NeutralScale;
  NEUTRAL_STEPS.forEach((step, i) => {
    out[step] = oklchToHex({ l: N_L[i], c: c * N_C[i], h: base.h });
  });
  return out;
}

/** Pick whichever of the candidates reads best on the background. */
export function bestOn(bg: string, candidates: string[]): string {
  return candidates.reduce((a, b) => (contrast(bg, b) > contrast(bg, a) ? b : a));
}

/**
 * Walk a scale from `from` toward darker (dir 1) or lighter (dir -1) steps and
 * return the first step reaching the contrast target against `bg`.
 */
export function stepWithContrast(scale: Scale, bg: string, target: number, from: ScaleStep, dir: 1 | -1): string {
  const idx = SCALE_STEPS.indexOf(from);
  for (let i = idx; i >= 0 && i < SCALE_STEPS.length; i += dir) {
    const c = scale[SCALE_STEPS[i]];
    if (contrast(c, bg) >= target) return c;
  }
  return scale[SCALE_STEPS[dir === 1 ? SCALE_STEPS.length - 1 : 0]];
}
