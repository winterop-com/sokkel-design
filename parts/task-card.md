# Task card

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

One task on a board: what it is and its state as a chip in its tone, its elapsed time at the head's end, a line from who does it to what it is done to with their glyphs, optional facts, and a row of actions; a destructive action asks first. The structured spec is [`task-card.json`](task-card.json).

Sources: sokkel-ui `packages/core/src/components/TaskCard.tsx`, `packages/core/src/components/StatusChip.tsx`, `packages/core/src/components/DescriptionList.tsx`, `packages/core/src/components/DialogShell.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A column 8 apart on card with a border edge, rounded by radius-surface, padded 12, in card-foreground. |
| head | The title at 500 cut with an ellipsis, the id in the code face at text.help in muted-foreground, the state as a status chip with its dot, 8 apart; the elapsed time at the line's end in the code face at text.help, muted-foreground, as a clock (4:07, 1:04:07). |
| line | With from or to: each end's glyph and name, 6 apart, an arrow 14 square in muted-foreground between them, 8 apart. |
| facts | With facts: a description list in its row layout at size sm (parts/description-list). |
| actions | With actions: small buttons in a wrapping row, 8 apart, 4 more above it: outline, primary drawn filled, destructive in the destructive variant. |
| confirm | An action with confirm opens a confirm dialog (parts/dialog) with its question and detail; its Cancel says Keep, and its answer is drawn destructive for a destructive action. |
| title | The task's name (investigate, follow, report), then its id in the code face. |
| elapsed | How long it has run, at the head's end, in tabular figures. |

## Options

- `title`: What the task is: Follow, Investigate, Report.
- `code`: Its id.
- `state` (`pending`, `executing`, `paused`, `done`, `failed`): Its state, as a chip in its tone.
- `startedAt`: When it started; the elapsed time counts from here.
- `endedAt`: When it ended; the elapsed time stops here.
- `now`: The moment it counts to while it runs; without it, a shared clock while executing.
- `elapsed`: Its elapsed time in ms, in place of startedAt.
- `from`: Who or what does it: a name and a glyph.
- `to`: What it is done to: a name and a glyph.
- `facts`: Facts in one wrapping line.
- `actions`: Buttons: label, icon, primary, destructive, confirm, reason, busy.
- `selected`: Draws it as the task chosen.

## Sizes

- container: padX `12`, padY `12`, gap `8`, radius `radius-surface`. 
- line: gap `8`, icon `14`. 

## States

- rest: The card drawn.
- selected: Edged and ringed in primary.
- pending: Waiting to start: the chip in status-pending.
- executing: Under way: the chip in status-running, its dot pulsing; the elapsed time ticks.
- paused: Held: the chip in warning.
- done: Finished: the chip in good.
- failed: Given up on: the chip in critical.

## Keyboard

- Tab: Reaches each action.
- Enter, Space (an action has focus): Runs the action, or opens its confirm.

## Words

- `pending` (`taskCard.pending`): "pending"
- `executing` (`taskCard.executing`): "executing"
- `paused` (`taskCard.paused`): "paused"
- `done` (`taskCard.done`): "done"
- `failed` (`taskCard.failed`): "failed"
- `elapsed` (`taskCard.elapsed`): "Elapsed"
- `to` (`taskCard.to`): "to"
- `keep` (`taskCard.keep`): "Keep"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
