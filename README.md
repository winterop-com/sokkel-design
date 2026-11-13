# sokkel-design

> "Ideally I could create web / Tauri / Electron / egui apps all in a similar fashion, at least
> adhering to similar designs."

Web, Tauri and Electron apps already share one renderer: sokkel-ui, where every example is one web
app in `web/`, `electron/` and `tauri/` shells. egui is the native one, sokkel-ui-egui. sokkel-design
is the contract both renderers implement: the tokens, the rules and the parts' specs, written once.
It has the same shape as sokkel-api: one contract, an implementation per stack, and a check between
them. The contract decides and each renderer stays idiomatic. When a renderer drifts, a check fails
in that renderer's CI before any app sees it.

This is a draft for judging the format. It covers three parts (button, text field, table) and one
pattern (the shell). Nothing here is wired to either renderer yet.

## Layers

| Layer | What it holds | Here |
|---|---|---|
| Foundations | Tokens: themes in light and dark, the derived surfaces, density levels, the parts tokens, text roles, the radius ladder; breakpoints and form-factor widths | `tokens/` (moves here, see below), `index.json` |
| Principles | Rules every renderer keeps, whatever its toolkit | `principles.md` |
| Parts | One spec per part: anatomy, options, sizes per density, states, tokens per state, keyboard, words | `parts/<id>.md` + `parts/<id>.json` |
| Patterns | Parts arranged into a whole: the app frame first | `patterns/<id>.md` + `patterns/<id>.json` |
| Specimens | The fixed list of Storybook story paths both renderers draw, compared by eye | `specimens.md` + `specimens.json` |

The `.md` file is for people: it explains the part and cites where sokkel-ui does each thing. The
`.json` file is what a renderer tests against. When the two disagree, the JSON wins and the `.md` is
fixed.

```
sokkel-design/
    README.md  principles.md  specimens.md  specimens.json  open-questions.md
    index.json                  contract version, breakpoints, widths, every part and pattern
    schema/part.schema.json     JSON Schema 2020-12 for parts/*.json and patterns/*.json
    schema/paints.schema.json   the resolved paints renderers read
    parts/      button  text-field  table   (.md + .json)
    patterns/   shell                       (.md + .json)
    tokens/     tokens.json, tokens.resolved.json, the resolver   (once moved; not in this draft)
```

## The part format

One JSON file per part, so a change to one part stays in one diff. `index.json` lists the parts, the
contract version and the foundations every part refers to. `schema/part.schema.json` validates every
part and pattern file. serde reads them into typed structs, or a build step turns them into Rust
constants. This follows the format the egui side asked for (`sokkel-ui-egui/docs/proposals/sokkel-design-egui.md`,
section c).

| Key | Holds |
|---|---|
| `id`, `kind`, `status` | `button`; `part` or `pattern`; `draft` or `stable` |
| `sources` | The files each renderer draws it from today, by repo |
| `anatomy` | Each named piece and what it is; paint and sizes refer to these names |
| `options` | What an app sets (variant, size, busy, ...), with values and default. CSS context styling becomes an explicit option here (see the rules below) |
| `sizes` | Per size: `height`, `padX`, `gap`, `icon`, `text`, `radius`, `phoneMinHeight`, ... |
| `layout` | Lengths that are not per size: insets, gaps, widths, breakpoints the part reads |
| `states` | Every state: what it means, how it is reached, and its part-wide effect (opacity, ring, offset, focusable) |
| `variants` / `pieces` | A paint map per variant (button) or per anatomy piece (text field, table): `state -> { ground, edge, ink, ring, ... }`. A state left out paints as `rest` |
| `keyboard` | A list of `{ keys, does, when }` |
| `words` | `key -> English default`, the same keys in both renderers; a count takes `{ "one": ..., "other": ... }` |
| `appText` | Text the app gives (a label, a reason), never defaulted |
| `rendererSpecific` | What only one renderer does, by repo |
| `drift` | Where a renderer differs from the spec today: `{ renderer, what, spec, today }` |

**Token references** use the resolved names, as `tokens.resolved.json` names them. Each name is the
CSS custom property without `--` (`primary`, `radius-control`, `spacing-finger`). Density lengths are
`density.<name>` (`density.row`, which is CSS `--density-row`), and text roles are `text.<role>`
(`text.action`, which is the CSS class `text-action`). Each key takes one kind of name, and the
schema and the check hold it:

| Keys | Take |
|---|---|
| `ground`, `edge`, `ink`, `rule`, `mark`, `placeholder`, `ring.color` | A color name in the value grammar below; never a text role or a density name |
| `height`, `width`, `padX`, `padXWithIcon`, `padY`, `gap`, `icon`, `phoneMinHeight`, `layout.*` | px, a length token (`spacing-finger`) or a density name (`density.row`) |
| `radius` | A corner role (`radius-control`) |
| `text` | A text role (`text.body`), only here |

**Values** (the authoring form; renderers read the resolved paints, below).
- A color is a token name. `primary/80` is that token at 80 percent alpha, as Tailwind's `bg-primary/80`
  and egui's `color_at("primary", 0.8)` paint it.
- `mix(secondary, foreground 5%)` is a mix in oklch, and `mix-oklab(critical 8%, card)` one in
  oklab. Such mixes live in sokkel-ui's components today, not in the tokens.
- `none` is transparent, and `inherit` keeps the ink of what is around the part.
- `page-title-ink|foreground` is a parts token with the color to fall back on where a theme leaves it
  `currentcolor`.
- A length is px (1rem = 16px = 1 egui point at scale 1), a length token name, or
  `{ "regular": n, "compact": n }`.
- A paint may carry `dark: { ... }` for what changes in the dark scheme beyond the tokens themselves.
- A paint map key joins states with `+` for their combination (`invalid+focus`). Each state named
  must be in `states`.
- `tokens.landing` in `index.json` lists names landing in sokkel-ui that do not resolve yet (the
  control heights). The check accepts them until they resolve.

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
5. **Breakpoints as values.** `md` is 768 and `lg` is 1024, and the finger size is `spacing-finger`
   (44). A part's layout by its own box (the table) is stated as px of that box, never as window
   width.

## Resolved paints: renderers never mix colors

The color grammar above is how a spec is written. No renderer evaluates it. The resolver resolves
every color a spec names (alpha, mix and fallback alike) for every theme and scheme, and writes the
results into a `paints` section of `tokens.resolved.json` (`schema/paints.schema.json`):

```json
"paints": { "tidevann": { "light": {
    "button.default.hover.container": { "ground": "#006aa0cc", "edge": "#00000000", "ink": "#f9fafb",
                                         "source": { "ground": "primary/80" } },
    "text-field.base.invalid+focus.control": { "ground": "#ffffff", "edge": "#c92f33",
                                               "ring": { "color": "#c92f3333", "width": 3 } }
} } }
```

(tidevann light: `primary` is `#006aa0`, so `primary/80` is `#006aa0cc`; `critical` is `#c92f33`.
A mix such as `mix(secondary, foreground 5%)` resolves to one opaque color the same way.)

- **Key:** `<part>.<variant>.<state>.<piece>`. `variant` is `base` for a part without variants.
  `piece` is `container` for a variant's own paint. `state` is a state key, `+` joined for a
  combination.
- **Complete:** each paint already lays the layers over each other in order: the piece's rest, the
  variant's rest, each joined state, the joined key, the `dark` layers in dark, and the state's
  effect ring. A renderer takes one paint and draws it.
- **Sparse:** only `rest` and the states a spec paints are present. A renderer asked for another
  state takes `rest`, which is picking a paint, not mixing one. An option's overlay
  (`destructive-hover`) is marked `overlay` and is laid over by field.
- **No density key:** nothing a paint holds varies by density. Lengths per density stay where they
  are in the resolved file.
- **Checked:** `source` keeps each color's expression. `verify-colors` draws the same expression in
  Chromium (`color-mix(in oklab, var(--primary) 80%, transparent)` for `primary/80`) for the same
  theme and scheme, and fails a paint off by more than 2/255, as it does for the tokens today.

sokkel-ui keeps drawing with CSS, where its classes say the same expressions (`hover:bg-primary/80`),
and its parts test checks that each paint expression has the class it expects. sokkel-ui-egui reads
`paints` and drops its own `color_at` and gamma blends for anything a spec paints.

## How each renderer consumes it

| | sokkel-ui (React, CSS) | sokkel-ui-egui (Rust, egui) |
|---|---|---|
| Tokens | `scripts/build-tokens.ts` writes `tokens.css`, `themes/*.css` and `theme-list.ts` from `tokens.json`; the browser settles `var()`, `color-mix()` and `calc()` | The resolver (`scripts/resolve.ts`, `resolve-tokens.ts`) settles every value to plain sRGB hex, px, numbers and text roles in `tokens.resolved.json`, which `tokens.rs` embeds |
| Parts | Components keep their idiom (Tailwind classes, Base UI). A test reads `parts/*.json` and checks what can be read from code: words equal the component's defaults, each paint expression's class, the sizes in its class strings, the keys it binds | Widgets read sizes and words from the spec and colors from `paints`, so most drift cannot be written; kittest checks state paint and keys |
| Specimens | The story at each specimen's path, captured by Playwright | The egui story at the same path, captured by egui_kittest |

**Drift checks.**

| Side | Check | Fails when |
|---|---|---|
| sokkel-design | `check` (schema, references, words) | A part file breaks the schema, names a token the resolved file lacks, or paints a state the part does not list |
| sokkel-design | `resolve --check`, `verify-colors` | The resolved file (tokens and paints) is not what `tokens.json` and the specs make; a resolved token or paint color is off from Chromium's by more than 2/255 (today 3910 token colors, 13 themes, both schemes) |
| sokkel-ui | `bun run tokens --check` (exists) | The CSS is not what the contract's `tokens.json` makes |
| sokkel-ui | `parts.test.ts` (new) | A component's word default, paint class, size or key binding is not the spec's |
| sokkel-ui-egui | `make tokens-check` (exists) | The embedded resolved file is not the contract's |
| sokkel-ui-egui | `tests/parts.rs` (new) | A widget's measured size, state paint or key handling is not the spec's |
| Both | Specimens | Nothing fails automatically. The side-by-side page shows each pair for the eye |

**How a change flows.** A token, a part spec or a principle changes here once, in one PR that moves
the contract version. Each renderer then takes the new version: sokkel-ui runs `bun run tokens`,
sokkel-ui-egui runs `make tokens`, and both run their checks. A widget or component that no longer
matches fails its own check in its own repo. The renderer is then fixed, or the spec is questioned
here. Both renderers regenerate their specimens, and the side-by-side shows what changed.

## From Rust

A `sokkel-design` crate holds hand-written serde types for the part files and the resolved file
(`Part`, `Size`, `State`, `Paint`, `Paints`), and embeds both. Generating the types from the schema
would fight Rust's idiom for little gain at this size. The value grammar parses into one enum:

```rust
enum ColorRef {
    Token { name: String, alpha: Option<u8> },          // primary, primary/80
    Fallback { a: String, b: String },                  // page-title-ink|foreground
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

| What | Today | Once sokkel-design exists |
|---|---|---|
| `tokens.json` | `sokkel-ui/packages/core/tokens/tokens.json` | `sokkel-design/tokens/tokens.json`, published as `@winterop-com/sokkel-design` and as a crate `sokkel-design` |
| CSS from tokens | `sokkel-ui/scripts/build-tokens.ts` | Stays in sokkel-ui, which reads the contract's `tokens.json` |
| The resolver | `sokkel-ui-egui/scripts/resolve.ts`, `resolve-tokens.ts` | `sokkel-design/tokens/`, writing `tokens.resolved.json` (tokens and `paints`) beside `tokens.json`; it reads the part specs, so it lives beside them |
| `tokens.resolved.json` | `sokkel-ui-egui/crates/core/tokens/` | `sokkel-design/tokens/`; egui embeds it from the crate |
| `verify-colors` | `sokkel-ui-egui/scripts/verify-colors.ts` | `sokkel-design`, against CSS made by sokkel-ui's build |
| Part specs | Prose in `sokkel-ui/docs/plan.md` and doc comments | `sokkel-design/parts/` |

When and how this happens are open questions (`open-questions.md`).

## Order toward an egui app that follows the shell

From the egui side (proposal, section a). Each step is a spec here first, then a widget there.

| Step | Parts | Spec here |
|---|---|---|
| 1 | Shell, Rail, TopBar, StatusLine | `patterns/shell` (draft) |
| 2 | PageHeader, Section, page states | In `patterns/shell` for now |
| 3 | DataTable, the list variant first | `parts/table` (draft) |
| 4 | Select, Dialog with SettingsDialog, DropdownMenu, Tooltip, CommandPalette | Settings in `patterns/shell`; the rest to come |
| 5 | The field family: number, date and select fields | `parts/text-field` (draft) sets the frame they share |
| 6 | Toast, Callout, Banner | To come |
| 7 | Add-ons (charts, maps), as the patterns ask | To come |

Button is drafted first because every step uses it. Text field sets the frame the whole field family
shares.
