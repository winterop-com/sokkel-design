"""Vendor the Nerd Font codepoints glyphs.json may name: the codicons (`nf-cod-*`) from Nerd Fonts' published glyphnames.json at a release tag, into vendor/nerd-fonts.json, which check.py holds every icon's `nerdFont` and `nerdFontName` to.

    python3 scripts/nerd-fonts.py v3.5.1    fetch that release's glyphnames.json and write the vendored copy
"""
import json, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
tag = sys.argv[1] if len(sys.argv) > 1 else json.load(open(ROOT / 'vendor' / 'nerd-fonts.json'))['tag']
url = f'https://raw.githubusercontent.com/ryanoasis/nerd-fonts/{tag}/glyphnames.json'
names = json.load(urllib.request.urlopen(url, timeout=60))
codicons = {f'nf-{name}': 'U+' + entry['code'].upper() for name, entry in sorted(names.items()) if name.startswith('cod-')}
out = {
    '$description': 'The codicons of Nerd Fonts, by name and codepoint, from glyphnames.json at the tag below; check.py holds each icon in glyphs.json to it. Refresh with python3 scripts/nerd-fonts.py <tag>.',
    'source': url,
    'tag': tag,
    'version': names['METADATA']['version'],
    'codepoints': codicons,
}
(ROOT / 'vendor' / 'nerd-fonts.json').write_text(json.dumps(out, indent=4, ensure_ascii=False) + '\n')
print(f'vendor/nerd-fonts.json: {len(codicons)} codicons from Nerd Fonts {tag}')
