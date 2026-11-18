# Choice list

Pick one of a few choices, each a row with its radio, its name and a line saying what choosing it means. The whole row is pressable and the chosen one is filled, so the choice reads at a glance where a bare radio would be easy to miss. The structured spec is [`choice-list.json`](choice-list.json).

Sources: sokkel-ui `packages/core/src/components/ChoiceList.tsx`, `packages/core/src/components/ui/radio-group.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| list | The rows one under the other, 2 apart: a radio group. |
| row | One choice, the whole of it pressable: the radio, then the label over the description; padded 10 across and 8 down, 12 between the radio and the words, rounded by radius-control. The chosen row is filled. |
| radio | The choice's radio, 16 square and round: an edge in input, filled in primary with a dot in primary-foreground while chosen. Set at the top with a description, 2 down, level with the label's first line. |
| label | The choice's name, text.sm at 500 where it is words; a richer row (a person, a theme's sample) as the app draws it. |
| description | A line under the label: what choosing it means, text.xs in muted-foreground. |

## Options

- `options`: The choices, in order: { value, label, description? }.
- `value`: The chosen value.
- `onValueChange`: Called with the value chosen.
- `label`: The list's accessible name, where no visible heading names it.

## Sizes

- list: gap `2`
- row: padX `10`, padY `8`, gap `12`, radius `radius-control`
- radio: height `16`, width `16`

## States and tokens

- rest: A choice not chosen.
- hover: The pointer is over a row not chosen.
- chosen: The chosen row: filled in secondary, its radio filled in primary.
- focus: Keyboard focus on the chosen radio (or the first): the focus outline around the radio.
- row at rest: radius `radius-control`, text `text.sm`.
- row at hover: ground `hover`.
- row at chosen: ground `secondary`.
- radio at rest: edge `input`, dark `{"ground": "input/30"}`.
- radio at chosen: ground `primary`, edge `primary`, ink `primary-foreground`.
- radio at focus: ring `{"color": "ring", "width": "focus-ring-width", "offset": "focus-ring-offset"}`.
- label at rest: text `text.sm`, weight `500`.
- description at rest: ink `muted-foreground`, text `text.xs`.

## Keyboard

- Tab: Reaches the list at the chosen choice (the first when none is chosen); Tab again leaves it.
- ArrowDown, ArrowRight (a choice has focus): Moves to the next choice and chooses it, wrapping.
- ArrowUp, ArrowLeft (a choice has focus): Moves to the choice before and chooses it, wrapping.
- Space (a choice has focus): Chooses the focused choice.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-ui only: `labelledBy` names the list by the id of a visible heading (`aria-labelledby`), where `label` is not given.

- sokkel-egui: As of fc9d27e: Each row is a Tab stop of its own (no roving focus, no arrows) and Enter also chooses; no dark input/30 ground; the radio is centered on a wrapped label rather than level with its first line; not a radio group to assistive technology. Paints and sizes match.
- sokkel-tui: As of b99664f its reports name no such part.
