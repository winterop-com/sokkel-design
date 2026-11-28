# Rating

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

A rating in stars: chosen as a radio group, or shown, filled to the fraction an average has. The structured spec is [`rating.json`](rating.json).

Sources: sokkel-ui `packages/core/src/components/Rating.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A row of max stars, 2 apart. |
| star | A star outline (md 20 square, sm 14): given, filled and stroked in warning; not given, stroked in muted-foreground at 40 percent. As a choice each star is a radio button padded 2, rounded by radius-mini. |
| fraction | Shown, each star filled from its start to the part of it the value covers, so 3.6 fills three and three fifths. |

## Options

- `label`: What the stars rate: the group's name.
- `value`: The stars given, from 0; shown, it may be a fraction.
- `onValueChange`: Makes it a choice: called with the stars picked, or 0 when the picked count is pressed again.
- `max`: How many stars there are.
- `size` (`sm`, `md`): Stars 14 or 20 square.
- `disabled`: Turns the choice off.

## Sizes

- sm: width `14`, height `14`. 
- md: width `20`, height `20`. 

## States

- rest: The stars given filled.
- hover: The pointer over a star of a choice: it and those before it filled at 70 percent.
- focus: Keyboard focus on a star: the focus ring around it.
- disabled: Turned off: at the disabled opacity.

## Keyboard

- Tab: Reaches the stars given, or the first.
- ArrowRight, ArrowLeft (a star has focus): Gives one star more or one fewer, as a radio group moves.

## Words

- `star` (`rating.star`): "{'one': '{count} of {total} star', 'other': '{count} of {total} stars'}"
- `rated` (`rating.rated`): "Rated {stars} of {total}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
