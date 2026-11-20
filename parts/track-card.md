# Track card

One tracked thing, densely: its glyph, name and id, its freshness at the head's end, and under them its affiliation as a chip (a menu of the affiliations when it can be changed), the states it is in as chips, and a quiet line of what it is doing. A thumbnail may lead it. Framed it is a card; unframed, a list's row. The structured spec is [`track-card.json`](track-card.json).

Sources: sokkel-ui `packages/core/src/components/TrackCard.tsx`, `packages/core/src/components/TrackGlyph.tsx`, `packages/core/src/components/Freshness.tsx`, `packages/core/src/components/Chip.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A row 10 apart: the thumbnail, then a column of two lines 4 apart. Framed: on card with a border edge, rounded by radius-surface, padded 10, in card-foreground. |
| thumbnail | With thumbnail: 40 square, rounded by radius-control, on muted, its picture covering it. |
| head | The glyph (parts/track-glyph, md, named), the name at 500 cut with an ellipsis, the id in the code face at text.help in muted-foreground giving way first, 8 apart; the freshness (parts/freshness) at the line's end. |
| chips | The affiliation as a chip with a dot in its color (parts/chip), a menu of the five affiliations with onAffiliationChange; each state an outline chip, or in its tone; then the detail at text.help in muted-foreground, 6 apart, wrapping. |
| name | The track's name, cut with an ellipsis. |
| code | The track's id after its name, in the code face. |
| detail | A line under the chips: speed and heading, or what the app says. |

## Options

- `name`: What it is called.
- `code`: Its id, after the name.
- `kind` (`vessel`, `aircraft`, `vehicle`, `sensor`, `other`): Its glyph.
- `affiliation` (`friend`, `hostile`, `neutral`, `unknown`, `pending`): Its color and its chip.
- `heading`: Turns the glyph.
- `thumbnail`: A picture at the start.
- `states`: Chips for its states: a word, or a word in a tone.
- `detail`: One quiet line, such as speed and heading.
- `updatedAt`: When it was last heard from; the freshness is drawn only with it.
- `onAffiliationChange`: Makes the affiliation chip a menu of the affiliations.
- `onSelect`: Makes the whole card one control.
- `selected`: Draws it as chosen.
- `framed`: false drops the edge, ground and padding for a list's row.

## Sizes

- container: padX `10`, padY `10`, gap `10`, radius `radius-surface`. 
- thumbnail: width `40`, height `40`, radius `radius-control`. 
- head: gap `8`, text `text.body`. 

## States

- rest: The card drawn.
- hover: The pointer over a card that is a control: washed.
- selected: The card chosen: edged and ringed in primary.
- focus: Keyboard focus on the card: the focus outline around it.

## Keyboard

- Tab: Reaches the card when it is a control, then the affiliation chip's menu.
- Enter (the card has focus): Calls onSelect.

## Words

- `changeAffiliation` (`trackCard.changeAffiliation`): "Affiliation: {affiliation}. Change"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
