# One canvas page per component family, for UI System · Canvas (owner, 2026-11-09).
# Each family gets two boards:
#   C-<Family>-States.dc.html  every state, size and icon placement, driven by the board's shared Tweaks
#   C-<Family>-Themes.dc.html  a compact specimen in every engine preset and every product skin, light and dark,
#                              each cell themed live by UIS.buildTheme(config) with its own contrast count
# States that UI System does not have yet are listed as gaps on the board, never drawn as fake controls.
# Run after pnpm build:  python3 scripts/canvas/componentpages.py <out_dir>
#   writes the boards + made-components.json ({file: [title, page, w, h]}) for the canvas index.
import copy, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from products import PRODUCTS
from presets_data import PRESET_SHEETS


ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import subprocess
ICONS = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    "const r = await import(process.argv[1]); console.log(JSON.stringify(r.ICONS));", os.path.join(ROOT_DIR, 'packages/react/dist/index.js')]))
kebab = lambda k: re.sub(r'([A-Z])', lambda m: '-' + m.group(1).lower(), k)


def svg(name, size=None, stroke=1.5):
    """Raw Hugeicons SVG (same nodes as UIS.Icon). Plain-class markup needs it: an x-import host is display: contents
    and breaks child selectors such as .uis-control > .uis-icon."""
    nodes = ''.join('<' + t + ''.join(' ' + kebab(k) + '="' + str(v) + '"' for k, v in a.items()) + '></' + t + '>' for t, a in ICONS[name])
    st = ' style="width: ' + str(size) + 'px; height: ' + str(size) + 'px;"' if size else ''
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + str(stroke) + '" stroke-linecap="round" stroke-linejoin="round" class="uis-icon"' + st +
            ' aria-hidden="true">' + nodes + '</svg>')

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
MADE = {}

X = lambda comp, attrs='', inner='': '<x-import component-from-global-scope="UIS.' + comp + '"' + (' ' + attrs if attrs else '') + '>' + inner + '</x-import>'
I = lambda name, size='s18': X('Icon', 'name="' + name + '" size="{{' + size + '}}"')
esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
MONO = 'font: 500 11.5px/1.3 var(--uis-font-mono); color: var(--uis-ink-3);'
STATES = ['default', 'hover', 'focus', 'active', 'selected', 'disabled', 'loading', 'error', 'empty']
FOCUS = 'outline: 2px solid var(--uis-focus); outline-offset: 2px;'
FIELD_FOCUS = 'border-color: var(--uis-focus-field); box-shadow: 0 0 0 var(--uis-focus-ring-width) var(--uis-focus-ring);'


def row(*items, gap=12, align='center', wrap=True):
    return '<div style="display: flex; gap: ' + str(gap) + 'px; align-items: ' + align + ';' + (' flex-wrap: wrap;' if wrap else '') + '">' + ''.join(items) + '</div>'


def col(*items, gap=10):
    return '<div style="display: flex; flex-direction: column; gap: ' + str(gap) + 'px; min-width: 0;">' + ''.join(items) + '</div>'


def cell(label, content):
    return col('<span style="' + MONO + '">' + label + '</span>', content, gap=8)


def section(title, note, content):
    return ('<section style="display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; padding: 32px 0; border-top: 1px solid var(--uis-line);">'
            '<div style="display: flex; flex-direction: column; gap: 8px;"><h2 class="uis-h3" style="margin: 0;">' + title + '</h2>'
            '<p class="uis-body-s" style="margin: 0; color: var(--uis-ink-2);">' + note + '</p></div>'
            '<div style="display: flex; flex-direction: column; gap: 20px; min-width: 0;">' + content + '</div></section>')


def matrix(cols, rows, first=150):
    """rows: [(label, [cell html per column])]. Column heads are state names."""
    tpl = 'grid-template-columns: ' + str(first) + 'px repeat(' + str(len(cols)) + ', minmax(0, 1fr));'
    head = '<span></span>' + ''.join('<span style="' + MONO + ' text-transform: uppercase; letter-spacing: 0.06em;">' + c + '</span>' for c in cols)
    body = ''.join('<span style="font: 600 12.5px/1.3 var(--uis-font-mono); color: var(--uis-ink-2);">' + lab + '</span>' +
                   ''.join('<div style="min-width: 0;">' + c + '</div>' for c in cells) for lab, cells in rows)
    return '<div style="display: grid; ' + tpl + ' gap: 16px 14px; align-items: center;">' + head + body + '</div>'


def coverage(cov):
    """cov: {state: ('shown'|'na'|'gap', note)} for all 9 states."""
    out = []
    for s in STATES:
        kind, note = cov[s]
        tone, word = {'shown': ('success', 'Shown'), 'na': ('neutral', 'Not used'), 'gap': ('warning', 'Gap')}[kind]
        out.append('<div style="display: flex; flex-direction: column; gap: 6px; min-width: 0; padding: 12px; border: 1px solid var(--uis-line); border-radius: var(--uis-r-inner); background: var(--uis-surface);">'
                   '<span style="font: 600 12px/1.2 var(--uis-font-mono); color: var(--uis-ink);">' + s + '</span>' + X('Badge', 'tone="' + tone + '" dot="{{yes}}"', word) +
                   '<span class="uis-caption" style="color: var(--uis-ink-2);">' + note + '</span></div>')
    return '<div style="display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 10px;">' + ''.join(out) + '</div>'


# ------------------------------------------------------------------ plain-class builders (real ui.css, forced states)
def btn(variant='primary', text='[Label]', style='', extra='', size='', icon='', icon_right='', icon_only=False, block=False):
    cls = 'uis-btn uis-btn--' + variant + (' uis-btn--' + size if size else '') + (' uis-btn--icon' if icon_only else '') + (' uis-btn--block' if block else '')
    inner = (svg(icon) if icon else '') + ('' if icon_only else text) + (svg(icon_right) if icon_right and not icon_only else '')
    aria = ' aria-label="' + text + '"' if icon_only else ''
    return '<button type="button" class="' + cls + '"' + (' style="' + style + '"' if style else '') + aria + extra + '>' + inner + '</button>'


HOVER_BG = {'primary': 'var(--uis-primary-hover)', 'accent': 'var(--uis-accent-hover)', 'secondary': 'var(--uis-surface-3)', 'outline': 'var(--uis-surface-2)',
            'ghost': 'var(--uis-surface-3)', 'soft': 'color-mix(in oklab, var(--uis-primary-soft), var(--uis-primary) 10%)', 'danger': 'var(--uis-danger-hover)'}


def btn_states(v):
    return [btn(v), btn(v, style='--_bg: ' + HOVER_BG[v] + ';'), btn(v, style=FOCUS), btn(v, style='--_bg: ' + HOVER_BG[v] + '; transform: var(--uis-press);'),
            btn(v, extra=' disabled=""'), btn(v, '[Saving]', icon='refresh', extra=' disabled="" aria-busy="true"')]


# Every labelled field keeps its hint slot (owner, 2026-11-09): ui.css gives .uis-hint min-height var(--uis-hint-reserve).
# Inline here too, with the same default, so the canvas shows it before its bundle copy is refreshed.
HINT_SLOT = ' style="min-height: var(--uis-hint-reserve, 18px);"'


def field(control, label='[Label]', hint='', error=''):
    return ('<div class="uis-field"><span class="uis-label">' + label + '</span>' + control +
            ('<span class="uis-hint uis-hint--error"' + HINT_SLOT + '>' + error + '</span>' if error else '<span class="uis-hint"' + HINT_SLOT + (' aria-hidden="true"' if not hint else '') + '>' + hint + '</span>') + '</div>')


def inp(value='', placeholder='[Placeholder]', style='', extra='', icon='', kind='', kbd=''):
    cls = 'uis-input' + (' uis-input--search' if kind == 'search' else '') + (' uis-input--invalid' if 'invalid' in extra else '')
    extra = extra.replace(' invalid', '')
    ctl = 'uis-control' + (' uis-control--icon' if icon else '') + (' uis-control--kbd' if kbd else '') + (' uis-control--reveal' if kind == 'password' else '')
    t = ' type="password"' if kind == 'password' else ''
    v = ' value="' + esc(value) + '"' if value else ''
    reveal = ('<button type="button" class="uis-reveal" aria-label="Show password"' + (' disabled=""' if 'disabled' in extra else '') + '>' + svg('eye') + '</button>') if kind == 'password' else ''
    return ('<div class="' + ctl + '">' + (svg(icon) if icon else '') +
            '<input class="' + cls + '"' + t + v + ' placeholder="' + placeholder + '" aria-label="' + placeholder + '"' + (' style="' + style + '"' if style else '') + extra + '>' +
            ('<span class="uis-kbd">' + kbd + '</span>' if kbd else '') + reveal + '</div>')


def sel(value='[Option]', style='', extra='', placeholder=False):
    opts = '<option value="">[Choose one]</option>' if placeholder else '<option>' + value + '</option><option>[Option B]</option>'
    cls = 'uis-select' + (' uis-input--invalid' if 'invalid' in extra else '')
    return ('<div class="uis-control"><select class="' + cls + '" aria-label="[Label]"' + (' style="' + style + '"' if style else '') + extra.replace(' invalid', '') + '>' + opts + '</select>' +
            svg('chevron-down') + '</div>')


def check(label='[Label]', checked=False, box_style='', disabled=False):
    return ('<label class="uis-check"' + (' style="opacity: 0.45;"' if disabled else '') + '><input type="checkbox"' + (' checked=""' if checked else '') + (' disabled=""' if disabled else '') + '>'
            '<span class="uis-check__box"' + (' style="' + box_style + '"' if box_style else '') + '>' + svg('check', stroke=2.5) + '</span><span>' + label + '</span></label>')


def switch(label='[Label]', on=False, track_style='', disabled=False):
    return ('<label class="uis-switch"' + (' style="opacity: 0.45;"' if disabled else '') + '><input type="checkbox" role="switch"' + (' checked=""' if on else '') + (' disabled=""' if disabled else '') + '>'
            '<span class="uis-switch__track"' + (' style="' + track_style + '"' if track_style else '') + '><span class="uis-switch__thumb"></span></span><span>' + label + '</span></label>')


def tabs(variant, labels=('[Tab A]', '[Tab B]', '[Tab C]'), sel_i=0, tab_style=None, icon=False):
    tab_style = tab_style or {}
    items = ''.join('<button type="button" role="tab" class="uis-tab" aria-selected="' + ('true' if i == sel_i else 'false') + '"' +
                    (' style="' + tab_style[i] + '"' if i in tab_style else '') + '>' + (svg(['grid', 'list', 'calendar'][i % 3], 16) if icon else '') + l + '</button>'
                    for i, l in enumerate(labels))
    return '<div role="tablist" class="uis-tabs' + ('' if variant == 'plain' else ' uis-tabs--' + variant) + '">' + items + '</div>'


def menu(items, hover=None, focus=None):
    out = ''
    for i, (label, icon, kbd) in enumerate(items):
        st = 'background: var(--uis-surface-3);' if i == hover else (FOCUS + ' outline-offset: -2px;' if i == focus else '')
        out += ('<a role="menuitem" class="uis-menu__item" href="#"' + (' style="' + st + '"' if st else '') + '>' + (svg(icon) if icon else '') + label +
                ('<span class="uis-kbd">' + kbd + '</span>' if kbd else '') + '</a>')
    return '<div role="menu" class="uis-menu">' + out + '</div>'


def skeleton(widths=(60, 85, 40)):
    return ('<div style="display: flex; flex-direction: column; gap: 8px;" aria-hidden="true">' +
            ''.join('<span style="display: block; height: 12px; width: ' + str(w) + '%; border-radius: var(--uis-r-chip); background: var(--uis-surface-3);"></span>' for w in widths) + '</div>')


def empty(icon, title, text, cta, cta_icon, variant='primary', size='sm'):
    return ('<div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; padding: 24px 12px;">'
            '<span style="display: inline-grid; place-items: center; width: 52px; height: 52px; border-radius: 50%; background: var(--uis-surface-2); color: var(--uis-ink-2);">' + svg(icon, 22) + '</span>'
            '<span class="uis-h3">' + title + '</span><span class="uis-body-s" style="color: var(--uis-ink-2); max-width: 260px;">' + text + '</span>' +
            (btn(variant, cta, icon_right=cta_icon, size=size) if cta_icon.startswith('arrow') else btn(variant, cta, icon=cta_icon, size=size)) + '</div>')


def navitem(label, icon, style='', current=False, badge=''):
    return ('<a class="uis-navitem" href="#"' + (' aria-current="page"' if current else '') + (' style="' + style + '"' if style else '') + '>' + svg(icon) +
            '<span>' + label + '</span>' + ('<span class="uis-navitem__badge">' + badge + '</span>' if badge else '') + '</a>')


def navlink(label, style='', current=False):
    return '<a class="uis-navlink" href="#"' + (' aria-current="page"' if current else '') + (' style="' + style + '"' if style else '') + '>' + label + '</a>'


def chip(label, style=''):
    return '<a class="uis-chip" href="#"' + (' style="' + style + '"' if style else '') + '>' + label + '</a>'


def card(inner, variant='', style='', extra_cls=''):
    return '<div class="uis-card' + (' uis-card--' + variant if variant else '') + extra_cls + '"' + (' style="' + style + '"' if style else '') + '>' + inner + '</div>'


def tbl(rows, head=('[Name]', '[Status]', '[Amount]'), row_style=None):
    row_style = row_style or {}
    th = ''.join('<th' + (' style="text-align: right;"' if i == 2 else '') + '>' + h + '</th>' for i, h in enumerate(head))
    tr = ''.join('<tr>' + ''.join('<td style="' + ('text-align: right; ' if i == 2 else '') + row_style.get(r_i, '') + '">' + c + '</td>' for i, c in enumerate(r)) + '</tr>' for r_i, r in enumerate(rows))
    return '<div class="uis-table-wrap"><table class="uis-table"><thead><tr>' + th + '</tr></thead><tbody>' + tr + '</tbody></table></div>'


B = lambda tone, text, more='': X('Badge', 'tone="' + tone + '"' + (' ' + more if more else ''), text)
ROWS3 = [['<strong>[Name A]</strong>', B('success', 'Paid', 'dot="{{yes}}"'), '[AMOUNT]'], ['<strong>[Name B]</strong>', B('warning', 'Pending', 'dot="{{yes}}"'), '[AMOUNT]'],
         ['<strong>[Name C]</strong>', B('danger', 'Overdue', 'dot="{{yes}}"'), '[AMOUNT]']]

# ------------------------------------------------------------------ the families
# Each: id, title, page (canvas page name), what (one line), cov (coverage), states (html), specimen (html for the theme cells), spec_h (min cell height)
F = []


def fam(**k):
    F.append(k)


# Button --------------------------------------------------------------
VARS = ['primary', 'accent', 'secondary', 'outline', 'ghost', 'soft', 'danger']
fam(id='Button', title='Button', page='Button', what='Button and IconButton. One primary per view; pick by emphasis, not colour.',
    cov={'default': ('shown', 'All 7 variants'), 'hover': ('shown', 'Hover fill per variant'), 'focus': ('shown', '2px focus ring'), 'active': ('shown', 'Pressed: --uis-press'),
         'selected': ('na', 'Toggles use Tabs (segmented)'), 'disabled': ('shown', '45% opacity, no pointer'), 'loading': ('gap', 'Drawn as disabled + icon; no loading prop yet'),
         'error': ('na', 'Errors live in Alert or field hints'), 'empty': ('na', 'A button always has a label')},
    states=section('States', 'Every variant in every state. Hover and pressed are forced with the same variables ui.css uses.',
                   matrix(['default', 'hover', 'focus', 'pressed', 'disabled', 'loading'], [(v, btn_states(v)) for v in VARS])) +
    section('Sizes and icons', 'Heights come from --uis-h-sm/md/lg. Icon left for verbs, right for direction, icon-only always has a label.',
            matrix(['text', 'icon left', 'icon right', 'icon only'], [(z, [btn('primary', size=s), btn('primary', size=s, icon='plus'), btn('primary', size=s, icon_right='arrow-right'), btn('primary', '[Add]', size=s, icon='plus', icon_only=True)]) for z, s in [('sm', 'sm'), ('md', ''), ('lg', 'lg')]]) +
            cell('block · phones and forms', '<div style="max-width: 420px;">' + btn('primary', block=True, size='lg') + '</div>') +
            cell('over photos · light, glass', '<div data-tone="image" style="display: flex; gap: 12px; padding: 24px; border-radius: var(--uis-r-card); background: var(--uis-neutral-900);">' + btn('light') + btn('glass') + '</div>')) +
    section('IconButton', 'Square, labelled for screen readers. Count and dot for unread.',
            row(cell('default', X('IconButton', 'icon="bell" label="Notifications"')), cell('hover', '<button type="button" class="uis-iconbtn" aria-label="Notifications" style="background: var(--uis-surface-3);">' + svg('bell') + '</button>'),
                cell('focus', '<button type="button" class="uis-iconbtn" aria-label="Notifications" style="' + FOCUS + '">' + svg('bell') + '</button>'),
                cell('count', X('IconButton', 'icon="bag" label="Bag" count="{{n2}}"')), cell('dot', X('IconButton', 'icon="bell" label="Notifications" dot="{{yes}}"')), gap=28)),
    specimen=col(row(*btn_states('primary')[:3], btn('primary', extra=' disabled=""'), gap=8), row(btn('outline'), btn('ghost'), btn('danger', icon='trash'), btn('accent'), gap=8),
                 row(btn('primary', size='sm'), btn('primary'), btn('primary', size='lg'), btn('outline', '[More]', icon='more', icon_only=True), gap=8), gap=12), spec_h=150)

# Input / Field --------------------------------------------------------------
def inrow(kind='', icon='', kbd='', ta=False):
    if ta:
        T = lambda st='', ex='', v='': '<textarea class="uis-textarea" aria-label="[Label]" placeholder="[Placeholder]" rows="3"' + (' style="' + st + '"' if st else '') + ex + '>' + v + '</textarea>'
        return [field(T()), field(T(v='[Value]')), field(T('border-color: var(--uis-ink-3);', v='[Value]')), field(T(FIELD_FOCUS, v='[Value]')), field(T(ex=' disabled=""', v='[Value]')),
                field(T(ex=' aria-invalid="true"', v='[Value]').replace('class="uis-textarea"', 'class="uis-textarea uis-input--invalid"'), error='[Error message]')]
    hov = 'border-color: var(--uis-search-border-hover);' if kind == 'search' else 'border-color: var(--uis-ink-3);'
    f = lambda **a: field(inp(icon=icon, kind=kind, kbd=kbd, **a), **({} if 'err' not in a else {}))
    return [field(inp(icon=icon, kind=kind, kbd=kbd)), field(inp('[Value]', icon=icon, kind=kind, kbd=kbd)), field(inp('[Value]', style=hov, icon=icon, kind=kind, kbd=kbd)),
            field(inp('[Value]', style=FIELD_FOCUS, icon=icon, kind=kind, kbd=kbd)), field(inp('[Value]', extra=' disabled=""', icon=icon, kind=kind, kbd=kbd)),
            field(inp('[Value]', extra=' invalid aria-invalid="true"', icon=icon, kind=kind, kbd=kbd), error='[Error message]')]

fam(id='Input', title='Input and field', page='Input · Field', what='Input, Textarea and Field: label, control, hint or error. Password always has the eye on the right.',
    cov={'default': ('shown', 'Empty with placeholder'), 'hover': ('shown', 'Edge darkens'), 'focus': ('shown', 'Focus edge + ring'), 'active': ('na', 'Typing is focus'),
         'selected': ('na', 'Not a choice control'), 'disabled': ('shown', 'Native disabled'), 'loading': ('gap', 'No inline spinner for async checks yet'),
         'error': ('shown', 'Red edge + message (Textarea: class only, no error prop yet)'), 'empty': ('shown', 'Placeholder only')},
    states=section('States', 'Each field type in every state. Hint below; an error replaces the hint.',
                   matrix(['empty', 'filled', 'hover', 'focus', 'disabled', 'error'], [('text', inrow()), ('leading icon', inrow(icon='mail')), ('search', inrow('search', 'search', '⌘K')),
                                                                                     ('password', inrow('password')), ('textarea', inrow(ta=True))], first=110)) +
    section('Sizes and icons', 'Two heights. Icon leads; keyboard hint and the password eye trail.',
            matrix(['sm', 'md'], [('plain', [field(inp(extra=' ').replace('class="uis-input"', 'class="uis-input uis-input--sm"')), field(inp())]),
                                  ('icon left', [field(inp(icon='search').replace('class="uis-input"', 'class="uis-input uis-input--sm"')), field(inp(icon='search'))]),
                                  ('trailing kbd', [field(inp(kbd='⌘K').replace('class="uis-input"', 'class="uis-input uis-input--sm"')), field(inp(kbd='⌘K'))]),
                                  ('trailing eye', [field(inp(kind='password').replace('class="uis-input"', 'class="uis-input uis-input--sm"')), field(inp(kind='password'))])]) +
            cell('React component · hint', '<div style="max-width: 420px;">' + X('Input', 'label="[Label]" placeholder="[Placeholder]" hint="[Hint text]"') + '</div>')),
    specimen=col(row('<div style="flex: 1; min-width: 0;">' + field(inp(), hint='[Hint]') + '</div>', '<div style="flex: 1; min-width: 0;">' + field(inp('[Value]', style=FIELD_FOCUS)) + '</div>', gap=12, wrap=False),
                 row('<div style="flex: 1; min-width: 0;">' + field(inp('[Value]', extra=' invalid'), error='[Error]') + '</div>', '<div style="flex: 1; min-width: 0;">' + field(inp('[Value]', extra=' disabled=""')) + '</div>', gap=12, wrap=False),
                 field(inp(icon='search', kind='search', kbd='⌘K'), label='[Search]'), gap=12), spec_h=260)

# Select --------------------------------------------------------------
fam(id='Select', title='Select', page='Select', what='Native select inside the field frame: keyboard and screen readers work for free.',
    cov={'default': ('shown', 'Value shown'), 'hover': ('shown', 'Edge darkens'), 'focus': ('shown', 'Focus edge + ring'), 'active': ('shown', 'Open list (native; custom list = Menu)'),
         'selected': ('shown', 'Chosen value'), 'disabled': ('shown', 'Native disabled'), 'loading': ('gap', 'No loading option list yet'),
         'error': ('gap', 'No error prop on Select; drawn with field classes'), 'empty': ('shown', 'Placeholder option')},
    states=section('States', 'The closed control in every state; open shows the list a custom select would use (Menu).',
                   matrix(['empty', 'selected', 'hover', 'focus', 'disabled', 'error'],
                          [('select', [field(sel(placeholder=True)), field(sel()), field(sel(style='border-color: var(--uis-ink-3);')), field(sel(style=FIELD_FOCUS)), field(sel(extra=' disabled=""')),
                                       field(sel(extra=' invalid aria-invalid="true"'), error='[Error message]')])], first=80)) +
    section('Open', 'Native lists draw with the OS. Where a styled list is needed, the field opens a Menu in a float panel.',
            '<div style="max-width: 360px; display: flex; flex-direction: column; gap: 8px;">' + field(sel(style=FIELD_FOCUS)) +
            '<div class="uis-float uis-popover">' + menu([('[Option A]', 'check', ''), ('[Option B]', '', ''), ('[Option C]', '', '')], hover=1) + '</div></div>') +
    section('Sizes', 'One height (md). A small select is a gap.', '<div style="max-width: 360px;">' + X('Select', 'label="[Label]" options="{{opts}}" hint="[Hint text]"') + '</div>'),
    specimen=row('<div style="flex: 1; min-width: 0;">' + field(sel(placeholder=True)) + '</div>', '<div style="flex: 1; min-width: 0;">' + field(sel(style=FIELD_FOCUS)) + '</div>',
                 '<div style="flex: 1; min-width: 0;">' + field(sel(extra=' disabled=""')) + '</div>', gap=12, wrap=False), spec_h=90)

# Checkbox / Switch --------------------------------------------------------------
fam(id='Choice', title='Checkbox and switch', page='Checkbox · Switch', what='Checkbox for choices that apply on submit, switch for settings that apply at once.',
    cov={'default': ('shown', 'Off'), 'hover': ('na', 'No hover style in ui.css'), 'focus': ('shown', 'Ring on the box or track'), 'active': ('na', 'Click toggles'),
         'selected': ('shown', 'Checked / on'), 'disabled': ('gap', 'No disabled prop or style yet'), 'loading': ('na', 'Settings save after'),
         'error': ('gap', 'No error state for a required checkbox yet'), 'empty': ('na', 'Always on or off')},
    states=section('States', 'Radio is a gap: UI System has no Radio yet (use Select or Tabs for one-of-many).',
                   matrix(['off', 'on', 'focus off', 'focus on'],
                          [('checkbox', [check(), check(checked=True), check(box_style=FOCUS), check(checked=True, box_style=FOCUS)]),
                           ('switch', [switch(), switch(on=True), switch(track_style=FOCUS), switch(on=True, track_style=FOCUS)])], first=100)) +
    section('In a form', 'Labels sit on the right, sentence case, the whole row is the hit area.',
            row(col(X('Checkbox', 'label="[Choice A]" default-checked="{{yes}}"'), X('Checkbox', 'label="[Choice B]"'), X('Checkbox', 'label="[Choice C]"')),
                col(X('Switch', 'label="[Setting A]" default-checked="{{yes}}"'), X('Switch', 'label="[Setting B]"')), gap=64, align='flex-start')),
    specimen=row(col(check(), check(checked=True), check(checked=True, box_style=FOCUS), gap=10), col(switch(), switch(on=True), switch(on=True, track_style=FOCUS), gap=10), gap=48, align='flex-start'), spec_h=110)

# Badge / Chips --------------------------------------------------------------
TONES = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info']
fam(id='Badge', title='Badge and chips', page='Badge · Chips', what='Badges label status (dot or word, never colour alone); chips filter or link.',
    cov={'default': ('shown', 'Soft, dot, solid, outline'), 'hover': ('shown', 'Chips only'), 'focus': ('shown', 'Chips only'), 'active': ('na', 'Chips navigate'),
         'selected': ('gap', 'No selected chip state yet (use Tabs pill)'), 'disabled': ('gap', 'No disabled chip yet'), 'loading': ('na', 'Static label'),
         'error': ('shown', 'Danger tone'), 'empty': ('na', 'A badge always has a word')},
    states=section('Tones and styles', 'Seven tones, four styles. Soft for lists, solid for one loud label, outline for quiet meta.',
                   matrix(['soft', 'dot', 'solid', 'outline'], [(t, [B(t, '[Label]'), B(t, '[Label]', 'dot="{{yes}}"'), B(t, '[Label]', 'solid="{{yes}}"'), B(t, '[Label]', 'outline="{{yes}}"')]) for t in TONES], first=110)) +
    section('Chips', 'States drawn with ui.css hover and focus rules.',
            matrix(['default', 'hover', 'focus'], [('chip', [chip('[Filter]'), chip('[Filter]', 'background: var(--uis-line);'), chip('[Filter]', FOCUS)])], first=80) +
            cell('group', X('Chips', 'items="{{chips}}"'))),
    specimen=col(row(*[B(t, t.capitalize(), 'dot="{{yes}}"') for t in TONES], gap=6), row(*[B(t, t.capitalize(), 'solid="{{yes}}"') for t in TONES[1:5]], *[B(t, t.capitalize(), 'outline="{{yes}}"') for t in TONES[4:]], gap=6),
                 row(chip('[Filter]'), chip('[Filter]', 'background: var(--uis-line);'), chip('[Filter]'), gap=6), gap=12), spec_h=120)

# Card / Media --------------------------------------------------------------
CARD_IN = '<strong class="uis-h3">[Title]</strong><p class="uis-body-s" style="margin: 8px 0 0; color: var(--uis-ink-2);">[One line of detail]</p>'
fam(id='Card', title='Card and media', page='Card · Media', what='Cards group one record; media holds photos (drop an image on any grey slot).',
    cov={'default': ('shown', 'Default, flat, raised, sunken'), 'hover': ('shown', 'Interactive: lift + edge'), 'focus': ('shown', 'Focus ring'), 'active': ('gap', 'No pressed style on interactive cards yet'),
         'selected': ('gap', 'No selected card style yet'), 'disabled': ('na', 'Cards are not disabled'), 'loading': ('shown', 'Skeleton lines (pattern)'),
         'error': ('shown', 'Danger alert inside'), 'empty': ('shown', 'Empty state inside')},
    states=section('Variants', 'Flat on tinted pages, raised for one focal card, sunken for wells.',
                   row(*[cell(v or 'default', card(CARD_IN, v)) for v in ['', 'flat', 'raised', 'sunken']], gap=16)) +
    section('States', 'Interactive cards (a link) lift on hover. Loading, error and empty sit inside the same frame.',
            '<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px;">' +
            cell('interactive · default', card(CARD_IN, 'interactive')) + cell('hover', card(CARD_IN, 'interactive', 'box-shadow: var(--uis-shadow-md); border-color: var(--uis-line-strong);')) +
            cell('focus', card(CARD_IN, 'interactive', FOCUS)) + cell('loading', card(skeleton())) +
            cell('error', card(X('Alert', 'tone="danger" title="[Could not load]"', '[Short reason]'))) + cell('empty', card(empty('inbox', '[Nothing yet]', '[What will show here]', '[Action]', 'plus'))) +
            cell('media', X('Card', 'flush="{{yes}}"', '<image-slot id="cm-photo" shape="rect" placeholder="Photo" style="display: block; width: 100%; aspect-ratio: 16 / 9; background: var(--uis-surface-3);"></image-slot><div style="padding: var(--uis-pad-card);">' + CARD_IN + '</div>')) +
            '</div>'),
    specimen=row(card(CARD_IN, '', 'flex: 1;'), card(CARD_IN, 'interactive', 'flex: 1; box-shadow: var(--uis-shadow-md); border-color: var(--uis-line-strong);'), card(skeleton(), '', 'flex: 1;'), gap=12, align='stretch', wrap=False), spec_h=120)

# Table / Stat --------------------------------------------------------------
fam(id='Table', title='Table and stat', page='Table · Stat', what='Tables for records, stats for the one number that matters. Money right-aligned, tabular numbers.',
    cov={'default': ('shown', 'Header + rows'), 'hover': ('shown', 'Row tint'), 'focus': ('gap', 'No row focus style yet'), 'active': ('na', 'Rows link out'),
         'selected': ('gap', 'No selected row / bulk select yet'), 'disabled': ('na', 'Rows are not disabled'), 'loading': ('shown', 'Skeleton rows (pattern)'),
         'error': ('shown', 'Alert row (pattern)'), 'empty': ('shown', 'Empty row (pattern)')},
    states=section('States', 'Hover is forced on the second row. Loading, error and empty keep the header so the page does not jump.',
                   '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px;">' +
                   cell('default · hover on row 2', tbl(ROWS3, row_style={1: 'background: var(--uis-surface-2);'})) +
                   cell('loading', tbl([[skeleton((70,)), skeleton((50,)), skeleton((60,))]] * 3)) +
                   cell('empty', tbl([['<span style="display: block; text-align: center; color: var(--uis-ink-2); padding: 16px 0;">[No records yet] · <a href="#" style="color: var(--uis-primary-text);">[Create one]</a></span>', '', '']]).replace('<td style="">', '<td colspan="3" style="">', 1).replace('<td style=""></td><td style="text-align: right; "></td>', '')) +
                   cell('error', tbl([[X('Alert', 'tone="danger" title="[Could not load]"', '[Short reason] · [Try again]'), '', '']]).replace('<td style="">', '<td colspan="3" style="">', 1).replace('<td style=""></td><td style="text-align: right; "></td>', '')) + '</div>') +
    section('Stat', 'Label, value, delta. Down is not automatically bad: say what the number means.',
            '<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px;">' +
            ''.join(card(X('Stat', a)) for a in ['label="[Metric]" value="[N]" delta="+[N]%" icon="chart"', 'label="[Metric]" value="[AMOUNT]" delta="-[N]%" trend="down"', 'label="[Metric]" value="[N]"', 'label="[Metric]" value="[N]" icon="users"']) + '</div>'),
    specimen=col(tbl(ROWS3[:2], row_style={1: 'background: var(--uis-surface-2);'}), row(card(X('Stat', 'label="[Metric]" value="[N]" delta="+[N]%"'), '', 'flex: 1;'), card(X('Stat', 'label="[Metric]" value="[N]" delta="-[N]%" trend="down"'), '', 'flex: 1;'), gap=12, wrap=False), gap=12), spec_h=250)

# Tabs --------------------------------------------------------------
TV = ['segmented', 'pill', 'underline', 'plain']
fam(id='Tabs', title='Tabs', page='Tabs', what='Segmented for views of one thing, pill for filters, underline for page sections.',
    cov={'default': ('shown', 'Four variants'), 'hover': ('shown', 'Ink + tint'), 'focus': ('shown', 'Focus ring'), 'active': ('na', 'Click selects'),
         'selected': ('shown', 'aria-selected'), 'disabled': ('gap', 'No disabled tab yet'), 'loading': ('na', 'Content loads, not tabs'),
         'error': ('na', 'Not an input'), 'empty': ('na', 'Always one tab')},
    states=section('States', 'Tab A is selected; B shows hover, C shows focus.',
                   matrix(['selected · hover · focus', 'with icons'], [(v, [tabs(v, tab_style={1: 'color: var(--uis-ink); background: ' + ('transparent' if v == 'segmented' else 'var(--uis-surface-3)') + ';', 2: FOCUS + ' outline-offset: -2px;'}), tabs(v, icon=True)]) for v in TV], first=110)) +
    section('Live', 'React component, click to switch.', row(X('Tabs', 'items="{{ranges}}"'), X('Tabs', 'items="{{filters}}" variant="pill"'), X('Tabs', 'items="{{pageTabs}}" variant="underline"'), gap=24)),
    specimen=col(tabs('segmented', tab_style={2: FOCUS + ' outline-offset: -2px;'}), tabs('pill'), tabs('underline', tab_style={1: 'color: var(--uis-ink); background: var(--uis-surface-3);'}), gap=12), spec_h=140)

# Menu / Popover / Tooltip / Kbd --------------------------------------------------------------
MENU = [('[Profile]', 'user', ''), ('[Billing]', 'card', ''), ('[Settings]', 'settings', '⌘,'), ('[Sign out]', 'logout', '')]
fam(id='Menu', title='Menu, popover, tooltip', page='Menu · Popover', what='Floating panels: menus for actions, popovers for small content, tooltips for names of icon buttons.',
    cov={'default': ('shown', 'Item at rest'), 'hover': ('shown', 'Tint'), 'focus': ('shown', 'Inset ring'), 'active': ('na', 'Click runs'),
         'selected': ('gap', 'No checked menu item yet'), 'disabled': ('gap', 'No disabled item yet'), 'loading': ('na', 'Menus are static'),
         'error': ('na', 'Destructive items say what they do'), 'empty': ('shown', 'Empty popover (pattern)')},
    states=section('Menu', 'Item 2 hover, item 3 focus. Shortcuts trail in Kbd.',
                   row(cell('in a popover', '<div style="width: 280px;" class="uis-float uis-popover"><p class="uis-popover__title">[Account]</p>' + menu(MENU, hover=1, focus=2) + '</div>'),
                       cell('empty popover', '<div style="width: 280px;" class="uis-float uis-popover"><p class="uis-popover__title">[Recent]</p><p class="uis-body-s" style="margin: 0; padding: 8px 10px; color: var(--uis-ink-2);">[Nothing here yet]</p></div>'),
                       cell('chips in a popover', X('Popover', 'title="[Explore]" style="width: 280px;"', X('Chips', 'items="{{chips}}"'))), gap=24, align='flex-start')) +
    section('Tooltip and Kbd', 'Tooltips name an icon; never put actions in them.',
            row(cell('tooltip', X('Tooltip', '', '[Tooltip]')), cell('kbd', row(X('Kbd', '', '⌘K'), X('Kbd', '', 'Esc'), X('Kbd', '', '↵'), gap=6)), gap=48)),
    specimen=row('<div style="width: 250px;" class="uis-float uis-popover">' + menu(MENU[:3], hover=1, focus=2) + '</div>', col(X('Tooltip', '', '[Tooltip]'), row(X('Kbd', '', '⌘K'), X('Kbd', '', 'Esc'), gap=6), gap=14), gap=24, align='flex-start'), spec_h=170)

# Dialog / Drawer --------------------------------------------------------------
def stage(inner, h=360):
    return '<div style="position: relative; height: ' + str(h) + 'px; overflow: hidden; border-radius: var(--uis-r-card); border: 1px solid var(--uis-line); background: var(--uis-surface-2);">' + inner + '</div>'

DLG_ACT = lambda danger=False, loading=False: '<div class="uis-dialog__actions">' + btn('outline', '[Cancel]') + (btn('danger' if danger else 'primary', '[Working]', icon='refresh', extra=' disabled="" aria-busy="true"') if loading else btn('danger' if danger else 'primary', '[Confirm]')) + '</div>'
DLG = lambda title, body, act: '<div class="uis-scrim" style="animation: none;"></div><div role="dialog" aria-label="' + title + '" class="uis-dialog" style="animation: none;"><h2 class="uis-h3">' + title + '</h2><p class="uis-body-s uis-muted">' + body + '</p>' + act + '</div>'
def DRW(title, body, side='right', floating=False, scrim=True, foot=''):
    # Plain markup with animation off: a static board shows the open state, not the first animation frame.
    cls = 'uis-drawer' + (' uis-drawer--left' if side == 'left' else '') + (' uis-drawer--floating' if floating else '')
    return (('<div class="uis-scrim" style="animation: none;"></div>' if scrim else '') + '<aside role="dialog" aria-label="' + title + '" class="' + cls + '" style="animation: none;">'
            '<div class="uis-drawer__head"><h2 class="uis-drawer__title">' + title + '</h2><button type="button" class="uis-iconbtn" aria-label="Close">' + svg('x') + '</button></div>'
            '<div class="uis-drawer__body">' + body + '</div>' + ('<div class="uis-drawer__foot">' + foot + '</div>' if foot else '') + '</aside>')


fam(id='Overlay', title='Dialog and drawer', page='Dialog · Drawer', what='Dialogs confirm one decision; drawers hold a task beside the page. Both sit on a scrim.',
    cov={'default': ('shown', 'Open on scrim'), 'hover': ('na', 'Buttons inside carry it'), 'focus': ('shown', 'Focus on first action'), 'active': ('na', 'Buttons inside'),
         'selected': ('na', 'Not a choice'), 'disabled': ('shown', 'Confirm disabled until valid'), 'loading': ('gap', 'Drawn with disabled button + icon; no loading prop'),
         'error': ('shown', 'Alert inside'), 'empty': ('shown', 'Empty drawer body')},
    states=section('Dialog', 'Confirm, destructive, invalid and working. The scrim is --uis-scrim.',
                   '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">' +
                   cell('confirm · focus on action', stage(DLG('[Title]', '[One sentence on what happens.]', DLG_ACT()).replace('class="uis-btn uis-btn--primary"', 'class="uis-btn uis-btn--primary" style="' + FOCUS + '"'), 300)) +
                   cell('destructive', stage(DLG('[Delete record?]', '[This cannot be undone.]', DLG_ACT(True)), 300)) +
                   cell('error inside', stage(DLG('[Title]', '[One sentence.]', X('Alert', 'tone="danger" title="[Could not save]"', '[Short reason]') + DLG_ACT()), 300)) +
                   cell('working', stage(DLG('[Title]', '[One sentence.]', DLG_ACT(loading=True)), 300)) + '</div>') +
    section('Drawer', 'Right by default, left for navigation, floating on wide screens.',
            '<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px;">' +
            cell('right', stage(DRW('[Title]', '<p class="uis-body-s" style="color: var(--uis-ink-2);">[Body]</p>', foot=btn('outline', '[Cancel]') + btn('primary', '[Save]')), 460)) +
            cell('left', stage(DRW('[Title]', '<p class="uis-body-s" style="color: var(--uis-ink-2);">[Body]</p>', side='left'), 460)) +
            cell('floating · empty', stage(DRW('[Your bag]', empty('bag', '[Your bag is empty]', '[Add items to see them here]', '[Browse]', 'arrow-right'), floating=True, scrim=False), 460)) + '</div>'),
    specimen=stage(DLG('[Title]', '[One sentence on what happens.]', DLG_ACT()), 250), spec_h=250)

# Feedback --------------------------------------------------------------
fam(id='Feedback', title='Alert, toast, progress', page='Alert · Toast', what='Alerts sit in the page, toasts confirm and leave, progress shows long work.',
    cov={'default': ('shown', 'Info'), 'hover': ('na', 'Static'), 'focus': ('na', 'Actions inside carry it'), 'active': ('na', 'Static'),
         'selected': ('na', 'Static'), 'disabled': ('na', 'Static'), 'loading': ('shown', 'Progress + skeleton'), 'error': ('shown', 'Danger alert'), 'empty': ('shown', 'Progress at 0')},
    states=section('Alert', 'Four tones, each with its own icon so colour is never alone.',
                   '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;">' +
                   ''.join(X('Alert', ('tone="' + t + '" ' if t != 'info' else '') + 'title="[Title]"', '[One line of detail.]') for t in ['info', 'success', 'warning', 'danger']) +
                   ''.join(X('Alert', ('tone="' + t + '"' if t != 'info' else ''), '[No title, one line.]') for t in ['info', 'danger']) + '</div>') +
    section('Toast and progress', 'Toasts are inverse panels; one action at most.',
            '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">' +
            cell('toast', X('Toast', 'title="[Saved]"', '[Your changes are live.]')) + cell('toast · own icon', X('Toast', 'title="[Deleted]" icon="trash"', '[One record removed.]')) +
            cell('progress · 0', X('Progress', 'value="{{p0}}"')) + cell('progress · 40', X('Progress', 'value="{{p40}}"')) + cell('progress · 100', X('Progress', 'value="{{p100}}"')) + cell('skeleton', skeleton()) + '</div>'),
    specimen=col(X('Alert', 'tone="success" title="[Title]"', '[One line.]'), X('Alert', 'tone="danger" title="[Title]"', '[One line.]'), X('Toast', 'title="[Saved]"', '[Changes are live.]'), X('Progress', 'value="{{p40}}"'), gap=10), spec_h=290)

# Avatar --------------------------------------------------------------
fam(id='Avatar', title='Avatar', page='Avatar', what='DiceBear art for people without a photo (CC0); never stock or invented photos.',
    cov={'default': ('shown', 'Art from the name'), 'hover': ('na', 'Static'), 'focus': ('na', 'Wrap in a link'), 'active': ('na', 'Static'),
         'selected': ('na', 'Static'), 'disabled': ('na', 'Static'), 'loading': ('na', 'Art is generated'), 'error': ('na', 'Falls back to initials'), 'empty': ('shown', 'No name: initials style')},
    states=section('Sizes', 'sm 28, md 36, lg 48, xl 72.', row(*[cell(z, X('Avatar', 'name="[Person A]" size="' + z + '"')) for z in ['sm', 'md', 'lg', 'xl']], gap=32, align='flex-end')) +
    section('Styles', 'Set once per project (config.avatars).', row(*[cell(s, X('Avatar', 'name="[Person B]" avatar-style="' + s + '" size="lg"')) for s in ['notionists-neutral', 'lorelei-neutral', 'thumbs', 'glass', 'shapes', 'initials']], gap=28)) +
    section('Group', 'Overlapping stack for teams and attendees.', X('AvatarGroup', 'people="{{people}}"')),
    specimen=row(X('Avatar', 'name="[Person A]" size="sm"'), X('Avatar', 'name="[Person A]"'), X('Avatar', 'name="[Person A]" size="lg"'), X('Avatar', 'name="[Person B]" avatar-style="initials" size="lg"'), X('AvatarGroup', 'people="{{people}}"'), gap=14), spec_h=60)

# Empty state --------------------------------------------------------------
fam(id='Empty', title='Empty state', page='Empty state', what='What a screen says when there is nothing, nothing found, or it could not load. A pattern built from Icon, text and Button.',
    cov={'default': ('shown', 'First run'), 'hover': ('na', 'Button carries it'), 'focus': ('na', 'Button carries it'), 'active': ('na', 'Button carries it'),
         'selected': ('na', 'Static'), 'disabled': ('na', 'Static'), 'loading': ('shown', 'Skeleton before empty'), 'error': ('shown', 'Could not load'), 'empty': ('shown', 'No results')},
    states=section('Kinds', 'One sentence on why it is empty, one action that fixes it.',
                   '<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px;">' +
                   card(empty('inbox', '[No records yet]', '[Your first record shows up here.]', '[Create]', 'plus')) +
                   card(empty('search', '[No results]', '[Nothing matches. Try fewer words.]', '[Clear filters]', 'x', 'outline')) +
                   card(empty('alert-circle', '[Could not load]', '[The connection dropped. Your work is saved.]', '[Try again]', 'refresh', 'outline')) +
                   card(col('<span class="uis-overline">[Loading]</span>', skeleton(), skeleton((80, 50)), gap=16)) + '</div>'),
    specimen=row(card(empty('inbox', '[No records]', '[First one shows here.]', '[Create]', 'plus'), '', 'flex: 1;'), card(empty('alert-circle', '[Could not load]', '[Try again.]', '[Retry]', 'refresh', 'outline'), '', 'flex: 1;'), gap=12, wrap=False), spec_h=250)

# Nav · front --------------------------------------------------------------
fam(id='NavFront', title='Website navigation parts', page='Nav · Website', what='Links, current page, icon actions and the call to action. Whole bars live on the Navigation page.',
    cov={'default': ('shown', 'Link at rest'), 'hover': ('shown', 'Tint'), 'focus': ('shown', 'Focus ring'), 'active': ('na', 'Navigates'),
         'selected': ('shown', 'Current page'), 'disabled': ('na', 'Hide links instead'), 'loading': ('na', 'Static'), 'error': ('na', 'Static'), 'empty': ('na', 'Always links')},
    states=section('Link states', 'Current page uses aria-current, not colour alone.',
                   matrix(['default', 'hover', 'focus', 'current'], [('navlink', [navlink('[Link]'), navlink('[Link]', 'color: var(--uis-ink); background: var(--uis-surface-3);'), navlink('[Link]', FOCUS), navlink('[Link]', current=True)])], first=90)) +
    section('Bar', 'NavBar with links, icon actions and one call to action.', '<div style="border: 1px solid var(--uis-line); border-radius: 16px; overflow: hidden;">' + X('NavBar', 'links="{{navLinks}}" actions="{{navActions}}" cta="{{navCta}}"') + '</div>'),
    specimen=col(row(navlink('[Link]', current=True), navlink('[Link]', 'color: var(--uis-ink); background: var(--uis-surface-3);'), navlink('[Link]', FOCUS), navlink('[Link]'), gap=4),
                 row(X('IconButton', 'icon="search" label="Search"'), X('IconButton', 'icon="bag" label="Bag" count="{{n2}}"'), btn('primary', '[Call to action]', size='sm'), gap=8), gap=14), spec_h=100)

# Nav · back --------------------------------------------------------------
fam(id='NavBack', title='App navigation parts', page='Nav · App', what='Sidebar items, badges, current page and the page header. Whole shells live on the Navigation page.',
    cov={'default': ('shown', 'Item at rest'), 'hover': ('shown', 'Tint'), 'focus': ('shown', 'Focus ring'), 'active': ('na', 'Navigates'),
         'selected': ('shown', 'Current page + start bar'), 'disabled': ('gap', 'No disabled item yet (hide instead)'), 'loading': ('na', 'Static'), 'error': ('na', 'Static'), 'empty': ('na', 'Always items')},
    states=section('Item states', 'Current page: nav-active-bg, nav-active-ink and the 2px start bar.',
                   '<div style="max-width: 300px; display: flex; flex-direction: column; gap: 4px; padding: 12px; border-radius: var(--uis-r-card); background: var(--uis-nav-bg); border: 1px solid var(--uis-line);">' +
                   navitem('[Current]', 'grid', current=True, badge='3') + navitem('[Hover]', 'receipt', 'background: var(--uis-surface-3); color: var(--uis-ink);') + navitem('[Focus]', 'users', FOCUS + ' outline-offset: -2px;') +
                   navitem('[Default]', 'settings') + navitem('[With badge]', 'inbox', badge='12') + '</div>') +
    section('Sidebar and header', 'AppSidebar with a section list and the account, PageHeader with crumbs and one action.',
            '<div style="display: flex; height: 520px; border: 1px solid var(--uis-line); border-radius: 16px; overflow: hidden;">' + X('AppSidebar', 'sections="{{navSections}}" user="{{navUser}}"') +
            '<div style="flex: 1; min-width: 0; padding: 24px; background: var(--uis-bg);">' + X('PageHeader', 'title="[Page title]" description="[One line on what this page is for.]" crumbs="{{crumbs}}"', X('Button', 'icon="plus"', '[Create]')) + '</div></div>'),
    specimen='<div style="display: flex; flex-direction: column; gap: 4px; padding: 10px; border-radius: var(--uis-r-card); background: var(--uis-nav-bg); border: 1px solid var(--uis-line);">' +
    navitem('[Current]', 'grid', current=True, badge='3') + navitem('[Hover]', 'receipt', 'background: var(--uis-surface-3); color: var(--uis-ink);') + navitem('[Focus]', 'users', FOCUS + ' outline-offset: -2px;') + navitem('[Default]', 'settings') + '</div>', spec_h=180)


# ------------------------------------------------------------------ preset and product rows for the theme boards
ROWS = [dict(key='Default', tag='no preset · engine defaults', config={}, vars={}),
        dict(key='ledger', tag='preset · round and clean', config={'preset': 'ledger'}, vars={}),
        dict(key='atelier', tag='preset · sharp and editorial', config={'preset': 'atelier'}, vars={})]
SKIN_FROM_PRESET = {}
for ps in PRESET_SHEETS:
    for v in ps['variants']:
        if v['key'] != 'Base':
            SKIN_FROM_PRESET[v['key']] = v
FONTS = {'family=Archivo:wdth,wght@75..125,700..900', 'family=Inter:wght@400..800', 'family=Poppins:wght@400;500;600;700', 'family=Lato:wght@400;700', 'family=Figtree:wght@400..800',
         'family=Geist:wght@400..700', 'family=Geist+Mono:wght@400..600', 'family=JetBrains+Mono:wght@400..600', 'family=Inter+Tight:wght@400..700', 'family=Manrope:wght@400..800',
         'family=Fraunces:ital,wght@0,400..700;1,400..700', 'family=Space+Grotesk:wght@400..700', 'family=Instrument+Serif:ital@0;1', 'family=Instrument+Sans:wght@400..700'}
SKIN_ORDER = ['Senorita', 'ALMAR', 'Invios', 'Clickit', 'Vamos', 'Koussay', 'Sahti', 'Obox']
BY_ID = {p['id']: p for p in PRODUCTS}
for name in SKIN_ORDER:
    if name in SKIN_FROM_PRESET:  # products that sit on an engine preset
        v = SKIN_FROM_PRESET[name]
        base = 'atelier' if v['config'].get('preset') == 'atelier' else 'ledger'
        tag = 'skin on ' + base + (' · product ships dark only' if name == 'Clickit' else '')
    else:
        p = BY_ID[name]
        v = next(x for x in p['variants'] if x['key'] == p['default'])
        tag = 'skin · ' + v['tag'].lower() + ' (own values)'
    cfg = copy.deepcopy(v['config'])
    cfg.get('color', {}).pop('mode', None)
    for f in (v.get('fonts') or '').split('&'):
        if f:
            FONTS.add(f)
    ROWS.append(dict(key=name, tag=tag, config=cfg, vars=v['vars']))
for p in PRODUCTS:
    for f in p['fonts'].split('&'):
        if f:
            FONTS.add(f)
# keep one entry per family name
FAMS = {}
for f in sorted(FONTS):
    FAMS[f.split(':')[0]] = f
FONT_URL = 'https://fonts.googleapis.com/css2?' + '&'.join(FAMS.values()) + '&display=swap'

# ------------------------------------------------------------------ shared board data and Tweaks
COMMON = {
    'yes': True, 'no': False, 's16': 16, 's18': 18, 's22': 22, 's25': 2.5, 'n2': 2, 'p0': 0, 'p40': 40, 'p100': 100,
    'opts': ['[Option A]', '[Option B]', '[Option C]'], 'ranges': ['[Day]', '[Week]', '[Month]'], 'filters': ['[All]', '[Active]', '[Archived]'],
    'pageTabs': ['[Overview]', '[Activity]', '[Files]', '[Settings]'],
    'chips': [{'label': '[Filter A]'}, {'label': '[Filter B]'}, {'label': '[Filter C]'}, {'label': '[Filter D]'}],
    'people': [{'name': '[Person A]'}, {'name': '[Person B]'}, {'name': '[Person C]'}, {'name': '[Person D]'}],
    'navLinks': [{'label': '[Link A]', 'active': True}, {'label': '[Link B]'}, {'label': '[Link C]'}, {'label': '[Link D]'}],
    'navActions': [{'icon': 'search', 'label': 'Search'}, {'icon': 'bag', 'label': 'Bag', 'count': 2}],
    'navCta': {'label': '[Call to action]'},
    'navSections': [{'label': '[Section]', 'items': [{'label': '[Current]', 'icon': 'grid', 'active': True, 'badge': 3}, {'label': '[Item B]', 'icon': 'receipt'}, {'label': '[Item C]', 'icon': 'users'}]},
                    {'label': '[Section]', 'items': [{'label': '[Item D]', 'icon': 'file'}, {'label': '[Settings]', 'icon': 'settings'}]}],
    'navUser': {'name': '[Person A]', 'meta': '[Role]'}, 'crumbs': ['[Product]', '[Page]'],
}
TWEAKS = {"preset": {"editor": "enum", "options": ["none", "ledger", "atelier"], "default": "none", "section": "Preset"},
          "primary": {"editor": "color", "default": "#1C1B19", "section": "Color", "options": ["#1C1B19", "#2F5D50", "#2F6BD8", "#7A2E3A"]},
          "accent": {"editor": "color", "default": "#E0562B", "section": "Color", "options": ["#E0562B", "#C4952E", "#2F6BD8", "#1E8E4E"]},
          "neutral": {"editor": "color", "default": "#77736B", "section": "Color", "options": ["#77736B", "#6B7280", "#7C8579", "#8A7F6A"]},
          "mode": {"editor": "enum", "options": ["light", "dark"], "default": "light", "section": "Color"},
          "roundness": {"editor": "range", "min": 0, "max": 100, "step": 5, "default": 60, "unit": "%", "section": "Shape"},
          "pill": {"editor": "boolean", "default": False, "section": "Shape"},
          "fontPreset": {"editor": "enum", "options": ["modern", "geometric", "editorial", "grotesk", "humanist", "classic", "retail"], "default": "modern", "section": "Type"},
          "buttonCase": {"editor": "enum", "options": ["normal", "upper"], "default": "normal", "section": "Type"},
          "surface": {"editor": "enum", "options": ["solid", "glass"], "default": "solid", "section": "Surface"},
          "density": {"editor": "enum", "options": ["compact", "comfortable", "spacious"], "default": "comfortable", "section": "Surface"},
          "wordmark": {"editor": "text", "default": "Brand", "section": "Logo"}, "caption": {"editor": "text", "default": "Tagline", "section": "Logo"},
          "logoMark": {"editor": "enum", "options": ["monogram", "ring", "spark", "stack", "orbit", "none", "custom"], "default": "monogram", "section": "Logo"},
          "logoVariant": {"editor": "enum", "options": ["lockup", "stacked", "mark", "wordmark"], "default": "lockup", "section": "Logo"},
          "logoPlacement": {"editor": "enum", "options": ["left", "center", "right"], "default": "left", "section": "Logo"},
          "logoSrc": {"editor": "text", "default": "", "section": "Logo"}, "markSrc": {"editor": "text", "default": "", "section": "Logo"}}
ROOT_ATTRS = ('preset="{{preset}}" primary="{{primary}}" accent="{{accent}}" neutral="{{neutral}}" mode="{{mode}}" roundness="{{roundness}}" pill="{{pill}}" font-preset="{{fontPreset}}" '
              'button-case="{{buttonCase}}" surface="{{surface}}" density="{{density}}" wordmark="{{wordmark}}" caption="{{caption}}" logo-mark="{{logoMark}}" logo-variant="{{logoVariant}}" '
              'logo-placement="{{logoPlacement}}" logo-src="{{logoSrc}}" mark-src="{{markSrc}}" style="display: block;"')
THEME_JS = '''  theme() {
    const p = this.props;
    const t = {
      primary: p.primary ?? '#1C1B19', accent: p.accent ?? '#E0562B', neutral: p.neutral ?? '#77736B', mode: p.mode ?? 'light',
      roundness: p.roundness ?? 60, pill: p.pill ?? false, fontPreset: p.fontPreset ?? 'modern', buttonCase: p.buttonCase ?? 'normal',
      surface: p.surface ?? 'solid', density: p.density ?? 'comfortable',
      wordmark: p.wordmark ?? 'Brand', caption: p.caption ?? 'Tagline', logoMark: p.logoMark ?? 'monogram',
      logoVariant: p.logoVariant ?? 'lockup', logoPlacement: p.logoPlacement ?? 'left', logoSrc: p.logoSrc ?? '', markSrc: p.markSrc ?? ''
    };
    // A preset is a whole design language: it owns color, shape, type, density and logo style.
    const P = p.preset && p.preset !== 'none' && window.UIS && window.UIS.PRESETS ? window.UIS.PRESETS[(window.UIS.presetId && window.UIS.presetId(p.preset)) || p.preset] : null;
    t.preset = P ? P.id : undefined;
    if (P) for (const k of ['primary', 'accent', 'neutral', 'roundness', 'pill', 'fontPreset', 'buttonCase', 'surface', 'density', 'caption', 'logoMark', 'logoVariant']) t[k] = undefined;
    return t;
  }
'''


def page(title, inner, script, props, h, root=True):
    body = (X('Root', ROOT_ATTRS, '\n' + inner + '\n') if root else inner)
    html = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>' + esc(title) + '</title>\n<script src="./support.js"></script>\n'
            '<link rel="stylesheet" href="ds/uis/components/bundle.css">\n<script src="ds/uis/components/bundle.js"></script>\n</head>\n<body>\n<x-dc>\n'
            '<helmet>\n<link rel="stylesheet" href="' + FONT_URL.replace('&', '&amp;') + '">\n<style>body{margin:0}</style>\n</helmet>\n' + body +
            '\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'' + json.dumps(props, separators=(',', ':')) + '\'>\n' + script + '</script>\n</body>\n</html>\n')
    assert html.count('<x-import') == html.count('</x-import>'), title
    assert "'" not in json.dumps(props), title
    return html


def header(f, kicker, lead):
    return ('<header style="display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; padding-bottom: 28px;">'
            '<div style="display: flex; flex-direction: column; gap: 12px;"><span class="uis-overline">' + kicker + '</span><h1 class="uis-display-m" style="margin: 0;">' + f['title'] + '</h1></div>'
            '<p class="uis-body" style="margin: 0; color: var(--uis-ink-2); max-width: 560px;">' + lead + '</p></header>')


MEASURED = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'componentpages_heights.json'))) if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'componentpages_heights.json')) else {}


def height(name, guess):
    m = MEASURED.get(name)
    return -(-((m + 40) if m else guess) // 20) * 20


for f in F:
    # ---- states board (shared Tweaks)
    name = 'C-' + f['id'] + '-States.dc.html'
    H = height(name, 2400)
    inner = ('<div style="width: 1440px; min-height: ' + str(H) + 'px; box-sizing: border-box; padding: 56px 64px; background: var(--uis-bg); color: var(--uis-ink); font-family: var(--uis-font-body);" data-measure="">' +
             header(f, 'Component · ' + f['page'] + ' · states, sizes, icons', f['what'] + ' Change the board Tweaks (preset, colours, mode, shape, type) and every row follows.') +
             section('Coverage', 'The nine states every component is checked against. Gaps are not in UI System yet; they are never drawn as working controls.', coverage(f['cov'])) +
             f['states'] + '</div>')
    script = 'class Component extends DCLogic {\n' + THEME_JS + '  renderVals() {\n    return Object.assign({}, ' + json.dumps(COMMON, ensure_ascii=False) + ', this.theme());\n  }\n}\n'
    props = dict(TWEAKS, **{'$preview': {'width': 1440, 'height': H}})
    open(os.path.join(OUT, name), 'w').write(page(f['title'] + ' · states', inner, script, props, H))
    MADE[name] = [f['title'] + ' · states, sizes, icons', f['page'], 1440, H]

    # ---- themes board (every preset and product skin, light and dark)
    name = 'C-' + f['id'] + '-Themes.dc.html'
    H = height(name, 300 + 12 * (f['spec_h'] + 120))
    cellh = ('<div style="{{c.style}}">'
             '<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding-bottom: 12px; margin-bottom: 4px; border-bottom: 1px solid var(--uis-line);">'
             '<span style="display: flex; flex-direction: column; gap: 4px; min-width: 0;"><strong class="uis-h3" style="margin: 0;">{{c.key}}</strong><span class="uis-caption" style="color: var(--uis-ink-2);">{{c.tag}}</span></span>'
             '<span style="display: flex; gap: 8px; align-items: center; flex-shrink: 0;"><span class="uis-caption" style="color: var(--uis-ink-2);">{{c.modeLabel}}</span>'
             '<span style="font: 700 12px/1 var(--uis-font-mono); color: {{c.okInk}};">{{c.contrast}}</span></span></div>' +
             f['specimen'] + '</div>')
    inner = ('<div style="width: 1440px; min-height: ' + str(H) + 'px; box-sizing: border-box; padding: 56px 64px; background: #FFFFFF; color: #1C1B19; font-family: Inter, system-ui, sans-serif;" data-measure="">'
             '<header style="display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; padding-bottom: 28px;">'
             '<div style="display: flex; flex-direction: column; gap: 12px;"><span style="font: 600 11px/1.2 Inter, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #5F5B55;">Component · ' + f['page'] + ' · presets and product skins</span>'
             '<h1 style="margin: 0; font: 600 36px/1.1 Inter, sans-serif; letter-spacing: -0.02em;">' + f['title'] + ' in every preset and skin</h1></div>'
             '<p style="margin: 0; font: 400 15px/1.55 Inter, sans-serif; color: #5F5B55; max-width: 560px;">Each cell is themed live by the engine (buildTheme) for that preset or product, light on the left, dark on the right. '
             'The number is the contrast check for that theme: text pairs under 4.5:1. Products are skins: a product may change anything on top of its preset.</p></header>'
             '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: stretch;">'
             '<sc-for list="{{cells}}" as="c" hint-placeholder-count="' + str(2 * len(ROWS)) + '">' + cellh + '</sc-for></div></div>')
    data = {'rows': ROWS}
    script = ('class Component extends DCLogic {\n  renderVals() {\n    const D = ' + json.dumps(data, ensure_ascii=False) + ';\n' + '''    const U = window.UIS || {};
    const cells = [];
    D.rows.forEach(function (r) {
      ['light', 'dark'].forEach(function (mode) {
        const cfg = JSON.parse(JSON.stringify(r.config));
        cfg.color = Object.assign({}, cfg.color || {}, { mode: mode });
        let th = null;
        try { th = U.buildTheme(cfg); } catch (e) { th = null; }
        const vars = th ? th.vars(mode) : {};
        for (const k in r.vars) vars[k] = r.vars[k];
        const rep = th && U.contrastReport ? U.contrastReport(th).filter(function (x) { return x.mode === mode; }) : [];
        const fails = rep.filter(function (x) { return !x.pass; }).length;
        cells.push({ key: r.key, tag: r.tag, modeLabel: mode === 'dark' ? 'Dark' : 'Light',
          contrast: th ? (fails ? fails + ' FAIL' : rep.length + '/' + rep.length + ' AA') : 'config error', okInk: th && !fails ? 'var(--uis-success-text)' : 'var(--uis-danger-text)',
          style: 'position: relative; display: flex; flex-direction: column; gap: 12px; min-width: 0; padding: 20px; box-sizing: border-box; border-radius: 16px; border: 1px solid var(--uis-line); background: var(--uis-bg); color: var(--uis-ink); font-family: var(--uis-font-body); '
            + Object.keys(vars).map(function (k) { return k + ': ' + vars[k]; }).join('; ') + ';' });
      });
    });
    return Object.assign({ cells: cells }, ''' + json.dumps(COMMON, ensure_ascii=False) + ''');
  }
}
''')
    props = {'$preview': {'width': 1440, 'height': H}}
    # The theme board needs the uis base class for component styles but no board-level theme: cells set every variable.
    open(os.path.join(OUT, name), 'w').write(page(f['title'] + ' · themes', '<div class="uis">' + inner + '</div>', script, props, H, root=False))
    MADE[name] = [f['title'] + ' · presets and skins', f['page'], 1440, H]

json.dump(MADE, open(os.path.join(OUT, 'made-components.json'), 'w'), indent=1)
print(len(MADE), 'boards in', len(F), 'families')
