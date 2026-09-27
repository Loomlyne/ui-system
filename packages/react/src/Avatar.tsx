import * as React from 'react';
import { createAvatar } from '@dicebear/core';
import * as notionistsNeutral from '@dicebear/notionists-neutral';
import * as loreleiNeutral from '@dicebear/lorelei-neutral';
import * as thumbs from '@dicebear/thumbs';
import * as glass from '@dicebear/glass';
import * as shapes from '@dicebear/shapes';
import type { AvatarStyle } from '@ui-system/core';
import { cx, pick, useUIS } from './context';

/**
 * People without a photo get a real, deterministic DiceBear avatar (same name,
 * same face, every time), never a stock or invented photo. All bundled
 * styles are CC0, so no attribution is required.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STYLES: Record<Exclude<AvatarStyle, 'initials'>, any> = {
  'notionists-neutral': notionistsNeutral,
  'lorelei-neutral': loreleiNeutral,
  thumbs,
  glass,
  shapes,
};

export const AVATAR_STYLES = ['notionists-neutral', 'lorelei-neutral', 'thumbs', 'glass', 'shapes', 'initials'] as const;

const cache = new Map<string, string>();

/** SVG markup for a seed in a DiceBear style (memoized). */
export function avatarSvg(seed: string, style: Exclude<AvatarStyle, 'initials'> = 'notionists-neutral'): string {
  const key = `${style}:${seed}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const svg = createAvatar(STYLES[style] ?? notionistsNeutral, { seed: seed || 'guest', size: 96 }).toString();
  if (cache.size > 500) cache.clear();
  cache.set(key, svg);
  return svg;
}

export interface AvatarProps {
  name?: string;
  initials?: string;
  /** A real photo. When absent the DiceBear style from the theme is drawn. */
  src?: string;
  /** Override the theme's avatar style for this avatar. */
  avatarStyle?: AvatarStyle;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export function Avatar({ name = '', initials, src, avatarStyle, size = 'md', className, style }: AvatarProps) {
  const { theme } = useUIS();
  const kind = pick(avatarStyle, theme.config.avatars?.style ?? 'notionists-neutral');
  const ini = initials ?? name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const svg = React.useMemo(() => (src || kind === 'initials' ? '' : avatarSvg(name || ini || 'guest', kind as Exclude<AvatarStyle, 'initials'>)), [src, kind, name, ini]);
  return (
    <span className={cx('uis-avatar', size !== 'md' && `uis-avatar--${size}`, svg && 'uis-avatar--art', className)} style={style} title={name || undefined} role="img" aria-label={name || ini || 'Avatar'}>
      {src ? <img src={src} alt="" /> : svg ? <span className="uis-avatar__art" aria-hidden dangerouslySetInnerHTML={{ __html: svg }} /> : ini}
    </span>
  );
}

export function AvatarGroup({ people, size = 'sm' }: { people: AvatarProps[]; size?: AvatarProps['size'] }) {
  return <span className="uis-avatars">{people.map((p, i) => <Avatar key={i} size={size} {...p} />)}</span>;
}
