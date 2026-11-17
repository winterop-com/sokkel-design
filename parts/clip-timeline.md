# Clip timeline

The multi-track timeline of a video editor. Each track is a row with its header at the start (its
kind's icon, its name, and with `onTrackChange` toggles to mute or hide it and to lock it) and its
lane after it, under a ruler of timecode that fits the zoom. Clips are blocks in their color with
their label, an audio clip drawing its waveform and a title dashed; the chosen ones are outlined. A
press or a drag on the ruler moves the playhead, a line across every track. With `onClipsChange` a
clip drags along its track or onto another of the same kind and either end trims it, snapped, a
card at the pointer saying the new start or length, never landing on another clip. With `onDrop` a
thing from another part of the same drag area lands on a track that takes it. The lanes scroll both
ways while the ruler stays at the top, the headers at the start and the playhead's timecode over
both. The structured spec is [`clip-timeline.json`](clip-timeline.json).

Sources: sokkel-ui `packages/core/src/components/ClipTimeline.tsx` (`ClipTimeline`,
`CLIP_TIMELINE_WORDS`, `clipFitZoom`, `clipTickStep`, `placeClip`, `snapTime`, `formatTimecode`),
`clip-timeline-drag.tsx` (`ClipDragArea`, `ClipDrag`, `ClipLane`), `DragDrop.tsx`, `IconButton.tsx`
(the toggles) and `lib/kind.ts` (the kind colors).

## Anatomy

| Piece | What it is |
|---|---|
| box | On `card`, edged in `border`, `radius-surface`, `text.body`; one scroller inside for the headers and the lanes |
| corner | Over the headers, level with the ruler: the playhead as `HH:MM:SS:FF` in the code face |
| headers | The headers' column, 176 wide (112 below 640), ruled at its end, pinned at the start |
| trackHeader | 56 tall: the kind's icon (14) and the name in `text.badge`; under them the toggles, parts/button's ghost icon buttons at `icon-xs` |
| ruler | 32 tall, pinned at the top: labeled ticks (`border-strong` rules, timecode in `text.2xs`), minor ticks at fifths (6 tall, drawn while 8 px apart), the playhead's line and knob (12 by 16) |
| lane | 56 tall, ruled under; a locked track's on `muted/50` |
| clip | Inset 4 from the lane's top and bottom, at least 2 wide, `radius-control`, its color's wash, edge and ink; a title dashed with a T; the label 8 in and 4 down in `text.badge` on a 16 line |
| waveform | An audio clip's loudness for its part of the source, mirrored, in the clip's ink at 60 percent |
| grip | 8 wide at each end of a clip that changes; under the pointer, the clip's ink at 25 percent |
| landing | Where a drag would put it: a dashed 2 wide outline, `primary` (washed `primary/10` for a thing from outside) or `destructive` where it would cover another clip |
| snapLine | A `ring` line where an edge snapped |
| card | `Start 00:00:04:00` or `Length 00:00:05:15` on the drag engine's card, 12 right of and below the pointer |

## Options

`tracks` (`{ id, name, kind, muted?, locked?, hidden? }`, kind `video`, `audio` or `title`) and
`clips` (`{ id, track, start, duration, inPoint?, sourceDuration?, label, color?, waveform? }`,
color one of `blue`, `green`, `jade`, `pink`, `teal`, `violet`, by the track's kind when left out);
`duration`, `playhead` and `onPlayheadChange`; `selected` and `onSelectedChange`; `onClipsChange`,
`onSplit`, `onDelete`; `onDrop`, `accepts` and `dropDuration`; `onTrackChange`; `zoom`,
`onZoomChange` and `onFitChange`; `fps` (30); `snap` (on).

**Zoom.** Left out, the fit: the length fits the lanes' width, never tighter than 16 px a second,
or than the length fitted to 960 px when that is tighter still; past that the lanes scroll
sideways. Cmd or Ctrl with the wheel, or a pinch, zooms around the pointer between 0.05 and 600 px
a second, never under half the fit. The labeled ticks' step is the first of 1, 2, 5 and 10 frames,
then 1 s to 1 h, that is at least 88 px wide.

**Snapping and placing.** A dragged edge snaps to the playhead, another clip's edge or 0 within
8 px, else to a frame. A moved clip never lands on another: let go on one, it goes to the nearest
free place beside it when one is within its own length, else back. A trim never passes the source's
ends or a neighbor. A locked track's clips stay put, and it takes nothing from outside.

## States and tokens

| State | Paint |
|---|---|
| rest | box, corner, headers and ruler on `card`, rules `border`; ticks `border-strong`, labels `muted-foreground`; minor ticks `border`; playhead `primary` |
| clip colors | `kind-<color>/25` wash, `kind-<color>/60` edge, `kind-<color>-ink` ink |
| focus (keyboard) | a clip or the knob: the frame's focus outline in `ring`, `focus-ring-width`, `focus-ring-offset` outside |
| chosen | a 2 wide `primary` ring, over its neighbors |
| faded | a carried clip, or one on a hidden or muted track: half strength |
| locked | the lane on `muted/50` |
| dragging, blocked, arriving | the landing in `primary`, in `destructive` when blocked, washed `primary/10` for a thing from outside; the snap line in `ring` |
| narrow | below 640 the headers are 112 wide |

## Keyboard

- Tab reaches the toggles, the playhead's knob, then each clip.
- Enter or Space on a clip chooses it; with Shift, Cmd or Ctrl adds it or takes it away.
- Left and Right move the playhead a frame (a second with Shift); Home and End to 0 and the length.
- Alt with Left and Right moves the chosen clips a frame, all or none.
- S splits the chosen clips at the playhead; Delete or Backspace deletes them, Shift closing the gap.
- Escape during a pointer drag puts the clip back.

## Words

`label` Timeline, `playhead` Playhead, `kinds.video` Video, `kinds.audio` Audio, `kinds.title`
Title, `mute` Mute, `lock` Lock, `hide` Hide, `clip` {label}, {start} to {end}, `start` Start {at},
`length` Length {length}, `moved` {clip} moved to {at}, `movedTo` {clip} moved to {track} at {at},
`trimmed` {clip} trimmed to {length}, `split` {clip} split at {at}, `deleted` Clip deleted / {count}
clips deleted, `deletedRipple` the same with ", the gap closed", `blocked` {clip} cannot go there,
`dropped` {item} added to {track} at {at}, `at` Playhead at {at}, `zoomIn` Zoom in, `zoomOut` Zoom
out, `zoomFit` Fit. sokkel-ui says `moved` and `movedTo` with one function (its `track` given or
not) and `deleted` and `deletedRipple` with one (`ripple`); the spec keeps each wording a word of
its own so a renderer with templates needs no condition.

## Renderer-specific

- **sokkel-ui:** sticky ruler, corner and headers in one scroller; a ResizeObserver measures the
  lanes (640 until it does); the drag layer is fetched the first time a timeline that changes its
  clips is drawn; each clip and grip is a drag item and each track a drop target; a mouse or pen
  drags after 4 px, a touch after a 300 ms hold; each change is said to a screen reader.

## Where sokkel-ui-egui differs today

As of 48f51ce there is no clip timeline.
