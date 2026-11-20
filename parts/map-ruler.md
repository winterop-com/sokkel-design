# Map ruler

A ruler over a map: while it is on, a press sets its first point, the line follows the pointer to where a second press sets the other, and a chip at the line's middle says the distance along the great circle and the bearing from the first point. Its button stands among the map's own. The structured spec is [`map-ruler.json`](map-ruler.json).

Sources: sokkel-ui `packages/maps/src/MapRuler.tsx`, `packages/maps/src/control.tsx`, `packages/maps/src/geodesy.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| button | One of the map's buttons (control-sm square, outline, card ground, a ruler icon), in a corner, the top right under the map's own by default; pressed while the ruler is on: an accent ground and a primary edge. Its tooltip opens away from its corner. |
| line | The great circle between the points, 48 steps, drawn 1.75 wide in foreground, dashed 3 on 2, over a 4 wide casing in card at 80 percent; each end a dot 3.5 in radius in foreground ringed 1.5 in card. |
| chip | Over the line's middle, 8 above it: words.measured with the distance and the bearing, text.xs at 500 in tabular figures on card, padded 6 across and 2 down, rounded by radius-control, with the surface's elevation and a 1 ring of foreground at 10 percent. |

## Options

- `active`: Whether the ruler is on, when the app holds it.
- `defaultActive`: Whether it opens on.
- `defaultPoints`: Two points it opens measuring between.
- `unit` (`km`, `mi`, `nmi`): The unit the distance is written in; whole meters under a kilometer.
- `corner` (`top-left`, `top-right`, `bottom-left`, `bottom-right`): Where its button stands.
- `button`: Draws its button; off for an app that turns it on from its own toolbar.
- `onMeasure`: Called with each finished measurement, and with nothing when it is cleared.

## Sizes

- button: height `density.control-sm`, width `density.control-sm`, radius `radius-control`. 
- chip: padX `6`, padY `2`, text `text.xs`, radius `radius-control`. 

## Keyboard

- Escape (the ruler is on and the map has focus): Clears the measurement; with nothing measured, turns the ruler off.

## Words

- `measure` (`mapRuler.measure`): "Measure a distance"
- `measured` (`mapRuler.measured`): "{distance} · {bearing}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
