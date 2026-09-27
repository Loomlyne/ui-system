// Component catalog for the Claude Design System export.
// Each entry: name, group, height (preview row px), readme (markdown, first sentence = summary), preview (JS expression).
// Preview expressions run inside a prelude that defines: U (window.UIS), h (createElement),
// links, actions, cta, sections, user, workspace, hero(child, height), stage(child, height), row(...children).

export const PRELUDE = `
var U = window.UIS, h = React.createElement;
var links = [{ label: 'Home', active: true }, { label: 'Work' }, { label: 'Services' }, { label: 'About' }, { label: 'Contact' }];
var actions = [{ icon: 'search', label: 'Search' }, { icon: 'bag', label: 'Cart', count: 2 }];
var cta = { label: 'Get started' };
var sections = [
  { items: [{ label: 'Overview', icon: 'home', active: true }, { label: 'Projects', icon: 'folder', badge: 12 }, { label: 'Clients', icon: 'users' }, { label: 'Invoices', icon: 'file' }, { label: 'Calendar', icon: 'calendar' }] },
  { label: 'Workspace', items: [{ label: 'Reports', icon: 'chart' }, { label: 'Settings', icon: 'settings' }] }
];
var user = { name: 'Your Name', meta: 'Owner' };
var workspace = { name: 'Studio', plan: 'Pro plan' };
function hero(child, height) { return h('div', { style: { position: 'relative', height: height || 360, overflow: 'hidden', background: 'linear-gradient(160deg, var(--neutral-700), var(--neutral-950))' } }, child); }
function stage(child, height) { return h('div', { style: { position: 'relative', height: height || 360, overflow: 'hidden', background: 'var(--bg)' } }, child); }
function row() { return h.apply(null, ['div', { style: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: 20 } }].concat([].slice.call(arguments))); }
function page() { return h('div', { style: { padding: 24 } }, h(U.PageHeader, { title: 'Overview', description: 'Everything at a glance.', crumbs: ['Workspace', 'Overview'], actions: h(U.Button, { icon: 'plus' }, 'New project'), style: { padding: '8px 0 20px' } }), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 } }, h(U.Card, null, h(U.Stat, { label: 'Revenue', value: '[AMOUNT]', delta: '+12%' })), h(U.Card, null, h(U.Stat, { label: 'Projects', value: '24' })), h(U.Card, null, h(U.Stat, { label: 'Clients', value: '18' })))); }
`;

export const CATALOG = [
  {
    name: 'Root', group: 'Theme', height: 220,
    readme: `The theme provider: wrap every page or artboard in it and pass the project's brand as props.

Every other component reads its CSS variables and brand context. Root computes the whole theme (color scales, contrast-safe text colors, radius roles, fonts, shadows) from a handful of inputs, so one change restyles everything.

**Props (all optional, defaults in brackets)**
- Color: \`primary\` [#1C1B19], \`accent\` [#E0562B], \`neutral\` [#77736B, or 'auto'], \`mode\` light|dark [light]
- Shape: \`roundness\` 0–100 [60], \`pill\` boolean [false]
- Type: \`fontPreset\` modern|geometric|editorial|grotesk|humanist|classic [modern], \`displayFont\`, \`bodyFont\` (any Google Fonts family), \`buttonCase\` normal|upper
- Feel: \`density\` compact|comfortable|spacious, \`surface\` solid|glass (floating navs and popovers), \`shadow\` none|soft|medium|deep, \`border\` hairline|none
- Brand: \`wordmark\`, \`caption\`, \`initials\`, \`logoMark\` monogram|ring|spark|stack|orbit|none|custom, \`logoVariant\` lockup|stacked|mark|wordmark, \`logoPlacement\` left|center|right, \`logoSrc\`, \`markSrc\`, \`markSvg\`, \`wordmarkCase\`, \`markTone\` current|primary
- Nav defaults: \`frontNav\` dock|island|bar|stacked|minimal, \`backNav\` sidebar|rail|inset|topbar|dock
- Rendering: \`config\` (a whole ui.config object), \`page\` [true] paints bg and ink, \`fill\` stretches to parent height, \`vars\` [true] writes variables (false = inherit them from tokens.css), \`loadFonts\` [true]

**Do** set brand props once on Root, never per component. **Don't** hard-code hex values in markup: use \`var(--uis-primary)\`, \`var(--uis-ink)\` and the other \`--uis-*\` variables.`,
    preview: `h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 0 } },
  h(U.Root, { roundness: 0, primary: '#1C1B19', accent: '#E0562B', style: { padding: 20, display: 'flex', flexDirection: 'column', gap: 12 } }, h(U.Logo, { wordmark: 'Sharp', mark: 'stack' }), h('div', { style: { display: 'flex', gap: 8 } }, h(U.Button, null, 'Primary'), h(U.Button, { variant: 'outline' }, 'Outline')), h(U.Badge, { tone: 'accent', dot: true, style: { alignSelf: 'flex-start' } }, 'roundness 0')),
  h(U.Root, { roundness: 55, primary: '#2F5D50', accent: '#C4952E', fontPreset: 'editorial', style: { padding: 20, display: 'flex', flexDirection: 'column', gap: 12 } }, h(U.Logo, { wordmark: 'Soft', mark: 'ring' }), h('div', { style: { display: 'flex', gap: 8 } }, h(U.Button, null, 'Primary'), h(U.Button, { variant: 'outline' }, 'Outline')), h(U.Badge, { tone: 'accent', dot: true, style: { alignSelf: 'flex-start' } }, 'roundness 55')),
  h(U.Root, { roundness: 100, pill: true, primary: '#2F6BD8', accent: '#E0562B', mode: 'dark', fontPreset: 'grotesk', style: { padding: 20, display: 'flex', flexDirection: 'column', gap: 12 } }, h(U.Logo, { wordmark: 'Round', mark: 'orbit' }), h('div', { style: { display: 'flex', gap: 8 } }, h(U.Button, null, 'Primary'), h(U.Button, { variant: 'outline' }, 'Outline')), h(U.Badge, { tone: 'accent', dot: true, style: { alignSelf: 'flex-start' } }, 'pill + dark'))
)`,
    rootless: true,
  },
  {
    name: 'Logo', group: 'Brand', height: 150,
    readme: `The brand logo in four arrangements: \`lockup\` (mark + wordmark), \`stacked\`, \`mark\` and \`wordmark\`.

Without props it renders the brand set on Root. The generated marks (monogram, ring, spark, stack, orbit) follow the system: the monogram's corners track \`roundness\`, and \`markTone\` decides whether the mark follows the text color (\`current\`, knocks the letter out so it works on any background) or the brand \`primary\`.

**Props:** \`variant\`, \`size\` sm|md|lg|xl, \`wordmark\`, \`caption\` ('' hides it), \`mark\`, \`initials\`, \`tone\`, \`src\` (full logo image, replaces the lockup), \`markSrc\` (mark-only image), \`href\`.

**Custom logos:** upload the client's SVG/PNG and pass it as \`logoSrc\` (full logo) and \`markSrc\` (mark) on Root; rails, docks and favicons use the mark.

**Clear space:** keep at least the mark's height clear on every side. **Minimum size:** mark 20px, lockup 96px wide. Use \`stacked\` only on splash screens, covers and footers, never inside a nav bar.`,
    preview: `row(h(U.Logo, null), h(U.Logo, { variant: 'stacked' }), h(U.Logo, { variant: 'mark', size: 'lg' }), h(U.Logo, { variant: 'wordmark', size: 'lg' }), h(U.Logo, { mark: 'ring' }), h(U.Logo, { mark: 'spark' }), h(U.Logo, { mark: 'stack' }), h(U.Logo, { mark: 'orbit', tone: 'primary' }))`,
  },
  {
    name: 'Icon', group: 'Brand', height: 110,
    readme: `Stroke icons drawn for this system on a 24px grid (1.75 stroke, round caps and joins); they inherit \`currentColor\`.

Use by name: \`<Icon name="search" />\`. Names: menu, x, search, bell, home, grid, chart, activity, trend, users, user, settings, sliders, target, bag, cart, calendar, inbox, file, folder, plus, check, chevron-down, chevron-up, chevron-right, chevron-left, chevrons-updown, arrow-right, arrow-up-right, clock, pin, phone, mail, message, logout, command, sun, moon, sparkle, layers, box, card, help, filter, more, star, heart, globe, lock, download, upload, copy, edit, trash, eye, link, bolt, tag, truck, image, play, sidebar, currency, briefcase, building.

**Do** pair icon-only buttons with a \`label\`. **Don't** mix in emoji or another icon set.`,
    preview: `row.apply(null, Object.keys(U.ICONS).map(function (n) { return h('span', { key: n, title: n, style: { display: 'inline-grid', placeItems: 'center', width: 36, height: 36, color: 'var(--ink)' } }, h(U.Icon, { name: n, size: 22 })); }))`,
  },
  {
    name: 'Button', group: 'Actions', height: 150,
    readme: `The button: \`primary\` for the one main action on a screen, \`secondary\`/\`outline\`/\`ghost\` for the rest.

Height follows density (\`--uis-h-sm|md|lg\`), corners follow \`--uis-r-control\` (full pill when Root \`pill\` is on), letter case follows \`buttonCase\`.

**Props:** \`variant\` primary|accent|secondary|outline|ghost|soft|danger|light|glass, \`size\` sm|md|lg, \`icon\`, \`iconRight\`, \`iconOnly\` (+ \`label\`), \`block\`, \`href\` (renders a link), \`disabled\`.

Use \`light\` and \`glass\` only on photography. One \`primary\` per view. Labels are verbs in sentence case ("Book a table", not "Submit").`,
    preview: `h('div', null, row(h(U.Button, null, 'Primary'), h(U.Button, { variant: 'accent' }, 'Accent'), h(U.Button, { variant: 'secondary' }, 'Secondary'), h(U.Button, { variant: 'outline' }, 'Outline'), h(U.Button, { variant: 'ghost' }, 'Ghost'), h(U.Button, { variant: 'soft' }, 'Soft'), h(U.Button, { variant: 'danger' }, 'Delete')), row(h(U.Button, { size: 'sm', icon: 'plus' }, 'Small'), h(U.Button, { iconRight: 'arrow-right' }, 'Medium'), h(U.Button, { size: 'lg' }, 'Large'), h(U.Button, { iconOnly: true, icon: 'plus', label: 'Add' }), h(U.Button, { disabled: true }, 'Disabled')))`,
  },
  {
    name: 'IconButton', group: 'Actions', height: 90,
    readme: `A compact icon-only button for navs and toolbars, with an optional \`count\` bubble or \`dot\`.

**Props:** \`icon\`, \`label\` (required, becomes the accessible name and tooltip), \`count\`, \`dot\`, \`href\`, \`onClick\`.`,
    preview: `row(h(U.IconButton, { icon: 'search', label: 'Search' }), h(U.IconButton, { icon: 'bag', label: 'Cart', count: 3 }), h(U.IconButton, { icon: 'bell', label: 'Notifications', dot: true }), h(U.IconButton, { icon: 'menu', label: 'Menu' }))`,
  },
  {
    name: 'Input', group: 'Forms', height: 130,
    readme: `A text field with optional label, hint, error, leading icon and keyboard hint.

Corners follow \`--uis-r-field\`. Focus draws a \`--uis-focus\` border and a soft ring. **Props:** \`label\`, \`hint\`, \`error\`, \`icon\`, \`kbd\`, \`size\` sm|md, plus any native input attribute.

Always give a visible \`label\` in forms; a placeholder is not a label.`,
    preview: `row(h(U.Input, { label: 'Email', placeholder: 'you@example.com', icon: 'mail', hint: 'We reply within a day.', style: { width: 280 } }), h(U.Input, { label: 'Phone', defaultValue: '+971', error: 'Enter a full number.', style: { width: 220 } }), h(U.Input, { size: 'sm', icon: 'search', placeholder: 'Search', kbd: '⌘K', style: { width: 240 } }))`,
  },
  {
    name: 'Select', group: 'Forms', height: 110,
    readme: `A native select styled like Input, with a chevron.

**Props:** \`label\`, \`hint\`, \`options\` (strings or {label, value}), plus native select attributes.`,
    preview: `row(h(U.Select, { label: 'Plan', options: ['Starter', 'Pro', 'Business'], style: { width: 220 } }), h(U.Select, { label: 'Language', options: ['English', 'Arabic', 'French'], style: { width: 220 } }))`,
  },
  {
    name: 'Textarea', group: 'Forms', height: 170,
    readme: `A multi-line field. Its corners cap at 20px so pill mode never produces a lozenge.

**Props:** \`label\`, \`hint\`, plus native textarea attributes.`,
    preview: `row(h(U.Textarea, { label: 'Message', placeholder: 'Tell us about the project', style: { width: 420 } }))`,
  },
  {
    name: 'Switch', group: 'Forms', height: 80,
    readme: `An on/off toggle for settings that apply immediately. Use Checkbox for choices submitted with a form.

**Props:** \`label\`, \`checked\`, \`defaultChecked\`, \`onChange(checked)\`.`,
    preview: `row(h(U.Switch, { label: 'Email notifications', defaultChecked: true }), h(U.Switch, { label: 'Dark mode' }))`,
  },
  {
    name: 'Checkbox', group: 'Forms', height: 80,
    readme: `A checkbox for form choices.

**Props:** \`label\`, \`checked\`, \`defaultChecked\`, \`onChange(checked)\`.`,
    preview: `row(h(U.Checkbox, { label: 'Remember me', defaultChecked: true }), h(U.Checkbox, { label: 'Send me updates' }))`,
  },
  {
    name: 'Badge', group: 'Display', height: 110,
    readme: `A short status label. Tone carries meaning: success, warning, danger, info; primary and accent for brand emphasis; neutral for counts and metadata.

**Props:** \`tone\` neutral|primary|accent|success|warning|danger|info, \`solid\`, \`outline\`, \`dot\`. Always pair status color with a word.`,
    preview: `h('div', null, row(h(U.Badge, null, 'Neutral'), h(U.Badge, { tone: 'primary' }, 'Primary'), h(U.Badge, { tone: 'accent' }, 'New'), h(U.Badge, { tone: 'success', dot: true }, 'Paid'), h(U.Badge, { tone: 'warning', dot: true }, 'Pending'), h(U.Badge, { tone: 'danger', dot: true }, 'Overdue'), h(U.Badge, { tone: 'info' }, 'Draft')), row(h(U.Badge, { tone: 'primary', solid: true }, 'Solid primary'), h(U.Badge, { tone: 'accent', solid: true }, 'Solid accent'), h(U.Badge, { outline: true }, 'Outline')))`,
  },
  {
    name: 'Avatar', group: 'Display', height: 150,
    readme: `A person or account. With a \`src\` it shows the real photo; without one it draws a DiceBear avatar seeded by the name, so the same person always gets the same face. Never a stock or invented photo.

Styles (all CC0, no attribution): \`notionists-neutral\` (default), \`lorelei-neutral\`, \`thumbs\`, \`glass\`, \`shapes\`, or \`initials\` for themed letters. Set it once with Root \`avatarStyle\` (config \`avatars.style\`), or per avatar with \`avatarStyle\`.

Shape follows roundness: softened square at low roundness, circle from 70 or in pill mode.

**Props:** \`name\` (seed and label), \`src\`, \`initials\`, \`avatarStyle\`, \`size\` sm|md|lg|xl. \`AvatarGroup\` overlaps several. \`UIS.avatarSvg(seed, style)\` returns the SVG markup.`,
    preview: `h('div', null, row(h(U.Avatar, { name: 'Amira Haddad', size: 'sm' }), h(U.Avatar, { name: 'Omar Said' }), h(U.Avatar, { name: 'Lina Farah', size: 'lg' }), h(U.Avatar, { name: 'Sami Karim', size: 'xl' }), h(U.AvatarGroup, { people: [{ name: 'Ava' }, { name: 'Noor' }, { name: 'Zaid' }, { name: 'Maya' }] })), row.apply(null, ['notionists-neutral', 'lorelei-neutral', 'thumbs', 'glass', 'shapes', 'initials'].map(function (st) { return h('span', { key: st, style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' } }, h(U.Avatar, { name: 'Your Name', avatarStyle: st, size: 'lg' }), st); })))`,
  },
  {
    name: 'Card', group: 'Display', height: 190,
    readme: `A surface for grouped content. Padding follows density; corners follow \`--uis-r-card\`; the border follows the \`border\` setting.

**Props:** \`variant\` default|flat|raised|sunken, \`interactive\` (hover deepens the shadow and border, no movement), \`flush\` (no padding, for media), \`href\`, \`as\`.`,
    preview: `h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, padding: 20 } }, h(U.Card, null, h('h3', { className: 'uis-h3' }, 'Default'), h('p', { className: 'uis-body-s uis-muted' }, 'Resting surface with a hairline.')), h(U.Card, { variant: 'raised', interactive: true }, h('h3', { className: 'uis-h3' }, 'Raised'), h('p', { className: 'uis-body-s uis-muted' }, 'Interactive: shadow deepens on hover.')), h(U.Card, { variant: 'sunken' }, h('h3', { className: 'uis-h3' }, 'Sunken'), h('p', { className: 'uis-body-s uis-muted' }, 'For wells and empty states.')))`,
  },
  {
    name: 'Stat', group: 'Display', height: 150,
    readme: `A key number with label and optional trend. The value uses the display face with tabular numerals.

**Props:** \`label\`, \`value\`, \`delta\`, \`trend\` up|down, \`icon\`. Use real figures only; show a placeholder like [AMOUNT] until data exists.`,
    preview: `h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, padding: 20 } }, h(U.Card, null, h(U.Stat, { label: 'Revenue', value: '[AMOUNT]', delta: '+12%', icon: 'currency' })), h(U.Card, null, h(U.Stat, { label: 'Active projects', value: '24', delta: '+3' })), h(U.Card, null, h(U.Stat, { label: 'Churn', value: '1.8%', delta: '-0.4%', trend: 'down' })))`,
  },
  {
    name: 'Table', group: 'Display', height: 250,
    readme: `A data table inside a card-radius frame, with a tinted header and row hover.

**Props:** \`columns\` [{key, label, align, width}], \`rows\` (objects keyed by column). A cell is text, a node, or data: \`{ tone, label }\` renders a status Badge and \`{ strong }\` bold text, so tables work from visual tools without code. Put the primary identifier in the first column, status as a Badge.`,
    preview: `h('div', { style: { padding: 20 } }, h(U.Table, { columns: [{ key: 'client', label: 'Client' }, { key: 'project', label: 'Project' }, { key: 'status', label: 'Status' }, { key: 'amount', label: 'Amount', align: 'right' }], rows: [{ client: h('strong', null, 'Client A'), project: 'Website', status: h(U.Badge, { tone: 'success', dot: true }, 'Paid'), amount: '[AMOUNT]' }, { client: h('strong', null, 'Client B'), project: 'Branding', status: h(U.Badge, { tone: 'warning', dot: true }, 'Pending'), amount: '[AMOUNT]' }, { client: h('strong', null, 'Client C'), project: 'Store', status: h(U.Badge, { tone: 'danger', dot: true }, 'Overdue'), amount: '[AMOUNT]' }] }))`,
  },
  {
    name: 'Tabs', group: 'Display', height: 150,
    readme: `Switch between views of the same content: \`segmented\` for compact filters, \`pill\` for prominent sections, \`underline\` for page-level tabs.

**Props:** \`items\` (strings or {label, value, icon}), \`value\`/\`defaultValue\`, \`onChange\`, \`variant\` segmented|pill|underline|plain.`,
    preview: `h('div', null, row(h(U.Tabs, { items: ['Day', 'Week', 'Month'] }), h(U.Tabs, { items: ['All', 'Active', 'Archived'], variant: 'pill' })), h('div', { style: { padding: '0 20px 20px' } }, h(U.Tabs, { items: ['Overview', 'Activity', 'Settings'], variant: 'underline' })))`,
  },
  {
    name: 'Progress', group: 'Display', height: 90,
    readme: `A thin progress bar in the primary color. **Props:** \`value\` 0–100.`,
    preview: `h('div', { style: { padding: 20, display: 'grid', gap: 12, maxWidth: 420 } }, h(U.Progress, { value: 32 }), h(U.Progress, { value: 78 }))`,
  },
  {
    name: 'Kbd', group: 'Display', height: 80,
    readme: `A keyboard key hint in the mono face.`,
    preview: `row(h(U.Kbd, null, '⌘K'), h(U.Kbd, null, 'Esc'), h(U.Kbd, null, '⇧ Enter'))`,
  },
  {
    name: 'Reveal', group: 'Motion', height: 190,
    readme: `Entrance animation powered by anime.js v4. Wrap a section or a list; with \`stagger\` each direct child animates in turn when it scrolls into view.

Effects: \`fade-up\` (default), \`fade\`, \`scale-in\`, \`slide-left\`, \`slide-right\`, \`blur-in\`. Timing follows Root \`motionIntensity\` (subtle 620ms, expressive 950ms). Nothing moves when \`motion\` is false or the visitor prefers reduced motion.

**Props:** \`effect\`, \`stagger\` (ms), \`delay\`, \`duration\`, \`trigger\` view|mount, \`as\`. Anything custom: \`UIS.anime.animate(targets, params)\`, \`stagger\`, \`createTimeline\`, \`onScroll\`.`,
    preview: `h(U.Reveal, { stagger: 90, trigger: 'mount', style: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, padding: 20 } }, h(U.Card, null, h('h3', { className: 'uis-h3' }, 'One')), h(U.Card, null, h('h3', { className: 'uis-h3' }, 'Two')), h(U.Card, null, h('h3', { className: 'uis-h3' }, 'Three')))`,
  },
  {
    name: 'CountUp', group: 'Motion', height: 130,
    readme: `Counts a number up when it scrolls into view (anime.js). For stats, prices and KPIs with real values only.

**Props:** \`to\`, \`from\`, \`decimals\`, \`prefix\`, \`suffix\`, \`duration\`. Shows the final value immediately under reduced motion.`,
    preview: `row(h(U.Card, null, h('div', { className: 'uis-stat' }, h('span', { className: 'uis-stat__label' }, 'Projects shipped'), h(U.CountUp, { to: 128, className: 'uis-stat__value' }))), h(U.Card, null, h('div', { className: 'uis-stat' }, h('span', { className: 'uis-stat__label' }, 'Conversion'), h(U.CountUp, { to: 4.8, decimals: 1, suffix: '%', className: 'uis-stat__value' }))))`,
  },
  {
    name: 'Alert', group: 'Feedback', height: 190,
    readme: `An inline message in the flow of a page. **Props:** \`tone\` info|success|warning|danger, \`title\`, \`icon\`, children.`,
    preview: `h('div', { style: { padding: 20, display: 'grid', gap: 10, maxWidth: 560 } }, h(U.Alert, { title: 'Heads up' }, 'Your trial ends in 3 days.'), h(U.Alert, { tone: 'success', title: 'Published' }, 'The site is live.'), h(U.Alert, { tone: 'danger', title: 'Payment failed' }, 'Update the card on file.'))`,
  },
  {
    name: 'Toast', group: 'Feedback', height: 120,
    readme: `A short confirmation on the inverse surface, shown after an action. **Props:** \`title\`, \`icon\`, \`action\`, children. Keep it to one line of detail.`,
    preview: `row(h(U.Toast, { title: 'Saved', action: h(U.Button, { size: 'sm', variant: 'ghost' }, 'Undo') }, 'Your changes are live.'))`,
  },
  {
    name: 'Tooltip', group: 'Feedback', height: 80,
    readme: `A small label on the inverse surface for icon-only controls. Rails show them on hover automatically.`,
    preview: `row(h(U.Tooltip, null, 'Notifications'), h(U.Tooltip, null, 'Invite teammates'))`,
  },
  {
    name: 'Popover', group: 'Overlays', height: 260,
    readme: `A floating panel on the float surface (solid or glass). Corners follow \`--uis-r-panel\`. Holds a Menu, Chips, or short content.

**Props:** \`title\`, children. \`Menu\` takes \`items\` [{label, icon, kbd, href}]; \`Chips\` takes \`items\` [{label, href}].`,
    preview: `row(h(U.Popover, { title: 'Account' }, h(U.Menu, { items: [{ label: 'Profile', icon: 'user' }, { label: 'Billing', icon: 'card' }, { label: 'Sign out', icon: 'logout', kbd: '⇧Q' }] })), h(U.Popover, { title: 'Explore' }, h(U.Chips, { items: [{ label: 'Menu' }, { label: 'Catering' }, { label: 'About' }, { label: 'Contact' }] })))`,
  },
  {
    name: 'Drawer', group: 'Overlays', height: 380,
    readme: `A side panel for carts, details and settings, over a scrim. \`floating\` detaches it with panel-radius corners.

**Props:** \`title\`, \`open\`, \`side\` right|left, \`floating\`, \`footer\`, \`onClose\`, \`scrim\`, children. Place it inside a positioned container.`,
    preview: `stage(h(React.Fragment, null, h('div', { style: { padding: 24 } }, h('h2', { className: 'uis-h2' }, 'Page content')), h(U.Drawer, { title: 'Your order', floating: true, footer: h(U.Button, { block: true }, 'Checkout') }, h('p', { className: 'uis-body-s uis-muted' }, 'Your cart is empty. Add items from the menu.'))), 380)`,
  },
  {
    name: 'Dialog', group: 'Overlays', height: 340,
    readme: `A centered modal for confirmations. **Props:** \`title\`, \`description\`, \`open\`, \`actions\`, \`onClose\`, children. Put the destructive or primary action last.`,
    preview: `stage(h(U.Dialog, { title: 'Delete project?', description: 'This removes the project and its files for everyone.', actions: h(React.Fragment, null, h(U.Button, { variant: 'ghost' }, 'Cancel'), h(U.Button, { variant: 'danger' }, 'Delete')) }), 340)`,
  },
  {
    name: 'NavDock', group: 'Navigation: Frontend', height: 380,
    readme: `Frontend nav: a floating bar at the bottom of the viewport with an explore panel that opens above it; the logo sits at the top of the page.

Best for immersive, image-led sites (restaurants, hospitality, portfolios) and mobile-first brands.

**Props:** \`links\`, \`actions\` [{icon, label, count}], \`cta\` {label, href}, \`logoPlacement\` left|center|right|dock|none, \`logoVariant\`, \`tone\` default|image, \`menu\` (toggle button), \`open\`, \`panelTitle\`, \`panel\` (custom panel content), \`fixed\`.

Place inside a positioned container (it fills it); set \`fixed\` on real pages.`,
    preview: `hero(h(U.NavDock, { links: links, actions: actions, cta: cta, tone: 'image', open: true }), 380)`,
  },
  {
    name: 'NavIsland', group: 'Navigation: Frontend', height: 140,
    readme: `Frontend nav: a detached floating bar at the top, centered with a max width.

Best for modern marketing sites, SaaS and agencies. Logo placement: \`left\` (logo, links, actions) or \`center\` (links, logo, actions).

**Props:** \`links\`, \`actions\`, \`cta\`, \`logoPlacement\`, \`logoVariant\`, \`tone\`, \`width\`, \`fixed\`.`,
    preview: `hero(h(U.NavIsland, { links: links, actions: actions, cta: cta }), 140)`,
  },
  {
    name: 'NavBar', group: 'Navigation: Frontend', height: 300,
    readme: `Frontend nav: the classic full-width top bar. \`transparent\` turns it into two frosted pills over a hero photo: brand and links on one side, actions and CTA on the other.

Best for content-heavy sites, corporate and service businesses. **Props:** \`links\`, \`actions\`, \`cta\`, \`secondary\` (a second, quieter CTA), \`logoPlacement\` left|center|right, \`logoVariant\`, \`transparent\`, \`sticky\`.`,
    preview: `h('div', null, stage(h(U.NavBar, { links: links, actions: actions, cta: cta, secondary: { label: 'Sign in' } }), 96), hero(h(U.NavBar, { links: links.slice(0, 4), actions: [{ icon: 'search', label: 'Search' }], cta: cta, transparent: true }), 200))`,
  },
  {
    name: 'NavStacked', group: 'Navigation: Frontend', height: 200,
    readme: `Frontend nav: three tiers (utility strip, logo row, link row). The commerce and editorial pattern.

Best for Shopify stores, magazines and brands with many categories. **Props:** \`utility\` {text, links}, \`links\`, \`actions\`, \`logoPlacement\`, \`logoVariant\`, \`search\`.`,
    preview: `stage(h(U.NavStacked, { links: links, actions: [{ icon: 'user', label: 'Account' }, { icon: 'bag', label: 'Bag', count: 2 }], logoPlacement: 'center', utility: { text: 'Free delivery over [AMOUNT]', links: [{ label: 'Help' }, { label: 'Track order' }, { label: 'EN / AR' }] } }), 200)`,
  },
  {
    name: 'NavMinimal', group: 'Navigation: Frontend', height: 1000,
    readme: `Frontend nav: the logo, one CTA and a Menu control. Three bar layouts and three open-menu styles.

Best for studios, luxury, architecture, hospitality and one-page sites.

- \`layout\`: \`classic\` (logo, CTA, bordered Menu button), \`corners\` (text-only MENU, centered logo, underlined CTA: editorial), \`capsule\` (floating center capsule with Menu and one quick link).
- \`menuStyle\`: \`fullscreen\` (numbered index in the display face), \`split\` (dark index beside a brand-color panel with the mark and contact), \`drawer\` (side panel over a scrim).

**Props:** \`links\`, \`cta\`, \`layout\`, \`menuStyle\`, \`logoPlacement\`, \`logoVariant\`, \`tone\`, \`open\`, \`menuLabel\`, \`aside\` or children (contact block).`,
    preview: `h('div', { style: { display: 'flex', flexDirection: 'column', gap: 12 } }, stage(h(U.NavMinimal, { links: links, cta: cta, open: true, menuStyle: 'split', aside: h('div', null, h('div', { className: 'uis-overline', style: { color: 'inherit' } }, 'Contact'), h('p', null, 'hello@[DOMAIN]')) }), 420), hero(h(U.NavMinimal, { links: links, cta: cta, layout: 'corners', tone: 'image' }), 110), stage(h(U.NavMinimal, { links: links, cta: cta, layout: 'capsule' }), 110), stage(h(U.NavMinimal, { links: links, cta: cta, open: true, menuStyle: 'drawer', aside: h('p', null, 'hello@[DOMAIN]') }), 320))`,
  },
  {
    name: 'NavMobile', group: 'Navigation: Frontend', height: 520,
    readme: `Frontend nav for phones: a top bar with a bottom \`sheet\` menu, a full-width \`tabbar\`, or a \`floating\` tab bar.

**Props:** \`variant\` sheet|tabbar|floating, \`links\` (icons used by tab bars), \`actions\`, \`cta\`, \`logoPlacement\` left|center, \`logoVariant\`, \`open\`, \`transparent\`. Keep tab bars to 3–5 items.`,
    preview: `h('div', { style: { display: 'flex', gap: 20, padding: 20 } }, h('div', { style: { position: 'relative', width: 280, height: 480, overflow: 'hidden', borderRadius: 24, border: '1px solid var(--line)', background: 'var(--bg)' } }, h(U.NavMobile, { links: links, actions: [{ icon: 'bag', label: 'Cart', count: 1 }], cta: cta, open: true })), h('div', { style: { position: 'relative', width: 280, height: 480, overflow: 'hidden', borderRadius: 24, border: '1px solid var(--line)', background: 'var(--bg)' } }, h(U.NavMobile, { variant: 'floating', links: links.slice(0, 4).map(function (l, i) { return Object.assign({}, l, { icon: ['home', 'grid', 'layers', 'user'][i] }); }), actions: [{ icon: 'bell', label: 'Alerts' }] })))`,
  },
  {
    name: 'AppShell', group: 'Navigation: Backend', height: 460,
    readme: `The backend layout: picks a navigation pattern by name and places your page in the main area.

\`variant\`: \`sidebar\` (full sidebar, default for dashboards), \`rail\` (icon rail, for tools that need width), \`inset\` (sidebar on a tinted frame, content in a floating panel), \`topbar\` (horizontal tabs, for apps with 3–6 sections), \`dock\` (floating command dock, for canvas-style editors).

**Props:** \`variant\`, \`sections\` [{label, items: [{label, icon, href, active, badge}]}], \`user\` {name, meta}, \`workspace\` {name, plan}, \`search\`, \`actions\`, \`footerItems\`, \`tip\`, \`header\`, \`logoPlacement\`, children. Give it a sized parent.`,
    preview: `h('div', { style: { height: 460 } }, h(U.AppShell, { variant: 'inset', sections: sections, user: user }, page()))`,
  },
  {
    name: 'AppSidebar', group: 'Navigation: Backend', height: 520,
    readme: `The full backend sidebar: logo, search, grouped links with icons and counts, and one account block at the bottom. When a \`workspace\` is given with a \`user\`, they merge into that block (name, workspace · plan, switcher), so nothing is shown twice.

**Props:** \`sections\`, \`workspace\`, \`search\` (true or placeholder), \`user\`, \`logoPlacement\` left|center|right, \`logoVariant\`, \`footer\`.`,
    preview: `h('div', { style: { display: 'grid', gridTemplateColumns: '264px 1fr', height: 520 } }, h(U.AppSidebar, { sections: sections, workspace: workspace, user: user }), h('div', { style: { background: 'var(--bg)' } }))`,
  },
  {
    name: 'AppRail', group: 'Navigation: Backend', height: 460,
    readme: `The collapsed icon rail: mark on top, icon links with hover tooltips, dots for unread items, user at the bottom.

**Props:** \`sections\`, \`footerItems\`, \`user\`, \`tip\` (pin one tooltip open, for mockups).`,
    preview: `h('div', { style: { display: 'grid', gridTemplateColumns: '76px 1fr', height: 460 } }, h(U.AppRail, { sections: sections, user: user, tip: 'Projects' }), h('div', { style: { background: 'var(--bg)' } }))`,
  },
  {
    name: 'AppTopbar', group: 'Navigation: Backend', height: 130,
    readme: `The horizontal app header: logo, section tabs, search with ⌘K, action icons and avatar.

**Props:** \`links\` (or \`sections\`), \`actions\`, \`user\`, \`search\`, \`logoPlacement\` left|center|right, \`logoVariant\`.`,
    preview: `stage(h(U.AppTopbar, { sections: sections, user: user, actions: [{ icon: 'bell', label: 'Notifications', dot: true }] }), 130)`,
  },
  {
    name: 'AppDock', group: 'Navigation: Backend', height: 140,
    readme: `A floating command dock for canvas-style apps: mark, icon links with tooltips above, search, avatar.

**Props:** \`items\` (or \`sections\`), \`user\`, \`search\`, \`tip\`.`,
    preview: `stage(h(U.AppDock, { sections: sections, user: user }), 140)`,
  },
  {
    name: 'PageHeader', group: 'Navigation: Backend', height: 150,
    readme: `The top of a backend page: breadcrumbs, title in the display face, description and actions.

**Props:** \`title\`, \`description\`, \`crumbs\` (strings), \`actions\`; children also render in the actions slot.`,
    preview: `h(U.PageHeader, { title: 'Invoices', description: 'Track what is paid, pending and overdue.', crumbs: ['Workspace', 'Billing'], actions: h(React.Fragment, null, h(U.Button, { variant: 'outline', icon: 'download' }, 'Export'), h(U.Button, { icon: 'plus' }, 'New invoice')) })`,
  },
];
