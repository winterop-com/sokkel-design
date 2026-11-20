# Link layer

Lines between two positions, each in its tone over a casing in the card color: straight on the map or along the great circle, solid or dashed, and with measure a chip midway saying the distance and the bearing from where it starts, as the ruler's does. The link under the pointer thickens; the selected one is drawn in the selection color. Hundreds of links stay cheap. The structured spec is [`link-layer.json`](link-layer.json).

Sources: sokkel-ui `packages/maps/src/LinkLayer.tsx`, `packages/maps/src/geodesy.ts (greatCircle, rhumbBearing, rhumbDistance, rhumbMiddle)`, `packages/maps/src/tone.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| line | From one end to the other: along the great circle in steps of at most 50 km (64 at most), or straight on the map (the rhumb line); the width (1.5) in the tone, 0.75 more under the pointer and 1 more selected in map-selection, dashed 3 on 2 when dashed, round-capped, over a casing 2.5 wider in card at 80 percent. |
| chip | Over the link's middle (along the great circle, or halfway along the straight line on the map), 8 above it: words.measured with the distance and the bearing, as the ruler's chip: text.xs at 500 in tabular figures on card, padded 6 across and 2 down, rounded by radius-control, with the surface's elevation and a 1 ring of foreground at 10 percent. A chip that would cover another, or a track's label (parts/track-layer) or a zone's label (parts/zone-layer) on the same map, is left out; the selected link's never is, and is placed first. Only chips whose middle is in view are written. |

## Options

- `links`: Each link { id, from, to, tone?, path?, dashed?, measure? }. Plain unless given. The tone is friend, hostile, neutral, unknown or pending, drawn in that track affiliation's token (track-friend and the rest), or plain, drawn in muted-foreground.
- `path` (`straight`, `great-circle`): How each link runs unless the link says.
- `dashed`: Dashes each link unless the link says.
- `measure`: Shows each link's distance and bearing midway unless the link says.
- `unit` (`km`, `mi`, `nmi`): The unit a measure's distance is written in; whole meters under a kilometer.
- `width`: The width of a link.
- `colors`: Colors for the tones in place of their tokens.
- `opacity`: How opaque the whole layer is.
- `visible`: Draws the layer.
- `interactive`: Links answer the pointer and presses; a press selects one as the map's selection.

## Sizes

- chip: padX `6`, padY `2`, text `text.badge`, radius `radius-control`. 

## States

- rest: A link drawn.
- hover: The pointer is over the link: it thickens.
- selected: The map's selected link: drawn in the selection color, its chip placed first.

## Words

- `measured` (`link.measured`): "{distance} · {bearing}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
