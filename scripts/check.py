"""Check sokkel-design's specs: JSON Schema, each key's kind of name against tokens/tokens.resolved.json, painted states, word samples, the index's version and statuses, each part's renderers, each word's message id and English against messages/en.json (sokkel-ui's catalogs at the pin), the surfaces its pieces stand on, its cells and glyphs, the index's cell grid and color depth (the sixteen-color role map and what lies under a layer included), its status vocabulary, glyphs.json, and that the resolved file was made from the sokkel-ui commit sokkel-ui.json pins."""
import json, re, sys
from pathlib import Path
import jsonschema

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
RESOLVED = json.load(open(sys.argv[2] if len(sys.argv) > 2 else ROOT / 'tokens/tokens.resolved.json'))
schema = json.load(open(ROOT / 'schema/part.schema.json'))
paints_schema = json.load(open(ROOT / 'schema/paints.schema.json'))
jsonschema.Draft202012Validator.check_schema(paints_schema)
index = json.load(open(ROOT / 'index.json'))
pin = json.load(open(ROOT / 'sokkel-ui.json'))
themes = index['themes']['specimens']
sets = [RESOLVED['themes'][th][s] for th in themes for s in ('light', 'dark')]
colors = set.intersection(*[set(d['colors']) for d in sets])
lengths = set.intersection(*[set(d['lengths']) for d in sets])
numbers = set.intersection(*[set(d['numbers']) for d in sets])
durations = set.intersection(*[set(d.get('durations', {})) for d in sets])
texts = set.intersection(*[set(d['text']) for d in sets])
density = set.intersection(*[set(v) for v in RESOLVED['density'].values()])
every_set = [(th, sc, RESOLVED['themes'][th][sc]) for th in RESOLVED['themes'] for sc in ('light', 'dark')]
glyphs = json.load(open(ROOT / index.get('glyphs', 'glyphs.json')))
glyph_names = {k for k in glyphs['glyphs']} | {k for k in glyphs['icons'] if not k.startswith('$')} | {'box'}
renderer_ids = [r['id'] for r in index.get('renderers', [])]
catalog_path = ROOT / 'messages' / 'en.json'
catalog = json.load(open(catalog_path)) if catalog_path.exists() else None

problems = []
made = RESOLVED.get('sokkelUi', {})
if made.get('commit') != pin['commit'] or made.get('repo') != pin['repo']:
    problems.append(f"tokens/tokens.resolved.json was made from sokkel-ui at {made.get('commit')}, but sokkel-ui.json pins {pin['commit']}: run bun scripts/resolve.ts")
if not re.match(r'^\d+\.\d+\.\d+$', str(index.get('version', ''))):
    problems.append(f"index.json: version {index.get('version')!r} is not a version (it moves in lockstep with sokkel-ui)")
for e in jsonschema.Draft202012Validator(paints_schema).iter_errors(RESOLVED.get('paints', {})):
    problems.append(f'tokens.resolved.json paints: {"/".join(map(str, e.path))}: {e.message[:160]}')

if renderer_ids != ['sokkel-ui', 'sokkel-egui', 'sokkel-tui']:
    problems.append(f'index.json: renderers {renderer_ids} are not sokkel-ui, sokkel-egui and sokkel-tui, the keys every part\'s renderers holds')
cells = index.get('cells', {})
cb = cells.get('breakpoints', {})
for name, at in cb.items():
    if at.get('token') not in lengths: problems.append(f"index.json: cells.breakpoints.{name}.token {at.get('token')} is not a length token")
    if not isinstance(at.get('columns'), int) or at['columns'] <= 0: problems.append(f'index.json: cells.breakpoints.{name}.columns is not a count of columns')
if set(cb) != set(index['breakpoints']): problems.append('index.json: cells.breakpoints does not hold every breakpoint')
elif not cb['md']['columns'] < cb['lg']['columns']: problems.append('index.json: cells.breakpoints: md is not below lg')
for i, size in enumerate(cells.get('checkSizes', [])):
    if not (isinstance(size.get('columns'), int) and isinstance(size.get('rows'), int)): problems.append(f'index.json: cells.checkSizes[{i}] is not columns by rows')
role_names = set.intersection(*[set(d['text']) for _, _, d in every_set])
listed_roles = {k for k in cells.get('textRoles', {}) if not k.startswith('$')}
if listed_roles != role_names:
    problems.append(f'index.json: cells.textRoles lacks {sorted(role_names - listed_roles)} and has {sorted(listed_roles - role_names)} beyond the resolved text roles')
for role, look in cells.get('textRoles', {}).items():
    if role.startswith('$'): continue
    if set(look) != {'bold', 'italic', 'ink'} or not isinstance(look['bold'], bool) or not isinstance(look['italic'], bool):
        problems.append(f'index.json: cells.textRoles.{role} is not bold, italic and ink')
    elif look['ink'] != 'piece' and look['ink'] not in colors: problems.append(f"index.json: cells.textRoles.{role}.ink {look['ink']} is neither piece nor a color")
ansi = index.get('colorDepth', {}).get('ansi16', {}).get('tokens', [])
if len(ansi) != 16: problems.append(f'index.json: colorDepth.ansi16.tokens names {len(ansi)} colors, not 16')
for th, sc, d in every_set:
    for name in ansi:
        if name not in d['colors']: problems.append(f'index.json: colorDepth.ansi16 {name} is not a color in {th} {sc}')
        elif len(d['colors'][name]) != 7: problems.append(f'index.json: colorDepth.ansi16 {name} is not opaque in {th} {sc}')
for token, index16 in index.get('colorDepth', {}).get('ansi16', {}).get('paints', {}).items():
    if token.startswith('$'): continue
    if token not in colors: problems.append(f'index.json: colorDepth.ansi16.paints {token} is not a color in every resolved theme and scheme')
    if index16 not in ('default', 'reverse') and index16 not in ansi: problems.append(f'index.json: colorDepth.ansi16.paints.{token} {index16} is neither default, reverse nor an ansi-* token')
if set(index.get('colorDepth', {}).get('underLayer', {})) - {'$description'} != {'truecolor', 'ansi256', 'ansi16', 'none'}:
    problems.append('index.json: colorDepth.underLayer does not say each depth')

st = index.get('statuses', {})
for name, look in st.get('colors', {}).items():
    for field in ('color', 'ink'):
        if look.get(field) not in colors: problems.append(f"index.json: statuses.colors.{name}.{field} {look.get(field)} is not a color in every resolved theme and scheme")
for family in ('run', 'health'):
    for state, color in st.get(family, {}).items():
        if state.startswith('$'): continue
        if color not in st.get('colors', {}): problems.append(f'index.json: statuses.{family}.{state} {color} is not one of statuses.colors')
for state in st.get('live', []):
    if state not in st.get('run', {}) and state not in st.get('health', {}): problems.append(f'index.json: statuses.live {state} is not a state')
if 'status-dot' not in glyphs['glyphs']: problems.append('glyphs.json: statuses draw status-dot, which it lacks')

def ascii_ok(v): return all(isinstance(x, str) and x and all(32 <= ord(c) < 127 for c in x) for x in (v if isinstance(v, list) else [v]))
for name, glyph in glyphs['glyphs'].items():
    if 'unicode' not in glyph or 'ascii' not in glyph: problems.append(f'glyphs.json: glyphs.{name} needs a unicode and an ascii form'); continue
    if isinstance(glyph['unicode'], list) != isinstance(glyph['ascii'], list): problems.append(f'glyphs.json: glyphs.{name}: one form is frames and the other not')
    if not ascii_ok(glyph['ascii']): problems.append(f'glyphs.json: glyphs.{name}.ascii is not printable ASCII')
    if 'frame' in glyph and glyph['frame'] not in durations: problems.append(f"glyphs.json: glyphs.{name}.frame {glyph['frame']} is not a duration token")
for form, box in ((k, v) for k, v in glyphs['box'].items() if not k.startswith('$')):
    if set(box) != set(glyphs['box']['rounded']): problems.append(f'glyphs.json: box.{form} does not have the pieces rounded has')
    if form == 'ascii' and not ascii_ok(list(box.values())): problems.append('glyphs.json: box.ascii is not printable ASCII')
for name, icon in glyphs['icons'].items():
    if name.startswith('$'): continue
    m = re.match(r'^U\+([0-9A-F]{4,5})$', icon.get('nerdFont', ''))
    if not m or not (0xE000 <= int(m.group(1), 16) <= 0xF8FF or int(m.group(1), 16) >= 0xF0000): problems.append(f'glyphs.json: icons.{name}.nerdFont is not a private-use codepoint')
    if not icon.get('unicode') or not ascii_ok(icon.get('ascii', '')): problems.append(f'glyphs.json: icons.{name} needs a unicode form and a printable ASCII one')
missing_sources = [k for sc in ('light', 'dark') for k, v in RESOLVED.get('paintSources', {}).get(sc, {}).items() if 'standsOn' not in v]
if missing_sources: problems.append(f'tokens.resolved.json: {len(missing_sources)} paint sources say no standsOn: run bun scripts/resolve.ts')

def color_ok(v, where):
    if v in ('none', 'inherit'): return
    m = re.match(r'^mix(-oklab)?\((.+)\)$', v)
    if m:
        for part in re.split(r',\s*', m.group(2)): color_ok(part.split()[0], where)
        return
    name = v.split('/')[0]
    if name not in colors: problems.append(f'{where}: {name} is not a color in every resolved theme and scheme')

def length_ok(v, where, also=()):
    if v is None or isinstance(v, (int, float, dict)): return
    if v.startswith('text.'): problems.append(f'{where}: text role {v} under a length key')
    elif v.startswith('density.'):
        if v[8:] not in density: problems.append(f'{where}: {v} is not a density length')
    elif v not in lengths and v not in also: problems.append(f'{where}: {v} is not a length token{" or a duration" if also else ""}')

def opacity_ok(v, where):
    if isinstance(v, str) and v not in numbers: problems.append(f'{where}: {v} is not a number token')

def radius_ok(v, where):
    if not v.startswith('radius') or v not in lengths: problems.append(f'{where}: {v} is not a radius token')

def text_ok(v, where):
    if not v.startswith('text.') or v[5:] not in texts: problems.append(f'{where}: {v} is not a text role')

def ring_ok(r, where):
    color_ok(r['color'], where)
    length_ok(r['width'], where + '.width')
    if 'offset' in r: length_ok(r['offset'], where + '.offset')
    if 'dark' in r: color_ok(r['dark']['color'], where + '.dark')

def paint_ok(p, where):
    for k in ('ground', 'edge', 'ink', 'rule', 'mark', 'placeholder'):
        if k in p: color_ok(p[k], f'{where}.{k}')
    if 'ring' in p: ring_ok(p['ring'], f'{where}.ring')
    if 'text' in p: text_ok(p['text'], f'{where}.text')
    if 'radius' in p: radius_ok(p['radius'], f'{where}.radius')
    if 'opacity' in p: opacity_ok(p['opacity'], f'{where}.opacity')
    if 'dark' in p: paint_ok(p['dark'], f'{where}.dark')

def slots(word):
    texts = [word] if isinstance(word, str) else [word['one'], word['other']]
    found = {s for t in texts for s in re.findall(r'\{(\w+)\}', t)}
    return found | ({'count'} if isinstance(word, dict) else set())

listed = {e['id']: e for e in index['parts'] + index['patterns']}
summary = {}
for f in sorted(list((ROOT / 'parts').glob('*.json')) + list((ROOT / 'patterns').glob('*.json'))):
    d = json.load(open(f)); name = f.relative_to(ROOT)
    for e in sorted(jsonschema.Draft202012Validator(schema).iter_errors(d), key=lambda e: list(e.path)):
        problems.append(f'{name}: schema: {"/".join(map(str, e.path))}: {e.message[:160]}')
    entry = listed.get(d['id'])
    if entry is None: problems.append(f'{name}: not listed in index.json')
    elif entry.get('status') != d['status']: problems.append(f"{name}: status {d['status']}, index.json says {entry.get('status')}")
    ren = d.get('renderers', {})
    if d['status'] == 'stable' and ren.get('sokkel-ui', {}).get('state') == 'missing':
        problems.append(f'{name}: stable, and sokkel-ui has not built it (renderers)')
    named = set(d['anatomy']) | set(d.get('variants', {})) | set(d.get('pieces', {})) | {'default'}
    for piece, surface in d.get('standsOn', {}).items():
        if piece not in named: problems.append(f'{name}: standsOn.{piece} is not a piece, a variant or default')
        for th, sc, rs in every_set:
            value = rs['colors'].get(surface)
            if value is None: problems.append(f'{name}: standsOn.{piece} {surface} is not a color in {th} {sc}'); break
            if len(value) != 7: problems.append(f'{name}: standsOn.{piece} {surface} is not opaque in {th} {sc} ({value})'); break
    for piece, surfaces in d.get('alsoStandsOn', {}).items():
        if piece not in named: problems.append(f'{name}: alsoStandsOn.{piece} is not a piece, a variant or default')
        for surface in surfaces:
            for th, sc, rs in every_set:
                value = rs['colors'].get(surface)
                if value is None: problems.append(f'{name}: alsoStandsOn.{piece} {surface} is not a color in {th} {sc}'); break
                if len(value) != 7: problems.append(f'{name}: alsoStandsOn.{piece} {surface} is not opaque in {th} {sc} ({value})'); break
    c = d.get('cells', {})
    for piece in c.get('pieces', {}):
        if piece not in d['anatomy']: problems.append(f'{name}: cells.pieces.{piece} is not in anatomy')
    for size in c.get('sizes', {}):
        if size not in d.get('sizes', {}): problems.append(f'{name}: cells.sizes.{size} is not a size')
    for glyph in c.get('glyphs', []):
        if glyph not in glyph_names: problems.append(f'{name}: cells.glyphs {glyph} is not in glyphs.json')
    single = {k for k in d['states'] if '+' not in k}
    for k, v in d['states'].items():
        for s in k.split('+'):
            if s not in single: problems.append(f'{name}: states.{k}: {s} is not a single state')
        effect = v.get('effect', {})
        if effect.get('ring'): ring_ok(effect['ring'], f'{name}: states.{k}.effect.ring')
        if 'opacity' in effect: opacity_ok(effect['opacity'], f'{name}: states.{k}.effect.opacity')
        piece = effect.get('piece')
        if piece and piece not in d['anatomy']: problems.append(f'{name}: states.{k}.effect.piece {piece} not in anatomy')
    for group in ('variants', 'pieces'):
        for piece, pmap in d.get(group, {}).items():
            if group == 'pieces' and piece not in d['anatomy'] and not (piece == 'container' and 'container' in d['anatomy']):
                problems.append(f'{name}: pieces.{piece} not in anatomy')
            for state, paint in pmap.items():
                for s in state.split('+'):
                    if s not in single: problems.append(f'{name}: {group}.{piece}: state {s} not listed')
                paint_ok(paint, f'{name}: {group}.{piece}.{state}')
    for k, v in d.get('sizes', {}).items():
        for key, val in v.items():
            if key == 'text': text_ok(val, f'{name}: sizes.{k}.text')
            elif key == 'radius': radius_ok(val, f'{name}: sizes.{k}.radius')
            elif key not in ('note', 'radiusMax', 'textBelowMd'): length_ok(val, f'{name}: sizes.{k}.{key}')
    for k, v in d.get('layout', {}).items():
        val = v['value'] if isinstance(v, dict) and 'value' in v else v
        length_ok(val, f'{name}: layout.{k}', durations)
    for k, v in d.get('breakpoints', {}).items():
        at = v['width'].split()[1]
        if not at.isdigit(): length_ok(at, f'{name}: breakpoints.{k}.width')
    messages = d.get('messages', {})
    if catalog is None: problems.append('messages/en.json is missing: run bun scripts/resolve.ts')
    else:
        for k in d['words']:
            if k not in messages: problems.append(f'{name}: words.{k} has no messages entry (its message id, or null where the catalog holds none)')
        for k, m in messages.items():
            if k not in d['words']: problems.append(f'{name}: messages.{k} is not a word'); continue
            if m is None: continue
            if m['id'] not in catalog: problems.append(f"{name}: messages.{k}: {m['id']} is not in sokkel-ui's catalogs at the pin")
            elif catalog[m['id']] != m['en']: problems.append(f"{name}: messages.{k}: the English is {m['en']!r}, the catalog says {catalog[m['id']]!r}")
    samples = d.get('samples', {})
    for k, word in d['words'].items():
        if slots(word) and k not in samples: problems.append(f'{name}: words.{k} interpolates or counts, and has no samples')
    for k, given in samples.items():
        if k not in d['words']:
            problems.append(f'{name}: samples.{k} is not a word'); continue
        wanted = slots(d['words'][k])
        for i, sample in enumerate(given):
            missing = wanted - set(sample['with'])
            if missing: problems.append(f'{name}: samples.{k}[{i}] leaves out {", ".join(sorted(missing))}')
    paints = [key for key in RESOLVED.get('paints', {}).get('tidevann', {}).get('light', {}) if key.startswith(d['id'] + '.')]
    summary[str(name)] = {'status': d['status'], 'renderers': '/'.join(ren.get(r, {}).get('state', '?')[0] for r in renderer_ids), 'cells': 'cells' in d, 'states': len(d['states']), 'paints': len(paints), 'keys': len(d['keyboard']), 'words': len(d['words']), 'ids': sum(1 for m in messages.values() if m), 'samples': sum(len(v) for v in samples.values())}

for entry in listed.values():
    if not (ROOT / entry['file']).exists(): problems.append(f"index.json: {entry['file']} does not exist")
total = sum(v['paints'] for v in summary.values())
resolved_total = sum(len(s) for th in RESOLVED.get('paints', {}).values() for s in th.values())
print(json.dumps(summary))
print(f"contract {index.get('version')}; sokkel-ui at {pin['commit'][:12]}; paints per theme and scheme: {total}; resolved: {resolved_total}")
spec = json.load(open(ROOT / 'specimens.json'))
print('specimens:', len(spec['specimens']), 'entries;', len({s['id'] for s in spec['specimens']}), 'story paths')
print('problems:', len(problems))
for p in problems: print(' -', p)
sys.exit(1 if problems else 0)
