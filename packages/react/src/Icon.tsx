import * as React from 'react';
import {
  Menu01Icon, Cancel01Icon, Search01Icon, Notification01Icon, Home01Icon, DashboardSquare01Icon, Analytics01Icon,
  Activity01Icon, ChartIncreaseIcon, UserGroupIcon, UserIcon, Settings01Icon, Target01Icon, SlidersHorizontalIcon,
  ShoppingBag01Icon, ShoppingCart01Icon, Calendar03Icon, InboxIcon, File01Icon, Folder01Icon, Add01Icon, Tick02Icon,
  ArrowDown01Icon, ArrowUp01Icon, ArrowRight01Icon, ArrowLeft01Icon, UnfoldMoreIcon, ArrowRight02Icon, ArrowUpRight01Icon,
  Clock01Icon, Location01Icon, CallIcon, Mail01Icon, Message01Icon, Logout01Icon, CommandIcon, Sun03Icon, Moon02Icon,
  SparklesIcon, Layers01Icon, PackageIcon, CreditCardIcon, HelpCircleIcon, FilterHorizontalIcon, MoreHorizontalIcon,
  StarIcon, FavouriteIcon, Globe02Icon, SquareLock02Icon, Download01Icon, Upload01Icon, Copy01Icon, PencilEdit01Icon,
  Delete02Icon, ViewIcon, ViewOffSlashIcon, Link01Icon, FlashIcon, Tag01Icon, DeliveryTruck01Icon, Image01Icon, PlayIcon, SidebarLeft01Icon,
  Dollar01Icon, Briefcase01Icon, Building03Icon, Invoice01Icon, Wallet01Icon, MapsIcon, Car01Icon, Shield01Icon,
  Share08Icon, RefreshIcon, RulerIcon, Bookmark01Icon, Camera01Icon, Store01Icon, LeftToRightListBulletIcon, Route01Icon,
  CheckmarkCircle02Icon, AlertCircleIcon, InformationCircleIcon, Alert02Icon, CancelCircleIcon, StethoscopeIcon,
} from '@hugeicons/core-free-icons';
import { cx } from './context';

/** One Hugeicons node: [tag, attributes]. */
export type IconNode = readonly [string, Readonly<Record<string, string | number>>];

/**
 * Every icon comes from Hugeicons (https://hugeicons.com, free stroke-rounded set, MIT,
 * package @hugeicons/core-free-icons). Names stay short and stable; the Hugeicons glyph
 * behind each name may change without breaking callers. Never draw a custom icon here:
 * pick the closest Hugeicons glyph and add a name.
 */
const SOURCE = {
  menu: Menu01Icon, x: Cancel01Icon, search: Search01Icon, bell: Notification01Icon, home: Home01Icon,
  grid: DashboardSquare01Icon, chart: Analytics01Icon, activity: Activity01Icon, trend: ChartIncreaseIcon,
  users: UserGroupIcon, user: UserIcon, settings: Settings01Icon, target: Target01Icon, sliders: SlidersHorizontalIcon,
  bag: ShoppingBag01Icon, cart: ShoppingCart01Icon, calendar: Calendar03Icon, inbox: InboxIcon, file: File01Icon,
  folder: Folder01Icon, plus: Add01Icon, check: Tick02Icon,
  'chevron-down': ArrowDown01Icon, 'chevron-up': ArrowUp01Icon, 'chevron-right': ArrowRight01Icon,
  'chevron-left': ArrowLeft01Icon, 'chevrons-updown': UnfoldMoreIcon, 'arrow-right': ArrowRight02Icon,
  'arrow-up-right': ArrowUpRight01Icon, clock: Clock01Icon, pin: Location01Icon, phone: CallIcon, mail: Mail01Icon,
  message: Message01Icon, logout: Logout01Icon, command: CommandIcon, sun: Sun03Icon, moon: Moon02Icon,
  sparkle: SparklesIcon, layers: Layers01Icon, box: PackageIcon, card: CreditCardIcon, help: HelpCircleIcon,
  filter: FilterHorizontalIcon, more: MoreHorizontalIcon, star: StarIcon, heart: FavouriteIcon, globe: Globe02Icon,
  lock: SquareLock02Icon, download: Download01Icon, upload: Upload01Icon, copy: Copy01Icon, edit: PencilEdit01Icon,
  trash: Delete02Icon, eye: ViewIcon, 'eye-off': ViewOffSlashIcon, link: Link01Icon, bolt: FlashIcon, tag: Tag01Icon, truck: DeliveryTruck01Icon,
  image: Image01Icon, play: PlayIcon, sidebar: SidebarLeft01Icon, currency: Dollar01Icon, briefcase: Briefcase01Icon,
  building: Building03Icon, receipt: Invoice01Icon, wallet: Wallet01Icon, map: MapsIcon, car: Car01Icon,
  shield: Shield01Icon, share: Share08Icon, refresh: RefreshIcon, ruler: RulerIcon, bookmark: Bookmark01Icon,
  camera: Camera01Icon, store: Store01Icon, list: LeftToRightListBulletIcon, route: Route01Icon,
  'check-circle': CheckmarkCircle02Icon, 'alert-circle': AlertCircleIcon, info: InformationCircleIcon,
  warning: Alert02Icon, 'x-circle': CancelCircleIcon, health: StethoscopeIcon,
} as const;

// Stroke attributes move to the <svg> so `strokeWidth` and `currentColor` apply to every node.
const SVG_LEVEL = new Set(['key', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin']);
const clean = (nodes: readonly (readonly [string, Readonly<Record<string, unknown>>])[]): IconNode[] =>
  nodes.map(([tag, attrs]) => [tag, Object.fromEntries(Object.entries(attrs).filter(([k]) => !SVG_LEVEL.has(k))) as Record<string, string | number>]);

export type IconName = keyof typeof SOURCE;
export const ICONS = Object.fromEntries(
  Object.entries(SOURCE).map(([name, nodes]) => [name, clean(nodes as never)]),
) as Record<IconName, IconNode[]>;

/** Hugeicons stroke width. */
export const ICON_STROKE = 1.5;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: IconName | string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function Icon({ name, size, strokeWidth = ICON_STROKE, label, className, style, ...rest }: IconProps) {
  // Own keys only: a name like 'constructor' must fall back, not crash.
  const nodes = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name as IconName] : ICONS.sparkle;
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={cx('uis-icon', className)}
      style={size ? { width: size, height: size, ...style } : style}
      aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label}
      {...rest}
    >
      {nodes.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}
