# Coverage layer

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

What sensors cover, under the tracks: each cone a wedge from where its sensor stands, turned to its bearing and opened to its width (360 a whole disc), in its tone, fading out with distance to its range, inside a faint edge; and range rings, dashed circles at given distances round a position, each written with its distance. It answers no pointer. With sweep, a radar's beam turns round each cone: a bright leading edge with a phosphor glow fading behind it, once each period. The structured spec is [`coverage-layer.json`](coverage-layer.json).

Sources: sokkel-ui `packages/maps/src/CoverageLayer.tsx`, `packages/maps/src/geodesy.ts (arc, destination)`, `packages/maps/src/tone.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| cone | Bands from the sensor out, each a wedge along the great circle in the tone, faint and fading with distance so the far end all but vanishes. |
| edge | Round the wedge from the sensor and back, or round the disc: 1 wide in the tone at 0.55 of full. |
| ring | A circle at each distance, 1 wide in the tone at 0.7 of full, dashed 2 on 2. |
| distance | Each ring's distance, written where its label bearing (north unless given) meets it, centered: text.2xs in muted-foreground in tabular figures on card at 80 percent, padded 4 across, rounded by radius-mini; in the unit with no more figures than it has (20 km, 2.5 NM), whole meters under a kilometer. |
| sweep | With sweep, over the cones: a beam standing on a line from the sensor to its range, turning clockwise once each period (4000 ms), round a disc from north, or across a sector from one edge to the other and on until its trail has left (the turn is the width and the trail), each cone starting at its own point of the turn, drawn from its id. Its leading edge is bright in the tone (lighter in the dark scheme), with a glow fading behind it over the trail (90 degrees), both dimmer toward the range. It holds still where motion is reduced (the look's motion setting, else the system's), and stops while the map is out of sight: the document hidden, or the map's element off the screen. Held still, the beam stands three tenths of the way round its turn. |

## Options

- `cones`: Each cone { id, position, range, bearing?, width?, tone? }: the range in meters, the bearing in degrees from north (0), the width in degrees (360). Plain unless given. The tone is friend, hostile, neutral, unknown or pending, drawn in that track affiliation's token (track-friend and the rest), or plain, drawn in muted-foreground.
- `rings`: Each set of rings { id, position, distances, tone?, labelBearing? }: the distances in meters, the label bearing in degrees from north (0).
- `bands`: How many bands a cone fades out over.
- `unit` (`km`, `mi`, `nmi`): The unit the rings' distances are written in; meters below a kilometer.
- `labels`: Writes each ring's distance on it.
- `colors`: Colors for the tones in place of their tokens.
- `opacity`: How opaque the whole layer is.
- `visible`: Draws the layer.
- `sweep`: A radar's beam turning round each cone: true, or { period?, trail? }, the period in milliseconds (4000) and the trail in degrees (90). Off unless given.

## Sizes

- distance: padX `4`, text `text.2xs`, radius `radius-mini`. Centered on the ring.

## States

- rest: The cones and rings drawn.
- sweeping: The beam turning round each cone.
- still: The beam held three tenths of the way round its turn.

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
