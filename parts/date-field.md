# Date field

A date typed in one format, with a calendar beside it to pick from. The value is a day with no time
and no zone, `YYYY-MM-DD`, whatever `format` the field is written in. What is typed is read by that
format alone (a pasted ISO date always reads) and written in it again once the field is left; text
that is not a date keeps the value as it was and is said once the field is left. A date outside
`min` and `max` is kept and said at once, with an action that puts in the bound, and the calendar
offers none. An optional field that holds a date empties with a clear button. The label, help and
issue mark are [parts/text-field](text-field.md)'s, so the form never changes height (principle
12). The structured spec is [`date-field.json`](date-field.json).

Sources: sokkel-ui `packages/core/src/components/DateField.tsx` (`DateField`, `DateFieldProps`,
`DateFieldWords`), `entry.tsx` (`TypedField`, the frame and its buttons, `FRAME_BUTTON`),
`pickers.tsx` (`Picker`), `day-pick.tsx` (`DayPick`, `prefetchCalendar`), `ui/calendar.tsx`,
`Field.tsx`, `lib/dates.ts` and `lib/issue-edge.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| field | parts/text-field's frame: label, hint, required mark, description, help, fallback, issue mark |
| control | The frame: `density.control` tall, 10 across (4 at the end while it holds buttons), `radius-control`, on `field` with an `input` edge; buttons 4 apart |
| input | The date in the field's format, tabular figures; the format in lower case as its placeholder |
| clear | With an optional field that holds text: a control-xs square button with an x, `words.clear` |
| pick | A control-xs square button with a calendar, `words.pick`, opening the calendar |
| calendar | The popup under the frame, on the popup's look, padded 8: one month, the chosen day focused |
| day | A cell 28 square (32 below 768), `radius-md` |
| spinner | In the calendar's place while it loads the first time, 224 by 288 |

## Options

`value` with `onValueChange`, or `defaultValue` (`YYYY-MM-DD` or null); `format` (`YYYY-MM-DD` by
default, or such as `DD.MM.YYYY` and `MM/DD/YYYY`); `min` and `max`; `today`; `weekStartsOn` (1
Monday, the default, or 0 Sunday); `open` with `onOpenChange`, or `defaultOpen`; `placeholder`;
and parts/text-field's `label`, `hint`, `description`, `help`, `fallback`, `required`,
`requiredMark`, `error`, `issues`, `disabled`, `readOnly`, plus `onIssueChange` and `mono`.
`DateTimeField`, the same day with a time, shares the typed field and is not in this spec.

## States and tokens

| State | Paint |
|---|---|
| rest | `field` ground, `input` edge, `foreground` |
| focus (any) | `ring` edge and a 1px `ring` ring, focus anywhere in the frame |
| disabled | `input/50` ground at `disabled-opacity`, no buttons, cursor not-allowed |
| invalid | `critical/80` edge; with focus `critical` and the invalid ring |
| warning | `warning/80` edge; with focus `warning` and a 1px `warning/25` ring |
| frame button | `muted-foreground`; hover on `hover` in `foreground`; keyboard focus a `focus-ring-width` ring in `ring/50`; the pick button on `hover` while open |
| calendar | the popup's look: `popover`, a `border-strong` edge, `radius-surface` |
| chosen day | `primary` in `primary-foreground` |
| today | `muted` in `foreground` |
| shut day | `muted-foreground` at `disabled-opacity` |
| focused day | the focus outline in `ring`, `focus-ring-offset` off |

## Keyboard

- Tab reaches the input, the clear and the pick buttons, then the issue mark.
- Alt+ArrowDown in the input opens the calendar.
- In the calendar the arrows move by a day or a week, PageUp and PageDown by a month, Home and End to
  the week's ends; Enter or Space picks the day and closes it; Escape closes it, focus back on the
  pick button.

## Words

parts/text-field's words, then `unreadable` Enter a date, `example` As in {sample}., `under`
Enter {min} or later, `over` Enter {max} or earlier, `use` Use {bound}, `pick` Choose a date,
`clear` Clear. Each bound and example is written in the field's format.

## Where sokkel-egui differs today

As of d163191, `DateField` draws the date-only form (`YYYY-MM-DD` typed or picked from a calendar)
through `Field`: the required mark, the description, the help and the issue mark at the control's
end. Not built: other formats, `min` and `max` with their issue and its action, the clear button,
`today` and `weekStartsOn`, and Alt+ArrowDown. Its input is 32 tall with its edge since 68c156c.
