# Tree select

A field that picks from a hierarchy: a trigger that reads like a select and names the choice with
its path, and a popup under it with a search over a tree. A single choice closes the popup; multiple
choice ticks checkboxes and keeps it open, the trigger listing the choices by name with their count
at its end. The tree opens on the branches that lead to a choice. For a large hierarchy a level loads
when first opened, and a search goes through the whole of it. As a field it sits in
[parts/text-field](text-field.md)'s frame; the popup wears [parts/select](select.md)'s list look.
The structured spec is [`tree-select.json`](tree-select.json).

Sources: sokkel-ui `packages/core/src/components/TreeSelect.tsx` (`TreeSelect`, `TreeSelectProps`,
`TreeSelectWords`, `TREE_SELECT_WORDS`), `Tree.tsx` (the rows, their keys, loading and search),
`ui/popover.tsx`, `ui/input.tsx`, `ui/checkbox-look.tsx`, `Highlight.tsx`, `lib/issue-edge.ts` and
`lib/popup.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| trigger | `density.control` tall, padded 10, `radius-control`, on `field` with an `input` edge: the value, the count, the chevrons, 8 apart |
| value | The placeholder; one label with its path (` / `, `text.help`, quiet), 6 apart; or several labels joined by a comma |
| count | With more than one choice: the number in `text.help`, named `words.selected` |
| popup | Under the trigger, 4 away, at its start; as wide as it and at least 288; the popup's look |
| searchBar | Padded 10, a `border` rule under it: the magnifier, the search input (36 tall), the clear button |
| clear | While something is chosen and not `optional`: an x and `words.clear`, `text.help`, quiet |
| list | Padded 4, at most 320 tall: the Clear row (with `optional` and no search), then the tree |
| row | 32 tall, `radius-md`, indented 16 a level from 4: toggle, icon, checkbox, label, reason, meta, 6 apart |
| toggle | 20 square: `chevron-right` closed, turned down open; empty for a leaf |
| checkbox | Multiple choice: 16, ticked when chosen, a dash when a branch holds choices |
| match | The matched part of a label on `primary/15` in `primary-ink` |
| reason / meta / trailPath | Small and quiet: why a row is shut, a count or code, a search result's path |
| loadingRow / failedRow | Under a branch: a spinner and `words.loading`, or `words.failed` in `critical` with a retry |
| note | `words.searching`, `words.searchFailed` with a retry, or `words.empty` centered |

## Options

`nodes`; `value` with `onValueChange`; `multiple`; `defaultExpanded`; `open` with `onOpenChange`, or
`defaultOpen`; `defaultQuery`; `loadChildren`; `search`; `trails`; `unavailable`; `optional`;
`invalid`; `id`; `words`.

## States and tokens

| State | Paint |
|---|---|
| rest | trigger on `field`, `input` edge, the page's ink |
| placeholder | the value in `muted-foreground` |
| focus (keyboard) | `ring` edge and a 1px `ring` ring |
| invalid | `critical/80` edge; with keyboard focus `critical` and the invalid ring |
| hover | a row on `hover`; a toggle, the clear button in `foreground`; retry underlined |
| rowFocus (keyboard) | a `focus-ring-width` ring in `ring` inside the row |
| chosen (single) | `primary/12` in `primary-ink`, medium; `primary/18` under the pointer |
| checked / mixed | the checkbox on `primary` in `primary-foreground` |
| shut | the row in `muted-foreground`, its checkbox at `disabled-opacity` |
| loading / searching / failed / empty | the status rows and the note: quiet, failures in `critical` |

## Keyboard

- Tab reaches the trigger; in the popup, the search, the clear button, the Clear row and the tree's one stop.
- Enter or Space on the trigger opens the popup, the search focused.
- In the tree: ArrowDown and ArrowUp move a row, Home and End to the ends, ArrowRight opens a branch
  or enters it, ArrowLeft closes it or climbs to the parent, Enter or Space chooses.
- Escape closes the popup, focus back on the trigger after a keyboard close.

## Words

`placeholder` Choose, `search` Search, `clear` Clear, `empty` Nothing matches., `selected` {count}
chosen, `actions` Actions, `loading` Loading, `failed` This level did not load., `retry` Try again,
`searching` Searching, `searchFailed` The search did not answer. Each has its own `treeSelect.*`
id. `actions` is Tree's row-menu word, never said here, since a tree select gives its rows no menu.

## Cells

The trigger is one row with its edge as `edge-start` and `edge-end` and keyboard focus as
`focus-ring-start` and `focus-ring-end` beside it. In the popup, a box in `border-strong`: the
search bar a row with a rule row under it, then one row per node, indented 2 columns a level, the
toggle 2 columns (`chevron-right`, `chevron-down`), the checkbox (`checkbox-off`, `checkbox-on`,
`checkbox-mixed`) in multiple choice, and `focus-mark` at the start of the focused row.

## Where sokkel-egui differs today

As of d163191, `TreeSelect` was built before this spec and has not been compared with it, and holds
one choice only. Read from its source: the trigger with the label and its path, a popup with a
search, a clear button and a `Tree`; choosing closes it. Not there: multiple choice with checkboxes,
the count and the dash; `loadChildren`, `search` and `trails`; `unavailable`; `optional`;
`defaultQuery` and `open` held from outside; and the words beyond `placeholder`, `search` and `clear`.

sokkel-tui has no tree select yet (64f4b19).
