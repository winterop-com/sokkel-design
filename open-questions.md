# Open questions

These are the decisions the owner needs to make, each with options and a recommendation. Then
findings that need a call, the tokens the specs ask for, and what does not fit egui's immediate mode.

## Decisions

Decided by the owner on 2026-11-14 (`sokkel-ui-egui/docs/proposals/open-questions-decided.md`, D1 to
D10). Each says what was decided and where it stands.

### 1. Where `tokens.json` lives: specs now, tokens at 1.0

Decided **b**. `tokens.json` stays in sokkel-ui until 1.0. sokkel-design reads it at the commit
`sokkel-ui.json` pins, and `check.py` fails a spec that names a token that version lacks, and a
resolved file made from another commit. Done.

### 2. The resolver: in sokkel-design, in TypeScript

Decided **a**, the TypeScript kept. `scripts/resolve.ts` (with `resolve-tokens.ts` and `paints.ts`)
writes `tokens/tokens.resolved.json`, the tokens and the paints, here. `verify-colors` runs in this
repository's CI (`.github/workflows/contract.yaml`) against the pinned sokkel-ui's generated CSS,
the paints and elevations included. Done; sokkel-ui-egui takes the resolved file from here next.

### 3. Versioning: in lockstep with sokkel-ui

Decided **a** before 1.0: `index.json`'s `version` is the sokkel-ui release the contract ships in
(0.28.0), and egui states the sokkel-ui version whose contract it meets. Revisit at 1.0. Done.

### 4. Parts: one contract version, a status, a changelog

Decided **a**: no version per part. Each part and pattern says `draft` or `stable` (README,
"Status"), and `CHANGELOG.md` has a line for each change. Done.

### 5. Patterns: the shell now

Decided: the shell now, other patterns when an egui app needs them. Recorded in the README and
`patterns/shell.md`.

### 6. How a new app starts the same way on each target

Decided: one app shape as data is the plan (places, route ids, settings sections, commands,
shortcuts, words, appearance keys), with starters in each renderer's `examples/`. Its schema and
fixtures come when a second app is ported, sokkel-ui's tasks example the first to read it. No web
pages inside an egui app, and no scaffolder yet. A plan, recorded in the README; nothing is built.

### 7. What egui must have before an egui app follows the shell

Decided: the listed minimum is the gate, behavior and accessibility included. `patterns/shell.md`
("Before an egui app follows the shell") lists it. egui's work.

### 8. Specimens

Decided: an egui story copies the data of the sokkel-ui story at its path, the 500-run tables
included, and the pairs are a CI artifact until the format settles. egui's work.

### 9. Words as templates

Decided: sokkel-ui keeps its words as functions, and its parts test samples them. A spec's
`samples` say what a word says at zero, one and many and with each value it interpolates, and
`check.py` fails a templated or counted word without them. Done in sokkel-ui.

### 10. Paints

Decided: every color and ring a spec paints is drawn from the resolved paints, with a check that
fails local mixing on those paths; sizes stay in `sizes`; colors an app supplies at run time stay
free. Recorded as principle 20. sokkel-ui needed nothing: its parts test reads every spec paint
from the class that draws it, mixes included. The check that fails mixing in egui is egui's work.

## Findings that need a call

These were found while writing the specs. Nothing was changed.

| Where | Finding | Question |
|---|---|---|
| sokkel-ui `DataTable` | In the table view no key sorts; the head buttons are not tab stops | Should the keyboard map include sorting? |
| sokkel-ui `Rail` | Its expanded and collapsed entries have no focus ring of their own. They take the browser's outline in `ring/50` (`base.css`). The head's collapse control draws a 2px `ring` outline 2 off, and the home link and the strip's entries a 2px `ring/50` ring | Should the frame's controls share one keyboard focus look, and which one? |
| sokkel-ui `Shell` top bar | The menu button has no hover ink and no focus ring of its own (it is a finger square below 768 since sokkel-ui 0.26.0) | Should it look like the rail's collapse control? |
| sokkel-ui `StatusLine` | It draws only the strip's contents. `Shell` draws the strip, and the `Patterns/Status line` story rebuilds the strip by hand (`h-shell-foot`, the rule, the ground, `px-3`) | Should `StatusLine` own the strip, as egui's does, so a story and an app draw one part? |
| sokkel-ui `TopBar` | The palette's button stands before the screen's actions, which end the bar. The shell spec used to put the palette's button at the end, and egui follows that | `parts/top-bar` states today's order (actions last), and egui's drift asks it to follow. Is that the order wanted? |
| sokkel-ui `Shell` | Its doc comment says the rail's head and the top bar share one rule. The head draws none, so the top bar's rule stops at the rail's edge | Should a rule run under the rail's head too? |
| sokkel-ui `PageHeader` | It draws `trail` over the title outside a `Shell`, and inside one too unless `trailInTop` is set. Principle 8 says the page header never draws a trail | Should `trailInTop` be the default inside a `Shell`, so a page in the frame cannot draw a second trail? |
| sokkel-ui `PageState` | With `frame={false}` a warning keeps its `warning/8` wash (and sets an edge color with no width), though the frame's doc comment says an unframed state has no edge or ground of its own. egui draws none | Should the wash stay without the box, which sets the warning apart in a panel, or should unframed mean no ground in every tone? |
| sokkel-ui `Section` | The boxed head's title is `text.head`, the table head's size, weight and tracking, but not its case (`table-head-transform`). In terminal, table heads are in capitals and section heads keep their case with the heads' tracking | Should the boxed head follow the table head's case too, since it is set like one? |
| sokkel-ui `PageHeader`, `Section` | A count beside a title is drawn two ways: the page header's `count` in the body face with tabular figures, a section's `meta` in the code face | Should a count beside a title look the same in both heads? |
| sokkel-ui `Select` | A list pads its rows only inside a `SelectGroup` (4 all round). `SelectField`'s and the theme select's lists hold no group, so their rows and the highlight's corners stand flush with the list's edge, where a menu's rows stand 4 in. egui pads 4 | Should the list pad its rows 4 as a menu does, in a group or not? |
| sokkel-ui `Select`, `DropdownMenu` | A list's and a menu's rows are 30 tall at both densities, while the select's trigger follows `density.control`. egui derives its select rows from `density.control` (28, 24 compact) | Should the rows follow the density, one step shorter at compact? |
| sokkel-ui `Select` | An option's icon stands 8 before its label in the list (`ItemText`'s `gap-2`) and 6 in the trigger (the value's `gap-1.5`); a theme's swatch stands 8 before it in both | One gap for the lead in both places? |
| sokkel-ui `ThemePicker` | A theme's swatch is the theme picker's own lead (`OptionLabel`, `Swatch`), not an option of `Select` or `SelectField`. egui's `Select` takes `swatches` | Should `SelectField` take a swatch as an option's lead, so a theme select outside the picker draws it the same way? |
| sokkel-ui tooltip | Two looks. The tooltip primitive is inverted (`foreground` ground, `background` ink, 12 by 6, an arrow); the rail's collapsed entries and `SwitchField`'s reason draw their own on `popover` with `elevation-pop` (8 by 4, no arrow) | One tooltip look for the library, and which? |
| sokkel-ui tooltip | A tooltip waits Base UI's 600 ms unless a `TooltipProvider` holds it, which sets 0. `Shell` holds no provider, so an app's tooltips wait 600 unless the app adds one; egui waits 0.5 s | Should the library give one delay, from a provider in `Shell` or from the primitive's own default? |
| sokkel-ui `Select`, `DropdownMenu` | The popups wear Tailwind's `shadow-md` (a submenu `shadow-lg`), black at 10 percent in both schemes, not an elevation token. `AccountMenu`'s and `NavBar`'s menus restyle the same popup with a `border-strong` edge and `elevation-pop`, as `AsyncSelect`'s list and the rail's tooltip wear `elevation-pop` | One popup look: should every popup wear an elevation token (and an edge), so a theme sets it and egui reads it as structured layers, and the account menu needs no look of its own? |
| sokkel-ui `DialogShell`, `SettingsDialog` | A dialog becomes a full-screen sheet below 640 (`max-sm`), and the settings dialog's entries a list to go into, while the shell pattern and principle 5 put the phone below 768. From 640 to 767 (the foldable open at 690) a dialog is a box | Should dialogs turn into sheets below 768, as the rest of the frame does, or is 640 the dialog's own line? |
| sokkel-ui dialogs | The backdrop blurs what is under it (`backdrop-blur-xs`, 4px) where the browser can. egui cannot blur and only dims. The specs keep the blur out of every paint and say it in `rendererSpecific` | Keep the blur as a web-only touch, or drop it so both renderers draw the same backdrop? |
| sokkel-ui dialogs | A dialog wears no shadow, only its 1px `foreground/10` ring, while the select's list and the menus wear `shadow-md` and the drawer `elevation-pop`. egui puts `elevation-pop`'s shadow under its dialogs, its settings dialog and its palette | Should a dialog wear an elevation token (one per kind of surface), or stay flat on the shade? |
| sokkel-ui `CommandPalette` | The active row is washed `muted` in `foreground`, while the menus' and the select's highlighted rows wear `accent` in `accent-foreground` | One highlight for every list of choices, or is the palette's quieter wash on purpose? |
| sokkel-ui `CommandPalette` | The arrows stop at the first and the last row (cmdk without `loop`), while a menu wraps around (Base UI's menu) and a select stops | Should every list of choices behave the same at its ends? |
| sokkel-ui `CommandPalette` | cmdk's own Ctrl+N and Ctrl+J move down and Ctrl+P and Ctrl+K up. Ctrl+K is also the palette's key (Mod+K on Windows and Linux, and Ctrl+K on a Mac too): in a `Shell` it closes the palette, under `usePaletteShortcut` it moves the active row up | Turn cmdk's vim keys off (`vimBindings={false}`), so Ctrl+K means one thing? |
| sokkel-ui `CommandPalette` | While a command's promise is pending, Escape and a press outside still close the palette, and its settling is let go. A dialog's busy confirm holds its dialog open until it is done | Should a busy palette hold as a busy dialog does, or is leaving a running command on purpose? |
| sokkel-ui `CommandPalette` | A one-line row's `meta` is `muted-foreground`; a two-line row's (the search result's quiet fact at its end) is `faint` | One quiet ink for a meta? |

## Tokens the specs ask for

**Landed in sokkel-ui 0.25.0:** the control heights per size, `density.control-xs`,
`density.control-sm`, `density.control`, `density.control-lg`, 24/28/32/36 at regular and one step
smaller at compact. Every control reads them, and they resolve in `tokens.resolved.json`.

**Decided and adopted in sokkel-ui 0.28.0** (2026-11-14). Each is defined in sokkel-ui's
`tokens.json`, used there in place of the literal, and named by the specs:

| Token | Value |
|---|---|
| Focus ring | `focus-ring-width` 2 and `focus-ring-offset` 2; the invalid ring `invalid-ring` (`critical` at 20 percent in light, 40 in dark) and `invalid-ring-width` 3 |
| Disabled | `disabled-opacity` 0.5 |
| Motion | `motion-fast` 100 ms, `motion-base` 200 ms, `motion-ease` ease-out (Tailwind's curve, 0, 0, 0.2, 1); all stilled when motion is reduced |
| Layers | `layer-drawer` 40, `layer-dialog` 50, `layer-popover` 60, `layer-toast` 70, so a popup opened in a dialog shows over it |
| Elevation | Structured: each `elevation-*` is layers of x, y, blur, spread and color (`elevations` in the resolved file); `elevation-dialog` added, `elevation-pop` until a theme sets its own |
| Inks | `page-title-ink` and `section-head-ink` fall back to `foreground`, so the `a\|b` fallback is gone from the grammar |
| Breakpoints | `breakpoint-md` 768 and `breakpoint-lg` 1024, the values Tailwind's `md` and `lg` use |
| Scroll bar | `scrollbar-width` 10, on a solid track whose room is kept |

**Later:** a named spacing scale (the specs keep exact part spacings meanwhile), and the state
mixes (`secondary-hover`, `row-critical`, `row-warning`), resolved as paints until a theme needs
them.

**CSS-only, by design:** `density.page-inset` (a `cqi` clamp; egui takes its wide and narrow ends by
the content's width) and `scrollbar` (the colors of the browser's own scroll bars).

## What does not fit egui's immediate mode

| Web | egui | In the specs |
|---|---|---|
| Styling from context (`:has()`, `in-data-[slot=...]`, `aria-expanded`) | Every one must be passed | Rule 2: explicit options (`iconPlace`, `inGroup`, `opensMenu`, `inRow`, `inSection`) |
| A part sized by its content in a wrapping row | Wraps only before a child of known size | Rule 3: fixed heights and width rules |
| `:focus-visible` | Focus is focus. Keyboard-only focus requires the renderer to track the last input kind, a key or a pointer, and draw the ring only after a key | Rule 4: `on: keyboard` or `any` per focus state; specimens reach focus by Tab |
| A disabled button that is still focusable, its reason on focus | Disabled widgets are not focusable, and tooltips show on hover | `Sense::focusable_noninteractive` (sokkel-ui-egui does this now), and the tooltip shown on focus |
| A scroller whose bar keeps its room | Bars float over the content unless the scroll style is solid | The shell gives the content's bar `scrollbar-width` (10) and a solid track |
| How long a new page's heading is waited for before focus moves (3 s) | Its own frame timing | Renderer-specific (`Shell`'s `routeKey`); not in the contract |
| Transitions, `animate-pulse`, spinners | Explicit animation, and a repaint each frame | Durations are `motion-fast` and `motion-base` on `motion-ease`; specimens run with motion stopped |
| Media queries and container queries | Only the available rect | Breakpoints as px (rule 5). The table stacks by its own width, which egui knows; the page inset takes its two ends |
| A route (`#/settings`), Back, deep links | No URL | A route is app state with a back stack; settings-open keeps the page under it |
| An inert page under a dialog, focus returned on close | `Modal` blocks input; focus return is the widget's job | The shell spec lists Escape order and focus return |
| Hover known at once | Hover comes from last frame's rects, one frame behind | Specimen runners run frames until the board settles |
| Fonts | Applied a frame after they are set | Handled in egui; runners skip the first frame |
| A 16px text input on a phone (zoom guard) | No such zoom | Web-only, listed as renderer-specific |
| A blur under a dialog's backdrop (`backdrop-filter`) | No blur; `Modal`'s backdrop is a fill | Renderer-specific: said in `rendererSpecific` and kept out of every paint (`parts/dialog`) |
| Accessible names from the DOM | AccessKit from `WidgetInfo` | Specimen targets are role and name, so custom-painted parts (table rows) must report theirs |
