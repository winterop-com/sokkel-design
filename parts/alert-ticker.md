# Alert ticker

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

The latest alerts in one strip, one row tall, one at a time: a dot in the alert's tone, its words cut with an ellipsis, when it happened, and its place among the alerts at the end. It moves to the next alert every interval, the new one sliding in, and starts over after the last. It holds still while paused, under the pointer, with focus in it, where motion is reduced, with one alert or none, and with an interval of 0 or less. The structured spec is [`alert-ticker.json`](alert-ticker.json).

Sources: sokkel-ui `packages/core/src/components/AlertTicker.tsx`, `packages/core/src/components/Dot.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | One row 40 tall on card with a border-strong edge, rounded by radius-surface, padded 12 at its sides, text.sm in card-foreground, its pieces 12 apart and centered, clipping what leaves it. A region named by label. |
| item | The alert shown, taking the room left: its dot, its icon and its words, 8 apart. With onSelect it is a button as tall as the strip. |
| dot | 8 across in the alert's tone: critical (breathing with the live pulse), warning, good, info, or for quiet a hollow dot edged in faint. info when the alert names no tone. |
| icon | With icon: after the dot, 16. |
| text | What happened, on one line, cut with an ellipsis. |
| when | With when: after the item, text.xs in muted-foreground in tabular figures, never cut. |
| position | With two alerts or more: the shown alert's place and the count, 2 of 5, at the strip's end, text.xs in faint in tabular figures, never cut. |
| empty | With no alerts: No alerts in muted-foreground, in the item's place. |

## Options

- `items`: The alerts, the latest first: each an id, its text, and optionally a tone (critical, warning, good, info, quiet), when it happened and an icon.
- `label`: What the strip shows, for a screen reader.
- `interval`: How long each alert is shown, in milliseconds.
- `paused`: Holds the alert shown.
- `index`: The alert shown, held by the app, counted from zero.
- `defaultIndex`: The alert shown first, counted from zero.
- `onIndexChange`: Called with the next alert's index each time the ticker moves on.
- `onSelect`: Makes the alert shown a button, called with its id.

## Sizes

- container: height `40`, padX `12`, gap `12`, radius `radius-surface`, text `text.sm`. 
- item: gap `8`, icon `16`. 
- dot: width `8`, height `8`. 

## States

- rest: An alert shown, standing still: the first frame always is.
- moving: A new alert sliding in from below, fading in.
- held: The ticker holding the alert shown: paused, under the pointer, with focus in it, motion reduced, fewer than two alerts, or an interval of 0 or less.
- empty: No alerts: the strip keeps its height and says so.
- hover: The pointer over an alert that is a button.
- focus: Keyboard focus on the alert shown: the focus outline inside the strip.
- critical: The alert shown is critical.
- warning: The alert shown is a warning.
- good: The alert shown is good news.
- quiet: The alert shown is quiet, of no weight.

## Keyboard

- Tab: Reaches the alert shown when it is a button, which holds the ticker.
- Enter (the alert has focus): Calls onSelect with the shown alert's id.
- Space (the alert has focus): Calls onSelect with the shown alert's id.

## Words

- `empty` (`alertTicker.empty`): "No alerts"
- `position` (`alertTicker.position`): "{index, number} of {count, number}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
