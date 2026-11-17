/**
 * Build the contract's documentation site into _site/: the home page, the principles, specimens,
 * open questions and changelog from their Markdown, every token of every theme, the cell grid with
 * its color depths, text roles and glyphs, and a page per part and pattern that index.json lists,
 * drawn from its spec and its resolved paints, with each renderer's state.
 *
 *   bun scripts/site.ts            write _site/
 *
 * Everything comes from the files here; a part added to index.json gets its page with no change to
 * this script. The pages need nothing from the network: their style and script are in _site/assets/.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'

import { lookup, textSpec, view, type PageData, type Paint, type TextRole } from '../site/shared.ts'

const ROOT = join(import.meta.dir, '..')
const OUT = join(ROOT, '_site')
const REPO = `https://github.com/${process.env.GITHUB_REPOSITORY ?? 'winterop-com/sokkel-design'}`
const STORYBOOK = 'https://winterop-com.github.io/sokkel-ui/'
const EXAMPLES = 'https://winterop-com.github.io/sokkel-ui/examples/'

type Json = Record<string, unknown>
type Entry = { id: string; file: string; status: string }
type Renderer = { id: string; repo: string; toolkit: string; reads: string }
type RendererState = { state: 'missing' | 'partial' | 'built'; as_of: string; note?: string }
type Glyph = { unicode: string | string[]; ascii: string | string[]; means?: string; frame?: string }
type Icon = { nerdFont: string; nerdFontName: string; unicode: string; ascii: string; note?: string }
type Glyphs = { $description: string; rules: string[]; glyphs: Record<string, Glyph>; box: Record<string, Record<string, string> | string>; icons: Record<string, Icon | string> }
type Index = {
    version: string
    renderers: Renderer[]
    cells: Json & {
        $description: string
        pxPerColumn: number
        breakpoints: Record<string, { token: string; columns: number; means: string }>
        checkSizes: { columns: number; rows: number; means: string }[]
        rules: string[]
        textRoles: Record<string, { bold: boolean; italic: boolean; ink: string } | string>
    }
    colorDepth: Record<string, unknown>
    themes: { base: string }
    densities: string[]
    parts: Entry[]
    patterns: Entry[]
    checkWidths?: Record<string, number | number[]>
    breakpoints?: Record<string, { token: string; px: number; means: string }>
}
type Theme = {
    label: string
    description: string
    light: Scheme
    dark: Scheme
}
type Scheme = {
    colors: Record<string, string>
    lengths: Record<string, number>
    numbers: Record<string, number>
    ems: Record<string, number>
    durations: Record<string, number>
    easings: Record<string, number[]>
    elevations: Record<string, unknown>
    words: Record<string, string>
    text: Record<string, TextRole>
}
type Resolved = {
    sokkelUi: { commit: string; repo: string }
    default: { theme: string; density: string }
    themes: Record<string, Theme>
    density: Record<string, Record<string, number>>
    paints: Record<string, Record<string, Record<string, Paint>>>
    paintSources: Record<string, Record<string, Record<string, unknown>>>
}
type Specimen = { id: string; part: string; new?: boolean }

const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')
const readJson = <T>(path: string) => JSON.parse(read(path)) as T

const index = readJson<Index>('index.json')
const resolved = readJson<Resolved>('tokens/tokens.resolved.json')
const specimens = existsSync(join(ROOT, 'specimens.json')) ? readJson<{ specimens: Specimen[] }>('specimens.json').specimens : []
const pin = readJson<{ repo: string; commit: string }>('sokkel-ui.json')
const glyphs = readJson<Glyphs>('glyphs.json')
const BASE = index.themes.base in resolved.themes ? index.themes.base : Object.keys(resolved.themes)[0]
const THEMES = [BASE, ...Object.keys(resolved.themes).filter((t) => t !== BASE)]
const SCHEMES = ['light', 'dark'] as const
const entries = [...index.parts.map((e) => ({ ...e, kind: 'part' })), ...(index.patterns ?? []).map((e) => ({ ...e, kind: 'pattern' }))]

// ---------------------------------------------------------------------------------------------------
// Small helpers

const esc = (s: unknown) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** `code` spans in a sentence, as the specs write them. */
const prose = (s: unknown) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')

const title = (id: string) => {
    const words = id.replace(/-/g, ' ')
    return words.charAt(0).toUpperCase() + words.slice(1)
}

/** The first sentence of a summary, for a list. */
const firstSentence = (s: string) => {
    const m = s.match(/^.*?[.:](\s|$)/)
    return (m ? m[0] : s).replace(/[:]\s*$/, '.').trim()
}

/** Storybook's id for a story path: the title and the story's name, each kebab-cased. */
export function storyId(path: string): string {
    const cut = path.lastIndexOf('/')
    const sanitize = (s: string) =>
        s
            .toLowerCase()
            .replace(/[^a-z0-9\u00c0-\uffff]+/g, '-')
            .replace(/^-+|-+$/g, '')
    return `${sanitize(path.slice(0, cut))}--${sanitize(path.slice(cut + 1))}`
}
const storyUrl = (path: string) => `${STORYBOOK}?path=/story/${storyId(path)}`

function styleAttr(style: Record<string, string>) {
    const s = Object.entries(style)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ')
    return s ? ` style="${esc(s)}"` : ''
}

/** An element that shows a value, drawn here for the base theme and again by the page's script. */
function shown(data: PageData, path: string, as: string, opts: { tag?: string; cls?: string; inner?: string } = {}) {
    const v = view(as, lookup(data, BASE, 'light', path))
    const tag = opts.tag ?? 'span'
    const cls = `shown ${as}${opts.cls ? ` ${opts.cls}` : ''}`
    if (v.on === 'self') {
        return `<${tag} class="${cls}" data-v="${esc(path)}" data-as="${as}"${styleAttr(v.style)}>${opts.inner ?? esc(v.text)}</${tag}>`
    }
    const mark = opts.inner ?? ''
    return `<${tag} class="${cls}" data-v="${esc(path)}" data-as="${as}"><i class="mark"${styleAttr(v.style)}>${mark}</i><span class="val">${esc(v.text)}</span></${tag}>`
}

function table(head: string[], rows: string[][], cls = '') {
    if (!rows.length) return ''
    const th = head.map((h) => `<th>${h}</th>`).join('')
    const labels = head.map((h) => esc(h.replace(/<[^>]+>/g, '')))
    const body = rows.map((r) => `<tr>${r.map((c, i) => `<td data-label="${labels[i] ?? ''}">${c}</td>`).join('')}</tr>`).join('\n')
    return `<div class="tw"><table class="${cls}"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table></div>`
}

const slug = (s: string) =>
    s
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/&[a-z]+;/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

// ---------------------------------------------------------------------------------------------------
// Markdown

/** Where a repository path is on the site, or on GitHub when the site has no page for it. */
function linkFor(repoPath: string, depth: number): string {
    const up = '../'.repeat(depth)
    const [path, hash] = repoPath.split('#')
    const anchor = hash ? `#${hash}` : ''
    const pages: Record<string, string> = {
        'README.md': 'index.html',
        'principles.md': 'principles.html',
        'specimens.md': 'specimens.html',
        'specimens.json': 'specimens.html',
        'open-questions.md': 'open-questions.html',
        'CHANGELOG.md': 'changelog.html',
        'index.json': 'parts/index.html',
        'tokens/tokens.resolved.json': 'tokens.html',
    }
    if (pages[path]) return up + pages[path] + anchor
    const m = path.match(/^(parts|patterns)\/([a-z0-9-]+)\.(md|json)$/)
    if (m && entries.some((e) => e.id === m[2])) return `${up}${m[1]}/${m[2]}.html${anchor}`
    return `${REPO}/blob/main/${path}${anchor}`
}

/** Markdown to HTML with bun's renderer, links moved to the site's pages, headings given ids. */
function markdown(src: string, fileDir: string, depth: number, idPrefix = ''): string {
    let html = Bun.markdown.html(src)
    html = html.replace(/href="([^"]+)"/g, (all, href: string) => {
        if (/^(https?:|mailto:|#)/.test(href)) return all
        return `href="${esc(linkFor(posix.normalize(posix.join(fileDir, href)), depth))}"`
    })
    const seen = new Set<string>()
    html = html.replace(/<h([2-4])>(.*?)<\/h\1>/g, (_all, n: string, inner: string) => {
        let id = idPrefix + (slug(inner) || 'section')
        while (seen.has(id)) id += '-'
        seen.add(id)
        return `<h${n} id="${id}"><a class="anchor" href="#${id}">${inner}</a></h${n}>`
    })
    // Story paths in a table cell become links to their story.
    const known = new Set(specimens.filter((s) => !s.new).map((s) => s.id))
    html = html.replace(/<td>([^<]+?)<\/td>/g, (all, text: string) =>
        known.has(text) ? `<td><a href="${esc(storyUrl(text))}">${text}</a></td>` : all,
    )
    return html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>')
}

// ---------------------------------------------------------------------------------------------------
// The theme stylesheet: the colors, faces, corners and shadows the site itself wears, per theme

const CHROME_COLORS = [
    'background', 'foreground', 'card', 'card-foreground', 'muted', 'muted-foreground', 'border', 'border-strong',
    'primary', 'primary-foreground', 'primary-ink', 'accent', 'accent-foreground', 'hover', 'ring', 'popover',
    'popover-foreground', 'sidebar', 'sidebar-foreground', 'sidebar-border', 'sidebar-accent', 'sidebar-accent-foreground',
    'faint', 'field', 'input', 'good', 'good-ink', 'warning', 'warning-ink', 'critical', 'critical-ink', 'info', 'info-ink',
    'table-head-ground', 'table-head-ink', 'table-head-line', 'table-zebra', 'page-title-ink', 'section-head-ink', 'shade',
]

function themeVars(s: Scheme): string {
    const lines = CHROME_COLORS.filter((c) => s.colors[c]).map((c) => `--${c}: ${s.colors[c]};`)
    for (const w of ['typeface-sans', 'typeface-mono']) if (s.words[w]) lines.push(`--${w}: ${s.words[w]};`)
    for (const l of ['radius-control', 'radius-surface', 'radius-chip']) if (s.lengths[l] !== undefined) lines.push(`--${l}: ${s.lengths[l]}px;`)
    for (const [k, v] of Object.entries(s.elevations)) lines.push(`--${k}: ${view('shadow', v).style['box-shadow']};`)
    for (const [k, t] of Object.entries(s.text)) {
        lines.push(`--text-${k}: ${t.weight} ${t.size}px/${t.lineHeight}px var(--typeface-sans);`, `--text-${k}-tracking: ${t.tracking}em;`)
    }
    return lines.join(' ')
}

function themeCss(): string {
    const out: string[] = []
    for (const t of THEMES) {
        const th = resolved.themes[t]
        const sel = t === BASE ? `:root, :root[data-theme='${t}']` : `:root[data-theme='${t}']`
        out.push(`${sel} { color-scheme: light; ${themeVars(th.light)} }`)
    }
    out.push('@media (prefers-color-scheme: dark) {')
    for (const t of THEMES) {
        const sel = t === BASE ? `:root:not([data-scheme='light']):not([data-theme]), ` : ''
        out.push(`${sel}:root[data-theme='${t}']:not([data-scheme='light']) { color-scheme: dark; ${themeVars(resolved.themes[t].dark)} }`)
    }
    out.push('}')
    for (const t of THEMES) {
        const sel = t === BASE ? `:root[data-scheme='dark']:not([data-theme]), ` : ''
        out.push(`${sel}:root[data-theme='${t}'][data-scheme='dark'] { color-scheme: dark; ${themeVars(resolved.themes[t].dark)} }`)
    }
    return `${out.join('\n')}\n`
}

// ---------------------------------------------------------------------------------------------------
// The page frame

const NAV: [string, string][] = [
    ['index.html', 'Home'],
    ['principles.html', 'Principles'],
    ['tokens.html', 'Tokens'],
    ['parts/index.html', 'Parts'],
    ['cells.html', 'Cells'],
    ['specimens.html', 'Specimens'],
    ['open-questions.html', 'Open questions'],
    ['changelog.html', 'Changelog'],
]

function page(opts: { path: string; title: string; body: string; data?: PageData; wide?: boolean; nav?: string }) {
    const depth = opts.path.split('/').length - 1
    const up = '../'.repeat(depth)
    const navKey = opts.nav ?? opts.path
    const nav = NAV.map(
        ([href, label]) => `<a href="${up}${href}"${href === navKey ? ' aria-current="page"' : ''}>${label}</a>`,
    ).join('')
    const themeOptions = THEMES.map((t) => `<option value="${t}">${esc(resolved.themes[t].label)}</option>`).join('')
    const known = JSON.stringify(THEMES)
    const boot = `try{var r=document.documentElement,t=localStorage.getItem('sokkel-design-theme'),s=localStorage.getItem('sokkel-design-scheme');if(t&&${known}.indexOf(t)>=0)r.dataset.theme=t;if(s==='light'||s==='dark')r.dataset.scheme=s}catch(e){}`
    const data = opts.data ? `<script id="page-data" type="application/json">${JSON.stringify(prune(opts.data, opts.body)).replace(/</g, '\\u003c')}</script>` : ''
    const docTitle = opts.title === 'sokkel-design' ? 'sokkel-design' : `${opts.title} · sokkel-design`
    return `<!doctype html>
<html lang="en" data-theme="${BASE}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(docTitle)}</title>
<meta name="description" content="sokkel-design: the tokens, rules and part specs every sokkel renderer implements.">
<link rel="icon" href="${up}assets/mark.svg" type="image/svg+xml">
<script>${boot}</script>
<link rel="stylesheet" href="${up}assets/themes.css">
<link rel="stylesheet" href="${up}assets/site.css">
</head>
<body>
<header class="top">
<div class="bar">
<a class="brand" href="${up}index.html"><img src="${up}assets/mark.svg" alt="" width="20" height="20"><span>sokkel-design</span><span class="ver">${esc(index.version)}</span></a>
<div class="switches">
<label class="theme-pick"><span class="sr">Theme</span><select data-switch="theme" aria-label="Theme">${themeOptions}</select></label>
<div class="seg" role="group" aria-label="Scheme"><button type="button" data-scheme-pick="" aria-pressed="true">Auto</button><button type="button" data-scheme-pick="light" aria-pressed="false">Light</button><button type="button" data-scheme-pick="dark" aria-pressed="false">Dark</button></div>
</div>
</div>
<nav class="nav" aria-label="Sections">${nav}</nav>
</header>
<main>
${opts.body}
</main>
<footer class="foot"><span>sokkel-design ${esc(index.version)}</span><a href="${REPO}">Repository</a><a href="${REPO}/releases/latest">Latest release</a><a href="${STORYBOOK}">sokkel-ui Storybook</a></footer>
${data}
<script src="${up}assets/site.js" defer></script>
</body>
</html>
`
}

/** Keep only the values the page shows. */
function prune(data: PageData, body: string): PageData {
    const used = new Set([...body.matchAll(/data-v="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&').split('|')[0]))
    const keep = (map: Record<string, unknown>, prefix: string) =>
        Object.fromEntries(Object.entries(map).filter(([k]) => used.has(prefix + k)))
    const themes: PageData['themes'] = {}
    for (const [t, schemes] of Object.entries(data.themes)) {
        themes[t] = Object.fromEntries(Object.entries(schemes).map(([s, map]) => [s, keep(map, '')]))
    }
    const schemes = data.schemes && Object.fromEntries(Object.entries(data.schemes).map(([s, map]) => [s, keep(map, 's:')]))
    return { themes, ...(schemes ? { schemes } : {}) }
}

function write(path: string, html: string) {
    const file = join(OUT, path)
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html)
}

// ---------------------------------------------------------------------------------------------------
// Pages from Markdown

function markdownPage(file: string, path: string, pageTitle: string) {
    if (!existsSync(join(ROOT, file))) return
    const body = `<article class="prose">${markdown(read(file), posix.dirname(file), path.split('/').length - 1)}</article>`
    write(path, page({ path, title: pageTitle, body }))
}

// ---------------------------------------------------------------------------------------------------
// Home

function home() {
    const readme = read('README.md')
    const cut = readme.search(/^## /m)
    const intro = cut > 0 ? readme.slice(0, cut) : readme
    const rest = cut > 0 ? readme.slice(cut) : ''
    const introHtml = markdown(intro.replace(/^# .*\n/, ''), '.', 0)
    const commit = pin.commit.slice(0, 7)
    const counts = `${index.parts.length} parts, ${(index.patterns ?? []).length} ${(index.patterns ?? []).length === 1 ? 'pattern' : 'patterns'}, ${THEMES.length} themes`
    const cards: [string, string, string][] = [
        ['principles.html', 'Principles', 'The rules every renderer keeps, whatever its toolkit.'],
        ['tokens.html', 'Tokens', 'Every theme in light and dark: colors, type, spacing, corners, elevations, motion.'],
        ['parts/index.html', 'Parts and patterns', 'One spec per part: anatomy, options, sizes, states, paints, keys and words, and how far each renderer has built it.'],
        ['cells.html', 'Cells', 'For a renderer in a terminal: the grid in columns, color depths, text roles and glyphs.'],
        ['specimens.html', 'Specimens', 'The story paths both renderers draw, compared by eye.'],
        ['open-questions.html', 'Open questions', 'The decisions taken and the findings that still need a call.'],
        ['changelog.html', 'Changelog', 'What each contract version changed, part by part.'],
    ]
    const body = `
<section class="hero">
<p class="eyebrow">The design contract</p>
<h1>sokkel-design</h1>
<div class="lede prose">${introHtml}</div>
<dl class="facts">
<div><dt>Contract version</dt><dd><a href="${REPO}/releases/tag/v${esc(index.version)}">${esc(index.version)}</a></dd></div>
<div><dt>Tokens from</dt><dd>sokkel-ui at <a href="${esc(pin.repo)}/commit/${esc(pin.commit)}"><code>${commit}</code></a></dd></div>
<div><dt>Covers</dt><dd>${counts}</dd></div>
</dl>
<div class="links">
<a class="button primary" href="${REPO}">Repository</a>
<a class="button" href="${REPO}/releases/latest">Latest release</a>
<a class="button" href="${STORYBOOK}">sokkel-ui Storybook</a>
<a class="button" href="${EXAMPLES}">sokkel-ui examples</a>
</div>
</section>
<section class="cards">
${cards.map(([href, h, p]) => `<a class="card" href="${href}"><strong>${h}</strong><span>${p}</span></a>`).join('\n')}
</section>
<article class="prose">${markdown(rest, '.', 0)}</article>`
    write('index.html', page({ path: 'index.html', title: 'sokkel-design', body }))
}

// ---------------------------------------------------------------------------------------------------
// Tokens

/** Colors grouped by their first word where three or more share it; the rest are the core colors. */
function colorGroups(names: string[]): [string, string[]][] {
    const by = new Map<string, string[]>()
    for (const n of names) {
        const head = n.split('-')[0]
        by.set(head, [...(by.get(head) ?? []), n])
    }
    const core: string[] = []
    const groups: [string, string[]][] = []
    for (const [head, list] of by) {
        if (list.length >= 3) groups.push([head, list])
        else core.push(...list)
    }
    return [['core', core], ...groups]
}

function tokensPage() {
    const data: PageData = { themes: {} }
    for (const t of THEMES) {
        data.themes[t] = {}
        for (const s of SCHEMES) {
            const sc = resolved.themes[t][s]
            const flat: Record<string, unknown> = { 'meta.label': resolved.themes[t].label, 'meta.description': resolved.themes[t].description }
            for (const [group, values] of Object.entries(sc)) {
                for (const [k, v] of Object.entries(values as Json)) flat[`${group}.${k}`] = v
            }
            for (const name of ['background', 'foreground', 'primary', 'chart-3', 'border']) flat[`swatch.${t}.${name}`] = sc.colors[name]
            data.themes[t][s] = flat
        }
    }
    // The theme strip shows every theme's own colors, whichever theme the page wears.
    for (const t of THEMES) {
        for (const s of SCHEMES) {
            for (const other of THEMES) {
                for (const name of ['background', 'foreground', 'primary', 'chart-3', 'border']) {
                    data.themes[t][s][`swatch.${other}.${name}`] = resolved.themes[other][s].colors[name]
                }
            }
        }
    }
    const base = resolved.themes[BASE].light
    const themeCards = THEMES.map((t) => {
        const dots = ['background', 'foreground', 'primary', 'chart-3']
            .map((n) => shown(data, `swatch.${t}.${n}`, 'swatch', { cls: 'dot' }))
            .join('')
        return `<button type="button" class="theme-card" data-theme-pick="${t}" aria-pressed="${t === BASE}"><span class="dots">${dots}</span><strong>${esc(resolved.themes[t].label)}</strong><span>${esc(resolved.themes[t].description)}</span></button>`
    }).join('\n')

    const colors = colorGroups(Object.keys(base.colors))
        .map(([group, names]) => {
            const items = names
                .map((n) => `<li>${shown(data, `colors.${n}`, 'swatch', { cls: 'sw' })}<code class="name">${esc(n)}</code></li>`)
                .join('')
            return `<h3 id="colors-${group}">${title(group)}</h3><ul class="swatches">${items}</ul>`
        })
        .join('\n')

    const sample = 'Nightly export finished in 4 minutes'
    const text = Object.keys(base.text)
        .map(
            (role) =>
                `<li><div class="role-name"><code>text.${esc(role)}</code>${shown(data, `text.${role}`, 'textspec')}</div>${shown(data, `text.${role}`, 'text', { cls: 'type-sample', inner: sample, tag: 'div' })}</li>`,
        )
        .join('')

    const lengthNames = Object.keys(base.lengths)
    const radii = lengthNames.filter((n) => n === 'radius' || n.startsWith('radius-') || n.endsWith('-radius'))
    const spacing = lengthNames.filter((n) => n.startsWith('spacing-'))
    const otherLengths = lengthNames.filter((n) => !radii.includes(n) && !spacing.includes(n))
    const radiusHtml = radii
        .map((n) => `<li>${shown(data, `lengths.${n}`, 'radius', { cls: 'corner' })}<code class="name">${esc(n)}</code></li>`)
        .join('')
    const spacingRows = spacing.map((n) => [`<code>${esc(n)}</code>`, shown(data, `lengths.${n}`, 'bar', { cls: 'measure' })])
    const densityNames = Object.keys(resolved.density[index.densities[0]] ?? {})
    const densityRows = densityNames.map((n) => [
        `<code>density.${esc(n)}</code>`,
        ...index.densities.map((d) => {
            const v = resolved.density[d][n]
            return `<span class="shown bar measure"><i class="mark" style="width: ${Math.min(v, 320)}px"></i><span class="val">${v}</span></span>`
        }),
    ])
    const otherRows = otherLengths.map((n) => [`<code>${esc(n)}</code>`, shown(data, `lengths.${n}`, 'num')])
    const elevations = Object.keys(base.elevations)
        .map((n) => `<li>${shown(data, `elevations.${n}`, 'shadow', { cls: 'lift', tag: 'div' })}<code class="name">${esc(n)}</code></li>`)
        .join('')
    const motionRows = [
        ...Object.keys(base.durations).map((n) => [`<code>${esc(n)}</code>`, shown(data, `durations.${n}`, 'ms')]),
        ...Object.keys(base.easings).map((n) => [`<code>${esc(n)}</code>`, shown(data, `easings.${n}`, 'ease')]),
    ]
    const numberRows = [
        ...Object.keys(base.numbers).map((n) => [`<code>${esc(n)}</code>`, shown(data, `numbers.${n}`, 'num')]),
        ...Object.keys(base.ems).map((n) => [`<code>${esc(n)}</code>`, `${shown(data, `ems.${n}`, 'num')} em`]),
    ]
    const wordRows = Object.keys(base.words).map((n) => [
        `<code>${esc(n)}</code>`,
        n.startsWith('typeface-') ? shown(data, `words.${n}`, 'font', { cls: 'face', inner: 'Aa' }) : shown(data, `words.${n}`, 'word'),
    ])
    const widths = index.checkWidths
        ? table(
              ['Form factor', 'Widths'],
              Object.entries(index.checkWidths).map(([k, v]) => [esc(k), esc(Array.isArray(v) ? v.join(', ') : v)]),
          )
        : ''
    const breakpoints = index.breakpoints
        ? table(
              ['Breakpoint', 'Token', 'Width', 'Means'],
              Object.entries(index.breakpoints).map(([k, b]) => [`<code>${esc(k)}</code>`, `<code>${esc(b.token)}</code>`, `${b.px}`, prose(b.means)]),
          )
        : ''

    const sections: [string, string, string][] = [
        ['themes', 'Themes', `<div class="theme-grid">${themeCards}</div>`],
        ['colors', 'Colors', colors],
        ['type', 'Type roles', `<ul class="type-list">${text}</ul>`],
        [
            'spacing',
            'Spacing and density',
            `${table(['Token', 'px'], spacingRows, 'measures')}<h3 id="density">Density</h3>${table(['Length', ...index.densities.map(title)], densityRows, 'measures')}`,
        ],
        ['radii', 'Corners', `<ul class="corners">${radiusHtml}</ul>`],
        ['elevations', 'Elevations', `<ul class="lifts">${elevations}</ul>`],
        ['motion', 'Motion', table(['Token', 'Value'], motionRows)],
        ['lengths', 'Other lengths', table(['Token', 'px'], otherRows)],
        ['numbers', 'Numbers', table(['Token', 'Value'], numberRows)],
        ['words', 'Faces and words', table(['Token', 'Value'], wordRows)],
        ['breakpoints', 'Breakpoints and widths', breakpoints + widths],
    ]
    const toc = sections.map(([id, h]) => `<a href="#${id}">${h}</a>`).join('')
    const body = `
<header class="page-head">
<p class="eyebrow">Foundations</p>
<h1>Tokens</h1>
<p class="lede">Every value from <code>tokens/tokens.resolved.json</code>: colors as sRGB hex, lengths in px, durations in ms. Showing <strong data-v="meta.label" data-as="word" class="shown word"><i class="mark"></i><span class="val">${esc(resolved.themes[BASE].label)}</span></strong> in <strong data-shows-scheme>light</strong>; pick a theme below or in the bar, and a scheme in the bar.</p>
<nav class="toc" aria-label="On this page">${toc}</nav>
</header>
${sections.map(([id, h, html]) => `<section class="block" id="${id}"><h2><a class="anchor" href="#${id}">${h}</a></h2>${html}</section>`).join('\n')}`
    write('tokens.html', page({ path: 'tokens.html', title: 'Tokens', body, data, wide: true }))
}

// ---------------------------------------------------------------------------------------------------
// Parts and patterns

function statusBadge(status: string) {
    return `<span class="badge ${esc(status)}">${esc(status)}</span>`
}

/** A renderer's state for a part, as a badge that links to the commit it was read at. */
function rendererBadge(renderer: Renderer, state: RendererState | undefined): string {
    if (state === undefined) return '<span class="quiet">-</span>'
    const cls = state.state === 'built' ? 'stable' : state.state === 'partial' ? 'partial' : 'missing'
    const title = `${renderer.id}: ${state.state} as of ${state.as_of}${state.note ? `. ${state.note}` : ''}`
    return `<a class="badge ${cls}" href="https://github.com/${esc(renderer.repo)}/commit/${esc(state.as_of)}" title="${esc(title)}">${esc(state.state)}</a>`
}

function partsIndex() {
    const rows = (list: typeof entries) =>
        list.map((e) => {
            const spec = readJson<Json>(e.file)
            const states = (spec.renderers ?? {}) as Record<string, RendererState>
            return [
                `<a href="../${e.kind}s/${e.id}.html"><strong>${esc(title(e.id))}</strong></a>`,
                statusBadge(e.status),
                ...index.renderers.map((r) => rendererBadge(r, states[r.id])),
                prose(firstSentence(String(spec.summary ?? ''))),
            ]
        })
    const parts = entries.filter((e) => e.kind === 'part')
    const patterns = entries.filter((e) => e.kind === 'pattern')
    const head = (what: string) => [what, 'Status', ...index.renderers.map((r) => esc(r.id)), 'What it is']
    const body = `
<header class="page-head">
<p class="eyebrow">Specs</p>
<h1>Parts and patterns</h1>
<p class="lede">Each part has one spec: its anatomy, options, sizes per density, states, paints per state, keys and words. <strong>Stable</strong>: as it landed in sokkel-ui, or drawn from its spec and compared side by side. <strong>Draft</strong>: it may still change shape. Each renderer says how far it has built the part (<strong>built</strong>, <strong>partial</strong> or <strong>missing</strong>), as of a commit of its own repository.</p>
</header>
<section class="block"><h2>Parts</h2>${table(head('Part'), rows(parts), 'index stack')}</section>
${patterns.length ? `<section class="block"><h2>Patterns</h2>${table(head('Pattern'), rows(patterns), 'index stack')}</section>` : ''}`
    write('parts/index.html', page({ path: 'parts/index.html', title: 'Parts and patterns', body, wide: true }))
}

// ---------------------------------------------------------------------------------------------------
// Cells

const form = (v: string | string[]) => (Array.isArray(v) ? v.map((x) => `<code>${esc(x)}</code>`).join(' ') : `<code>${esc(v)}</code>`)

function cellsPage() {
    const cells = index.cells
    const roles = Object.entries(cells.textRoles).filter(([k]) => !k.startsWith('$')) as [string, { bold: boolean; italic: boolean; ink: string }][]
    const depth = index.colorDepth as Record<string, unknown>
    const ansi = (depth.ansi16 ?? {}) as { means?: string; tokens?: string[] }
    const data: PageData = { themes: {} }
    for (const t of THEMES) {
        data.themes[t] = {}
        for (const s of SCHEMES) data.themes[t][s] = Object.fromEntries((ansi.tokens ?? []).map((n) => [`colors.${n}`, resolved.themes[t][s].colors[n]]))
    }
    const box = Object.entries(glyphs.box).filter(([k]) => !k.startsWith('$')) as [string, Record<string, string>][]
    const icons = Object.entries(glyphs.icons).filter(([k]) => !k.startsWith('$')) as [string, Icon][]
    const body = `
<header class="page-head">
<p class="eyebrow">Foundations</p>
<h1>Cells</h1>
<p class="lede">${prose(cells.$description)}</p>
</header>
<section class="block" id="grid"><h2>The grid</h2>
<p>A column stands for <strong>${esc(cells.pxPerColumn)}</strong> px.</p>
${table(['Breakpoint', 'Token', 'Columns', 'Means'], Object.entries(cells.breakpoints).map(([k, b]) => [`<code>${esc(k)}</code>`, `<code>${esc(b.token)}</code>`, String(b.columns), prose(b.means)]), 'stack')}
<h3>Check sizes</h3>
${table(['Columns by rows', 'Means'], cells.checkSizes.map((c) => [`<code>${c.columns}x${c.rows}</code>`, prose(c.means)]), 'stack')}
<h3>Rules</h3><ul>${cells.rules.map((r) => `<li>${prose(r)}</li>`).join('')}</ul>
</section>
<section class="block" id="color-depth"><h2>Color depth</h2>
<dl class="defs">${['truecolor', 'ansi256', 'none'].filter((k) => typeof depth[k] === 'string').map((k) => `<div><dt><code>${k}</code></dt><dd>${prose(depth[k])}</dd></div>`).join('')}</dl>
<h3>Sixteen colors</h3><p>${prose(ansi.means ?? '')}</p>
${table(['Index', 'Token', 'Color'], (ansi.tokens ?? []).map((n, i) => [String(i), `<code>${esc(n)}</code>`, shown(data, `colors.${n}`, 'swatch', { cls: 'sw' })]), 'stack')}
</section>
<section class="block" id="text-roles"><h2>Text roles</h2><p>${prose(String(cells.textRoles.$description ?? ''))}</p>
${table(['Role', 'Bold', 'Italic', 'Ink'], roles.map(([k, r]) => [`<code>text.${esc(k)}</code>`, r.bold ? 'bold' : '<span class="quiet">no</span>', r.italic ? 'italic' : '<span class="quiet">no</span>', r.ink === 'piece' ? '<span class="quiet">the piece&#39;s</span>' : `<code>${esc(r.ink)}</code>`]), 'stack')}
</section>
<section class="block" id="glyphs"><h2>Glyphs</h2><p>${prose(glyphs.$description)}</p>
<ul>${glyphs.rules.map((r) => `<li>${prose(r)}</li>`).join('')}</ul>
${table(['Glyph', 'Unicode', 'ASCII', 'Means'], Object.entries(glyphs.glyphs).map(([k, g]) => [`<code>${esc(k)}</code>`, form(g.unicode), form(g.ascii), `${prose(g.means ?? '')}${g.frame ? `<div class="note">a frame each <code>${esc(g.frame)}</code></div>` : ''}`]), 'stack')}
<h3>Box</h3><p>${prose(String(glyphs.box.$description ?? ''))}</p>
${table(['Form', ...Object.keys(box[0]?.[1] ?? {}).map(esc)], box.map(([k, b]) => [`<code>${esc(k)}</code>`, ...Object.values(b).map((x) => `<code>${esc(x)}</code>`)]), 'stack')}
<h3>Icons</h3><p>${prose(String(glyphs.icons.$description ?? ''))}</p>
${table(['Icon', 'Nerd Font', 'Unicode', 'ASCII'], icons.map(([k, i]) => [`<code>${esc(k)}</code>`, `<code>${esc(i.nerdFont)}</code> <span class="quiet">${esc(i.nerdFontName)}</span>`, form(i.unicode), `${form(i.ascii)}${i.note ? `<div class="note">${prose(i.note)}</div>` : ''}`]), 'stack')}
</section>`
    write('cells.html', page({ path: 'cells.html', title: 'Cells', body, data, wide: true }))
}

/** A value from a spec, with what it resolves to beside it where a token names it. */
function ref(v: unknown, data: PageData): string {
    if (typeof v === 'number') return `${v}`
    if (v === null) return '<span class="quiet">none</span>'
    if (typeof v === 'string') {
        const base = resolved.themes[BASE].light
        if (v.startsWith('density.')) {
            const n = v.slice(8)
            const per = index.densities.map((d) => resolved.density[d]?.[n]).filter((x) => x !== undefined)
            return per.length ? `<code>${esc(v)}</code> <span class="quiet">${per.join(' / ')}</span>` : `<code>${esc(v)}</code>`
        }
        if (v.startsWith('text.') && base.text[v.slice(5)]) return `<code>${esc(v)}</code> ${shown(data, v, 'textspec', { cls: 'quiet' })}`
        if (/^(below|from) /.test(v)) {
            const [w, tok] = v.split(' ')
            return `${w} ${ref(tok, data)}`
        }
        for (const group of ['lengths', 'numbers', 'durations'] as const) {
            if (base[group][v] !== undefined) {
                return `<code>${esc(v)}</code> ${shown(data, `${group}.${v}`, group === 'durations' ? 'ms' : 'num', { cls: 'quiet' })}`
            }
        }
        if (/^(mix|mix-oklab)\(.*\)$/.test(v) || /^[a-z][a-z0-9/-]*$/.test(v)) return `<code>${esc(v)}</code>`
        return prose(v)
    }
    if (Array.isArray(v)) return v.map((x) => ref(x, data)).join(', ')
    if (v && typeof v === 'object') {
        const o = v as Json
        if ('regular' in o && 'compact' in o && Object.keys(o).length === 2) return `${o.regular} / ${o.compact} <span class="quiet">regular / compact</span>`
        if ('value' in o) return `${ref(o.value, data)}${o.note ? `<div class="note">${prose(o.note)}</div>` : ''}`
        return `<dl class="kv">${Object.entries(o)
            .map(([k, x]) => `<div><dt>${esc(k)}</dt><dd>${ref(x, data)}</dd></div>`)
            .join('')}</dl>`
    }
    return esc(v)
}

const PAINT_FIELDS = ['ground', 'edge', 'ink', 'rule', 'mark', 'placeholder', 'ring', 'outline', 'opacity']

function paintsSection(spec: Json, data: PageData): string {
    const id = String(spec.id)
    const keys = Object.keys(resolved.paints[BASE]?.light ?? {}).filter((k) => k.startsWith(`${id}.`))
    if (!keys.length) return ''
    const states = Object.keys((spec.states as Json) ?? {})
    const groups = new Map<string, { variant: string; piece: string; keys: string[] }>()
    for (const k of keys) {
        const parts = k.split('.')
        const piece = parts[parts.length - 1]
        const variant = parts.slice(1, -2).join('.')
        const g = `${variant}.${piece}`
        if (!groups.has(g)) groups.set(g, { variant, piece, keys: [] })
        groups.get(g)!.keys.push(k)
    }
    const authored = (variant: string, piece: string, state: string): Json | undefined => {
        const variants = spec.variants as Record<string, Json> | undefined
        const pieces = spec.pieces as Record<string, Json> | undefined
        const map = variant !== 'base' && piece === 'container' ? variants?.[variant] : pieces?.[piece]
        return map?.[state] as Json | undefined
    }
    const html: string[] = []
    for (const { variant, piece, keys: list } of groups.values()) {
        const stateOf = (k: string) => k.split('.').slice(-2, -1)[0]
        list.sort((a, b) => {
            const ia = states.indexOf(stateOf(a).split('+')[0])
            const ib = states.indexOf(stateOf(b).split('+')[0])
            return ia - ib || stateOf(a).length - stateOf(b).length
        })
        const used = PAINT_FIELDS.filter((f) =>
            THEMES.some((t) => SCHEMES.some((s) => list.some((k) => resolved.paints[t]?.[s]?.[k]?.[f as keyof Paint] !== undefined))),
        )
        const every = (pick: (p: Paint & { flat?: Json; faded?: Record<string, Json> }) => Json | undefined) =>
            [...new Set(THEMES.flatMap((t) => SCHEMES.flatMap((s) => list.flatMap((k) => Object.keys(pick(resolved.paints[t]?.[s]?.[k] ?? {}) ?? {})))))]
        const flatUsed = every((p) => p.flat)
        const fadedUsed = every((p) => p.faded)
        const opaque = flatUsed.length > 0 || fadedUsed.length > 0
        const head = ['State', 'Look', ...used.map((f) => esc(f)), ...(opaque ? ['Opaque'] : []), 'Spec says']
        const rows = list.map((k) => {
            const state = stateOf(k)
            const cells = used.map((f) => {
                const as = f === 'ring' || f === 'outline' ? 'ring' : f === 'opacity' ? 'opacity' : 'swatch'
                const src = f === 'opacity' ? '' : shown(data, `s:${k}|${f}`, 'src', { cls: 'src' })
                return `${shown(data, `${k}|${f}`, as, { cls: as === 'opacity' ? 'plain' : 'sw' })}${src}`
            })
            if (opaque) {
                const flatOf = [...new Set(THEMES.flatMap((t) => SCHEMES.flatMap((sc) => Object.keys((resolved.paints[t]?.[sc]?.[k] as { flat?: Json } | undefined)?.flat ?? {}))))]
                const fields = (prefix: string, names: string[]) => names.map((f) => `<div><span class="quiet">${esc(f)}</span> ${shown(data, `${k}|${prefix}${f}`, 'swatch', { cls: 'sw' })}</div>`).join('')
                const fadedOf = (st: string) => Object.keys((resolved.paints[BASE]?.light?.[k] as { faded?: Record<string, Json> } | undefined)?.faded?.[st] ?? {})
                cells.push(
                    `${flatOf.length ? `<div class="quiet">flat over ${shown(data, `s:${k}|standsOn`, 'src', { cls: 'src' })}</div>${fields('flat.', flatUsed.filter((f) => flatOf.includes(f)))}` : ''}${fadedUsed
                        .filter((st) => fadedOf(st).length)
                        .map((st) => `<div class="quiet">faded, ${esc(st)}</div>${fields(`faded.${st}.`, fadedOf(st))}`)
                        .join('')}`,
                )
            }
            const spec = authored(variant, piece, state)
            const notes = spec
                ? Object.entries(spec)
                      .filter(([f]) => !PAINT_FIELDS.includes(f) || f === 'opacity')
                      .filter(([f]) => f !== 'opacity')
                      .map(([f, v]) => (f === 'note' ? `<div class="note">${prose(v)}</div>` : f === 'dark' ? `<div>${darkText(v as Json)}</div>` : `<div><span class="quiet">${esc(f)}</span> ${ref(v, data)}</div>`))
                      .join('')
                : ''
            return [`<code>${esc(state)}</code>`, shown(data, k, 'chip', { cls: 'chip' }), ...cells, notes]
        })
        const label =
            variant === 'base' ? `<code>${esc(piece)}</code>` : piece === 'container' ? `Variant <code>${esc(variant)}</code>` : `<code>${esc(variant)}</code> · <code>${esc(piece)}</code>`
        const overlay = list.some((k) => resolved.paints[BASE]?.light?.[k]?.overlay) ? ' <span class="quiet">(an overlay, laid over by field)</span>' : ''
        html.push(`<h3>${label}${overlay}</h3>${table(head, rows, 'paints')}`)
    }
    return html.join('\n')
}

function darkText(o: Json): string {
    return `<span class="quiet">in dark:</span> ${Object.entries(o)
        .map(([k, v]) => `${esc(k)} ${typeof v === 'object' ? `<code>${esc(JSON.stringify(v))}</code>` : `<code>${esc(v)}</code>`}`)
        .join(', ')}`
}

const KNOWN_KEYS = new Set([
    '$schema', 'id', 'kind', 'status', 'renderers', 'summary', 'sources', 'anatomy', 'standsOn', 'alsoStandsOn', 'options', 'sizes', 'layout', 'cells',
    'states', 'variants', 'pieces', 'breakpoints', 'routes', 'keyboard', 'words', 'samples', 'appText', 'rendererSpecific', 'drift',
])

function sourceLink(repo: string, path: string): string {
    if (repo === 'sokkel-ui' && /^[\w./-]+$/.test(path)) {
        return `<a href="${esc(pin.repo)}/blob/${esc(pin.commit)}/${esc(path)}"><code>${esc(path)}</code></a>`
    }
    const cut = path.indexOf(' (')
    return cut > 0 ? `<code>${esc(path.slice(0, cut))}</code> ${prose(path.slice(cut + 1))}` : `<code>${esc(path)}</code>`
}

function partPage(entry: (typeof entries)[number]) {
    const spec = readJson<Json>(entry.file)
    const id = entry.id
    const path = `${entry.kind}s/${id}.html`
    const data: PageData = { themes: {}, schemes: {} }
    for (const t of THEMES) {
        data.themes[t] = {}
        for (const s of SCHEMES) {
            const sc = resolved.themes[t][s]
            const flat: Record<string, unknown> = { 'meta.label': resolved.themes[t].label }
            for (const [k, v] of Object.entries(resolved.paints[t]?.[s] ?? {})) if (k.startsWith(`${id}.`)) flat[k] = v
            for (const group of ['lengths', 'numbers', 'durations'] as const) for (const [k, v] of Object.entries(sc[group])) flat[`${group}.${k}`] = v
            for (const [k, v] of Object.entries(sc.text)) flat[`text.${k}`] = v
            data.themes[t][s] = flat
        }
    }
    for (const s of SCHEMES) {
        data.schemes![s] = Object.fromEntries(Object.entries(resolved.paintSources[s] ?? {}).filter(([k]) => k.startsWith(`${id}.`)))
    }

    const sections: [string, string, string][] = []
    const add = (key: string, h: string, html: string) => html && sections.push([key, h, html])

    const states_ = (spec.renderers ?? {}) as Record<string, RendererState>
    add(
        'renderers',
        'Renderers',
        table(
            ['Renderer', 'State', 'As of', 'Note'],
            index.renderers.map((r) => [
                `<a href="https://github.com/${esc(r.repo)}">${esc(r.id)}</a> <span class="quiet">${esc(r.toolkit)}</span>`,
                rendererBadge(r, states_[r.id]),
                states_[r.id] ? `<a href="https://github.com/${esc(r.repo)}/commit/${esc(states_[r.id].as_of)}"><code>${esc(states_[r.id].as_of)}</code></a>` : '',
                states_[r.id]?.note ? prose(states_[r.id].note) : '',
            ]),
            'stack',
        ),
    )
    const stories = [...new Map(specimens.filter((s) => s.part === id).map((s) => [s.id, s])).values()]
    if (stories.length) {
        add(
            'stories',
            'In the Storybook',
            `<ul class="stories">${stories
                .map((s) => (s.new ? `<li><span>${esc(s.id)}</span> <span class="badge draft">to come</span></li>` : `<li><a href="${esc(storyUrl(s.id))}">${esc(s.id)}</a></li>`))
                .join('')}</ul>`,
        )
    }
    const anatomy = spec.anatomy as Record<string, string> | undefined
    if (anatomy) add('anatomy', 'Anatomy', `<dl class="defs">${Object.entries(anatomy).map(([k, v]) => `<div><dt><code>${esc(k)}</code></dt><dd>${prose(v)}</dd></div>`).join('')}</dl>`)

    const standsOn = spec.standsOn as Record<string, string> | undefined
    if (standsOn) {
        add(
            'stands-on',
            'Stands on',
            `<p class="lede small">The surface each piece stands on, which its paints are laid over where a renderer cannot blend.</p>${table(
                ['Piece', 'Surface'],
                Object.entries(standsOn).map(([k, v]) => [
                    `<code>${esc(k)}</code>`,
                    `<code>${esc(v)}</code>${(spec.alsoStandsOn as Record<string, string[]> | undefined)?.[k]?.length ? `, and ${(spec.alsoStandsOn as Record<string, string[]>)[k].map((one) => `<code>${esc(one)}</code>`).join(', ')}` : ''}`,
                ]),
                'stack',
            )}`,
        )
    }

    const options = spec.options as Record<string, Json> | undefined
    if (options) {
        add(
            'options',
            'Options',
            table(
                ['Option', 'Takes', 'Default', 'Does'],
                Object.entries(options).map(([k, o]) => [
                    `<code>${esc(k)}</code>`,
                    o.values ? (o.values as string[]).map((v) => `<code>${esc(v)}</code>`).join(' ') : `<span class="quiet">${esc(o.type ?? '')}</span>`,
                    o.default !== undefined ? `<code>${esc(JSON.stringify(o.default).replace(/^"|"$/g, ''))}</code>` : '',
                    `${prose(o.does ?? '')}${o.context ? `<div class="note">Context in CSS: <code>${esc(o.context)}</code></div>` : ''}${o['sokkel-ui'] ? `<div class="note">sokkel-ui: ${prose(o['sokkel-ui'])}</div>` : ''}`,
                ]),
                'options stack',
            ),
        )
    }

    const sizes = spec.sizes as Record<string, Json> | undefined
    if (sizes) {
        const cols = [...new Set(Object.values(sizes).flatMap((s) => Object.keys(s)))].filter((c) => c !== 'note')
        const hasNote = Object.values(sizes).some((s) => s.note)
        add(
            'sizes',
            'Sizes',
            table(
                ['Size', ...cols.map(esc), ...(hasNote ? ['Note'] : [])],
                Object.entries(sizes).map(([k, s]) => [
                    `<code>${esc(k)}</code>`,
                    ...cols.map((c) => (s[c] === undefined ? '' : ref(s[c], data))),
                    ...(hasNote ? [s.note ? `<span class="note">${prose(s.note)}</span>` : ''] : []),
                ]),
                'sizes',
            ),
        )
    }

    const layout = spec.layout as Json | undefined
    if (layout) add('layout', 'Layout', table(['Length', 'Value'], Object.entries(layout).map(([k, v]) => [`<code>${esc(k)}</code>`, ref(v, data)]), 'stack'))

    const cellSpec = spec.cells as Json | undefined
    if (cellSpec) {
        const boxRows = (o: Record<string, Json>) =>
            Object.entries(o).map(([k, b]) => [`<code>${esc(k)}</code>`, ...['rows', 'padX', 'padY', 'gap'].map((c) => (b[c] === undefined ? '' : ref(b[c], data))), `${b.width ? prose(b.width) : ''}${b.note ? `<div class="note">${prose(b.note)}</div>` : ''}`])
        const top = ['rows', 'padX', 'padY', 'gap'].filter((c) => cellSpec[c] !== undefined)
        const named = (cellSpec.glyphs as string[] | undefined) ?? []
        const glyphRow = (n: string): string[] => {
            const g = glyphs.glyphs[n]
            if (g) return [`<code>${esc(n)}</code>`, form(g.unicode), form(g.ascii), '']
            const i = glyphs.icons[n] as Icon | undefined
            if (i && typeof i === 'object') return [`<code>${esc(n)}</code>`, form(i.unicode), form(i.ascii), `<code>${esc(i.nerdFont)}</code>`]
            return [`<code>${esc(n)}</code>`, '<span class="quiet">the box glyphs</span>', '', '']
        }
        add(
            'cells',
            'Cells',
            `<p class="lede small">In a cell grid (a terminal), in rows and columns (<a href="../cells.html">Cells</a>).</p><dl class="defs">${top.map((c) => `<div><dt>${esc(c)}</dt><dd>${ref(cellSpec[c], data)}</dd></div>`).join('')}${['width', 'density', 'note'].filter((c) => cellSpec[c]).map((c) => `<div><dt>${esc(c)}</dt><dd>${prose(cellSpec[c])}</dd></div>`).join('')}</dl>${cellSpec.sizes ? `<h3>By size</h3>${table(['Size', 'rows', 'padX', 'padY', 'gap', 'Width and note'], boxRows(cellSpec.sizes as Record<string, Json>), 'stack')}` : ''}${cellSpec.pieces ? `<h3>By piece</h3>${table(['Piece', 'rows', 'padX', 'padY', 'gap', 'Width and note'], boxRows(cellSpec.pieces as Record<string, Json>), 'stack')}` : ''}${named.length ? `<h3>Glyphs</h3>${table(['Glyph', 'Unicode', 'ASCII', 'Nerd Font'], named.map(glyphRow), 'stack')}` : ''}`,
        )
    }

    const states = spec.states as Record<string, Json> | undefined
    if (states) {
        add(
            'states',
            'States',
            table(
                ['State', 'Means', 'Reached by', 'Effect'],
                Object.entries(states).map(([k, s]) => [
                    `<code>${esc(k)}</code>${s.on ? `<div class="quiet">focus: ${esc(s.on)}</div>` : ''}${s.status === 'proposed' ? ' <span class="badge draft">proposed</span>' : ''}`,
                    `${prose(s.means)}${s['sokkel-ui'] ? `<div class="note">sokkel-ui: ${prose(s['sokkel-ui'])}</div>` : ''}`,
                    s.reached ? prose(s.reached) : '',
                    s.effect ? ref(s.effect, data) : '',
                ]),
                'states stack',
            ),
        )
    }

    add(
        'paints',
        'Paints',
        (() => {
            const p = paintsSection(spec, data)
            return p
                ? `<p class="lede small">Each state's resolved paint for ${shown(data, 'meta.label', 'word', { tag: 'strong' })} picked in the bar, in <strong data-shows-scheme>light</strong>: the look, each color as a swatch with its hex and the expression the spec writes, and what else the spec says of it. A state left out paints as <code>rest</code>. <strong>Opaque</strong> is what a renderer that cannot blend draws: each field that is not opaque laid over the surface the piece stands on (<code>flat</code>), and the paint drawn at a fading state's opacity (<code>faded</code>).</p>${p}`
                : ''
        })(),
    )

    const breakpoints = spec.breakpoints as Record<string, Json> | undefined
    if (breakpoints) {
        add(
            'breakpoints',
            'Breakpoints',
            Object.entries(breakpoints)
                .map(
                    ([k, b]) =>
                        `<h3><code>${esc(k)}</code> <span class="quiet">${ref(b.width, data)}</span></h3>${b.formFactors ? `<p class="quiet">${(b.formFactors as string[]).map(esc).join('; ')}</p>` : ''}<ul>${((b.does as string[]) ?? []).map((d) => `<li>${prose(d)}</li>`).join('')}</ul>`,
                )
                .join(''),
        )
    }
    const routes = spec.routes as Record<string, string> | undefined
    if (routes) add('routes', 'Routes', `<dl class="defs">${Object.entries(routes).map(([k, v]) => `<div><dt><code>${esc(k)}</code></dt><dd>${prose(v)}</dd></div>`).join('')}</dl>`)

    const keyboard = spec.keyboard as Json[] | undefined
    if (keyboard?.length) {
        add(
            'keyboard',
            'Keys',
            table(
                ['Keys', 'Does', 'When'],
                keyboard.map((k) => [(k.keys as string[]).map((x) => `<kbd>${esc(x)}</kbd>`).join(' '), prose(k.does), k.when ? prose(k.when) : '']),
                'keys stack',
            ),
        )
    }

    const words = spec.words as Record<string, string | { one: string; other: string }> | undefined
    const samples = (spec.samples ?? {}) as Record<string, { with: Json; says: string }[]>
    if (words && Object.keys(words).length) {
        add(
            'words',
            'Words',
            table(
                ['Key', 'English default', 'Says'],
                Object.entries(words).map(([k, w]) => [
                    `<code>${esc(k)}</code>`,
                    typeof w === 'string' ? `<q>${esc(w)}</q>` : `<div><span class="quiet">one</span> <q>${esc(w.one)}</q></div><div><span class="quiet">other</span> <q>${esc(w.other)}</q></div>`,
                    (samples[k] ?? [])
                        .map((s) => `<div class="sample"><span class="quiet">${esc(Object.entries(s.with).map(([a, b]) => `${a} ${b}`).join(', '))}</span> <q>${esc(s.says)}</q></div>`)
                        .join(''),
                ]),
                'words stack',
            ),
        )
    }
    const appText = spec.appText as Record<string, string> | undefined
    if (appText && Object.keys(appText).length) {
        add('app-text', 'Text the app gives', `<dl class="defs">${Object.entries(appText).map(([k, v]) => `<div><dt><code>${esc(k)}</code></dt><dd>${prose(v)}</dd></div>`).join('')}</dl>`)
    }
    const specific = spec.rendererSpecific as Record<string, string[]> | undefined
    if (specific) {
        add(
            'per-renderer',
            'Per renderer',
            Object.entries(specific)
                .map(([r, list]) => `<h3>${esc(r)}</h3><ul>${list.map((x) => `<li>${prose(x)}</li>`).join('')}</ul>`)
                .join(''),
        )
    }
    const drift = spec.drift as Json[] | undefined
    if (drift?.length) {
        add(
            'drift',
            'Drift',
            `<p class="lede small">Where a renderer differs from the spec today.</p>${table(
                ['Renderer', 'What', 'Spec', 'Today'],
                drift.map((d) => [esc(d.renderer), prose(d.what), prose(d.spec), prose(d.today)]),
                'drift stack',
            )}`,
        )
    }
    const sources = spec.sources as Record<string, string[]> | undefined
    if (sources) {
        add(
            'sources',
            'Sources',
            Object.entries(sources)
                .map(([r, list]) => `<h3>${esc(r)}</h3><ul class="paths">${list.map((p) => `<li>${sourceLink(r, p)}</li>`).join('')}</ul>`)
                .join(''),
        )
    }
    // Keys this script does not know yet are shown as they are written.
    for (const [k, v] of Object.entries(spec)) {
        if (!KNOWN_KEYS.has(k)) add(slug(k), esc(k), `<pre><code>${esc(JSON.stringify(v, null, 4))}</code></pre>`)
    }
    const mdFile = entry.file.replace(/\.json$/, '.md')
    if (existsSync(join(ROOT, mdFile))) {
        add('prose', 'In words', `<details class="md"><summary>The spec as written for people, <code>${esc(mdFile)}</code></summary><div class="prose">${markdown(read(mdFile), posix.dirname(mdFile), 1, 'words-')}</div></details>`)
    }

    const toc = sections.map(([k, h]) => `<a href="#${k}">${h}</a>`).join('')
    const body = `
<p class="crumbs"><a href="../parts/index.html">Parts and patterns</a></p>
<header class="page-head">
<p class="eyebrow">${entry.kind === 'pattern' ? 'Pattern' : 'Part'} ${statusBadge(entry.status)}</p>
<h1>${esc(title(id))}</h1>
<p class="lede">${prose(spec.summary ?? '')}</p>
<p class="quiet small">Spec: <a href="${REPO}/blob/main/${esc(entry.file)}"><code>${esc(entry.file)}</code></a></p>
<nav class="toc" aria-label="On this page">${toc}</nav>
</header>
${sections.map(([k, h, html]) => `<section class="block" id="${k}"><h2><a class="anchor" href="#${k}">${h}</a></h2>${html}</section>`).join('\n')}`
    write(path, page({ path, title: title(id), body, data, wide: true, nav: 'parts/index.html' }))
}

// ---------------------------------------------------------------------------------------------------
// Assets

async function assets() {
    mkdirSync(join(OUT, 'assets'), { recursive: true })
    writeFileSync(join(OUT, 'assets', 'themes.css'), themeCss())
    cpSync(join(ROOT, 'site', 'site.css'), join(OUT, 'assets', 'site.css'))
    cpSync(join(ROOT, 'site', 'mark.svg'), join(OUT, 'assets', 'mark.svg'))
    const built = await Bun.build({ entrypoints: [join(ROOT, 'site', 'client.ts')], minify: true, target: 'browser' })
    if (!built.success) throw new AggregateError(built.logs, 'site/client.ts did not build')
    writeFileSync(join(OUT, 'assets', 'site.js'), await built.outputs[0].text())
    writeFileSync(join(OUT, '.nojekyll'), '')
}

rmSync(OUT, { recursive: true, force: true })
await assets()
home()
markdownPage('principles.md', 'principles.html', 'Principles')
markdownPage('specimens.md', 'specimens.html', 'Specimens')
markdownPage('open-questions.md', 'open-questions.html', 'Open questions')
markdownPage('CHANGELOG.md', 'changelog.html', 'Changelog')
tokensPage()
cellsPage()
partsIndex()
for (const e of entries) partPage(e)
console.log(`_site: ${entries.length} parts and patterns, ${THEMES.length} themes, contract ${index.version}`)
