# Track layer

Moving things on a map: each track a symbol for its kind turned to its heading, in its affiliation's color, ringed in the card color, its label beside it and its trail behind it fading into the past. The selected track is ringed in the selection color. New positions glide in from where each track was. Dense tracks may gather into counted clusters. The structured spec is [`track-layer.json`](track-layer.json).

Sources: sokkel-ui `packages/maps/src/TrackLayer.tsx`, `packages/maps/src/layer.ts (useRenderedPoints)`.

## Anatomy

| Piece | What it is |
|---|---|
| symbol | One per track, the size option square (24 by default), pointing north at a heading of 0 and turned clockwise by the heading with the map: a hull with a pointed bow for a vessel, a notched arrowhead for an aircraft, a box with a point on its front for a vehicle, a ring round a dot for a sensor (not turned), a triangle for any other. Filled in the affiliation's color with a 1.25 halo in card. |
| trail | The track's past positions, oldest first, ending where it is now, as a 2 wide line in the affiliation's color, cut into one piece per step; each piece at 0.85 of full times its share of the way from the oldest to the newest raised to 1.5, so the oldest step all but vanishes. |
| label | The track's label 0.75 of the size plus 4 right of its point, centered on it: text.2xs on card at 80 percent, padded 4 across, rounded by radius-mini. A label that would cover another label or another track's symbol is left out; the selected track's never is, and is placed first. |
| ring | Under the symbol, a circle 0.75 of the size in radius: none at rest; a 1.25 line in foreground mixed 55 percent into card at 80 percent under the pointer; for the selected track a 2 line in map-selection over a fill of map-selection at 18 percent, and its label at 500 weight on card, ringed 1 in map-selection. |
| cluster | With cluster on, nearby tracks gather into a circle of their count: foreground mixed 78 percent into card, 12 across the radius under 10 tracks, 15 to 50, 18 to 150, 22 beyond, ringed 2 in card, or 3 in track-hostile when it holds a hostile track; the count in text.2xs at 500 in card, in tabular figures. A press zooms to where it falls apart. |

## Options

- `tracks`: Each track { id, position (lon, lat), heading?, affiliation, kind, label?, trail? }. The affiliation is friend, hostile, neutral, unknown or pending; the kind vessel, aircraft, vehicle, sensor or other.
- `trails`: Draws each track's trail.
- `labels`: Writes each track's label beside it.
- `size`: The symbol's size, square.
- `colors`: Colors for the affiliations in place of their tokens.
- `cluster`: Gathers nearby tracks into counted clusters; a radius (40) and the deepest zoom that clusters (10) may be given.
- `transition`: How long a track glides from where it was to where it is, in milliseconds, easing out; 0 moves it at once. A track turns the short way round.
- `visible`: Draws the layer.
- `interactive`: Tracks answer the pointer and presses; a press selects one as the map's selection.

## Sizes

- symbol: width `24`, height `24`. The size option; the shapes are drawn in a 48 square at twice the pixel.
- label: padX `4`, text `text.2xs`, radius `radius-mini`. 0.75 of the size plus 4 right of the track's point.

## Words

- `friend` (`track.friend`): "Friend"
- `hostile` (`track.hostile`): "Hostile"
- `neutral` (`track.neutral`): "Neutral"
- `unknown` (`track.unknown`): "Unknown"
- `pending` (`track.pending`): "Pending"
- `vessel` (`track.vessel`): "Vessel"
- `aircraft` (`track.aircraft`): "Aircraft"
- `vehicle` (`track.vehicle`): "Vehicle"
- `sensor` (`track.sensor`): "Sensor"
- `other` (`track.other`): "Other"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
