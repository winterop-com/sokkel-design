# Secret field

A secret a form sets but never reads back, such as a connection's token or password. With nothing
set it is a masked input with Show, which reveals what is typed. With a secret already set
(`sealed`) it says so, masked, and when it was set when `setAt` is given, and leaves it as it is
unless Replace is pressed: Replace opens an empty input for the new secret, and Cancel or Escape
seals it again, dropping what was typed. The value is the new secret, or none, so a form tells a
secret left unchanged from a new one and leaves it out of what it sends. The label, help and issue
mark are [parts/text-field](text-field.md)'s, so the form never changes height (principle 12). The
structured spec is [`secret-field.json`](secret-field.json).

Sources: sokkel-ui `packages/core/src/components/SecretField.tsx` (`SecretField`,
`SecretFieldProps`, `SecretFieldWords`, `SECRET_FIELD_WORDS`), `entry.tsx` (`FRAME_BUTTON`),
`Field.tsx`, `RelativeTime.tsx`, `ui/input.tsx`, `ui/button.tsx` and `lib/issue-edge.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| field | parts/text-field's frame: label, hint, required mark, description, help, issue mark |
| control | The frame: `density.control` tall, 10 at the start and 4 at the end, `radius-control`, on `field` with an `input` edge; its pieces 4 apart |
| input | Open: the secret typed, masked by the browser until revealed; spell checking off, `autoComplete` `new-password` unless given, in the code face unless `mono={false}` |
| reveal | Open and changeable: a control-xs square frame button, an eye named `words.show`, or a crossed eye named `words.hide` while the secret shows; a toggle (`aria-pressed`) |
| cancel | A sealed field open for a new secret: parts/button's ghost at xs, `words.cancel` |
| sealedMark | Sealed: a 14 key in `muted-foreground` |
| dots | Sealed: eight dots in the code face, widely tracked, `muted-foreground`; never the secret |
| setNote | Sealed: `words.set`, or `words.setWhen` with `setAt` said relative to `now`, `text.xs` `muted-foreground`, cut short |
| replace | Sealed and changeable: parts/button's ghost at xs, `words.replace`, named `words.replaceLabel(label)` and described by the set note; the label points at it |

## Options

`value` with `onChange` (the new secret, or undefined for none; an emptied input is none), `sealed`
(off), `setAt` and `now`, `defaultReplacing` (off), `placeholder`, `autoComplete` (`new-password`;
`current-password` for a box that asks for one already held), `mono` (on), `bare` (the control
alone, for a form that draws its own label), and parts/text-field's `label`, `hint`, `description`,
`help`, `required`, `requiredMark`, `error`, `issues`, `issueOpen`, `readOnly`, `disabled`. A read-only or
disabled field has no reveal, no Cancel and no Replace. `SchemaForm` draws a `writeOnly` property
with it, sealed where `useSchemaForm`'s `sealed` says a secret is set.

## States and tokens

| State | Paint |
|---|---|
| rest | `field` ground, `input` edge, the page's ink |
| focus (any) | Focus anywhere in an open frame: `ring` edge and a 1px `ring` ring. A sealed frame draws no ring; Replace shows its own focus |
| frame button | The reveal: `muted-foreground`; hover on `hover` in `foreground`; keyboard focus a `focus-ring-width` ring in `ring/50` |
| Replace, Cancel | parts/button's ghost: hover on `hover` in `foreground`, the focus outline in `ring` |
| sealed | The frame on `muted/40`, the key, the dots and the set note in `muted-foreground` |
| replacing | The empty input, the reveal and Cancel; focus moves into the input |
| shown | The secret as text; the reveal says `words.hide` and is pressed |
| disabled | `input/50` ground at `disabled-opacity`, no buttons, cursor not-allowed |
| invalid | `critical/80` edge; with focus it stays `critical/80` and takes the frame's 1px `ring` ring |
| warning | `warning/80` edge; with focus as invalid |

The invalid and warning edges with focus differ from the other typed fields (parts/date-field): the
field's box puts the issue's edge on its first child (`FIELD_EDGE`), and the frame takes the full
edge and the invalid ring (`ISSUE_WITHIN_EDGE`) only when `bare`. The spec states what it draws.

## Keyboard

- Tab reaches the input, the reveal, Cancel while a sealed field is open, then the issue mark; a
  sealed field's one stop is Replace.
- Enter or Space on the reveal shows the secret, or masks it again.
- Enter or Space on Replace opens the field for a new secret and moves focus into the input.
- Escape in a sealed field's input, or Cancel, seals it again: what was typed is dropped, the value
  is none, the secret masked, and focus moves to Replace.

## Words

parts/text-field's words, then `set` Set, `setWhen` Set {when} (`when` is the relative time, a
node, so the catalog holds no message for it), `replace` Replace, `replaceLabel` Replace {label}
(a label that opens on a capitalized word is lowercased there, as mid-sentence: "Replace
password"; "API token" stays: "Replace API token"; no catalog message either), `cancel` Cancel,
`show` Show, `hide` Hide.

## In cells

The control is one row with parts/text-field's edge glyphs. Each character typed is one `mask`
glyph, one cell each, while hidden: the value is never on screen until revealed. A paste lands at
the cursor; a terminal leaves out its control characters and newlines, as parts/text-field's
one-line input does. The reveal is the `eye` icon (Show) or `eye-off` (Hide), one column at the
control's end, a stop of its own toggled by Enter or Space, its word said in the status line while
it has focus. Sealed, the row is `key-round`, eight `mask` glyphs and the set words, cut short with
`ellipsis`, then Replace as a one-row ghost button; Cancel is one too.

## Where sokkel-egui and sokkel-tui differ today

- sokkel-egui, as of 1a87987: no secret field.
- sokkel-tui, as of 64f4b19: parts/text-field's `masked` option draws each character as the
  `bullet` glyph, where the spec has `mask`; there is no reveal, no sealed state, no Replace or
  Cancel, and no set note.
