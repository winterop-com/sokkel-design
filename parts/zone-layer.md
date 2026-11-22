# Zone layer

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Areas on a map, each in its tone: its inside a light wash of the tone, diagonal lines in it or nothing, inside a solid or a dashed edge, and its label written at its middle. The zone under the pointer deepens; the selected zone is edged in the selection color. With glow, a soft blurred line in each zone's tone stands just outside its edge. The structured spec is [`zone-layer.json`](zone-layer.json).

Sources: sokkel-ui `packages/maps/src/ZoneLayer.tsx`, `packages/maps/src/tone.ts`, `packages/maps/src/layer.ts (placeClear)`.

## Anatomy

| Piece | What it is |
|---|---|
| fill | solid: the tone at 0.18 of full, 0.24 under the pointer, 0.3 selected. hatched: diagonal lines in the tone, 1 wide every 6, rising to the right, on nothing, at 0.7 of full, 0.95 under the pointer, full selected. none: nothing, though the inside still answers the pointer. |
| edge | Round the zone and its holes, 1.5 wide in the tone, 2 under the pointer, 2.5 selected in map-selection over a 5 wide halo in card; dashed 3 on 2 when the edge is dashed. |
| label | The zone's label at the middle of its area (of its largest part's), centered on it: text.2xs at 450 on card at 80 percent, padded 4 across, rounded by radius-mini. A label that would cover another zone's is left out; the selected zone's never is, and is placed first, on card, ringed 1 in map-selection. |
| glow | With glow, under the edge: a soft blurred line round the zone just outside it, in the tone. Not animated. |

## Options

- `zones`: Each zone { id, area, tone?, fill?, edge?, label? }: the area an outline of positions (longitude, latitude) or a polygon or multipolygon, holes included. Plain unless given. The tone is friend, hostile, neutral, unknown or pending, drawn in that track affiliation's token (track-friend and the rest), or plain, drawn in muted-foreground.
- `fill` (`solid`, `hatched`, `none`): How each zone's inside is drawn unless the zone says.
- `edge` (`solid`, `dashed`): How each zone's edge is drawn unless the zone says.
- `labels`: Writes each zone's label at its middle.
- `colors`: Colors for the tones in place of their tokens.
- `opacity`: How opaque the whole layer is.
- `visible`: Draws the layer.
- `interactive`: Zones answer the pointer and presses; a press selects one as the map's selection.
- `glow`: A soft glow in each zone's tone just outside its edge.

## Sizes

- label: padX `4`, radius `radius-mini`. Centered on the zone's middle; text.2xs at 450, as its paint says.

## States

- rest: A zone drawn.
- hover: The pointer is over the zone: its inside deepens and its edge thickens.
- selected: The map's selected zone: edged in the selection color over a halo, its label marked.

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
