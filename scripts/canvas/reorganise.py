# Page order and layout for UI System · Canvas (owner, 2026-11-09).
# Reads the LIVE canvas.json (always Artifact-read it first) plus made-components.json from componentpages.py,
# and writes a new canvas.json: same boards and notes (nothing removed, his edits kept), new page order,
# one page per component family, and an Archive page for superseded boards.
# Usage: python3 scripts/canvas/reorganise.py <live canvas.json> <made-components.json> <out canvas.json>
import copy, json, sys

live, made, out = sys.argv[1], sys.argv[2], sys.argv[3]
C = json.load(open(live))
M = json.load(open(made))
N = copy.deepcopy(C)
# First run moves the existing boards and notes. Later runs only add new family boards and notes and resize
# generated boards to their measured height: anything the owner moved or retyped on the canvas stays.
FIRST = 'archive' not in [p['id'] for p in C.get('pages', [])]
GAP_X, GAP_Y = 80, 120

# ---- pages, in reading order
FAMILY_PAGES = []
for f, (title, page, w, h) in M.items():
    pid = 'c-' + page.lower().replace(' · ', '-').replace(' ', '-')
    if pid not in [p for p, _ in FAMILY_PAGES]:
        FAMILY_PAGES.append((pid, page))
PAGES = ([('start', 'Start here'), ('foundations', 'Foundations'), ('presets', 'Presets'), ('kinds', 'Kinds'), ('components', 'Components · overview')] +
         [(pid, 'Components › ' + name) for pid, name in FAMILY_PAGES] +
         [('patterns', 'Patterns'), ('navigation', 'Navigation · shells'), ('usecases', 'Use cases'), ('archive', 'Archive')])
assert len(PAGES) <= 40
if FIRST:
    N['pages'] = [{'id': i, 'name': n} for i, n in PAGES]
else:  # keep his page names and order; insert a new family page before Patterns
    have = [p['id'] for p in N['pages']]
    for i, n in PAGES:
        if i not in have:
            at = have.index('patterns') if 'patterns' in have else len(have)
            N['pages'].insert(at, {'id': i, 'name': n}); have.insert(at, i)

# ---- move superseded boards to Archive (never deleted)
ARCHIVE = [  # (file, x, y)
    ('Retail-D1-Sidebar.dc.html', 0, 0), ('Retail-D2-Info.dc.html', 1520, 0), ('Retail-D3-Dark.dc.html', 0, 940), ('Retail-Fixes.dc.html', 1520, 940),
    ('Sheet-Buttons.dc.html', 0, 2400), ('Sheet-Forms.dc.html', 1520, 2400), ('Sheet-Badges.dc.html', 3040, 2400), ('Sheet-Feedback.dc.html', 4560, 2400),
    ('Sheet-Cards.dc.html', 0, 6400), ('Sheet-Data.dc.html', 1520, 6400), ('Sheet-People.dc.html', 3040, 6400), ('Sheet-NavParts.dc.html', 4560, 6400),
]
for f, x, y in (ARCHIVE if FIRST else []):
    if f in N['boards']:
        N['boards'][f].update(page='archive', x=x, y=y)
# Components overview keeps the two boards at rest; Presets keeps the two sheets and the live board beside them.
for f, x, y in ([('Components.dc.html', 0, 0), ('States.dc.html', 1520, 0)] if FIRST else []):
    if f in N['boards']:
        N['boards'][f].update(x=x, y=y)
if FIRST and 'Retail-Live.dc.html' in N['boards']:
    N['boards']['Retail-Live.dc.html'].update(x=3040, y=0)

# ---- family boards: states left, themes right
order = list(N['order'])
for f, (title, page, w, h) in M.items():
    pid = 'c-' + page.lower().replace(' · ', '-').replace(' ', '-')
    x = 0 if f.endswith('-States.dc.html') else w + GAP_X
    entry = dict(N['boards'].get(f, {}))
    if f in N['boards']:  # keep where he put it and what he called it; only the measured size follows the generator
        entry.update(w=w, h=h)
    else:
        entry.update(x=x, y=0, w=w, h=h, title=title, page=pid, is_interactive=True)
    N['boards'][f] = entry
    if f not in order:
        order.append(f)
N['order'] = order

# ---- notes: titles and stickies follow their boards
notes = N['notes']
def note(nid, new_only=False, **k):
    if nid in notes and (new_only or not FIRST):
        return  # never retype or move a note that is already on the canvas after the first run
    if nid not in notes and 'page' not in k:
        return  # a text-only change for a note this canvas does not have
    notes[nid] = dict(notes.get(nid, {}), **k)
    if nid not in N['noteOrder']:
        N['noteOrder'].append(nid)

note('t-comp', page='components', x=0, y=-300, text='Components · overview', maxW=2960)
note('n-comp', page='components', x=3040, y=0, w=480, text=(
    'At rest (left) and states (right).\n\nEvery component family now has its own page (the Components › pages): '
    'states, sizes and icons on the left board, every preset and product skin in light and dark on the right.\n\n'
    'The older sheets that grouped several families are on the Archive page, kept as they were.'))
if 't-sheets' in notes:  # the old sheets title moves with them
    note('t-sheets', page='archive', x=0, y=2100, text='Superseded component sheets (now one page per family)', maxW=5960)
note('t-dec', page='archive', x=0, y=-300, text='Atelier · signed decisions, 2026-11-07', maxW=2960)
note('n-archive', page='archive', x=3040, y=0, w=480, fill='gray', size=20, text=(
    'Kept as the record. Nothing here is deleted.\n\nTop: the atelier decisions signed on 2026-11-07 (all shipped).\n\n'
    'Below: the first component sheets, superseded by one page per component family. Copy anything you edited here onto the family page, or tell Claude to.'))
note('t-retail', page='presets', x=3040, y=-300, maxW=1440)
note('n-retail', page='presets', x=4560, y=0)
note('n-prod', page='presets', x=4560, y=400)
note('t-prod', page='presets', x=0, y=-300, maxW=2960)
note('t-front', text='Navigation · whole website bars')
note('t-back', text='Navigation · whole app shells')
GAPS = {}
for f, (title, page, w, h) in M.items():
    pid = 'c-' + page.lower().replace(' · ', '-').replace(' ', '-')
    if f.endswith('-States.dc.html'):
        note('t-' + pid, kind='title1', page=pid, x=0, y=-300, maxW=2 * w + GAP_X, w=240, text=page)
        note('n-' + pid, fill='gray', page=pid, size=20, w=480, x=2 * (w + GAP_X), y=0, text=(
            'Left: every state, size and icon placement. Its Tweaks work like every other board (preset, colours, mode, shape, type).\n\n'
            'Right: the same parts in every preset (none, ledger, atelier) and every product skin, light and dark, each with its contrast count.\n\n'
            'Gaps on the coverage row are states UI System does not have yet.'))
howto = notes.get('howto')
OLD_HOWTO = '1. Pages, top left: Start here, Foundations, Components (with one detailed sheet per component), Patterns (articles, places, website sections, commerce, app), Navigation, Use cases, Presets (one sheet per preset, products as skins), Kinds (what you build).'
if FIRST and howto and OLD_HOWTO not in howto['text']:
    print('warning: howto note text changed; page list line not updated')
if FIRST and howto:
    howto['text'] = howto['text'].replace(
        '1. Pages, top left: Start here, Foundations, Components (with one detailed sheet per component), Patterns (articles, places, website sections, commerce, app), Navigation, Use cases, Presets (one sheet per preset, products as skins), Kinds (what you build).',
        '1. Pages, top left: Start here, Foundations, Presets (one sheet per preset, products as skins), Kinds (what you build), Components overview, then one page per component family (Components › …), Patterns, Navigation shells, Use cases, Archive.')
if FIRST:
    N['launch'] = {'page': 'start', 'view': 'canvas'}
json.dump(N, open(out, 'w'), ensure_ascii=False)
print('pages:', len(N['pages']), '· boards:', len(N['boards']), '· notes:', len(N['notes']))
