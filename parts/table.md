# Table

The one table. It draws every listing and table, five rows or fifty thousand, flat, grouped or a
tree. Rows sit at the density's row height, and only those in view are drawn. Heads sort and
resize. Rows select with a bar, or one row is picked for a detail beside the list. When the table's
**own box** is narrow, its rows stack as cards. The structured spec is [`table.json`](table.json).

Sources: sokkel-ui `packages/core/src/components/DataTable.tsx` (`DataTableProps`, `DataColumn`,
`DataTableWords`/`WORDS`, `onKeyDown`, `stacksAt`), `lib/table.ts` (`TABLE_HEAD_ROW`,
`TABLE_HEAD_TEXT`), `PageState.tsx` (the failed read). sokkel-ui-egui has no table yet. It is step 3
of the order, the list variant first.

## Anatomy

**frame**, then the **bar** (search, tools, count, sort menu in the grid view, Table/Grid switch,
columns menu), which becomes the **selection bar** while rows are selected. Under it the **head**
row, which stays put while the rows scroll. Then the **rows**: a select box, the cells (the first
stays put while rows scroll sideways) and a menu button at the end. **Group heads**, a row's
**detail**, **placeholder** rows, the **empty** line or the **failure**, and the **foot** (count,
pager, Load more). Stacked, each row is a **card**: leads, the title, a labeled line per column, and
the secondary facts on its last line.

## Options

The full list is in the JSON. These shape the look:
- `variant`: `table` or `list`. A list has no bar unless it has a search or tools, a gap between
  columns, a head row at `density.panel-head`, and it stacks as soon as its columns no longer fit.
- `selectable`, or `onOpen` with `opened` (one row picked for a detail beside the list), `chevron`
  (the row leads to its own page).
- `sort`, `groupBy`, `childRows` (a tree), `detail`, `rowActions` with `actionButton`, `rowTone`.
- `search`, `toolbar`, `paging`, `loading`, `loadMore`, `card` (the grid view).
- `stackBelow` (576 px **of its own box**, never the window), `minWidth` (768 for a table, `auto`
  for a list, which never scrolls sideways), `stackLayout` (`labeled` or `compact`).
- `rowHeight`, `resizable`, `reorderable`, `onReorder`, `framed`, `bar`, `columnHeads`, `hover`,
  `empty`.
- Made explicit: `error`, the failed read (today `PageState` around the table), and `inSection`
  (today `Section` around a `framed={false}` table, the section head as tall as the table head).
- Columns: `width` (a grid track, or `content`: as wide as its widest cell up to `maxWidth`, 320 by
  default), `align`, `sortValue`, `hideable`, `resizable`, `stack` (`lead`, `line`, `primary`,
  `secondary`, `none`), `band`, `aggregate`, `fill`, `edit`.

## Sizes per density

| | Regular | Compact |
|---|---|---|
| Row and head row (`density.row`) | 40 | 34 |
| List head row (`density.panel-head`) | 36 | 32 |
| Cell padding x | 12 | 12 |
| List row padding x (`density.panel-pad`), column gap | 12, 12 | 8, 12 |

Fixed at both: select column 40, sort arrow 14, a resized column at least 64, row grip 22. Cards
pad 12 x and 8 y, with a title line 24 and lines 20 (primary 22, facts 24). A stacked line's name
is at most 192. A placeholder bar is 12 tall at 60 percent of its cell. Text is `text.body` in rows
and `text.head` in the head.

## States and tokens

| State | Piece: paint |
|---|---|
| rest | frame: ground `card`, edge `border-strong`, `radius-surface`. head: ground `table-head-ground`, rule `table-head-line`, ink `table-head-ink`, `text.head` (size `table-head-size`, weight `table-head-weight`, tracking `table-head-tracking`, case `table-head-transform`). row: ground `card`, every other line `table-zebra`, rule `border` |
| hover | row ground `hover`; a sortable head's ink `foreground`; a card's ground `hover` |
| sorted | the head's ink `foreground`, an arrow up or down (14) after its name |
| selected | row ground `secondary`, kept under the pointer; card ring 2 `primary`; the bar says `{count} selected` |
| opened | row ground `secondary`; card ring 2 `ring/60` |
| active (with keyboard focus) | row: a 2px `ring` bar inside its start edge; card: ring 2 `ring` |
| stacked | cards: ground `card`, edge `border`, `radius-surface`; a card's detail on `panel-ground` |
| empty | `words.empty` ("Nothing here.") in `muted-foreground`, under the heads; an app's own `empty` stands alone without them unless a search or tools may have emptied it |
| loading | placeholder rows under the heads: a `muted` bar per cell at row height, filling the view (three after the last row when loading more); they pulse unless motion is reduced |
| failed | in the table's place: ground `card`, edge `border-strong`, a `destructive` mark, the heading by what the server answered (`refused`, `missing`, `unreachable`), the diagnostic in `text.help`, and Try again. Secondary data: `warning/8`, `warning/35`, `warning-ink`, `partRefused` |
| tone critical / warning | row ground `mix-oklab(critical 8%, card)` / `mix-oklab(warning 10%, card)`, opaque so a pinned cell keeps it |
| muted | the cells' content at 0.6 |

A missing value in a cell is a quiet dash, never a blank (principle 10).

## Keyboard

The table is **one tab stop**. The head buttons and row boxes are not separate stops.
- Up and Down move the active row (a line of cards in the grid view). PageUp and PageDown move a
  view's worth. Home and End go to the first and the last row.
- Space selects the active row (Shift for a range), or picks it when the table does not select.
  Enter picks it: `onOpen`, or it opens and closes its detail.
- Right opens a branch or a detail (the next card in the grid view). Left closes it or goes to the
  parent (the previous card).
- Alt with Up or Down moves the active row a place, with `onReorder` while the rows are drawn as
  given.
- A press with Shift selects a range; with Cmd or Ctrl it selects or clears one row.
- On a resize handle, Left and Right move the edge, and Enter or a double click puts the width back.
- With `editing`: Enter, F2 or a typed character opens the cell. Enter saves and moves down, Tab
  saves and moves on, Escape drops the edit.
- Sorting from the keyboard: the table view has none today. The head's sort buttons are not tab
  stops, and the sort menu is in the grid view only.

## Words

Every default from `WORDS` in `DataTable.tsx`, written as templates (`{count} rows`, `Resize
{column}`, `{from}–{to} of {total}`), plus `PageState`'s words for the failed and loading reads
(`Loading`, `The server refused this read`, `Nothing is there`, `The server is not answering`, `Part
of this page could not be read`, `Try again`). The empty line is "Nothing here." The app gives every
column's `header` (used in its head, the columns menu, a stacked line and the resize handle's name)
and each row's `expandLabel`.

## Renderer-specific

- **sokkel-ui:** a CSS grid per row, with a sticky head and first column. Content columns are
  measured in the DOM, and again once fonts load. The checkbox and menus load after first paint.
  Counts are formatted for `en-US` until the locale lands.
- **sokkel-ui-egui:** colors from `paints` (`table.base.<state>.<piece>`), the row tones among them,
  so the widget mixes nothing. `ScrollArea::show_rows` at `density.row`. Content columns are measured from
  laid-out galleys. The table's box is the width egui gives it, which is exactly what `stackBelow`
  asks for, so no container query is needed. One focus stop, with the active row kept in the
  widget's state.

## Where the renderers differ from the spec today

- **sokkel-ui-egui:** the whole part is to be built.
- **sokkel-ui, failed:** not a table state. `PageState` wraps the table, or stands unframed in the
  table's `empty` slot (`Patterns/States/In a table`), so a listing's failure, its retry and its
  words live one level up. Should the table take `error` and `onRetry`? (open
  questions)
- **sokkel-ui, loading:** two looks. The table draws skeleton rows, and `PageState` draws a spinner
  line. The roadmap's "one loading part" applies.
- **sokkel-ui, counts:** formatted with `en-US` in `WORDS`.
