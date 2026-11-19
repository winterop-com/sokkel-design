# sokkel-design

> "Ideally I could create web / Tauri / Electron / egui apps all in a similar fashion, at least
> adhering to similar designs."

Web, Tauri and Electron apps already share one renderer: sokkel-ui, where every example is one web
app in `web/`, `electron/` and `tauri/` shells. egui is the native one, sokkel-egui, and ratatui the
terminal one, sokkel-tui. sokkel-design is the contract the three renderers implement: the tokens,
the rules and the parts' specs, written once.
It has the same shape as sokkel-api: one contract, an implementation per stack, and a check between
them. The contract decides and each renderer stays idiomatic. When a renderer drifts, a check fails
in that renderer's CI before any app sees it.

It covers fifty-four parts (button, text field, table, rail, top bar, status line, page header,
section, page state, select, dropdown menu, tooltip, dialog, settings dialog, command palette, run
timeline, clip timeline, emoji picker, reaction bar, composer, message composer, call bar, letter,
detail pane, board item panel, code editor, date field, banner, side panel, problem, JSON tree,
secret field, yes/no field, time field, computed field, repeated group, period picker, tree select,
group label, unfoldable, choice list, badge, stat, description list, API link, issue count, server
menu, item card, sortable grid, markdown view,
and the chart family's first: chart, dashboard panel, stat panel, time series panel) and two
patterns (the shell, and the prompt: a dialog asking for one value), at the contract version `index.json` names, which moves in lockstep with
sokkel-ui (`CHANGELOG.md`). Every word a part says carries its message id, and the contract carries
sokkel-ui's ICU catalogs (`messages/en.json`), so one translation serves every renderer. sokkel-ui checks its components against a pinned copy of the specs
(`src/parts.test.ts`); sokkel-egui builds its widgets from them and takes its resolved tokens and
paints from `tokens/tokens.resolved.json`; sokkel-tui does the same in a terminal, reading the paints'
opaque forms, each part's cells and `glyphs.json`. Each part says how far each renderer has built
it (`renderers`).

## Layers

| Layer | What it holds | Here |
|---|---|---|
| Foundations | Tokens: themes in light and dark, the derived surfaces, density levels, the parts tokens, text roles, the radius ladder, the focus and invalid rings, motion, layers, elevations, breakpoints and form-factor widths, the sixteen ANSI colors. The status vocabulary: the run and health states every status part knows, each in a color. For cells: the grid in columns, the check sizes, text roles in cells, color depths and glyphs | sokkel-ui's `tokens.json` at the commit `sokkel-ui.json` pins, resolved into `tokens/tokens.resolved.json`; `index.json` (`renderers`, `cells`, `colorDepth`, `statuses`); `glyphs.json` |
| Words | Every word's English as an ICU MessageFormat string by its message id, `<part>.<word>`: sokkel-ui's catalogs, one per package, as one | `messages/en.json`, from the pinned commit; each spec's `messages` |
| Principles | Rules every renderer keeps, whatever its toolkit | `principles.md` |
| Parts | One spec per part: anatomy, options, sizes per density, states, tokens per state, keyboard, words | `parts/<id>.md` + `parts/<id>.json` |
| Patterns | Parts arranged into a whole: the app frame first | `patterns/<id>.md` + `patterns/<id>.json` |
| Specimens | The fixed list of Storybook story paths every renderer draws, compared by eye | `specimens.md` + `specimens.json` |
| Markdown tree | What a markdown text reads into, so a server reads a note once and every renderer draws the same tree: mdast with the nodes linked notes add, its schema, and texts with the trees they must read into | `markdown/README.md`, `schema/markdown-tree.schema.json`, `markdown/fixtures/` |

The `.md` file is for people: it explains the part and cites where sokkel-ui does each thing. The
`.json` file is what a renderer tests against. When the two disagree, the JSON wins and the `.md` is
fixed.

```
sokkel-design/
    README.md  principles.md  specimens.md  specimens.json  open-questions.md  CHANGELOG.md
    index.json                  contract version, renderers, breakpoints, widths, cells, color depth, every part and pattern with its status
    glyphs.json                 each glyph a part draws in cells, Unicode and ASCII, and icons with their Nerd Font form
    sokkel-ui.json              the sokkel-ui commit whose tokens.json and catalogs the contract reads
    messages/en.json            sokkel-ui's English catalogs at that commit, every word's ICU message by its id
    schema/part.schema.json     JSON Schema 2020-12 for parts/*.json and patterns/*.json
    schema/paints.schema.json   the resolved paints renderers read
    schema/markdown-tree.schema.json   what a markdown text reads into
    markdown/   README.md (the tree) and fixtures/ (texts and the trees they read into)
    parts/      button  text-field  table  rail  top-bar  status-line   (.md + .json)
                page-header  section  page-state
                select  dropdown-menu  tooltip
                dialog  settings-dialog  command-palette
                run-timeline  clip-timeline  emoji-picker  reaction-bar
                composer  message-composer
                call-bar  letter  detail-pane  board-item-panel
                code-editor  date-field
                banner  side-panel  problem  json-tree
                secret-field  yes-no-field  time-field  computed-field
                repeated-group  period-picker  tree-select
                group-label  unfoldable  choice-list  badge  stat  description-list
                api-link  issue-count  server-menu  item-card  sortable-grid  markdown-view
                chart  dashboard-panel  stat-panel  time-series-panel   (the chart family)
    patterns/   shell                                               (.md + .json)
    tokens/     tokens.resolved.json: the tokens and the paints, for renderers that read no CSS
    scripts/    the resolver, verify-colors, check.py, fmt.py (scripts/README.md)
    .github/workflows/contract.yaml   the checks, against the pinned sokkel-ui
```

## The part format

One JSON file per part, so a change to one part stays in one diff. `index.json` lists the parts, the
contract version and the foundations every part refers to. `schema/part.schema.json` validates every
part and pattern file. serde reads them into typed structs, or a build step turns them into Rust
constants. This follows the format the egui side asked for (`sokkel-egui/docs/proposals/sokkel-design-egui.md`,
section c).

| Key | Holds |
|---|---|
| `id`, `kind`, `status` | `button`; `part` or `pattern`; `stable`, the only status (see "Versions and status") |
| `renderers` | For `sokkel-ui`, `sokkel-egui` and `sokkel-tui`: `{ state, as_of, note }`, state `missing`, `partial` or `built`, as of a commit of that renderer's repository. `built` means drawn from the spec with nothing left in `drift` |
| `sources` | The files each renderer draws it from today, by repo |
| `anatomy` | Each named piece and what it is; paint and sizes refer to these names |
| `standsOn` | The surface each piece (or variant) stands on, `default` for the rest: an opaque color token, which the resolver lays the paints over for a renderer that cannot blend |
| `alsoStandsOn` | Optional: the other surfaces a piece (or variant) may stand on, by piece with a `default` (a ghost button in a section's head or a popover); the resolver lays each paint over each of them too (`flatOn`, `fadedOn`) |
| `options` | What an app sets (variant, size, busy, ...), with values and default. CSS context styling becomes an explicit option here (see the rules below) |
| `sizes` | Per size: `height`, `padX`, `gap`, `icon`, `text`, `radius`, `phoneMinHeight`, `phoneHitArea` (a finger's hit area without growing), ... |
| `layout` | Lengths that are not per size: insets, gaps, widths, breakpoints the part reads |
| `cells` | Optional: the part in a cell grid. `rows`, `padX`, `padY`, `gap` in rows and columns (or `{ regular, compact }`), how its `width` is found, what `density` changes, the same by `sizes` and `pieces`, and the `glyphs` it draws (names in `glyphs.json`) |
| `states` | Every state: what it means, how it is reached, and its part-wide effect (opacity, ring, offset, focusable) |
| `variants` / `pieces` | A paint map per variant (button) or per anatomy piece (text field, table): `state -> { ground, edge, ink, ring, ... }`. A state left out paints as `rest` |
| `keyboard` | A list of `{ keys, does, when }` |
| `words` | `key -> English default`, the same keys in every renderer; a count takes `{ "one": ..., "other": ... }` |
| `messages` | For every word, by its key: `{ id, en, with? }`, its message id in sokkel-ui's catalogs and its English there as an ICU MessageFormat string (`with` the values a word fixes where it is one form of a message that takes more, as a select's other branch); `null` where the catalog holds no message for it. See "Words by message id" |
| `samples` | For each word that interpolates or counts: `[{ "with": { "count": 0 }, "says": "0 rows" }, ...]`, what it says at zero, one and many and with each value it interpolates |
| `appText` | Text the app gives (a label, a reason), never defaulted |
| `rendererSpecific` | What only one renderer does, by repo. A look only one renderer can draw (the web's blur under a dialog's backdrop) is said here and kept out of every paint, so no renderer is held to it |
| `drift` | Where a renderer differs from the spec today: `{ renderer, what, spec, today }` |

**Token references** use the resolved names, as `tokens.resolved.json` names them. Each name is the
CSS custom property without `--` (`primary`, `radius-control`, `spacing-finger`). Density lengths are
`density.<name>` (`density.row`, which is CSS `--density-row`), and text roles are `text.<role>`
(`text.action`, which is the CSS class `text-action`); every text size is a role, the plain sizes
(`text.sm`, `text.graph-title`) at weight 400 where the token names none. Each key takes one kind of name, and the
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

**Words by message id.** sokkel-ui gives every word a message id, `<part>.<word>`: the part's
words constant in camel case and the word's key (`DATA_TABLE_WORDS.rows` is `dataTable.rows`), a
nested word its path (`emojiPicker.groups.recent`). A word a part takes from another part keeps that
part's id (`field.required`, `issueCount.errors`), so it is translated once. Each package's English
catalog (`packages/<package>/messages/en.json`) holds every word as an ICU MessageFormat string: a
count is a plural (`{count, plural, one {# row} other {# rows}}`), a choice a select, numbers and
dates `{count, number}` and `{at, date, ::MMMd}`. The resolver writes them as one,
`messages/en.json`, from the pinned commit; each spec's `messages` names each word's id and its
English as the catalog holds it, and `check.py` fails an id the catalog lacks, English that is not
the catalog's, and a word with no entry. Renderers key their strings by these ids and read the same
catalogs, an app's translation spread over the English one, so one translation serves all three
(principle 24). A word whose catalog entry is missing (`null`) is a phrase that formats rather than
says; `open-questions.md` lists them.

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

- **Opaque forms:** a renderer that cannot blend (a terminal) reads `flat[field]`, else the field.
  `flat` holds each field that is not opaque, or is `inherit`, laid over the surface the piece stands
  on (the spec's `standsOn`, kept in `paintSources` as `standsOn`) in sRGB, as a browser composites:
  the ground over the surface; the edge, ink, rule, mark, placeholder and an inset ring over that
  flat ground; a ring or outline outside the box over the surface. `inherit` is the surface's own
  ink. `faded` holds, by state, every color field drawn at the opacity a state's effect sets
  (`disabled` at `disabled-opacity`), on that state's key where the spec paints it, else on rest.
  `button.default.hover.container` in tidevann light: `"flat": {"ground": "#3287b2", "edge":
  "#3287b2"}`. verify-colors draws both in Chromium, the surface filled on a canvas and the layers
  over it.
- **Over other surfaces:** a part that may stand on more than one surface names the others in
  `alsoStandsOn`, and each paint carries the same two forms over each of them: `flatOn[surface]` and
  `fadedOn[surface]`, with `inherit` as that surface's ink. A renderer that cannot blend reads the
  form for the surface the piece is drawn on, else `flat`, else the field. verify-colors draws these
  too.
- **Every combination painted:** a `+` key a piece or variant paints is resolved whether or not the
  part's `states` lists it (`page-state.base.failed+warning.frame`).

sokkel-ui keeps drawing with CSS, where its classes say the same expressions (`hover:bg-primary/80`),
and its parts test checks that each paint expression has the class it expects. sokkel-egui reads
`paints` and drops its own `color_at` and gamma blends for anything a spec paints; sokkel-tui reads
their opaque forms.

## How each renderer consumes it

| | sokkel-ui (React, CSS) | sokkel-egui (Rust, egui) | sokkel-tui (Rust, ratatui) |
|---|---|---|---|
| Tokens | `scripts/build-tokens.ts` writes `tokens.css`, `themes/*.css` and `theme-list.ts` from `tokens.json`; the browser settles `var()`, `color-mix()` and `calc()` | sokkel-design's resolver settles every value to plain sRGB hex, px, numbers, ms, easing curves, elevation layers and text roles in `tokens/tokens.resolved.json`, which `tokens.rs` embeds | The same resolved file, at a pinned sokkel-design commit; colors from the paints' `flat` and `faded` forms, at the terminal's depth (`colorDepth`) |
| Parts | Components keep their idiom (Tailwind classes, Base UI). A test reads `parts/*.json` and checks what can be read from code: words equal the component's defaults, each word's message id and its English in the catalogs, each paint expression's class, the sizes in its class strings, the keys it binds | Widgets read sizes and words from the spec and colors from `paints`, so most drift cannot be written; kittest checks state paint and keys | Widgets read words and keys from the spec, rows and columns from `cells`, glyphs from `glyphs.json`; tests draw into a buffer |
| Words | `LocaleProvider` and `useWords`: a part's own `words`, then the app's catalog, then English | Each word looked up by its message id in the app's catalog over `messages/en.json`, formatted by an ICU MessageFormat library in the app's locale | The same as egui |
| Specimens | The story at each specimen's path, captured by Playwright | The egui story at the same path, captured by egui_kittest | The same path drawn into a buffer at the check sizes, as text and SVG |

**Drift checks.**

| Side | Check | Fails when |
|---|---|---|
| sokkel-design | `check.py` (schema, references, words, message ids, samples, statuses, renderers, surfaces, cells, glyphs) | A part file breaks the schema, names a token the pinned sokkel-ui lacks, paints a state the part does not list, or leaves a counted or templated word without samples; a word has no message id, or one the pinned catalogs lack, or English that is not the catalog's; a stable part sokkel-ui has not built; a piece stands on a surface that is not opaque in every theme; a part names a glyph `glyphs.json` lacks; the index's cells or color depth are incomplete; the resolved file was made from another commit than the pin |
| sokkel-design | `resolve --check`, `verify-colors` (CI, `.github/workflows/contract.yaml`) | The resolved file (tokens and paints) is not what the pinned `tokens.json` and the specs make, or `messages/en.json` is not the pinned catalogs; a resolved token color, paint color (its flat and faded forms included) or elevation is off from Chromium's by more than 2/255 (81216 today: 16 themes, both schemes) |
| sokkel-ui | `bun run tokens --check` | The CSS is not what `tokens.json` makes |
| sokkel-ui | `parts.test.ts` | A component's word default or sample, a word's message id or its English in the catalog, paint class, size or key binding is not the spec's |
| sokkel-egui | `make tokens-check` (exists) | The embedded resolved file is not the contract's |
| sokkel-egui | `tests/parts.rs` (new) | A widget's measured size, state paint or key handling is not the spec's |
| sokkel-tui | `make tokens-check` (exists) | The embedded resolved file is not the contract's at the pinned commit |
| Every renderer | Specimens | Nothing fails automatically. The side-by-side page shows each pair for the eye |

**How a change flows.** A token changes in sokkel-ui's `tokens.json` (until 1.0, see D1), and a
part spec or a principle changes here, in a PR with a changelog line under the version it ships in.
The pin moves to that sokkel-ui commit (`bun scripts/resolve.ts --ref <ref>`), which writes the
resolved file again. Each renderer then takes the new version: sokkel-ui moves its `design/` pin,
sokkel-egui and sokkel-tui take the resolved file, and each runs its checks. A widget or component that no longer
matches fails its own check in its own repo. The renderer is then fixed, or the spec is questioned
here. The renderers regenerate their specimens, and the side-by-side shows what changed. A renderer
that builds or finishes a part moves that part's `renderers` entry here, to its own commit.

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
sokkel-ui release the contract ships in. Before 1.0 a breaking change moves the minor,
as sokkel-ui's does. sokkel-egui and sokkel-tui state the sokkel-ui version whose contract it meets. Parts have
no version of their own; `CHANGELOG.md` says what each version changed, part by part.

**Status.** Nothing in the contract is a draft (owner's rule): every part and pattern is `stable`,
in its file and in `index.json`, and `check.py` fails one that is not. `stable` means the contract
holds it as sokkel-ui draws it; a change to it is a changelog line, and the renderers follow. Whether a
renderer has built it and compared it side by side is not its status: that is the part's
`renderers` and `drift`, which say what is built and what is not compared yet.

Status is the contract's; how far each renderer has built a part is that part's `renderers`, so a
third renderer neither blocks a stable part nor is left out of it.

What lands in sokkel-ui is the new normal: a part added or changed there is specified here in the
same round, as it landed (its words, options, sizes, paints and keys), and is `stable` from the
start, never a draft. Where egui has not built it yet, its spec says so in a `drift` entry for
sokkel-egui and in `renderers`, and egui builds it from the spec. `section` and `text-field`, drafts from before that rule, are
stable too; their `drift` says what each renderer has not compared yet.

## Plans

- **Patterns (D5).** The shell and the prompt now; other patterns (forms with their issue count,
  list beside detail, dashboards) when an egui app needs them.
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
| 2 | PageHeader, Section, page states | `parts/page-header`, `parts/page-state`, `parts/section` (stable) |
| 3 | DataTable, the list variant first | `parts/table` (stable) |
| 4 | Select, Dialog with SettingsDialog, DropdownMenu, Tooltip, CommandPalette | `parts/select`, `parts/dropdown-menu`, `parts/tooltip`, `parts/dialog` (with ConfirmDialog), `parts/settings-dialog`, `parts/command-palette` (stable); the settings route in `patterns/shell` |
| 5 | The field family: number, date and select fields | `parts/text-field` (stable) sets the frame they share; `parts/select` holds the select field's control; `parts/date-field` (stable) |
| 6 | Toast, Callout, Banner | `parts/banner` (stable); toast and callout to come |
| 7 | Add-ons (charts, maps), as the patterns ask | Charts begun: `parts/chart`, `parts/dashboard-panel`, `parts/stat-panel`, `parts/time-series-panel` (stable); the rest of the family is staged in `open-questions.md`. Maps to come |
| - | The code editor | `parts/code-editor` (stable) |

Button is drafted first because every step uses it. Text field sets the frame the whole field family
shares.
