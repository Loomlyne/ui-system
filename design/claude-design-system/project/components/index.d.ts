// UI System components (window.UIS). Types are documentation.
type Mode = 'light' | 'dark';
type Placement = 'left' | 'center' | 'right';
type LogoVariant = 'lockup' | 'stacked' | 'mark' | 'wordmark';
type LogoMark = 'monogram' | 'ring' | 'spark' | 'stack' | 'orbit' | 'none' | 'custom';
type FontPresetId = 'modern' | 'geometric' | 'editorial' | 'grotesk' | 'humanist' | 'classic';
type Density = 'compact' | 'comfortable' | 'spacious';
type FloatSurface = 'solid' | 'glass';
type ShadowDepth = 'none' | 'soft' | 'medium' | 'deep';
type FrontNav = 'dock' | 'island' | 'bar' | 'stacked' | 'minimal';
type BackNav = 'sidebar' | 'rail' | 'inset' | 'topbar' | 'dock';
type UIConfigInput = Record<string, unknown>;
type BrandConfig = Record<string, unknown>;
type Theme = Record<string, unknown>;

// Avatar.d.ts
export declare const AVATAR_STYLES: readonly ["notionists-neutral", "lorelei-neutral", "thumbs", "glass", "shapes", "initials"];
/** SVG markup for a seed in a DiceBear style (memoized). */
export declare function avatarSvg(seed: string, style?: Exclude<AvatarStyle, 'initials'>): string;
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
export declare function Avatar({ name, initials, src, avatarStyle, size, className, style }: AvatarProps): React.JSX.Element;
export declare function AvatarGroup({ people, size }: {
    people: AvatarProps[];
    size?: AvatarProps['size'];
}): React.JSX.Element;

// Icon.d.ts
/** Stroke icons on a 24px grid, 1.75 stroke, round joins. All drawn for this system. */
export declare const ICONS: {
    readonly menu: "M4 7h16M4 12h16M4 17h16";
    readonly x: "M6 6l12 12M18 6L6 18";
    readonly search: "M11 4.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 0 1 0-13zM20 20l-4.2-4.2";
    readonly bell: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0";
    readonly home: "M4 10.5L12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z";
    readonly grid: "M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z";
    readonly chart: "M4 20h16M7 16v-5M12 16V6M17 16v-3";
    readonly activity: "M3 12h4l2.5-6 5 12 2.5-6h4";
    readonly trend: "M4 16l5.5-5.5 4 4L20 8M15 8h5v5";
    readonly users: "M9 4.5a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zM3 19.5c.8-3.2 3.2-5 6-5s5.2 1.8 6 5M16 5a3.2 3.2 0 0 1 0 6.2M18 14.8c1.5.7 2.5 2.3 3 4.7";
    readonly user: "M12 4a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM4.5 20c1-3.5 3.9-5.5 7.5-5.5s6.5 2 7.5 5.5";
    readonly settings: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 15a2 2 0 1 1 0 4a2 2 0 0 1 0-4z";
    readonly target: "M12 5a7 7 0 1 1 0 14a7 7 0 0 1 0-14zM12 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM12 2v3M12 19v3M2 12h3M19 12h3";
    readonly sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 5a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM10 15a2 2 0 1 1 0 4a2 2 0 0 1 0-4z";
    readonly bag: "M5 8h14l-1 12H6zM9 8V7a3 3 0 0 1 6 0v1";
    readonly cart: "M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2M9 19a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM17 19a1 1 0 1 1 0 2a1 1 0 0 1 0-2z";
    readonly calendar: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 10h16M8 3v4M16 3v4";
    readonly inbox: "M4 13l2.5-7h11l2.5 7v5.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5zM4 13h4.5l1 2h5l1-2H20";
    readonly file: "M6 3.5h8l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20zM14 3.5V8h4M9 13h6M9 16.5h4";
    readonly folder: "M3.5 7A1.5 1.5 0 0 1 5 5.5h4l2 2h8A1.5 1.5 0 0 1 20.5 9v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z";
    readonly plus: "M12 5v14M5 12h14";
    readonly check: "M5 12.5l4.5 4.5L19 7.5";
    readonly 'chevron-down': "M6 9l6 6 6-6";
    readonly 'chevron-up': "M6 15l6-6 6 6";
    readonly 'chevron-right': "M9 6l6 6-6 6";
    readonly 'chevron-left': "M15 6l-6 6 6 6";
    readonly 'chevrons-updown': "M8 9l4-4 4 4M8 15l4 4 4-4";
    readonly 'arrow-right': "M5 12h14M13 6l6 6-6 6";
    readonly 'arrow-up-right': "M7 17L17 7M8 7h9v9";
    readonly clock: "M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM12 8v4.5l3 2";
    readonly pin: "M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5z";
    readonly phone: "M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 6a2 2 0 0 1 2-2z";
    readonly mail: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM4.5 6.5l7.5 6 7.5-6";
    readonly message: "M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17A1.5 1.5 0 0 1 4 15.5z";
    readonly logout: "M14 4h4.5a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 16l-4-4 4-4M6 12h10";
    readonly command: "M9 9V6.5A2.5 2.5 0 1 0 6.5 9zM9 9h6v6H9zM15 9V6.5A2.5 2.5 0 1 1 17.5 9zM15 15h2.5a2.5 2.5 0 1 1-2.5 2.5zM9 15v2.5A2.5 2.5 0 1 1 6.5 15z";
    readonly sun: "M12 8a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4";
    readonly moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z";
    readonly sparkle: "M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7z";
    readonly layers: "M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5";
    readonly box: "M12 3.5l8 4.5v8l-8 4.5-8-4.5V8zM4 8l8 4.5L20 8M12 12.5v8";
    readonly card: "M3.5 7A1.5 1.5 0 0 1 5 5.5h14A1.5 1.5 0 0 1 20.5 7v10a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17zM3.5 10h17M7 15h3";
    readonly help: "M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.8v.2";
    readonly filter: "M4 6h16M7 12h10M10 18h4";
    readonly more: "M6 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM12 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2zM18 11a1 1 0 1 1 0 2a1 1 0 0 1 0-2z";
    readonly star: "M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z";
    readonly heart: "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z";
    readonly globe: "M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16zM4 12h16M12 4c2.5 2.5 3.5 5 3.5 8s-1 5.5-3.5 8c-2.5-2.5-3.5-5-3.5-8s1-5.5 3.5-8z";
    readonly lock: "M6.5 11h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8.5 11V8a3.5 3.5 0 0 1 7 0v3";
    readonly download: "M12 4v11M7 10l5 5 5-5M5 20h14";
    readonly upload: "M12 20V9M7 14l5-5 5 5M5 4h14";
    readonly copy: "M9 9h10v10H9zM5 15V5h10";
    readonly edit: "M5 19l1-4L15.5 5.5a2 2 0 0 1 3 3L9 18zM13.5 7.5l3 3";
    readonly trash: "M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13";
    readonly eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9a3 3 0 1 1 0 6a3 3 0 0 1 0-6z";
    readonly link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1";
    readonly bolt: "M13 3L5 13.5h6L10 21l8-10.5h-6z";
    readonly tag: "M4 4h7.5l8.5 8.5-7.5 7.5L4 11.5zM8.5 7.5a1 1 0 1 1 0 2a1 1 0 0 1 0-2z";
    readonly truck: "M3 6h11v10H3zM14 9.5h4l3 3.5v3h-7M7 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4zM17 16a2 2 0 1 1 0 4a2 2 0 0 1 0-4z";
    readonly image: "M4 5.5h16v13H4zM4 16l5-5 4 4 2.5-2.5L20 17M15.5 8.5a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3z";
    readonly play: "M8 5.5v13l11-6.5z";
    readonly sidebar: "M4.5 5h15v14h-15zM9.5 5v14";
    readonly currency: "M12 3v18M16.5 7.5c-.8-1.3-2.4-2-4.5-2-2.6 0-4 1.3-4 3s1.4 2.6 4 3.1 4.5 1.3 4.5 3.3-1.8 3.1-4.5 3.1c-2.3 0-4-.8-4.8-2.3";
    readonly briefcase: "M4 8h16v11H4zM9 8V5.5h6V8M4 13h16";
    readonly building: "M5 20V5h9v15M14 10h5v10M3 20h18M8 8.5h3M8 12h3M8 15.5h3";
};
export type IconName = keyof typeof ICONS;
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
    name: IconName | string;
    size?: number;
    strokeWidth?: number;
    label?: string;
}
export declare function Icon({ name, size, strokeWidth, label, className, style, ...rest }: IconProps): React.JSX.Element;

// Logo.d.ts
export interface LogoMarkProps {
    mark?: MarkKind;
    initials?: string;
    tone?: 'current' | 'primary';
    src?: string;
    svg?: string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Generated brand marks. They follow the system: the monogram's corners track
 * the roundness setting, and color follows either the text color or primary.
 */
export declare function LogoMark(props: LogoMarkProps): React.JSX.Element | null;
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
export declare function Logo(props: LogoProps): React.JSX.Element;

// Motion.d.ts
/** anime.js, re-exported so projects and Claude Design (UIS.anime) use one engine. */
export declare const anime: {
    animate: typeof animate;
    stagger: typeof stagger;
    createTimeline: typeof createTimeline;
    onScroll: typeof onScroll;
    utils: typeof utils;
    eases: typeof eases;
};
export type RevealEffect = 'fade-up' | 'fade' | 'scale-in' | 'slide-left' | 'slide-right' | 'blur-in';
/** True when the theme allows motion and the visitor has not asked for less. */
export declare function useMotionEnabled(): boolean;
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
export declare function Reveal({ as, effect, stagger: gap, delay, duration, trigger, className, style, children }: RevealProps): React.JSX.Element;
/** Counts a number up when it comes into view (stats, prices, KPIs). */
export declare function CountUp({ to, from, decimals, prefix, suffix, duration, className, style }: {
    to: number;
    from?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;

// Root.d.ts
/**
 * Flat props mirror ui.config.json so the same component works from code
 * (pass `config`) and from visual tools like Claude Design (pass attributes).
 * Flat props win over `config`.
 */
export interface RootProps {
    config?: UIConfigInput;
    primary?: string;
    accent?: string;
    neutral?: string;
    mode?: Mode;
    roundness?: number;
    pill?: boolean;
    fontPreset?: FontPresetId;
    displayFont?: string;
    bodyFont?: string;
    buttonCase?: 'normal' | 'upper';
    density?: Density;
    surface?: FloatSurface;
    shadow?: ShadowDepth;
    border?: 'hairline' | 'none';
    projectName?: string;
    wordmark?: string;
    caption?: string;
    initials?: string;
    logoMark?: LogoMark;
    logoVariant?: LogoVariant;
    logoPlacement?: Placement;
    logoSrc?: string;
    markSrc?: string;
    markSvg?: string;
    wordmarkCase?: 'normal' | 'upper';
    wordmarkFont?: 'display' | 'body';
    markTone?: 'current' | 'primary';
    avatarStyle?: AvatarStyle;
    motion?: boolean;
    motionIntensity?: MotionIntensity;
    frontNav?: FrontNav;
    backNav?: BackNav;
    /** Inject the Google Fonts stylesheet for the active fonts. Default true. */
    loadFonts?: boolean;
    /** Paint the page background and text color. Default true. */
    page?: boolean;
    /**
     * Write the theme's CSS variables on this element. Default true. Set false
     * when a stylesheet already provides them (theme.css, or the Claude Design
     * tokens.css bridge) and Root should only supply brand context and fonts.
     */
    vars?: boolean;
    /** Stretch to the parent's height. */
    fill?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function configFromProps(p: RootProps): UIConfigInput;
/** Theme provider. Computes every variable from the config and scopes it to this subtree. */
export declare function Root(props: RootProps): React.JSX.Element;

// context.d.ts
export interface UISContextValue {
    theme: Theme;
    brand: BrandConfig;
}
export declare const UISContext: React.Context<UISContextValue>;
export declare const useUIS: () => UISContextValue;
export declare function cx(...parts: Array<string | false | null | undefined>): string;
/** Treat '', 'default' and undefined as "inherit from the theme". */
export declare function pick<T>(value: T | '' | 'default' | undefined | null, fallbackValue: T): T;
export declare function usePlacement(p?: Placement | 'default' | ''): Placement;
export { resolveConfig };

// nav/back.d.ts
interface BaseBackProps {
    sections?: NavSection[];
    user?: AppUser | null;
    logoPlacement?: Placement;
    logoVariant?: LogoVariant;
    className?: string;
    style?: React.CSSProperties;
}
export interface AppSidebarProps extends BaseBackProps {
    workspace?: Workspace | null;
    search?: boolean | string;
    footer?: React.ReactNode;
}
export declare function AppSidebar({ sections, user, workspace, search, logoPlacement, logoVariant, footer, className, style }: AppSidebarProps): React.JSX.Element;
export interface AppRailProps extends BaseBackProps {
    footerItems?: NavLink[];
    /** Label of an item whose tooltip is pinned open (for static mockups). */
    tip?: string;
}
export declare function AppRail({ sections, user, footerItems, tip, className, style }: AppRailProps): React.JSX.Element;
export interface AppTopbarProps extends BaseBackProps {
    links?: NavLink[];
    actions?: NavAction[];
    search?: boolean | string;
}
export declare function AppTopbar({ links, sections, actions, user, search, logoPlacement, logoVariant, className, style }: AppTopbarProps): React.JSX.Element;
export interface AppDockProps extends BaseBackProps {
    items?: NavLink[];
    search?: boolean | string;
    tip?: string;
}
export declare function AppDock({ items, sections, user, search, tip, className, style }: AppDockProps): React.JSX.Element;
export interface AppShellProps extends BaseBackProps {
    variant?: BackNav;
    workspace?: Workspace | null;
    search?: boolean | string;
    actions?: NavAction[];
    footerItems?: NavLink[];
    tip?: string;
    /** Extra content for the slim header used by the dock layout. */
    header?: React.ReactNode;
    children?: React.ReactNode;
}
export declare function AppShell({ variant, children, header, ...p }: AppShellProps): React.JSX.Element;
export interface PageHeaderProps {
    title: string;
    description?: string;
    crumbs?: string[];
    actions?: React.ReactNode;
    /** Children render in the actions slot (handy from visual tools). */
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
export declare function PageHeader({ title, description, crumbs, actions, children, className, style }: PageHeaderProps): React.JSX.Element;
export {};

// nav/front.d.ts
interface BaseFrontProps {
    links?: NavLink[];
    actions?: NavAction[];
    cta?: NavCta | null;
    /** Where the logo sits. Defaults to the brand's placement. */
    logoPlacement?: Placement;
    logoVariant?: LogoVariant;
    /** 'image' = sits on photography: light text, transparent where it applies. */
    tone?: 'default' | 'image';
    className?: string;
    style?: React.CSSProperties;
}
export interface NavDockProps extends Omit<BaseFrontProps, 'logoPlacement'> {
    /** Header logo position, 'dock' puts the mark inside the dock, 'none' hides it. */
    logoPlacement?: Placement | 'dock' | 'none';
    /** Show the menu toggle that opens the explore panel. */
    menu?: boolean;
    /** Explore panel open. */
    open?: boolean;
    panelTitle?: string;
    panel?: React.ReactNode;
    fixed?: boolean;
}
export declare function NavDock({ links, actions, cta, logoPlacement, logoVariant, tone, menu, open, panelTitle, panel, fixed, className, style }: NavDockProps): React.JSX.Element;
export interface NavIslandProps extends BaseFrontProps {
    fixed?: boolean;
    width?: number;
}
export declare function NavIsland({ links, actions, cta, logoPlacement, logoVariant, tone, fixed, width, className, style }: NavIslandProps): React.JSX.Element;
export interface NavBarProps extends BaseFrontProps {
    transparent?: boolean;
    sticky?: boolean;
    secondary?: NavCta | null;
}
export declare function NavBar({ links, actions, cta, secondary, logoPlacement, logoVariant, tone, transparent, sticky, className, style }: NavBarProps): React.JSX.Element;
export interface NavStackedProps extends BaseFrontProps {
    utility?: {
        text?: string;
        links?: NavLink[];
    } | null;
    search?: boolean;
}
export declare function NavStacked({ links, actions, logoPlacement, logoVariant, utility, search, className, style }: NavStackedProps): React.JSX.Element;
export interface NavMinimalProps extends BaseFrontProps {
    open?: boolean;
    menuLabel?: string;
    /** Bar: 'classic' logo + CTA + Menu button, 'corners' text-only MENU / logo / CTA, 'capsule' centered floating Menu capsule. */
    layout?: 'classic' | 'corners' | 'capsule';
    /** Open menu: 'fullscreen' index, 'split' dark index + brand panel, 'drawer' side panel. */
    menuStyle?: 'fullscreen' | 'split' | 'drawer';
    /** Content for the open menu's side column (contact, address). Children work too. */
    aside?: React.ReactNode;
    children?: React.ReactNode;
}
export declare function NavMinimal({ links, cta, logoPlacement, logoVariant, tone, open, menuLabel, layout, menuStyle, aside, children, className, style }: NavMinimalProps): React.JSX.Element;
export interface NavMobileProps extends BaseFrontProps {
    variant?: 'sheet' | 'tabbar' | 'floating';
    open?: boolean;
    transparent?: boolean;
}
export declare function NavMobile({ variant, links, actions, cta, logoPlacement, logoVariant, tone, open, transparent, className, style }: NavMobileProps): React.JSX.Element;
export type SiteNavProps = {
    variant?: FrontNav;
} & NavDockProps & NavIslandProps & NavBarProps & NavStackedProps & NavMinimalProps;
export declare function SiteNav({ variant, ...props }: SiteNavProps): React.JSX.Element;
export {};

// nav/shared.d.ts
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
export declare function A({ link, className, children, title }: {
    link: NavLink;
    className: string;
    children: React.ReactNode;
    title?: string;
}): React.JSX.Element;
export declare const arr: <T>(v: T[] | undefined | null) => T[];

// primitives.d.ts
type Anchorish = {
    href?: string;
    onClick?: React.MouseEventHandler;
    target?: string;
};
export interface ButtonProps extends Anchorish {
    variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'light' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    icon?: IconName | string;
    iconRight?: IconName | string;
    iconOnly?: boolean;
    block?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    label?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Button({ variant, size, icon, iconRight, iconOnly, block, disabled, type, label, href, onClick, target, className, style, children }: ButtonProps): React.JSX.Element;
export interface IconButtonProps extends Anchorish {
    icon: IconName | string;
    label: string;
    count?: number | string;
    dot?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare function IconButton({ icon, label, count, dot, href, onClick, className, style }: IconButtonProps): React.JSX.Element;
export type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export interface BadgeProps {
    tone?: Tone;
    solid?: boolean;
    outline?: boolean;
    dot?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Badge({ tone, solid, outline, dot, className, style, children }: BadgeProps): React.JSX.Element;
export interface FieldProps {
    label?: string;
    hint?: string;
    error?: string;
    id?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Field({ label, hint, error, id, className, style, children }: FieldProps): React.JSX.Element;
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    hint?: string;
    error?: string;
    icon?: IconName | string;
    kbd?: string;
    size?: 'sm' | 'md';
}
export declare function Input({ label, hint, error, icon, kbd, size, id, className, style, ...rest }: InputProps): React.JSX.Element;
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: string;
    options: Array<string | {
        label: string;
        value: string;
    }>;
}
export declare function Select({ label, hint, options, id, className, style, ...rest }: SelectProps): React.JSX.Element;
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    hint?: string;
}
export declare function Textarea({ label, hint, id, className, style, ...rest }: TextareaProps): React.JSX.Element;
export interface ToggleProps {
    label?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Switch({ label, checked, defaultChecked, onChange, className, style }: ToggleProps): React.JSX.Element;
export declare function Checkbox({ label, checked, defaultChecked, onChange, className, style }: ToggleProps): React.JSX.Element;
export interface CardProps {
    variant?: 'default' | 'flat' | 'raised' | 'sunken';
    interactive?: boolean;
    flush?: boolean;
    as?: 'div' | 'article' | 'section' | 'a';
    href?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Card({ variant, interactive, flush, as, href, className, style, children }: CardProps): React.JSX.Element;
export declare function Media({ src, alt, ratio, className, style, children }: {
    src?: string;
    alt?: string;
    ratio?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}): React.JSX.Element;
export declare function Divider({ vertical, className, style }: {
    vertical?: boolean;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Kbd({ children, className, style }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export interface TabItem {
    label: string;
    value?: string;
    icon?: IconName | string;
    href?: string;
}
export interface TabsProps {
    items: Array<TabItem | string>;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    variant?: 'segmented' | 'pill' | 'underline' | 'plain';
    className?: string;
    style?: React.CSSProperties;
}
export declare function Tabs({ items, value, defaultValue, onChange, variant, className, style }: TabsProps): React.JSX.Element;
export declare function Tooltip({ children, className, style }: {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Toast({ title, children, icon, action, className, style }: {
    title?: string;
    children?: React.ReactNode;
    icon?: IconName | string;
    action?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Alert({ tone, title, children, icon, className, style }: {
    tone?: 'info' | 'success' | 'warning' | 'danger';
    title?: string;
    children?: React.ReactNode;
    icon?: IconName | string;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Progress({ value, className, style }: {
    value?: number;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export interface StatProps {
    label: string;
    value: React.ReactNode;
    delta?: string;
    trend?: 'up' | 'down';
    icon?: IconName | string;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Stat({ label, value, delta, trend, icon, className, style }: StatProps): React.JSX.Element;
export interface TableColumn {
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    width?: string | number;
}
/** A cell is any node, or data: { tone, label } renders a status Badge, { strong } bold text. */
export type TableCell = React.ReactNode | {
    tone: Tone;
    label: string;
} | {
    strong: string;
};
export interface TableProps {
    columns: TableColumn[];
    rows: Array<Record<string, TableCell>>;
    className?: string;
    style?: React.CSSProperties;
}
export declare function Table({ columns, rows, className, style }: TableProps): React.JSX.Element;
export declare function Popover({ title, className, style, children }: {
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}): React.JSX.Element;
export interface MenuItem {
    label: string;
    icon?: IconName | string;
    href?: string;
    kbd?: string;
    onClick?: () => void;
}
export declare function Menu({ items, className, style }: {
    items: MenuItem[];
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Chips({ items, className, style }: {
    items: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
    }>;
    className?: string;
    style?: React.CSSProperties;
}): React.JSX.Element;
export declare function Scrim({ onClick }: {
    onClick?: () => void;
}): React.JSX.Element;
export interface DrawerProps {
    title?: string;
    open?: boolean;
    side?: 'right' | 'left';
    floating?: boolean;
    footer?: React.ReactNode;
    onClose?: () => void;
    scrim?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Drawer({ title, open, side, floating, footer, onClose, scrim, className, style, children }: DrawerProps): React.JSX.Element | null;
export interface DialogProps {
    title?: string;
    description?: string;
    open?: boolean;
    actions?: React.ReactNode;
    onClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}
export declare function Dialog({ title, description, open, actions, onClose, className, style, children }: DialogProps): React.JSX.Element | null;
