# Kiosk

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

The frame of a wall or kiosk view, for a screen on a wall with nobody at a keyboard: no rail and no top bar, only a head (the mark, the title, quiet actions and a large clock), a row of counters, the stage with an aside beside it, and a strip along the bottom. It fills the height it is given on the app's background and the stage takes all the room the rest leaves. In a narrow room everything stacks and the frame scrolls down, never sideways. The structured spec is [`kiosk.json`](kiosk.json).

Sources: sokkel-ui `packages/core/src/components/Kiosk.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| frame | The whole height it is given, on background in foreground; inside it, an inner column padded 12 holds the pieces 12 apart, 16 and 16 from a room 768 wide, and grows to the frame's height. What does not fit scrolls down inside it; nothing scrolls sideways. A region named by label. |
| head | One row, centered, 12 apart, wrapping onto more lines 4 apart: the mark, the title taking the room left, then the actions and the clock at its end. |
| mark | With mark: the app's mark before the title, at its own size. |
| title | What the wall shows: the page's heading, text.page-title, cut to one line. |
| actions | With actions: quiet buttons before the clock, 4 apart, in muted-foreground. |
| clock | With clock: the time in tabular figures, never wrapping: text.page at 500 below 768 of the room, text.statistic from it. |
| figures | With figures: a row of counters (parts/stat), 12 apart: as many equal columns as fit with none narrower than 144, each row filled to its ends, one column where the room is narrower. |
| stage | All the room the rest leaves, never under 288 tall; what is put on it, such as a map, fills it edge to edge. |
| aside | With aside: from 768 of the room, a column beside the stage at its end, 256, 320 or 384 wide and as tall as the stage, scrolling by itself; below it, under the stage at its own height. |
| foot | With foot: a strip along the bottom, such as an alert ticker (parts/alert-ticker), never shrinking. |

## Options

- `mark`: The app's mark, before the title.
- `title`: What the wall shows.
- `clock`: The time, drawn large at the head's end.
- `actions`: Quiet buttons at the head's end, before the clock.
- `figures`: A row of counters under the head, each a stat.
- `children`: The stage: what fills the room left, such as a map.
- `aside`: Beside the stage in a wide room, under it in a narrow one.
- `asideWidth` (`sm`, `md`, `lg`): The aside's width beside the stage: 256, 320 or 384.
- `foot`: A strip along the bottom, such as an alert ticker.
- `label`: Names the region for a screen reader.

## Sizes

- frame: padX `12`, padY `12`, gap `12`. 16, 16 and 16 from a room 768 wide.
- head: gap `12`, text `text.page-title`. 
- actions: gap `4`. 
- clock: text `text.statistic`. text.page at 500 below 768 of the room.
- figures: gap `12`. 

## States

- rest: The frame drawn in a wide room: the aside beside the stage, the frame as tall as its room.
- stacked: Everything in one column, the frame scrolling down.

## Keyboard

- Tab: Moves through the actions, then whatever the stage, the aside and the foot hold.

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such pattern.
- sokkel-tui: As of b99664f its reports name no such pattern.
