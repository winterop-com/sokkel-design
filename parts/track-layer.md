# Track layer

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Moving things on a map: each track a symbol for its kind turned to its heading, in its affiliation's color, ringed in the card color over a soft glow, its label beside it and its trail behind it fading into the past. A track with a speed and a heading keeps moving between reports and settles onto each new one; any other glides to where it is. The selected track is ringed in the selection color inside a halo that breathes, a new track appears in a ripple and a hostile one pulses. With motion reduced nothing moves but to where it was reported. Dense tracks may gather into counted clusters. The structured spec is [`track-layer.json`](track-layer.json).

Sources: sokkel-ui `packages/maps/src/TrackLayer.tsx`, `packages/maps/src/layer.ts (useRenderedPoints)`.

## Anatomy

| Piece | What it is |
|---|---|
| symbol | One per track, the size option square (24 by default), pointing north at a heading of 0 and turned clockwise by the heading with the map: a hull with a pointed bow for a vessel, a notched arrowhead for an aircraft, a box with a point on its front for a vehicle, a ring round a dot for a sensor (not turned), a body with a pointed nose between two solar panels for a satellite, a triangle for any other. Filled in the affiliation's color (or its band's) with a 1.25 halo in card. With scale on it is drawn at 0.72 of the size at zoom 3 and further out, the size at zoom 6 and 1.25 of it at zoom 11 and closer in, straight between; everything measured from the size below follows it. |
| glow | Under each symbol, a soft circle in the symbol's color fading from its middle, fainter on a light map and the more tracks there are, so a crowded map stays calm. |
| trail | The track's past positions, oldest first, as one 2 wide line that fades along its length from nothing at its oldest end to the color at its newest; then its head, a 2 wide line in the color on from the newest position to where the track is drawn, which moves with the track while the trail stays. With fade off, both are even. In the affiliation's color, or the band's for the first eight bands. |
| label | The track's label 0.75 of the drawn size plus 4 right of its point, centered on it: text.2xs on card at 80 percent, padded 4 across, rounded by radius-mini. A label that would cover another label or another track's symbol is left out, in the order the tracks are given; the selected track's never is, and is placed first. |
| ring | Under the symbol, a circle 0.75 of the size in radius: none at rest; a 1.25 line in foreground mixed 55 percent into card at 80 percent under the pointer; for the selected track a 2 line in map-selection over a fill of map-selection at 18 percent, and its label at 450 weight on card, ringed 1 in map-selection. |
| halo | Around the selected track, under its ring: a soft circle in map-selection that breathes, growing and fading over 3.2 seconds and back. Still, at its smallest, with motion reduced. |
| ripple | Where a track first appears after the layer's own start: a ring in its color spreading out and fading over 1.8 seconds, once. None with motion reduced, nor while the page is hidden. |
| pulse | Under each hostile track, below its glow: a soft circle in track-hostile that swells and fades every 3.6 seconds, fainter on a light map and the more tracks there are. None with motion reduced. |
| cluster | With cluster on, nearby tracks gather into a circle of their count: foreground mixed 78 percent into card, 12 across the radius under 10 tracks, 15 to 50, 18 to 150, 22 beyond, ringed 2 in card, or 3 in track-hostile when it holds a hostile track; the count in text.2xs at 450 in card, in tabular figures. A press zooms to where it falls apart. |

## Options

- `tracks`: Each track { id, position (lon, lat), heading?, speed? (meters a second), affiliation, kind, label?, trail?, band? }. The affiliation is friend, hostile, neutral, unknown or pending; the kind vessel, aircraft, vehicle, sensor, satellite or other.
- `trails`: Draws each track's trail.
- `labels`: Writes each track's label beside it.
- `size`: The symbol's size, square; its size at zoom 6 with scale on.
- `colors`: Colors for the affiliations in place of their tokens.
- `bands`: Colors by band, such as altitude bands: a track whose band is named is painted in the band's color in place of its affiliation's, its trail too for the first eight bands.
- `cluster`: Gathers nearby tracks into counted clusters; a radius (40) and the deepest zoom that clusters (10) may be given.
- `motion`: Moves each track that has a speed and a heading on along its heading at its speed between reports, frame by frame, for at most coast (60 seconds), and settles it onto each new report over blend (1 second), easing out: a track drawn behind its report catches up, one drawn to one side comes across, and one drawn ahead waits for its course to reach it, so it never moves back. Both times may be given. Off leaves every track where it was reported.
- `transition`: How long a track that is not moved on glides from where it was to where it is, in milliseconds, easing out; 0 moves it at once. A track turns the short way round.
- `effects`: The light and the scaling beyond the symbols, all on, all off, or each by name: glow, halo, ripple, pulse, fade (the trail fading along its length) and scale (the symbols scaling with the zoom).
- `visible`: Draws the layer.
- `interactive`: Tracks answer the pointer and presses; a press selects one as the map's selection.

## Sizes

- symbol: width `24`, height `24`. The size option, at zoom 6 with scale on; the shapes are drawn in a 48 square at twice the pixel.
- label: padX `4`, text `text.2xs`, radius `radius-mini`. 0.75 of the drawn size plus 4 right of the track's point.

## States

- rest: A track drawn, glowing.
- hover: The pointer is over the track: its ring shows.
- selected: The map's selected track: ringed and filled in the selection color inside its breathing halo, its label marked.
- appearing: A track new to the layer since its start: its ripple spreads and fades, once.
- coasting: A track with a speed and a heading between reports: drawn on along its heading, for at most coast, then stopped where it got to until its next report.

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
- `satellite` (`track.satellite`): "Satellite"
- `other` (`track.other`): "Other"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
