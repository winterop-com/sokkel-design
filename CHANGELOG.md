# Changelog

The contract's version moves in lockstep with sokkel-ui before 1.0 (open questions, D3): each entry
is the sokkel-ui release that ships it, and a breaking change moves the minor. Parts have no version
of their own (D4); a change to a part is a line here under its name.

## 0.28.0

The first version, carrying out the open questions the owner decided on 2026-11-14.

### The contract

- `index.json` has a `version` (0.28.0, sokkel-ui's) in place of `contract`, a `status` for every
  part and pattern, `tokens.pin`, and `changelog`. Stable: button, table, rail, top bar, status
  line, page header, page state, select, dropdown menu, tooltip, dialog, settings dialog, command
  palette, and the shell. Draft: section and text field, which egui has not built from their specs
  yet (README, "Versions and status").
- `sokkel-ui.json` pins the sokkel-ui commit whose `tokens.json` the contract reads (D1).
- The resolver moved here from sokkel-ui-egui, in TypeScript (D2): `scripts/resolve.ts` writes
  `tokens/tokens.resolved.json` from the pinned commit, or from a checkout with `--from`. It now
  resolves durations (`durations`, in ms), easing curves (`easings`), structured elevations
  (`elevations`), the breakpoints, and every paint the specs name (`paints`, with their expressions
  in `paintSources`). The resolved file says the sokkel-ui commit it was made from.
- `verify-colors` moved here too, and checks the paints and elevations besides every color token
  (18044 comparisons), against the CSS the pinned sokkel-ui generates.
- `.github/workflows/contract.yaml` runs the resolver's check, `check.py`, `fmt.py` and
  `verify-colors` against the pinned sokkel-ui.
- `check.py` reads `tokens/tokens.resolved.json`, and also fails a resolved file made from another
  commit than the pin, a part whose status differs from the index's, a word that interpolates or
  counts without samples, and resolved paints that break `schema/paints.schema.json`.
- A paint's ring with an offset is resolved as an `outline`, which stacks with a `ring`, so a
  button's invalid ring and its focus outline both show (`schema/paints.schema.json`).
- Principle 20: every color and ring a spec paints is drawn from the resolved paints; colors an app
  supplies at run time stay free (D10).
- Plans recorded: patterns as egui apps need them (D5), one app shape as data (D6), the shell's gate
  for egui (D7, `patterns/shell.md`), specimens copying the web story's data (D8).

### Tokens

Adopted in sokkel-ui's `tokens.json`, and named by the specs where they gave the values:
`focus-ring-width` and `focus-ring-offset` (2 and 2), `invalid-ring` (`critical` at 20 percent, 40
in dark) and `invalid-ring-width` (3), `disabled-opacity` (0.5), `motion-fast` (100 ms),
`motion-base` (200 ms) and `motion-ease` (ease-out), `layer-drawer`, `layer-dialog`,
`layer-popover` and `layer-toast` (40, 50, 60, 70), `elevation-dialog` (`elevation-pop` for now),
`breakpoint-md` and `breakpoint-lg` (768 and 1024), and `scrollbar-width` (10). Every elevation is
now layers of x, y, blur, spread and color. `page-title-ink` and `section-head-ink` fall back to
`foreground` in the tokens.

### Schema

- A color no longer takes the `a|b` fallback form; the inks it served fall back in the tokens.
- A ring's `width` and `offset` take a length token as well as px; an `opacity` takes a number token
  (`disabled-opacity`); a `layout` value takes a duration token (`motion-fast`); a breakpoint's
  `width` takes a breakpoint token (`below breakpoint-md`).
- `samples`: what a word said as a function says at zero, one and many and with each value it
  interpolates (D9).

### Parts

- button: focus `focus-ring-width` and `focus-ring-offset`; disabled `disabled-opacity`; the invalid
  ring `invalid-ring` and `invalid-ring-width`; `phoneBelow` `breakpoint-md`. Stable.
- command-palette: a disabled row at `disabled-opacity`; samples for `searchFailed` and `seeAll`.
  Stable.
- dialog: a shut confirm at `disabled-opacity`; it opens over `motion-fast` on `layer-dialog`.
  Stable.
- dropdown-menu: disabled rows at `disabled-opacity`; it opens over `motion-fast` on
  `layer-popover`. Stable.
- page-header: the title in `page-title-ink`; the back button's focus by the focus ring tokens.
  Stable.
- page-state: stable.
- rail: the home, collapse and strip entries' focus by the focus ring tokens; the width eases over
  `motion-base`. Stable.
- section: the heads in `section-head-ink`. Draft.
- select: disabled at `disabled-opacity`; the invalid ring by its tokens; the list opens over
  `motion-fast` on `layer-popover`. Stable.
- settings-dialog: an entry's focus by `focus-ring-width`; samples for `resetSection` and
  `resetSectionDetail`. Stable.
- status-line: stable.
- table: a card's keyboard focus by `focus-ring-width`; samples for its counted and interpolated
  words. Stable.
- text-field: disabled at `disabled-opacity`; the invalid ring by its tokens; the issue mark's focus
  by `focus-ring-width`; `phoneBelow` `breakpoint-md`; samples for `errors` and `warnings`. Draft.
- tooltip: on `layer-popover`. Stable.
- top-bar: `phoneBelow` `breakpoint-md`. Stable.
- shell: the panel toggle's focus by the focus ring tokens; the content's bar `scrollbar-width` on a
  solid track; its breakpoints by `breakpoint-md` and `breakpoint-lg`; the drawer slides over
  `motion-base`; the gate an egui app passes before it follows the shell. Stable.
