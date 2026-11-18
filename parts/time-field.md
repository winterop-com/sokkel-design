# Time field

A time of day typed on a 24 or a 12-hour clock, with a list of times beside it to pick from. The
value is a time on the wall clock with no zone, `HH:mm` (or `HH:mm:ss` with `seconds`), on either
clock. `930`, `9.30` and `9:30 pm` all read: hours, minutes and seconds split by `:` or `.`, or typed
as digits in a row, and a period word at the end (or its first letter) reads the hour on a 12-hour
clock whichever clock the field writes. What reads is written again on the field's clock once the
field is left; text that is not a time keeps the value as it was and is said once the field is left.
A time outside `min` and `max` is kept and said at once, with an action that puts in the bound, and
the list offers only the times between them, every `step` minutes from midnight. `zone` names the
zone after the input, as words only. An optional field that holds a time empties with a clear
button. The label, help and issue mark are [parts/text-field](text-field.md)'s, and the frame is
[parts/date-field](date-field.md)'s, so the form never changes height (principle 12). The structured
spec is [`time-field.json`](time-field.json).

Sources: sokkel-ui `packages/core/src/components/TimeField.tsx` (`TimeField`, `TimeFieldProps`,
`TimeFieldWords`, `TIME_FIELD_WORDS`), `entry.tsx` (`TypedField`, `FRAME_BUTTON`), `pickers.tsx`
(`Picker`, `TimeList`), `Field.tsx`, `lib/dates.ts` (`readTime`, `formatTime`, `timesOfDay`,
`fitSeconds`) and `lib/issue-edge.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| field | parts/text-field's frame: label, hint, required mark, description, help, fallback, issue mark |
| control | parts/date-field's frame: `density.control` tall, 10 across (4 at the end while it holds buttons), `radius-control`, on `field` with an `input` edge |
| input | The time on the field's clock, tabular figures; `hh:mm`, `hh:mm:ss` or `h:mm AM` as its placeholder |
| zone | With `zone`: its name after the input in `muted-foreground` |
| clear | With an optional field that holds text: a control-xs square button with an x, `words.clear` |
| pick | A control-xs square button with a clock, `words.pick`, opening the list |
| list | The popup under the frame, on the popup's look: 128 wide, padded 6, at most 256 tall, the times 2 apart |
| time | One time without seconds: 32 tall, 8 across, `text.sm`, `radius-md`; the chosen one on `secondary` at 500 |

## Options

`value` with `onValueChange`, or `defaultValue`; `clock` (24, the default, or 12); `seconds` (off);
`step` (30 minutes); `zone`; `min` and `max`; `open` with `onOpenChange`, or `defaultOpen`;
`placeholder`; and parts/text-field's `label`, `hint`, `description`, `help`, `fallback`,
`required`, `requiredMark`, `error`, `issues`, `disabled`, `readOnly`, plus `onIssueChange` and
`mono`.

## States and tokens

| State | Paint |
|---|---|
| rest | `field` ground, `input` edge, the page's ink |
| focus (any) | `ring` edge and a 1px `ring` ring, focus anywhere in the frame |
| disabled | `input/50` ground at `disabled-opacity`, no buttons, cursor not-allowed |
| invalid | `critical/80` edge; with focus `critical` and the invalid ring |
| warning | `warning/80` edge; with focus `warning` and a 1px `warning/25` ring |
| frame button | `muted-foreground`; hover on `hover` in `foreground`; keyboard focus a `focus-ring-width` ring in `ring/50`; the pick button on `hover` while open |
| list | the popup's look: `popover`, a `border-strong` edge, `radius-surface` |
| time | hover on `hover`; chosen on `secondary` at 500; keyboard focus the outline in `ring`, `focus-ring-width` |

## Keyboard

- Tab reaches the input, the clear and the pick buttons, then the issue mark.
- Alt+ArrowDown in the input opens the list.
- In the list ArrowUp and ArrowDown move to the time before or after, stopping at the ends, Home and
  End go to the first and the last; Enter or Space picks the time (with `:00` when the field takes
  seconds) and closes the list; Escape closes it, focus back on the pick button.

## Words

parts/text-field's words, then `unreadable` Enter a time, `example` As in {sample}. (14:30, or
14:30:00, written on the field's clock), `under` Enter {min} or later, `over` Enter {max} or earlier,
`use` Use {bound}, `pick` Choose a time, `clear` Clear, and the 12-hour clock's period words
`periods.am` AM and `periods.pm` PM (catalog ids `timeField.periods.0` and `.1`).

## In cells

The control is one row with parts/text-field's edge glyphs, the zone after the input, then the clear
(`x`) and the pick (the clock icon), one column each, their words said in the status line while
they have focus. The list is a box under the control, 16 columns inside its edge and at most 8 rows,
one time a row, the chosen one bold on its flat ground, the focused one with `focus-mark` at its
start.

## Where sokkel-egui and sokkel-tui differ today

- sokkel-egui, as of d163191: `TimeField` was built before this spec and has not been compared with
  it. It draws the 24-hour clock alone, `hh:mm` read with a colon: no `clock` option (the 12-hour
  form and its period words), no `seconds`, `zone`, `min` and `max` with their issue and action,
  clear button, `readOnly` or `disabled`, Alt+ArrowDown or list keys, and it does not read `930`,
  `9.30` or a period word. Its unreadable word is one sentence with the example, its error is said
  under the field, and its list rows are control tall with the chosen one on `primary`.
- sokkel-tui, as of 64f4b19: no time field.
