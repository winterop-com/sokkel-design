# Picture zones

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

The parts of a picture a finder watches, drawn over it: regions as tinted shapes and tripwires as lines, each in its tone and named; a viewer picks one, reshapes it by its corners, or draws a new one point by point. The structured spec is [`picture-zones.json`](picture-zones.json).

Sources: sokkel-ui `packages/core/src/components/PictureZones.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A layer over the picture, taking no presses itself; inside a video player's picture it moves with the view. |
| region | A closed shape through its points (in shares of the picture), filled in its tone at 12 percent and stroked 2 wide in it; picked, filled at 25 percent and stroked 3 wide. |
| line | A line through its points, 2 wide in its tone, dashed 6 on and 4 off; picked, solid and 3 wide. |
| name | The zone's name over its first point, 4 above it: text.2xs 500 in terminal-foreground on terminal/80, padded 4 across, rounded by radius-mini. |
| handle | With onChange, on each corner of the picked zone: a dot 12 across in terminal-foreground ringed 2 wide in terminal, centered on the corner. |
| draw | With draw: a layer over the whole picture taking presses, a crosshair pointer, the hint at its bottom start (as the name's chip), each point added a dot 8 across in primary, and the path so far dashed 4 on and 3 off in primary. |

## Options

- `zones`: Each zone: its id, name, kind (region or line), points and tone.
- `selected`: The zone picked.
- `onSelect`: Makes each zone pressable: a press picks it, or lets the picked one go.
- `onChange`: Makes the picked zone's corners handles to drag or move with the arrow keys.
- `draw` (`region`, `line`): Draws a new zone of this kind, point by point.
- `onDrawn`: Called with a drawn zone's points once it has enough: three for a region, two for a line.
- `onDrawCancel`: Called when drawing is given up.

## Sizes

- handle: width `12`, height `12`. 
- name: padX `4`, text `text.2xs`, radius `radius-mini`. 

## States

- rest: Each zone in its tone.
- selected: The zone picked: heavier, its handles shown with onChange.
- drawing: A new zone being drawn: presses add points.
- focus: Keyboard focus on a handle or the drawing layer: the focus ring.

## Keyboard

- Tab: Reaches each handle of the picked zone in turn, or the drawing layer.
- ArrowLeft, ArrowRight, ArrowUp, ArrowDown (a handle has focus): Moves the corner a hundredth of the picture; with Shift, five.
- Enter (drawing): Finishes the zone being drawn.
- Escape (drawing): Gives up the zone being drawn.

## Words

- `zones` (`pictureZones.zones`): "Zones"
- `point` (`pictureZones.point`): "Point {place} of {zone}"
- `drawing` (`pictureZones.drawing`): "Click to add points, then press Enter to finish"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
