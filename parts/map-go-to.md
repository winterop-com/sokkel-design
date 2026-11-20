# Map go to

A small field over a map that takes a position as latitude, longitude (decimal degrees, with or without hemisphere letters) and flies there on Enter, holding the camera from then on. What does not read as a position is marked and said under the field. The structured spec is [`map-go-to.json`](map-go-to.json).

Sources: sokkel-ui `packages/maps/src/MapGoTo.tsx`, `packages/maps/src/geodesy.ts (parseCoordinates)`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A card in its corner, the top left by default: 224 wide at most, card at 95 percent, padded 4, rounded by radius-surface, with the surface's elevation and a 1 ring of foreground at 10 percent. |
| field | A text field (parts/text-field's input) in tabular figures, words.placeholder while empty, beside a ghost icon button (words.go, a return arrow), 4 apart. |
| issue | Under the field while what it holds is not a position: words.invalid in text.help in critical-ink, padded 4 across and 4 above; the field takes its invalid edge. |

## Options

- `corner` (`top-left`, `top-right`, `bottom-left`, `bottom-right`): Where it stands.
- `zoom`: The zoom it flies to, unless the map is in closer already.
- `onGo`: Called with each position it goes to.
- `parse`: Reads what is written into a position in place of latitude, longitude, such as an MGRS reference through the tracking add-on's parseMgrs; nothing for text that is no position.

## Sizes

- container: width `224`, padX `4`, padY `4`, gap `4`, radius `radius-surface`. 

## States

- rest: The field, empty or holding a position.
- invalid: What it holds is not a position: marked and said.

## Keyboard

- Enter (the field has focus): Flies to the position, or marks the field when it is not one.

## Words

- `label` (`mapGoTo.label`): "Go to coordinates"
- `placeholder` (`mapGoTo.placeholder`): "Lat, lon"
- `go` (`mapGoTo.go`): "Go"
- `invalid` (`mapGoTo.invalid`): "Write a position as latitude, longitude."

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
