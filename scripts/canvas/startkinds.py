# "Start here" questions board and the "Kinds" board for UI System · Canvas (owner, 2026-11-09).
# Three picks: preset (how it looks), kind (what you build), brand on top. Text comes from the built
# engine (PRESETS, KINDS in packages/core/dist), so the canvas and `ui-system init` ask the same questions.
# Run after pnpm build: python3 scripts/canvas/startkinds.py <out_dir>  (writes Start.dc.html, Kinds.dc.html, made-start.json)
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from presets_data import PRESET_INFO, KINDS

OUT = sys.argv[1]
esc = lambda s: s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')
INK, INK2, LINE, BG, CARD = '#1C1B19', '#4A4640', '#E3E1DC', '#F7F7F5', '#FFFFFF'
HEAD = lambda title: ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>' + title + '</title>\n<script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
                      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&amp;display=swap">\n<style>body{margin:0}</style>\n</helmet>\n')
FOOT = lambda w, h: ('\n</x-dc>\n<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":' + str(w) + ',"height":' + str(h) + '}}\'>\nclass Component extends DCLogic {\n  renderVals() {\n    return {};\n  }\n}\n</script>\n</body>\n</html>\n')
over = lambda t: '<span style="font: 600 11px/1.2 Inter, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: ' + INK2 + ';">' + esc(t) + '</span>'
h1 = lambda t: '<h1 style="margin: 0; font: 700 40px/1.05 Inter, sans-serif; letter-spacing: -0.02em;">' + esc(t) + '</h1>'
h2 = lambda t: '<h2 style="margin: 0; font: 700 24px/1.15 Inter, sans-serif; letter-spacing: -0.01em;">' + esc(t) + '</h2>'
p_ = lambda t: '<p style="margin: 0; font: 400 15px/1.5 Inter, sans-serif; color: ' + INK2 + ';">' + esc(t) + '</p>'
small = lambda t: '<span style="font: 700 12px/1.2 Inter, sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: ' + INK2 + ';">' + esc(t) + '</span>'
ul = lambda items: ('<ul style="margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font: 400 14px/1.45 Inter, sans-serif; color: ' + INK + ';">' + ''.join('<li>' + esc(i) + '</li>' for i in items) + '</ul>')
box = lambda inner, extra='': '<div style="display: flex; flex-direction: column; gap: 14px; padding: 24px; background: ' + CARD + '; border: 1px solid ' + LINE + '; border-radius: 16px; min-width: 0;' + extra + '">' + inner + '</div>'
pill = lambda t, dark=False: ('<span style="display: inline-flex; align-items: center; min-height: 32px; padding: 0 12px; border-radius: 999px; font: 500 13px/1 Inter, sans-serif; '
                              + ('background: ' + INK + '; color: #FFFFFF;' if dark else 'background: ' + CARD + '; color: ' + INK + '; border: 1px solid #CFCBC4;') + '">' + esc(t) + '</span>')
pills = lambda items: '<div style="display: flex; flex-wrap: wrap; gap: 8px;">' + ''.join(items) + '</div>'
result = lambda title, sub: ('<div style="display: flex; flex-direction: column; gap: 6px; padding: 16px; border-radius: 12px; background: ' + INK + '; color: #FFFFFF;">'
                             '<span style="font: 600 11px/1.2 Inter, sans-serif; letter-spacing: 0.12em; text-transform: uppercase; color: #CFCBC4;">Result</span>'
                             '<span style="font: 700 20px/1.2 Inter, sans-serif;">' + esc(title) + '</span><span style="font: 400 13px/1.45 Inter, sans-serif; color: #E6E3DE;">' + esc(sub) + '</span></div>')
MADE = {}

# The questions that pick a preset. Each answer row maps to one preset id; later presets add a row.
PICK = [('Corners', 'Round, soft', 'Square, sharp'), ('Headings', 'Calm sans', 'Condensed caps'), ('What leads the page', 'Numbers and lists', 'Photos')]
LATER = [('Glass, frosted panels', 'mist'), ('Loud yellow pills', 'signal'), ('Colour pop, big cards', 'studio')]
L, A = PRESET_INFO['ledger'], PRESET_INFO['atelier']

def q_rows():
    rows = ''
    for q, led, atl in PICK:
        rows += '<div style="display: grid; grid-template-columns: 150px 1fr 1fr; gap: 10px; align-items: center;"><span style="font: 600 14px/1.3 Inter, sans-serif;">' + esc(q) + '</span>' + pill(led) + pill(atl) + '</div>'
    return ('<div style="display: grid; grid-template-columns: 150px 1fr 1fr; gap: 10px;"><span></span>' + small('→ ledger') + small('→ atelier') + '</div>' + rows +
            '<div style="display: flex; flex-direction: column; gap: 8px; padding-top: 6px; border-top: 1px dashed #B9B5AE;">' + small('Planned presets, not built yet (one at a time, pictures first)') +
            pills([pill(t + ' → ' + i) for t, i in LATER]) + '</div>')

step1 = box(small('Step 1 · preset') + h2('How should it look?') + q_rows() + '<div style="flex-grow: 1;"></div>' +
            result('ledger or atelier', 'Mostly round answers: ledger. Mostly sharp: atelier. Then its own questions: ' + ' / '.join(L['questions'][:2]) + ' (ledger); ' + ' / '.join(A['questions'][:2]) + ' (atelier).'))
step2 = box(small('Step 2 · kind') + h2('What are you building?') +
            pills([pill(k['label'], dark=(kid == 'app')) for kid, k in KINDS.items()]) +
            '<div style="display: flex; flex-direction: column; gap: 6px;">' + small('Then its questions (example: App)') + ul(KINDS['app']['questions']) + '</div>' +
            '<div style="flex-grow: 1;"></div>' + result('App · ' + str(len(KINDS['app']['pages'])) + ' pages', ', '.join(KINDS['app']['pages']) + '. Every kind is on the Kinds page.'))
step3 = box(small('Step 3 · brand') + h2('Your brand on top') +
            ul(['Colours: keep the preset\'s, or your own seeds (the engine re-derives shades and keeps 4.5:1).', 'Logo: wordmark, or upload the real one.', 'Fonts: keep the preset\'s, or your own.', 'Light, dark or both.', 'Anything else may change too: the preset is the base, not a cage.']) +
            '<div style="flex-grow: 1;"></div>' + result('preset + kind + brand', 'Improvements you make inside a product come back as a proposal with a picture; they join the preset only on your yes.'))

W, H = 1440, 1120
start = (HEAD('Start here') + '<div style="width: ' + str(W) + 'px; height: ' + str(H) + 'px; box-sizing: border-box; padding: 48px 56px; display: flex; flex-direction: column; gap: 28px; background: ' + BG + '; color: ' + INK + '; font-family: Inter, sans-serif;">'
         '<div style="display: flex; flex-direction: column; gap: 8px;">' + over('Start here · before any design') + h1('Three picks: preset, kind, brand') +
         p_('A preset is how it looks (a way of designing, not a product). A kind is what you build. The brand goes on top. The session asks these in chat, and ui-system init --preset <id> --kind <id> prints the same questions.') + '</div>'
         '<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; flex-grow: 1; min-height: 0;">' + step1 + step2 + step3 + '</div>'
         '<div style="display: flex; gap: 16px; align-items: center; padding: 16px 20px; border: 1px dashed #B9B5AE; border-radius: 12px;">' + small('Output') +
         '<code style="font: 400 13px/1.5 ui-monospace, monospace;">{ "preset": "ledger", "kind": "app", "color": { "primary": "[YOUR COLOUR]" }, "brand": { "wordmark": "[NAME]" } }</code></div></div>' + FOOT(W, H))
open(OUT + '/Start.dc.html', 'w').write(start)
MADE['Start.dc.html'] = ('Start here · preset, kind, brand', W, H)

cols = ''.join(box(small(k['id']) + h2(k['label']) + '<p style="margin: 0; font: 400 14px/1.45 Inter, sans-serif; color: ' + INK2 + ';">' + esc(k['note']) + '</p>' +
                   small('Pages, in order') + '<ol style="margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; font: 500 14px/1.4 Inter, sans-serif;">' + ''.join('<li>' + esc(pg) + '</li>' for pg in k['pages']) + '</ol>' +
                   small('Ask first') + ul(k['questions'])) for k in KINDS.values())
W2, H2 = 1440, 980
kinds = (HEAD('Kinds') + '<div style="width: ' + str(W2) + 'px; height: ' + str(H2) + 'px; box-sizing: border-box; padding: 48px 32px; display: flex; flex-direction: column; gap: 28px; background: ' + BG + '; color: ' + INK + '; font-family: Inter, sans-serif;">'
         '<div style="display: flex; flex-direction: column; gap: 8px; padding: 0 24px;">' + over('Kinds · what you build') + h1('Five kinds, any preset') +
         p_('A kind sets no values. It names the pages to draw first and the questions that narrow scope. Draw its pages in the chosen preset; the preset sheets show App (ledger) and Shop (atelier) as examples.') + '</div>'
         '<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; flex-grow: 1; min-height: 0;">' + cols + '</div></div>' + FOOT(W2, H2))
open(OUT + '/Kinds.dc.html', 'w').write(kinds)
MADE['Kinds.dc.html'] = ('Kinds · page sets and questions', W2, H2)
json.dump(MADE, open(OUT + '/made-start.json', 'w'), indent=1)
print(', '.join(MADE))
