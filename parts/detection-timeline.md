# Detection timeline

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Where things were seen over a video, as a playback bar marked with them: the spans that call for a look on a lane of their own, a lane per kind of thing, a playhead at the moment shown and the time along the foot; presses seek the player. The structured spec is [`detection-timeline.json`](detection-timeline.json).

Sources: sokkel-ui `packages/core/src/components/DetectionTimeline.tsx`, `packages/core/src/lib/detections.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A grid of two columns, the lanes' names then their tracks, 12 apart across and 4 down, at text.xs. |
| lane | One row: its name (the label, or Alerts at 500 in critical-ink) in muted-foreground cut with an ellipsis, then a track 20 tall on muted/60 rounded by radius-mini. The alerts' lane comes first when any span is an alert; then a lane per label, in the order first seen or as labels gives them. |
| span | A stretch on its lane from its start to its end over the video's length, 4 in from the track's top and bottom, no narrower than 4, rounded by radius-mini at 85 percent: critical on the alerts' lane, else its affiliation's track color, or primary without one. |
| playhead | With time: a line 2 wide in foreground across each track, 2 past its top and bottom, at the moment shown. |
| axis | Under the tracks: about six ticks on a step a reader counts in (1, 2, 5, 10, 15 or 30 seconds, then minutes), each the time at text.2xs in muted-foreground, the first at the start and the last held inside the end. |

## Options

- `spans`: The stretches seen: each with its id, label, affiliation, start, end and whether it is an alert.
- `duration`: How long the video is, in seconds.
- `time`: The playhead, in seconds.
- `onSeek`: Makes spans buttons that seek to their start, and a press on a lane seek to that moment.
- `labels`: Which labels get lanes, in this order.

## Sizes

- container: gap `4`, text `text.xs`. 
- lane: height `20`, radius `radius-mini`. 
- playhead: width `2`. 

## States

- rest: The lanes with their spans.
- hover: The pointer over a span that is a button: at full strength.
- focus: Keyboard focus on a span: the focus ring around it.

## Keyboard

- Tab: Reaches each span in turn when the timeline seeks.
- Enter (a span has focus): Seeks to the span's start.

## Words

- `timeline` (`detectionTimeline.timeline`): "Detections over time"
- `alerts` (`detectionTimeline.alerts`): "Alerts"
- `seek` (`detectionTimeline.seek`): "Go to {name} at {time}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
