/**
 * Check the resolved file against a browser: draw sokkel-ui's own generated CSS (tokens.css and every
 * theme file) in Chromium, and compare with tokens/tokens.resolved.json, every theme in light and
 * dark: each color token a theme sets, each elevation's layers, and each paint's colors, drawn from
 * the expression `paintSources` keeps (`primary/80` as `color-mix(in oklab, var(--primary) 80%,
 * transparent)`, as Tailwind's `bg-primary/80` draws it). Each paint's `flat` and `faded` forms are
 * drawn too: the surface it stands on filled on a canvas, its ground and then the field laid over it,
 * and for `faded` that whole stack laid over the surface again at the state's opacity; the same
 * over each other surface a spec names in `alsoStandsOn` (`flatOn`, `fadedOn`).
 *
 *   bun scripts/verify-colors.ts --from ../sokkel-ui
 *
 * It reads a sokkel-ui checkout, its CSS generated (`bun run tokens`) and its dependencies installed,
 * since Playwright and its Chromium come from that install: the checkout at the pinned commit in CI.
 * A token only the utility classes name (`good-ink`, an alias of a status ink) has no variable of its
 * own on the page, so it is compared where a paint names it, through the class's own value.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { css, inkOf, type Spec } from './paints.ts'
import type { ResolvedLayer, ResolvedTokens, TokenSource } from './resolve-tokens.ts'
import { ROOT, sokkelUi } from './sokkel-ui.ts'

const source = sokkelUi()
if (source.checkout === undefined) {
    console.error('verify-colors draws sokkel-ui in Chromium from its own install: give it a checkout, --from <sokkel-ui>')
    process.exit(1)
}
const { chromium } = createRequire(join(source.checkout, 'package.json'))('@playwright/test') as typeof import('@playwright/test')
const tokens = JSON.parse(source.read('packages/core/tokens/tokens.json')) as TokenSource
const resolved = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.resolved.json'), 'utf8')) as ResolvedTokens
let sheet = source.read('packages/core/src/styles/tokens.css')
for (const file of source.list('packages/core/src/styles/themes')) sheet += source.read(`packages/core/src/styles/themes/${file}`)

/** The most a channel may differ, out of 255: rounding on either side. */
const TOLERANCE = 2
/** The most a shadow's length may differ, in px. */
const LENGTH_TOLERANCE = 0.01

/** Every variable a theme sets, which the page has; a name only the classes know is drawn by the class's own value. */
const onPage = new Set(Object.keys(tokens.themes.tidevann.light))
const named = (token: string): string => {
    if (onPage.has(token)) return `var(--${token})`
    const alias = tokens.theme[`color-${token}`]
    if (typeof alias === 'string') return alias
    throw new Error(`${token} is neither a variable on the page nor a color class`)
}

const bytes = (hex: string) => [1, 3, 5, 7].map((i) => (i < hex.length ? parseInt(hex.slice(i, i + 2), 16) : 255))
/**
 * How far apart two colors are, out of 255; a nearly transparent color's channels mean little, so
 * only its alpha counts. A partly transparent color's channels come back from the canvas through
 * premultiplied bytes, good only to 255 / alpha, so that much less a step is taken off them.
 */
const apart = (ours: number[], theirs: number[]) => {
    if (ours[3] < 40) return Math.abs(ours[3] - theirs[3])
    const slack = ours[3] < 255 ? Math.ceil(255 / ours[3]) - 1 : 0
    const channels = [0, 1, 2].map((i) => Math.max(Math.abs(ours[i] - theirs[i]) - slack, 0))
    return Math.max(Math.abs(ours[3] - theirs[3]), ...channels)
}

interface Drawn {
    colors: Record<string, number[]>
    shadows: Record<string, { color: number[]; lengths: number[] }[]>
}

const index = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8')) as { parts: { file: string }[]; patterns: { file: string }[] }
const specs = new Map(
    [...index.parts, ...index.patterns].map((entry) => {
        const spec = JSON.parse(readFileSync(join(ROOT, entry.file), 'utf8')) as Spec
        return [spec.id, spec]
    }),
)
const hasToken = (token: string) => onPage.has(token) || typeof tokens.theme[`color-${token}`] === 'string'

/** A stack of colors laid on a canvas in order, the first opaque; with `opacity`, the stack laid at it over its first color. */
interface Stack {
    layers: string[]
    opacity?: number
}

/** What a paint's flat and faded fields are drawn from: the surface, the ground, then the field. */
function stacks(key: string, paint: Record<string, unknown>, source: Record<string, string>, numbers: Record<string, number>): Record<string, Stack> {
    const out: Record<string, Stack> = {}
    const spec = specs.get(key.split('.')[0])
    // Over standsOn the kinds are `flat` and `faded`; over another surface S, `flat@S` and `faded@S`.
    const over = (surface: string, flat: object | undefined, faded: Record<string, object> | undefined, at: string) => {
        const expr = (ref: string) => css(ref === 'inherit' ? inkOf(surface, hasToken) : ref, named)
        const under = (field: string, ring?: { inset?: string }) => {
            const base = [expr(surface)]
            if (field === 'ground' || field === 'outline' || (field === 'ring' && ring?.inset === undefined)) return base
            return source.ground === undefined ? base : [...base, expr(source.ground)]
        }
        const stackOf = (field: string) => [...under(field, paint[field] as { inset?: string } | undefined), expr(source[field])]
        for (const field of Object.keys(flat ?? {})) out[`flat${at} ${key}.${field}`] = { layers: stackOf(field) }
        for (const [state, fields] of Object.entries(faded ?? {})) {
            const given = spec?.states[state]?.effect?.opacity
            const opacity = typeof given === 'number' ? given : numbers[String(given)]
            for (const field of Object.keys(fields)) out[`faded${at} ${key}.${state}.${field}`] = { layers: stackOf(field), opacity }
        }
    }
    over(source.standsOn, paint.flat as object | undefined, paint.faded as Record<string, object> | undefined, '')
    const flatOn = (paint.flatOn ?? {}) as Record<string, object>
    const fadedOn = (paint.fadedOn ?? {}) as Record<string, Record<string, object>>
    for (const surface of new Set([...Object.keys(flatOn), ...Object.keys(fadedOn)])) over(surface, flatOn[surface], fadedOn[surface], `@${surface}`)
    return out
}

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(`<style>${sheet}</style><div id="probe"></div><canvas id="canvas" width="1" height="1"></canvas>`)
let compared = 0
const wrong: string[] = []
for (const [name, theme] of Object.entries(resolved.themes)) {
    for (const scheme of ['light', 'dark'] as const) {
        const set = theme[scheme]
        // What to draw: each color token by its variable, each paint field by its expression, each elevation's box-shadow.
        const draw: Record<string, string> = {}
        for (const key of Object.keys(set.colors).filter((one) => onPage.has(one))) draw[`token ${key}`] = `var(--${key})`
        const paints = resolved.paints?.[name]?.[scheme] ?? {}
        const sources = resolved.paintSources?.[scheme] ?? {}
        for (const [key, fields] of Object.entries(sources)) {
            for (const [field, expr] of Object.entries(fields)) {
                if (expr === 'inherit' || field === 'standsOn') continue
                draw[`paint ${key}.${field}`] = css(expr, named)
            }
        }
        const stacked: Record<string, Stack> = {}
        for (const [key, paint] of Object.entries(paints)) {
            const source = sources[key]
            if (source !== undefined) Object.assign(stacked, stacks(key, paint as Record<string, unknown>, source, set.numbers))
        }
        const elevations = Object.keys(set.elevations ?? {})
        const drawn: Drawn & { stacked: Record<string, number[]> } = await page.evaluate(
            ({ name, scheme, draw, elevations, stacked }) => {
                const html = document.documentElement
                html.classList.toggle('dark', scheme === 'dark')
                if (name === 'tidevann') html.removeAttribute('data-theme')
                else html.setAttribute('data-theme', name)
                const probe = document.getElementById('probe') as HTMLElement
                const canvas = document.getElementById('canvas') as HTMLCanvasElement
                const context = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
                const paint = (color: string) => {
                    context.clearRect(0, 0, 1, 1)
                    context.fillStyle = color
                    context.fillRect(0, 0, 1, 1)
                    return [...context.getImageData(0, 0, 1, 1).data]
                }
                const colors: Record<string, number[]> = {}
                for (const [key, value] of Object.entries(draw)) {
                    probe.style.backgroundColor = ''
                    probe.style.backgroundColor = value
                    colors[key] = probe.style.backgroundColor === '' ? [-1, -1, -1, -1] : paint(getComputedStyle(probe).backgroundColor)
                }
                // A computed box-shadow, layer by layer: its color, then x, y, blur and spread in px.
                const shadows: Record<string, { color: number[]; lengths: number[] }[]> = {}
                for (const key of elevations) {
                    probe.style.boxShadow = `var(--${key})`
                    const text = getComputedStyle(probe).boxShadow
                    const layers: string[] = []
                    let depth = 0
                    let start = 0
                    for (let at = 0; at < text.length; at += 1) {
                        if (text[at] === '(') depth += 1
                        else if (text[at] === ')') depth -= 1
                        else if (text[at] === ',' && depth === 0) {
                            layers.push(text.slice(start, at))
                            start = at + 1
                        }
                    }
                    layers.push(text.slice(start))
                    shadows[key] = layers.map((layer) => {
                        const color = /^\s*([a-z-]+\([^)]*\)|#[0-9a-f]+|[a-z]+)/i.exec(layer)?.[1] ?? ''
                        const lengths = [...layer.slice(color.length + (layer.length - layer.trimStart().length)).matchAll(/(-?[\d.]+)px/g)].map(
                            (match) => Number(match[1]),
                        )
                        return { color: paint(color), lengths }
                    })
                }
                // A stack laid on the canvas as a browser composites it; with an opacity, laid at it over its surface.
                const layer = document.createElement('canvas')
                layer.width = 1
                layer.height = 1
                const under = layer.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D
                const resolvedColor = (value: string) => {
                    probe.style.backgroundColor = ''
                    probe.style.backgroundColor = value
                    return getComputedStyle(probe).backgroundColor
                }
                const result: Record<string, number[]> = {}
                for (const [key, { layers, opacity }] of Object.entries(stacked)) {
                    under.clearRect(0, 0, 1, 1)
                    for (const one of layers) {
                        under.fillStyle = resolvedColor(one)
                        under.fillRect(0, 0, 1, 1)
                    }
                    context.clearRect(0, 0, 1, 1)
                    context.fillStyle = resolvedColor(layers[0])
                    context.fillRect(0, 0, 1, 1)
                    context.globalAlpha = opacity ?? 1
                    context.drawImage(layer, 0, 0)
                    context.globalAlpha = 1
                    result[key] = [...context.getImageData(0, 0, 1, 1).data]
                }
                return { colors, shadows, stacked: result }
            },
            { name, scheme, draw, elevations, stacked },
        )
        for (const key of Object.keys(draw)) {
            const [kind, path] = key.split(' ')
            const hex =
                kind === 'token'
                    ? set.colors[path]
                    : (() => {
                          const at = path.lastIndexOf('.')
                          const paint = paints[path.slice(0, at)] as Record<string, unknown> | undefined
                          const field = path.slice(at + 1)
                          const value = paint?.[field]
                          return typeof value === 'object' && value !== null ? (value as { color: string }).color : (value as string | undefined)
                      })()
            const theirs = drawn.colors[key]
            compared++
            if (hex === undefined) wrong.push(`${name} ${scheme} ${key}: not in the resolved file`)
            else if (theirs[0] < 0) wrong.push(`${name} ${scheme} ${key}: the browser cannot draw ${draw[key]}`)
            else if (apart(bytes(hex), theirs) > TOLERANCE) wrong.push(`${name} ${scheme} ${key}: resolved ${hex}, browser rgba(${theirs.join(', ')})`)
        }
        for (const key of Object.keys(stacked)) {
            const [kinded, path] = key.split(' ')
            const [kind, surface] = kinded.split('@')
            const at = path.lastIndexOf('.')
            const field = path.slice(at + 1)
            type Opaque = {
                flat?: Record<string, string>
                faded?: Record<string, Record<string, string>>
                flatOn?: Record<string, Record<string, string>>
                fadedOn?: Record<string, Record<string, Record<string, string>>>
            }
            const value =
                kind === 'flat'
                    ? (() => {
                          const paint = paints[path.slice(0, at)] as Opaque | undefined
                          return (surface === undefined ? paint?.flat : paint?.flatOn?.[surface])?.[field]
                      })()
                    : (() => {
                          const rest = path.slice(0, at)
                          const cut = rest.lastIndexOf('.')
                          const paint = paints[rest.slice(0, cut)] as Opaque | undefined
                          return (surface === undefined ? paint?.faded : paint?.fadedOn?.[surface])?.[rest.slice(cut + 1)]?.[field]
                      })()
            const theirs = drawn.stacked[key]
            compared++
            if (value === undefined) wrong.push(`${name} ${scheme} ${key}: not in the resolved file`)
            else if (apart(bytes(value), theirs) > TOLERANCE) wrong.push(`${name} ${scheme} ${key}: resolved ${value}, browser rgba(${theirs.join(', ')})`)
        }
        for (const key of elevations) {
            const ours: ResolvedLayer[] = set.elevations[key]
            const theirs = drawn.shadows[key]
            compared++
            const same =
                theirs.length === ours.length &&
                ours.every((layer, at) => {
                    const lengths = [layer.x, layer.y, layer.blur, layer.spread]
                    return (
                        lengths.every((one, i) => Math.abs(one - (theirs[at].lengths[i] ?? Number.NaN)) <= LENGTH_TOLERANCE) &&
                        apart(bytes(layer.color), theirs[at].color) <= TOLERANCE
                    )
                })
            if (!same) wrong.push(`${name} ${scheme} ${key}: resolved ${JSON.stringify(ours)}, browser ${JSON.stringify(theirs)}`)
        }
    }
}
await browser.close()
if (wrong.length > 0) {
    console.error(`${String(wrong.length)} of ${String(compared)} colors and elevations differ from the browser:\n${wrong.join('\n')}`)
    process.exit(1)
}
console.log(`all ${String(compared)} token colors, paint colors (flat and faded forms included) and elevations match the browser within ${String(TOLERANCE)}/255`)
