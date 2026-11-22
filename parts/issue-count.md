# Issue count

A form's issues as one control beside its verb: a figure for each kind, the errors that stop the submit in the critical ink and the warnings in the warning ink, on the tint of the worst. Pressing it opens the issues right there, each naming its field, and choosing one goes to that field and opens its mark. Nothing is drawn at zero. A dialog takes it in its count slot, beside its verbs. The structured spec is [`issue-count.json`](issue-count.json).

Sources: sokkel-ui `packages/core/src/components/IssueMark.tsx (IssueCount, ISSUE_COUNT_WORDS)`, `packages/core/src/components/ui/popover.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| face | The control: control-sm tall, a 1px edge and a faint wash in the worst issue's tone, rounded by radius-control, text.xs at 450 in tabular figures. A button when there is a list to open, else a status. Its name says every count in words (words.errors, words.warnings), joined by a comma. |
| figure | One kind's count after its mark (a circled alert for errors, a triangle for warnings), 14 square, 4 apart, padded 8 across, in the kind's ink. The warnings' figure follows the errors' behind a rule in its ink at 25 percent. |
| list | The popup above the face, at its start: the issues one under the other, 4 apart, padded 6, layout.listWidth wide at most. |
| entry | One issue, a button: its mark (16, 2 down) and, 8 after it, the field's label in text.xs and muted-foreground over the issue's words in text.sm. Choosing it shuts the list, goes to the field and opens its mark. |

## Options

- `critical`: How many issues stop the submit.
- `warning` (`0` by default): How many warnings.
- `list`: The issues, each { label, issue, onGo, target? }: the field's label, its issue, and how to go to it. Empty, the face is a status with nothing to open.
- `defaultOpen` (`false` by default): Starts with the list open.

## Sizes

- face: height `density.control-sm`, radius `radius-control`, phoneMinHeight `spacing-finger`. A finger tall below md when it opens a list.
- figure: padX `8`, gap `4`
- list: padX `6`, padY `6`, gap `4`
- entry: padX `8`, padY `6`, gap `8`
- layout.listWidth: `352`. min(352, window - 32): 352, less where the window is narrower than 384 (`w-[min(22rem,calc(100vw-2rem))]`).

## States and tokens

- rest: At least one error: the critical tone.
- warning: Warnings only: the warning tone.
- hover: The pointer is over the face, or over an entry.
- focus: Keyboard focus on the face: the focus ring; on an entry, its wash.
- open: The list is open: the face washed as under the pointer.
- face at rest: ground `critical/8`, edge `critical/40`, radius `radius-control`, text `text.xs`, weight `450`.
- face at hover: ground `critical/12`.
- face at open: ground `critical/12`.
- face at focus: ring `{"color": "ring/50", "width": "focus-ring-width"}`.
- face at warning: ground `warning/8`, edge `warning/45`.
- face at warning+hover: ground `warning/12`.
- face at warning+open: ground `warning/12`.
- figure at rest: ink `critical-ink`.
- figure at warning: ink `warning-ink`.
- entry at rest: radius `radius-md`.
- entry at hover: ground `hover`.
- entry at focus: ground `hover`.

## Keyboard

- Tab: Reaches the face when it opens a list.
- Enter, Space (the face has focus): Opens the list, the focus on its first issue.
- Enter, Space (an entry has focus): Goes to the issue's field and opens its mark; the list shuts.
- Escape (the list is open): Shuts the list, the focus back on the face.

## Words

- `errors` {count} error / {count} errors (`issueCount.errors`)
- `warnings` {count} warning / {count} warnings (`issueCount.warnings`)

## Where each renderer stands

- sokkel-egui: As of fc9d27e: no count without a list (the count is the list's length, with no critical or warning options), so a count with nothing to open cannot be shown; no warnings tone or rule; the accessible name is English in code and says no counts together; no focus ring; no keys (focus to the first issue, the arrows, Escape back); entries a fixed 40 tall and not cut; the list a fixed 352 wide, not layout.listWidth. The face's paints match.
- sokkel-tui: As of b99664f its reports name no such part.
