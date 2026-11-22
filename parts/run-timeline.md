# Run timeline

Jobs and their runs along one time axis. Each job is a lane: its name and a detail line at the
start, its runs where they fell, each a mark in its state's color (a bar as long as it took when it
has an end), runs still to come hollow, and a line at the current time across every lane. A legend
names the states over a ruler of ticks that fit the width on the time zone's clock. A lane is
chosen by a press on its name or anywhere in its track; with `onShift` the chosen lane's upcoming
runs drag sideways as one, snapped, a card at the pointer saying how far, and the arrow keys move
them from the keyboard. The runs stay where they are until the app moves them. The structured spec
is [`run-timeline.json`](run-timeline.json).

Sources: sokkel-ui `packages/core/src/components/RunTimeline.tsx` (`RunTimeline`,
`RUN_TIMELINE_WORDS`, `timelineTicks`, `formatShift`), `run-timeline-drag.tsx` (`ShiftDragArea`,
`ShiftDrag`, the drag layer), `DragDrop.tsx` (the drag engine, its card and its press rules),
`Dot.tsx` (the legend's dots) and `StatusProvider.tsx` (each state's color and label).

## Anatomy

| Piece | What it is |
|---|---|
| box | The whole timeline on `card`, edged in `border`, `radius-surface`, `text.body`; fills its container's width |
| legend | A strip over the ruler: an entry per state the runs show, Scheduled when a run is upcoming, and the hint at its end while the chosen lane can be shifted (from 640 wide) |
| axis | The ruler, 32 tall: the names' column empty, then the ticks' labels |
| tick, gridLine | A tick's label (the day at the zone's midnight or for a step of a day, else the time on a 24-hour clock) and its line down every lane |
| nowLine, nowLabel | The current time's line and its `Now` tab on the ruler, in capitals |
| lane | A job's row, ruled under; the chosen lane on `accent`; a total lane ruled over in `border-strong` |
| name | The name and detail, 192 wide (112 below 640), padded 12 by 8, with a 2 wide start edge the chosen lane draws in `primary`; a button when `onSelect` is given |
| track | The rest of the lane, at least 48 tall; a press in another lane's track chooses it |
| run | A mark 4 wide or a bar, 16 tall, `radius-mini`, in its state's color; hollow while upcoming |
| ghost | During a drag, each carried run's place before it, dashed |
| handle | The chosen lane's upcoming runs as one thing to drag: a dashed `primary/50` box on `primary/5` from now to 8 past the last upcoming run, 4 in from the track's top and bottom, a grip at its start; a tab stop |
| card | While a pointer drags: `Shift +2h` on the drag engine's card, 12 right of and below the pointer |

## Options

`lanes` (`{ id, name, label?, detail?, runs, total? }`) with `runs` (`{ id, at, end?, status? }`);
`from`, `to` and `now`; `selected` and `onSelect`; `onShift` (`{ lane, by }` in ms) and `snap` (a
quarter of the ticks' step by default); `legend` (the states to name, or `false`); `timeZone` and
`locale`.

## Sizes

| | Value |
|---|---|
| legend | 12 across, 8 down, 16 between entries (4 between wrapped lines), `text.help`; each entry an 8 dot 6 before its label |
| axis | 32 tall; ticks at the finest step that leaves at least 64 px a tick, labels kept 40 px from the Now tab and out of the outer 2 percent |
| name | 192 wide (112 below 640), 12 by 8 |
| track | at least 48 tall |
| run | 16 tall, 4 wide as a mark |
| nowLabel | 4 across, `text.2xs` at 500, a 16 line |
| handle | 4 from the track's top and bottom, 8 past the last run; grip 14 |
| card | 8 by 4, `text.help` in the code face |

Nothing varies by density.

## States and tokens

| State | Paint |
|---|---|
| rest | box `card` / `border`; legend ink `muted-foreground` over a `border` rule; ticks `muted-foreground` `text.2xs`; grid lines `border`; now line and tab `primary`, the tab's ink `primary-foreground` |
| hover | another lane's name on `muted`, its track on `muted/50`; the handle on `primary/10` |
| focus (keyboard) | a lane's name or the handle: the frame's focus outline in `ring`, `focus-ring-width`, drawn `focus-ring-offset` inside |
| selected | the lane on `accent`, its name's start edge `primary`, the name keeping `accent` under the pointer |
| total | ruled over in `border-strong`, the name in the body face at 500 |
| upcoming | a run hollow, edged in `muted-foreground` |
| dragging | the carried runs and the handle where the shift puts them, never before now; a dashed `border-strong` ghost at each one's place |
| narrow | below 640 the names' column is 112 and the hint is left out |

A run's color is its state's in the status map (`status-succeeded`, `status-failed`, ...), which an
app's `StatusProvider` may change at run time; it is not a spec paint (principle 20).

## Keyboard

- Tab reaches each lane's name, then the chosen lane's handle after its name.
- Enter or Space on a name chooses the lane.
- On the handle, Left and Right shift the upcoming runs a snap; with Shift, a tick's step. A shift
  that would put the first upcoming run at or before now does nothing.
- Escape during a pointer drag puts the runs back.

## Words

`now` Now, `scheduled` Scheduled, `hint` Drag the selected job's upcoming runs to shift them,
`upcoming` Upcoming runs of {lane}, `by` Shift {amount}, `shifted` Upcoming runs of {lane} shifted
{amount}. An amount is signed, in days, hours and minutes (`+2h`, `-1d 6h`, `+0m`).

## Renderer-specific

- **sokkel-ui:** the axis is measured with a ResizeObserver (640 until it is); the drag runs on the
  library's one drag engine, whose layer is fetched the first time a timeline with `onShift` is
  drawn; a mouse or pen drags after 4 px, a touch after a 300 ms hold; the shift is said to a screen
  reader.

## Where sokkel-egui differs today

As of 1a87987, `RunTimeline` is built from this spec, but for the handle's keys and touch: Left and
Right do not shift a pending run's handle, and a touch drags at once rather than after its 300 ms
hold.
