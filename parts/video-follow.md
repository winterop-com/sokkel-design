# Video follow

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Keeps a video's view on one detection, as map-follow keeps a map on one track: the player comes in on the part of the picture around it and moves with it, and a banner in a corner says what is followed, or that the finder has lost it, with a button that lets it go. The structured spec is [`video-follow.json`](video-follow.json).

Sources: sokkel-ui `packages/core/src/components/VideoFollow.tsx`, `packages/core/src/components/media/video-picture.tsx`, `packages/core/src/components/media/VideoPlayer.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | The banner, in the player's top corner over the picture: a row 6 apart, padded 8 at its start, 2 at its end and 2 down, on terminal/80 with a blur behind, rounded by radius-control, in terminal-foreground at text.xs. |
| mark | A crosshair 14 square in the detection's color (track-<affiliation>, or primary without one), at half strength while it is lost. |
| name | Following and its name (its label and id, or its id alone) at 500, cut with an ellipsis; Lost and its name while the finder has lost it. |
| release | An icon button (extra small) with an X that lets it go, named by its word. |
| view | The picture, with what the picture layer draws, scaled about its corner so the region around the detection fills the player: room times the detection's larger side, never less than a fifth of the picture or more than all of it, centered on the detection and kept inside the picture; the picture never leaves bare an edge of the player it covered. Each step is eased. Let go, the whole picture again. |

## Options

- `detection`: The detection followed: its id, label, affiliation and samples, as detection-overlay takes them.
- `onRelease`: Called when the viewer lets it go by the banner's button.
- `room`: How many of the detection's own sizes the view holds around it.
- `time`: The moment followed; inside a video player it follows the video without it.
- `offset`: Seconds added to the time before the samples are read.
- `hold`: How long it counts as seen after its last sample, in seconds.
- `gap`: The longest gap between two samples it glides across, in seconds.

## Sizes

- container: padX `8`, gap `6`, text `text.xs`, radius `radius-control`. 
- mark: width `14`, height `14`. 

## States

- rest: Following: the view on the detection, the banner naming it.
- lost: The finder has lost it: the view held where it was last seen, the banner saying Lost, its mark at half strength.
- focus: Keyboard focus on the release button: the focus ring around it.

## Keyboard

- Tab: Reaches the release button.
- Enter (the release button has focus): Lets it go.

## Words

- `following` (`videoFollow.following`): "Following {name}"
- `lost` (`videoFollow.lost`): "Lost {name}"
- `release` (`videoFollow.release`): "Stop following"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
