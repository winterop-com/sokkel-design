# Repeated group

A group of fields asked again for each of several things in a hand-composed form, such as a run's
steps: a head with the group's name, its required mark, the issue mark for the group as a whole and
Add at its end; a description under it; then each row in a box of its own, headed by its name (its
place, counted from 1) with Move up, Move down and Remove at the end, over the row's fields. What is
wrong with the group as a whole is [parts/text-field](text-field.md)'s issue mark beside its name,
while each row's fields say their own, so the form never changes height (principle 12). The
structured spec is [`repeated-group.json`](repeated-group.json).

Sources: sokkel-ui `packages/core/src/components/RepeatedGroup.tsx` (`RepeatedGroup`,
`RepeatedGroupProps`, `RepeatedGroupWords`, `REPEATED_GROUP_WORDS`), `RepeatedDrag.tsx`
(`RepeatedDrag`, the grip), `drag-parts.ts` (`DragPartsContext`), `Sortable.tsx`, `IssueMark.tsx`,
`IconButton.tsx` and `ui/button.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| group | A fieldset named by its title: the head, the description and the rows in a column, 8 apart |
| head | At least `density.control-sm` tall: the title, the required mark, the issue mark, Add at the end, 8 apart |
| title | The name in `text.action`, cut short; it takes the focus (tabindex -1) for a form's issue count |
| requiredStar / requiredWord | A star in `critical-ink` (said as `words.required`), or the word after the title in `text.help` |
| issueMark | parts/text-field's issue mark in a `density.control-sm` square box beside the title |
| add | parts/button's ghost at size sm: a plus and `words.add` |
| description | 4 under the head, `text.help` in `muted-foreground` |
| row | A box with a 1px `border` edge, `radius-surface`, no ground, padded 12; its head and fields 12 apart |
| rowHead | The row's name (`text.badge`, `muted-foreground`), then Move up, Move down and Remove, 4 apart |
| moveUp / moveDown | Ghost icon buttons (size icon, `density.control` square) in `muted-foreground`; shut at the first and last row |
| remove | parts/button's ghost at size sm in `muted-foreground`: an x and `words.remove` |
| fields | The row's own fields, drawn by the app for the row's key and place |
| grip | Inside a `RepeatedDrag`: the drag grip 4 before the row's box, 12 down from its top |

## Options

`label`, `description`, `id`; `required` with `requiredMark` (`star`, the default, or `word`);
`error` and `issues` for the group as a whole, with `issueOpen` and `onIssueOpenChange`; `rows` (the
keys, such as `useRepeated`'s) and `children(key, index)` for each row's fields; `onAdd`, `onRemove`
and `onMove(from, to)`, each of which brings its buttons; `min` (0) and `max`; `readOnly`; `words`.

Add shows with `onAdd` below `max`; Remove with `onRemove` above `min`; Move up and Move down with
`onMove` and more than one row. `readOnly` takes them all away.

## States and tokens

| State | Paint |
|---|---|
| rest | the row box `border` edge on no ground; the title in the page's ink |
| hover | Add, a Move or a Remove: `hover` ground in `foreground` (parts/button's ghost) |
| focus (keyboard) | parts/button's focus outline on a button or the grip |
| shut | Move up on the first row, Move down on the last: `disabled-opacity`, out of the tab order |
| invalid / warning | the issue mark in `critical-ink` or `warning-ink` beside the title |
| dragging | inside a `RepeatedDrag`: the row lifts and the others move aside |

## Keyboard

- Tab reaches Add, the issue mark, then each row's grip, Move up, Move down, Remove and fields.
- Enter or Space on Add, a Move or a Remove presses it.
- Inside a `RepeatedDrag`, with a grip focused, ArrowUp and ArrowDown move the row a place, the focus
  following it; Space or Enter picks it up and puts it down; Escape puts a dragged row back.

## Words

`add` Add, `remove` Remove, `moveUp` Move up, `moveDown` Move down, `item` Item {place},
`required` required, and the issue words `issueCritical` Error: and `issueWarning` Warning:
(message ids `issue.*`). `item` is a function in sokkel-ui of the row's index from 0, so its catalog
entry is null: it formats rather than says. Move up is named `words.moveUp: words.item`, Remove
`words.remove words.item`.

## Cells

The head, each row's head and the description are one row each; a row's box is a box in `border`
with corners by `radius-surface`, 1 column in and a blank row inside it at regular, none at compact.
Add, Move and Remove are ghost buttons: no edge, keyboard focus as `focus-ring-start` and
`focus-ring-end` beside them. The issue mark's message is said in the status line while the title
has focus (principle 23).

## Where sokkel-egui differs today

As of d163191, `RepeatedGroup` was built before this spec and has not been compared with it. Read
from its source: the title with a star, the description, Add, and each row's box with its name and
Remove, which goes at `min`. Not there: `requiredMark` word, `error` and `issues` with the issue
mark, `onMove` with Move up, Move down and the grip, `max`, `readOnly`, Add left out without
`onAdd`, and the words `moveUp`, `moveDown`, `required` and the issue words.

sokkel-tui has no repeated group yet (64f4b19).
