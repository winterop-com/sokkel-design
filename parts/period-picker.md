# Period picker

The period a report is made for: a select offering the recent periods of one type, newest first,
each named by its label with its id after it in the code face, then Other period, which opens a text
input where any id is typed. The typed id is read by its shape and the value changes only once it
names a period of the type; text that does not is refused at once with
[parts/text-field](text-field.md)'s issue mark at the input's end, in a sentence that says what the
type's ids look like. A value the list does not hold opens on the typed input. The trigger and the
list are [parts/select](select.md)'s, and as a field the picker sits in parts/text-field's frame.
The structured spec is [`period-picker.json`](period-picker.json).

Sources: sokkel-ui `packages/core/src/components/PeriodPicker.tsx` (`PeriodPicker`,
`PeriodPickerProps`, `PeriodPickerWords`, `PERIOD_PICKER_WORDS`), `lib/periods.ts`
(`recentPeriods`, `parsePeriod`, `periodIssue`, `PERIOD_TYPES`, `PERIOD_LABEL_WORDS`,
`PERIOD_ISSUE_WORDS`), `ui/select.tsx`, `ui/input.tsx`, `IssueMark.tsx` and `lib/issue-edge.ts`.

## Ids

| Type | Id | Label | Listed |
|---|---|---|---|
| daily | `20261108` | November 8, 2026 | 13 |
| weekly | `2026W45` | Week 45, 2026 (from Mon, Nov 2) | 13 |
| monthly | `202611` | November 2026 | 13 |
| bimonthly | `202611B` | November to December 2026 | 9 |
| quarterly | `2026Q4` | October to December 2026 | 9 |
| sixmonthly | `2026S2` | July to December 2026 | 9 |
| yearly | `2026` | 2026 | 6 |

## Anatomy

| Piece | What it is |
|---|---|
| picker | The select, and under it the typed input while typing, 6 apart |
| trigger | parts/select's field trigger at the default size, filling the row: the chosen label and id, `words.other`, or `words.placeholder` |
| list | parts/select's list, opened under the trigger, at most 320 tall |
| row | parts/select's row: the label, then the id 8 after it |
| periodId | The id in the code face, `text.help`, `muted-foreground` (`accent-foreground` when highlighted) |
| separator | Before Other period |
| other | The last row, `words.other` |
| typed | parts/text-field's control in the code face, named `words.typed`, the type's example id as placeholder |
| issueMark | parts/text-field's issue mark at the typed input's end, which keeps 36 for it |

## Options

`type` (daily, weekly, monthly, bimonthly, quarterly, sixmonthly, yearly); `value` (an id or null)
with `onValueChange`; `today` (YYYY-MM-DD, the clock's day otherwise); `count` (the type's own
number otherwise); `id` (the typed input takes `<id>-typed`); `onIssueChange`; `disabled`; `words`.

## States and tokens

| State | Paint |
|---|---|
| rest, placeholder, focus, open | parts/select's field trigger: `field`, `input` edge, `foreground`; placeholder in `muted-foreground`; keyboard focus the `ring` edge and a 1px ring |
| highlighted | the row on `accent` in `accent-foreground`, the id too |
| typing | the trigger says Other period; the typed input shows |
| typedFocus (any) | the `ring` edge and a 1px `ring` ring |
| invalid | the typed input's `critical/80` edge and the issue mark; with focus `critical` and the invalid ring |
| disabled | trigger and input at `disabled-opacity`; the input on `input/50` (`input/80` in dark) |

## Keyboard

parts/select's keys on the trigger and the list; choosing Other period opens the typed input,
keeping what was typed there. Tab reaches the trigger, then the typed input and its issue mark.

## Words

The picker's own: `other` Other period, `typed` Period id, `placeholder` Choose a period. The
issue sentences (`periodIssue.*`): `empty` Type a period id., `otherType` {id} is a {its} period;
this one is {wanted}, such as {example}., `notPeriod` {text} is not a period id. A {wanted} period
is written like {example}. The period labels (`periodLabel.*`): `monthNames.0` to `.11`,
`shortMonthNames.0` to `.11`, `types.daily` to `types.yearly`, `day`, `week`, `month`, `months` and
`year`. The issue mark's `issueCritical` and `issueWarning` (`issue.*`). In sokkel-ui the month
names are lists and the type names a record; the spec names each entry after a dot, as the catalog
does. The issue sentences name the types by `types` in lower case.

## Cells

The trigger is parts/select's, the typed input parts/text-field's control, one row each, with their
edges as `edge-start` and `edge-end` and keyboard focus as `focus-ring-start` and `focus-ring-end`
beside the trigger. A row is its label, then its id 2 columns after it.

## Where sokkel-egui differs today

As of d163191, `PeriodPicker` was built before this spec and has not been compared with it. Read
from its source: the recent periods in a select with their ids, Other period, and the typed input
that answers with its issue. Not there: `count`, `disabled`, `onIssueChange`, the issue mark at the
typed input's end (the issue is handed back to the app), the code face on the typed input, and words
beyond `other`, `typed` and `placeholder` (the labels and sentences are fixed in `periods.rs`).

sokkel-tui has no period picker yet (b99664f).
