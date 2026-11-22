# Link layer

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Lines between two positions, each in its tone over a casing in the card color: straight on the map or along the great circle, solid or dashed, and with measure a chip midway saying the distance and the bearing from where it starts, as the ruler's does. The link under the pointer thickens; the selected one is drawn in the selection color. Hundreds of links stay cheap. With arc the links curve off the line between their ends; with flow, light runs along each from its start to its end, faster, more often and brighter the busier the link. The structured spec is [`link-layer.json`](link-layer.json).

Sources: sokkel-ui `packages/maps/src/LinkLayer.tsx`, `packages/maps/src/geodesy.ts (greatCircle, rhumbBearing, rhumbDistance, rhumbMiddle)`, `packages/maps/src/tone.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| line | From one end to the other: along the great circle, or straight on the map (the rhumb line); the width (1.5) in the tone, wider under the pointer and wider still selected in map-selection, dashed when dashed, round-capped, over a casing 2.5 wider in card at 80 percent. |
| chip | Over the link's middle (along the great circle, or halfway along the straight line on the map), 8 above it: words.measured with the distance and the bearing, as the ruler's chip: text.xs at 450 in tabular figures on card, padded 6 across and 2 down, rounded by radius-control, with the surface's elevation and a 1 ring of foreground at 10 percent. A chip that would cover another is left out; the selected link's never is, and is placed first. Only chips whose middle is in view are written. |
| arc | With arc, each link lifted off the line between its ends into an arc, highest at the middle and none at the ends, rising to the north side of the line, or to its west where the line runs due north or south. A measure is written at the arc's middle. |
| flow | With flow, light runs along each link from its start to its end in the tone (lighter at its head in the dark scheme): more at once, faster and brighter the higher the link's rate, each link starting at its own point drawn from its id. The other lines step back, with their casing, except the link under the pointer and the selected one. It holds still where motion is reduced (the look's motion setting, else the system's), and stops while the map is out of sight: the document hidden, or the map's element off the screen. |

## Options

- `links`: Each link { id, from, to, tone?, path?, dashed?, measure?, rate? }: the rate how busy it is, from 0 to 1 (0.5 unless given), which the flow reads. Plain unless given. The tone is friend, hostile, neutral, unknown or pending, drawn in that track affiliation's token (track-friend and the rest), or plain, drawn in muted-foreground.
- `path` (`straight`, `great-circle`): How each link runs unless the link says.
- `dashed`: Dashes each link unless the link says.
- `measure`: Shows each link's distance and bearing midway unless the link says.
- `unit` (`km`, `mi`, `nmi`): The unit a measure's distance is written in; whole meters under a kilometer.
- `width`: The width of a link.
- `colors`: Colors for the tones in place of their tokens.
- `opacity`: How opaque the whole layer is.
- `visible`: Draws the layer.
- `interactive`: Links answer the pointer and presses; a press selects one as the map's selection.
- `arc`: Lifts each link into an arc rising this share of its length on the map at the middle; true is 0.2, false or 0 a plain line.
- `flow`: Light running along each link from its start to its end, by its rate.

## Sizes

- chip: padX `6`, padY `2`, text `text.badge`, radius `radius-control`. 

## States

- rest: A link drawn.
- hover: The pointer is over the link: it thickens.
- selected: The map's selected link: drawn in the selection color, its chip placed first.
- flowing: Comets running along each link.
- still: The comets held where they stand 1.2 seconds in.

## Words

- `measured` (`link.measured`): "{distance} · {bearing}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
