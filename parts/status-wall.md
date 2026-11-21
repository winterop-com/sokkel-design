# Status wall

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

A wall of data sources for a screen across a room. Each tile is one source: its name under a quiet caption, its status as a word with a dot, one large figure with its unit, a line of detail, its freshness, and its readings over time faint along the foot. The status colors the tile's edge and a glow under it: good while up, warning while degraded, critical and slowly pulsing while down, no color and a hollow dot while unknown. The wall fills each row with as many tiles as fit and wraps, never scrolling sideways. The structured spec is [`status-wall.json`](status-wall.json).

Sources: sokkel-ui `packages/core/src/components/StatusWall.tsx`, `packages/core/src/components/Dot.tsx`, `packages/core/src/components/Chip.tsx`, `packages/core/src/components/Freshness.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| wall | A grid of tiles, 12 apart: as many equal columns as fit with no tile narrower than the wall's tile size (160, 224 or 288), one column where the room is narrower than that; the tiles of a row are as tall as the tallest. A group named by label. |
| tile | A column, 8 apart, on card with an edge, rounded by radius-surface, padded 12, in card-foreground. With onSelect or href the whole tile is one control under its pieces. |
| edge | Known statuses: the tile's edge is the status color mixed 45 percent into border, and a rule 2 thick in the status color runs along the top inside the edge. Unknown: a dashed border-strong edge and no rule. |
| glow | Known statuses: a wash 64 tall from the tile's top, the status color at 10 percent (up) or 18 percent (degraded, down) fading down to nothing. While down it breathes with the live pulse. None while unknown. |
| head | The caption, text.xs in muted-foreground, cut to one line, with the flag at the line's end, 8 apart; under it, 2 below, the icon (16) and the name, text.label, 6 apart, the name cut to one line. |
| caption | The tile's caption at the head's top: text.xs in muted-foreground, cut to one line. |
| name | The source's name under the caption, beside its icon: text.label, cut to one line. |
| flag | With flag: an outline chip (parts/chip) at the end of the caption's line, such as Simulated. |
| status | A dot 10 across in the status color and the status's word, text.label in the status's ink, 6 apart. Unknown: the dot hollow, edged in faint. Down: the dot breathes with the live pulse. |
| figure | With value or unit: the value at text.statistic in tabular figures, cut to one line, and its unit at text.sm in muted-foreground, on one baseline, 6 apart. |
| value | The figure's value: text.statistic in tabular figures, cut to one line. |
| unit | The figure's unit after its value, on one baseline: text.sm in muted-foreground. |
| detail | With detail: one line at text.help in muted-foreground, cut with an ellipsis. |
| foot | With updatedAt: the freshness (parts/freshness) at the end of a line pushed to the tile's foot. |
| series | With series: the readings as a line across the tile's whole width, 32 tall, flush with its foot and sides: values spaced evenly, the lowest 1 above the foot and the highest 1 below the top, inset by 1 so the stroke is never cut, the line 1.5 thick in the status color at 70 percent over an area in it at 12 percent. Equal values, or one, are a level line through the middle. |

## Options

- `label`: The wall: what it shows, for a screen reader.
- `tile` (`sm`, `md`, `lg`): The wall: the narrowest a tile gets, 160, 224 or 288.
- `name`: The tile: the source's name.
- `status` (`up`, `degraded`, `down`, `unknown`): The tile: how the source is doing.
- `caption`: The tile: a quiet line over the name, such as the source's kind.
- `icon`: The tile: drawn before the name.
- `value`: The tile's one figure, such as its latency.
- `unit`: The figure's unit.
- `detail`: The tile: one line under the figure, such as why it is degraded.
- `series`: The tile: readings over time, oldest first, drawn along its foot.
- `seriesLabel`: What the series shows, for a screen reader; without it the series is decoration.
- `flag`: The tile: a small chip at the head's end, such as Simulated.
- `updatedAt`: The tile: when the source was last heard from, in milliseconds since the epoch, or none for never; the freshness is drawn only with it.
- `now`: The moment the freshness counts from; without it, the shared clock.
- `selected`: Draws the tile as chosen.
- `onSelect`: Makes the whole tile one button.
- `href`: Makes the whole tile one link.

## Sizes

- wall: gap `12`. 
- tile: padX `12`, padY `12`, gap `8`, radius `radius-surface`. 
- head: gap `2`, icon `16`, text `text.label`. 
- status: gap `6`, icon `10`, text `text.label`. 
- figure: gap `6`, text `text.statistic`. 
- series: height `32`. 

## States

- rest: The tile drawn.
- up: The source answers: good.
- degraded: The source answers badly: warning.
- down: The source does not answer: critical, its dot and glow breathing.
- unknown: Not known yet: no color, a dashed edge and a hollow dot.
- hover: The pointer over a tile that is a control: washed.
- selected: The tile chosen: edged and ringed in primary.
- focus: Keyboard focus on the tile: the focus outline around it.

## Keyboard

- Tab: Reaches each tile that is a control, in the wall's order.
- Enter (a tile has focus): Calls onSelect, or follows href.
- Space (a tile with onSelect has focus): Calls onSelect.

## Words

- `up` (`statusWall.up`): "Up"
- `degraded` (`statusWall.degraded`): "Degraded"
- `down` (`statusWall.down`): "Down"
- `unknown` (`statusWall.unknown`): "Unknown"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
