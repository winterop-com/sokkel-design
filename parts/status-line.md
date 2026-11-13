# Status line

The foot strip across the window's bottom edge. A short note at its start, in its tone, and short
facts at its end, on one row of fixed height that never grows. It stands level with the rail's foot
cell, so the account and the status read as one bar. The structured spec is
[`status-line.json`](status-line.json).

Sources: sokkel-ui `packages/core/src/components/StatusLine.tsx` (`StatusLine`, `StatusLineProps`,
`StatusTone`, `StatusItem`). `Shell.tsx` draws the strip around it (its `footer`, and an empty strip
beside the rail's foot cell when there is no foot), and `Rail.tsx` the foot cell beside it.
sokkel-ui-egui: `crates/core/src/widgets/frame.rs` (`StatusLine`, `StatusTone`).

## Anatomy

| Piece | What it is |
|---|---|
| strip | `spacing-shell-foot` tall, `page-foot-ground` under a `page-foot-line` rule, across the window under the content and the panel, beside the rail's foot cell |
| note | The short note at the start, in its tone's ink, on one line; cut short first |
| live dot | With `live`: an 8 dot before the note in its ink, a second one pulsing out from it |
| facts | `StatusItem`s at the end, 12 apart, kept to at most 70 percent of the row |
| item | An optional `label` in `faint`, then the value; with `code`, an identifier in the code face |

## Options

- `note`; `tone`: `quiet` (default), `live` (something going now, said as information, not a
  warning), `warn`, `error`; `live` for the pulsing dot.
- The facts: `StatusItem` with `label`, the value, and `code`.

## Sizes

| | Value |
|---|---|
| Strip | `spacing-shell-foot` (46) at both densities; pad 12 at each end; `text.help` |
| Row | the note, the room between and the facts, 12 apart |
| Note | the dot 8 before the words |
| Live dot | 8 round |
| Facts | 12 apart; label to value 6 |

Nothing wraps. A long note is cut short with an ellipsis, then a long fact.

## States and tokens

| State | Paint |
|---|---|
| rest | strip: `page-foot-ground`, rule `page-foot-line`, ink `page-foot-ink`. note: `page-foot-ink` |
| toneLive / toneWarn / toneError | note: `info` / `warning` / `destructive` |
| live | the dot in the note's ink, its pulse at half opacity, still when motion is reduced |
| code | a fact's value in `foreground`, in the code face. A plain value stays in `page-foot-ink`; a label is `faint` |

## Keyboard and words

No keys and no words of its own. The app gives the note and every fact.

## Renderer-specific

- **sokkel-ui:** the shell's `footer` draws the strip (ground, rule, height, pad, ink) and
  `StatusLine` draws the note and the facts in it. A shell with a bottom strip and a rail foot but
  no `foot` draws the strip empty. The pulse is `animate-ping`, which `motion.css` stills when motion
  is reduced.
- **sokkel-ui-egui:** `StatusLine` draws the strip and its contents in the rect the `Shell` gives
  its foot, laying out galleys cut short with an ellipsis.

## Where sokkel-ui-egui differs today

As of 267236c, `StatusLine` draws the strip at `spacing-shell-foot` with its ground, rule and
tones. The differences:
1. **Padding and gaps:** 16 at each end and 16 between facts. The spec says 12.
2. **The dot:** a still dot before the note in every tone but quiet, with no `live` option. The spec
   draws a dot only with `live`, pulsing.
3. **Item values** are in `foreground` in the body face. The spec keeps a plain value in the foot's
   ink and draws only a `code` value in `foreground`, in the code face.
4. **Room:** the note takes up to half the row. The spec keeps up to 70 percent for the facts and
   cuts the note first.
