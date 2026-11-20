# Map compass

A compass among a map's buttons: its needle points north as the map is turned, and a press turns the map back to north. A map turns only when it is made with rotate; without it the needle stays up. The structured spec is [`map-compass.json`](map-compass.json).

Sources: sokkel-ui `packages/maps/src/MapCompass.tsx`, `packages/maps/src/control.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| button | One of the map's buttons (control-sm square, outline, card ground), in a corner, the top right under the map's own by default, its tooltip opening away from the corner. |
| needle | An arrow filled and stroked in critical, turned against the map's bearing so it points north. |

## Options

- `corner` (`top-left`, `top-right`, `bottom-left`, `bottom-right`): Where it stands.

## Sizes

- button: height `density.control-sm`, width `density.control-sm`, radius `radius-control`. 

## Keyboard

- Enter, Space (the button has focus): Turns the map back to north.

## Words

- `resetNorth` (`mapCompass.resetNorth`): "Reset to north (bearing {bearing})"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
