# Prompt

A dialog that asks for one value: a name for a new project, a token for a service. It is
[`parts/dialog`](../parts/dialog.md) at its narrowest with one field in its body,
[`parts/text-field`](../parts/text-field.md), or [`parts/secret-field`](../parts/secret-field.md)
for a secret, and Cancel and Submit. This pattern says how the two are put together and what the
prompt does between them; their looks are their own specs'. The structured spec is
[`prompt.json`](prompt.json).

Sources: sokkel-ui `PromptDialog.tsx` (`PromptDialog`, `PromptDialogProps`, `PromptDialogWords`,
`PROMPT_DIALOG_WORDS`), on `DialogShell.tsx`, `TextField.tsx`, `SecretField.tsx` and `ProblemLine`
(`ProseText.tsx`). Stories: `Patterns/Prompt dialog` (Open, Secret, Validation, Busy, Failed).

## Anatomy

| Piece | What it is |
|---|---|
| dialog | parts/dialog at `sm` (384) and phone `fit`: a box sized to its content at every width, as a ConfirmDialog is |
| title | What is asked (the app's) |
| description | One optional line under the title on what the value is for |
| field | The body's one field: parts/text-field, or parts/secret-field with `secret`. Opening focuses it |
| status | parts/dialog's status slot: why taking the value failed, a problem line |
| cancel | parts/dialog's Cancel, `words.cancel`; Stop waiting once a busy submit has run busy-release |
| submit | The dialog's confirm, `words.submit`, and `words.submitting` with its spinner while busy |

## Options

`open`, `title`, `description`, the field's `label`, `hint`, `help` and `placeholder`,
`defaultValue` (what each opening starts from), `secret` (off), `mono` (off), `allowEmpty` (off),
`validate` (the value's issue, or nothing), `onSubmit` (takes the value; its work holds the dialog
busy, and its failure is said), `busy` and `error` (the same states held from outside), `words`.

## Behavior

- Every opening starts over: the field holds `defaultValue`, and no issue or failure is shown.
- Submit is shut while the field is empty (its reason `words.empty`) unless `allowEmpty`, and while
  `validate` refuses the value (its reason the issue). The issue is the field's, drawn as
  parts/text-field draws a critical issue, once something is typed or Submit is pressed.
- Enter in the field submits, as a press on Submit does; on a shut Submit it shows the issue.
- Taken at once, the dialog closes. While the work runs the dialog is busy as parts/dialog's busy
  confirm is: Submit spins and says `words.submitting`, the field is read only, and Cancel, Escape
  and the backdrop wait until busy-release.
- When taking it fails, the dialog stays open with the value kept, and the status slot says why: the
  failure's own message, or `words.failed`. Submit tries again.

## Keyboard

- Enter submits, while the field has focus and Submit is neither shut nor busy.
- Escape closes the dialog with nothing taken, as parts/dialog's does.
- Tab moves through the field (and a secret's reveal), Cancel and Submit, held inside the dialog.

## Words

`submit` Submit, `submitting` Submitting, `cancel` Cancel, `empty` Fill in the field first.,
`failed` Could not submit. Try again. An app names Submit for what it does (Create, Save) through
its words.

## In cells

parts/dialog's cells at `sm`, 46 columns, with the field's one row (and its label row) as the body;
the status slot is one row over the footer while a failure is said.

## Where sokkel-egui and sokkel-tui differ today

- sokkel-egui, as of 1a87987: no prompt; an app draws a `Dialog` with a field in its body.
- sokkel-tui, as of 64f4b19: no prompt.
