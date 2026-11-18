# Changelog

The contract's version moves in lockstep with sokkel-ui before 1.0 (open questions, D3): each entry
is the sokkel-ui release that ships it, and a breaking change moves the minor. Parts have no version
of their own (D4); a change to a part is a line here under its name.

## 0.32.0

- shell: sokkel-ui's appearance rows are `useThemeSettings`, a hook (was `themeSettings`).
- table: a head wider than its column wraps between its words onto a second line, the head row
  growing to hold it, and is cut only past two lines (`layout.headLines`), its whole name on hover; it
  was cut on one line. A `content` column is never narrower than its head's longest word.

## 0.31.2

- No contract changes: the release fixes a graph's first fit, which the contract does not cover.

## 0.31.1

- tokens: `leading-*` tokens (`leading-code`, 24 px at the default) are resolved into the lengths; they were left out.
- code-editor: markdown #tags are `code-attribute` and jq's $ names stay in the text's ink, as sokkel-ui draws them (the spec said code-link and code-variable).

## 0.31.0

- Status: nothing in the contract is a draft. `section` and `text-field` are stable, their drift
  saying what egui and the terminal have not compared yet; the schema and `check.py` take `stable`
  alone, and the README says what status means.
- Words: counts group their thousands in every sample ("1,200 errors"), as sokkel-ui's English and
  ICU now both do; ids for the words that had none (`letter.to`, `secretField.replaceLabel`,
  `repeatedGroup.item`, `schema.*` for code-editor's issues, `panel.*` for time-series-panel's
  column names); json-tree `items`; repeated-group `itemAction`, `first`, `last`; tree-select loses
  `actions`; period-picker's year messages write it without groups.
- Parts follow sokkel-ui's fixes: secret-field's issue edge and invalid ring in a field;
  yes-no-field's edge on its choice; period-picker's `fieldInvalid` on its trigger; repeated-group's
  shut Moves reachable with a reason; problem's mark in its tone's ink; side-panel in
  `sidebar-foreground`; tree-select's Clear with the focus outline.
- glyphs: every icon's Nerd Font name and codepoint checked against Nerd Fonts v3.5.1's
  `glyphnames.json`, vendored as `vendor/nerd-fonts.json` (`scripts/nerd-fonts.py`); all were right.
- The pin moves to sokkel-ui f9b9c45.

- themes: terminal, phosphor and phosphor-bright set their capital table heads at `text-sm`, the cells' size; capitals with tracking already stand a step above the rows.
- Message ids: every spec's words carry their id in sokkel-ui's catalogs, `messages` (`{ id, en,
  with? }` by word, `null` where the catalog holds none), the English an ICU MessageFormat string
  as the catalog holds it. The resolver writes sokkel-ui's catalogs at the pin as one,
  `messages/en.json`, and `resolve --check` holds it; `check.py` fails a word without an entry, an
  id the catalog lacks, and English that is not the catalog's. Principle 24: renderers key their
  strings by these ids and read the same catalogs, so one translation serves all three. The site
  shows each word's id and ICU English. The words with no catalog message are findings in
  open-questions.md.
- shell, principle 9: light and dark are chosen only in Settings › Appearance and the command
  palette; the account menu's Appearance entry opens Settings there; never a scheme toggle in the
  top bar or the account menu (owner's decision; sokkel-ui #685).
- Status vocabulary: `index.json`'s `statuses`, the run states and the health states (`ok` good,
  `warn` warning, `fail` and `error` critical, sokkel-ui #687) every status part knows, each
  color's dot and ink tokens, the live state; `colorDepth.ansi16.paints` maps the run states'
  tokens by hue. `check.py` holds them.
- New parts, specified as they are in sokkel-ui b1cf984: `banner` (four tones painted so their
  opaque forms resolve, with cells), `side-panel` (with its panel section), `problem`,
  `json-tree`, `secret-field` (masked, the Show and Hide reveal, sealed with Replace), and the
  fields `yes-no-field`, `time-field`, `computed-field`, `repeated-group`, `period-picker` and
  `tree-select`; the rest of what egui built before a spec is staged in open-questions.md.
- Cells for the chart family (sokkel-tui c4): `dashboard-panel`, `stat-panel`,
  `time-series-panel` and `chart`; glyphs `spark-levels`, `stale`, `swatch` and `mask`, icons
  `circle-check`, `eye`, `eye-off`, `key-round` and `maximize`.
- Renderers: sokkel-egui as of 1a87987 (run-timeline built from its spec but for the handle's keys
  and touch hold; table grouping, details, row heights and the column-head role; section flat;
  the field frame with the issue mark, inputs 32 tall, the 33 drift gone; select codes and a
  placeholder; the shell's panel and banner); sokkel-tui as of 64f4b19 (button, text-field,
  page-header, section, dialog, select, stat-panel and time-series-panel built; table, rail,
  dropdown-menu, command-palette, dashboard-panel, chart, detail-pane and the shell partial).
- The pin moves to sokkel-ui b1cf984 (tokens unchanged; the catalogs and the health states).

## 0.30.1

- principle 3: corrected. A column head stands one text step above the cell text it heads, at
  medium weight in the foreground or the head ink a theme names, never weaker than its rows; 0.30.0
  had it backwards ("never louder than what it heads").
- table: the head and the group heads are `text.column-head` (16 / 24 at 500, one step above the
  rows' `text.body`) in `table-head-ink`, which is `foreground` in the base theme; the group heads'
  quieter `text.head` from 0.30.0 is reverted. A stacked card's labels stay `text.xs` in
  `muted-foreground`: they label one value, they are not column heads.
- tokens: the text role `column-head`; `table-head-size` is `text-base` and `table-head-weight` 500;
  `text.head` keeps 13 / 20 at 600 on its own (section's boxed head unchanged); cells lists
  `column-head`.

## 0.30.0

- themes: `phosphor` (green CRT text on near-black, and a derived light), `phosphor-bright` (high-contrast green on black, and a derived light) and `tray` (a grey tray with white cards and green accents; its dark keeps a deep blue strip), resolved from sokkel-ui 1a34d88.
- code-editor: folding's keys need no bracket: Mod+. and Mod+Shift+. for the block, Mod+Alt+. and
  Mod+Alt+Shift+. for every block; CodeMirror's bracket keys stay second (principle 17).
- time-series-panel: `marks`, lines across at values (a target, a limit), dashed with the label
  and value at the end, the axis reaching each, as sokkel-egui's mark draws them; chart: `targets`.
- chart: a hidden legend entry at `disabled-opacity`.
- stat-panel: the dashboard panel's `border-strong` edge and its tools' focus outline; the meter's
  `track`, `muted` (`on-fill/25` filled); no value foot under a target meter.
- table: a group's head is `text.head` in `table-head-ink`, never louder than its rows; principle 3
  says a head is never louder than what it heads.
- rail: the widths are sokkel-ui's `RAIL_SIZE`.
- open-questions: the five findings of the chart round decided and done.
- The pin moves to sokkel-ui 25edcde (tokens unchanged).
- code-editor, date-field: two new parts, specified as they are in sokkel-ui 8567f05 (`CodeEditor`:
  its variants and sizes, languages and their `code-*` token colors, marks and problems, completions
  with schema snippets, folding, search, the caret line and `[[link]]` following, the schema's words
  with samples; `DateField`: the typed date in three formats, bounds, the calendar it opens and its
  keys). Specimens for their stories.
- The chart family begins (owner's decision): `chart` (the look every kind shares: axes, grid, the
  series palette and `statuses`, the tooltip, the legend, the missing dash), `dashboard-panel` (the
  frame every panel stands in: head, tools and menu, loading, empty, failed and stale),
  `stat-panel` (thresholds, the change, the target meter) and `time-series-panel` (fills,
  threshold lines, the threshold legend); the rest of the family staged in open-questions.md.
  Specimens for their stories, one for a new Targets story.
- T1 decided: sixteen colors by role, `colorDepth.ansi16.paints` (red, yellow, green and blue by
  tone, bright black for the quiet inks, the terminal's defaults for grounds and inks, reverse
  video for hover, the accent and a selection); `check.py` holds the map.
- T2 decided: under a layer with a scrim, truecolor and 256 colors flatten each cell at run time,
  the one blend principle 20 allows; sixteen colors and no color draw it in two fixed colors
  (`colorDepth.underLayer`). The overlays' cells say so.
- Renderers: sokkel-egui as of b7e1763 on the new parts (date-field and stat-panel and
  time-series-panel partial: the date-only form, the target meter and the mark built) and on
  text-field (a text input 33 tall at regular since egui 0.37, drift); sokkel-tui as of 933b2da,
  missing on the new parts.
- The pin moves to sokkel-ui 8567f05 (tokens unchanged).
- open-questions: findings from the new parts (folding's bracket keys, the time series' marks, a
  hidden legend entry's opacity, the panels' two focus looks and edges, the target meter's
  run-time track).

- Three renderers: sokkel-ui, sokkel-egui and sokkel-tui (ratatui, in a terminal), listed in
  `index.json`'s `renderers`. Every part and pattern carries `renderers`, each renderer's state
  (`missing`, `partial` or `built`) as of a commit of its own repository: sokkel-ui built (partial on
  table and text-field, by their drift), sokkel-egui partial on fifteen and missing on the six newest,
  sokkel-tui missing on all, its spike drawing the frame and a table by hand. Status is the
  contract's; the schema requires `renderers` and `check.py` fails a stable part sokkel-ui has not
  built. `sources`, `rendererSpecific` and `drift` take `sokkel-tui`.
- Opaque paints: every part says what its pieces stand on (`standsOn`, an opaque surface in every
  theme, which `check.py` holds), and the resolved paints carry `flat`, each field that is not opaque
  (or is `inherit`) laid over that surface in sRGB as a browser composites, and `faded`, the paint
  drawn at a fading state's opacity (`disabled` at `disabled-opacity`); `paintSources` names each
  paint's `standsOn`. verify-colors draws both in Chromium: 32253 comparisons, all within 2/255.
- Cells: `index.json`'s `cells` holds the grid (8.4 px a column; md 90 and lg 120 columns; check
  sizes 60x20, 80x24, 120x40, 200x50; the rules for rows, blank rows, density, corners and shadows)
  and text roles in cells (bold from weight 500, no italics, the piece's ink). A part's optional
  `cells` gives its rows, padding, gaps, width and glyphs: written for button, text-field,
  page-state, page-header, section, table, rail, top-bar, status-line, tooltip and the shell.
- Color depth: `index.json`'s `colorDepth`: truecolor from the paints' opaque forms; 256 colors as
  the nearest of xterm's indices 16 to 255 in OKLab; sixteen as the new `ansi-*` tokens, which
  sokkel-ui's `TerminalView` now reads too; no color carried by words and glyphs.
- `glyphs.json`: each glyph a part draws in cells (sort arrows, chevrons, the spinner's frames, the
  status dot, the missing dash, check boxes, box corners and sides) with Unicode and ASCII forms, and
  the icons with their Nerd Font codepoints.
- Principles: 17 says what Mod is in a terminal, no Alt chords and no `[` or `]` as a part's primary
  key; new 21 (in cells, a row is a line), 22 (color at the terminal's depth, meaning without it)
  and 23 (a tip a renderer cannot float is said in the status line).
- open-questions: five calls for the terminal, each with a recommendation (T1 the sixteen-color
  paints, T2 the scrim in cells, T3 an edge on a one-row control, T4 keyboard focus in cells, T5 one
  name for the egui renderer).
- Site: the parts index shows each renderer's state; a part's page shows its renderers, surfaces,
  cells and the paints' opaque forms; a Cells page shows the grid, color depths, text roles and
  glyphs.
- The pin moves to sokkel-ui with the `ansi-*` tokens.
- call-bar, letter, detail-pane, board-item-panel: four new parts, specified as they landed in
  sokkel-ui 97f92d8 (`CallBar`, floating or docked, its device lists, reactions, more, Leave, the
  room it measures and Mod+D and Mod+E; `Letter`, a letter in a thread folding over its body;
  `DetailPane`, one thing's sections, facts and verbs in a side panel; `BoardItemPanel` with
  `BoardChecklist`, a work item and its checklist, `CheckboxField`'s `quiet` drawing its done
  steps): words with samples, options, sizes, paints and keys. Stable from the start, sokkel-egui
  and sokkel-tui missing; fifteen specimens for their stories.
- table: `searchBy` and `searchField`, a search of the table's own; a press on a stacked card's lead
  opens the row unless it lands on a control; a card whose primary value may take more lines is as
  tall as its values; stacked cards drawn only in view; the pager's select, the row menus and the
  own search load on first use (sokkel-ui). Specimens for Stacked cards and Bands.
- rail: a body's `places`, `behind` (the default) or `above`, the places over the body with no row
  back. A specimen for Places above.
- command-palette: sokkel-ui draws its own list (`ui/cmdk`, taken from cmdk 1.1.1 without its
  dialog); the keys, matching and rows the spec states hold unchanged.
- T3 and T4, decided by the owner: a one-row control's edge is `edge-start` and `edge-end` (`▏`
  and `▕`, `[` and `]` in ASCII) at its ends in the edge's flat color, inside its padding; keyboard
  focus on one is `focus-ring-start` and `focus-ring-end` (`┃`, `>` and `<` in ASCII) in `ring`
  beside each end, in the gap between controls, reverse video without color, and on a table's or a
  list's row `focus-mark` in `ring` at its start. In principle 21, `index.json`'s cell rules,
  `glyphs.json` and the cells of button, text-field, select and table.
- T5: the egui renderer is `sokkel-egui` everywhere: `sources`, `rendererSpecific` and `drift` and
  the schema take the name `renderers` has, and `index.json` notes no second name.
- Opaque paints over other surfaces: a part names the surfaces it may also stand on
  (`alsoStandsOn`), and each paint carries `flatOn` and `fadedOn` for each of them; `check.py`
  holds them opaque and verify-colors draws them. The button names card, popover,
  section-head-ground and sidebar; the call bar's controls the background they stand on docked.
- The resolver writes every combination a spec paints, listed in `states` or not: the page state's
  warning frame and mark (`failed+warning`), and eight more in the dropdown menu, rail, run timeline
  and table.
- `glyphs.json`: `rule-heavy` (`━`, `=`), a critical section's top line; `grid-dot` (`·`, `.`), the
  graph tone's dot grid; and the edge and focus glyphs above.
- cells for dialog, dropdown-menu, select, command-palette and settings-dialog, from sokkel-tui's
  proposal (c3); what lies under an overlay waits on T2.
- Renderers: sokkel-tui as of 7bf2ece (page-state, top-bar, status-line, settings-dialog and
  tooltip built; button, text-field, page-header, section, table, rail, dialog, dropdown-menu,
  select, command-palette and the shell partial, each saying what is left; the rest missing);
  sokkel-egui as of 9038006, its drift for table, section, page-header, rail, top-bar,
  status-line and the shell brought up to what it has built; sokkel-ui as of 97f92d8.
- open-questions: a scope section for what sokkel-ui changed today that no part covers (maps,
  graphs, charts, the checkbox field, the time range picker, the code editor, the tree, markdown,
  the track list), and findings from the new parts (the call bar's off ink under the pointer, the
  checklist's count, a disabled checkbox row's opacity, a missing fact's hyphen).
- The pin moves to sokkel-ui 97f92d8 (tokens unchanged).
- call-bar: a control that is off keeps `critical-ink` under the pointer (`off+hover`).
- board-item-panel: the checklist's heading is the word `checklist.title`, `Checklist {done}/{total}`,
  sampled; a read-only step fades once at `disabled-opacity`, its box with it.
- detail-pane: a missing fact is the dash, `—`, as principle 10 says.
- CI: every workflow reads only at the top and writes only in the job that deploys; actions are
  pinned by commit; the contract job, which runs the pinned sokkel-ui's install and scripts, holds a
  read-only token, keeps no credentials and restores no cache.
- site: tags are stripped from a table's labels and a heading's anchor until none is left.

## 0.29.3

- run-timeline, clip-timeline, emoji-picker, reaction-bar: four new parts, specified as they landed
  in sokkel-ui (`RunTimeline`; `ClipTimeline` with its drop target, its readable fit in a narrow
  room and its pinned ruler, headers and corner; `EmojiPicker` and `EmojiPickerPopover`;
  `ReactionBar`, `ReactionPopover` and `ReactionChips`): words with samples, options, sizes, paints,
  keys, and how they drag, snap, scroll and load. Stable from the start, egui's not-built drift on
  each; nineteen specimens for their stories.
- The pin moves to sokkel-ui 93fd42f (tokens unchanged); the resolved paints add the new parts'.
- schema: a text role may hold digits (`text.2xs`), as the plain sizes became roles in 0.29.0.
- README: a part that lands in sokkel-ui is specified in the same round and is stable from the start.
- verify-colors: a partly transparent paint's channels are compared within what a canvas reads back
  through premultiplied bytes (255 / alpha), so `kind-green/25` and `kind-teal/25` in dark no longer
  fail on the readback's rounding.
- composer, message-composer: two new parts, specified as they landed in sokkel-ui: both boxes
  round by the new `radius-composer` token (twice the control radius) and their send, attach and
  add buttons are round; `Composer` takes `layout` (`stacked`, or `inline`: a
  pill that opens into the box once the text needs a line of its own or files, dictation or a
  failure show, its corners easing over `motion-base`). Words, options, sizes, paints, keys (Enter
  sends, Shift+Enter breaks the line, and on a touch screen Enter breaks the line and only Send
  sends; the suggestions' keys) and the inline switch. Nine specimens.
- emoji-picker: the group tabs stop at the first and the last under the arrow keys.
- reaction-bar: the arrow keys stop at the bar's first and last button; a reaction and the more
  button with keyboard focus wear the focus outline in `ring`, drawn inside the circle, so a given
  reaction shows it beside its pressed ring.
- The pin moves to sokkel-ui 6220600, with `radius-composer`.

## 0.29.2

- tokens: `typeface-emoji`, the color emoji faces in order, and `text-emoji`, the size an emoji is drawn
  at in a picker or a reaction (1.5rem on a line as tall), a text role in `tokens.resolved.json`.

## 0.29.0

- tokens: the switch's sizes (`spacing-switch-width`, `-height` and their `-sm` pair) are tokens; eight
  colors no part used are gone (`brand-foreground`, `critical-wash`, `panel-line`, `binding-ink` and
  the four `terminal-node` and `terminal-graph` inks). No spec named them.
- tokens: every text size is a text role in `tokens.resolved.json`, the plain sizes (`2xs` to
  `display`, and `graph-title` and `graph-small`, the graph node's title and small lines) at weight
  400 where the token names none; the roles that were there are unchanged.

## 0.28.2

- Inks named where a part always stands on one surface, so a renderer without inheritance reads a
  color: select's field trigger and text-field's label `foreground`; select's rows, dropdown-menu's
  items, check items and submenu triggers, and settings-dialog's phone list entries
  `popover-foreground`; page-state's failed heading `foreground`. `inherit` stays only where a part
  follows its surroundings (outline and ghost buttons, the quiet select, status-line's live dot),
  each saying so in its note, and the README says what it resolves to.
- table: a stacked card's edit field, and its open editor, stand at least a finger tall below 768,
  and the line that holds them a finger and 4 (`layout.cardEditLine`, 36 from md); the cards are
  placed at the height the line is drawn at.

## 0.28.1

- top-bar: below 768 the menu button and the palette's button draw their focus outline its offset
  inside the square (`phone+focus`, ring `inset` all), so the window's top edge does not cut it.
- tooltip: `tap`, a tap by touch or pen on the trigger shows the box, held `tip-hold` (4000 ms, a
  new duration token) or until the next press anywhere or a second tap on the trigger
  (`layout.tapHold`); a mouse press, hover and focus are as before.
- button: a `reason` shows on a tap by touch or pen too, as a touch screen has no hover; an icon
  button's as well.
- command-palette: the app's search shows its wait only once it has run `wait-shown` (300 ms, a new
  duration token, `layout.searchingAfter`): then Searching where nothing is listed, or the earlier
  results dimmed and passed over (the new `searching` state). A sooner answer draws neither, the
  earlier results only out of reach, and the empty line stands through it; `debounce` 0 asks each
  change at once.

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
`motion-base` (200 ms) and `motion-ease` (ease-out), `busy-release` (5000 ms, how long a busy
palette or dialog holds before it offers Stop waiting), `layer-drawer`, `layer-dialog`,
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
  ring `invalid-ring` and `invalid-ring-width`; `phoneBelow` `breakpoint-md`; a `reason` is also the
  button's description, from a visually hidden copy always in the page. Stable.
- command-palette: a disabled row at `disabled-opacity`; samples for `searchFailed` and `seeAll`;
  the box's `border-strong` edge on `elevation-dialog`; the active row on `accent`, its icon, hint,
  code, meta and kind in `accent-foreground` (F20); a meta `muted-foreground` on a two-line row too,
  a tone kept (F24, state `twoLine`); the arrows stop at the ends and Home and End reach them
  (F21); cmdk's Ctrl keys gone and Mod+K closing the open palette, in a Shell or not (F22); a
  running command holding it open against Escape, a press outside, its Close and Mod+K until it has
  run `busy-release` (`layout.busyRelease`, option `busyRelease`), when a Stop waiting row
  (`stopWaiting`, state `released`), Escape and the Close let it go and its answer goes unheard,
  the command's signal aborted so it can stop and the app say how it ended (F23); its width from 768 (`widthFrom` `breakpoint-md`). Stable.
- dialog: a shut confirm at `disabled-opacity`; it opens over `motion-fast` on `layer-dialog`; one
  line at 768 (`phoneBelow` `breakpoint-md`): below it a sheet, with no edge or shadow, and a fit
  dialog a box at its width (F17); no blur under the backdrop, its `rendererSpecific` entry gone
  (F18); the box's `border-strong` edge on `elevation-dialog` (F19); a busy confirm releases the
  dialog after `busy-release` (`layout.busyRelease`, option `busyRelease`, state `released`):
  Escape closes and Cancel says Stop waiting (`stopWaiting`), the confirm busy until the work
  settles, and letting it go calls the confirm's `onStopWaiting` (F23). Stable.
- dropdown-menu: disabled rows at `disabled-opacity`; it opens over `motion-fast` on
  `layer-popover`; rows `density.control` tall, a finger below 768 (F11); every popup's look, a
  `border-strong` edge on `elevation-pop`, the submenu's too (F16); the arrows stop at the ends
  (F21). Stable.
- page-header: the title in `page-title-ink`; the back button's focus by the focus ring tokens.
  Stable.
- page-state: stable.
- rail: the home, collapse and strip entries' focus by the focus ring tokens; the width eases over
  `motion-base`; a collapsed entry's tooltip is the library's one, inverted, 12 by 6 (F14). Stable.
- section: the heads in `section-head-ink`. Draft.
- select: disabled at `disabled-opacity`; the invalid ring by its tokens; the list opens over
  `motion-fast` on `layer-popover`; the list pads every row 4, a group none of its own (F10); rows
  `density.control` tall (F11); 8 between a lead and its label in the trigger too (F12); `swatch` a
  general option of the field, the theme picker's part (F13); every popup's look (F16). Stable.
- settings-dialog: an entry's focus by `focus-ring-width`; samples for `resetSection` and
  `resetSectionDetail`; a sheet and a list of sections below 768 (`phoneBelow` `breakpoint-md`,
  F17); no blur (F18); the box's `border-strong` edge on `elevation-dialog` (F19). Stable.
- status-line: stable.
- table: a card's keyboard focus by `focus-ring-width`; samples for its counted and interpolated
  words. Stable.
- text-field: disabled at `disabled-opacity`; the invalid ring by its tokens; the issue mark's focus
  by `focus-ring-width`; `phoneBelow` `breakpoint-md`; samples for `errors` and `warnings`; the
  issue popover in every popup's look, a `border-strong` edge on `elevation-pop` (F16). Draft.
- tooltip: on `layer-popover`; the library's one tooltip, the rail's and the switch field's moved
  to it (F14); it waits 500 ms under the pointer, the primitive's own default with or without a
  provider, and shows at once on keyboard focus (F15). Stable.
- top-bar: `phoneBelow` `breakpoint-md`. Stable.
- shell: the panel toggle's focus by the focus ring tokens; the content's bar `scrollbar-width` on a
  solid track; its breakpoints by `breakpoint-md` and `breakpoint-lg`; the drawer slides over
  `motion-base`; the gate an egui app passes before it follows the shell; below 768 dialogs are
  sheets and a ConfirmDialog a box (F17); Mod+K's second press held while a command runs (F23).
  Stable.
