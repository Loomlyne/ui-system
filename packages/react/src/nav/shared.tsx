import * as React from 'react';
import type { IconName } from '../Icon';
import type { ButtonProps } from '../primitives';

export interface NavLink {
  label: string;
  href?: string;
  icon?: IconName | string;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export interface NavAction {
  icon: IconName | string;
  label: string;
  href?: string;
  count?: number | string;
  dot?: boolean;
  onClick?: () => void;
}

export interface NavCta {
  label: string;
  href?: string;
  icon?: IconName | string;
  variant?: ButtonProps['variant'];
  onClick?: () => void;
}

export interface NavSection {
  label?: string;
  items: NavLink[];
}

export interface AppUser {
  name: string;
  meta?: string;
  initials?: string;
  src?: string;
}

export interface Workspace {
  name: string;
  plan?: string;
  initials?: string;
}

export function A({ link, className, children, title }: { link: NavLink; className: string; children: React.ReactNode; title?: string }) {
  return (
    <a
      className={className}
      href={link.href ?? '#'}
      title={title}
      aria-current={link.active ? 'page' : undefined}
      onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick!(); } : undefined}
    >
      {children}
    </a>
  );
}

export const arr = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : []);
