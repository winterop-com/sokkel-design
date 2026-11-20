# Map follow

Keeps a map centered on one moving thing, such as the selected track, while it is drawn: each new position is eased to and the camera is held, and a banner in a corner says what is followed, with a button that lets it go. Dragging the map lets it go too. The structured spec is [`map-follow.json`](map-follow.json).

Sources: sokkel-ui `packages/maps/src/MapFollow.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| banner | A chip in its corner, the top left by default: card at 95 percent, padded 8 before and 2 after, 2 down, rounded by radius-control, with the surface's elevation and a 1 ring in map-selection; a crosshair icon 14 square in map-selection, then words.following with the name in text.xs at 500, cut with an ellipsis, then an icon button (words.release, a cross) control-xs square, 6 apart. |

## Options

- `position`: Where the followed thing is now: longitude, latitude.
- `name`: What is followed, as the banner names it.
- `onRelease`: Called when the reader lets it go, by the button or by dragging the map.
- `zoom`: The zoom it goes to when it starts, unless the map is in closer already.
- `duration`: How long each step after the followed thing takes, easing out, as a track layer's transition does.
- `corner` (`top-left`, `top-right`, `bottom-left`, `bottom-right`): Where the banner stands.

## Sizes

- banner: padX `8`, padY `2`, gap `6`, icon `14`, text `text.badge`, radius `radius-control`. 

## States

- rest: The map follows.

## Words

- `following` (`mapFollow.following`): "Following {name}"
- `release` (`mapFollow.release`): "Stop following"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
