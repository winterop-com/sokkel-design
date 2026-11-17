# Board item panel

One work item of a board as a side panel's tab holds it, in two parts that work together.
`BoardItemPanel` draws a head with the item's code over its title and a line of its column's chip
and its labels. Its description, fields, checklist and activity follow, each a section of its own
(as parts/detail-pane draws them), drawn only when given. `BoardChecklist` is the checklist as such
a section: its heading says the steps done of the steps in all, a bar fills as far, and each step is
a checkbox field that ticks it, a done step's words struck through and quiet. The checklist is held
from outside: a tick calls `onStepChange`, and without it the steps are read only. The structured
spec is [`board-item-panel.json`](board-item-panel.json).

Sources: sokkel-ui `packages/core/src/components/board/BoardItemPanel.tsx` (`BoardItemPanel`,
`BoardChecklist`, `ChecklistStep`, their props and words), `PaneHeader.tsx` (`size="lg"`),
`SidePanel.tsx` (`PanelSection`), `CheckboxField.tsx` (`quiet="checked"`), `ui/checkbox-look.tsx`,
`ui/progress.tsx` and `ui/badge.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| head | Padded 16 by 12, at least `density.panel-head` tall, a 1px `border` rule under it; code, title and chips 8 apart |
| code | `text.xs` in the code face, `muted-foreground` |
| title | `text.detail-title` in the heading face, `section-head-ink`, wrapping |
| chips | The column's chip, then the labels, 6 apart, wrapping |
| state chip | A secondary badge: 20 tall, 6 across, the icon 12 and 4 before the label, `radius-chip`, `text.badge` |
| section | Description, Fields, Checklist, Activity: parts/detail-pane's section |
| description | `text.sm` on lines 24 tall |
| progress | A track 4 tall in `muted`, fully round, named `words.checklist.progress` |
| fill | The track's fill in `primary`, as far as the steps done |
| step | A checkbox field: 8 across, 6 down and up, 10 between box and words, `radius-control`, `text.sm`; the steps reach 4 into the padding |
| box | 16 square, `radius-sm`, an `input` edge; checked, `primary` with a 14 check in `primary-foreground` |

## Options

`BoardItemPanel`: `code`, `title`, `state` (`{ label, icon? }`), `labels`, `description`, `fields`,
`checklist` (`{ text, done }`), `onChecklistChange`, `activity`, `words`. `BoardChecklist`: `steps`,
`onStepChange`, `words`.

## States and tokens

| State | Paint |
|---|---|
| hover | A step's row on `hover` |
| focus (keyboard) | A step's box: the focus outline in `ring`, `focus-ring-width`, `focus-ring-offset` off |
| checked | The box `primary` with its check in `primary-foreground`; the words `muted-foreground`, struck through |
| read only | No `onChecklistChange`: the row at `disabled-opacity`, its box with it, cursor not-allowed |

In dark the empty box is washed `input/30`.

## Keyboard

- Tab moves from box to box; Space or Enter ticks or unticks the step.

## Words

`description` Description, `fields` Fields, `activity` Activity, `checklist.title` Checklist {done}/{total} (`Checklist 2/4`, said as a function of the steps done
and in all),
`checklist.progress` Checklist done.

## Where sokkel-egui differs today

As of 9038006 there is no board item panel or checklist.
