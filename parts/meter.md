# Meter

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

How much of something there is on a known scale, as a bar: a disk filled, a quota used, a battery left. With bounds the bar takes a tone: good, warning or critical. The structured spec is [`meter.json`](meter.json).

Sources: sokkel-ui `packages/core/src/components/ui/meter.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A row wrapping, 12 apart across and 6 down: the label and the value on the first line, the track under them across the whole width. |
| label | At text.sm 500. |
| value | At the line's end at text.sm in muted-foreground, tabular; in warning-ink in the warning tone, at 500 in critical-ink when critical. Without a format, the share as a whole percent. |
| track | 6 tall, rounded full, on muted. |
| indicator | The track filled from its start to the value over the scale, rounded full: primary without bounds, else good, warning or critical. |

## Options

- `value`: How much there is.
- `min`: The scale's start.
- `max`: The scale's end.
- `low`: Where the scale stops being good.
- `high`: Where the scale turns critical.
- `optimum` (`low`, `high`): Which end is good: low, so a fuller bar reads worse, or high.
- `format`: Writes the value; a whole percent of the scale by default.

## Sizes

- track: height `6`. 
- label: text `text.sm`. 

## States

- rest: No bounds: the bar in primary.
- good: Within the good end: the bar in good.
- warning: Between the bounds: the bar in warning, the value in warning-ink.
- critical: Past the bad bound: the bar in critical, the value in critical-ink.

## Keyboard


## Words


## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
