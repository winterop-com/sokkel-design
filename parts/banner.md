# Banner

A strip across the top of a screen or the app for a state that holds until it changes: the server
is not answering, a read-only instance, a pending upgrade. It shows the tone's mark, the words, the
app's actions at the end and a dismiss. It sits on the tone's wash with a rule in the tone under it.
It is one line where it fits. Where the strip is narrow the words wrap rather than lose what is
needed to act, and the actions move under them. In the shell it stands in the `banner` slot between
the top bar and the content, and does not scroll with the content (`patterns/shell`). The
structured spec is [`banner.json`](banner.json).

Sources: sokkel-ui `packages/core/src/components/Banner.tsx` (`Banner`, `BannerProps`, `BannerTone`,
`BANNER_WORDS`), `IconButton.tsx` (the dismiss), and `Shell.tsx` (`banner`, drawn in a `shrink-0`
box between the top bar and the page column, outside the scroller).

## Anatomy

| Piece | What it is |
|---|---|
| container | The strip: a row that wraps, padded 12 across and 6 down, 8 between pieces across and 4 between wrapped lines, with a 1px rule under it. `role=alert` in the critical tone, `role=status` in the others |
| mark | 16 square in the strip's ink: `CircleAlert` (critical), `TriangleAlert` (warning), `Info` (info), `CircleCheck` (good), or the app's `icon` |
| message | `children` in `text.body`, `flex-1 basis-3xs`: at least 256 on a shared line, else the actions wrap under it |
| actions | `actions`, at the end (`ms-auto`), 8 apart |
| dismiss | With `onDismiss`: `IconButton` (ghost, `icon-sm`, an `X`), named `words.dismiss`, its ink the strip's (`text-current`) |

## Options

`tone` (`critical`, `warning`, `info` (default), `good`), `icon`, `actions`, `onDismiss`,
`children`, `words`.

## Tones

| Tone | Ground | Rule under it | Ink |
|---|---|---|---|
| critical | `critical/12` | `critical/35` | `critical-ink` |
| warning | `warning/12` | `warning/35` | `warning-ink` |
| info | `info/12` | `info/35` | `info-ink` |
| good | `good/12` | `good/35` | `good-ink` |

The banner stands on `background` (the shell's ground) and also on `card` (a banner inside a
section's body, as the kitchen sink and forms place it), so the resolver writes the tones' opaque
forms over both: `flat` and `flatOn.card`. A terminal draws those, never the 12 percent wash.

## Keyboard

- Tab reaches each action, then the dismiss.
- Enter or Space on the dismiss calls `onDismiss`.

## In cells

One row: the tone's icon, a gap of 1, the words, the actions as one-row buttons at the end, and the
`x` dismiss last, 3 columns wide. The words never wrap. Words that do not fit are cut with the
ellipsis, and the whole is said in the status line's note (principle 23). The rule under it is not
drawn, since the flat ground marks the strip. A banner carries its actions and its dismiss in cells
as on the web, since they are the part's options. In the shell's banner slot it takes one row under
the top bar while it shows, and no row while there is none.

## Words

`dismiss` Dismiss (`banner.dismiss`).

## Where the other renderers differ today

- sokkel-egui (1a87987): Banner with its actions and the shell's banner slot were built before this
  spec and have not been compared against it.
- sokkel-tui (b99664f): four tones on the banner's own paints (`banner.{tone}.rest.container`), one
  row in the shell's slot under the top bar, the page a row lower while it shows, the words in the
  status line when cut. Whether it draws actions and a dismiss is not reported, and its words are
  not keyed by their message ids yet.
