# Detection overlay

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

What a finder sees in a video, drawn over the picture: each detection's box at the moment shown, with a tag saying what it is and how sure the finder was, in its affiliation's track color, moving with the video frame by frame. The app finds the detections and hands them in as samples; the overlay never looks at the picture. The structured spec is [`detection-overlay.json`](detection-overlay.json).

Sources: sokkel-ui `packages/core/src/components/DetectionOverlay.tsx`, `packages/core/src/lib/detections.ts`, `packages/core/src/components/media/video-picture.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A layer over the area the picture is drawn in (inside any bars a picture of another shape leaves), taking no presses itself; inside a video player it is the player's picture layer and kept in full screen. |
| mark | One per detection shown at the moment: its box in shares of the picture (x and w of its width, y and h of its height), drawn as its look says, in its color: track-<affiliation>, or primary without one. |
| box | With look box: the whole outline 2 wide, rounded by radius-mini. |
| brackets | With look brackets: only the four corners, each an L 12 long (no longer than half the box) and 2 wide, rounded by radius-mini at its corner. |
| marker | With look marker: a dot 10 across at the box's center, ringed 2 wide in terminal; the box is not drawn. |
| tag | At the box's top edge, outside above it (inside, at its top, when the box touches the picture's top): a dot 6 across in its color, then its label, its id with ids, and its confidence as a whole percent, 4 apart, at text.2xs 500 in terminal-foreground on terminal/80, padded 4 across, rounded by radius-mini. With look marker it stands centered under the dot. |
| trail | With trail: a line 2 wide through the centers it passed in that many seconds, ending at where it is, in its color at 60 percent, its ends and joins round. |

## Options

- `detections`: What was found: each with its id, label, affiliation and samples (a time in seconds, the box, a confidence).
- `time`: The moment drawn, in seconds of the video; inside a video player's picture it follows the video without it.
- `offset`: Seconds added to the time before the samples are read.
- `hold`: How long a box stays after its last sample, in seconds.
- `gap`: The longest gap between two samples a box glides across, in seconds; across a longer one it holds and then goes.
- `trail`: Seconds of each path drawn behind it; none at 0.
- `look` (`box`, `brackets`, `marker`): The whole outline; only its corners, which hide less of what is inside; or a dot, for a crowd.
- `ids`: Each tag also says the detection's id after its label.
- `format`: Writes a confidence; a whole percent by default.
- `selected`: The detection drawn as selected; the rest step back.
- `onSelect`: Makes each mark a button: a press selects it, and a press on the selected one lets it go.

## Sizes

- box: width `2`, radius `radius-mini`. 
- brackets: width `12`, height `12`, radius `radius-mini`. 
- marker: width `10`, height `10`. 
- tag: padX `4`, gap `4`, text `text.2xs`, radius `radius-mini`. 

## States

- rest: Each detection shown where it is at the moment.
- selected: The selected detection: its outline or corners 3 wide on a wash of its color at 15 percent, its dot 14 across ringed in its color at 50 percent; the rest step back to 45 percent, their trails to 25.
- focus: Keyboard focus on a mark: the focus ring around its box.

## Keyboard

- Tab: Reaches each mark in turn when they are buttons.
- Enter (a mark has focus): Selects the mark, or lets it go when it is the selected one.

## Words

- `detections` (`detectionOverlay.detections`): "Detections"
- `detection` (`detectionOverlay.detection`): "Detection"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
