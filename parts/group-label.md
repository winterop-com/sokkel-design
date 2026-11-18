# Group label

The small heading over a group of entries: a rail's group, a panel's section, a palette's kind, a table's run of rows. One look for all of them, in capitals, a little tracked, in the faint ink, so a theme or a change reaches every group at once. The structured spec is [`group-label.json`](group-label.json).

Sources: sokkel-ui `packages/core/src/components/GroupLabel.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| label | The heading's words, in capitals, tracked wide, at text.xs and 500, in faint. An element of the app's choosing (as), a p by default. |

## Options

- `as` (`p`, `h2`, `h3`, `h4`, `span`, `div`; `p` by default): The element it is drawn as, by where it sits in the page's outline: a heading where it heads a section, a p or a span where it only labels.
- `children`: The heading's words.

## States and tokens

- rest: The heading drawn.
- label at rest: ink `faint`, text `text.xs`, weight `500`.

## Keyboard

None of its own.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-egui: As of 1a87987, GroupLabel was built before this spec and has not been compared with it.
- sokkel-tui: As of b99664f its reports name no such part.
