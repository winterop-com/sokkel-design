# Unfoldable

A heading that opens what is under it. The whole heading row is the control: the chevron turns, the row says whether it is open, and it washes under the pointer the way a menu row does. A line under the heading can say in short what is folded away while it is shut, facts can stand at the row's end, and a row with nothing to unfold is static, lined up with the rest. Held open while forced, as a filter does while it is typed. The structured spec is [`unfoldable.json`](unfoldable.json).

Sources: sokkel-ui `packages/core/src/components/Unfoldable.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| unfoldable | The column: the row, then the summary while shut or the content while open, 8 apart. |
| row | The heading row, the whole of it the control while it unfolds (a button): the chevron, then the heading; padded 4 all round and reaching 4 past the column on each side, so its words line up with the text around it. |
| chevron | A chevron pointing at the heading, turned down while open; 14 square, in muted-foreground. While forced it is turned down in faint; a static row keeps its room empty. |
| heading | The heading, text.sm at 500, cut to one line. |
| aside | Facts at the row's end, outside the button's name, such as a count: text.xs in muted-foreground, 8 apart. |
| summary | While shut, a line under the heading saying what the folded part holds in short: text.xs in muted-foreground, under the heading's start (layout.indent), 6 up into the column's gap, one line unless wrapSummary. |
| content | While open, what it holds, under the heading's start (layout.indent). |

## Options

- `heading`: What the row says.
- `aside`: Facts at the row's end, outside the button's name, such as a count.
- `summary`: A line under the heading while it is shut, such as what the folded part holds in short.
- `open`: Whether it is open, held by the app with onOpenChange; held inside when not given.
- `defaultOpen` (`false` by default): Starts it open.
- `onOpenChange`: Called with the open state the reader asked for.
- `forced` (`false` by default): Holds it open whatever the reader chose, as a filter does while it is typed: the row is static meanwhile, its chevron turned down in faint, and the reader's own choice returns when it is let go.
- `wrapSummary` (`false` by default): Lets a long summary wrap onto more lines instead of being cut to one.
- `children`: What opens under the heading. Without it the row is static: no chevron and no button, its heading where an unfoldable row's stands, so a list of mixed rows lines up.

## Sizes

- unfoldable: gap `8`
- row: padX `4`, padY `4`, gap `8`, radius `radius-md`, phoneMinHeight `spacing-finger`. A finger tall below md while it unfolds.
- chevron: height `14`, width `14`
- aside: gap `8`
- layout.indent: `22`. The summary's and the content's start: the chevron's 14 and the row's 8, so they line up with the heading.

## States and tokens

- rest: Shut: the chevron points at the heading, the summary under it.
- hover: The pointer is over a row that unfolds.
- focus: Keyboard focus on the row: the focus ring inside its edge.
- open: Open: the chevron turned down, the content under the heading, no summary.
- forced: Held open: the row is static, its chevron turned down in faint.
- row at rest: radius `radius-md`, text `text.sm`, weight `500`.
- row at hover: ground `hover`.
- row at focus: ring `{"color": "ring", "width": "focus-ring-width", "inset": "all"}`: drawn inside the row's edge, flush with it (`ring-focus ring-inset`, a box-shadow); `focus-ring-offset` is not used.
- chevron at rest: ink `muted-foreground`.
- chevron at forced: ink `faint`.
- aside at rest: ink `muted-foreground`, text `text.xs`.
- summary at rest: ink `muted-foreground`, text `text.xs`.

## Keyboard

- Tab (it unfolds and is not forced): Reaches the row.
- Enter, Space (the row has focus): Opens or shuts what is under the heading.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-egui: As of fc9d27e: Its heading starts at 26 and its content at 22 (the row does not reach 4 past the column); no summary or wrapSummary, controlled open, static row or phoneMinHeight; the ink is foreground, not what it stands on. Forced, the chevron, hover and the 30 height match.
- sokkel-tui: As of b99664f its reports name no such part.
