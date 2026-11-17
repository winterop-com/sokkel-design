/**
 * The paints: every color and ring a part or pattern spec paints, resolved for every theme and
 * scheme into plain colors, so no renderer mixes one (README, "Resolved paints").
 *
 * A paint is keyed `<part>.<variant>.<state>.<piece>`: `variant` is `base` for a part without
 * variants, `piece` is `container` for a variant's own paint, and `state` a state key, `+` joined
 * for a combination. Each is complete, its layers laid over each other in order: rest, then each
 * state the key joins, then the joined key itself. In each of those steps the part-wide piece
 * (`pieces.container`, for a part with variants) is laid first, then the variant's or the piece's
 * own paint, each followed in dark by its `dark` layer, and then the state's effect ring. A ring with
 * an `offset` is an outline drawn outside the box, which stacks with a ring; every other ring
 * replaces the ring before it, as CSS box-shadow rings do. A variant whose rest paints nothing is an
 * option's overlay (destructive-hover): its paints hold only its own fields and say `overlay`.
 *
 * Only rest and the states a spec paints (or rings) are present; a renderer asked for another state
 * takes rest. `source` keeps each field's expression, which verify-colors draws in Chromium, and the
 * surface the piece stands on (`standsOn`).
 *
 * Opaque forms, for a renderer that cannot blend (a terminal): `flat` holds each field that is not
 * opaque, or is `inherit`, laid over what it stands on in sRGB (source-over, as a browser
 * composites): the ground over the piece's surface (the spec's `standsOn`), the edge, ink, rule,
 * mark, placeholder and an inset ring over that flat ground (the surface where there is no ground),
 * and a ring or outline drawn outside the box over the surface. `inherit` is the surface's own ink.
 * `faded` holds, for each state whose effect fades the piece (`disabled` at `disabled-opacity`),
 * every color field of the paint drawn at that opacity over the surface, as CSS draws a part at
 * opacity: on the state's own key where the spec paints it, else on rest. A part that also stands on
 * other surfaces (a ghost button in a section's head, an outline one in a popover) names them in
 * `alsoStandsOn`, and each paint carries the same two forms over each of them, in `flatOn` and
 * `fadedOn` by surface.
 */
import { Evaluator, hex, px, type Color, type Vars } from './resolve-tokens.ts'

type Length = number | string

interface Ring {
    color: string
    width: Length
    offset?: Length
    inset?: 'start' | 'all'
    dark?: { color: string }
}

interface Paint {
    ground?: string
    edge?: string
    ink?: string
    rule?: string
    mark?: string
    placeholder?: string
    ring?: Ring
    opacity?: Length
    dark?: Paint
    [other: string]: unknown
}

type PaintMap = Record<string, Paint>

export interface Spec {
    id: string
    states: Record<string, { effect?: { piece?: string; ring?: Ring; opacity?: Length } }>
    variants?: Record<string, PaintMap>
    pieces?: Record<string, PaintMap>
    /** The surface each piece stands on, by piece (or variant), with a `default`. */
    standsOn?: Record<string, string>
    /** The other surfaces a piece (or variant) may stand on, by piece, with a `default`. */
    alsoStandsOn?: Record<string, string[]>
}

export interface ResolvedRing {
    color: string
    width: number
    offset?: number
    inset?: 'start' | 'all'
}

export interface ResolvedPaint {
    ground?: string
    edge?: string
    ink?: string
    rule?: string
    mark?: string
    placeholder?: string
    ring?: ResolvedRing
    outline?: ResolvedRing
    opacity?: number
    overlay?: true
    /** Each field that is not opaque, laid over what it stands on: every field opaque. */
    flat?: FlatPaint
    /** By state: every color field of the paint drawn at the state's opacity over the surface. */
    faded?: Record<string, FlatPaint>
    /** By another surface the piece may stand on (`alsoStandsOn`): `flat` laid over it. */
    flatOn?: Record<string, FlatPaint>
    /** By another surface, then by state: `faded` drawn over it. */
    fadedOn?: Record<string, Record<string, FlatPaint>>
    source: Record<string, string>
}

export interface FlatPaint {
    ground?: string
    edge?: string
    ink?: string
    rule?: string
    mark?: string
    placeholder?: string
    ring?: string
    outline?: string
}

const COLORS = ['ground', 'edge', 'ink', 'rule', 'mark', 'placeholder'] as const

/** What one key lays, still in the authoring form. */
interface Laid {
    colors: Partial<Record<(typeof COLORS)[number], string>>
    ring?: Ring
    outline?: Ring
    opacity?: Length
    /** The ring's and the outline's color as laid in this scheme (a ring's own `dark`). */
    ringColor?: string
    outlineColor?: string
}

const isOutline = (ring: Ring) => ring.offset !== undefined && ring.offset !== 0

function layRing(laid: Laid, ring: Ring, dark: boolean): void {
    const color = dark ? (ring.dark?.color ?? ring.color) : ring.color
    if (isOutline(ring)) {
        laid.outline = ring
        laid.outlineColor = color
    } else {
        laid.ring = ring
        laid.ringColor = color
    }
}

function lay(laid: Laid, paint: Paint | undefined, dark: boolean): void {
    if (paint === undefined) return
    for (const key of COLORS) if (paint[key] !== undefined) laid.colors[key] = paint[key]
    if (paint.ring !== undefined) layRing(laid, paint.ring, dark)
    if (paint.opacity !== undefined) laid.opacity = paint.opacity
    if (dark && paint.dark !== undefined) lay(laid, paint.dark, false)
}

/** A paint's layers for one key: rest, each joined state, the joined key; the shared piece first, then the own map, then the effect ring. */
function compose(spec: Spec, maps: PaintMap[], state: string, piece: string, dark: boolean): Laid {
    const laid: Laid = { colors: {} }
    const joined = state.split('+')
    const steps = state === 'rest' ? ['rest'] : joined.length > 1 ? ['rest', ...joined, state] : ['rest', state]
    for (const step of steps) {
        for (const map of maps) lay(laid, map[step], dark)
        const effect = spec.states[step]?.effect
        if (effect?.ring !== undefined && (effect.piece ?? 'container') === piece) layRing(laid, effect.ring, dark)
    }
    return laid
}

/** The keys a spec paints and the maps each is laid from, in the spec's order of states. */
export function paintKeys(spec: Spec): { key: string; maps: PaintMap[]; state: string; piece: string; overlay: boolean }[] {
    const order = Object.keys(spec.states)
    // The states in the spec's order, then each combination a map paints that the states do not list (failed+warning).
    const byOrder = (states: Set<string>) => {
        const listed = ['rest', ...order.filter((s) => s !== 'rest')].filter((s) => states.has(s))
        return [...listed, ...[...states].filter((s) => !listed.includes(s))]
    }
    const ringed = (piece: string) =>
        Object.entries(spec.states)
            .filter(([, entry]) => entry.effect?.ring !== undefined && (entry.effect.piece ?? 'container') === piece)
            .map(([name]) => name)
    const out: { key: string; maps: PaintMap[]; state: string; piece: string; overlay: boolean }[] = []
    if (spec.variants !== undefined) {
        const shared = spec.pieces?.container ?? {}
        for (const [variant, map] of Object.entries(spec.variants)) {
            const overlay = Object.keys(map.rest ?? {}).every((key) => key === 'note')
            const states = overlay
                ? new Set(Object.keys(map).filter((s) => s !== 'rest'))
                : new Set(['rest', ...Object.keys(map), ...Object.keys(shared), ...ringed('container')])
            for (const state of byOrder(states)) {
                out.push({
                    key: `${spec.id}.${variant}.${state}.container`,
                    maps: overlay ? [map] : [shared, map],
                    state,
                    piece: 'container',
                    overlay,
                })
            }
        }
    }
    for (const [piece, map] of Object.entries(spec.pieces ?? {})) {
        if (spec.variants !== undefined && piece === 'container') continue
        const states = new Set(['rest', ...Object.keys(map), ...ringed(piece)])
        for (const state of byOrder(states)) out.push({ key: `${spec.id}.base.${state}.${piece}`, maps: [map], state, piece, overlay: false })
    }
    return out
}

/**
 * A color in the authoring grammar as the CSS a utility class draws: `primary/80` as Tailwind's
 * `bg-primary/80`, `mix(a, b NN%)` in oklch and `mix-oklab(a NN%, b)` in oklab as the components'
 * `color-mix()`. `name` says how a token is named in that CSS; `inherit` stays itself.
 */
export function css(ref: string, name: (token: string) => string): string {
    if (ref === 'none') return 'transparent'
    if (ref === 'inherit') return 'inherit'
    const oklch = /^mix\(([a-z][a-z0-9-]*), ([a-z][a-z0-9-]*) (\d{1,3})%\)$/.exec(ref)
    if (oklch !== null) return `color-mix(in oklch, ${name(oklch[1])}, ${name(oklch[2])} ${oklch[3]}%)`
    const oklab = /^mix-oklab\(([a-z][a-z0-9-]*) (\d{1,3})%, ([a-z][a-z0-9-]*)\)$/.exec(ref)
    if (oklab !== null) return `color-mix(in oklab, ${name(oklab[1])} ${oklab[2]}%, ${name(oklab[3])})`
    const alpha = /^([a-z][a-z0-9-]*)\/(\d{1,3})$/.exec(ref)
    if (alpha !== null) return `color-mix(in oklab, ${name(alpha[1])} ${alpha[2]}%, transparent)`
    if (/^[a-z][a-z0-9-]*$/.test(ref)) return name(ref)
    throw new Error(`${ref} is not a color in the contract's grammar`)
}

/** How the resolver names a token: its own variable, or the `color-` alias a utility class reads. */
const named = (vars: Vars) => (token: string) => {
    if (token in vars) return `var(--${token})`
    if (`color-${token}` in vars) return `var(--color-${token})`
    throw new Error(`${token} is not a token`)
}

/** The surface a piece stands on: its own entry in `standsOn`, the variant's, the part's default, else the page. */
export function surfaceOf(spec: Spec, variant: string, piece: string): string {
    const on = spec.standsOn ?? {}
    return on[piece === 'container' ? variant : piece] ?? on[piece] ?? on.default ?? 'background'
}

/** The other surfaces a piece may stand on: its own entry in `alsoStandsOn`, the variant's, the part's default, else none. */
export function surfacesOf(spec: Spec, variant: string, piece: string): string[] {
    const on = spec.alsoStandsOn ?? {}
    return on[piece === 'container' ? variant : piece] ?? on[piece] ?? on.default ?? []
}

/** The ink of what stands on a surface, which `inherit` takes there. */
export function inkOf(surface: string, has: (token: string) => boolean): string {
    const named: Record<string, string> = {
        background: 'foreground',
        field: 'foreground',
        'page-foot-ground': 'page-foot-ink',
        'section-head-ground': 'section-head-ink',
        'table-head-ground': 'table-head-ink',
    }
    if (named[surface] !== undefined) return named[surface]
    return has(`${surface}-foreground`) ? `${surface}-foreground` : 'foreground'
}

/**
 * A color's sRGB channels and its alpha as Chromium lays them over another: a channel past 1 is kept
 * until the result is clipped, one below 0 is taken as 0 (measured; verify-colors holds it).
 */
type Raw = [number, number, number, number]

function rawOf(color: Color): Raw {
    const l = (color.l + 0.3963377774 * color.a + 0.2158037573 * color.b) ** 3
    const m = (color.l - 0.1055613458 * color.a - 0.0638541728 * color.b) ** 3
    const s = (color.l - 0.0894841775 * color.a - 1.291485548 * color.b) ** 3
    const gamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
    const channel = (c: number) => Math.max(0, gamma(c))
    return [
        channel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
        channel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
        channel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
        color.alpha,
    ]
}

const bytesOf = (hex: string): number[] => [1, 3, 5, 7].map((i) => (i < hex.length ? parseInt(hex.slice(i, i + 2), 16) : 255))

/** `color` laid over the opaque `under` (a hex) in sRGB, as a browser composites, then clipped: an opaque hex. */
export function over(color: Raw, under: string, opacity = 1): string {
    const u = bytesOf(under)
    const t = color[3] * opacity
    const byte = (c: number, i: number) => Math.min(255, Math.max(0, Math.round(c * 255 * t + u[i] * (1 - t))))
    return `#${color
        .slice(0, 3)
        .map((c, i) => byte(c, i).toString(16).padStart(2, '0'))
        .join('')}`
}

/** An opaque hex as a Raw. */
const rawHex = (hex: string): Raw => [...bytesOf(hex).slice(0, 3).map((b) => b / 255), 1] as Raw

const opaque = (hex: string) => hex.length === 7 || hex.endsWith('ff')
const OVER_GROUND = ['edge', 'ink', 'rule', 'mark', 'placeholder'] as const

/** The opaque form of a paint over `surface` (an opaque hex), each field laid from its unclipped color (`raw`, `inherit` as the surface's ink); every field, and the ones that changed. */
function flatten(paint: ResolvedPaint, raw: Partial<Record<keyof FlatPaint, Raw>>, surface: string): { all: FlatPaint; changed: FlatPaint } {
    const all: FlatPaint = {}
    const changed: FlatPaint = {}
    const set = (field: keyof FlatPaint, value: string, was: string) => {
        all[field] = value
        if (value !== was) changed[field] = value
    }
    const ground = paint.ground === undefined || raw.ground === undefined ? surface : over(raw.ground, surface)
    if (paint.ground !== undefined) set('ground', ground, paint.ground)
    for (const field of OVER_GROUND) {
        const value = paint[field]
        const color = raw[field]
        if (value === undefined || color === undefined) continue
        set(field, over(color, ground), value)
    }
    if (paint.ring !== undefined && raw.ring !== undefined) set('ring', over(raw.ring, paint.ring.inset === undefined ? surface : ground), paint.ring.color)
    if (paint.outline !== undefined && raw.outline !== undefined) set('outline', over(raw.outline, surface), paint.outline.color)
    return { all, changed }
}

/** Every color field of an opaque paint drawn at `opacity` over `surface`. */
function fade(all: FlatPaint, surface: string, opacity: number): FlatPaint {
    const out: FlatPaint = {}
    for (const field of ['ground', ...OVER_GROUND] as const) {
        const value = all[field]
        if (value !== undefined) out[field] = over(rawHex(value), surface, opacity)
    }
    return out
}

/** Every paint of the specs in one theme and scheme. */
export function paintsOf(specs: Spec[], vars: Vars, dark: boolean): Record<string, ResolvedPaint> {
    const evaluator = new Evaluator(vars)
    const name = named(vars)
    const colorOf = (ref: string): Color => {
        const value = evaluator.value(css(ref, name))
        if (value.kind !== 'color') throw new Error(`${ref} is not a color`)
        return value.color
    }
    const color = (ref: string): string => (ref === 'inherit' ? 'inherit' : hex(colorOf(ref)))
    const length = (value: Length): number => (typeof value === 'number' ? value : px(evaluator.variable(value)))
    const number = (value: Length): number => {
        if (typeof value === 'number') return value
        const found = evaluator.variable(value)
        if (found.kind !== 'number') throw new Error(`${value} is not a number`)
        return found.n
    }
    const ring = (laid: Ring, ref: string): ResolvedRing => ({
        color: color(ref),
        width: length(laid.width),
        ...(laid.offset === undefined ? {} : { offset: length(laid.offset) }),
        ...(laid.inset === undefined ? {} : { inset: laid.inset }),
    })
    const paintOf = (laid: Laid, overlay: boolean): ResolvedPaint => {
        const paint: ResolvedPaint = { source: {} }
        for (const field of COLORS) {
            const ref = laid.colors[field]
            if (ref === undefined) continue
            paint[field] = color(ref)
            paint.source[field] = ref
        }
        if (laid.ring !== undefined && laid.ringColor !== undefined) {
            paint.ring = ring(laid.ring, laid.ringColor)
            paint.source.ring = laid.ringColor
        }
        if (laid.outline !== undefined && laid.outlineColor !== undefined) {
            paint.outline = ring(laid.outline, laid.outlineColor)
            paint.source.outline = laid.outlineColor
        }
        if (laid.opacity !== undefined) paint.opacity = number(laid.opacity)
        if (overlay) paint.overlay = true
        return paint
    }
    const has = (token: string) => token in vars || `color-${token}` in vars
    const out: Record<string, ResolvedPaint> = {}
    for (const spec of specs) {
        // Each paint's opaque form over each surface it may stand on, by key and then by surface ('' for standsOn).
        const flats: Record<string, Record<string, { all: FlatPaint; surface: string }>> = {}
        for (const { key, maps, state, piece, overlay } of paintKeys(spec)) {
            try {
                const paint = paintOf(compose(spec, maps, state, piece, dark), overlay)
                const variant = key.split('.')[1]
                const standsOn = surfaceOf(spec, variant, piece)
                const laidOver = (on: string) => {
                    const surface = color(on)
                    if (!opaque(surface)) throw new Error(`${on}, a surface it stands on, is not opaque (${surface})`)
                    const ink = inkOf(on, has)
                    const raw: Partial<Record<keyof FlatPaint, Raw>> = {}
                    for (const [field, ref] of Object.entries(paint.source)) raw[field as keyof FlatPaint] = rawOf(colorOf(ref === 'inherit' ? ink : ref))
                    return { ...flatten(paint, raw, surface), surface }
                }
                const { all, changed, surface } = laidOver(standsOn)
                if (Object.keys(changed).length > 0) paint.flat = changed
                flats[key] = { '': { all, surface } }
                for (const other of surfacesOf(spec, variant, piece)) {
                    if (other === standsOn) continue
                    const elsewhere = laidOver(other)
                    if (Object.keys(elsewhere.changed).length > 0) paint.flatOn = { ...paint.flatOn, [other]: elsewhere.changed }
                    flats[key][other] = { all: elsewhere.all, surface: elsewhere.surface }
                }
                paint.source.standsOn = standsOn
                out[key] = paint
            } catch (error) {
                // A token the spec names that these tokens lack: the pin is behind the spec, or the spec is wrong.
                throw new Error(`${key}: ${error instanceof Error ? error.message : String(error)} does not resolve in these tokens`)
            }
        }
        // A state that fades its piece: the paint a renderer takes in it (the state's own key, else rest), drawn at that opacity.
        for (const [state, entry] of Object.entries(spec.states)) {
            const opacity = entry.effect?.opacity
            if (opacity === undefined || number(opacity) >= 1) continue
            for (const { key, state: at, piece, overlay } of paintKeys(spec)) {
                if (at !== 'rest' || overlay) continue
                if (entry.effect?.piece !== undefined && entry.effect.piece !== piece) continue
                const own = key.replace('.rest.', `.${state}.`)
                const target = own in out ? own : key
                for (const [on, { all, surface }] of Object.entries(flats[target])) {
                    const faded = fade(all, surface, number(opacity))
                    if (on === '') out[target].faded = { ...out[target].faded, [state]: faded }
                    else out[target].fadedOn = { ...out[target].fadedOn, [on]: { ...out[target].fadedOn?.[on], [state]: faded } }
                }
            }
        }
    }
    return out
}
