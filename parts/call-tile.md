# Call tile

One person on a call: a 16:9 tile on the call's dark ground, their video filling it or their picture centered and sized to the tile, their name at its foot on a dark chip, with a struck microphone while muted and a hand while raised. Tiles sit in a grid on the call's picture, the call bar (parts/call-bar) floating over its foot. The structured spec is [`call-tile.json`](call-tile.json).

Sources: sokkel-ui `packages/core/src/components/CallTile.tsx`, `packages/core/src/components/PersonAvatar.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | The tile: 16:9, rounded by radius-surface, its content clipped to it, on terminal-foreground at 10 percent. |
| picture | Without video: the person's picture (or their initials on their color, as PersonAvatar draws them), round, centered, 16 percent of the tile's width (28 of its height), never under 64 nor over 160; the initials grow with it, from text.page to text.display. |
| video | With video (children): it fills the tile, cropped to it, in place of the picture. |
| name | At the tile's foot, 8 in from its start and its foot: the name on a dark chip, rounded by radius-control, padded 6 across, text.help, cut with an ellipsis before the tile's edge; a struck microphone (words.muted) while muted and a hand (words.handRaised) while raised before the name, 14 square, 4 apart. |

## Options

- `name`: The person's name, at the tile's foot and their picture's name.
- `image`: Their picture's address; without one, their initials on their color.
- `muted` (`false` by default): A struck microphone before the name.
- `handRaised` (`false` by default): A hand before the name.
- `children`: Their video, filling the tile in place of the picture.

## Sizes and layout

- picture: width `64`, height `64`. The least: 16 percent of the tile's width, never under 64 nor over 160 (clamp(4rem, 16cqw, 10rem)).
- name: padX `6`, gap `4`, icon `14`, text `text.help`, radius `radius-control`. 8 in from the tile's start and foot.
- pictureShare: `16`. The picture's width in percent of the tile's width, between 64 and 160.
- pictureMax: `160`. The picture never grows past this.
- nameInset: `8`. The name chip's distance from the tile's start and foot.

## Paints

- container at rest: ground `terminal-foreground/10`.
- name at rest: ground `terminal/70`, ink `terminal-foreground`, text `text.help`.

## Keyboard

None: a tile takes no focus.

## Words

- `muted` (`callTile.muted`): "Muted"
- `handRaised` (`callTile.handRaised`): "Hand raised"

## sokkel-ui only

- The picture is sized by a container query on the tile (16cqw), so it follows the tile's own width, never the window's.

## Where each renderer stands

- sokkel-egui: As of 5532f68: no call tile.
- sokkel-tui: As of b99664f its reports name no such part.
