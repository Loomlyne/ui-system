// UI System components (window.UIS). Types are documentation.
type Mode = 'light' | 'dark';
type Placement = 'left' | 'center' | 'right';
type LogoVariant = 'lockup' | 'stacked' | 'mark' | 'wordmark';
type LogoMark = 'monogram' | 'ring' | 'spark' | 'stack' | 'orbit' | 'none' | 'custom';
type FontPresetId = 'modern' | 'geometric' | 'editorial' | 'grotesk' | 'humanist' | 'classic' | 'retail';
type PresetId = 'retail-editorial';
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
/** One Hugeicons node: [tag, attributes]. */
export type IconNode = readonly [string, Readonly<Record<string, string | number>>];
/**
 * Every icon comes from Hugeicons (https://hugeicons.com, free stroke-rounded set, MIT,
 * package @hugeicons/core-free-icons). Names stay short and stable; the Hugeicons glyph
 * behind each name may change without breaking callers. Never draw a custom icon here:
 * pick the closest Hugeicons glyph and add a name.
 */
declare const SOURCE: {
    readonly menu: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly x: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly search: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly bell: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly home: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly grid: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly chart: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly activity: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly trend: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly users: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly user: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly settings: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly target: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly sliders: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly bag: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly cart: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly calendar: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly inbox: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly file: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly folder: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly plus: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly check: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'chevron-down': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'chevron-up': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'chevron-right': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'chevron-left': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'chevrons-updown': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'arrow-right': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'arrow-up-right': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly clock: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly pin: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly phone: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly mail: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly message: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly logout: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly command: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly sun: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly moon: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly sparkle: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly layers: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly box: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly card: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly help: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly filter: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly more: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly star: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly heart: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly globe: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly lock: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly download: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly upload: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly copy: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly edit: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly trash: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly eye: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'eye-off': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly link: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly bolt: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly tag: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly truck: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly image: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly play: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly sidebar: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly currency: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly briefcase: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly building: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly receipt: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly wallet: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly map: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly car: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly shield: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly share: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly refresh: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly ruler: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly bookmark: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly camera: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly store: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly list: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly route: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'check-circle': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'alert-circle': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly info: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly warning: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly 'x-circle': [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
    readonly health: [string, {
        [key: string]: string | number;
    }][] | readonly (readonly [string, {
        readonly [key: string]: string | number;
    }])[];
};
export type IconName = keyof typeof SOURCE;
export declare const ICONS: Record<IconName, IconNode[]>;
/** Hugeicons stroke width. */
export declare const ICON_STROKE = 1.5;
export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
    name: IconName | string;
    size?: number;
    strokeWidth?: number;
    label?: string;
}
export declare function Icon({ name, size, strokeWidth, label, className, style, ...rest }: IconProps): React.JSX.Element;
export {};

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
    /** Named design language (e.g. 'retail-editorial'). Other props still win over it. */
    preset?: PresetId;
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
    /** 'search' reads --uis-r-search, --uis-search-bg and --uis-search-border (a grey pill in retail-editorial). */
    variant?: 'default' | 'search';
}
export declare function Input({ label, hint, error, icon, kbd, size, variant, id, type, className, style, ...rest }: InputProps): React.JSX.Element;
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
