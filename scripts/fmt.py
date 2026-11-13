"""Format JSON with 4-space indents, keeping an object or array on one line when it fits in WIDTH columns."""
import json, sys
WIDTH = 120
def one(v): return json.dumps(v, ensure_ascii=False, separators=(', ', ': '))
def fmt(v, indent, lead):
    flat = one(v)
    if not isinstance(v, (dict, list)) or len(v) == 0 or indent + lead + len(flat) <= WIDTH:
        return flat
    pad = ' ' * (indent + 4)
    if isinstance(v, dict):
        items = [f'{pad}{json.dumps(k, ensure_ascii=False)}: {fmt(x, indent + 4, len(json.dumps(k, ensure_ascii=False)) + 2)}' for k, x in v.items()]
        return '{\n' + ',\n'.join(items) + '\n' + ' ' * indent + '}'
    items = [f'{pad}{fmt(x, indent + 4, 0)}' for x in v]
    return '[\n' + ',\n'.join(items) + '\n' + ' ' * indent + ']'
for path in sys.argv[1:]:
    data = json.load(open(path))
    out = fmt(data, 0, 0) + '\n'
    assert json.loads(out) == data
    open(path, 'w').write(out)
    print(path, len(out.splitlines()), 'lines')
