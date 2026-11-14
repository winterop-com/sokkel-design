# sokkel-design

> "Ideally I could create web / Tauri / Electron / egui apps all in a similar fashion, at least
> adhering to similar designs."

Web, Tauri and Electron apps already share one renderer: sokkel-ui, where every example is one web
app in `web/`, `electron/` and `tauri/` shells. egui is the native one, sokkel-ui-egui. sokkel-design
is the contract both renderers implement: the tokens, the rules and the parts' specs, written once.
It has the same shape as sokkel-api: one contract, an implementation per stack, and a check between
them. The contract decides and each renderer stays idiomatic. When a renderer drifts, a check fails
in that renderer's CI before any app sees it.

It covers fifteen parts (button, text field, table, rail, top bar, status line, page header,
section, page state, select, dropdown menu, tooltip, dialog, settings dialog, command palette) and
one pattern (the shell), at contract version 0.28.0, which moves in lockstep with sokkel-ui
(`CHANGELOG.md`). sokkel-ui checks its components against a pinned copy of the specs
(`src/parts.test.ts`); sokkel-ui-egui builds its widgets from them and takes its resolved tokens and
paints from `tokens/tokens.resolved.json`.

## Layers

| Layer | What it holds | Here |
|---|---|---|
| Foundations | Tokens: themes in light and dark, the derived surfaces, density levels, the parts tokens, text roles, the radius ladder, the focus and invalid rings, motion, layers, elevations, breakpoints and form-factor widths | sokkel-ui's `tokens.json` at the commit `sokkel-ui.json` pins, resolved into `tokens/tokens.resolved.json`; `index.json` |
| Principles | Rules every renderer keeps, whatever its toolkit | `principles.md` |
| Parts | One spec per part: anatomy, options, sizes per density, states, tokens per state, keyboard, words | `parts/<id>.md` + `parts/<id>.json` |
| Patterns | Parts arranged into a whole: the app frame first | `patterns/<id>.md` + `patterns/<id>.json` |
| Specimens | The fixed list of Storybook story paths both renderers draw, compared by eye | `specimens.md` + `specimens.json` |

The `.md` file is for people: it explains the part and cites where sokkel-ui does each thing. The
`.json` file is what a renderer tests against. When the two disagree, the JSON wins and the `.md` is
fixed.

```
sokkel-design/
    README.md  principles.md  specimens.md  specimens.json  open-questions.md  CHANGELOG.md
    index.json                  contract version, breakpoints, widths, every part and pattern with its status
    sokkel-ui.json              the sokkel-ui commit whose tokens.json the contract reads
    schema/part.schema.json     JSON Schema 2020-12 for parts/*.json and patterns/*.json
    schema/paints.schema.json   the resolved paints renderers read
    parts/      button  text-field  table  rail  top-bar  status-line   (.md + .json)
                page-header  section  page-state
                select  dropdown-menu  tooltip
                dialog  settings-dialog  command-palette
    patterns/   shell                                               (.md + .json)
    tokens/     tokens.resolved.json: the tokens and the paints, for renderers that read no CSS
    scripts/    the resolver, verify-colors, check.py, fmt.py (scripts/README.md)
    .github/workflows/contract.yaml   the checks, against the pinned sokkel-ui
```

## The part format

One JSON file per part, so a change to one part stays in one diff. `index.json` lists the parts, the
contract version and the foundations every part refers to. `schema/part.schema.json` validates every
part and pattern file. serde reads them into typed structs, or a build step turns them into Rust
constants. This follows the format the egui side asked for (`sokkel-ui-egui/docs/proposals/sokkel-design-egui.md`,
section c).

| Key | Holds |
|---|---|
| `id`, `kind`, `status` | `button`; `part` or `pattern`; `draft` or `stable` (see "Versions and status") |
| `sources` | The files each renderer draws it from today, by repo |
| `anatomy` | Each named piece and what it is; paint and sizes refer to these names |
| `options` | What an app sets (variant, size, busy, ...), with values and default. CSS context styling becomes an explicit option here (see the rules below) |
| `sizes` | Per size: `height`, `padX`, `gap`, `icon`, `text`, `radius`, `phoneMinHeight`, `phoneHitArea` (a finger's hit area without growing), ... |
| `layout` | Lengths that are not per size: insets, gaps, widths, breakpoints the part reads |
| `states` | Every state: what it means, how it is reached, and its part-wide effect (opacity, ring, offset, focusable) |
| `variants` / `pieces` | A paint map per variant (button) or per anatomy piece (text field, table): `state -> { ground, edge, ink, ring, ... }`. A state left out paints as `rest` |
| `keyboard` | A list of `{ keys, does, when }` |
| `words` | `key -> English default`, the same keys in both renderers; a count takes `{ "one": ..., "other": ... }` |
| `samples` | For each word that interpolates or counts: `[{ "with": { "count": 0 }, "says": "0 rows" }, ...]`, what it says at zero, one and many and with each value it interpolates |
| `appText` | Text the app gives (a label, a reason), never defaulted |
| `rendererSpecific` | What only one renderer does, by repo. A look only one renderer can draw (the web's blur under a dialog's backdrop) is said here and kept out of every paint, so no renderer is held to it |
| `drift` | Where a renderer differs from the spec today: `{ renderer, what, spec, today }` |

**Token references** use the resolved names, as `tokens.resolved.json` names them. Each name is the
CSS custom property without `--` (`primary`, `radius-control`, `spacing-finger`). Density lengths are
`density.<name>` (`density.row`, which is CSS `--density-row`), and text roles are `text.<role>`
(`text.action`, which is the CSS class `text-action`). Each key takes one kind of name, and the
schema and the check hold it:

| Keys | Take |
|---|---|
| `ground`, `edge`, `ink`, `rule`, `mark`, `placeholder`, `ring.color` | A color name in the value grammar below; never a text role or a density name |
| `height`, `width`, `padX`, `padXWithIcon`, `padY`, `gap`, `icon`, `phoneMinHeight`, `phoneMinWidth`, `phoneHitArea`, `ring.width`, `ring.offset` | px, a length token (`spacing-finger`, `focus-ring-width`) or a density name (`density.row`) |
| `layout.*` | As the lengths, or a duration token (`motion-fast`) |
| `opacity` | A number, or a number token (`disabled-opacity`) |
| `breakpoints.*.width` | `below` or `from`, and px or a breakpoint token (`below breakpoint-md`) |
| `radius` | A corner role (`radius-control`) |
| `text` | A text role (`text.body`), only here |

**Values** (the authoring form; renderers read the resolved paints, below).
- A color is a token name. `primary/80` is that token at 80 percent alpha, as Tailwind's `bg-primary/80`
  and egui's `color_at("primary", 0.8)` paint it.
- `mix(secondary, foreground 5%)` is a mix in oklch, and `mix-oklab(critical 8%, card)` one in
  oklab. Such mixes live in sokkel-ui's components today, not in the tokens.
- `none` is transparent. `inherit` is the ink of what the piece stands on, kept only where a part
  follows its surroundings (an outline or ghost button, the quiet select, the status line's live
  dot): foreground on the page, popover-foreground in a popup, sidebar-foreground on the rail, the
  note's ink in a status line. Each such piece says so in its note. A renderer without inheritance
  passes the surface's ink down to it. Where a part always stands on one surface, its spec names
  that ink instead.
- A parts token such as `page-title-ink` is a color in every theme: where a theme sets none it falls
  back to `foreground` in the tokens themselves.
- A length is px (1rem = 16px = 1 egui point at scale 1), a length token name, or
  `{ "regular": n, "compact": n }`. The focus ring is `focus-ring-width` wide and `focus-ring-offset`
  off, the invalid ring `invalid-ring` and `invalid-ring-width`, and a part that cannot be used is
  at `disabled-opacity`; a spec names these tokens rather than their values.
- A paint may carry `dark: { ... }` for what changes in the dark scheme beyond the tokens themselves.
- A paint map key joins states with `+` for their combination (`invalid+focus`). Each state named
  must be in `states`.
- A spec names only tokens the pinned sokkel-ui has. A new token lands in sokkel-ui first, then
  the pin moves (`bun scripts/resolve.ts --ref <ref>`), and then a spec may name it.

**Words said as functions.** sokkel-ui keeps its words as functions (`rows: (count) => ...`), and
the spec writes them as templates. A word that interpolates or counts carries `samples`: what it
says at zero, one and many (1200, so the sample shows whether the thousands are grouped) and with
each value it interpolates. sokkel-ui's parts test calls each function with each sample's values
and compares; `check.py` fails such a word without samples. A count the part never says of zero (a
form's issue count, which is not drawn at zero) is sampled at one and many.

**Rules for writing a spec** (the egui side's section e, made rules):
1. **Today's behavior, cited.** A spec states what sokkel-ui does now, with file and prop. A change
   is written as a `drift` entry or in `open-questions.md`, never written in silently.
2. **Context becomes an option.** Styling that CSS takes from context (`:has()`, `in-data-[slot=...]`,
   `aria-expanded`, `has-data-[icon=...]`) is an explicit option or state of the part, so an
   immediate-mode renderer can be told it.
3. **Fixed sizes where a part flows in a row.** egui wraps a row only before a child whose size it
   knows. A part that sits in a flowing row (chips, badges, tiles, buttons in a toolbar) states its
   height and how its width is found.
4. **Focus says how it was reached.** Each focus state says `on: "keyboard"` (`:focus-visible`) or
   `on: "any"`. A browser shows the ring of a text input on any focus. Keyboard-only focus requires a
   renderer to track the last input kind, a key or a pointer, as a browser does.
5. **Breakpoints as values.** `md` is `breakpoint-md` (768) and `lg` is `breakpoint-lg` (1024), and the finger size is `spacing-finger`
   (44). A part's layout by its own box (the table) is stated as px of that box, never as window
   width.

## Resolved paints: renderers never mix colors

The color grammar above is how a spec is written. No renderer evaluates it (principle 20). The
resolver (`scripts/resolve.ts`, `scripts/paints.ts`) resolves every color and ring a spec names
(alpha and mix alike) for every theme and scheme, and writes the results into a `paints` section of
`tokens/tokens.resolved.json` (`schema/paints.schema.json`):

```json
"paints": { "tidevann": { "light": {
    "button.default.hover.container": {"ground": "#006aa0cc", "edge": "#00000000", "ink": "#f9fafb"},
    "button.outline.invalid+focus.container": {"ground": "#f9fafb", "edge": "#c92f33cc", "ink": "inherit",
        "ring": {"color": "#c92f3333", "width": 3}, "outline": {"color": "#006aa0", "width": 2, "offset": 2}},
    "text-field.base.invalid+focus.control": {"ground": "#ffffff", "edge": "#c92f33", "ink": "#0e1217",
        "placeholder": "#585e66", "ring": {"color": "#c92f3333", "width": 3}}
} } },
"paintSources": { "light": {
    "button.default.hover.container": {"ground": "primary/80", "edge": "none", "ink": "primary-foreground"}
} }
```

(tidevann light: `primary` is `#006aa0`, so `primary/80` is `#006aa0cc`; `critical` is `#c92f33`.
A mix such as `mix(secondary, foreground 5%)` resolves to one opaque color the same way.)

- **Key:** `<part>.<variant>.<state>.<piece>`. `variant` is `base` for a part without variants.
  `piece` is `container` for a variant's own paint. `state` is a state key, `+` joined for a
  combination.
- **Complete:** each paint already lays the layers over each other in order: rest, each state the
  key joins, then the joined key. In each step the part-wide piece (`pieces.container`) is laid
  first, then the variant's or piece's own paint, each followed in dark by its `dark` layer, then
  the state's effect ring. A renderer takes one paint and draws it.
- **Rings and outlines:** a ring with an `offset` is an `outline`, drawn that far outside the box
  (keyboard focus); it stacks with a `ring`. Every other ring replaces the ring before it, as CSS
  box-shadow rings do. Ring widths and offsets are resolved to px.
- **Sparse:** only `rest` and the states a spec paints are present. A renderer asked for another
  state takes `rest`, which is picking a paint, not mixing one. An option's overlay
  (`destructive-hover`, a variant whose rest paints nothing) is marked `overlay`, holds only its own
  fields, and is laid over by field.
- **No density key:** nothing a paint holds varies by density. Lengths per density stay where they
  are in the resolved file.
- **Checked:** `paintSources` keeps each field's expression, the same in every theme, once per
  scheme. `verify-colors` draws that expression in Chromium (`color-mix(in oklab, var(--primary) 80%,
  transparent)` for `primary/80`) for each theme and scheme from sokkel-ui's own CSS at the pinned
  commit, and fails a paint off by more than 2/255, as it does every color token and elevation.

sokkel-ui keeps drawing with CSS, where its classes say the same expressions (`hover:bg-primary/80`),
and its parts test checks that each paint expression has the class it expects. sokkel-ui-egui reads
`paints` and drops its own `color_at` and gamma blends for anything a spec paints.

## How each renderer consumes it

| | sokkel-ui (React, CSS) | sokkel-ui-egui (Rust, egui) |
|---|---|---|
| Tokens | `scripts/build-tokens.ts` writes `tokens.css`, `themes/*.css` and `theme-list.ts` from `tokens.json`; the browser settles `var()`, `color-mix()` and `calc()` | sokkel-design's resolver settles every value to plain sRGB hex, px, numbers, ms, easing curves, elevation layers and text roles in `tokens/tokens.resolved.json`, which `tokens.rs` embeds |
| Parts | Components keep their idiom (Tailwind classes, Base UI). A test reads `parts/*.json` and checks what can be read from code: words equal the component's defaults, each paint expression's class, the sizes in its class strings, the keys it binds | Widgets read sizes and words from the spec and colors from `paints`, so most drift cannot be written; kittest checks state paint and keys |
| Specimens | The story at each specimen's path, captured by Playwright | The egui story at the same path, captured by egui_kittest |

**Drift checks.**

| Side | Check | Fails when |
|---|---|---|
| sokkel-design | `check.py` (schema, references, words, samples, statuses) | A part file breaks the schema, names a token the pinned sokkel-ui lacks, paints a state the part does not list, or leaves a counted or templated word without samples; the resolved file was made from another commit than the pin |
| sokkel-design | `resolve --check`, `verify-colors` (CI, `.github/workflows/contract.yaml`) | The resolved file (tokens and paints) is not what the pinned `tokens.json` and the specs make; a resolved token color, paint color or elevation is off from Chromium's by more than 2/255 (18044 today: 13 themes, both schemes) |
| sokkel-ui | `bun run tokens --check` | The CSS is not what `tokens.json` makes |
| sokkel-ui | `parts.test.ts` | A component's word default or sample, paint class, size or key binding is not the spec's |
| sokkel-ui-egui | `make tokens-check` (exists) | The embedded resolved file is not the contract's |
| sokkel-ui-egui | `tests/parts.rs` (new) | A widget's measured size, state paint or key handling is not the spec's |
| Both | Specimens | Nothing fails automatically. The side-by-side page shows each pair for the eye |

**How a change flows.** A token changes in sokkel-ui's `tokens.json` (until 1.0, see D1), and a
part spec or a principle changes here, in a PR with a changelog line under the version it ships in.
The pin moves to that sokkel-ui commit (`bun scripts/resolve.ts --ref <ref>`), which writes the
resolved file again. Each renderer then takes the new version: sokkel-ui moves its `design/` pin,
sokkel-ui-egui takes the resolved file, and both run their checks. A widget or component that no longer
matches fails its own check in its own repo. The renderer is then fixed, or the spec is questioned
here. Both renderers regenerate their specimens, and the side-by-side shows what changed.

## From Rust

A `sokkel-design` crate holds hand-written serde types for the part files and the resolved file
(`Part`, `Size`, `State`, `Paint`, `Paints`), and embeds both. Generating the types from the schema
would fight Rust's idiom for little gain at this size. The value grammar parses into one enum:

```rust
enum ColorRef {
    Token { name: String, alpha: Option<u8> },          // primary, primary/80
    Mix { space: Space, a: String, b: String, pct: u8 }, // mix(...), mix-oklab(...)
    None,
    Inherit,
}
fn paint(color: &ColorRef, tokens: &Tokens) -> Color32
```

`paint` exists for tools and tests, such as checking a resolved paint against its `source`. With
`paints` resolved at build time, a widget looks up `button.default.hover.container` and reads plain
colors. The only token lookups left are those outside a spec's paints (`tokens.color("primary")`).

## Where things live

| What | Now | At 1.0 |
|---|---|---|
| `tokens.json` | `sokkel-ui/packages/core/tokens/tokens.json`, read here at the commit `sokkel-ui.json` pins | Moves here with the open-sourcing, published as `@winterop-com/sokkel-design` and as a crate `sokkel-design` |
| CSS from tokens | `sokkel-ui/scripts/build-tokens.ts` | Stays in sokkel-ui, which reads the contract's `tokens.json` |
| The resolver | `sokkel-design/scripts/resolve.ts`, `resolve-tokens.ts`, `paints.ts` | Here |
| `tokens.resolved.json` | `sokkel-design/tokens/`; egui takes it from here | Here, embedded by the crate |
| `verify-colors` | `sokkel-design/scripts/verify-colors.ts`, in this repository's CI against the CSS the pinned sokkel-ui's build makes | Here |
| Part specs | `sokkel-design/parts/`, with a pinned copy in sokkel-ui's `design/` | Here |

## Versions and status

**One contract version, in lockstep with sokkel-ui** (D3, D4). `index.json`'s `version` is the
sokkel-ui release the contract ships in: 0.28.0 now. Before 1.0 a breaking change moves the minor,
as sokkel-ui's does. sokkel-ui-egui states the sokkel-ui version whose contract it meets. Parts have
no version of their own; `CHANGELOG.md` says what each version changed, part by part.

**Status.** Each part and pattern says `draft` or `stable`, in its file and in `index.json`, and
`check.py` holds the two the same:
- `stable`: both renderers draw it from its spec and it has been compared side by side, its open
  findings decided. A change to it is a changelog line, and the renderers follow.
- `draft`: a renderer has not built it from its spec yet. It may still change shape.

Today `section` and `text-field` are drafts (egui has not built Section, nor the field's issue mark
and frame); every other part and the shell are stable.

## Plans

- **Patterns (D5).** The shell now; other patterns (forms with their issue count, list beside detail,
  dashboards) when an egui app needs them.
- **One app shape (D6).** The plan is one app shape as data, which every target reads: the places,
  the route ids, the settings sections, the palette's commands, the shortcuts, the words and the
  appearance keys, with a starter in each renderer's `examples/`. Its schema and fixtures come when
  a second app is ported, sokkel-ui's tasks example the first to read it. No web pages inside an
  egui app, and no scaffolder yet.
- **The shell's gate (D7).** `patterns/shell.md` lists what egui must have, behavior and
  accessibility included, before an egui app follows the shell.
- **Specimens (D8).** An egui story copies the data of the sokkel-ui story at its path, the 500-run
  tables included; the side-by-side pairs are a CI artifact until the format settles.

## Order toward an egui app that follows the shell

From the egui side (proposal, section a). Each step is a spec here first, then a widget there.

| Step | Parts | Spec here |
|---|---|---|
| 1 | Shell, Rail, TopBar, StatusLine | `patterns/shell`, `parts/rail`, `parts/top-bar`, `parts/status-line` (stable) |
| 2 | PageHeader, Section, page states | `parts/page-header`, `parts/page-state` (stable), `parts/section` (draft) |
| 3 | DataTable, the list variant first | `parts/table` (stable) |
| 4 | Select, Dialog with SettingsDialog, DropdownMenu, Tooltip, CommandPalette | `parts/select`, `parts/dropdown-menu`, `parts/tooltip`, `parts/dialog` (with ConfirmDialog), `parts/settings-dialog`, `parts/command-palette` (stable); the settings route in `patterns/shell` |
| 5 | The field family: number, date and select fields | `parts/text-field` (draft) sets the frame they share; `parts/select` holds the select field's control |
| 6 | Toast, Callout, Banner | To come |
| 7 | Add-ons (charts, maps), as the patterns ask | To come |

Button is drafted first because every step uses it. Text field sets the frame the whole field family
shares.
