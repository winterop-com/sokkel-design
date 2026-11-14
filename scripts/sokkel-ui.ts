/**
 * sokkel-ui as the contract's scripts read it: its files at the commit `sokkel-ui.json` pins,
 * fetched over git (never the GitHub API), or a local checkout's working files with `--from`.
 *
 *   --from <checkout>   read a sokkel-ui checkout as it stands, uncommitted changes included; the pin is not moved
 *   --ref <ref>         move the pin to the commit a branch, tag or commit names, and read it there
 *
 * Without either, the pinned commit is fetched once into `.sokkel-ui/` (ignored by git) and read
 * from there.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const ROOT = resolve(import.meta.dirname, '..')
const PIN = join(ROOT, 'sokkel-ui.json')
const CACHE = join(ROOT, '.sokkel-ui')

export interface Pin {
    $description?: string
    repo: string
    commit: string
}

/** sokkel-ui at one commit: a file's text, the names in a folder, and the commit read. */
export interface SokkelUi {
    repo: string
    commit: string
    /** The local checkout read with `--from`, which holds its own install (Playwright, for verify-colors). */
    checkout?: string
    read: (path: string) => string
    list: (dir: string) => string[]
}

function git(args: string[], cwd?: string): string {
    return execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120_000,
        env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    })
}

export function pin(): Pin {
    return JSON.parse(readFileSync(PIN, 'utf8')) as Pin
}

function option(name: string): string | undefined {
    const at = process.argv.indexOf(name)
    if (at < 0) return undefined
    const value = process.argv[at + 1]
    if (value === undefined || value.startsWith('--')) throw new Error(`${name} takes a value`)
    return value
}

/** The pinned commit's tree in `.sokkel-ui/`, fetched once; a ref is fetched and named by its commit. */
function fetched(repo: string, ref: string): string {
    if (!existsSync(join(CACHE, '.git'))) {
        mkdirSync(CACHE, { recursive: true })
        git(['init', '-q'], CACHE)
    }
    const known = (() => {
        try {
            return git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], CACHE).trim()
        } catch {
            return ''
        }
    })()
    if (known !== '' && /^[0-9a-f]{40}$/.test(ref)) return known
    git(['fetch', '-q', '--depth', '1', repo, ref], CACHE)
    return git(['rev-parse', 'FETCH_HEAD'], CACHE).trim()
}

/** sokkel-ui as the command line asks: `--from` a checkout, `--ref` to move the pin, else the pin. */
export function sokkelUi(): SokkelUi {
    const from = option('--from')
    const ref = option('--ref')
    const pinned = pin()
    if (from !== undefined) {
        const dir = resolve(from)
        const commit = git(['rev-parse', 'HEAD'], dir).trim()
        const changed = git(['status', '--porcelain', '--', 'packages/core/tokens', 'packages/core/src/styles'], dir).trim()
        if (changed !== '') console.error(`note: ${dir} has uncommitted token changes; read as they stand, the pin left at ${pinned.commit}`)
        return {
            repo: pinned.repo,
            commit,
            checkout: dir,
            read: (path) => readFileSync(join(dir, path), 'utf8'),
            list: (path) => readdirSync(join(dir, path)).sort(),
        }
    }
    const commit = fetched(pinned.repo, ref ?? pinned.commit)
    if (ref !== undefined && commit !== pinned.commit) {
        writeFileSync(PIN, `${JSON.stringify({ ...pinned, commit }, null, 4)}\n`)
        console.log(`sokkel-ui.json now pins ${pinned.repo} at ${commit}`)
    }
    return {
        repo: pinned.repo,
        commit,
        read: (path) => git(['show', `${commit}:${path}`], CACHE),
        list: (path) =>
            git(['ls-tree', '--name-only', `${commit}:${path}`], CACHE)
                .split('\n')
                .filter(Boolean)
                .sort(),
    }
}
