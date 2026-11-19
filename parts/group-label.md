# Group label

The small heading over a group of entries: a rail's group, a panel's section, a palette's kind, a table's run of rows. One look for all of them, in capitals, a little tracked, in the faint ink, so a theme or a change reaches every group at once. The structured spec is [`group-label.json`](group-label.json).

Sources: sokkel-ui `packages/core/src/components/GroupLabel.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| label | The heading's words, in capitals, tracked wide, at text.xs and 500, in faint. |

## Options

- `children`: The heading's words.

## States and tokens

- rest: The heading drawn.
- label at rest: ink `faint`, text `text.xs`, weight `500`.

## Keyboard

None of its own.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-ui only: `as` picks the element it is drawn as (`p` by default; `h2`, `h3`, `h4`, `span`, `div`) by where it sits in the page's outline. A renderer with no elements of its own marks a heading its own way, if at all.

- sokkel-egui: As of fc9d27e, drawn from this spec.
- sokkel-tui: As of b99664f its reports name no such part.
