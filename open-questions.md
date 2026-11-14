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
| sokkel-ui `Select` | A list padded its rows only inside a `SelectGroup` (4 all round), so `SelectField`'s and the theme select's rows stood flush with the list's edge, where a menu's stand 4 in; egui pads 4 | **Decided:** every select list pads its rows 4, in a group or not; a group has no pad of its own. Done in sokkel-ui (`parts/select`) |
| sokkel-ui `Select`, `DropdownMenu` | A list's and a menu's rows were 30 tall at both densities, while the select's trigger follows `density.control` | **Decided:** a one-line select or menu row is `density.control` tall (32, 28 compact), a finger tall below 768. Done in sokkel-ui, the context menu's, menu bar's, combobox's and account menu's rows too (`parts/select`, `parts/dropdown-menu`) |
| sokkel-ui `Select` | An option's icon stood 8 before its label in the list and 6 in the trigger; a theme's swatch 8 in both | **Decided:** 8 between a lead (an icon or a swatch) and its label, in the trigger and the list. Done in sokkel-ui (`parts/select`) |
| sokkel-ui `ThemePicker` | A theme's swatch was the theme picker's own lead, not an option of `Select` or `SelectField`; egui's `Select` takes `swatches` | **Decided:** a swatch is a general option lead of `SelectField` (`swatch`), drawn by the theme picker's part (`ThemeSwatch`). Done in sokkel-ui (`parts/select`) |
| sokkel-ui tooltip | Two looks: the inverted primitive, and the rail's collapsed entries and `SwitchField`'s reason on `popover` with `elevation-pop` (8 by 4, no arrow) | **Decided:** one tooltip, the inverted one: `foreground` ground, `background` ink, 12 by 6, `radius-md`, a 10 arrow, no edge or shadow. Done in sokkel-ui, the rail's and `SwitchField`'s moved to it (`parts/tooltip`, `parts/rail`) |
| sokkel-ui tooltip | A tooltip waited Base UI's 600 ms unless a `TooltipProvider` set 0; `Shell` holds no provider; egui waits 0.5 s | **Decided:** 500 ms under the pointer, the primitive's own default, with or without a provider; at once on keyboard focus. Done in sokkel-ui (`parts/tooltip`) |
| sokkel-ui `Select`, `DropdownMenu` | The popups wore Tailwind's `shadow-md` (a submenu `shadow-lg`) and a `foreground/10` ring, while `AccountMenu`'s and `NavBar`'s menus restyled the popup with a `border-strong` edge and `elevation-pop` | **Decided:** every popup wears `popover` and `popover-foreground`, `radius-surface`, a 1px `border-strong` edge and `elevation-pop`, no Tailwind shadow and no look of its own. Done in sokkel-ui (`lib/popup`), for the select list, the menus and submenus, the account and NavBar menus, and the combobox, popover and hover card besides (`parts/select`, `parts/dropdown-menu`, `parts/text-field`) |
| sokkel-ui `DialogShell`, `SettingsDialog` | A dialog became a full-screen sheet below 640, while the frame's phone line is 768; from 640 to 767 a dialog was a box | **Decided:** one line, 768: below it a dialog is a full-screen sheet and settings a list of sections to go into; a ConfirmDialog stays a box sized to its words. Done in sokkel-ui (`parts/dialog`, `parts/settings-dialog`, `patterns/shell`) |
| sokkel-ui dialogs | The backdrop blurred what was under it (`backdrop-blur-xs`), which egui cannot draw | **Decided:** no blur; every renderer draws the same backdrop, the dim alone. Done in sokkel-ui, the `rendererSpecific` entry gone (`parts/dialog`) |
| sokkel-ui dialogs | A dialog wore no shadow, only a 1px `foreground/10` ring; egui put `elevation-pop`'s shadow under its dialogs | **Decided:** a boxed dialog, the settings dialog and the palette wear `elevation-dialog` and a 1px `border-strong` edge; a full-screen sheet has neither. Done in sokkel-ui (`parts/dialog`, `parts/settings-dialog`, `parts/command-palette`) |
| sokkel-ui `CommandPalette` | The active row was washed `muted` in `foreground`, while the menus' and the select's wear `accent` in `accent-foreground` | **Decided:** one highlight for every list of choices: `accent` ground, `accent-foreground` for its icon, label and meta. Done in sokkel-ui, the top bar's search, the async select, the filter lists and the mentions too (`parts/command-palette`) |
| sokkel-ui `CommandPalette` | The palette and a select stopped at their ends, a menu wrapped | **Decided:** every list of choices stops at its first and last row; Home and End reach them. Done in sokkel-ui: the menus no longer wrap, nor do the top bar's search and the mentions (`parts/dropdown-menu`, `parts/command-palette`) |
| sokkel-ui `CommandPalette` | cmdk's Ctrl+N, Ctrl+J, Ctrl+P and Ctrl+K moved the active row, Ctrl+K being the palette's key too | **Decided:** cmdk's vim keys are off; Mod+K toggles the palette, in a `Shell` or not, `usePaletteShortcut` included. Done in sokkel-ui (`parts/command-palette`) |
| sokkel-ui `CommandPalette` | While a command's promise was pending, Escape and a press outside closed the palette and its settling was let go | **Decided**, as the owner refined it: a palette whose command is running holds open (Escape, a press outside, its Close and Mod+K included); after `busy-release` (5000 ms, a token, and `busyRelease` on the part) a Stop waiting row appears and Escape closes again, letting the command go unheard, nothing cancelled. A busy dialog confirm releases the same way: Escape and Cancel, saying Stop waiting, come back, the confirm busy until the work settles. Done in sokkel-ui (`parts/command-palette`, `parts/dialog`) |
| sokkel-ui `CommandPalette` | A one-line row's `meta` was `muted-foreground`, a two-line row's `faint` | **Decided:** a meta is `muted-foreground` on one line or two, `accent-foreground` on the active row; a status tone stays. Done in sokkel-ui (`parts/command-palette`) |

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
| Busy release | `busy-release` 5000 ms: how long a busy palette or dialog holds before it offers Stop waiting (F23, as refined); not motion, so never stilled |
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
| Accessible names from the DOM | AccessKit from `WidgetInfo` | Specimen targets are role and name, so custom-painted parts (table rows) must report theirs |
