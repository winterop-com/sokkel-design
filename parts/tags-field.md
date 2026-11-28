# Tags field

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

Several short values typed into one field, each a chip: Enter or a comma adds one, Backspace in an empty input takes the last off, and suggestions are offered as the viewer types. The structured spec is [`tags-field.json`](tags-field.json).

Sources: sokkel-ui `packages/core/src/components/TagsField.tsx`, `packages/core/src/components/Chip.tsx`, `packages/core/src/components/Field.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A field (parts' Field: label, hint, description, help, issue mark) around the frame. |
| frame | At least the control's height, wrapping, 4 apart, padded 6 across and 4 down, on field, edged in input, rounded by radius-control: the chips, then the input taking the rest of the line, never narrower than 96. Focused, edged and ringed 1 in ring; with an issue, edged in critical at 80 percent. |
| chip | Each tag as parts/chip with its remove button, named by remove. |
| input | 24 tall, padded 4 across, at text.sm, no frame of its own; the placeholder only while there are no tags. |
| suggestions | While the text matches suggestions not in already: a list under the frame, 4 below it, of up to six, padded 4, on popover, edged in border, rounded by radius-control, with a pop shadow; each padded 8 across and 4 down, the marked one on hover. |

## Options

- `value`: The tags.
- `onValueChange`: Called with the tags after each one added or removed.
- `suggestions`: Tags offered as the viewer types.
- `max`: The most tags it takes.
- `normalize`: Turns what is typed into a tag; trimmed by default.
- `disabled`: Turns it off: no input and no remove buttons.

## Sizes

- frame: padX `6`, padY `4`, gap `4`, radius `radius-control`. 
- input: height `24`, text `text.sm`. 

## States

- rest: The tags and the input.
- focus: The input focused: the frame edged and ringed in ring.
- suggesting: Suggestions open under the frame.
- refused: A tag in already or past max: not added, the issue said.
- disabled: Turned off.

## Keyboard

- Enter (the input has focus): Adds what is typed, or the marked suggestion.
- , (the input has focus): Adds what is typed.
- Backspace (the input is empty): Takes the last tag off.
- ArrowDown, ArrowUp (suggestions are open): Marks the next or the previous suggestion.
- Escape (suggestions are open): Clears what is typed, closing the suggestions.

## Words

- `remove` (`tagsField.remove`): "Remove {tag}"
- `duplicate` (`tagsField.duplicate`): "{tag} is in already"
- `full` (`tagsField.full`): "Up to {count} tags"
- `suggestions` (`tagsField.suggestions`): "Suggestions"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
