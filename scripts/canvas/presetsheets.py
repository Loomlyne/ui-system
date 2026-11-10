# One full design sheet per PRESET (a way of designing), for UI System · Canvas (page "Presets").
# Products are only skins on a sheet, side by side (owner, 2026-11-09; replaces the per-product sheets).
# Run after pnpm build: python3 scripts/canvas/presetsheets.py <out_dir>  (writes Sheet-<Preset>.dc.html + made-presets.json)
# Every value on a sheet is computed live from UIS.buildTheme(config) for each skin.
import json, re, sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from products import PRODUCTS
from presets_data import PRESET_SHEETS

if len(sys.argv) != 2:
    sys.exit('usage: python3 scripts/canvas/presetsheets.py <out_dir>')
OUT = sys.argv[1]
MADE = {}

X = lambda comp, attrs='', inner='': '<x-import component-from-global-scope="UIS.' + comp + '"' + (' ' + attrs if attrs else '') + '>' + inner + '</x-import>'
I = lambda name, size='s18', style='': X('Icon', 'name="' + name + '" size="{{' + size + '}}"' + (' style="' + style + '"' if style else ''))
BTN = lambda text, attrs='': X('Button', attrs, text)
FONT_SPEC = re.compile(r'^family=[A-Za-z0-9+]+(:[A-Za-z0-9@;.,]+)?$')  # Google Fonts css2 family specs only
esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')

def section(num, title, note, content):
    return ('<section style="display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 40px; padding: 36px 0; border-top: 1px solid var(--uis-line);">'
            '<div style="display: flex; flex-direction: column; gap: 10px;"><span style="font: 500 12px/1 var(--uis-font-mono); color: var(--uis-ink-3);">' + num + '</span>'
            '<h2 class="uis-h2" style="margin: 0;">' + title + '</h2>'
            '<p class="uis-body-s" style="margin: 0; color: var(--uis-ink-2);">' + note + '</p></div>'
            '<div style="display: flex; flex-direction: column; gap: 24px; min-width: 0;">' + content + '</div></section>')

def cell(label, content, style=''):
    return ('<div style="display: flex; flex-direction: column; gap: 10px; min-width: 0;' + style + '">'
            '<span style="font: 500 11.5px/1.3 var(--uis-font-mono); color: var(--uis-ink-3);">' + label + '</span>' + content + '</div>')

def grid(cols, items, gap=20, align='start'):
    return '<div style="display: grid; grid-template-columns: repeat(' + str(cols) + ', minmax(0, 1fr)); gap: ' + str(gap) + 'px; align-items: ' + align + ';">' + ''.join(items) + '</div>'

def row(*items, gap=12, align='center'):
    return '<div style="display: flex; gap: ' + str(gap) + 'px; align-items: ' + align + '; flex-wrap: wrap;">' + ''.join(items) + '</div>'

def slot(id, ratio='4 / 3', label='Photo', style=''):
    return '<image-slot id="' + id + '" shape="rect" placeholder="' + label + '" style="display: block; width: 100%; aspect-ratio: ' + ratio + '; border-radius: var(--uis-r-media); background: var(--uis-surface-3);' + style + '"></image-slot>'

def plainbtn(variant, text, style='', extra='', size=''):
    return '<button type="button" class="uis-btn uis-btn--' + variant + (' uis-btn--' + size if size else '') + '"' + (' style="' + style + '"' if style else '') + extra + '>' + text + '</button>'

def rule(do, text):
    ic = I('check-circle', 's18') if do else I('x-circle', 's18')
    col = 'var(--uis-success-text)' if do else 'var(--uis-danger-text)'
    return ('<p class="uis-body-s" style="margin: 0; display: flex; gap: 10px; align-items: flex-start;"><span style="color: ' + col + '; flex-shrink: 0;">' + ic + '</span>'
            '<span><strong>' + ('Do' if do else 'Don\'t') + '.</strong> ' + text + '</span></p>')

def fstate(pid, lab, value, style='', attrs=''):
    fid = 'f-' + pid.lower() + '-' + lab.split()[0].lower()
    return cell(lab, '<div class="uis-field"><label class="uis-label" for="' + fid + '">Field</label><div class="uis-control"><input id="' + fid + '" class="uis-input" value="' + esc(value) + '"' + (' style="' + style + '"' if style else '') + attrs + '></div></div>')

ROLES = [
    ('bg', 'Page'), ('surface', 'Cards, panels'), ('surface-2', 'Subtle panels, table head'), ('surface-3', 'Wells, photo slots'), ('line', 'Hairlines'), ('line-strong', 'Field edges'),
    ('ink', 'Text'), ('ink-2', 'Secondary text'), ('ink-3', 'Captions, hints'), ('primary', 'Main action'), ('primary-hover', 'Main action hover'), ('primary-ink', 'Text on primary'),
    ('primary-soft', 'Tinted fills'), ('primary-text', 'Links, primary text'), ('accent', 'Highlight'), ('accent-ink', 'Text on accent'), ('accent-soft', 'Tinted chips'), ('accent-text', 'Accent text'),
    ('success', 'Paid, done'), ('warning', 'Due, attention'), ('danger', 'Errors, delete'), ('info', 'Notices'), ('focus', 'Keyboard focus'), ('focus-field', 'Focused field edge'),
    ('success-soft', 'Success pill fill'), ('warning-soft', 'Warning pill fill'), ('danger-soft', 'Error pill fill'), ('info-soft', 'Info pill fill'),
    ('nav-bg', 'App nav panel'), ('nav-active-bg', 'Current page fill'), ('nav-active-ink', 'Current page text'), ('wordmark', 'Logo wordmark'),
    ('search-bg', 'Search fill'), ('scrim', 'Overlay behind drawers'), ('inverse', 'Inverse panels'), ('inverse-ink', 'Text on inverse'),
]

# ---------------------------------------------------------------- product screens
def screen(p):
    s = p['screen']
    c = p['copy']
    if s == 'senorita':
        tile = lambda i, sale: ('<article style="display: flex; flex-direction: column; gap: 10px;">' + slot('sn-' + str(i), '3 / 4', 'Product photo') +
                                '<div style="display: flex; justify-content: space-between; gap: 8px;"><span class="uis-body-s" style="font-weight: 600;">[Product name]</span>' + I('heart', 's18') + '</div>' +
                                ('<span class="uis-body-s"><span style="color: var(--uis-danger-text); font-weight: 700;">[PRICE]</span> <s style="color: var(--uis-ink-3);">[PRICE]</s></span>' if sale else '<span class="uis-body-s" style="font-weight: 700;">[PRICE]</span>') + '</article>')
        sizes = row(*['<button type="button" style="width: 44px; height: 44px; border: 1px solid ' + ('var(--uis-ink)' if z == 'M' else 'var(--uis-line-strong)') + '; border-radius: var(--uis-r-control); background: var(--uis-surface); color: ' + ('var(--uis-ink-3)' if z == 'XL' else 'var(--uis-ink)') + '; font: 600 13px/1 var(--uis-font-body);' + (' text-decoration: line-through;' if z == 'XL' else '') + '"' + (' disabled=""' if z == 'XL' else '') + '>' + z + '</button>' for z in ['XS', 'S', 'M', 'L', 'XL']], gap=6)
        return (X('NavBar', 'links="{{navLinksShop}}" actions="{{shopActions}}"') +
                '<div style="background: var(--uis-accent-soft); color: var(--uis-accent-soft-ink); text-align: center; padding: 10px; font: 700 13px/1.2 var(--uis-font-body); letter-spacing: 0.06em; text-transform: uppercase;">[Sale banner copy]</div>' +
                '<div style="display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 32px; padding: 32px;"><aside style="display: flex; flex-direction: column; gap: 16px;"><h3 class="uis-h3">Filter</h3>' +
                X('Checkbox', 'label="New in" default-checked="{{yes}}"') + X('Checkbox', 'label="Sale"') + X('Checkbox', 'label="Dresses"') + '<span class="uis-label">Size</span>' + sizes + '</aside>' +
                '<div style="display: flex; flex-direction: column; gap: 20px;"><div style="display: flex; justify-content: space-between; align-items: end;"><h2 class="uis-display-m">' + c['headline'] + '</h2><span class="uis-caption">[N] products</span></div>' +
                '<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 2px 2px;">' + ''.join(tile(i, i % 2 == 0) for i in range(4)) + '</div></div></div>'), 900
    if s == 'invios':
        return ('<div style="display: flex; min-height: 760px;">' + X('AppSidebar', 'sections="{{navSections}}" user="{{navUser}}"') +
                '<main style="flex: 1; min-width: 0; padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; background: var(--uis-bg);">' +
                X('PageHeader', 'title="Invoices" description="Every invoice you sent, and what is still owed." crumbs="{{crumbs}}"', BTN('New invoice', 'icon="plus"')) +
                grid(3, [X('Card', '', X('Stat', 'label="Outstanding" value="[AMOUNT]" icon="wallet"')), X('Card', '', X('Stat', 'label="Paid this month" value="[AMOUNT]" icon="check-circle"')), X('Card', '', X('Stat', 'label="Overdue" value="[N]" icon="alert-circle"'))], 16) +
                X('Tabs', 'items="{{filters}}" variant="pill"') + X('Table', 'columns="{{columns}}" rows="{{rows}}"') + '</main></div>'), 860
    if s == 'clickit':
        ep = lambda i: ('<article style="display: flex; flex-direction: column; gap: 8px;">' + slot('ck-' + str(i), '16 / 9', 'Episode still') +
                        '<span class="uis-body-s" style="font-weight: 600;">Episode ' + str(i + 1) + ' · [Title]</span><span class="uis-caption">42 min</span></article>')
        return ('<div style="position: relative;">' + slot('ck-hero', '21 / 9', 'Show artwork', ' border-radius: 0;') +
                '<div style="position: absolute; inset: auto auto 40px 40px; display: flex; flex-direction: column; align-items: flex-start; gap: 14px; max-width: 520px;" data-tone="image">' +
                X('Badge', 'tone="accent"', c['chip']) + '<h2 class="uis-display-l" style="color: var(--uis-on-image);">[Program title]</h2>' +
                '<p class="uis-body" style="color: var(--uis-on-image);">[One-line logline in Arabic and English]</p>' + row(BTN('Watch now', 'size="lg" icon="play"'), BTN('My list', 'size="lg" variant="glass" icon="plus"')) + '</div></div>' +
                '<div style="padding: 28px 40px; display: flex; flex-direction: column; gap: 16px;"><h3 class="uis-h3">Season 2</h3>' + grid(4, [ep(i) for i in range(4)], 16) + '</div>'), 960
    if s == 'vamos':
        return ('<div style="position: relative; padding: 48px; min-height: 640px; display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start;">' +
                '<div style="display: flex; flex-direction: column; gap: 16px;">' + slot('vm-hero', '4 / 3', 'Car at the airport') + '</div>' +
                '<div class="uis-card" style="display: flex; flex-direction: column; gap: 14px; box-shadow: var(--uis-shadow-float);"><h3 class="uis-h3">Book a transfer</h3>' +
                X('Tabs', 'items="{{tripTabs}}"') + X('Input', 'label="Pick-up" icon="pin" placeholder="Zurich Airport (ZRH)"') + X('Input', 'label="Drop-off" icon="route" placeholder="St. Moritz"') +
                grid(2, [X('Input', 'label="Date" icon="calendar" placeholder="[DATE]"'), X('Input', 'label="Time" icon="clock" placeholder="[TIME]"')], 10) +
                '<div style="display: flex; gap: 10px;">' + ''.join('<div style="flex: 1; padding: 12px; border: ' + ('2px solid var(--uis-ink)' if n == 'Business' else '1px solid var(--uis-line)') + '; border-radius: var(--uis-r-card); display: flex; flex-direction: column; gap: 4px;">' + I('car', 's20') + '<strong class="uis-body-s">' + n + '</strong><span class="uis-caption">CHF —</span></div>' for n in ['Business', 'First', 'Van']) + '</div>' +
                '<div style="display: flex; justify-content: space-between; align-items: baseline; padding-top: 6px; border-top: 1px solid var(--uis-line);"><span class="uis-body-s">Fixed price</span><strong style="font-variant-numeric: tabular-nums;">CHF —</strong></div>' +
                BTN('Book a transfer', 'block="{{yes}}" size="lg"') + '</div></div>'), 760
    if s == 'almar':
        stay = lambda i, sel: ('<article style="display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 20px; padding: 16px; border: ' + ('1px solid var(--uis-accent)' if sel else '1px solid var(--uis-line)') + '; border-radius: var(--uis-r-card); background: var(--uis-surface);">' + slot('al-' + str(i), '4 / 3', 'Stay photo') +
                               '<div style="display: flex; flex-direction: column; gap: 10px;"><span class="uis-overline">Cartagena · 5 nights</span><h3 class="uis-h2">[Stay name]</h3><p class="uis-body-s" style="color: var(--uis-ink-2);">[Two lines about the stay, the host and what is included.]</p>' +
                               row(X('Badge', 'tone="accent" solid="{{yes}}"', 'Selected') if sel else X('Badge', '', 'Private pool'), '<span class="uis-body-s" style="font-variant-numeric: tabular-nums; font-weight: 700;">AED —</span>') + '</div></article>')
        summ = ('<aside class="uis-card" style="display: flex; flex-direction: column; gap: 14px;"><h3 class="uis-h3">Your trip</h3>' +
                ''.join('<div style="display: flex; justify-content: space-between;"><span class="uis-body-s" style="color: var(--uis-ink-2);">' + k + '</span><span class="uis-body-s" style="font-variant-numeric: tabular-nums;">' + v + '</span></div>' for k, v in [('Stay', 'AED —'), ('Airport meet', 'AED —'), ('Add-ons', 'AED —')]) +
                X('Checkbox', 'label="Pay a deposit now" default-checked="{{yes}}"') + X('Checkbox', 'label="Pay in full"') +
                '<div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--uis-line);"><strong>Total</strong><strong style="font-variant-numeric: tabular-nums;">AED —</strong></div>' + BTN('Book this stay', 'block="{{yes}}" size="lg"') + '</aside>')
        return (X('NavBar', 'links="{{navLinks}}" cta="{{navCta}}"') + '<div style="display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 32px; padding: 32px; align-items: start;"><div style="display: flex; flex-direction: column; gap: 16px;"><h2 class="uis-display-m">Private stays</h2>' + stay(1, True) + stay(2, False) + '</div>' + summ + '</div>'), 860
    if s == 'koussay':
        steps = '<div style="display: flex; flex-direction: column; gap: 8px;"><div style="display: flex; justify-content: space-between;"><span class="uis-caption">Booking · step 3 of 11</span><span class="uis-caption">27%</span></div>' + X('Progress', 'value="{{p27}}"') + '</div>'
        return ('<div style="display: flex; min-height: 760px;">' + X('AppSidebar', 'sections="{{navSections}}" user="{{navUser}}"') +
                '<main style="flex: 1; min-width: 0; padding: 28px 32px; display: flex; flex-direction: column; gap: 24px; background: var(--uis-bg);">' +
                X('PageHeader', 'title="Bookings" description="Calls booked from the portfolio, newest first." crumbs="{{crumbs}}"', BTN('Export', 'variant="outline" icon="download"')) +
                grid(2, [X('Card', '', steps + '<p class="uis-body-s" style="color: var(--uis-ink-2); margin-top: 12px;">[Client A] chose: Website · Dubai · [Budget band]</p>'), X('Card', '', X('Stat', 'label="Calls this week" value="[N]" icon="calendar"'))], 16) +
                X('Table', 'columns="{{columns}}" rows="{{rows}}"') + '</main></div>'), 860
    if s == 'sahti':
        dose = lambda t, n, st: ('<div class="uis-card" style="display: flex; align-items: center; gap: 14px;"><span style="display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--uis-accent-soft); color: var(--uis-accent-text);">' + I('health', 's22') + '</span>'
                                 '<div style="flex: 1; display: flex; flex-direction: column; gap: 2px;"><strong class="uis-body">' + n + '</strong><span class="uis-body-s" style="color: var(--uis-ink-2);">' + t + '</span></div>' + st + '</div>')
        phone = lambda inner: '<div style="width: 390px; height: 780px; border: 1px solid var(--uis-line); border-radius: 44px; overflow: hidden; background: var(--uis-bg); display: flex; flex-direction: column;">' + inner + '</div>'
        tab = tabbar()
        today = phone('<div style="flex: 1; padding: 56px 20px 20px; display: flex; flex-direction: column; gap: 14px;"><span class="uis-body-s" style="color: var(--uis-ink-2);">[Weekday] · [DATE]</span><h2 class="uis-display-m">Today</h2>' +
                      dose('08:00 · 2 tablets', 'Morning medicines', X('Badge', 'tone="success" dot="{{yes}}"', 'Taken')) + dose('13:00 · 1 tablet', 'Lunch medicine', X('Badge', 'tone="warning" dot="{{yes}}"', 'Due')) + dose('21:00 · 1 tablet', 'Evening medicine', X('Badge', '', 'Later')) +
                      '<span style="flex: 1;"></span>' + BTN('I took it', 'block="{{yes}}" size="lg"') + BTN('Remind me in 10 min', 'block="{{yes}}" variant="ghost"') + '</div>' + tab)
        confirm = phone('<div style="flex: 1; padding: 56px 20px 20px; display: flex; flex-direction: column; gap: 18px;">' + X('Progress', 'value="{{p68}}"') + '<h2 class="uis-h1">Confirm your schedule</h2><p class="uis-body" style="color: var(--uis-ink-2);">Nothing is scheduled until you confirm.</p>' +
                        X('Input', 'label="Dose time" icon="clock" default-value="08:00"') + X('Switch', 'label="Remind my carer if I miss it" default-checked="{{yes}}"') + X('Alert', 'tone="info"', 'Medicine names never show on the lock screen.') +
                        '<span style="flex: 1;"></span>' + BTN('Confirm', 'block="{{yes}}" size="lg"') + '</div>' + tab)
        return '<div style="display: flex; gap: 40px; padding: 32px; justify-content: center;">' + today + confirm + '</div>', 860
    if s == 'obox':
        talent = lambda i, role: ('<article style="display: flex; flex-direction: column; gap: 10px;"><div style="position: relative;">' + slot('ob-' + str(i), '3 / 4', 'Talent photo') +
                                  '<span style="position: absolute; left: 12px; bottom: 12px;" class="uis-badge uis-badge--accent uis-badge--solid">' + role + '</span></div><strong class="uis-body">[Talent name]</strong><span class="uis-caption">[N] followers · Dubai</span></article>')
        return (X('NavBar', 'links="{{navLinks}}" cta="{{navCta}}"') + '<div style="padding: 32px; display: flex; flex-direction: column; gap: 24px;"><div style="display: flex; justify-content: space-between; align-items: end;"><h2 class="uis-display-l">Talent</h2>' + X('Chips', 'items="{{chips}}"') + '</div>' +
                grid(4, [talent(i, r) for i, r in enumerate(['Actor', 'Host', 'Creator', 'Musician'])], 16) +
                '<div class="uis-card" style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 32px; align-items: start;"><div style="display: flex; flex-direction: column; gap: 10px;"><h3 class="uis-display-m">Tell us the title</h3><p class="uis-body" style="color: var(--uis-ink-2);">A producer replies within one working day.</p></div>' +
                '<div style="display: flex; flex-direction: column; gap: 12px;">' + X('Input', 'label="Title" placeholder="[Film or series title]"') + grid(2, [X('Input', 'label="Name"'), X('Input', 'label="Email" type="email" icon="mail"')], 10) + BTN('Send enquiry', 'icon-right="arrow-right"') + '</div></div></div>'), 1180
    return '', 0

def tabbar():
    return ('<nav aria-label="Main" style="display: flex; justify-content: space-around; align-items: center; height: 72px; margin: 0 12px 16px; padding: 0 8px; border-radius: 999px; background: var(--uis-float-bg); border: 1px solid var(--uis-float-border); backdrop-filter: var(--uis-float-blur);">'
            + ''.join('<a href="#" aria-current="' + ('page' if n == 'Today' else 'false') + '" style="display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 14px; border-radius: 999px; text-decoration: none; font: 600 12px/1 var(--uis-font-body); color: ' + ('var(--uis-accent-text); background: var(--uis-surface); box-shadow: 0 0 0 2px var(--uis-accent-text)' if n == 'Today' else 'var(--uis-ink-2)') + ';">' + I(ic, 's22') + n + '</a>' for n, ic in [('Today', 'home'), ('Medicines', 'health'), ('History', 'clock'), ('Settings', 'settings')]) + '</nav>')

DATA = {
    'Senorita': dict(cards=('Order #1042', '[PRICE]', 'Paid · ships today'), stats=[('Orders today', '[N]', 'bag'), ('Revenue', '[AMOUNT]', 'currency'), ('Low stock', '[N]', 'box')],
                     columns=[('no', 'Order'), ('customer', 'Customer'), ('items', 'Items'), ('status', 'Status'), ('total', 'Total', 'right')],
                     rows=[['#1042', '[Customer A]', '2', ('success', 'Paid'), '[PRICE]'], ['#1043', '[Customer B]', '1', ('warning', 'Packing'), '[PRICE]'], ['#1044', '[Customer C]', '3', ('danger', 'Refund'), '[PRICE]'], ['#1045', '[Customer D]', '1', ('neutral', 'Draft'), '[PRICE]']],
                     filters=['All', 'Paid', 'Packing', 'Shipped', 'Refunds'], chips=['New in', 'Dresses', 'Sale', 'Under [PRICE]']),
    'Invios': dict(cards=('INV-0042 · [Client A]', '[AMOUNT]', 'Paid'), stats=[('Outstanding', '[AMOUNT]', 'wallet'), ('Paid this month', '[AMOUNT]', 'check-circle'), ('Overdue', '[N]', 'alert-circle')],
                   columns=[('no', 'Invoice'), ('client', 'Client'), ('due', 'Due'), ('status', 'Status'), ('amount', 'Amount', 'right')],
                   rows=[['INV-0042', '[Client A]', '[DATE]', ('success', 'Paid'), '[AMOUNT]'], ['INV-0043', '[Client B]', '[DATE]', ('info', 'Sent'), '[AMOUNT]'], ['INV-0044', '[Client C]', '[DATE]', ('danger', 'Overdue'), '[AMOUNT]'], ['INV-0045', '[Client D]', '—', ('neutral', 'Draft'), '[AMOUNT]']],
                   filters=['All', 'Draft', 'Sent', 'Paid', 'Overdue'], chips=['This month', 'AED', 'Unpaid', '[Client A]']),
    'Clickit': dict(cards=('Season 2 · Episode 4', '42 min', 'Published'), stats=[('Views this week', '[N]', 'eye'), ('Episodes live', '[N]', 'play'), ('Uploads in queue', '[N]', 'upload')],
                    columns=[('ep', 'Episode'), ('program', 'Program'), ('lang', 'Language'), ('status', 'Status'), ('len', 'Length', 'right')],
                    rows=[['S2 · E4', '[Program A]', 'AR · EN', ('success', 'Published'), '42 min'], ['S2 · E5', '[Program A]', 'AR', ('warning', 'Processing'), '39 min'], ['S1 · E9', '[Program B]', 'EN', ('danger', 'Failed upload'), '—'], ['S3 · E1', '[Program C]', 'AR · EN', ('neutral', 'Draft'), '—']],
                    filters=['All', 'Published', 'Processing', 'Drafts'], chips=['Drama', 'Talk', 'Kids', 'Arabic']),
    'Vamos': dict(cards=('Zurich → St. Moritz', 'CHF —', 'Confirmed · driver assigned'), stats=[('Rides today', '[N]', 'car'), ('Drivers on shift', '[N]', 'users'), ('Revenue', 'CHF —', 'currency')],
                  columns=[('ref', 'Booking'), ('route', 'Route'), ('when', 'Pick-up'), ('status', 'Status'), ('price', 'Price', 'right')],
                  rows=[['VM-2041', 'ZRH → St. Moritz', '[DATE] · [TIME]', ('success', 'Confirmed'), 'CHF —'], ['VM-2042', 'Zurich → ZRH', '[DATE] · [TIME]', ('info', 'Driver en route'), 'CHF —'], ['VM-2043', 'ZRH → Davos', '[DATE] · [TIME]', ('warning', 'Needs driver'), 'CHF —'], ['VM-2044', 'Basel → ZRH', '[DATE] · [TIME]', ('danger', 'Cancelled'), 'CHF —']],
                  filters=['Today', 'Tomorrow', 'This week'], chips=['Airport', 'Ski', 'City', 'Long distance']),
    'Almar': dict(cards=('Cartagena · 5 nights', 'AED —', 'Deposit paid'), stats=[('Guests arriving', '[N]', 'users'), ('Deposits due', '[N]', 'wallet'), ('Open requests', '[N]', 'message')],
                  columns=[('guest', 'Guest'), ('stay', 'Stay'), ('dates', 'Dates'), ('status', 'Status'), ('total', 'Total', 'right')],
                  rows=[['[Guest A]', 'Cartagena · villa', '[DATE] – [DATE]', ('success', 'Paid in full'), 'AED —'], ['[Guest B]', 'Medellín · suite', '[DATE] – [DATE]', ('warning', 'Deposit paid'), 'AED —'], ['[Guest C]', 'Santa Marta', '[DATE] – [DATE]', ('info', 'Airport meet'), 'AED —'], ['[Guest D]', 'Bogotá', '[DATE] – [DATE]', ('danger', 'Payment failed'), 'AED —']],
                  filters=['Arriving', 'In stay', 'Departed'], chips=['Cartagena', 'Medellín', 'Private pool', 'Airport meet']),
    'Koussay': dict(cards=('[Client A] · Discovery call', 'Nov 12', 'Confirmed'), stats=[('Calls this week', '[N]', 'calendar'), ('New leads', '[N]', 'users'), ('Booking drop-off', '[N]%', 'chart')],
                    columns=[('client', 'Client'), ('type', 'Project'), ('when', 'Call'), ('status', 'Status'), ('budget', 'Budget', 'right')],
                    rows=[['[Client A]', 'Website', '[DATE] · [TIME]', ('success', 'Confirmed'), '[Budget band]'], ['[Client B]', 'App', '[DATE] · [TIME]', ('info', 'New'), '[Budget band]'], ['[Client C]', 'Brand', '[DATE] · [TIME]', ('warning', 'Reschedule'), '[Budget band]'], ['[Client D]', 'Website', '[DATE] · [TIME]', ('neutral', 'Archived'), '[Budget band]']],
                    filters=['Upcoming', 'Past', 'Archived'], chips=['Website', 'App', 'Brand', 'Dubai']),
    'Sahti': dict(cards=('Morning medicines', '2 of 3', 'Taken · 08:10'), stats=[('Doses today', '2 of 3', 'health'), ('This week', '[N]%', 'chart'), ('Next dose', '13:00', 'clock')],
                  columns=[('time', 'Time'), ('med', 'Medicine'), ('dose', 'Dose'), ('status', 'Status'), ('at', 'Logged', 'right')],
                  rows=[['08:00', '[Medicine A]', '2 tablets', ('success', 'Taken'), '08:10'], ['13:00', '[Medicine B]', '1 tablet', ('warning', 'Due'), '—'], ['21:00', '[Medicine C]', '1 tablet', ('neutral', 'Later'), '—'], ['Yesterday', '[Medicine B]', '1 tablet', ('danger', 'Missed · carer told'), '—']],
                  filters=['Today', 'Week', 'Month'], chips=['Morning', 'Lunch', 'Evening', 'As needed']),
    'Obox': dict(cards=('Campaign · [Title]', '12 talents', 'Live'), stats=[('Live campaigns', '[N]', 'target'), ('Talent in database', '[N]', 'users'), ('Open enquiries', '[N]', 'inbox')],
                 columns=[('campaign', 'Campaign'), ('studio', 'Studio'), ('talent', 'Talent'), ('status', 'Status'), ('launch', 'Launch', 'right')],
                 rows=[['[Title A]', '[Studio A]', '12', ('success', 'Live'), '[DATE]'], ['[Title B]', '[Studio B]', '6', ('info', 'Casting'), '[DATE]'], ['[Title C]', '[Studio C]', '—', ('warning', 'Brief due'), '[DATE]'], ['[Title D]', '[Studio A]', '8', ('neutral', 'Wrapped'), '[DATE]']],
                 filters=['All', 'Live', 'Casting', 'Wrapped'], chips=['Film', 'Series', 'Music', 'Gaming']),
}

def js(o): return json.dumps(o, ensure_ascii=False).replace('</', '<\\/')  # inlined in <script>: never end it early

# ---------------------------------------------------------------- skins side by side (preset sheets)
def skins_block(p):
    c = p['copy']
    swatch = lambda role: '<span title="' + role + '" style="width: 28px; height: 28px; border-radius: var(--uis-r-chip); background: var(--uis-' + role + '); border: 1px solid var(--uis-line);"></span>'
    card = ('<div style="{{k.style}}">'
            '<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;"><strong class="uis-h3">{{k.key}}</strong><span class="uis-caption">{{k.tag}}</span></div>'
            '<div style="display: flex; gap: 6px;">' + ''.join(swatch(r) for r in ['bg', 'surface', 'ink', 'primary', 'accent', 'success', 'danger']) + '</div>'
            '<span style="font: var(--uis-display-weight) 22px/1.1 var(--uis-font-display); text-transform: var(--uis-display-case); letter-spacing: var(--uis-display-tracking); color: var(--uis-wordmark);">{{k.wordmark}}</span>'
            '<span class="uis-display-m">' + esc(c['headline']) + '</span>'
            + row(BTN(esc(c['cta'])), BTN('Cancel', 'variant="outline"'), X('Badge', 'tone="accent"', esc(c['chip'])), gap=10) +
            X('Input', 'label="' + esc(c['field']) + '" placeholder="' + esc(c['placeholder']) + '"') +
            X('Card', '', '<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;"><strong>' + esc(DATA[p['data']]['cards'][0]) + '</strong><strong style="font-variant-numeric: tabular-nums;">' + esc(DATA[p['data']]['cards'][1]) + '</strong></div>'
                          '<p class="uis-body-s" style="margin: 8px 0 0; color: var(--uis-ink-2);">' + esc(DATA[p['data']]['cards'][2]) + '</p>') +
            '<span class="uis-body-s" style="color: var(--uis-ink-2);">{{k.note}}</span></div>')
    return ('<section style="display: flex; flex-direction: column; gap: 20px; padding: 36px 0; border-top: 1px solid var(--uis-line);">'
            '<div style="display: flex; align-items: baseline; gap: 16px;"><h2 class="uis-h2" style="margin: 0;">Skins side by side</h2>'
            '<span class="uis-body-s" style="color: var(--uis-ink-2);">Same preset. Each product changes what it needs on top (colours, logo, fonts, anything). The outlined one is shown in full below.</span></div>'
            '<div style="display: grid; grid-template-columns: repeat(' + str(len(p['variants'])) + ', minmax(0, 1fr)); gap: 20px; align-items: start;">'
            '<sc-for list="{{skins}}" as="k" hint-placeholder-count="' + str(len(p['variants'])) + '">' + card + '</sc-for></div></section>')

# ---------------------------------------------------------------- the sheet
def sheet(p):
    pid, c, d = p['id'], p['copy'], DATA[p.get('data', p['id'])]
    is_preset = bool(p.get('preset'))
    mobile = p.get('mobile')
    title = p['name'] + ' · design sheet'

    status = (X('Badge', 'tone="success" dot="{{yes}}"', 'Engine preset · ' + esc(p.get('preset', 'atelier'))) if p['engine'] else X('Badge', 'tone="warning" dot="{{yes}}"', 'Study · not an engine preset yet'))
    header = ('<header style="display: grid; grid-template-columns: minmax(0, 1fr) 460px; gap: 48px; align-items: end; padding-bottom: 36px;">'
              '<div style="display: flex; flex-direction: column; gap: 14px;"><span class="uis-overline">' + ('Preset · ' if is_preset else 'Product preset · ') + esc(p.get('tagline', p.get('kind', ''))) + '</span>'
              '<h1 class="uis-display-xl">' + esc(p['name']) + '</h1><p class="uis-body-l" style="color: var(--uis-ink-2); max-width: 720px;">' + esc(p['summary']) + '</p></div>'
              '<div class="uis-card" style="display: flex; flex-direction: column; gap: 10px;">' + status +
              '<span class="uis-overline" style="margin-top: 4px;">' + ('Skin' if is_preset else 'Variant') + ' shown in full below</span><strong class="uis-h3">{{vKey}}</strong><span class="uis-body-s">{{vTag}} · {{modeLabel}}</span>'
              '<span class="uis-body-s" style="color: var(--uis-ink-2);">{{vNote}}</span><span class="uis-caption">Switch it in Tweaks › variant. Mode: Tweaks › mode.</span></div></header>'
              + (skins_block(p) if is_preset else '') +
              '<sc-if value="{{hasErr}}" hint-placeholder-val="{{no}}">' + X('Alert', 'tone="danger" title="Config error"', '{{err}}') + '</sc-if>')

    qs = ('<div class="uis-card" style="display: flex; flex-direction: column; gap: 10px;"><span class="uis-overline">Ask before any design</span>'
          '<ol class="uis-body-s" style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px;">' + ''.join('<li>' + esc(q) + '</li>' for q in p.get('questions', [])) + '</ol>'
          '<span class="uis-caption">Then pick the kind (Start here, Kinds page) and put the brand on top. A product may change anything; improvements come back here as a proposal.</span></div>') if p.get('questions') else ''
    s1 = section('01', 'How it thinks', ('The rules every screen in this preset follows, whatever is built on it.' if is_preset else 'The product rules every screen follows. Read before designing anything new for ' + esc(p['name']) + '.'),
                 '<div class="uis-card" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 32px;">' + ''.join(rule(do, esc(t)) for do, t in p['rules']) + '</div>' + qs +
                 X('Alert', 'tone="warning" title="Gaps and conflicts"', esc(p['gaps'])) +
                 '<p class="uis-caption" style="margin: 0;">Source: ' + esc(p['source']) + (' Engine preset: packages/core/src/presets.ts.' if is_preset else ' Values from the "Product preset · ' + esc(p['name']) + '" study on the Presets page.') + '</p>')

    sw = ('<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px;"><sc-for list="{{swatches}}" as="s" hint-placeholder-count="36">'
          '<div style="display: flex; flex-direction: column; gap: 6px; min-width: 0;"><div style="height: 64px; border-radius: var(--uis-r-inner); background: {{s.css}}; border: 1px solid var(--uis-line);"></div>'
          '<span style="font: 600 12px/1.2 var(--uis-font-mono); color: var(--uis-ink);">{{s.role}}</span><span style="font: 400 11.5px/1.2 var(--uis-font-mono); color: var(--uis-ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{s.hex}}</span>'
          '<span class="uis-caption" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{s.use}}</span><span style="font: 600 10.5px/1 var(--uis-font-mono); letter-spacing: 0.06em; text-transform: uppercase; color: {{s.srcInk}};">{{s.src}}</span></div></sc-for></div>')
    s2 = section('02', 'Colour roles', 'Every role the components read, computed by the engine for this ' + ('skin' if is_preset else 'variant') + '. <strong>Source</strong> = pinned ' + ('by the preset or the skin' if is_preset else 'from the product') + '. <strong>Derived</strong> = the engine made it from the seeds; check it before shipping.', sw +
                 '<p class="uis-caption" style="margin: 0;">Seeds: {{seeds}}</p>')

    ct = ('<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px;"><sc-for list="{{pairs}}" as="k" hint-placeholder-count="35">'
          '<div style="display: flex; align-items: center; gap: 10px; padding: 8px; border: 1px solid var(--uis-line); border-radius: var(--uis-r-inner); min-width: 0;">'
          '<span style="display: grid; place-items: center; width: 40px; height: 40px; flex-shrink: 0; border-radius: var(--uis-r-inner); background: {{k.bgCss}}; color: {{k.fgCss}}; font: 700 15px/1 var(--uis-font-body); border: 1px solid var(--uis-line);">Aa</span>'
          '<span style="display: flex; flex-direction: column; gap: 3px; min-width: 0;"><span style="font: 500 11px/1.2 var(--uis-font-mono); color: var(--uis-ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{k.pair}}</span>'
          '<strong style="font: 700 13px/1 var(--uis-font-body); font-variant-numeric: tabular-nums; color: {{k.okInk}};">{{k.ratio}} {{k.verdict}}</strong></span></div></sc-for></div>')
    s3 = section('03', 'Contrast', 'Every text pair the build checks, in the mode shown. 4.5:1 is the floor; the build fails below it.', ct + '<p class="uis-body-s" style="margin: 0;"><strong>{{passCount}}</strong> of {{pairCount}} pairs pass.</p>')

    trow = lambda name, cls, sample, metric: ('<div style="display: grid; grid-template-columns: 140px minmax(0, 1fr) 260px; gap: 24px; align-items: baseline; padding: 14px 0; border-bottom: 1px solid var(--uis-line);">'
                                              '<span style="font: 500 12px/1.3 var(--uis-font-mono); color: var(--uis-ink-3);">' + name + '</span><span class="' + cls + '" style="margin: 0; min-width: 0;">' + sample + '</span>'
                                              '<span style="font: 400 12px/1.4 var(--uis-font-mono); color: var(--uis-ink-2);">' + metric + '</span></div>')
    s4 = section('04', 'Typography', 'Display and headings use the display face; body, labels and tables the body face. {{fontNote}}',
                 '<div>' + trow('display-xl', 'uis-display-xl', esc(c['headline']), '{{tDisplay}} · 64') + trow('display-l', 'uis-display-l', esc(c['headline']), '{{tDisplay}} · 48') + trow('display-m', 'uis-display-m', esc(c['headline']), '{{tDisplay}} · 36') +
                 trow('h1', 'uis-h1', 'Page title', '{{tHeading}} · 30') + trow('h2', 'uis-h2', 'Section title', '{{tHeading}} · 24') + trow('h3', 'uis-h3', 'Card title', '{{tHeading}} · 20') +
                 trow('body-l', 'uis-body-l', 'Lead paragraph that sets up the page in one sentence.', '{{tBody}} · 18 / 1.6') + trow('body', 'uis-body', 'Body text for descriptions, forms and messages.', '{{tBody}} · 16 / 1.55') +
                 trow('body-s', 'uis-body-s', 'Dense UI, tables, helper text.', '{{tBody}} · 14 / 1.5') + trow('caption', 'uis-caption', 'Caption · meta · timestamps', '{{tBody}} · 12') +
                 trow('overline', 'uis-overline', 'Section kicker', '{{tBody}} · 11 · 600 · caps') + trow('button', 'uis-body', BTN(esc(c['cta'])), '{{tButton}}') +
                 trow('numbers', 'uis-h2', '<span style="font-variant-numeric: tabular-nums;">0123456789</span>', 'tabular-nums for money and dates') + '</div>')

    rad = ('<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px;"><sc-for list="{{radii}}" as="r" hint-placeholder-count="10">'
           '<div style="display: flex; flex-direction: column; gap: 8px;"><div style="height: 72px; border: 2px solid var(--uis-ink); border-radius: {{r.css}}; background: var(--uis-surface-2);"></div>'
           '<span style="font: 600 12px/1.2 var(--uis-font-mono);">{{r.role}}</span><span class="uis-caption">{{r.value}} · {{r.use}}</span></div></sc-for></div>')
    hts = ('<div style="display: flex; gap: 24px; align-items: flex-end;"><sc-for list="{{heights}}" as="h" hint-placeholder-count="3">'
           '<div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start;"><div style="width: 160px; height: {{h.css}}; border-radius: var(--uis-r-control); background: var(--uis-primary); color: var(--uis-primary-ink); display: grid; place-items: center; font: 600 12px/1 var(--uis-font-mono);">{{h.value}}</div>'
           '<span class="uis-caption">{{h.role}} · {{h.use}}</span></div></sc-for></div>')
    shd = grid(4, [cell('shadow-' + k, '<div style="height: 88px; border-radius: var(--uis-r-card); background: var(--uis-surface); border: 1px solid var(--uis-line); box-shadow: var(--uis-shadow-' + k + ');"></div><span class="uis-caption">' + u + '</span>') for k, u in [('sm', 'Cards at rest'), ('md', 'Raised cards, hover'), ('lg', 'Dialogs'), ('float', 'Menus, docks, toasts')]], 20)
    s5 = section('05', 'Shape, size, depth', 'Corner radius per role, control heights, card padding and shadows. 999 = full pill.',
                 cell('Radius', rad) + cell('Control heights', hts) + cell('Card padding · gap', '<span class="uis-body-s">pad-card <strong>{{padCard}}</strong> · gap <strong>{{gapV}}</strong> · focus ring <strong>{{ringV}}</strong> · checkbox edge <strong>{{checkV}}</strong></span>') + cell('Shadows', shd))

    VARS = [('primary', 'One main action per screen'), ('accent', 'Highlight moment'), ('secondary', 'Second action'), ('outline', 'Neutral, cancel'), ('ghost', 'Low emphasis'), ('soft', 'Tinted secondary'), ('danger', 'Destructive')]
    bvar = grid(2, [cell(v + ' · ' + n, row(BTN(esc(c['cta']) if v == 'primary' else v.capitalize(), 'variant="' + v + '"'), BTN('With icon', 'variant="' + v + '" icon="plus"'), BTN('', 'variant="' + v + '" icon-only="{{yes}}" icon="more" label="More"'))) for v, n in VARS], 18)
    bsize = grid(3, [cell(z + ' · {{h_' + z + '}}', row(BTN(esc(c['cta']), 'size="' + z + '"'), BTN('', 'size="' + z + '" icon-only="{{yes}}" icon="plus" label="Add"'))) for z in ['sm', 'md', 'lg']])
    st = lambda v, hov: cell(v + ' · states', row(plainbtn(v, 'Default'), plainbtn(v, 'Hover', '--_bg: ' + hov + ';'), plainbtn(v, 'Focus', 'outline: 2px solid var(--uis-focus); outline-offset: 2px;'), plainbtn(v, 'Pressed', 'transform: var(--uis-press);'), plainbtn(v, 'Disabled', '', ' disabled=""'), plainbtn(v, I('refresh', 's16') + 'Saving…', '', ' disabled="" aria-busy="true"')))
    bimg = ('<div style="border-radius: var(--uis-r-card); background: var(--uis-neutral-900); padding: 24px; display: flex; gap: 12px; align-items: center;" data-tone="image"><span style="color: var(--uis-on-image); font: 500 11.5px/1.3 var(--uis-font-mono); margin-right: 8px;">over photos · light, glass</span>' +
            BTN(esc(c['cta']), 'variant="light"') + BTN(esc(c['cta2']), 'variant="glass"') + '</div>')
    s6 = section('06', 'Buttons', 'Every variant, size and state in this product\'s shape and type. Labels are this product\'s real actions.',
                 cell('Variants', bvar) + cell('Sizes', bsize) + st('primary', 'var(--uis-primary-hover)') + st('outline', 'var(--uis-surface-2)') + st('danger', 'var(--uis-danger-hover)') +
                 grid(2, [cell('Product actions', row(BTN(esc(c['cta']), 'size="lg"'), BTN(esc(c['cta2']), 'size="lg" variant="outline"'))), cell('Block · phones and forms', '<div style="max-width: 380px;">' + BTN(esc(c['cta']), 'block="{{yes}}" size="lg"') + '</div>')]) + bimg)

    s7 = section('07', 'Forms', 'Fields, states and choices. Password fields always have the eye on the right.',
                 grid(3, [cell('Label · input · hint', X('Input', 'label="' + esc(c['field']) + '" placeholder="' + esc(c['placeholder']) + '" hint="Shown to the customer."')),
                          cell('Leading icon', X('Input', 'label="Email" icon="mail" type="email" placeholder="you@example.com"')),
                          cell('Search', X('Input', 'variant="search" icon="search" placeholder="Search" aria-label="Search"')),
                          fstate(pid, 'Default', c['placeholder']), fstate(pid, 'Focus', c['placeholder'], 'border-color: var(--uis-focus-field); box-shadow: 0 0 0 var(--uis-focus-ring-width) var(--uis-focus-ring);'),
                          cell('Error', X('Input', 'label="Email" default-value="name@" error="Enter a full email address."')),
                          fstate(pid, 'Disabled', c['placeholder'], 'opacity: 0.55;', ' disabled=""'), cell('Password · eye right', X('Input', 'label="Password" type="password" default-value="example-pass"')),
                          cell('Select', X('Select', 'label="Language" options="{{langs}}"'))]) +
                 grid(3, [cell('Checkbox', '<div style="display: flex; flex-direction: column; gap: 12px;">' + X('Checkbox', 'label="Unchecked"') + X('Checkbox', 'label="Checked" default-checked="{{yes}}"') + '</div>'),
                          cell('Switch', '<div style="display: flex; flex-direction: column; gap: 12px;">' + X('Switch', 'label="Off"') + X('Switch', 'label="On" default-checked="{{yes}}"') + '</div>'),
                          cell('Textarea', X('Textarea', 'label="Note" placeholder="Add a note"'))]) + cell('Segmented filter', X('Tabs', 'items="{{filters}}"')))

    TONES = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info']
    s8 = section('08', 'Status, badges, chips', 'Status is always a dot or icon plus a word, never colour alone.',
                 '<div class="uis-card" style="display: grid; grid-template-columns: 110px repeat(3, minmax(0, 1fr)); gap: 12px 20px; align-items: center;">' +
                 '<span></span><span class="uis-caption">soft</span><span class="uis-caption">dot</span><span class="uis-caption">outline</span>' +
                 ''.join('<span style="font: 500 12.5px/1.3 var(--uis-font-mono);">' + t + '</span>' + X('Badge', 'tone="' + t + '"', t.capitalize()) + X('Badge', 'tone="' + t + '" dot="{{yes}}"', t.capitalize()) + X('Badge', 'tone="' + t + '" outline="{{yes}}"', t.capitalize()) for t in TONES) + '</div>' +
                 grid(2, [cell('This product\'s status words', row(*[X('Badge', 'tone="' + r[3][0] + '" dot="{{yes}}"', esc(r[3][1])) for r in d['rows']])), cell('Product chip · filters', row(X('Badge', 'tone="accent" solid="{{yes}}"', esc(c['chip'])), X('Chips', 'items="{{chips}}"')))]))

    s9 = section('09', 'Feedback', 'Alerts in four tones, a toast for confirmations, progress for long tasks.',
                 grid(2, [X('Alert', 'tone="success" title="' + esc(c['alert'][0]) + '"', esc(c['alert'][1])), X('Alert', 'tone="info" title="Heads up"', 'Changes save automatically.'),
                          X('Alert', 'tone="warning" title="Check this"', 'Something needs a second look before it goes out.'), X('Alert', 'tone="danger" title="Could not save"', 'Try again in a moment.')], 16) +
                 grid(3, [cell('Toast', X('Toast', 'title="' + esc(c['toast'][0]) + '"', esc(c['toast'][1]))), cell('Progress · 40%', X('Progress', 'value="{{p40}}"')), cell('Progress · done', X('Progress', 'value="{{p100}}"'))]))

    tcard = X('Card', '', '<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px;"><strong class="uis-h3">' + esc(d['cards'][0]) + '</strong><strong style="font-variant-numeric: tabular-nums;">' + esc(d['cards'][1]) + '</strong></div>'
              '<div style="display: flex; gap: 8px; align-items: center; margin-top: 10px;">' + X('Badge', 'tone="success" dot="{{yes}}"', esc(d['cards'][2])) + '</div>')
    mcard = X('Card', 'flush="{{yes}}"', slot('mc-' + pid.lower(), '16 / 9', 'Photo', ' border-radius: 0;') + '<div style="padding: var(--uis-pad-card); display: flex; flex-direction: column; gap: 6px;"><strong class="uis-h3">[Title]</strong><span class="uis-body-s" style="color: var(--uis-ink-2);">[One line of detail]</span></div>')
    s10 = section('10', 'Cards and data', 'The product\'s own card, stats and table. Every amount, name and date is a placeholder until real data exists.',
                  grid(3, [cell('Record card', tcard), cell('Media card', mcard), cell('Raised', X('Card', 'variant="raised"', '<strong class="uis-h3">Raised card</strong><p class="uis-body-s" style="color: var(--uis-ink-2); margin-top: 8px;">Hover and focus lift with shadow-md.</p>'))]) +
                  grid(3, [X('Card', '', X('Stat', 'label="' + esc(l) + '" value="' + esc(v) + '" icon="' + ic + '"')) for l, v, ic in d['stats']], 16) + X('Table', 'columns="{{columns}}" rows="{{rows}}"'))

    n = p['nav']
    if n['type'] == 'side':
        navh = ('<div style="display: flex; height: 560px; border: 1px solid var(--uis-line); border-radius: 16px; overflow: hidden;">' + X('AppSidebar', 'sections="{{navSections}}" user="{{navUser}}"') +
                '<div style="flex: 1; padding: 24px; background: var(--uis-bg); display: flex; flex-direction: column; gap: 12px;"><span class="uis-overline">Current page</span><h3 class="uis-h1">{{navActive}}</h3><p class="uis-body-s" style="color: var(--uis-ink-2);">Active item: nav-active-bg fill, nav-active-ink text.</p></div></div>')
        navnote = 'App sidebar with this product\'s sections and current page.'
    elif n['type'] == 'top':
        dark = n.get('dark')
        wrapv = ' --uis-bg: #1E1F1F; --uis-surface: #1E1F1F; --uis-surface-2: #2A2B2B; --uis-surface-3: #343535; --uis-ink: #FFFFFF; --uis-ink-2: #C9CACA; --uis-line: rgba(255,255,255,0.12);' if dark else ''
        navh = ('<div style="border: 1px solid var(--uis-line); border-radius: 16px; overflow: hidden;' + wrapv + '">' + X('NavBar', 'links="{{navLinks}}" cta="{{navCta}}"') + '</div>' +
                ('<p class="uis-caption" style="margin: 0;">Dark charcoal bar as shipped (bar colours set on the wrapper).</p>' if dark else ''))
        navnote = 'Website top bar with this product\'s links and its one call to action.'
    else:
        navh = '<div style="width: 420px; padding: 24px 0; background: var(--uis-bg); border: 1px solid var(--uis-line); border-radius: var(--uis-r-card);">' + tabbar() + '</div>'
        navnote = 'Floating glass tab bar: four items, the current one ringed in accent.'
    s11 = section('11', 'Navigation', navnote, navh)

    scr, sh = screen(p)
    s12 = section('12', 'Sample screen', 'A real ' + p['name'] + ' screen built only from UI System parts in this variant.',
                  '<div style="border: 1px solid var(--uis-line); border-radius: 16px; overflow: hidden; background: var(--uis-bg);">' + scr + '</div>')

    s13 = section('13', 'ui.config.json', 'The exact config behind this sheet. Paste it into a ' + p['name'] + ' project and the components look like this.' + (' Skins may change anything on top of the preset.' if is_preset else ' It becomes a named engine preset only on your word.'),
                  '<pre style="margin: 0; padding: 20px; max-height: 620px; overflow: auto; border-radius: var(--uis-r-card); background: var(--uis-surface-2); border: 1px solid var(--uis-line); font: 400 12.5px/1.55 var(--uis-font-mono); color: var(--uis-ink); white-space: pre;">{{configJson}}</pre>'
                  '<p class="uis-caption" style="margin: 0;">{{fontNote}}</p>')

    body = '<div style="padding: 64px 72px;">' + header + s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + s10 + s11 + s12 + s13 + '</div>'
    MEASURED = {'Ledger': 10191, 'Atelier': 9998, 'Almar': 9088, 'Clickit': 9603, 'Invios': 9712, 'Koussay': 9641, 'Obox': 9326, 'Sahti': 9422, 'Senorita': 9169, 'Vamos': 9121}  # rendered locally with the canvas runtime (Ledger 10146, Atelier 9953 on 2026-11-09 after the reserved hint slot; products 2026-11-08), plus margin
    H = -(-(MEASURED[pid] + 40) // 20) * 20

    # ---- data for the script
    variants = {v['key']: {'tag': v['tag'], 'note': v['note'], 'mode': v['mode'], 'config': v['config'], 'vars': v['vars']} for v in p['variants']}
    navSections = n.get('sections', [])
    navActive = next((i['label'] for s in navSections for i in s['items'] if i.get('active')), '')
    data = {
        'default': p['default'], 'variants': variants, 'roles': ROLES,
        'fontNotes': {'Clickit': 'LBC ships in the product; Inter stands in here.', 'Vamos': 'Qurova display ships in the product; Poppins 700 stands in here.', 'Almar': 'Questa display ships in the product; Georgia stands in here.', 'Obox': 'Open Sauce One ships in the product; Inter stands in here.'}.get(pid, 'Fonts load from Google Fonts.'),
        'columns': [dict(key=col[0], label=col[1], **({'align': col[2]} if len(col) > 2 else {})) for col in d['columns']],
        'rows': [{d['columns'][0][0]: {'strong': r[0]}, d['columns'][1][0]: r[1], d['columns'][2][0]: r[2], d['columns'][3][0]: {'tone': r[3][0], 'label': r[3][1]}, d['columns'][4][0]: r[4]} for r in d['rows']],
        'filters': d['filters'], 'chips': [{'label': x} for x in d['chips']],
        'navSections': navSections, 'navUser': n.get('user'), 'navActive': navActive,
        'navLinks': n.get('links', []), 'navCta': n.get('cta'),
        'navLinksShop': [{'label': 'New in', 'active': True}, {'label': 'Dresses'}, {'label': 'Tops'}, {'label': 'Sale'}],
        'shopActions': [{'icon': 'search', 'label': 'Search'}, {'icon': 'user', 'label': 'Account'}, {'icon': 'bag', 'label': 'Bag', 'count': 2}],
        'crumbs': [p['name'], navActive or 'Home'],
        'tripTabs': ['One way', 'Return', 'By the hour'],
        'langs': ['English', 'العربية'] + (['Deutsch', 'Français'] if pid == 'Vamos' else []),
    }
    variant_keys = [v['key'] for v in p['variants']]
    props = {'variant': {'editor': 'enum', 'options': variant_keys, 'default': p['default'], 'section': 'Preset'},
             'mode': {'editor': 'enum', 'options': ['auto', 'light', 'dark'], 'default': 'auto', 'section': 'Preset'},
             '$preview': {'width': 1440, 'height': H}}
    script = '''class Component extends DCLogic {
  renderVals() {
    const D = ''' + js(data) + ''';
    const p = this.props;
    const key = D.variants[p.variant] ? p.variant : D.default;
    const v = D.variants[key];
    const mode = p.mode === 'light' || p.mode === 'dark' ? p.mode : v.mode;
    const cfg = JSON.parse(JSON.stringify(v.config));
    cfg.color = Object.assign({}, cfg.color || {}, { mode: mode });
    const U = window.UIS || {};
    let th = null, err = '';
    try { th = U.buildTheme(cfg); } catch (e) { err = String((e && e.message) || e); }
    const vars = th ? th.vars(mode) : {};
    for (const k in v.vars) vars[k] = v.vars[k];
    const wrap = 'width: 1440px; min-height: ''' + str(H) + '''px; box-sizing: border-box; background: var(--uis-bg); color: var(--uis-ink); font-family: var(--uis-font-body); ' + Object.keys(vars).map(function (k) { return k + ': ' + vars[k]; }).join('; ') + ';';
    const col = th ? th.colors[mode] : {};
    const skins = Object.keys(D.variants).map(function (k) {
      const s = D.variants[k];
      const sc = JSON.parse(JSON.stringify(s.config));
      sc.color = Object.assign({}, sc.color || {}, { mode: s.mode });
      let st = null;
      try { st = U.buildTheme(sc); } catch (e) { st = null; }
      const sv = st ? st.vars(s.mode) : {};
      for (const q in s.vars) sv[q] = s.vars[q];
      return { key: k, tag: s.tag, note: s.note, current: k === key,
        style: 'display: flex; flex-direction: column; gap: 16px; min-width: 0; padding: 24px; box-sizing: border-box; border-radius: 16px; background: var(--uis-bg); color: var(--uis-ink); font-family: var(--uis-font-body); border: ' + (k === key ? '2px solid var(--uis-primary)' : '1px solid var(--uis-line)') + '; ' + Object.keys(sv).map(function (q) { return q + ': ' + sv[q]; }).join('; ') + ';',
        wordmark: (s.config.brand && s.config.brand.wordmark) || '[NAME]' };
    });
    const pre = cfg.preset && U.PRESETS && U.presetId && U.presetId(cfg.preset) ? U.PRESETS[U.presetId(cfg.preset)].config : {};
    const prc = pre.color || {};
    const pins = Object.assign({}, mode === 'dark' ? prc.pinDark : prc.pin, mode === 'dark' ? cfg.color.pinDark : cfg.color.pin);
    const seedKeys = ['primary', 'accent', 'success', 'warning', 'danger', 'info'];
    const seedSet = Object.assign({}, prc, cfg.color);
    const swatches = D.roles.map(function (r) {
      const src = pins[r[0]] !== undefined ? 'source' : (seedKeys.indexOf(r[0]) >= 0 && seedSet[r[0]] ? 'seed' : 'derived');
      return { role: r[0], use: r[1], hex: col[r[0]] || '—', css: 'var(--uis-' + r[0] + ')', src: src, srcInk: src === 'derived' ? 'var(--uis-ink-3)' : 'var(--uis-success-text)' };
    });
    const rep = th && U.contrastReport ? U.contrastReport(th).filter(function (x) { return x.mode === mode; }) : [];
    rep.sort(function (a, b) { return a.ratio - b.ratio; });
    const pairs = rep.map(function (x) { return { pair: x.fg + ' / ' + x.bg, ratio: x.ratio.toFixed(2) + ':1', verdict: x.pass ? 'AA' : 'FAIL', okInk: x.pass ? 'var(--uis-success-text)' : 'var(--uis-danger-text)', fgCss: 'var(--uis-' + x.fg + ')', bgCss: 'var(--uis-' + x.bg + ')' }; });
    const rr = th ? th.radius : {};
    const RU = { chip: 'Badges, chips', control: 'Buttons', field: 'Inputs', search: 'Search', card: 'Cards', panel: 'Panels, drawers', media: 'Photos', shell: 'App frame, nav', inner: 'Nested parts', avatar: 'People' };
    const radii = Object.keys(RU).map(function (k) { const val = rr[k]; const css = typeof val === 'number' ? val + 'px' : String(val || 0); return { role: k, use: RU[k], value: css === '999px' ? 'pill' : css, css: css }; });
    const sh = th ? th.shared : {};
    const heights = [['sm', 'Icon buttons, chips, dense'], ['md', 'Buttons, inputs'], ['lg', 'Hero and phone actions']].map(function (h) { return { role: 'h-' + h[0], use: h[1], value: sh['h-' + h[0]], css: sh['h-' + h[0]] }; });
    const fam = function (s) { return String(s || '').split(',')[0].replace(/['"]/g, '').trim(); };
    const V = function (k) { return vars['--uis-' + k] || ''; };
    const c = cfg.color;
    const seeds = seedKeys.filter(function (k) { return seedSet[k]; }).map(function (k) { return k + ' ' + seedSet[k]; }).join(' · ') || 'preset seeds';
    return {
      wrap: wrap, skins: skins, err: err, hasErr: !!err, yes: true, no: false,
      s14: 14, s16: 16, s18: 18, s20: 20, s22: 22, p27: 27, p40: 40, p68: 68, p100: 100,
      vKey: key, vTag: v.tag, vNote: v.note, modeLabel: mode === 'dark' ? 'Dark' : 'Light',
      swatches: swatches, pairs: pairs, passCount: rep.filter(function (x) { return x.pass; }).length, pairCount: rep.length, seeds: seeds,
      radii: radii, heights: heights, padCard: sh['pad-card'], gapV: sh.gap, ringV: sh['focus-ring-width'], checkV: sh['check-border'],
      h_sm: sh['h-sm'], h_md: sh['h-md'], h_lg: sh['h-lg'],
      tDisplay: fam(V('font-display')) + ' ' + V('display-weight') + ' · ' + V('display-tracking') + (V('display-case') === 'uppercase' ? ' · caps' : ''),
      tHeading: fam(V('heading-font')) + ' ' + V('heading-weight') + (V('heading-case') === 'uppercase' ? ' · caps' : ''),
      tBody: fam(V('font-body')),
      tButton: fam(V('btn-font')) + ' ' + V('btn-weight') + ' · ' + V('btn-size') + (V('btn-case') === 'uppercase' ? ' · caps ' + V('btn-tracking') : ''),
      fontNote: D.fontNotes,
      configJson: JSON.stringify(v.config, null, 2),
      columns: D.columns, rows: D.rows, filters: D.filters, chips: D.chips, langs: D.langs,
      navSections: D.navSections, navUser: D.navUser, navActive: D.navActive, navLinks: D.navLinks, navCta: D.navCta,
      navLinksShop: D.navLinksShop, shopActions: D.shopActions, crumbs: D.crumbs, tripTabs: D.tripTabs
    };
  }
}
'''
    fams = {}
    for f in ('family=Inter+Tight:wght@400..700&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400..600&family=Geist:wght@400..700&family=Geist+Mono:wght@400..600&family=Manrope:wght@400..800&family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400..700&family=Archivo:wdth,wght@75..125,700..900&' + p['fonts'] + ''.join('&' + v['fonts'] for v in p['variants'] if v['fonts'])).split('&'):
        if f:
            assert FONT_SPEC.match(f), 'bad font spec: ' + f
            fams[f.split(':')[0]] = f
    fonts = 'https://fonts.googleapis.com/css2?' + '&'.join(fams.values()) + '&display=swap'
    root_attrs = (('preset="' + p.get('preset', 'atelier') + '" ') if p['engine'] else '') + 'mode="{{modeAttr}}" wordmark="' + esc(p['name']) + '" caption="" logo-mark="none" logo-variant="wordmark" style="display: block;"'
    html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>' + esc(title) + '</title>\n<script src="./support.js"></script>\n'
            '<link rel="stylesheet" href="ds/uis/components/bundle.css">\n<script src="ds/uis/components/bundle.js"></script>\n</head>\n<body>\n<x-dc>\n'
            '<helmet>\n<link rel="stylesheet" href="' + esc(fonts) + '">\n<style>body{margin:0}</style>\n</helmet>\n'
            + X('Root', root_attrs, '\n<div style="{{wrap}}">\n' + body + '\n</div>\n') +
            '\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'' + json.dumps(props, separators=(',', ':')) + '\'>\n' + script.replace("vKey: key,", "vKey: key, modeAttr: mode,") + '</script>\n</body>\n</html>\n')
    assert html.count('<x-import') == html.count('</x-import>'), pid
    assert "'" not in json.dumps(props), pid
    name = ('Sheet-' if is_preset else 'Sheet-Preset-') + pid + '.dc.html'
    with open(OUT + '/' + name, 'w', encoding='utf-8') as fh:
        fh.write(html)
    MADE[name] = (title, 1440, H)

for p in PRESET_SHEETS:
    sheet(p)
with open(OUT + '/made-presets.json', 'w', encoding='utf-8') as fh:
    json.dump(MADE, fh, indent=1)
print(len(MADE), 'sheets:', ', '.join(k + ' ' + str(v[2]) for k, v in MADE.items()))
