# Detection gallery

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Each time something was seen, as a tile: a square crop of its frame around what was found, how sure the finder was, and what it is, where and when; a short preview while the pointer rests on it, and a press that takes the player there. The structured spec is [`detection-gallery.json`](detection-gallery.json).

Sources: sokkel-ui `packages/core/src/components/DetectionGallery.tsx`, `packages/core/src/lib/detections.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A grid of equal columns (parts' Columns, fill), as many as fit with no tile narrower than min, 8 apart. |
| tile | A column 6 apart, padded 4, rounded by radius-surface: the crop, then the name line, then the place line. |
| crop | Square, on terminal, rounded by radius-control: the frame scaled and placed so the square around the box (1.4 times its larger side, centered on it, kept inside the frame) fills it; the whole image without a box. With alert: ringed 2 wide in critical. |
| confidence | Over the crop's top end, 4 in: the confidence at text.2xs 500 in terminal-foreground on terminal/75, padded 4 across, rounded by radius-mini. |
| preview | With a preview: its clip over the crop, covering it, shown and played muted while the pointer rests on the tile. |
| name | A dot 6 across in its affiliation's track color (primary without one), then the label (or the id) at text.xs 500, cut with an ellipsis. |
| place | The place and the time apart by a middle dot, at text.2xs in muted-foreground, cut with an ellipsis. |

## Options

- `sightings`: Each sighting: its id, label, affiliation, place, time, frame and box, confidence, preview and alert.
- `selected`: The sighting drawn as chosen.
- `onSelect`: Makes each tile a button that picks its sighting.
- `format`: Writes a confidence; a whole percent by default.
- `min` (`xs`, `sm`, `md`): The narrowest a tile gets: 7.5, 10 or 14rem.

## Sizes

- container: gap `8`. 
- tile: padX `4`, padY `4`, gap `6`, radius `radius-surface`. 
- name: text `text.xs`. 

## States

- rest: Each sighting's tile.
- hover: The pointer over a tile: washed when it is a button, and its preview playing.
- selected: The sighting chosen: on primary at 10 percent, ringed 1 wide in primary.
- alert: A sighting that calls for a look: its crop ringed in critical.
- focus: Keyboard focus on a tile: the focus ring around it.

## Keyboard

- Tab: Reaches each tile in turn when the gallery picks.
- Enter (a tile has focus): Picks the tile's sighting.

## Words

- `open` (`detectionGallery.open`): "Go to {name} at {when}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
