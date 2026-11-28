# Camera wall

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Cameras side by side, as a watch room shows them: each feed in a tile of the video's shape with its name, its state, how many things the finder sees in it and a critical ring on one that calls for a look; the focused camera first and two tiles across, so one feed is watched closely with the rest in view. The structured spec is [`camera-wall.json`](camera-wall.json).

Sources: sokkel-ui `packages/core/src/components/CameraWall.tsx`, `packages/core/src/components/Layout.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A grid of equal columns (parts' Columns, fill), as many as fit with no tile narrower than min, 8 apart, rows packed dense. |
| tile | 16:9, on terminal, rounded by radius-surface, its picture clipped to it, in terminal-foreground. With alert: ringed 2 wide in critical. Focused: first in the grid, and two columns wide and two rows tall once the wall is 42rem wide. |
| picture | The feed contained in the tile: the camera's src played muted and looping (playing on by default), its poster without one, or the app's picture. Offline: no picture, a camera-off icon 24 square in terminal-foreground at 50 percent in the middle. |
| state | At the top start, 8 in: a chip on terminal/70, padded 6 across and 2 down, rounded by radius-mini, at text.2xs 500: a dot 6 across (live good; recording critical, breathing; offline faint; connecting a spinner 12 square in its place) then the state's word. |
| detections | At the top end with more than none and not offline: a chip like the state's with an eye-scan icon 12 square and the count's phrase. |
| enlarge | With onFocusChange on a tile that draws the app's picture: an icon button (extra small) at the top end on terminal/70 with an enlarge or shrink icon, named by enlarge. |
| name | At the foot: the camera's name at text.xs 500, cut with an ellipsis, padded 8 across, 16 above and 6 below, on a fade from terminal/85 up to nothing. |

## Options

- `cameras`: Each camera: its id, name, state, and its src, poster or picture, with a detection count and alert.
- `focused`: The camera taken large.
- `onFocusChange`: Makes each tile a button that takes it large, or puts the large one back.
- `playing`: Whether the tiles' own videos play.
- `min` (`xs`, `sm`, `md`, `lg`): The narrowest a tile gets before a column goes: 7.5, 10, 14 or 18rem.

## Sizes

- container: gap `8`. 
- state: padX `6`, padY `2`, text `text.2xs`, radius `radius-mini`. 
- name: padX `8`, text `text.xs`. 

## States

- rest: Each camera's tile in its state.
- hover: The pointer over a tile that is a button: washed in terminal-foreground at 5 percent.
- focused: The camera taken large: first, two tiles across and two down where there is the room.
- alert: A camera that calls for a look: ringed in critical.
- focus: Keyboard focus on a tile's button: the focus ring inside its edge.

## Keyboard

- Tab: Reaches each tile's button in turn when the wall has onFocusChange.
- Enter (a tile's button has focus): Takes the tile large, or puts the large one back.

## Words

- `live` (`cameraWall.live`): "Live"
- `recording` (`cameraWall.recording`): "Recording"
- `offline` (`cameraWall.offline`): "Offline"
- `connecting` (`cameraWall.connecting`): "Connecting"
- `detections` (`cameraWall.detections`): "{'one': '{count} detection', 'other': '{count} detections'}"
- `enlarge` (`cameraWall.enlarge`): "Show {name} large"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
