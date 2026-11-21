# Track glyph

What a tracked thing is, as a map draws it: its kind's shape filled in its affiliation's color and turned to its heading, so a list, a card and a task's line show a track as the map does. The structured spec is [`track-glyph.json`](track-glyph.json).

Sources: sokkel-ui `packages/core/src/components/TrackGlyph.tsx`, `packages/core/src/lib/tracks.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A square, 48 units on a side in its own space, drawn at its size; nothing else. |
| shape | The kind's outline pointing north (vessel: a hull with a pointed bow; aircraft: an arrowhead with a notched tail; vehicle: a box with a point on its front; satellite: a body 10 wide with a pointed nose, between two solar panels 12 wide and 16 tall, each on an arm 5 long and 4 thick; other: a triangle), filled; a sensor is a ring 5 wide of radius 14 around a dot of radius 4.5, and never turns. |
| heading | With heading: the shape turned that many degrees clockwise from north about its center. |

## Options

- `kind` (`vessel`, `aircraft`, `vehicle`, `sensor`, `satellite`, `other`): Which shape.
- `affiliation` (`friend`, `hostile`, `neutral`, `unknown`, `pending`): Fills it in track-<affiliation>; the ink around it without one.
- `heading`: Degrees from north it points.
- `size` (`sm`, `md`, `lg`): 14, 16 or 20 square.
- `label`: Names it as an image; true names it by its affiliation and kind (Hostile vessel). Without it, it is decoration.

## Sizes

- sm: width `14`, height `14`. 
- md: width `16`, height `16`. 
- lg: width `20`, height `20`. 

## States

- rest: Drawn.

## Words

- `friend` (`trackNames.friend`): "Friend"
- `hostile` (`trackNames.hostile`): "Hostile"
- `neutral` (`trackNames.neutral`): "Neutral"
- `unknown` (`trackNames.unknown`): "Unknown"
- `pending` (`trackNames.pending`): "Pending"
- `vessel` (`trackNames.vessel`): "Vessel"
- `aircraft` (`trackNames.aircraft`): "Aircraft"
- `vehicle` (`trackNames.vehicle`): "Vehicle"
- `sensor` (`trackNames.sensor`): "Sensor"
- `satellite` (`trackNames.satellite`): "Satellite"
- `other` (`trackNames.other`): "Other"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
