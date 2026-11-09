# One design sheet per PRESET (a way of designing), not per product (owner, 2026-11-09).
# Products appear only as skins on the sheet. Preset text (note, rules, never, questions, seenIn)
# and the kinds are read from the built engine (packages/core/dist), so the canvas never drifts from code.
import copy, json, os, subprocess
from products import PRODUCTS, V, POPPINS, LATO

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENGINE = json.loads(subprocess.check_output(['node', '--input-type=module', '-e',
    "const c = await import(process.argv[1]); console.log(JSON.stringify({ presets: c.PRESETS, kinds: c.KINDS }));",
    os.path.join(ROOT, 'packages/core/dist/index.js')]))
PRESET_INFO = ENGINE['presets']
KINDS = ENGINE['kinds']
BY_ID = {p['id']: p for p in PRODUCTS}
INTER = 'family=Inter:wght@400..700'

def preset_sheet(pid, preset, data_from, kind_note, gaps, skins, default='Base'):
    info = PRESET_INFO[preset]
    d = copy.deepcopy(BY_ID[data_from])
    d.update(id=pid, name=preset, preset=preset, engine=True, data=data_from,
             tagline=kind_note + ' · seen in ' + ', '.join(info['seenIn']),
             summary=info['note'],
             rules=[(1, r) for r in info['rules']] + [(0, n) for n in info['never']],
             questions=info['questions'],
             gaps=gaps, source=info['source'], default=default, variants=skins)
    return d

PRESET_SHEETS = [
    preset_sheet('Ledger', 'ledger', 'Invios', 'round and clean',
        'Pins nothing: dark mode is derived from the seeds. Clickit ships the LBC font, which is not on Google Fonts; Inter stands in on its skin.',
        [V('Base', 'ledger · no brand', 'The preset alone. Every product on ledger starts here.', 'light', {'preset': 'ledger'}, {}, POPPINS),
         V('Invios', 'ledger · light and dark', 'Invios on ledger: only the wordmark changes. Light and dark both live (D-05).', 'light',
           {'preset': 'ledger', 'brand': {'wordmark': 'Invios'}}, {}, POPPINS),
         V('Clickit', 'ledger · yellow · dark · own font', 'Clickit on ledger when rebuilt: yellow #ffcc00, dark, its own font (Inter stands in for LBC). Shape and sizes stay ledger.', 'dark',
           {'preset': 'ledger', 'brand': {'wordmark': 'Clickit'}, 'color': {'primary': '#FFCC00', 'accent': '#FFCC00'}, 'type': {'display': 'Inter', 'body': 'Inter'}}, {}, INTER)]),
    preset_sheet('Atelier', 'atelier', 'Senorita', 'sharp and editorial',
        'Questa (ALMAR) is not on Google Fonts; Georgia stands in on its skin. The resting search pill has no edge (under WCAG 1.4.11).',
        [V('Base', 'atelier · no brand', 'The preset alone. Every product on atelier starts here. Values measured from the Senorita storefront CSS.', 'light', {'preset': 'atelier', 'brand': {'wordmark': '[NAME]'}}, {}, ''),
         V('Senorita', 'atelier · burgundy wordmark', 'Senorita on atelier: the source of the preset; only the wordmark is its own.', 'light',
           {'preset': 'atelier', 'brand': {'wordmark': 'Senorita'}}, {}, ''),
         V('ALMAR', 'atelier · teal, gold, own fonts', 'ALMAR on atelier when rebuilt: teal primary, gold accent, Questa and Lato (Georgia stands in). Shape and sizes stay atelier. Contrast: 0 fails light and dark.', 'light',
           {'preset': 'atelier', 'brand': {'wordmark': 'ALMAR', 'wordmarkColor': '#1F3B40'}, 'color': {'primary': '#1F3B40', 'accent': '#D4BA8A'}, 'type': {'body': 'Lato'}},
           {'--uis-font-display': 'Georgia, serif', '--uis-heading-font': 'Georgia, serif', '--uis-display-weight': '400', '--uis-heading-weight': '400', '--uis-display-case': 'none', '--uis-heading-case': 'none'}, LATO)]),
]
