# Problem

Something that went wrong, said for a person in a box of its own in the content. It opens with what
happened, in one sentence after the tone's mark. Then comes where the problem is and what a right
value looks like, with machine words marked by backticks drawn in the code face. The raw message a
program produced (a validator's, a stack trace) is folded away under Technical details, for whoever
needs it, and the app's actions follow. It is an error or a warning, on the tone's faint wash with a
rule in the tone at its start. The structured spec is [`problem.json`](problem.json).

Sources: sokkel-ui `packages/core/src/components/Problem.tsx` (`Problem`, `ProblemProps`,
`PROBLEM_WORDS`), `ProseText.tsx` (the backticked detail) and `Unfoldable.tsx` (the technical
details). `ProblemLine`, which `Problem` also exports, says a problem in one line with no box and is
not this part.

## Anatomy

| Piece | What it is |
|---|---|
| box | A column padded 12 across and 10 down, 6 between its lines, `text.body`; a 2px rule in the tone at its start, the end corners rounded by `radius-control`. `role=alert` for an error, `role=status` for a warning |
| head | The mark, then the title, 8 apart, set at the top |
| mark | 16 square, 2 down: `CircleAlert` in `critical`, or `TriangleAlert` in `warning` |
| title | `title`, `text.action`, in the ink of what it stands on |
| detail | `detail`, 24 in (under the title), `text.body` in `muted-foreground`; a string's backticked parts as code |
| code | A backticked part: the code face on `muted`, `radius-sm`, padded 4 across |
| technical | With `technical`: an unfoldable row 20 in, headed `words.technical` in `text.help` and `muted-foreground`, shut at first |
| technicalText | Open: the raw message in a `pre`, the code face, `text.help` in `muted-foreground` on `muted`, `radius-sm`, padded 8 across and 6 down, whitespace kept, long words broken anywhere |
| actions | With `actions`: 24 in, 4 more above them, 8 apart, wrapping |

## Options

`title`, `detail`, `technical`, `actions`, `tone` (`error` (default) or `warning`), `words`.

## States and tokens

| State | Box | Mark |
|---|---|---|
| rest (error) | `critical/6` ground, `critical` rule | `critical` |
| warning | `warning/6` ground, `warning` rule | `warning` |

It stands on `background` and also on `card` (a dashboard panel's failure) and `popover` (a dialog's
status), so the resolver writes its washes' opaque forms over all three.

## Keyboard

- Tab reaches the technical details' row, then each action.
- Enter or Space on that row opens or shuts the technical details.

## In cells

Each row on the tone's flat ground. A `rule-start` in the tone's rule color stands in the first
column, then 1 column of padding. The box has no blank rows inside. The mark takes 1 column and a
gap of 1 before the title, which is bold. The detail, the technical row and the actions are 2
columns in, under the title. The technical row is a chevron, a gap of 1 and the words. Open, the raw
message is 2 columns further in on the muted ground, its own line breaks kept. The actions are
one-row buttons after one blank row.

## Words

`technical` Technical details (`problem.technical`).

## Where the other renderers differ today

- sokkel-egui (1a87987): Problem was built before this spec and has not been compared against it.
- sokkel-tui (64f4b19): no problem yet.
