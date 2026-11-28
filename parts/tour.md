# Tour

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

A guided tour of a page: one step at a time, each a card beside the part of the page it is about, that part cut out of a dimmed page and outlined. The structured spec is [`tour.json`](tour.json).

Sources: sokkel-ui `packages/core/src/components/Tour.tsx`, `packages/core/src/components/ui/popover.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| spotlight | Over the page: the step's target cut out of a dim in scrim, 4 around it, rounded by radius-control and outlined 2 in primary; it moves to each step's target. A step with no target, or one not on the page, dims the whole page. The page under the dim takes no presses. |
| card | A popover 320 wide, 12 from the target on its side (bottom by default, flipped where there is no room), or in the middle of the page without a target: a column 12 apart. |
| head | The step's title (the popover's title), and at the line's end where the tour is at text.xs in muted-foreground. |
| body | The step's words, as the popover's description. |
| actions | Skip tour (ghost, small) at the start; at the end Back (outline, small) from the second step, then Next (small), or Done on the last. |

## Options

- `steps`: Each step: its target's selector, title, words and side.
- `open`: Whether the tour is showing.
- `onOpenChange`: Called with false when the tour ends: done, skipped, or Escape.
- `step`: The step shown, from 0.
- `onStepChange`: Called with the step moved to.

## Sizes

- card: width `320`, gap `12`. 

## States

- rest: A step shown beside its target.
- centered: A step with no target: the card in the middle, the whole page dimmed.

## Keyboard

- Enter (the card is open): Moves on, or ends the tour on the last step: the focus starts on Next.
- Escape (the card is open): Ends the tour.

## Words

- `progress` (`tour.progress`): "{step} of {steps}"
- `back` (`tour.back`): "Back"
- `next` (`tour.next`): "Next"
- `done` (`tour.done`): "Done"
- `skip` (`tour.skip`): "Skip tour"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
