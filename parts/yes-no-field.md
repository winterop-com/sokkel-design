# Yes-no field

A question answered yes or no that may also be left unanswered: Yes and No side by side, neither
chosen until one is, and Clear beside them once answered, which takes the answer back, so an
optional question never has to keep a No it was not given. While unanswered it says so. A required
question has no Clear, and `yesOnly` offers Yes alone, for a question that keeps no No. The label,
help and issue mark are [parts/text-field](text-field.md)'s, so the form never changes height
(principle 12). The structured spec is [`yes-no-field.json`](yes-no-field.json).

Sources: sokkel-ui `packages/core/src/components/YesNoField.tsx` (`YesNoField`, `YesNoFieldProps`,
`YesNoFieldWords`, `YES_NO_FIELD_WORDS`), `Segmented.tsx` (the choice, at `md` with the `track`
look), `Field.tsx` and `ui/button.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| field | parts/text-field's frame: label, required mark, description, help, issue mark |
| choice | Yes and No as one segmented control, named by the label: on `muted` with a `border` edge (`background` and `border-strong` in dark), `radius-control`, 1 inside its edge; from md a row at least `density.control` tall, below md a grid two wide |
| option | A button, pressed while it is the answer: 12 across, `text.sm`, at least `density.control-sm` tall from md and a finger tall below it, `radius-mini` |
| unanswered | While unanswered: `words.unanswered` in `text.help`, `muted-foreground`, 8 after the choice |
| clear | Once answered, unless required: parts/button's ghost at sm with an eraser and `words.clear`, 8 after the choice |

## Options

`value` with `onValueChange` (true, false, or null while unanswered), `required` (off; takes Clear
away), `yesOnly` (off), `description`, `help`, `error`, `issues`, `disabled` (off), `words`.

## States and tokens

| State | Paint |
|---|---|
| rest | Unanswered: options in `muted-foreground`, neither pressed, `words.unanswered` beside |
| hover | An option that is not the answer: `foreground/5` ground, `foreground` ink; Clear: parts/button's ghost hover |
| chosen | The answer: `card` ground (`input/70` in dark), `foreground`, 500, a 1px `border-strong` ring (`input` in dark), the node shadow in light |
| keyFocus | An option: the focus outline in `ring`, `focus-ring-width`, 1 off; Clear: parts/button's |
| disabled | The choice at `disabled-opacity`, its options out of the tab order, Clear disabled |
| invalid, warning | The issue mark at the row's end; the choice keeps its own edge, since the issue's edge lands on the row that holds it, which has none |

## Keyboard

- Tab reaches Yes, No, Clear when there is one, then the issue mark.
- Enter or Space on an option answers with it; pressing the answer again keeps it.
- Enter or Space on Clear takes the answer back.

## Words

parts/text-field's words, then `yes` Yes, `no` No, `clear` Clear, `unanswered` Not answered.

## In cells

The choice is one row with `edge-start` and `edge-end`, its options inside with a gap of 1 between
them, where an option's focus bars go; the answer on its chosen paint's flat ground and bold, in
reverse video without color. The unanswered words or Clear (a one-row ghost button, its eraser
before its word) follow after a gap of 1.

## Where sokkel-egui and sokkel-tui differ today

- sokkel-egui, as of d163191: `YesNoField` was built before this spec and has not been compared with
  it. It takes one error, said under the field, and no issues or disabled.
- sokkel-tui, as of b99664f: no yes-no field.
