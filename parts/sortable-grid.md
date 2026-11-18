# Sortable grid

Cards the reader puts in order, as many across as the room holds. A card is dragged as a whole (or by a grip the app draws in it), the rest moving aside to show where it lands; letting go moves it, and Escape puts it back. With a card focused, the arrow keys move it a place, the focus following it, and Space or Enter picks it up to move it further. A screen reader hears each step. The structured spec is [`sortable-grid.json`](sortable-grid.json).

Sources: sokkel-ui `packages/core/src/components/Sortable.tsx (SortableGrid, SortableGroup, SortableItem, SORTABLE_WORDS)`, `packages/core/src/components/DragDrop.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| grid | The cards in a grid of as many equal columns as fit, each at least minItemWidth (or the whole width when narrower), 12 apart. |
| item | One card's cell, its content filling it. With handle item, the whole card is the grip: a grab cursor, and the focus outline when reached by keyboard. |
| placeholder | While a card is dragged, its own cell stays in place at 40 percent, as the room it will leave, and the other cards move aside. |
| lifted | The copy that follows the pointer: the drag engine's card (DragDrop), shared by every drag. |

## Options

- `items`: The cards, in their order.
- `itemKey`: Each card's key, stable across moves.
- `itemLabel`: What a screen reader and a grip call a card.
- `renderItem`: Draws a card's content, given its place, whether it is dragged, and whether it is the copy following the pointer.
- `onMove`: Moves the card at from to to; the grid draws the order it is given.
- `handle` (`item`, `grip`; `item` by default): item: the whole card is the grip and takes the focus. grip: the app draws a SortableGrip in each card.
- `minItemWidth` (`192` by default): The least width of a cell; the grid fits as many across as its room holds.
- `kind`: What a target outside the grid takes its cards as, such as a tree's folders.
- `disabled` (`false` by default): Nothing moves.
- `label`: What the grid is, for a screen reader.

## Sizes

- grid: gap `12`
- layout.minItemWidth: `192`. minItemWidth's default (12rem).

## States and tokens

- rest: The cards in their order.
- focus: Keyboard focus on a card (handle item): the focus outline around it.
- dragging: A card is being moved: its cell stays at 40 percent, a copy follows the pointer, the rest move aside.
- item at focus: ring `{"color": "ring", "width": "focus-ring-width", "offset": "focus-ring-offset"}`.

## Keyboard

- Tab: Reaches each card in turn (handle item), or each grip.
- ArrowUp, ArrowLeft (a card has focus): Moves the card a place back, the focus following it; a screen reader hears words.moved.
- ArrowDown, ArrowRight (a card has focus): Moves the card a place on, the focus following it; a screen reader hears words.moved.
- Space, Enter (a card has focus): Picks the card up to move it further with the arrows; again lets it go there.
- Escape (a card is being moved): Puts a picked-up card back where it was.

## Words

- `move` Move {item} (`sortable.move`)
- `moved` {item} moved to {place} of {count} (`sortable.moved`)

## Where each renderer stands

- sokkel-egui: As of 1a87987, SortableGrid was built (d163191) before this spec, dragging to reorder; not compared with this spec.
- sokkel-tui: As of b99664f its reports name no such part.
