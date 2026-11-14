# Command palette

One search over everything an app can do, over the page on Mod+K, which closes it again. A dialog
box a third of the way down the window: the search at its top, the commands in groups under their
titles, the app's own search results under them, and an optional strip at its foot. Each row has
its icon, its label, a quiet hint or code after it, and at its end a summary, its kind or the keys
that run it; the active row wears the highlight every list of choices does. Choosing a row runs it
and closes the palette. **A command whose `onSelect` answers a promise holds the palette open and
its row busy until it settles**: fulfilled, the palette closes; rejected, it stays open and says
why under the rows, so a choice the app refuses is said where it was made. Once it has run
`busy-release` (5 seconds), a Stop waiting row appears, and it or Escape lets the palette go. The box is
[`parts/dialog`](dialog.md)'s. The structured spec is [`command-palette.json`](command-palette.json).

Sources: sokkel-ui `packages/core/src/components/CommandPalette.tsx` (`CommandPalette`,
`PaletteCommand` with `meta`, `metaTone`, `tone`, `disabled`, `onSelect`, `PaletteGroup`,
`PaletteSearch`, `PaletteFoot`, `PaletteWidth`, `PaletteFilter`, `COMMAND_PALETTE_WORDS`,
`PALETTE_SEARCH_WORDS`), `ui/command.tsx` (cmdk's `Command`, `CommandDialog`, `CommandInput`,
`CommandList`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator`), `ui/dialog.tsx`,
`ui/input-group.tsx`, `Search.tsx` (`SearchResultBody`, a two-line row), `ProseText.tsx`
(`ProblemLine`, the refusal), `ui/kbd.tsx`, `ui/spinner.tsx`, `lib/commands.ts` (`runCommand`,
`filterCommands`, `termScore`) and `hooks/use-palette-shortcut.ts`. sokkel-ui-egui:
`crates/core/src/widgets/menu.rs` (`CommandPalette`, `CommandGroup`, `PaletteOutcome`,
`PaletteWords`, `palette_shortcut`) and `commands.rs` (`place_commands`, `appearance_commands`).

## Anatomy

| Piece | What it is |
|---|---|
| box | parts/dialog's box, a third of the way down and centered across, a `border-strong` edge on `elevation-dialog`: 384 wide from 768, padded by `palette-inset`, no close of its own |
| description | A line over the search saying what is chosen, for a chooser |
| search | The query on the input's tint, a search icon at half strength at its start; focus starts here |
| list | The groups and the search's results, scrolling past 384 or 60 percent of the window, fading at its foot |
| group title | Small and muted, its start level with the rows' icons |
| separator | A rule between groups, across the whole box |
| row | Icon, label (in the code face with `mono`), hint or code after it; at its end a summary, its kind and keys, or a spinner while it runs. The active row on the `accent`, its icon, label and quiet words in `accent-foreground` |
| hint, code | A quiet fact in words, or an addressable code in the code face; a disabled command's reason in the hint's place |
| meta | A quiet summary at the row's end in the code face with tabular figures: `muted-foreground` on a one-line row and a two-line row alike, `accent-foreground` on the active row; in a status ink with `metaTone`, which stays; under the label below 640 |
| kind, keys | What the row is, faint; the keys that run it as key caps, a sequence's two presses with "then" between |
| two-line row | With a `detail` or `artwork`: drawn as a search result, a picture or a tile at its start |
| spinner | While a command's promise is pending: at its row's end in the keys' place, named "Running" |
| stop waiting | Once a running command has run `busy-release`: "Stop waiting", a row at the list's top, which closes the palette and lets the command go |
| refusal | Under the list across the box: why the last command was refused, the rejection's words or "The command did not run." |
| empty | "No command matches.", centered |
| results | The app's search results under the commands, by kind; Searching, a failure with Retry, and a row to see all |
| foot | Optional: the app's mark and name, the active row's verb beside Enter, "Command palette" beside the keys that open it |
| close | On a touch screen: Close at the foot, as there is no Escape |

## A command that answers later

`onSelect` may run at once or answer a promise. Nothing back (or a value): the palette closes. A
promise: the palette holds open and the chosen row is busy, a spinner named "Running" in its keys'
place. At first nothing closes the palette, neither Escape, a press outside, its Close nor Mod+K,
and another choice is ignored. **After a wait** of `busy-release` (5000 ms; `busyRelease` sets the
palette's own), a way out appears: a "Stop waiting" row at the list's top, and Escape and the Close
close the palette again (a press outside and Mod+K still do nothing). Closing lets the command go:
the palette stops nothing itself, and a later fulfilment or refusal is not heard, so no refusal is
said once the palette has closed. The command is handed a signal (`PaletteRun.signal` in
sokkel-ui) that the palette aborts when it lets the command go before it settles, by Stop waiting,
a released Escape or Close, or by closing or going away, and never once the command has settled: a
command that can stop its work listens there, and the app says how the work ended elsewhere (a
toast), since the palette has closed. Fulfilled, the palette closes. Rejected, or
if `onSelect` throws, it stays open and says why under the rows in the critical ink: the rejection's
own words, else "The command did not run.". Typing, or choosing again, clears it. A command that
settles after the palette closed or opened again is let go.

## Options

- `groups` (`{ title, commands, rank?, verb?, kind? }`, listed by `rank`, one group to a title) and
  each command (`{ id, label, icon?, hint?, code?, meta?, metaTone?, mono?, keys?, next?, keywords?,
  detail?, tone?, artwork?, round?, disabled?, verb?, kind?, onSelect }`).
- `metaTone` and `tone`: `critical`, `warning`, `good` or `info`, a status ink for the meta, and for
  the hint or a two-line row's second line.
- `disabled`: `true`, or why; the row at half opacity, passed over, never run.
- `search` (the app's own: `{ search, onOpen, onSeeAll?, minQuery?, debounce?, words? }`),
  `defaultQuery`, `filter` (`fuzzy` by default, `terms`, or the app's score), `foot`, `width` from
  768 (`sm` 384 by default, `md` 512, `lg` 672), `description`, `wrap`, `busyRelease` (ms a
  running command holds the palette; `busy-release`, 5000, by default).

## Sizes

| | Value |
|---|---|
| box | 384 (`md` 512, `lg` 672) from 768, padded `palette-inset` (4; 8 in indigo), `radius-surface` |
| search | `density.control` tall, a finger tall below 768, 4 in from the box's pad at its top and sides; icon 16; `radius-control`; `text.body` |
| group | 4 all round; its title padded `palette-row-inset-x` across and 6 down: 32 tall, `text.badge` |
| row | `palette-row-inset-x` across and `palette-row-inset-y` down: 34 tall (38 in indigo), a finger tall below 768; 8 between its pieces; icon 16; `radius-lg`; `text.body` |
| hint, code, meta | `text.help`; the label, hint and code 8 apart; the meta 12 after the label |
| keys | 6 between key caps (20 tall); the kind 8 before them |
| refusal | 8 down, 6 between its mark (16) and its words, `text.body`, its words inset as the rows' are |
| empty | 24 over and under, `text.body` |
| foot | 12 across, 6 down, 12 between its pieces, `text.help` |
| list | at most 384 or 60 percent of the window; 6 under the last group |

## States and tokens

| State | Paint |
|---|---|
| rest | box: parts/dialog's (`popover`, a 1px `border-strong` edge, `elevation-dialog` under it). search: `input/30` ground and edge, `radius-control`; its icon `muted-foreground` at 0.5. group title: `muted-foreground`. separator: `border`. row: `foreground` (the group's ink), `radius-lg`. icon, hint, code, meta: `muted-foreground`. kind: `faint`. keys: on `muted`, `muted-foreground`, `radius-sm`, `text.badge`. empty: the box's ink, `popover-foreground`. foot: `muted-foreground` under a `border` rule |
| active | row: `accent` ground, `accent-foreground` ink, as every list of choices; its icon, hint, code, meta and kind `accent-foreground` too, unless a tone sets them |
| twoLine | the meta, hint or code at the row's end `muted-foreground`, as on one line |
| disabled | row at 0.5 |
| busy | the spinner in `muted-foreground` (`accent-foreground` on the active row); nothing closes the palette |
| released | after `busy-release`: the Stop waiting row at the list's top; it, Escape and the Close let the palette go |
| refused | the refusal in `critical-ink` with a circled alert, under a `border` rule |
| critical, warning, good, info | the meta (`metaTone`) or the hint (`tone`) in `critical-ink`, `warning-ink`, `good-ink` or `info-ink` |
| phone | the search and rows a finger tall below 768; a meta under its label below 640 |
| touch | Close at the foot |

## Keyboard

- Mod+K opens the palette, from a field too (Ctrl+K as well on a Mac), and a second press closes it,
  in a `Shell` or not, `usePaletteShortcut` included; not while a command runs.
- Typing narrows the commands. ArrowDown and ArrowUp move the active row past disabled rows and stop
  at the first and the last, as every list of choices does; Home and End go to them. cmdk's own
  Ctrl+N, Ctrl+J, Ctrl+P and Ctrl+K are off, so Ctrl+K means one thing.
- Enter runs the active command (on Stop waiting, closes the palette and lets the command go).
  Escape closes the palette, focus back where it was, unless a command is running and has not yet
  run `busy-release`.

## Words

`COMMAND_PALETTE_WORDS`: `placeholder` "Search or run a command", `empty` "No command matches.",
`title` "Command palette" (the dialog's name to a screen reader), `close` "Close", `open` "Open"
(the foot's verb when neither the row nor its group names one), `palette` "Command palette",
`sequence` "then", `running` "Running", `refused` "The command did not run.", `stopWaiting` "Stop
waiting".
`PALETTE_SEARCH_WORDS` (the app's search): `searching` "Searching", `failed` "The search did not
answer." (`searchFailed` in the spec), `retry` "Retry", `seeAll` "See all results for “{query}”".
The app gives every group's and command's words, and a rejection's own words.

## Renderer-specific

- **sokkel-ui:** cmdk's `Command` inside the library's dialog; the dialog's title and description
  are read to a screen reader only. `fuzzy` is cmdk's own matching; `terms` and an app's function
  score the commands themselves. In a `Shell` the palette takes the app's groups and each screen's
  (`useCommands`), ranked. The active row is cmdk's value, so the foot can say its verb. cmdk's
  own keys are off (`vimBindings`). The open palette binds Mod+K itself, before the shell's own,
  and closes through the hold a running command keeps. `pointer-coarse` decides the touch screen's
  Close, `max-md` the finger heights and the width, `max-sm` the meta's fold. The list fades at its
  foot.
- **sokkel-ui-egui:** `CommandPalette::new(id, groups, &mut query, &mut highlight).show(ctx)`
  returns `PaletteOutcome { run, close }`, and the app runs the command it names. `palette_shortcut`
  is Mod+K. Rows are the dropdown menu's `MenuItem::Action` in the palette's look.
  `place_commands` and `appearance_commands` build groups from the rail and the look.

## Where sokkel-ui-egui differs today

As of 26b411f (`menu.rs` unchanged since 5dd7c34), `CommandPalette` draws the box 384 wide a third
of the way down over a `shade/10` backdrop, padded by `palette-inset`, the search a control tall on
`input/30`, group titles 32 tall at `text.badge`, rows 34 tall with an icon and keys or a hint, the
active row on `muted`, rules between groups, and the placeholder and empty words, with ArrowDown,
ArrowUp, Enter and Escape. Its 384 and 34 match sokkel-ui's. The differences:
1. **Ends:** the arrows wrap around; the spec stops at the first and the last row.
2. **Rows:** `radius-md`, `popover-foreground` ink, the active row on `muted` with its icon left
   muted; the spec has `radius-lg`, the group's `foreground`, and the active row on `accent` with
   its ink and icon `accent-foreground`.
3. **Search icon:** `popover-foreground` at half strength; the spec has `muted-foreground`.
4. **Empty:** in `muted-foreground`; the spec has the box's ink, `popover-foreground`.
5. **Edge and shadow:** the menu's popover frame (a `foreground/10` stroke inside, a shadow 0 4 blur
   12); the spec has parts/dialog's `border-strong` edge and `elevation-dialog`.
6. **List:** at most 384 and at least 384 once it scrolls, 4 under the last group; the spec has 384
   or 60 percent of the window and 6.
7. **Matching:** a label or keyword holding the query; the spec has fuzzy, terms, or the app's score.
8. **Not built:** a command's promise (busy and held open, refused, "Running" and "The command did
   not run."), `meta` and `metaTone`, hint tones, `code`, `mono`, sequences, `kind`, verbs and the
   foot, two-line rows, disabled commands, the app's search, `width`, `description`, `wrap`, ranks,
   the touch screen's Close, finger rows below 768, Home, End, Mod+K closing the open palette, and
   the words `title` and `close`.
