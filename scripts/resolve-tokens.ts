/**
 * Resolve sokkel-ui's tokens to plain values, for a renderer that reads no CSS: every theme in light and
 * dark as a browser computes it on `<html>`, its colors as sRGB hex, its lengths in px, its numbers,
 * its durations in ms, its easing curves, its elevations as layers, and its words (font stacks,
 * keywords), and every density level. A value the evaluator cannot settle without a page (a size
 * against its container) is left out.
 *
 * The evaluator knows what the tokens use: `oklch()`, hex, `transparent`, `var()`,
 * `color-mix(in oklab | oklch, ...)` with premultiplied alpha as CSS mixes it, lengths in px, rem
 * and em, durations in ms and s, `calc()` and `max()`. Colors outside sRGB are clipped per channel,
 * as browsers draw them. An elevation is written in tokens.json as its layers, each an x, y, blur and
 * spread in px and a color, which is resolved as any color is.
 */

/** One layer of an elevation as tokens.json writes it: px and a color in CSS. */
export interface ShadowLayer {
    x: number
    y: number
    blur: number
    spread: number
    color: string
}

export type Vars = Record<string, string | ShadowLayer[]>

export interface TokenSource {
    theme: Vars
    themes: Record<string, { $label?: string; $description?: string; light: Vars; dark: Vars }>
    derived: { light: Vars; dark: Vars }
    density: Record<string, Vars | string> & { default: string }
}

/** A text role: size and line height in px, weight, and tracking in em. */
export interface ResolvedTextRole {
    size: number
    lineHeight: number
    weight: number
    tracking: number
}

/** An elevation's layer: its offset, blur and spread in px and its color as sRGB hex. */
export interface ResolvedLayer {
    x: number
    y: number
    blur: number
    spread: number
    color: string
}

export interface ResolvedScheme {
    colors: Record<string, string>
    lengths: Record<string, number>
    numbers: Record<string, number>
    ems: Record<string, number>
    /** Durations in ms. */
    durations: Record<string, number>
    /** Easing curves as a cubic Bézier's x1, y1, x2 and y2. */
    easings: Record<string, [number, number, number, number]>
    /** Elevations as their layers, the first drawn on top, as CSS lays a box-shadow's. */
    elevations: Record<string, ResolvedLayer[]>
    words: Record<string, string>
    text: Record<string, ResolvedTextRole>
}

export interface ResolvedTokens {
    $description: string
    /** The sokkel-ui repository and commit the tokens were read at. */
    sokkelUi: { repo: string; commit: string }
    default: { theme: string; density: string }
    themes: Record<string, { label: string; description?: string; light: ResolvedScheme; dark: ResolvedScheme }>
    density: Record<string, Record<string, number>>
    /** Every paint the specs name, by theme, scheme and `<part>.<variant>.<state>.<piece>` (scripts/paints.ts). */
    paints?: Record<string, { light: Record<string, object>; dark: Record<string, object> }>
    /** Each paint's expressions by field, the same in every theme, by scheme and key. */
    paintSources?: Record<'light' | 'dark', Record<string, Record<string, string>>>
}

/** Oklab with straight alpha. */
interface Color {
    l: number
    a: number
    b: number
    alpha: number
    /** The hue an oklch color was written with, kept for mixing in oklch. */
    hue?: number
}

export type Value =
    | { kind: 'color'; color: Color }
    | { kind: 'px'; px: number }
    | { kind: 'em'; em: number }
    | { kind: 'ms'; ms: number }
    | { kind: 'number'; n: number }

const REM = 16

// Oklab and sRGB, after Björn Ottosson's reference.

function linear(c: number): number {
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function gamma(c: number): number {
    return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

/** An sRGB color, its channels 0 to 1, in Oklab. */
export function srgbToOklab(r: number, g: number, b: number, alpha = 1): Color {
    const [lr, lg, lb] = [linear(r), linear(g), linear(b)]
    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
    return {
        l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
        alpha,
    }
}

/** An Oklab color in sRGB, its channels 0 to 1, clipped. */
export function oklabToSrgb(color: Color): [number, number, number] {
    const l = (color.l + 0.3963377774 * color.a + 0.2158037573 * color.b) ** 3
    const m = (color.l - 0.1055613458 * color.a - 0.0638541728 * color.b) ** 3
    const s = (color.l - 0.0894841775 * color.a - 1.291485548 * color.b) ** 3
    const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    const clip = (c: number) => Math.min(1, Math.max(0, gamma(c)))
    return [clip(r), clip(g), clip(b)]
}

export function oklch(l: number, c: number, h: number, alpha = 1): Color {
    const rad = (h * Math.PI) / 180
    return { l, a: c * Math.cos(rad), b: c * Math.sin(rad), alpha, hue: h }
}

/** A color as `#rrggbb`, or `#rrggbbaa` when it is not opaque. */
export function hex(color: Color): string {
    const byte = (c: number) =>
        Math.round(c * 255)
            .toString(16)
            .padStart(2, '0')
    const [r, g, b] = oklabToSrgb(color)
    const alpha = Math.round(color.alpha * 255)
    return `#${byte(r)}${byte(g)}${byte(b)}${alpha === 255 ? '' : byte(color.alpha)}`
}

function parseHex(text: string): Color | null {
    const match = /^#([0-9a-f]{3,8})$/i.exec(text)
    if (match === null) return null
    let digits = match[1]
    if (digits.length === 3 || digits.length === 4) digits = [...digits].map((d) => d + d).join('')
    if (digits.length !== 6 && digits.length !== 8) return null
    const at = (i: number) => parseInt(digits.slice(i, i + 2), 16) / 255
    return srgbToOklab(at(0), at(2), at(4), digits.length === 8 ? at(6) : 1)
}

const TRANSPARENT: Color = { l: 0, a: 0, b: 0, alpha: 0 }

/** The chroma and hue of an Oklab color; the hue is missing when there is no chroma. */
function polar(color: Color): { c: number; h: number | null } {
    const c = Math.hypot(color.a, color.b)
    if (c < 1e-4 || color.alpha === 0) return { c, h: null }
    const h = color.hue ?? (((Math.atan2(color.b, color.a) * 180) / Math.PI) % 360) + 360
    return { c, h: h % 360 }
}

/** `color-mix()`: two colors, each with its weight from 0 to 1, mixed with premultiplied alpha. */
export function mix(space: 'oklab' | 'oklch', one: Color, p1: number | null, two: Color, p2: number | null): Color {
    let w1 = p1 ?? (p2 === null ? 0.5 : 1 - p2)
    let w2 = p2 ?? 1 - w1
    const sum = w1 + w2
    const scale = sum < 1 ? sum : 1
    w1 /= sum
    w2 /= sum
    const alpha = one.alpha * w1 + two.alpha * w2
    if (alpha === 0) return { ...TRANSPARENT }
    const blend = (x: number, y: number) => (x * one.alpha * w1 + y * two.alpha * w2) / alpha
    if (space === 'oklab') {
        return { l: blend(one.l, two.l), a: blend(one.a, two.a), b: blend(one.b, two.b), alpha: alpha * scale }
    }
    const [q1, q2] = [polar(one), polar(two)]
    const h1 = q1.h ?? q2.h ?? 0
    const h2 = q2.h ?? q1.h ?? 0
    let delta = h2 - h1
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    const h = (h1 + delta * w2 + 360) % 360
    return oklch(blend(one.l, two.l), blend(q1.c, q2.c), h, alpha * scale)
}

// The value grammar: functions, numbers with units, hex, words, commas and operators.

type Token =
    | { t: 'num'; n: number; unit: string }
    | { t: 'word'; s: string }
    | { t: 'hex'; s: string }
    | { t: 'open'; name: string }
    | { t: 'close' }
    | { t: 'comma' }
    | { t: 'op'; s: string }

function lex(text: string): Token[] {
    const tokens: Token[] = []
    const pattern =
        /\s*(?:(#[0-9a-fA-F]+)|([+-]?(?:\d+\.?\d*|\.\d+))(%|[a-zA-Z]+)?|([a-zA-Z][\w-]*)\(|(--[\w-]+|[a-zA-Z][\w-]*)|(\))|(,)|([*/+-]))/y
    let at = 0
    while (at < text.length) {
        pattern.lastIndex = at
        const m = pattern.exec(text)
        if (m === null) {
            if (/^\s*$/.test(text.slice(at))) break
            throw new Unresolvable(text)
        }
        at = pattern.lastIndex
        if (m[1] !== undefined) tokens.push({ t: 'hex', s: m[1] })
        else if (m[2] !== undefined) tokens.push({ t: 'num', n: Number(m[2]), unit: m[3] ?? '' })
        else if (m[4] !== undefined) tokens.push({ t: 'open', name: m[4].toLowerCase() })
        else if (m[5] !== undefined) tokens.push({ t: 'word', s: m[5] })
        else if (m[6] !== undefined) tokens.push({ t: 'close' })
        else if (m[7] !== undefined) tokens.push({ t: 'comma' })
        else if (m[8] !== undefined) tokens.push({ t: 'op', s: m[8] })
    }
    return tokens
}

export class Unresolvable extends Error {}

/** Evaluates values against one flat set of variables, as a browser computes them on one element. */
export class Evaluator {
    private cache = new Map<string, Value>()
    private active = new Set<string>()

    constructor(private vars: Vars) {}

    variable(name: string): Value {
        const cached = this.cache.get(name)
        if (cached !== undefined) return cached
        const raw = this.vars[name]
        if (typeof raw !== 'string' || this.active.has(name)) throw new Unresolvable(name)
        this.active.add(name)
        try {
            const value = this.value(raw)
            this.cache.set(name, value)
            return value
        } finally {
            this.active.delete(name)
        }
    }

    value(text: string): Value {
        const tokens = lex(text)
        let at = 0
        const peek = () => tokens[at]
        const next = () => {
            const token = tokens[at++]
            if (token === undefined) throw new Unresolvable(text)
            return token
        }
        const expect = (t: Token['t']) => {
            const token = next()
            if (token.t !== t) throw new Unresolvable(text)
            return token
        }

        // calc arithmetic over the values below
        const sum = (): Value => {
            let left = product()
            while (peek()?.t === 'op' && ((peek() as { s: string }).s === '+' || (peek() as { s: string }).s === '-')) {
                const op = (next() as { s: string }).s
                left = arith(left, op, product())
            }
            return left
        }
        const product = (): Value => {
            let left = term()
            while (peek()?.t === 'op' && ((peek() as { s: string }).s === '*' || (peek() as { s: string }).s === '/')) {
                const op = (next() as { s: string }).s
                left = arith(left, op, term())
            }
            return left
        }
        const term = (): Value => {
            const token = next()
            if (token.t === 'num') return quantity(token.n, token.unit)
            if (token.t === 'hex') {
                const color = parseHex(token.s)
                if (color === null) throw new Unresolvable(token.s)
                return { kind: 'color', color }
            }
            if (token.t === 'word') {
                if (token.s.toLowerCase() === 'transparent') return { kind: 'color', color: { ...TRANSPARENT } }
                throw new Unresolvable(token.s)
            }
            if (token.t === 'open') {
                if (token.name === 'var') {
                    const name = expect('word') as { s: string }
                    if (peek()?.t === 'comma') throw new Unresolvable('a var() fallback')
                    expect('close')
                    return this.variable(name.s.replace(/^--/, ''))
                }
                if (token.name === 'calc') {
                    const inner = sum()
                    expect('close')
                    return inner
                }
                if (token.name === 'max' || token.name === 'min') {
                    const items = [sum()]
                    while (peek()?.t === 'comma') {
                        next()
                        items.push(sum())
                    }
                    expect('close')
                    return items.reduce((a, b) => {
                        const [x, y] = [px(a), px(b)]
                        return { kind: 'px', px: token.name === 'max' ? Math.max(x, y) : Math.min(x, y) }
                    })
                }
                if (token.name === 'oklch') {
                    const parts = [number(next()), number(next()), number(next())]
                    let alpha = 1
                    if (peek()?.t === 'op' && (peek() as { s: string }).s === '/') {
                        next()
                        alpha = number(next())
                    }
                    expect('close')
                    return { kind: 'color', color: oklch(parts[0], parts[1], parts[2], alpha) }
                }
                if (token.name === 'color-mix') {
                    const how = expect('word') as { s: string }
                    const space = (expect('word') as { s: string }).s
                    if (how.s !== 'in' || (space !== 'oklab' && space !== 'oklch')) throw new Unresolvable(text)
                    expect('comma')
                    const [one, p1] = stop()
                    expect('comma')
                    const [two, p2] = stop()
                    expect('close')
                    return { kind: 'color', color: mix(space, one, p1, two, p2) }
                }
                throw new Unresolvable(`${token.name}()`)
            }
            throw new Unresolvable(text)
        }
        // one color stop of a color-mix: a color with an optional percentage on either side
        const stop = (): [Color, number | null] => {
            let weight: number | null = null
            if (peek()?.t === 'num' && (peek() as { unit: string }).unit === '%') weight = (next() as { n: number }).n / 100
            const value = term()
            if (value.kind !== 'color') throw new Unresolvable(text)
            if (peek()?.t === 'num' && (peek() as { unit: string }).unit === '%') weight = (next() as { n: number }).n / 100
            return [value.color, weight]
        }
        const number = (token: Token): number => {
            if (token.t !== 'num') throw new Unresolvable(text)
            return token.unit === '%' ? token.n / 100 : token.n
        }

        const result = sum()
        if (at !== tokens.length) throw new Unresolvable(text)
        return result
    }
}

function quantity(n: number, unit: string): Value {
    switch (unit) {
        case '':
            return { kind: 'number', n }
        case 'px':
            return { kind: 'px', px: n }
        case 'rem':
            return { kind: 'px', px: n * REM }
        case 'em':
            return { kind: 'em', em: n }
        case 'ms':
            return { kind: 'ms', ms: n }
        case 's':
            return { kind: 'ms', ms: n * 1000 }
        default:
            throw new Unresolvable(unit)
    }
}

export function px(value: Value): number {
    if (value.kind === 'px') return value.px
    if (value.kind === 'number' && value.n === 0) return 0
    throw new Unresolvable('a length')
}

function arith(left: Value, op: string, right: Value): Value {
    if (op === '*' || op === '/') {
        if (right.kind === 'number') {
            const k = op === '*' ? right.n : 1 / right.n
            if (left.kind === 'px') return { kind: 'px', px: left.px * k }
            if (left.kind === 'em') return { kind: 'em', em: left.em * k }
            if (left.kind === 'number') return { kind: 'number', n: left.n * k }
        }
        if (op === '*' && left.kind === 'number') return arith(right, op, left)
        throw new Unresolvable('a product')
    }
    const sign = op === '+' ? 1 : -1
    if (left.kind === 'number' && right.kind === 'number') return { kind: 'number', n: left.n + sign * right.n }
    return { kind: 'px', px: px(left) + sign * px(right) }
}

const round = (n: number) => Math.round(n * 1000) / 1000

/** The curves CSS names, as cubic Béziers. */
const EASINGS: Record<string, [number, number, number, number]> = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    'ease-in': [0.42, 0, 1, 1],
    'ease-out': [0, 0, 0.58, 1],
    'ease-in-out': [0.42, 0, 0.58, 1],
}

/** A variable's value as written, following `var()` to the end when it is nothing more. */
function written(vars: Vars, name: string, seen = new Set<string>()): string | ShadowLayer[] | undefined {
    const raw = vars[name]
    if (raw === undefined || seen.has(name)) return undefined
    seen.add(name)
    const alias = typeof raw === 'string' ? /^var\(--([\w-]+)\)$/.exec(raw.trim()) : null
    return alias === null ? raw : written(vars, alias[1], seen)
}

/** An easing as a cubic Bézier, from `cubic-bezier()` or a curve CSS names; null for anything else. */
function easing(text: string): [number, number, number, number] | null {
    const named = EASINGS[text.trim()]
    if (named !== undefined) return named
    const match = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/.exec(text.trim())
    return match === null ? null : [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4])]
}

/** Every value one set of variables settles, sorted by kind, and its text roles. */
function settle(vars: Vars, keys: [name: string, variable: string][], roles: string[]): ResolvedScheme {
    const evaluator = new Evaluator(vars)
    const out: ResolvedScheme = { colors: {}, lengths: {}, numbers: {}, ems: {}, durations: {}, easings: {}, elevations: {}, words: {}, text: {} }
    // a word or a list of words, such as a font stack, with the variables it names written in
    const word = (key: string, seen = new Set<string>()): string | null => {
        const raw = vars[key]
        if (typeof raw !== 'string' || seen.has(key)) return null
        seen.add(key)
        const text = raw.replace(/var\(--([\w-]+)\)/g, (_, name: string) => word(name, seen) ?? '(')
        return text.includes('(') ? null : text
    }
    for (const [key, variable] of keys) {
        const raw = written(vars, variable)
        if (Array.isArray(raw)) {
            out.elevations[key] = raw.map((layer) => {
                const color = evaluator.value(layer.color)
                if (color.kind !== 'color') throw new Error(`${key}: a layer's color is not a color`)
                return { x: layer.x, y: layer.y, blur: layer.blur, spread: layer.spread, color: hex(color.color) }
            })
            continue
        }
        const curve = typeof raw === 'string' ? easing(raw) : null
        if (curve !== null) {
            out.easings[key] = curve
            continue
        }
        try {
            const value = evaluator.variable(variable)
            if (value.kind === 'color') out.colors[key] = hex(value.color)
            else if (value.kind === 'px') out.lengths[key] = round(value.px)
            else if (value.kind === 'number') out.numbers[key] = round(value.n)
            else if (value.kind === 'ms') out.durations[key] = round(value.ms)
            else out.ems[key] = round(value.em)
        } catch (error) {
            if (!(error instanceof Unresolvable)) throw error
            const text = word(variable)
            if (text !== null) out.words[key] = text
        }
    }
    for (const role of roles) {
        const size = px(evaluator.variable(`text-${role}`))
        const weight = evaluator.variable(`text-${role}--font-weight`)
        const tracking = vars[`text-${role}--letter-spacing`] === undefined ? null : evaluator.variable(`text-${role}--letter-spacing`)
        out.text[role] = {
            size: round(size),
            lineHeight: round(px(evaluator.variable(`text-${role}--line-height`))),
            weight: weight.kind === 'number' ? weight.n : 400,
            tracking: tracking === null ? 0 : tracking.kind === 'em' ? round(tracking.em) : round(px(tracking) / size),
        }
    }
    return out
}

const own = (vars: Vars): Vars => Object.fromEntries(Object.entries(vars).filter(([name]) => !name.startsWith('$')))
const prefixed = (vars: Vars): Vars => Object.fromEntries(Object.entries(vars).map(([name, value]) => [`density-${name}`, value]))

/**
 * Every theme's variables in light and dark, as a browser has them on `<html>`. A theme's light set
 * is tidevann's light with the derived surfaces and the theme's own light over it; its dark set adds
 * tidevann's dark, then the theme's dark, whose missing keys take tidevann's dark value, as
 * sokkel-ui's `scripts/build-tokens.ts` writes the CSS.
 */
export function schemes(tokens: TokenSource, base = 'tidevann'): Record<string, { light: Vars; dark: Vars }> {
    const tidevann = tokens.themes[base]
    const page = { ...tokens.theme, ...prefixed(tokens.density[tokens.density.default] as Vars) }
    const out: Record<string, { light: Vars; dark: Vars }> = {}
    for (const [name, theme] of Object.entries(tokens.themes)) {
        const isBase = name === base
        const light = isBase ? {} : { ...own(tokens.derived.light), ...theme.light }
        const darkOwn = isBase ? {} : { ...own(tokens.derived.dark), ...theme.dark }
        for (const key of Object.keys(light)) {
            if (!(key in darkOwn)) darkOwn[key] = tidevann.dark[key] ?? tidevann.light[key]
        }
        out[name] = {
            light: { ...page, ...tidevann.light, ...light },
            dark: { ...page, ...tidevann.light, ...tidevann.dark, ...light, ...darkOwn },
        }
    }
    return out
}

/** The tokens resolved, read at a sokkel-ui commit, every theme in light and dark (see `schemes`). */
export function resolveTokens(tokens: TokenSource, sokkelUi: { repo: string; commit: string }, base = 'tidevann'): ResolvedTokens {
    const tidevann = tokens.themes[base]
    const densityDefault = tokens.density.default
    const levels = Object.keys(tokens.density).filter((key) => key !== 'default' && !key.startsWith('$'))
    const roles = Object.keys(tokens.theme)
        .filter((key) => key.startsWith('text-') && key.endsWith('--font-weight'))
        .map((key) => key.slice('text-'.length, -'--font-weight'.length))
    // Every token by its own name, then what the utility classes name besides: the corners and
    // spacings, and the colors a class paints that no theme sets by that name (`text-good-ink`).
    const keys: [string, string][] = [
        ...Object.keys(tidevann.light).map((key): [string, string] => [key, key]),
        ...Object.keys(tokens.theme)
            .filter((key) => key.startsWith('radius-') || key.startsWith('spacing-') || key.startsWith('breakpoint-'))
            .map((key): [string, string] => [key, key]),
        ...Object.keys(tokens.theme)
            .filter((key) => key.startsWith('color-') && !(key.slice('color-'.length) in tidevann.light))
            .map((key): [string, string] => [key.slice('color-'.length), key]),
    ]

    const themes: ResolvedTokens['themes'] = {}
    for (const [name, vars] of Object.entries(schemes(tokens, base))) {
        const theme = tokens.themes[name]
        themes[name] = {
            label: theme.$label ?? name.charAt(0).toUpperCase() + name.slice(1),
            ...(theme.$description === undefined ? {} : { description: theme.$description }),
            light: settle(vars.light, keys, roles),
            dark: settle(vars.dark, keys, roles),
        }
    }

    const density: ResolvedTokens['density'] = {}
    for (const level of levels) {
        const vars = prefixed(tokens.density[level] as Vars)
        const evaluator = new Evaluator(vars)
        density[level] = {}
        for (const key of Object.keys(tokens.density[level] as Vars)) {
            try {
                density[level][key] = round(px(evaluator.variable(`density-${key}`)))
            } catch (error) {
                if (!(error instanceof Unresolvable)) throw error
            }
        }
    }

    return {
        $description:
            "Generated by sokkel-design's scripts/resolve.ts from sokkel-ui's packages/core/tokens/tokens.json at the commit sokkel-ui.json pins, and from the part and pattern specs, for renderers that read no CSS. Colors are sRGB hex, lengths px, tracking em, durations ms; paints are the colors and rings every spec paints, resolved per theme and scheme.",
        sokkelUi: { repo: sokkelUi.repo, commit: sokkelUi.commit },
        default: { theme: base, density: densityDefault },
        themes,
        density,
    }
}

/**
 * Every token a theme sets that its resolved light or dark set leaves out, by name: the values the
 * evaluator could not settle. Density levels count too, as `density.<key>`.
 */
export function unresolved(tokens: TokenSource, resolved: ResolvedTokens): string[] {
    const missing = new Set<string>()
    for (const [name, theme] of Object.entries(resolved.themes)) {
        const keys = new Set([...Object.keys(tokens.themes.tidevann.light), ...Object.keys(tokens.themes[name].light)])
        for (const scheme of [theme.light, theme.dark]) {
            for (const key of keys) {
                if (key.startsWith('$')) continue
                const found = [
                    scheme.colors,
                    scheme.lengths,
                    scheme.numbers,
                    scheme.ems,
                    scheme.durations,
                    scheme.easings,
                    scheme.elevations,
                    scheme.words,
                ].some((set) => key in set)
                if (!found) missing.add(key)
            }
        }
    }
    for (const [level, lengths] of Object.entries(resolved.density)) {
        for (const key of Object.keys(tokens.density[level] as Vars)) {
            if (!(key in lengths)) missing.add(`density.${key}`)
        }
    }
    return [...missing].sort()
}
