"""Check sokkel-design's specs: JSON Schema, each key's kind of name against tokens/tokens.resolved.json, painted states, word samples, the index's version and statuses, and that the resolved file was made from the sokkel-ui commit sokkel-ui.json pins."""
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

problems = []
made = RESOLVED.get('sokkelUi', {})
if made.get('commit') != pin['commit'] or made.get('repo') != pin['repo']:
    problems.append(f"tokens/tokens.resolved.json was made from sokkel-ui at {made.get('commit')}, but sokkel-ui.json pins {pin['commit']}: run bun scripts/resolve.ts")
if not re.match(r'^\d+\.\d+\.\d+$', str(index.get('version', ''))):
    problems.append(f"index.json: version {index.get('version')!r} is not a version (it moves in lockstep with sokkel-ui)")
for e in jsonschema.Draft202012Validator(paints_schema).iter_errors(RESOLVED.get('paints', {})):
    problems.append(f'tokens.resolved.json paints: {"/".join(map(str, e.path))}: {e.message[:160]}')

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
    summary[str(name)] = {'status': d['status'], 'states': len(d['states']), 'paints': len(paints), 'keys': len(d['keyboard']), 'words': len(d['words']), 'samples': sum(len(v) for v in samples.values())}

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
