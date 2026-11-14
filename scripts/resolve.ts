/**
 * Resolve sokkel-ui's tokens and the specs' paints into tokens/tokens.resolved.json, the plain values
 * a renderer that reads no CSS draws with: tokens.json read at the sokkel-ui commit sokkel-ui.json
 * pins (scripts/sokkel-ui.ts), and every part and pattern index.json lists.
 *
 *   bun scripts/resolve.ts                          write the resolved file from the pinned commit
 *   bun scripts/resolve.ts --ref main               move the pin to a branch, tag or commit, and write it from there
 *   bun scripts/resolve.ts --from ../sokkel-ui      write it from a sokkel-ui checkout as it stands, the pin left as it is
 *   bun scripts/resolve.ts --check [--from <dir>]   fail when the file is not what the tokens and the specs make
 *
 * Either way it fails when a token is left unresolved that is not in index.json's `tokens.cssOnly`:
 * a value written in a form the evaluator does not know yet, which would otherwise only show as a
 * renderer asking for a token that is not there.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { paintsOf, type ResolvedPaint, type Spec } from './paints.ts'
import { resolveTokens, schemes, unresolved, type TokenSource } from './resolve-tokens.ts'
import { ROOT, sokkelUi } from './sokkel-ui.ts'

const TARGET = join(ROOT, 'tokens', 'tokens.resolved.json')
const index = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8')) as {
    tokens: { cssOnly: string[] }
    parts: { file: string }[]
    patterns: { file: string }[]
}

const source = sokkelUi()
const tokens = JSON.parse(source.read('packages/core/tokens/tokens.json')) as TokenSource
const result = resolveTokens(tokens, source)
const unknown = unresolved(tokens, result).filter((key) => !index.tokens.cssOnly.includes(key))
if (unknown.length > 0) {
    console.error(
        `tokens the resolver cannot settle: ${unknown.join(', ')}; teach scripts/resolve-tokens.ts their form, or list them in index.json's tokens.cssOnly`,
    )
    process.exit(1)
}

const specs = [...index.parts, ...index.patterns].map((entry) => JSON.parse(readFileSync(join(ROOT, entry.file), 'utf8')) as Spec)
// Each paint's expressions are the same in every theme, so they are kept once per scheme, beside the paints.
const sources: Record<'light' | 'dark', Record<string, Record<string, string>>> = { light: {}, dark: {} }
const withoutSource = (scheme: 'light' | 'dark', paints: Record<string, ResolvedPaint>) =>
    Object.fromEntries(
        Object.entries(paints).map(([key, { source, ...paint }]) => {
            const known = sources[scheme][key]
            if (known === undefined) sources[scheme][key] = source
            else if (JSON.stringify(known) !== JSON.stringify(source)) throw new Error(`${key}: its expressions differ between themes`)
            return [key, paint]
        }),
    )
try {
    result.paints = Object.fromEntries(
        Object.entries(schemes(tokens)).map(([theme, vars]) => [
            theme,
            { light: withoutSource('light', paintsOf(specs, vars.light, false)), dark: withoutSource('dark', paintsOf(specs, vars.dark, true)) },
        ]),
    )
} catch (error) {
    // A spec that names a token this sokkel-ui lacks: the pin is behind the specs, or the spec is wrong.
    console.error(`${error instanceof Error ? error.message : String(error)} (sokkel-ui at ${source.commit})`)
    process.exit(1)
}
result.paintSources = sources

/** The objects written on one line: every paint and every paint's expressions. */
const oneLine = new Set<object>([
    ...Object.values(result.paints).flatMap((theme) => [...Object.values(theme.light), ...Object.values(theme.dark)]),
    ...Object.values(sources.light),
    ...Object.values(sources.dark),
])

/** The file as JSON with 4-space indents, each paint on a line of its own. */
function written(value: unknown, indent = ''): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value)
    const inner = `${indent}    `
    if (Array.isArray(value)) {
        if (value.every((one) => typeof one !== 'object' || one === null)) return JSON.stringify(value).replaceAll(',', ', ')
        return `[\n${value.map((one) => inner + written(one, inner)).join(',\n')}\n${indent}]`
    }
    const entries = Object.entries(value)
    if (entries.length === 0) return '{}'
    // A paint, its expressions, an elevation's layer: one line each.
    if (oneLine.has(value) || ('blur' in value && 'spread' in value)) return JSON.stringify(value).replaceAll('":', '": ').replaceAll(',"', ', "')
    return `{\n${entries.map(([key, one]) => `${inner}${JSON.stringify(key)}: ${written(one, inner)}`).join(',\n')}\n${indent}}`
}
const resolved = `${written(result)}\n`
const count = Object.values(result.paints).reduce((sum, theme) => sum + Object.keys(theme.light).length + Object.keys(theme.dark).length, 0)
const said = `sokkel-ui at ${source.commit}${source.checkout === undefined ? '' : ` (${source.checkout})`}`

if (process.argv.includes('--check')) {
    if (!existsSync(TARGET) || readFileSync(TARGET, 'utf8') !== resolved) {
        console.error(`${TARGET} is not what ${said}'s tokens and the specs make: run bun scripts/resolve.ts`)
        process.exit(1)
    }
    console.log(`tokens/tokens.resolved.json matches ${said} and the specs: ${String(count)} paints`)
} else {
    writeFileSync(TARGET, resolved)
    console.log(`wrote tokens/tokens.resolved.json from ${said}: ${String(count)} paints`)
}
