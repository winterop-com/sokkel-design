# Playback timeline

A time to look back at, such as a map's tracks an hour ago: an axis with day and hour ticks on the zone's clock, the live edge marked, a strip of activity as bars over it, and a playhead to drag or move with the keys. Play moves the time on, Step back and Step forward move it by a step, and Live returns to now; a drag or step that reaches the live edge, or ends within 8 of it, returns to live too. Its axis is the run timeline's (parts/run-timeline). The structured spec is [`playback-timeline.json`](playback-timeline.json).

Sources: sokkel-ui `packages/core/src/components/PlaybackTimeline.tsx`, `packages/core/src/components/time-axis.tsx`, `packages/core/src/lib/time-axis.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A column on card with a border edge, rounded by radius-surface, in card-foreground. |
| bar | Over a border rule, padded 8 across and 4 down: Step back, Play or Pause, Step forward as ghost icon buttons (icon-sm), 4 apart; the readout in the code face at text.help, Live in good-ink while live, the time shown (Nov 20, 12:30:00) otherwise; the Live button at the end, small, a dot before it (good and pulsing while live, faint otherwise), ghost and pressed while live, outline otherwise. |
| strip | 32 tall, on muted at half strength, rounded by radius-mini, padded 12 across inside the box, 8 below the bar: the ticks' lines in border, the live edge's line in primary, the activity as one bar per bin 80 percent of its width, as tall as its count of the tallest, in primary at 55 percent up to the time shown and muted-foreground at 30 after it; past the live edge a hatch in border. |
| ticks | Under the strip, 32 tall, as the run timeline's axis: labels in the code face at text.2xs in muted-foreground, a day's name at the zone's midnight and the time otherwise; the live edge's chip, Live, on primary. |
| playhead | A line 2 wide down the strip at the time shown, with a knob 10 across at its top edged 2 in card: foreground while playing back, good while live. |
| readout | The time shown, or Live, beside the controls, in the code face. |
| barPlayed | An activity bar at or before the playhead, in its full ink. |
| barAhead | An activity bar after the playhead, quieter, the time not yet played back. |
| liveChip | The chip at the live edge, Live while the playhead is there. |

## Options

- `from`: Where the axis starts.
- `to`: Where it ends.
- `live`: The live edge; to by default.
- `value`: The time shown, or null while live.
- `onValueChange`: Hears the time a scrub, step or play moves to, or null on returning to live.
- `playing`: Whether it plays.
- `rate`: How many times real time playing runs.
- `step`: How far a step moves, in ms.
- `activity`: Counts in bins of one size from from to to.
- `label`: What is played back, naming the playhead.

## States

- live: At the live edge: the readout says Live, Play and Step forward are shut.
- back: Played back: the readout says the time, the bars after it quieter.
- playing: The time moves on at rate; at the live edge it stops and returns to live.
- focus: Keyboard focus on the playhead: the focus outline around it.
- rest: The timeline drawn.

## Keyboard

- ArrowLeft, ArrowDown (the playhead has focus): Back a step; with Shift, a tick.
- ArrowRight, ArrowUp (the playhead has focus): On a step; with Shift, a tick; at the live edge, live.
- PageDown, PageUp (the playhead has focus): Back or on ten steps.
- Home (the playhead has focus): To the axis's start.
- End (the playhead has focus): Back to live.

## Words

- `live` (`playbackTimeline.live`): "Live"
- `goLive` (`playbackTimeline.goLive`): "Back to live"
- `play` (`playbackTimeline.play`): "Play"
- `pause` (`playbackTimeline.pause`): "Pause"
- `stepBack` (`playbackTimeline.stepBack`): "Step back"
- `stepForward` (`playbackTimeline.stepForward`): "Step forward"
- `position` (`playbackTimeline.position`): "Time shown"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
