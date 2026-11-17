/**
 * The page's script: the theme and scheme switches, kept per reader, and every value on the page
 * drawn again for the theme and scheme picked.
 */
import { lookup, view, type PageData } from './shared.ts'

const root = document.documentElement
const dark = window.matchMedia('(prefers-color-scheme: dark)')

function remember(key: string, value: string) {
    try {
        if (value) localStorage.setItem(key, value)
        else localStorage.removeItem(key)
    } catch {
        // A reader without storage keeps the choice for this page only.
    }
}

function readData(): PageData | null {
    const el = document.getElementById('page-data')
    if (!el?.textContent) return null
    try {
        return JSON.parse(el.textContent) as PageData
    } catch {
        return null
    }
}

const data = readData()

function current() {
    const theme = root.dataset.theme || 'tidevann'
    const pick = root.dataset.scheme || ''
    const scheme = pick || (dark.matches ? 'dark' : 'light')
    return { theme, pick, scheme }
}

function draw() {
    const { theme, pick, scheme } = current()
    for (const el of document.querySelectorAll<HTMLSelectElement>('[data-switch=theme]')) el.value = theme
    for (const el of document.querySelectorAll<HTMLButtonElement>('[data-scheme-pick]')) {
        el.setAttribute('aria-pressed', String(el.dataset.schemePick === pick))
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-theme-pick]')) {
        el.setAttribute('aria-pressed', String(el.dataset.themePick === theme))
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-shows-scheme]')) el.textContent = scheme
    if (!data) return
    for (const el of document.querySelectorAll<HTMLElement>('[data-v]')) {
        const v = view(el.dataset.as ?? '', lookup(data, theme, scheme, el.dataset.v ?? ''))
        const target = v.on === 'self' ? el : el.querySelector<HTMLElement>('.mark')
        if (target) for (const [k, val] of Object.entries(v.style)) target.style.setProperty(k, val)
        const text = el.querySelector('.val')
        if (text && v.on === 'mark') text.textContent = v.text
        el.classList.toggle('missing', lookup(data, theme, scheme, el.dataset.v ?? '') === undefined)
    }
}

function setTheme(theme: string) {
    root.dataset.theme = theme
    remember('sokkel-design-theme', theme === 'tidevann' ? '' : theme)
    draw()
}

function setScheme(scheme: string) {
    if (scheme) root.dataset.scheme = scheme
    else delete root.dataset.scheme
    remember('sokkel-design-scheme', scheme)
    draw()
}

document.addEventListener('change', (e) => {
    const t = e.target as HTMLElement
    if (t instanceof HTMLSelectElement && t.dataset.switch === 'theme') setTheme(t.value)
})
document.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-scheme-pick], [data-theme-pick]')
    if (!t) return
    if (t.dataset.schemePick !== undefined) setScheme(t.dataset.schemePick)
    else if (t.dataset.themePick) setTheme(t.dataset.themePick)
})
dark.addEventListener('change', draw)
draw()

// The bar stays at the top as the page scrolls; a jump to a heading stops below it, however tall
// the bar wraps.
const top = document.querySelector<HTMLElement>('.top')
if (top !== null) {
    const measure = () => document.documentElement.style.setProperty('--top-height', `${String(top.offsetHeight + 8)}px`)
    measure()
    new ResizeObserver(measure).observe(top)
}
