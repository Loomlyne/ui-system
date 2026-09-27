import * as React from 'react';
import { animate, stagger, createTimeline, onScroll, utils, eases } from 'animejs';
import { cx, useUIS } from './context';

/** anime.js, re-exported so projects and Claude Design (UIS.anime) use one engine. */
export const anime = { animate, stagger, createTimeline, onScroll, utils, eases };

export type RevealEffect = 'fade-up' | 'fade' | 'scale-in' | 'slide-left' | 'slide-right' | 'blur-in';

const EFFECTS: Record<RevealEffect, Record<string, [number | string, number | string]>> = {
  'fade-up': { opacity: [0, 1], translateY: [18, 0] },
  fade: { opacity: [0, 1] },
  'scale-in': { opacity: [0, 1], scale: [0.96, 1] },
  'slide-left': { opacity: [0, 1], translateX: [28, 0] },
  'slide-right': { opacity: [0, 1], translateX: [-28, 0] },
  'blur-in': { opacity: [0, 1], filter: ['blur(10px)', 'blur(0px)'] },
};

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** True when the theme allows motion and the visitor has not asked for less. */
export function useMotionEnabled() {
  const { theme } = useUIS();
  return theme.config.motion?.enabled !== false && !reduced();
}

export interface RevealProps {
  as?: 'div' | 'section' | 'ul' | 'span';
  effect?: RevealEffect;
  /** ms between children. When set, each direct child animates in turn. */
  stagger?: number;
  delay?: number;
  duration?: number;
  /** Start when scrolled into view (default) or immediately. */
  trigger?: 'view' | 'mount';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Entrance animation powered by anime.js. Follows config.motion and reduced motion. */
export function Reveal({ as = 'div', effect = 'fade-up', stagger: gap, delay = 0, duration, trigger = 'view', className, style, children }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const { theme } = useUIS();
  const on = useMotionEnabled();
  const expressive = theme.config.motion?.intensity === 'expressive';
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !on) return;
    const targets = gap ? Array.from(el.children) : [el];
    const params = EFFECTS[effect] ?? EFFECTS['fade-up'];
    utils.set(targets as HTMLElement[], { opacity: 0 });
    const run = () =>
      animate(targets as HTMLElement[], {
        ...params,
        duration: duration ?? (expressive ? 950 : 620),
        delay: gap ? stagger(gap, { start: delay }) : delay,
        ease: expressive ? 'out(4)' : 'out(3)',
      });
    if (trigger === 'mount' || typeof IntersectionObserver === 'undefined') { run(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [on, effect, gap, delay, duration, trigger, expressive]);
  const Tag = as as 'div';
  return <Tag ref={ref as React.RefObject<HTMLDivElement>} className={cx('uis-reveal', className)} style={style}>{children}</Tag>;
}

/** Counts a number up when it comes into view (stats, prices, KPIs). */
export function CountUp({ to, from = 0, decimals = 0, prefix = '', suffix = '', duration, className, style }: { to: number; from?: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; className?: string; style?: React.CSSProperties }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const on = useMotionEnabled();
  const fmt = (n: number) => `${prefix}${n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!on) { el.textContent = fmt(to); return; }
    const box = { v: from };
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      animate(box, { v: to, duration: duration ?? 1200, ease: 'out(3)', onUpdate: () => { el.textContent = fmt(box.v); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, on]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>{fmt(on ? from : to)}</span>;
}
