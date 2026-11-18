# Computed field

An answer a form works out itself rather than asks: its label with a note that it is worked out, the
value read only in the place an input would take, and under it why it is what it is, with the rule
in the code face. Until the answers it reads are given it says so in the value's place. It takes no
focus for typing, is out of the tab order, and is never counted as unanswered. The label and help are
[parts/text-field](text-field.md)'s; it has no required mark and no issues. The structured spec is
[`computed-field.json`](computed-field.json).

Sources: sokkel-ui `packages/core/src/components/ComputedField.tsx` (`ComputedField`,
`ComputedFieldProps`, `ComputedFieldWords`, `COMPUTED_FIELD_WORDS`), `Field.tsx` and
`ui/input.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| field | parts/text-field's frame: label, description, help |
| hint | `words.computed` beside the label, as parts/text-field's hint: `text.help` in `faint` |
| control | parts/text-field's input, read only, `tabIndex` -1, on `muted`: the value and its unit after a space, or `words.pending` as its placeholder |
| whyIcon | A 14 calculator before the why, 6 before it, level with its first line |
| why | The help: why the answer is what it is, `text.help` in `muted-foreground` |
| formula | With `formula`: the rule as written, a line of its own in the code face, `text.xs` |

## Options

`value` (written as shown, or null until it can be worked out), `unit`, `why` (required),
`formula`, `description`, `numeric` (off; tabular figures), `words`.

## States and tokens

| State | Paint |
|---|---|
| rest | `muted` ground, `input` edge, `foreground`; the cursor stays the arrow |
| pending | `words.pending` as the placeholder, in `muted-foreground` |
| focus (any) | A press on it or its label focuses it, though Tab passes it by: `ring` edge and a 1px `ring` ring |

## Keyboard

- Tab passes it by: the value is out of the tab order, since nothing is typed in it.

## Words

`pending` Worked out once the answers it reads are given, `computed` worked out.

## In cells

The control is one row on `muted`'s flat ground with `edge-start` and `edge-end`, the value and its
unit, or the pending words in `muted-foreground`. It is never a Tab stop, so it draws no focus bars.
The why follows under it after the calculator icon, the formula on a line of its own.

## Where sokkel-egui and sokkel-tui differ today

- sokkel-egui, as of d163191: `ComputedField` was built before this spec and has not been compared
  with it. It has no `numeric` option.
- sokkel-tui, as of b99664f: no computed field.
