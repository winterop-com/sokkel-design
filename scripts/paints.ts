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
 * takes rest. `source` keeps each field's expression, which verify-colors draws in Chromium.
 */
import { Evaluator, hex, px, type Vars } from './resolve-tokens.ts'

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
    states: Record<string, { effect?: { piece?: string; ring?: Ring } }>
    variants?: Record<string, PaintMap>
    pieces?: Record<string, PaintMap>
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
    source: Record<string, string>
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
    const byOrder = (states: Set<string>) => ['rest', ...order.filter((s) => s !== 'rest')].filter((s) => states.has(s))
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

/** Every paint of the specs in one theme and scheme. */
export function paintsOf(specs: Spec[], vars: Vars, dark: boolean): Record<string, ResolvedPaint> {
    const evaluator = new Evaluator(vars)
    const name = named(vars)
    const color = (ref: string): string => {
        const expr = css(ref, name)
        if (expr === 'inherit') return 'inherit'
        const value = evaluator.value(expr)
        if (value.kind !== 'color') throw new Error(`${ref} is not a color`)
        return hex(value.color)
    }
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
    const out: Record<string, ResolvedPaint> = {}
    for (const spec of specs) {
        for (const { key, maps, state, piece, overlay } of paintKeys(spec)) {
            try {
                out[key] = paintOf(compose(spec, maps, state, piece, dark), overlay)
            } catch (error) {
                // A token the spec names that these tokens lack: the pin is behind the spec, or the spec is wrong.
                throw new Error(`${key}: ${error instanceof Error ? error.message : String(error)} does not resolve in these tokens`)
            }
        }
    }
    return out
}
