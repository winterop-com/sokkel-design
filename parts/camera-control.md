# Camera control

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

The controls of a camera that turns and zooms: a pad of eight directions around a home button, a zoom in and out beside it, and the camera's presets under them. A direction or a zoom acts for as long as it is held. The structured spec is [`camera-control.json`](camera-control.json).

Sources: sokkel-ui `packages/core/src/components/CameraControl.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A column 12 apart: the pad and the zoom in a row 12 apart, then the presets. |
| pad | A grid of three by three icon buttons (parts' button, secondary, icon size) 4 apart on muted/60, padded 6, rounded by radius-surface: up and left, up, up and right; left, home (ghost), right; down and left, down, down and right, each an arrow pointing its way and named by its word. |
| zoom | With onZoom: a column of two icon buttons (secondary) 4 apart, zoom in over zoom out. |
| presets | With presets: a row of small buttons (outline; the one the camera stands at secondary) 4 apart, wrapping, each the preset's name. |

## Options

- `onMove`: Called with a direction (pan and tilt, each -1, 0 or 1) while one is held, and nothing once it is let go.
- `onZoom`: Called with 1 or -1 while a zoom is held, and 0 once it is let go.
- `onHome`: Called by the home button.
- `presets`: The places the camera keeps, each with its id and name.
- `preset`: The preset the camera stands at.
- `onPreset`: Called with a preset's id when it is pressed.
- `disabled`: Turns every control off.

## Sizes

- container: gap `12`. 
- pad: padX `6`, padY `6`, gap `4`, radius `radius-surface`. 

## States

- rest: Every control ready.
- held: A direction or a zoom held: the camera told to turn or zoom until it is let go.
- disabled: Every control off.
- focus: Keyboard focus on the pad or a button: the focus ring.

## Keyboard

- Tab: Reaches the pad, the home button, the zoom and each preset in turn.
- ArrowUp, ArrowDown, ArrowLeft, ArrowRight (the pad has focus): Turns the camera that way while held, and stops it when let go.

## Words

- `pad` (`cameraControl.pad`): "Pan and tilt"
- `up` (`cameraControl.up`): "Tilt up"
- `down` (`cameraControl.down`): "Tilt down"
- `left` (`cameraControl.left`): "Pan left"
- `right` (`cameraControl.right`): "Pan right"
- `upLeft` (`cameraControl.upLeft`): "Up and left"
- `upRight` (`cameraControl.upRight`): "Up and right"
- `downLeft` (`cameraControl.downLeft`): "Down and left"
- `downRight` (`cameraControl.downRight`): "Down and right"
- `home` (`cameraControl.home`): "Home"
- `zoomIn` (`cameraControl.zoomIn`): "Zoom in"
- `zoomOut` (`cameraControl.zoomOut`): "Zoom out"
- `presets` (`cameraControl.presets`): "Presets"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
