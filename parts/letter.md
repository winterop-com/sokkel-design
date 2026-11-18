# Letter

One letter in a thread of mail. Its head holds the sender's picture and name, their address while
open, and the time at the end, with a paperclip before it when files came along. Under the name it
shows the recipients while open, or the letter's first words while folded. The body follows under
the head, lined up with the name from 640 up. The head is a button that folds and unfolds the
letter, as a thread folds the letters already read; `foldable={false}` keeps a letter open (the
thread's latest), its head no button. A rule under each letter sets a thread's letters apart. The
structured spec is [`letter.json`](letter.json).

Sources: sokkel-ui `packages/core/src/components/Letter.tsx` (`Letter`, `LetterProps`,
`LetterSender`, `LetterWords`) and `PersonAvatar.tsx` (the picture at `md`).

## Anatomy

| Piece | What it is |
|---|---|
| letter | An article padded 16 across (24 from md) and 12 down and up, 20 under an open letter, a 1px `border` rule under it |
| head | The picture, then the name's column, 12 apart; a button with `aria-expanded` while foldable |
| avatar | 32 round, the initials where no picture is given |
| name | `text.sm` at 500, cut short |
| address | Open only: `text.xs` in `muted-foreground`, 8 after the name, not drawn below 640 |
| time | At the end: `text.xs` in `muted-foreground`, tabular figures, a 14 paperclip 4 before it named `words.attached` |
| line | `text.sm` in `muted-foreground`: the recipients while open (`words.to`), the snippet while folded |
| body | Open only: 12 under the head, its pieces 16 apart, indented 44 from 640 up |

## Options

`from` (`{ name, address?, image? }`), `to`, `time`, `attached` (off), `snippet`, `open` with
`onOpenChange` or `defaultOpen` (off), `foldable` (on), `children`, `words`.

## States and tokens

| State | Paint |
|---|---|
| rest | Folded: picture, name, time and snippet, no body |
| open | The address, the recipients, the body; 20 under the letter |
| focus (keyboard) | A foldable head: a `focus-ring-width` ring in `ring`, no offset, rounded `radius-control` |
| fixed | `foldable={false}`: open, the head no button |

## Keyboard

- Enter or Space on a foldable head folds or unfolds the letter.

## Words

`attached` Has attachments, `to` to {names}: the names joined by a comma and a space (`to me, linus,
margaret`).

## Where sokkel-egui differs today

As of 1a87987 there is no letter.
