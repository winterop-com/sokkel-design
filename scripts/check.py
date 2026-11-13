"""Check sokkel-design's part files: JSON Schema, each key's kind of name against tokens.resolved.json, painted states; count the paints the resolver would emit."""
import json, re, sys
from pathlib import Path
import jsonschema

ROOT = Path(sys.argv[1])
RESOLVED = json.load(open(sys.argv[2]))
schema = json.load(open(ROOT / 'schema/part.schema.json'))
jsonschema.Draft202012Validator.check_schema(json.load(open(ROOT / 'schema/paints.schema.json')))
index = json.load(open(ROOT / 'index.json'))
# Names a sokkel-ui change is adding that do not resolve yet; index.json lists them only while one is in progress.
landing = {k for k in index['tokens'].get('landing', {}) if not k.startswith('$')}
themes = index['themes']['specimens']
sets = [RESOLVED['themes'][th][s] for th in themes for s in ('light', 'dark')]
colors = set.intersection(*[set(d['colors']) for d in sets])
lengths = set.intersection(*[set(d['lengths']) for d in sets])
words = set.union(*[set(d['words']) for d in sets])
texts = set.intersection(*[set(d['text']) for d in sets])
density = set.intersection(*[set(v) for v in RESOLVED['density'].values()])

problems = []
def color_ok(v, where):
    if v in ('none', 'inherit'): return
    m = re.match(r'^mix(-oklab)?\((.+)\)$', v)
    if m:
        for part in re.split(r',\s*', m.group(2)): color_ok(part.split()[0], where)
        return
    if '|' in v:
        a, b = v.split('|')
        if a not in colors and a not in words: problems.append(f'{where}: {a} is neither a color nor a currentcolor word')
        return color_ok(b, where)
    name = v.split('/')[0]
    if name not in colors: problems.append(f'{where}: {name} is not a color in every resolved theme and scheme')

def length_ok(v, where):
    if v is None or isinstance(v, (int, float, dict)) or v in landing: return
    if v.startswith('text.'): problems.append(f'{where}: text role {v} under a length key')
    elif v.startswith('density.'):
        if v[8:] not in density: problems.append(f'{where}: {v} is not a density length')
    elif v not in lengths: problems.append(f'{where}: {v} is not a length token')

def radius_ok(v, where):
    if not v.startswith('radius') or v not in lengths: problems.append(f'{where}: {v} is not a radius token')

def text_ok(v, where):
    if not v.startswith('text.') or v[5:] not in texts: problems.append(f'{where}: {v} is not a text role')

def ring_ok(r, where):
    color_ok(r['color'], where)
    if 'dark' in r: color_ok(r['dark']['color'], where + '.dark')

def paint_ok(p, where):
    for k in ('ground', 'edge', 'ink', 'rule', 'mark', 'placeholder'):
        if k in p: color_ok(p[k], f'{where}.{k}')
    if 'ring' in p: ring_ok(p['ring'], f'{where}.ring')
    if 'text' in p: text_ok(p['text'], f'{where}.text')
    if 'radius' in p: radius_ok(p['radius'], f'{where}.radius')
    if 'dark' in p: paint_ok(p['dark'], f'{where}.dark')

summary = {}
for f in sorted(list((ROOT / 'parts').glob('*.json')) + list((ROOT / 'patterns').glob('*.json'))):
    d = json.load(open(f)); name = f.relative_to(ROOT)
    for e in sorted(jsonschema.Draft202012Validator(schema).iter_errors(d), key=lambda e: list(e.path)):
        problems.append(f'{name}: schema: {"/".join(map(str, e.path))}: {e.message[:160]}')
    single = {k for k in d['states'] if '+' not in k}
    for k, v in d['states'].items():
        for s in k.split('+'):
            if s not in single: problems.append(f'{name}: states.{k}: {s} is not a single state')
        ring = v.get('effect', {}).get('ring')
        if ring: ring_ok(ring, f'{name}: states.{k}.effect.ring')
        piece = v.get('effect', {}).get('piece')
        if piece and piece not in d['anatomy']: problems.append(f'{name}: states.{k}.effect.piece {piece} not in anatomy')
    paints = set()
    for group in ('variants', 'pieces'):
        for piece, pmap in d.get(group, {}).items():
            if group == 'pieces' and piece not in d['anatomy'] and not (piece == 'container' and 'container' in d['anatomy']):
                problems.append(f'{name}: pieces.{piece} not in anatomy')
            for state, paint in pmap.items():
                for s in state.split('+'):
                    if s not in single: problems.append(f'{name}: {group}.{piece}: state {s} not listed')
                paint_ok(paint, f'{name}: {group}.{piece}.{state}')
    # the paint keys the resolver would emit: <part>.<variant>.<state>.<piece>
    rings = {k: v['effect'].get('piece', 'container') for k, v in d['states'].items() if 'ring' in v.get('effect', {})}
    if d.get('variants'):
        shared = d.get('pieces', {}).get('container', {})
        for v, pmap in d['variants'].items():
            for s in set(pmap) | set(shared) | {k for k, p in rings.items() if p == 'container'}:
                paints.add(f"{d['id']}.{v}.{s}.container")
    for piece, pmap in d.get('pieces', {}).items():
        if d.get('variants') and piece == 'container': continue
        for s in set(pmap) | {k for k, p in rings.items() if p == piece}:
            paints.add(f"{d['id']}.base.{s}.{piece}")
    for k, v in d.get('sizes', {}).items():
        for key, val in v.items():
            if key == 'text': text_ok(val, f'{name}: sizes.{k}.text')
            elif key == 'radius': radius_ok(val, f'{name}: sizes.{k}.radius')
            elif key not in ('note', 'radiusMax', 'textBelowMd'): length_ok(val, f'{name}: sizes.{k}.{key}')
    for k, v in d.get('layout', {}).items():
        val = v['value'] if isinstance(v, dict) and 'value' in v else v
        length_ok(val, f'{name}: layout.{k}')
    summary[str(name)] = {'states': len(d['states']), 'paints': len(paints), 'keys': len(d['keyboard']), 'words': len(d['words'])}

total = sum(v['paints'] for v in summary.values())
print(json.dumps(summary))
print(f'paints per theme and scheme: {total}; for 13 themes x 2 schemes: {total * 26}')
spec = json.load(open(ROOT / 'specimens.json'))
print('specimens:', len(spec['specimens']), 'entries;', len({s['id'] for s in spec['specimens']}), 'story paths')
print('problems:', len(problems))
for p in problems: print(' -', p)
sys.exit(1 if problems else 0)
