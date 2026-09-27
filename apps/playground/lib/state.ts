import { DEFAULT_CONFIG, resolveConfig, type UIConfig, type UIConfigInput } from '@ui-system/core';

export type Config = UIConfig;

export const clone = (c: Config): Config => JSON.parse(JSON.stringify(c));

/** Starting points. They only set values; everything stays editable. */
export const STARTERS: Array<{ id: string; label: string; config: UIConfigInput }> = [
  { id: 'neutral', label: 'Neutral', config: DEFAULT_CONFIG },
  {
    id: 'editorial', label: 'Warm editorial',
    config: { color: { primary: '#2F5D50', accent: '#C4952E', neutral: '#8A7F6A', mode: 'light' }, radius: { roundness: 90, pill: true }, type: { preset: 'editorial', buttonCase: 'upper' }, surface: { float: 'glass', shadow: 'medium', border: 'hairline' }, brand: { mark: 'ring' }, nav: { front: 'dock', back: 'inset' } },
  },
  {
    id: 'tech', label: 'Tech dark',
    config: { color: { primary: '#2F6BD8', accent: '#E0562B', neutral: '#6B7280', mode: 'dark' }, radius: { roundness: 35, pill: false }, type: { preset: 'geometric', buttonCase: 'normal' }, density: 'compact', surface: { float: 'solid', shadow: 'soft', border: 'hairline' }, brand: { mark: 'stack', caption: '' }, nav: { front: 'island', back: 'topbar' } },
  },
  {
    id: 'sharp', label: 'Sharp mono',
    config: { color: { primary: '#141414', accent: '#E0562B', neutral: '#737373', mode: 'light' }, radius: { roundness: 0, pill: false }, type: { preset: 'grotesk', buttonCase: 'upper' }, surface: { float: 'solid', shadow: 'none', border: 'hairline' }, brand: { mark: 'none', variant: 'wordmark' }, nav: { front: 'bar', back: 'rail' } },
  },
  {
    id: 'luxury', label: 'Quiet luxury',
    config: { color: { primary: '#3B2F2A', accent: '#B08D57', neutral: '#8C8279', mode: 'light' }, radius: { roundness: 10, pill: false }, type: { preset: 'classic', buttonCase: 'upper' }, surface: { float: 'glass', shadow: 'soft', border: 'hairline' }, brand: { mark: 'none', variant: 'wordmark', wordmarkCase: 'upper' }, nav: { front: 'minimal', back: 'sidebar' } },
  },
  {
    id: 'friendly', label: 'Friendly app',
    config: { color: { primary: '#5B4BDB', accent: '#F2A93B', neutral: '#6E6A80', mode: 'light' }, radius: { roundness: 100, pill: true }, type: { preset: 'humanist', buttonCase: 'normal' }, density: 'spacious', surface: { float: 'solid', shadow: 'medium', border: 'none' }, brand: { mark: 'orbit' }, nav: { front: 'island', back: 'dock' } },
  },
];

export function fromStarter(id: string, keepBrand?: Config['brand']): Config {
  const s = STARTERS.find((x) => x.id === id) ?? STARTERS[0];
  const c = resolveConfig(s.config);
  if (keepBrand) c.brand = { ...c.brand, wordmark: keepBrand.wordmark, caption: s.config.brand?.caption ?? keepBrand.caption, logoSrc: keepBrand.logoSrc, markSrc: keepBrand.markSrc };
  return c;
}

const isData = (v?: string) => !!v && v.startsWith('data:');

/** Config for sharing and export: uploaded images become placeholders. */
export function portable(c: Config): Config {
  const out = clone(c);
  if (isData(out.brand.logoSrc)) out.brand.logoSrc = '/brand/logo.svg';
  if (isData(out.brand.markSrc)) out.brand.markSrc = '/brand/mark.svg';
  return out;
}

export function encodeHash(c: Config): string {
  const p = portable(c);
  if (p.brand.logoSrc === '/brand/logo.svg') delete p.brand.logoSrc;
  if (p.brand.markSrc === '/brand/mark.svg') delete p.brand.markSrc;
  const json = JSON.stringify(p);
  return typeof window === 'undefined' ? '' : window.btoa(unescape(encodeURIComponent(json)));
}

export function decodeHash(hash: string): Config | null {
  try {
    const raw = hash.replace(/^#/, '').replace(/^c=/, '');
    if (!raw) return null;
    return resolveConfig(JSON.parse(decodeURIComponent(escape(window.atob(raw)))));
  } catch {
    return null;
  }
}

export function set<T extends keyof Config, K extends keyof Config[T]>(c: Config, group: T, key: K, value: Config[T][K]): Config {
  const out = clone(c);
  (out[group] as Config[T])[key] = value;
  return out;
}
