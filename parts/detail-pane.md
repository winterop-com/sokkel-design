# Detail pane

One thing's detail as a side panel's tab holds it, such as the run, the file or the event chosen in
the page beside it. It draws titled sections one under the other, each with an optional sentence,
its facts as terms beside their values, and whatever else it shows after them (a preview, the steps
of a run, a change). The thing's verbs follow on a line at the end. Every section takes the panel's
width with a rule under it, and each section's terms line up in one column. The structured spec is
[`detail-pane.json`](detail-pane.json).

Sources: sokkel-ui `packages/core/src/components/DetailPane.tsx` (`DetailPane`, `DetailPaneProps`,
`DetailPaneSection`), `SidePanel.tsx` (`PanelSection`), `DescriptionList.tsx` and `GroupLabel.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| section | Padded 16 by 12, its pieces 8 apart, a 1px `border` rule under it, none under the last |
| heading | An `h3`: `text.xs` at 500, uppercase, tracked wide, in `faint`, the small heading every group shares |
| heading row | With the section's actions: at least 28 tall, the actions at its end, 4 apart |
| summary | A sentence over the facts, `text.sm` |
| facts | Terms (`text.xs`, `muted-foreground`) beside values (`text.sm`), 12 between, the pairs 8 apart; a missing value a dash in `faint` |
| content | The app's own: a preview, a run's steps, a change |
| actions | The thing's verbs on a line, padded 16 by 12, 8 apart, wrapping |

## Options

`sections` (`{ id, title, summary?, facts?, content?, actions? }`), `actions`, `termWidth` (`auto`
by default: the longest term, at most 40 percent of the section, or a CSS length).

## States and tokens

Only rest: the sections, then the verbs. The pane stands on the side panel's `sidebar` ground.

## Keyboard

None of its own; the controls in its content and its verbs keep theirs.

## Words

None: every word is the app's (the titles, the terms and values, the verbs).

## Where sokkel-egui differs today

As of 1a87987 there is no detail pane.

## Where sokkel-tui differs today

As of b99664f, `DetailPane` and `PaneSection` are drawn in the side panel on
`side-panel.base.rest.panel`, not yet compared against this spec.
