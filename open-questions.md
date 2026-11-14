# Open questions

These are the decisions the owner needs to make, each with options and a recommendation. Then
findings that need a call, the tokens the specs ask for, and what does not fit egui's immediate mode.

## Decisions

### 1. Where `tokens.json` moves, and when

- **a. Now.** sokkel-design holds `tokens.json`, and sokkel-ui installs it. Every token change during
  sokkel-ui's heavy development becomes two PRs and a version bump.
- **b. Specs now, tokens at 1.0.** `tokens.json` stays in sokkel-ui until 1.0. sokkel-design reads
  it at a pinned sokkel-ui version, and its check fails when a spec names a token that version
  lacks. The move happens with the open-sourcing at 1.0.
- **c. Never.** The tokens stay in sokkel-ui and sokkel-design holds only specs.

Recommendation: **b.** It costs sokkel-ui nothing now. The control-height tokens that landed in
sokkel-ui 0.25.0 show that tokens still move weekly.

### 2. The resolver's home and language

Today it is TypeScript in sokkel-ui-egui (`scripts/resolve.ts`, `resolve-tokens.ts`,
`verify-colors.ts`), and it reads sokkel-ui. Options:
- **a.** Move it to sokkel-design as it is, writing `tokens.resolved.json` beside `tokens.json`,
  published on npm (`@winterop-com/sokkel-design`) and as a crate (`sokkel-design`, which embeds the
  file).
- **b.** Into sokkel-ui's `build-tokens.ts`, as the egui proposal patch
  (`sokkel-ui-egui/docs/proposals/sokkel-ui-resolved-tokens.patch`) tried once.
- **c.** A Rust port in a `build.rs`.

Recommendation: **a**, with the TypeScript kept. The resolver now also resolves every color the
part specs name into `paints` (README, "Resolved paints"), so it reads the specs and belongs beside
them. **b** would put the specs in sokkel-ui. `verify-colors` needs Chromium and sokkel-ui's
generated CSS, so it runs in sokkel-design's CI against a pinned sokkel-ui. It checks the paints as
well as the tokens.

### 3. Versioning the contract

- **a. Lockstep with sokkel-ui.** One version for the contract and sokkel-ui. sokkel-ui-egui states
  which contract version it implements. This is the egui proposal's "release at one version keeps it
  bearable."
- **b. Its own semver.** Each renderer declares the contract range it meets.

Recommendation: **a** before 1.0, with breaking changes moving the minor, as sokkel-ui does. Decide
**b** at 1.0 only if the renderers' paces split.

### 4. Numbering and versioning parts

- **a.** No per-part version. The contract version covers every file, and each part has `status`
  (`draft` or `stable`) and a line in the contract's changelog. This draft does this.
- **b.** Per-part semver in each file, which renderers pin part by part.

Recommendation: **a.** Parts are not numbered. Their id is their name (`button`, `text-field`,
`table`), and `index.json` sets their order.

### 5. Are patterns in scope now?

The shell is drafted because the goal ("web / Tauri / Electron / egui apps all in a similar
fashion") is mostly the frame. Options: only the shell now, then dialogs and the settings dialog as
step 4 asks; or patterns in general (forms with their issue count, list beside detail, dashboards)
after the parts settle. Recommendation: **the shell now**, then others only as an egui app needs
them.

### 6. How a new app starts the same way on each target

Today a sokkel-ui example is `examples/<name>/{web,electron,tauri}`, with `examples/shared` (fake
backend, window frame, hash route, mark). Web, Electron and Tauri share one web app. An egui app
shares nothing with it yet. What would make all four start alike:
- **One app shape, as data.** The places (rail groups), the routes, the settings sections, the
  palette's commands, the shortcuts and the words, in one file each target reads. Only the pages are
  per target.
- **A starter per target sharing that structure.** Web (Vite and sokkel-ui), the Electron and Tauri
  shells over it (as today), and egui (eframe and sokkel-ui-egui with its `Shell`). Each opens on the
  same frame with the same places, settings on its route, and the appearance kept under the same
  keys (theme, scheme, density).
- **Later, a scaffolder.** `sokkel new <name> --targets web,tauri,egui` writes them, as a bun script
  or cargo-generate templates.

To decide: where starters live (sokkel-design, a `sokkel-starter` repo, or each renderer's
`examples/`), whether the app shape file is part of the contract, and whether an egui app may mix in
web pages (no is simpler).

### 7. What egui must have before an egui app can follow the shell

From the egui proposal's order, the minimum:
1. Shell, Rail (groups, collapse, resize, the drawer below 768), TopBar (trail, search, actions),
   StatusLine. **Built** (`widgets/frame.rs`) except rail resize, the drawer and the search field.
   The rail, the top bar and the status line now have specs of their own (`parts/rail`,
   `parts/top-bar`, `parts/status-line`), whose drift lists what is still to build.
2. PageHeader, Section, PageState (loading, failed, empty). PageHeader and PageState are built
   (`widgets/page.rs`); Section is not yet (`Card` with its bar is the nearest). Each now has a spec
   of its own (`parts/page-header`, `parts/section`, `parts/page-state`), whose drift lists what is
   still to build.
3. The table's list variant. **Built** (`widgets/table.rs`), with the table variant too; see the table
   spec's drift for what is still missing.
4. Dialog with SettingsDialog, the CommandPalette, a DropdownMenu (the account menu), a Tooltip, and
   Select (a settings row). **Built**; settings is open state the app holds, not a route, since egui
   has no URL. Select, DropdownMenu, Tooltip, Dialog (with ConfirmDialog), SettingsDialog and the
   CommandPalette now have specs of their own (`parts/select`, `parts/dropdown-menu`,
   `parts/tooltip`, `parts/dialog`, `parts/settings-dialog`, `parts/command-palette`), whose drift
   lists what is still to build.
5. Not visual, but part of the frame: a shortcuts registry (Mod+K, `?`, `/`), a back stack with the
   settings overlay, and the appearance kept (`Appearance` exists).

The rest of the field family (step 5), the short messages (step 6) and the add-ons (step 7) can follow
apps rather than precede them.

### 8. Specimens: new stories, and where the pairs are shown

Specimen ids are now Storybook story paths, so egui's snapshots pair with them by name. Most are
existing stories. Three are new stories under the real titles (`Button/Sizes`, `Text field/States`,
`Text field/Issue open`), and they show real states, so they fit sokkel-ui's story rules. Two
questions remain. Does an egui story copy the data of the sokkel-ui story at its path (the 500-run
tables included)? And where is the side-by-side shown: a CI artifact only, or a page beside the
published Storybook? Recommendation: copy the data, since pairing by name only works if the stories
match, and keep the side-by-side as an artifact until the format has settled.

### 10. Paints: how far renderers go without tokens

With `paints` resolved at build time, should sokkel-ui-egui stop calling `color_at` and blending for
anything a spec paints, with a check that fails a widget doing so? Should a paint carry lengths too
(ring width and offset do already), or stay colors? Recommendation: yes to the first, since that is
the point of resolving. Colors and rings only for now, with sizes staying in `sizes`, resolved per
density.

### 9. Words as templates

sokkel-ui's words are functions (`rows: (count) => ...`), and the spec writes them as templates with
plural forms (`{ "one": "{count} row", "other": "{count} rows" }`). The check calls each function
with sample arguments and compares. Should sokkel-ui's words become templates instead, which would
also serve the coming `locale`? Recommendation: keep functions, and compare by sampling.

## Findings that need a call

These were found while writing the specs. Nothing was changed.

| Where | Finding | Question |
|---|---|---|
| sokkel-ui `DataTable` | In the table view no key sorted; the head buttons were not tab stops | **Decided:** sorting by keys. Up from the first row enters the head row, Left and Right choose a sortable head, Enter or Space turns its order (ascending, descending, as given), Down returns to the rows; the table keeps one tab stop. Done in sokkel-ui (`parts/table`) |
| sokkel-ui `Rail` | Its expanded and collapsed entries had no focus ring of their own, the home link and the strip's entries a 2px `ring/50` ring, the collapse control a 2px `ring` outline 2 off | **Decided:** one keyboard focus look for the frame's controls, the button's own: a 2px `ring` outline 2 off, on keyboard focus only. Done in sokkel-ui for the rail, the top bar, the panel toggle and the account control (`patterns/shell`) |
| sokkel-ui `Shell` top bar | The menu button had no hover ink and no focus ring of its own | **Decided:** it looks like the rail's collapse control: `hover` ground and `foreground` ink under the pointer, the frame's focus look, a finger square below 768. Done in sokkel-ui (`parts/top-bar`) |
| sokkel-ui `StatusLine` | It drew only the strip's contents; `Shell` drew the strip, and the `Patterns/Status line` story rebuilt it by hand | **Decided:** `StatusLine` owns its strip (`spacing-shell-foot` tall, `page-foot-ground`, a 1px `page-foot-line` rule over it, 12 across); `Shell` gives it the room and draws no strip of its own. Done in sokkel-ui, the story drawing the part alone (`parts/status-line`) |
| sokkel-ui `TopBar` | The palette's button stands before the screen's actions, which end the bar; egui puts the palette's button last | **Decided:** actions last: the search, the trail, the palette's button, then the screen's actions, 12 between those groups and 6 between actions. sokkel-ui already drew it so; egui's drift stays until it follows (`parts/top-bar`) |
| sokkel-ui `Shell` | Its doc comment said the rail's head and the top bar share one rule, though the head draws none | **Decided:** no rule under the rail's head, in the frame or the drawer. Done in sokkel-ui: `Shell`'s doc comment is corrected (`parts/rail`) |
| sokkel-ui `PageHeader` | It drew `trail` over the title inside a `Shell` too unless `trailInTop` was set, against principle 8 | **Decided:** inside a `Shell` the page header draws no trail (`trailInTop` by default); outside one it keeps it. Done in sokkel-ui (`parts/page-header`) |
| sokkel-ui `PageState` | With `frame={false}` a warning kept its `warning/8` wash, where egui drew none | **Decided:** unframed means no ground and no edge, in every tone. Done in sokkel-ui (`parts/page-state`) |
| sokkel-ui `Section` | The boxed head's title is `text.head`, the table head's size, weight and tracking, but not its case | **Decided:** a section's boxed head keeps its title's own case, so it can hold names such as job names. sokkel-ui already drew it so (`parts/section`) |
| sokkel-ui `PageHeader`, `Section` | A count beside a title was drawn two ways: the page header's in the body face, a section's in the code face | **Decided:** one look in both heads: `text.help`, the body face, tabular figures, `muted-foreground`, 8 after the title; the code face is for codes. Done in sokkel-ui, for every pane head's `meta` (`parts/page-header`, `parts/section`) |
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

**Proposed** (from the egui proposal, section b, and these specs). Each renderer guesses these
today:

| Token | Today | Proposal |
|---|---|---|
| Focus ring | 2px `ring`, 2px off, in each component's classes | `focus-ring-width`, `focus-ring-offset`; and the invalid ring (3px, `critical` at 20 / 40 percent) |
| Disabled opacity | 0.5 in each component | `disabled-opacity` |
| Motion | Tailwind defaults: 100 ms dialogs; 200 ms the rail's collapse, the drawer and sheets, `ease-out` | `motion-fast` (100), `motion-base` (200: rail collapse, drawer), `motion-ease`, honored by "motion reduced" |
| Z-order | `z-40` drawer, `z-50` dialogs and popovers | `layer-drawer`, `layer-dialog`, `layer-popover`, `layer-toast` |
| Spacing steps | Tailwind's 0.25rem scale (`px-2.5`, `gap-1.5`) | A named step scale, or named part spacings (`control-pad-x`) |
| Elevation | `elevation-*` as box-shadow strings; the select's list and the menus wear Tailwind's `shadow-md` and `shadow-lg`; dialogs wear none; egui has one layer | Structured layers: `{ x, y, blur, spread, color }` each, one token per kind of surface (popover, dialog) |
| `currentcolor` parts tokens | `page-title-ink`, `section-head-ink` have no color in some themes | A named fallback in the tokens (this draft writes `page-title-ink\|foreground` in the spec) |
| State mixes | `mix(secondary, foreground 5%)` for a secondary hover; row tones `critical 8%`, `warning 10%` over `card` | `secondary-hover`, `row-critical`, `row-warning` |
| Breakpoints | Tailwind's `md` and `lg`, and `MOBILE_QUERY` (767) | `breakpoint-md: 768`, `breakpoint-lg: 1024` |
| Scroll bar | `scroller-thin`: the browser's thin width, room kept (`scrollbar-gutter: stable`) | `scrollbar-width: 10`, a solid track; egui's bars float over the content unless set solid |

**CSS-only, by design:** `density.page-inset` (a `cqi` clamp; egui takes its wide and narrow ends by
the content's width) and `scrollbar`.

## What does not fit egui's immediate mode

| Web | egui | In the specs |
|---|---|---|
| Styling from context (`:has()`, `in-data-[slot=...]`, `aria-expanded`) | Every one must be passed | Rule 2: explicit options (`iconPlace`, `inGroup`, `opensMenu`, `inRow`, `inSection`) |
| A part sized by its content in a wrapping row | Wraps only before a child of known size | Rule 3: fixed heights and width rules |
| `:focus-visible` | Focus is focus. Keyboard-only focus requires the renderer to track the last input kind, a key or a pointer, and draw the ring only after a key | Rule 4: `on: keyboard` or `any` per focus state; specimens reach focus by Tab |
| A disabled button that is still focusable, its reason on focus | Disabled widgets are not focusable, and tooltips show on hover | `Sense::focusable_noninteractive` (sokkel-ui-egui does this now), and the tooltip shown on focus |
| A scroller whose bar keeps its room | Bars float over the content unless the scroll style is solid | The shell gives the content scrollbar a width (10, proposed) and a solid track |
| How long a new page's heading is waited for before focus moves (3 s) | Its own frame timing | Renderer-specific (`Shell`'s `routeKey`); not in the contract |
| Transitions, `animate-pulse`, spinners | Explicit animation, and a repaint each frame | Durations wait for motion tokens; specimens run with motion stopped |
| Media queries and container queries | Only the available rect | Breakpoints as px (rule 5). The table stacks by its own width, which egui knows; the page inset takes its two ends |
| A route (`#/settings`), Back, deep links | No URL | A route is app state with a back stack; settings-open keeps the page under it |
| An inert page under a dialog, focus returned on close | `Modal` blocks input; focus return is the widget's job | The shell spec lists Escape order and focus return |
| Hover known at once | Hover comes from last frame's rects, one frame behind | Specimen runners run frames until the board settles |
| Fonts | Applied a frame after they are set | Handled in egui; runners skip the first frame |
| A 16px text input on a phone (zoom guard) | No such zoom | Web-only, listed as renderer-specific |
| A blur under a dialog's backdrop (`backdrop-filter`) | No blur; `Modal`'s backdrop is a fill | Renderer-specific: said in `rendererSpecific` and kept out of every paint (`parts/dialog`) |
| Accessible names from the DOM | AccessKit from `WidgetInfo` | Specimen targets are role and name, so custom-painted parts (table rows) must report theirs |
