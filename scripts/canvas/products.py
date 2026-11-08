# Product preset data for the per-product design sheets.
# Values come from the canvas "Product preset · X" study boards (read from each product's source by an
# earlier session). Stand-in fonts are marked. Text roles with alpha were flattened onto their page so
# the contrast check can measure them.

def V(key, tag, note, mode, config, vars=None, fonts=''):
    return dict(key=key, tag=tag, note=note, mode=mode, config=config, vars=vars or {}, fonts=fonts)

POPPINS = 'family=Poppins:wght@400;500;600;700'
LATO = 'family=Lato:wght@400;700'
FIGTREE = 'family=Figtree:wght@400..800'
SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"

LEDGER = {'color': {'primary': '#0d0d0d', 'accent': '#eab308', 'neutral': '#78736a', 'success': '#16803c', 'warning': '#c2540c', 'danger': '#c0311a', 'info': '#2F6BD8'},
          'radius': {'roundness': 90, 'pill': True}, 'type': {'preset': 'geometric', 'display': 'Poppins', 'body': 'Poppins', 'buttonCase': 'normal'},
          'density': 'comfortable', 'surface': {'float': 'solid', 'shadow': 'none', 'border': 'hairline'}, 'nav': {'front': 'bar', 'back': 'sidebar'}, 'motion': {'enabled': False, 'intensity': 'subtle'}}

def ledger(**color):
    import copy
    c = copy.deepcopy(LEDGER)
    c['color'].update(color)
    return c

PRODUCTS = []

# ---------------------------------------------------------------- Senorita
PRODUCTS.append(dict(
    id='Senorita', name='Senorita', kind='E-commerce store + admin', engine=True,
    summary='Fashion storefront and admin. Warm ink on white, square controls, heavy uppercase headings; photos carry the colour.',
    rules=[(1, 'Search stays open in the header; sale price in red next to the struck original.'),
           (1, 'Tan for button hover and tags, sand for sale banners, burgundy only on the wordmark.'),
           (1, 'Cards flat with hairlines; menus, drawers and toasts carry the shadows.'),
           (1, 'Size boxes are 44px squares; sold-out sizes stay visible, struck through.'),
           (0, 'Never use burgundy for text or buttons.'),
           (0, 'Never put white text on the sand banner (2.65:1): ink only.')],
    gaps='Shipped CSS is 2px square; decision O5 (2026-11-07) says pill. The engine preset ships the square one. The resting search pill has no edge (under WCAG 1.4.11).',
    source='retail-editorial engine preset · packages/core/src/presets.ts · Senorita Phase 1 storefront and admin CSS.',
    default='Shipped CSS',
    variants=[
        V('Shipped CSS', '2px square · engine preset', 'Exactly the retail-editorial preset. Recommended.', 'light',
          {'preset': 'retail-editorial', 'brand': {'wordmark': 'Senorita'}}),
        V('Decision O5', 'Pill controls, 22px cards', 'retail-editorial with O5 radii: controls 999, cards 22. Same colour and type.', 'light',
          {'preset': 'retail-editorial', 'brand': {'wordmark': 'Senorita'}, 'radius': {'overrides': {'control': 999, 'field': 999, 'chip': 999, 'card': 22, 'panel': 22}}}),
    ],
    fonts='family=Archivo:wdth,wght@75..125,700..900&family=Inter:wght@400..700',
    copy=dict(cta='Add to bag', cta2='Size guide', chip='Sale', field='Email', placeholder='you@example.com', headline='New season',
              alert=('Back in stock', 'Your size in [Product name] is available again.'), toast=('Added to bag', '[Product name] · Size M')),
    nav=dict(type='side', sections=[{'label': 'Store', 'items': [{'label': 'Orders', 'icon': 'receipt', 'active': True, 'badge': 3}, {'label': 'Products', 'icon': 'tag'}, {'label': 'Customers', 'icon': 'users'}, {'label': 'Stock', 'icon': 'box'}]}, {'label': 'Site', 'items': [{'label': 'Pages', 'icon': 'file'}, {'label': 'Settings', 'icon': 'settings'}]}],
             user={'name': '[Admin name]', 'meta': 'Store admin'}),
    screen='senorita',
))

# ---------------------------------------------------------------- Invios
PRODUCTS.append(dict(
    id='Invios', name='Invios', kind='Money back-office web app', engine=False,
    summary='Invoicing, quotes, proposals and time for freelancers and small agencies in the UAE, plus client pay and share pages. A serious tool, not a toy.',
    rules=[(1, 'The money cycle is the spine: quote, invoice, paid.'),
           (1, 'One header per page: back, title, one-line helper, one create action.'),
           (1, 'Money in tabular numbers, right-aligned; status is a dot plus a word.'),
           (1, 'Mobile first; sentence case; every page explains itself.'),
           (0, 'Never more than one gold action on a page.'),
           (0, 'Never invent amounts: [AMOUNT] until real data exists.')],
    gaps='Ships a vendored dark-first kit (Geist, 12/19px corners, deep shadows, 24–32px buttons under the 44px target). Decision D-05 targets UI System light, Poppins, pill, no shadows.',
    source='Shipped: _ds/linear-design-system tokens. Planned: ui-system-redesign sketch theme.json (decision D-05).',
    default='Ledger (D-05)',
    variants=[
        V('Ledger (D-05)', 'ledger preset · Poppins · pill', 'The ledger engine preset (branch claude/round-preset), which implements D-05 and D-12. It pins nothing: every value comes from the seeds. Recommended.', 'light',
          ledger(), {'--uis-display-weight': '600', '--uis-heading-weight': '600'}, POPPINS),
        V('Shipped today', 'Dark Linear kit · Geist', 'Values from the vendored Linear kit. Buttons 27/32/36px are under the 44px touch target.', 'dark',
          {'type': {'preset': 'geometric'},
           'color': {'mode': 'dark', 'primary': '#EAB308', 'accent': '#EAB308', 'neutral': '#8A857D', 'success': '#3DDC73', 'warning': '#E78640', 'danger': '#E64937',
                     'pinDark': {'bg': '#0D0D0D', 'surface': '#171717', 'surface-2': '#1E1E1E', 'line': 'rgba(245,243,239,0.09)', 'line-strong': 'rgba(245,243,239,0.2)', 'ink': '#F5F3EF', 'ink-2': '#A5A099',
                                 'primary': '#EAB308', 'primary-ink': '#171717', 'nav-bg': '#171717', 'nav-active-bg': '#352D15', 'nav-active-ink': '#EAB308'}},
           'radius': {'overrides': {'control': 999, 'chip': 999, 'field': 12, 'card': 19, 'panel': 19}}, 'surface': {'shadow': 'deep'}, 'sizes': {'sm': 27, 'md': 32, 'lg': 36}}),
    ],
    fonts=POPPINS,
    copy=dict(cta='New invoice', cta2='Preview', chip='Draft', field='Client email', placeholder='billing@[client].com', headline='Invoices',
              alert=('Payment received', 'INV-0042 from [Client A] is paid.'), toast=('Invoice sent', 'INV-0043 is on its way to [Client B].')),
    nav=dict(type='side', sections=[{'label': 'Money', 'items': [{'label': 'Overview', 'icon': 'home'}, {'label': 'Quotes', 'icon': 'file'}, {'label': 'Invoices', 'icon': 'receipt', 'active': True}, {'label': 'Payments', 'icon': 'wallet'}, {'label': 'Clients', 'icon': 'users'}]}, {'label': 'Work', 'items': [{'label': 'Projects', 'icon': 'folder'}, {'label': 'Time', 'icon': 'clock'}]}],
             user={'name': '[Owner name]', 'meta': '[Business name]'}),
    screen='invios',
))

# ---------------------------------------------------------------- Clickit
PRODUCTS.append(dict(
    id='Clickit', name='Clickit', kind='Streaming platform + admin', engine=False,
    summary="Streaming for a UAE media company's programs in Arabic and English, with a quiet admin where two people upload episodes.",
    rules=[(1, 'Viewer is cinematic: one show per hero, title bottom-left; artwork carries the colour.'),
           (1, 'Admin is calm, dense and tool-like: a control room.'),
           (1, 'Yellow for action; status uses softened tints, not raw red.'),
           (1, 'Every status has a word or icon as well as a colour.'),
           (0, 'No light mode: dark only.'),
           (0, 'Never put yellow text on a yellow tint for body copy.')],
    gaps='Its ui.config.json says Inter, but it ships the local LBC font (Inter stands in). Greys are hand-picked. The engine needs a dark-only flag and custom font files.',
    source='src/styles/globals.css and components.',
    default='Shipped',
    variants=[
        V('Shipped', 'Dark only · yellow', 'Shipped and config agree except the font.', 'dark',
          {'type': {'preset': 'modern', 'display': 'Inter', 'body': 'Inter'},
           'color': {'mode': 'dark', 'primary': '#FFCC00', 'accent': '#FFCC00', 'neutral': '#8A8A8A', 'success': '#77D586', 'warning': '#FFB46E', 'danger': '#FF8B82',
                     'pinDark': {'bg': '#090909', 'surface': '#101010', 'surface-2': '#161616', 'surface-3': '#1E1E1E', 'line': 'rgba(255,255,255,0.08)', 'line-strong': 'rgba(255,255,255,0.22)',
                                 'ink': '#F4F4F4', 'ink-2': '#A1A1A1', 'primary': '#FFCC00', 'primary-ink': '#090909', 'accent-soft': '#362E0D', 'accent-soft-ink': '#FFCC00',
                                 'nav-bg': '#090909', 'nav-active-bg': '#312915', 'nav-active-ink': '#FFCC00'}},
           'radius': {'overrides': {'control': 999, 'chip': 999, 'field': 8, 'card': 12, 'panel': 12, 'media': 12}}, 'surface': {'shadow': 'deep'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 52}},
          {'--uis-display-weight': '700', '--uis-heading-weight': '700', '--uis-btn-weight': '500'}),
        V('Ledger + Clickit seeds', 'ledger · yellow · dark', 'Planned: Clickit moves onto ledger when its design is rebuilt, keeping only its brand seeds (yellow #ffcc00, dark mode). Everything else comes from ledger.', 'dark',
          ledger(primary='#FFCC00', mode='dark'), {'--uis-display-weight': '600', '--uis-heading-weight': '600'}, POPPINS),
    ],
    fonts='family=Inter:wght@400..700&' + POPPINS,
    copy=dict(cta='Watch now', cta2='My list', chip='New', field='Episode title', placeholder='Season 2 · Episode 4', headline='Now streaming',
              alert=('Upload finished', 'Season 2 · Episode 4 is ready to publish.'), toast=('Published', 'Episode 4 is live in Arabic and English.')),
    nav=dict(type='side', sections=[{'label': 'Library', 'items': [{'label': 'Programs', 'icon': 'layers'}, {'label': 'Episodes', 'icon': 'play', 'active': True}, {'label': 'Uploads', 'icon': 'upload', 'badge': 2}]}, {'label': 'Viewers', 'items': [{'label': 'Analytics', 'icon': 'chart'}, {'label': 'Settings', 'icon': 'settings'}]}],
             user={'name': '[Editor name]', 'meta': 'Editor'}),
    screen='clickit',
))

# ---------------------------------------------------------------- Vamos
PRODUCTS.append(dict(
    id='Vamos', name='Vamos', kind='Booking flow + ops console', engine=False,
    summary='Pre-booked private transfers from Zurich: airport, city, ski and long distance. Fixed price up front, driver waiting.',
    rules=[(1, 'Booking widget floats over the hero; quote and checkout keep a sticky price rail.'),
           (1, 'Selected is a 2px charcoal edge.'),
           (1, 'Two background colours per screen at most.'),
           (1, 'Four languages including Arabic RTL; body text never under 13px.'),
           (0, 'Yellow means action only, never selection.'),
           (0, 'No glow, no gradients.')],
    gaps='Ships its own kit, not UI System. Qurova display is not on Google Fonts (Poppins 700 stands in). Light only. Status colours were OKLCH, converted to hex here.',
    source='apps/web/public/brand/tokens (laws.css final).',
    default='Shipped',
    variants=[
        V('Shipped', 'Charcoal and yellow · Poppins', 'Card shadow-sm from the source is not reproduced.', 'light',
          {'type': {'preset': 'humanist', 'display': 'Poppins', 'body': 'Poppins', 'buttonCase': 'upper'},
           'color': {'primary': '#FDC20B', 'accent': '#1E1F1F', 'neutral': '#7A7C7B', 'success': '#359658', 'warning': '#EDB306', 'danger': '#CC3430', 'info': '#3179A6',
                     'pin': {'bg': '#F6F6F6', 'surface': '#FFFFFF', 'line': '#DEDEDE', 'ink': '#1E1F1F', 'ink-2': '#545756', 'primary-ink': '#1E1F1F', 'focus-field': '#1E1F1F'}},
           'radius': {'overrides': {'control': 999, 'field': 999, 'search': 999, 'chip': 4, 'card': 16, 'panel': 16}}, 'surface': {'shadow': 'none'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 52, 'ring': 2}},
          {'--uis-display-weight': '700', '--uis-heading-weight': '700', '--uis-btn-tracking': '0.09em', '--uis-btn-size': '13px', '--uis-btn-weight': '600'}, POPPINS),
    ],
    fonts=POPPINS,
    copy=dict(cta='Book a transfer', cta2='See fleet', chip='CHF —', field='Pick-up', placeholder='Zurich Airport (ZRH)', headline='Zurich Airport',
              alert=('Driver assigned', 'Your driver meets you at arrivals with a name sign.'), toast=('Booking confirmed', 'Zurich → St. Moritz · [DATE]')),
    nav=dict(type='top', dark=True, links=[{'label': 'Airport'}, {'label': 'Ski'}, {'label': 'Fleet', 'active': True}, {'label': 'Business'}], cta={'label': 'Book'}),
    screen='vamos',
))

# ---------------------------------------------------------------- ALMAR
PRODUCTS.append(dict(
    id='Almar', name='ALMAR', kind='Luxury booking OS + ops dashboard', engine=False,
    summary='Private, accompanied trips to Colombia for UAE guests: stay, add-ons, airport meet, deposit or full pay. Elegant, exclusive, personal.',
    rules=[(1, 'Teal label on gold (6.37:1), never white.'),
           (1, 'Serif display at weight 400; uppercase kickers; tabular prices and dates.'),
           (1, 'Hover darkens only. Sticky header, no shadow.'),
           (1, 'Logical properties for Arabic RTL; 44px targets.'),
           (0, 'Gold is never body text.'),
           (0, 'No lift, no scale on hover.')],
    gaps='Code ships 0 corners; 01-UI-SPEC says 40px controls and 64px overlays. Questa is not on Google Fonts (Georgia stands in). Light only. Newer 03.1 / 03.3 docs not read yet.',
    source='app/globals.css and components/ui; 01-UI-SPEC.',
    default='Shipped code',
    variants=[
        V('Shipped code', 'Square · 0 radius', 'What guests see today. Recommended.', 'light',
          {'type': {'preset': 'classic', 'display': 'Questa', 'body': 'Lato', 'buttonCase': 'upper'},
           'color': {'primary': '#1F3B40', 'accent': '#D4BA8A', 'neutral': '#8A8378', 'success': '#1E6B45', 'warning': '#8A3B12', 'danger': '#8F2D2D',
                     'pin': {'bg': '#FFFAF0', 'surface': '#FFFFFF', 'line': 'rgba(38,38,38,0.16)', 'ink': '#262626', 'ink-2': '#63615F', 'primary-ink': '#FFFAF0', 'accent-ink': '#1F3B40'}},
           'radius': {'roundness': 0, 'overrides': {'avatar': 999}}, 'surface': {'shadow': 'none'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 52}},
          {'--uis-font-display': 'Georgia, serif', '--uis-heading-font': 'Georgia, serif', '--uis-display-weight': '400', '--uis-heading-weight': '400', '--uis-btn-tracking': '0.12em', '--uis-btn-size': '13px', '--uis-btn-weight': '700'}, LATO),
        V('01-UI-SPEC', 'Round controls · 40px', 'Spec values: controls 40px, overlays 64px, cards 0. Possibly superseded by later phases.', 'light',
          {'type': {'preset': 'classic', 'display': 'Questa', 'body': 'Lato', 'buttonCase': 'upper'},
           'color': {'primary': '#1F3B40', 'accent': '#D4BA8A', 'neutral': '#8A8378', 'success': '#1E6B45', 'warning': '#8A3B12', 'danger': '#8F2D2D',
                     'pin': {'bg': '#FFFAF0', 'surface': '#FFFFFF', 'line': 'rgba(38,38,38,0.16)', 'ink': '#262626', 'ink-2': '#63615F', 'primary-ink': '#FFFAF0', 'accent-ink': '#1F3B40'}},
           'radius': {'roundness': 0, 'overrides': {'control': 40, 'field': 40, 'chip': 40, 'search': 40, 'shell': 64, 'avatar': 999}}, 'surface': {'shadow': 'none'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 52}},
          {'--uis-font-display': 'Georgia, serif', '--uis-heading-font': 'Georgia, serif', '--uis-display-weight': '400', '--uis-heading-weight': '400', '--uis-btn-tracking': '0.12em', '--uis-btn-size': '13px', '--uis-btn-weight': '700'}, LATO),
        V('Direction · retail-editorial', 'Senorita design + ALMAR seeds', 'Study of the 2026-11-07 direction: ALMAR moves onto retail-editorial and keeps only its brand seeds (teal primary, gold accent). Not signed as a design yet.', 'light',
          {'preset': 'retail-editorial', 'brand': {'wordmark': 'ALMAR', 'wordmarkColor': '#1F3B40'}, 'color': {'primary': '#1F3B40', 'accent': '#D4BA8A'}}),
    ],
    fonts=LATO,
    copy=dict(cta='Book this stay', cta2='Speak to us', chip='Selected', field='Arrival date', placeholder='[DATE]', headline='Private stays',
              alert=('Deposit received', 'Your stay in Cartagena is held. The balance is due [DATE].'), toast=('Airport meet added', 'A host meets you at CTG arrivals.')),
    nav=dict(type='top', links=[{'label': 'Destinations', 'active': True}, {'label': 'Experiences'}, {'label': 'How it works'}, {'label': 'About'}], cta={'label': 'Log in'}),
    screen='almar',
))

# ---------------------------------------------------------------- Koussay
PRODUCTS.append(dict(
    id='Koussay', name='Koussay portfolio', kind='Portfolio + booking + admin', engine=False,
    summary='A WebGL ring of 8 projects for prospects in Dubai and the GCC; every page leads to an 11-step booking. The admin is a private dashboard for those bookings.',
    rules=[(1, 'Monochrome: the work carries the colour. Geist only.'),
           (1, 'Public pages: glass pill buttons, logo only, no nav bar.'),
           (1, 'Admin: no glass; branded pickers, never native ones.'),
           (1, 'Geist 400 / 500 only at 13/14/16/28; no uppercase in the admin.'),
           (0, 'Ink fill only for the listed uses (primary action, confirmed status).'),
           (0, 'Never change the public pages: they are pixel-frozen.')],
    gaps='Admin spec vs tokens: ink #0a0a0a vs #101010, surface #fff vs #FEFEFE, large control 48 vs 52. Config says topbar; signed round 2 says sidebar. Admin code is not built yet.',
    source='app/globals.css, booking module CSS, signed admin round 2.',
    default='Admin',
    variants=[
        V('Admin', 'UI System · pill · sidebar', 'Spec values where spec and tokens disagree. Sidebar per signed round 2.', 'light',
          {'type': {'preset': 'geometric'},
           'color': {'primary': '#0A0A0A', 'accent': '#0A0A0A', 'neutral': '#737373', 'success': '#1E8E4E', 'warning': '#C27803', 'danger': '#9A2F2F', 'info': '#2F6BD8',
                     'pin': {'bg': '#FAFAFA', 'surface': '#FFFFFF', 'line': '#DEDEDE', 'ink': '#0A0A0A', 'ink-2': '#424242', 'primary-ink': '#FEFEFE', 'nav-bg': '#FFFFFF', 'nav-active-bg': '#F4F4F4', 'nav-active-ink': '#0A0A0A'}},
           'radius': {'pill': True, 'overrides': {'card': 19, 'panel': 19}}, 'surface': {'shadow': 'soft'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 48}},
          {'--uis-display-weight': '500', '--uis-heading-weight': '500', '--uis-display-tracking': '-0.04em', '--uis-btn-weight': '500'}),
        V('Public site', 'Glass · monochrome', 'From app/globals.css. Translucent text and glass flattened onto the page so contrast can be measured.', 'light',
          {'type': {'preset': 'geometric'},
           'color': {'primary': '#0A0A0A', 'accent': '#0A0A0A', 'neutral': '#737373',
                     'pin': {'bg': '#FAFAFA', 'surface': '#FDFDFD', 'line': 'rgba(10,10,10,0.08)', 'ink': '#0A0A0A', 'ink-2': '#6F6F6F', 'primary-ink': '#FAFAFA'}},
           'radius': {'pill': True, 'overrides': {'field': 24, 'card': 16, 'panel': 16}}, 'surface': {'float': 'glass', 'shadow': 'none'}, 'sizes': {'sm': 36, 'md': 44, 'lg': 48}},
          {'--uis-display-weight': '500', '--uis-heading-weight': '500', '--uis-display-tracking': '-0.06em', '--uis-btn-weight': '500'}),
    ],
    fonts='family=Geist:wght@400..700&family=Geist+Mono:wght@400..600',
    copy=dict(cta='Confirm', cta2='Reschedule', chip='Confirmed', field='Project type', placeholder='Website', headline='Bookings',
              alert=('New booking', '[Client A] booked a discovery call for [DATE].'), toast=('Booking confirmed', 'The client gets the calendar invite.')),
    nav=dict(type='side', sections=[{'label': 'Studio', 'items': [{'label': 'Bookings', 'icon': 'calendar', 'active': True, 'badge': 2}, {'label': 'Clients', 'icon': 'users'}, {'label': 'Projects', 'icon': 'briefcase'}]}, {'label': 'Site', 'items': [{'label': 'Work ring', 'icon': 'layers'}, {'label': 'Settings', 'icon': 'settings'}]}],
             user={'name': 'Koussay', 'meta': 'Owner'}),
    screen='koussay',
))

# ---------------------------------------------------------------- Sahti
PRODUCTS.append(dict(
    id='Sahti', name='Sahti', kind='Mobile care app (iOS + Android)', engine=False, mobile=True,
    summary='Medication and care agent for busy, elderly and disabled patients in the UAE, English and Arabic. Promise: a confirmed dose is never silently missed.',
    rules=[(1, 'One task per screen, one full-width continue button.'),
           (1, 'Must hold at the largest text size (AX5); simple mode has bigger targets.'),
           (1, 'Dark mode on every screen.'),
           (1, 'State is a word or icon, never colour alone.'),
           (0, 'Nothing is scheduled before the patient confirms.'),
           (0, 'No medicine names on the lock screen.')],
    gaps='React Native, not web CSS: UI System needs a native token export. Ink, field and card radii and every dark hex are stand-ins (not decided). Glass cards flattened to measure contrast.',
    source='decisions/2026-10-14-design-canvas.md (signed 2026-11-07); earlier UX-BRIEF.md.',
    default='Signed canvas',
    variants=[
        V('Signed canvas', 'Glass · Figtree', 'Signed 2026-11-07. Recommended. Cards are white 66% with blur 22 in the product.', 'light',
          {'type': {'preset': 'humanist', 'display': 'Figtree', 'body': 'Figtree'},
           'color': {'primary': '#000000', 'accent': '#0A6A8F', 'neutral': '#6E7682', 'success': '#1F7A2E', 'danger': '#C2083B',
                     'pin': {'bg': '#EEF2F6', 'surface': '#F9FAFC', 'line': 'rgba(60,60,67,0.18)', 'ink': '#000000', 'ink-2': '#5E5E66', 'primary-ink': '#FFFFFF', 'success-soft': '#E9F9DF', 'success-soft-ink': '#1F7A2E'}},
           'radius': {'overrides': {'control': 999, 'chip': 999, 'field': 14, 'card': 20, 'panel': 20, 'shell': 999}}, 'surface': {'float': 'glass', 'shadow': 'none'}, 'sizes': {'sm': 44, 'md': 52, 'lg': 60}},
          {'--uis-display-weight': '700', '--uis-heading-weight': '700'}, FIGTREE),
        V('Earlier brief', 'Apple Health · AA-safe', 'UX-BRIEF.md. Superseded by the signed canvas.', 'light',
          {'type': {'preset': 'modern'},
           'color': {'primary': '#000000', 'accent': '#0040DD', 'neutral': '#6C6C70', 'success': '#1F7A2E', 'danger': '#C2083B',
                     'pin': {'bg': '#F2F2F7', 'surface': '#FFFFFF', 'line': 'rgba(60,60,67,0.18)', 'ink': '#000000', 'ink-2': '#6C6C70', 'primary-ink': '#FFFFFF', 'success-soft': '#E9F9DF', 'success-soft-ink': '#1F7A2E'}},
           'radius': {'overrides': {'control': 999, 'chip': 999, 'field': 14, 'card': 20, 'panel': 20, 'shell': 999}}, 'surface': {'shadow': 'none'}, 'sizes': {'sm': 44, 'md': 52, 'lg': 60}},
          {'--uis-font-display': SANS, '--uis-font-body': SANS, '--uis-heading-font': SANS, '--uis-btn-font': SANS, '--uis-display-weight': '700', '--uis-heading-weight': '700'}),
    ],
    fonts=FIGTREE,
    copy=dict(cta='I took it', cta2='Remind me in 10 min', chip='Taken', field='Dose time', placeholder='08:00', headline='Today',
              alert=('Dose due', 'Your morning medicines are due now.'), toast=('Marked as taken', 'Morning medicines · 08:10')),
    nav=dict(type='tab', items=[('Today', 'home'), ('Medicines', 'health'), ('History', 'clock'), ('Settings', 'settings')]),
    screen='sahti',
))

# ---------------------------------------------------------------- Obox
PRODUCTS.append(dict(
    id='Obox', name='Obox MENA', kind='Studio marketing site + internal OS', engine=False,
    summary='Dubai entertainment-marketing boutique: media, PR, brand and talent, content. Studios and brands buy titles, not packages.',
    rules=[(1, 'Campaigns and talent first; talent cards are 3:4 photos with a pink role pill.'),
           (1, '"Tell us the title": every page ends in an enquiry that reaches a human.'),
           (1, 'Internal OS: influencer database, campaigns, files.'),
           (1, 'Blue for the main action, pink for talent roles, coral for highlights.'),
           (0, 'No fake controls, no hard deletes in the internal OS.'),
           (0, 'Never white text on the pink pill: ink only.')],
    gaps='Shipped site is a Framer export; values read from its CSS. Open Sauce One stands in as Inter. No status colours, shadows or spacing scale exist: status colours here are engine defaults. The internal OS has no design yet.',
    source='src/manifest.json (Framer CSS) and src/render.ts.',
    default='Shipped site',
    variants=[
        V('Shipped site', 'Stone, blue, pink, coral', 'Status colours are engine defaults, not from the source.', 'light',
          {'type': {'preset': 'modern', 'display': 'Inter', 'body': 'Inter'},
           'color': {'primary': '#0071BC', 'accent': '#EF648B', 'neutral': '#78716C',
                     'pin': {'bg': '#F4F4F3', 'surface': '#FFFFFF', 'line': '#E7E5E4', 'line-strong': '#A8A29E', 'ink': '#1C1917', 'ink-2': '#44403C', 'primary-ink': '#FFFFFF', 'accent-ink': '#1C1917'}},
           'radius': {'overrides': {'control': 40, 'chip': 40, 'search': 40, 'field': 10, 'card': 24, 'panel': 24, 'media': 24}}, 'surface': {'shadow': 'none'}, 'sizes': {'sm': 40, 'md': 48, 'lg': 56}},
          {'--uis-display-weight': '700', '--uis-heading-weight': '700', '--uis-display-tracking': '-0.04em'}),
    ],
    fonts='family=Inter:wght@400..800',
    copy=dict(cta='Start a campaign', cta2='See talent', chip='Talent', field='Title', placeholder='[Film or series title]', headline='Tell us the title',
              alert=('Enquiry received', 'A producer replies within one working day.'), toast=('Talent shortlisted', '3 talents added to [Campaign].')),
    nav=dict(type='top', links=[{'label': 'Work'}, {'label': 'Campaigns', 'active': True}, {'label': 'Talent'}, {'label': 'About'}], cta={'label': 'Contact'}),
    screen='obox',
))
