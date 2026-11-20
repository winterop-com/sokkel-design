# Map coordinates

Where the pointer is on a map, latitude first with each hemisphere's letter, or Offscreen while it is off the map, after a scale bar of a round length that follows the zoom. It stands in a corner, the bottom left by default. The structured spec is [`map-coordinates.json`](map-coordinates.json).

Sources: sokkel-ui `packages/maps/src/MapCoordinates.tsx`, `packages/maps/src/geodesy.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A chip in its corner: card at 95 percent, padded 8 across and 4 down, rounded by radius-control, with the surface's elevation and a 1 ring of foreground at 10 percent, its parts 12 apart, text.xs in tabular figures. |
| scale | The round length (1, 2 or 5 times a power of ten) that fits in 96: its words in text.2xs in muted-foreground over a bar that wide, a 1 line in foreground at 70 percent with its two ends turned up 4. |
| position | The pointer's position, `60.3913° N, 5.3221° E` to four places, or degrees, minutes and seconds; words.offscreen in muted-foreground while the pointer is off the map. At least 176 wide, so it does not jump as the figures change. |

## Options

- `corner` (`top-left`, `top-right`, `bottom-left`, `bottom-right`): Where it stands.
- `format` (`decimal`, `dms`): Decimal degrees, or degrees, minutes and seconds.
- `scale`: Draws the scale bar.
- `unit` (`km`, `mi`, `nmi`): The scale bar's unit; meters below a kilometer.
- `formatPosition`: Writes the cursor's position in place of format, for a reference system the map does not know, such as MGRS from the tracking add-on's toMgrs.

## Sizes

- container: padX `8`, padY `4`, gap `12`, text `text.xs`, radius `radius-control`. 

## States

- rest: The pointer is on the map: its position.
- offscreen: The pointer is off the map: words.offscreen.

## Words

- `label` (`mapCoordinates.label`): "Cursor position"
- `offscreen` (`mapCoordinates.offscreen`): "Offscreen"
- `north` (`mapCoordinates.north`): "N"
- `south` (`mapCoordinates.south`): "S"
- `east` (`mapCoordinates.east`): "E"
- `west` (`mapCoordinates.west`): "W"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
