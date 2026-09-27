import * as React from 'react';
import type { LogoMark as MarkKind, LogoVariant } from '@ui-system/core';
import { cx, pick, useUIS } from './context';

export interface LogoMarkProps {
  mark?: MarkKind;
  initials?: string;
  tone?: 'current' | 'primary';
  src?: string;
  svg?: string;
  className?: string;
  style?: React.CSSProperties;
}

let uid = 0;
const useUid = (): string => {
  const reactId = (React as unknown as { useId?: () => string }).useId?.();
  const ref = React.useRef<string>('');
  if (!ref.current) ref.current = reactId ? reactId.replace(/[^a-zA-Z0-9_-]/g, '') : `m${++uid}`;
  return ref.current;
};

/**
 * Generated brand marks. They follow the system: the monogram's corners track
 * the roundness setting, and color follows either the text color or primary.
 */
export function LogoMark(props: LogoMarkProps) {
  const { brand, theme } = useUIS();
  const mark = pick(props.mark, brand.mark);
  const tone = pick(props.tone, brand.markTone);
  const src = props.src ?? brand.markSrc;
  const svg = props.svg ?? brand.markSvg;
  const id = useUid();
  const initials = (pick(props.initials, brand.initials ?? '') || brand.wordmark.trim().charAt(0) || 'B').slice(0, 2).toUpperCase();
  const fill = tone === 'primary' ? 'var(--uis-primary)' : 'currentColor';
  const cls = cx('uis-logo__mark', props.className);

  if (mark === 'none') return null;
  // An uploaded mark wins unless a specific generated mark was asked for.
  if (src && (mark === 'custom' || props.mark === undefined || props.src)) return <img className={cx('uis-logo__img', props.className)} src={src} alt="" style={props.style} />;
  if (mark === 'custom' && svg) {
    return <span className={cls} style={{ color: tone === 'primary' ? 'var(--uis-primary)' : undefined, ...props.style }} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />;
  }

  const t = Math.min(1, Math.max(0, theme.config.radius.roundness / 100));
  const rx = theme.config.radius.pill ? 16 : Math.round(3 + 11 * t);
  const fontSize = initials.length > 1 ? 13 : 17;
  const text = (color: string) => (
    <text x="16" y="16.5" textAnchor="middle" dominantBaseline="central" fill={color}
      style={{ fontFamily: 'var(--uis-font-display)', fontWeight: 700, fontSize, letterSpacing: '-0.02em' }}>{initials}</text>
  );

  let body: React.ReactNode;
  switch (mark) {
    case 'ring':
      body = (
        <>
          <circle cx="16" cy="16" r="13.5" fill="none" stroke={fill} strokeWidth="3" />
          {text(fill)}
        </>
      );
      break;
    case 'spark':
      body = <path d="M16 2c1 8.6 4.8 12.9 14 14-9.2 1.1-13 5.4-14 14-1-8.6-4.8-12.9-14-14 9.2-1.1 13-5.4 14-14z" fill={fill} />;
      break;
    case 'stack': {
      const br = Math.min(2.5, rx / 3);
      body = (
        <>
          <rect x="4" y="5" width="20" height="5.5" rx={br} fill={fill} />
          <rect x="8" y="13.25" width="20" height="5.5" rx={br} fill={fill} opacity="0.72" />
          <rect x="4" y="21.5" width="14" height="5.5" rx={br} fill={fill} opacity="0.45" />
        </>
      );
      break;
    }
    case 'orbit':
      body = (
        <>
          <circle cx="14" cy="18" r="10" fill="none" stroke={fill} strokeWidth="3" />
          <circle cx="24.5" cy="7.5" r="4.5" fill={fill} />
        </>
      );
      break;
    case 'monogram':
    default:
      body = tone === 'primary' ? (
        <>
          <rect width="32" height="32" rx={rx} fill="var(--uis-primary)" />
          {text('var(--uis-primary-ink)')}
        </>
      ) : (
        <>
          <mask id={`uis-${id}`}>
            <rect width="32" height="32" rx={rx} fill="#fff" />
            {text('#000')}
          </mask>
          <rect width="32" height="32" rx={rx} fill="currentColor" mask={`url(#uis-${id})`} />
        </>
      );
  }
  return (
    <svg className={cls} style={props.style} viewBox="0 0 32 32" aria-hidden>
      {body}
    </svg>
  );
}

export interface LogoProps {
  variant?: LogoVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  wordmark?: string;
  caption?: string;
  mark?: MarkKind;
  initials?: string;
  tone?: 'current' | 'primary';
  /** Full logo image; replaces the generated lockup. */
  src?: string;
  markSrc?: string;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** The brand logo in four arrangements: lockup, stacked, mark, wordmark. */
export function Logo(props: LogoProps) {
  const { brand } = useUIS();
  const variant = pick(props.variant, brand.variant);
  const wordmark = pick(props.wordmark, brand.wordmark);
  const caption = props.caption !== undefined ? props.caption : brand.caption;
  const src = props.src ?? brand.logoSrc;
  const size = props.size ?? 'md';
  const Tag = (props.href ? 'a' : 'span') as 'a';
  const cls = cx('uis-logo', `uis-logo--${size}`, variant === 'stacked' && 'uis-logo--stacked', props.className);
  const markEl = <LogoMark mark={props.mark} initials={props.initials ?? (props.wordmark ? props.wordmark.trim().charAt(0) : undefined)} tone={props.tone} src={props.markSrc} />;

  let inner: React.ReactNode;
  if (src && variant !== 'mark') {
    inner = <img className="uis-logo__img" src={src} alt={wordmark} />;
  } else if (variant === 'mark') {
    inner = <>{markEl}<span className="uis-sr">{wordmark}</span></>;
  } else {
    const text = (
      <span className="uis-logo__text">
        <span className="uis-logo__word">{wordmark}</span>
        {caption ? <span className="uis-logo__caption">{caption}</span> : null}
      </span>
    );
    inner = variant === 'wordmark' ? text : <>{markEl}{text}</>;
  }
  return (
    <Tag className={cls} href={props.href} style={props.style} aria-label={props.href ? wordmark : undefined}>
      {inner}
    </Tag>
  );
}
