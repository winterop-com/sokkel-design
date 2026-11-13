# Text field

A labeled text input. It is the field frame every field shares (label, hint, description, control,
help, fallback, issue mark) around a one-line input or a text area that grows. A problem is said by
a mark at the control's end, never by a line inserted under it, so **a form never changes height**.
The structured spec is [`text-field.json`](text-field.json).

Sources: sokkel-ui `TextField.tsx`, `Field.tsx` (the frame, `FieldWords`, `describedBy`),
`IssueMark.tsx` (`Issue`, `IssueMark`, `IssueWords`, `ISSUE_EDGE`, `IssueCount`), `ui/input.tsx`,
`ui/textarea.tsx`, `ui/label.tsx`; sokkel-ui-egui `crates/core/src/widgets/text_field.rs`
(`TextField`, `Input`).

## Anatomy

Top to bottom: **label** row (label, `requiredMark`, `hint`, `note`); **description**; **control**,
with the **issue mark** inside its end and the **issue popover** opening from the mark; **help**;
**fallback**. A field with no description and no help draws only its label row and control.

## Options

`label` (required), `hint` and `keyHint`, `description`, `help`, `fallback`, `required` with
`requiredMark` (`star` or `word`), `error` (one critical issue) or `issues` (each
`{ tone: critical | warning, text, detail?, actions? }`), `issueOpen`, `mono`, `monoLabel`,
`numeric`, `multiline` with `rows` and `maxRows`, `placeholder`, `readOnly`, `disabled`.

The `issues` shape is sokkel-api's issue shape too: `text`, `detail`, and a `tone` where `critical`
stops and `warning` does not. A server's refusal maps onto the field without being reshaped.

Made explicit (rule 2): `inRow` stands for Field inside `Columns` with `fields`. The field then
shares four rows (label, description, control, help) with its neighbors, so their controls stand
level. sokkel-ui does this with the `FieldRows` context and CSS subgrid.

## Sizes

| | Value |
|---|---|
| Control height | `density.control`: 32 regular, 28 compact; at least `spacing-finger` (44) below 768 |
| Control padding | 10 x, 4 y; text area 10 x, 8 y, at least 112 tall, growing to `maxRows` lines |
| Text | `text.body` (15/22); 16px below 768, so a phone does not zoom the page on focus |
| Corners | `radius-control` |
| Gaps | 6 between label row, description, control and help; label row 8 across, 2 down; 2 between help lines |
| Issue mark | square at `density.control-sm` (28 / 24), 4 from the end, icon 16; the control pads its end 36 while it shows |
| Issue popover | `min(320, window - 32)` wide, below the mark at its end, 6 away; padding 12 |

## States

| State | Reached by | Control paint |
|---|---|---|
| rest | | ground `field`, edge `input`, ink `foreground`, placeholder `muted-foreground` |
| hover | pointer | no change today |
| focus (`on: any`) | Tab or a press | edge `ring`; effect: a 1px `ring` ring on the control |
| pressed | | a press focuses it, no look of its own |
| disabled | `disabled` | ground `input/50` (dark `input/80`), opacity 0.5, out of the tab order |
| readOnly | `readOnly` | no look of its own today |
| invalid | `error` or a critical issue | edge `critical/80`, no ring at rest; mark in `critical-ink` |
| invalid+focus | focus on an invalid control | edge `critical`; effect: a 3px ring, `critical/20` (dark `critical/40`), on the control, only while it has focus |
| warning | a warning issue | edge `warning/80`; mark in `warning-ink` |
| warning+focus | focus with a warning | edge `warning`; effect: a 1px `warning/25` ring |
| issueOpen | a press on the mark, Enter or Space, or `issueOpen` | mark ground `hover`; popover on `popover` / `popover-foreground`, corners `radius-surface` |
| busy (proposed) | | text held read only, a spinner at the control's end, focus kept |

`busy` is not in `TextField` today. `QuickAdd` (a spinner while the app's add runs) and the inline
edit cycle in `lib/edit` (a spinner while the save runs) draw it, each on its own. The spec proposes
the field frame owns it.

Other pieces: label `text.label` (15/20/500) in the ink around it; star `critical-ink`; the required
word, the hint and the help and fallback in `text.help` (13/20/400), the hint in `faint` and the
others in `muted-foreground`; a `keyHint` in the code face in `muted-foreground`; description
`text.body` in `muted-foreground`.

## Keyboard

- Tab focuses the control. When there is an issue, the next Tab reaches the issue mark, a button.
- Enter calls `onEnter` and Escape calls `onEscape` (one-line input only).
- On the mark, Enter or Space opens the popover. Escape closes it, and focus stays where it was.
- A press on the label focuses the control, even a control a label does not focus by itself (an
  editor drawn as text).

## Words

| Key | Default | Said |
|---|---|---|
| `required` | required | After a star to a screen reader, or drawn as the word |
| `issueCritical` | `Error: ` | Before a critical issue in the mark's name |
| `issueWarning` | `Warning: ` | Before a warning |
| `errors` | `{count} error` / `{count} errors` | The form's issue count beside its verb |
| `warnings` | `{count} warning` / `{count} warnings` | |

In sokkel-ui, `FieldWords` (`Field.tsx`, defaults in `FIELD_WORDS`) holds `required` and extends
`IssueWords` (`IssueMark.tsx`, defaults in `ISSUE_WORDS`), so a field hands `issueCritical` and
`issueWarning` to its mark. `errors` and `warnings` are `IssueCount`'s. The app gives the label,
hint, description, help, fallback, placeholder and every issue's text.

## Renderer-specific

- **sokkel-ui:** the popover is Base UI's. The mark's accessible name is all issues said as one
  sentence. `describedBy()` points the control at its description, help and fallback. A row of
  fields lines up through CSS subgrid.
- **sokkel-ui-egui:** the widget draws the frame and centers `TextEdit` in the control height. The
  16px phone text is a browser zoom guard that a native renderer may skip. Lining fields up in a row
  needs every field's label and description measured first.

## Where the renderers differ from the spec today

sokkel-ui-egui:
1. **The error is a line under the field** (in `critical-ink`, replacing the help), so the form
   changes height. The spec puts it behind a mark at the control's end.
2. Width 280 unless set; the spec fills the room given.
3. Not built: hint, description, fallback, required marks, the warning tone, issue actions,
   multiline, mono, numeric, read only, the phone sizes.

Its height already reads `density.control`, and its invalid focus ring (3px, `critical` at 20 / 40
percent, on focus only) is the spec's.

sokkel-ui itself: its height reads `density.control`, an invalid control draws its edge alone at
rest and the 3px ring only on focus (`src/rules.test.ts` fails a ring drawn at rest), and the spoken
prefixes are words. Every invalid control, `Field`'s and a bare primitive alike, takes its tints
from one place (`lib/issue-edge.ts`): the edge `critical/80` at rest and `critical` on focus, the
ring 3px `critical/20` (dark `critical/40`) on focus only, in both schemes. No difference is left.
