/**
 * Check the resolved file against a browser: draw sokkel-ui's own generated CSS (tokens.css and every
 * theme file) in Chromium, and compare with tokens/tokens.resolved.json, every theme in light and
 * dark: each color token a theme sets, each elevation's layers, and each paint's colors, drawn from
 * the expression `paintSources` keeps (`primary/80` as `color-mix(in oklab, var(--primary) 80%,
 * transparent)`, as Tailwind's `bg-primary/80` draws it).
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

import { css } from './paints.ts'
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
/** How far apart two colors are, out of 255; a nearly transparent color's channels mean little, so only its alpha counts. */
const apart = (ours: number[], theirs: number[]) => {
    const channels = ours[3] < 40 ? [3] : [0, 1, 2, 3]
    return Math.max(...channels.map((i) => Math.abs(ours[i] - theirs[i])))
}

interface Drawn {
    colors: Record<string, number[]>
    shadows: Record<string, { color: number[]; lengths: number[] }[]>
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
                if (expr === 'inherit') continue
                draw[`paint ${key}.${field}`] = css(expr, named)
            }
        }
        const elevations = Object.keys(set.elevations ?? {})
        const drawn: Drawn = await page.evaluate(
            ({ name, scheme, draw, elevations }) => {
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
                return { colors, shadows }
            },
            { name, scheme, draw, elevations },
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
console.log(`all ${String(compared)} token colors, paint colors and elevations match the browser within ${String(TOLERANCE)}/255`)
