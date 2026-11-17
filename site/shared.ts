/**
 * How the site draws a resolved value, shared by the generator (the first render, for the base theme)
 * and the page's script (a render again when the reader picks another theme or scheme).
 *
 * An element that shows a value carries `data-v` (where the value is in the page's data) and
 * `data-as` (how it is drawn). Its `.mark` child, when it has one, takes the style; its `.val` child
 * takes the text.
 */

export type Ring = { color: string; width: number; offset?: number }
export type Paint = {
    ground?: string
    edge?: string
    ink?: string
    rule?: string
    mark?: string
    placeholder?: string
    ring?: Ring
    outline?: Ring
    opacity?: number
    overlay?: boolean
}
export type TextRole = { size: number; lineHeight: number; weight: number; tracking: number }
export type Shadow = { x: number; y: number; blur: number; spread: number; color: string }[]

/** Page data: per theme and scheme a flat map of values, and per scheme one shared by every theme. */
export type PageData = {
    themes: Record<string, Record<string, Record<string, unknown>>>
    schemes?: Record<string, Record<string, unknown>>
}

export type View = { style: Record<string, string>; text: string; on: 'mark' | 'self' }

const px = (n: number) => `${Math.round(n * 100) / 100}`

/** A color for CSS: `inherit` and missing paint as transparent over the checkerboard. */
const cssColor = (c: string | undefined) => (c && c !== 'inherit' ? c : 'transparent')

export function shadowCss(layers: Shadow): string {
    return layers.map((l) => `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(', ')
}

export function view(as: string, v: unknown): View {
    if (v === undefined || v === null) return { style: {}, text: as === 'src' || as === 'swatch' || as === 'ring' ? '' : '-', on: 'mark' }
    switch (as) {
        case 'swatch': {
            const c = String(v)
            return { style: { background: cssColor(c) }, text: c, on: 'mark' }
        }
        case 'ring': {
            const r = v as Ring
            const off = r.offset ? `, ${px(r.offset)} off` : ''
            return { style: { background: cssColor(r.color) }, text: `${r.color} ${px(r.width)}px${off}`, on: 'mark' }
        }
        case 'opacity':
            return { style: {}, text: String(v), on: 'mark' }
        case 'chip': {
            const p = v as Paint
            const shadows: string[] = []
            if (p.ring) shadows.push(`0 0 0 ${p.ring.width}px ${p.ring.color}`)
            const style: Record<string, string> = {
                background: cssColor(p.ground),
                color: p.ink && p.ink !== 'inherit' ? p.ink : 'var(--foreground)',
                'border-color': cssColor(p.edge ?? p.rule),
                'box-shadow': shadows.join(', ') || 'none',
                outline: p.outline ? `${p.outline.width}px solid ${p.outline.color}` : 'none',
                'outline-offset': p.outline?.offset !== undefined ? `${p.outline.offset}px` : '0',
                opacity: p.opacity !== undefined ? String(p.opacity) : '1',
            }
            return { style, text: 'Aa', on: 'self' }
        }
        case 'text': {
            const t = v as TextRole
            return {
                style: {
                    'font-size': `${t.size}px`,
                    'line-height': `${t.lineHeight}px`,
                    'font-weight': String(t.weight),
                    'letter-spacing': `${t.tracking}em`,
                },
                text: textSpec(t),
                on: 'mark',
            }
        }
        case 'textspec':
            return { style: {}, text: textSpec(v as TextRole), on: 'mark' }
        case 'radius':
            return { style: { 'border-radius': `${v}px` }, text: px(Number(v)), on: 'mark' }
        case 'bar':
            return { style: { width: `${Math.min(Number(v), 320)}px` }, text: px(Number(v)), on: 'mark' }
        case 'shadow':
            return { style: { 'box-shadow': shadowCss(v as Shadow) }, text: shadowText(v as Shadow), on: 'mark' }
        case 'ms':
            return { style: {}, text: `${v} ms`, on: 'mark' }
        case 'ease': {
            const [a, b, c, d] = v as number[]
            return { style: {}, text: `cubic-bezier(${a}, ${b}, ${c}, ${d})`, on: 'mark' }
        }
        case 'src':
            return { style: {}, text: v === undefined ? '' : String(v), on: 'mark' }
        case 'font':
            return { style: { 'font-family': String(v) }, text: String(v), on: 'mark' }
        default:
            return { style: {}, text: typeof v === 'number' ? px(v) : String(v), on: 'mark' }
    }
}

export function textSpec(t: TextRole): string {
    return `${t.size}/${t.lineHeight} · ${t.weight}${t.tracking ? ` · ${t.tracking}em` : ''}`
}

function shadowText(layers: Shadow): string {
    return layers.map((l) => `${l.x} ${l.y} ${l.blur} ${l.spread} ${l.color}`).join(' + ')
}

/** Find a value: `s:` reads the scheme's shared map, a `|` picks a field of the value found. */
export function lookup(data: PageData, theme: string, scheme: string, path: string): unknown {
    const shared = path.startsWith('s:')
    const [key, field] = (shared ? path.slice(2) : path).split('|')
    const map = shared ? data.schemes?.[scheme] : (data.themes[theme] ?? data.themes[Object.keys(data.themes)[0]])?.[scheme]
    const found = map?.[key]
    if (field === undefined) return found
    return found && typeof found === 'object' ? (found as Record<string, unknown>)[field] : undefined
}
