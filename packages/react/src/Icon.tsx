import * as React from 'react';
import { cx } from './context';

/** Stroke icons on a 24px grid, 1.75 stroke, round joins. All drawn for this system. */
export const ICONS = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13zM20 20l-4.2-4.2',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0',
  home: 'M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z',
  grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
  chart: 'M4 20h16M7 16v-5M12 16V6M17 16v-3',
  activity: 'M3 12h4l2.5-6 5 12 2.5-6h4',
  trend: 'M4 16l5.5-5.5 4 4L20 8M15 8h5v5',
  users: 'M9 4.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zM3 19.5c.8-3.2 3.2-5 6-5s5.2 1.8 6 5M16 5a3.2 3.2 0 0 1 0 6.2M18 14.8c1.5.7 2.5 2.3 3 4.7',
  user: 'M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM4.5 20c1-3.5 3.9-5.5 7.5-5.5s6.5 2 7.5 5.5',
  settings: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 15a2 2 0 1 1 0 4a2 2 0 0 1 0-4z',
  target: 'M12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14zM12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM12 2v3M12 19v3M2 12h3M19 12h3',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 15a2 2 0 1 1 0 4a2 2 0 0 1 0-4z',
  bag: 'M5 8h14l-1 12H6zM9 8V7a3 3 0 0 1 6 0v1',
  cart: 'M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2M9 19a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM17 19a1 1 0 1 1 0 2a1 1 0 0 1 0-2z',
  calendar: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8 3v4M16 3v4',
  inbox: 'M4 13l2.5-7h11l2.5 7v5.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 13h4.5l1 2h5l1-2H20',
  file: 'M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20zM14 3.5V8h4M9 13h6M9 16.5h4',
  folder: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h4l2 2h8A1.5 1.5 0 0 1 20.5 9v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevrons-updown': 'M8 9l4-4 4 4M8 15l4 4 4-4',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  'arrow-up-right': 'M7 17L17 7M8 7h9v9',
  clock: 'M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM12 8v4.5l3 2',
  pin: 'M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5z',
  phone: 'M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z',
  mail: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM4.5 6.5l7.5 6 7.5-6',
  message: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17A1.5 1.5 0 0 1 4 15.5z',
  logout: 'M14 4h4.5a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4M6 12h10',
  command: 'M9 9V6.5A2.5 2.5 0 1 0 6.5 9zM9 9h6v6H9zM15 9V6.5A2.5 2.5 0 1 1 17.5 9zM15 15h2.5a2.5 2.5 0 1 1-2.5 2.5zM9 15v2.5A2.5 2.5 0 1 1 6.5 15z',
  sun: 'M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z',
  sparkle: 'M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z',
  layers: 'M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5',
  box: 'M12 3.5l8 4.5v8l-8 4.5-8-4.5V8zM4 8l8 4.5L20 8M12 12.5v8',
  card: 'M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17zM3.5 10h17M7 15h3',
  help: 'M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2',
  filter: 'M4 6h16M7 12h10M10 18h4',
  more: 'M6 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM12 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM18 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2z',
  star: 'M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z',
  globe: 'M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM4 12h16M12 4c2.5 2.5 3.5 5 3.5 8s-1 5.5-3.5 8c-2.5-2.5-3.5-5-3.5-8s1-5.5 3.5-8z',
  lock: 'M6.5 11h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  upload: 'M12 20V9M7 14l5-5 5 5M5 4h14',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  edit: 'M5 19l1-4L15.5 5.5a2 2 0 0 1 3 3L9 18zM13.5 7.5l3 3',
  trash: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  bolt: 'M13 3L5 13.5h6L10 21l8-10.5h-6z',
  tag: 'M4 4h7.5l8.5 8.5-7.5 7.5L4 11.5zM8.5 7.5a1 1 0 1 1 0 2a1 1 0 0 1 0-2z',
  truck: 'M3 6h11v10H3zM14 9.5h4l3 3.5v3h-7M7 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM17 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4z',
  image: 'M4 5.5h16v13H4zM4 16l5-5 4 4 2.5-2.5L20 17M15.5 8.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3z',
  play: 'M8 5.5v13l11-6.5z',
  sidebar: 'M4.5 5h15v14h-15zM9.5 5v14',
  currency: 'M12 3v18M16.5 7.5c-.8-1.3-2.4-2-4.5-2-2.6 0-4 1.3-4 3s1.4 2.6 4 3.1 4.5 1.3 4.5 3.3-1.8 3.1-4.5 3.1c-2.3 0-4-.8-4.8-2.3',
  briefcase: 'M4 8h16v11H4zM9 8V5.5h6V8M4 13h16',
  building: 'M5 20V5h9v15M14 10h5v10M3 20h18M8 8.5h3M8 12h3M8 15.5h3',
} as const;

export type IconName = keyof typeof ICONS;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName | string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function Icon({ name, size, strokeWidth = 1.75, label, className, style, ...rest }: IconProps) {
  const d = ICONS[name as IconName] ?? ICONS.sparkle;
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={cx('uis-icon', className)}
      style={size ? { width: size, height: size, ...style } : style}
      aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
