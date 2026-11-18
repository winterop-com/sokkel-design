# Side panel

The panel beside a page at the window's end, as the shell's panel region holds it
([`patterns/shell`](../patterns/shell.md): `panel`, `panelToggle`, `panelStrip`). It has a head as
tall as the top bar and level with it, holding the panel's tabs, or its title when it has one tab.
The shown tab's content scrolls under the head, and the panel's start edge drags to resize it. The
panel has no close of its own: the shell's toggle in the head's end corner shows and hides it.
`PanelSection` is the titled section a tab holds: a quiet uppercase heading with optional actions at
the end of its line, over its content. The structured spec is [`side-panel.json`](side-panel.json).

PanelSection is kept here as a piece of the panel, not a part of its own. It has no frame, words or
keys of its own, and [`detail-pane`](detail-pane.md) (and `BoardItemPanel`) draw their sections
with it.

Sources: sokkel-ui `packages/core/src/components/SidePanel.tsx` (`SidePanel`, `SidePanelProps`,
`SidePanelTab`, `SIDE_PANEL_WORDS`; `PanelSection`, `PanelSectionProps`), `Shell.tsx` (`panel`,
`panelOpen`, `onPanelOpenChange`, `panelStrip`), `panel-strip.tsx`, `ResizeHandle.tsx`,
`hooks/use-panel-size.ts` and `GroupLabel.tsx`. Stories: Patterns/Side panel (Tabs, One tab, Sole
tab) and the Shell's Panel tabs stories.

## Anatomy

| Piece | What it is |
|---|---|
| panel | An `aside` on `sidebar`, the full height it is given, with a 1px `border-strong` edge at its start. 352 wide by default (`defaultSize`, or `width`), held between `minSize` 280 and `maxSize` 640 |
| edge | The resize edge (`ResizeHandle`, `grows={-1}`): an 8 wide hit area across the start edge. A 2 wide line in `primary` shows while it is hovered, focused or dragged. A double click puts back the default width |
| head | `h-shell-top`, the top bar's height, with a `border-strong` rule under it. Padded 8 at its start and 48 at its end, which leaves room for the shell's toggle (8 in the sheet). It drags the window in a desktop shell |
| title | With one tab and `soleTab="title"`, or in the sheet: an `h2` with the shown tab's label, `text.sm` at 500, padded 6 across and cut short. The panel is labelled by it |
| tabs | Otherwise a tablist (Base UI `Tabs`), tabs 4 apart. The content is their tabpanel |
| tab | 28 tall, padded 10 across, `radius-md`, `text.sm` in `muted-foreground`. The shown tab is on `secondary` in `foreground` at 500 |
| content | The rest of the height, scrolling |
| section | `PanelSection`: padded 16 by 12, its pieces 8 apart, with a 1px `border` rule under every section but the last |
| heading | `GroupLabel` as an `h3`: `text.xs` at 500, uppercase, tracked wide, in `faint` |
| heading row | With the section's `actions`: at least 28 tall, the actions at its end, 4 apart |

## Options

`tabs` (`{ id, label, icon?, content }`), `active` with `onActiveChange` or `defaultActive`,
`soleTab` (`title` by default, or `tab`), `resizable` (on), `defaultSize` (352), `width`, `size`
with `onSizeChange`, `minSize` (280), `maxSize` (640), `words`. PanelSection takes `title`,
`actions` and its content.

## In the shell

From `breakpoint-lg` (1024) the panel is the content's end column, open at the start. The column
eases between none and the panel's width over `motion-base`. Up to 1280 (`ROOMY` in `Shell.tsx`)
the rail narrows to its icons while the panel is open, unless the app or a screen asks for a rail
mode. Below `breakpoint-lg` the panel is the shell's sheet over the content, 48 short of the
window's far edge. In the sheet the panel takes the sheet's width, draws neither its start edge nor
its resize edge, and its head names the shown tab. With `panelStrip`, below `breakpoint-md` the tabs
move to the strip at the screen's foot (`PanelTabStrip`) and the sheet rises from it.

## States and tokens

| State | Paint |
|---|---|
| rest | Panel on `sidebar`, edge and head rule `border-strong`; title and its content in `sidebar-foreground`, the ink of the ground it stands on |
| hover | A tab that is not shown: `hover` ground, `foreground` ink. The edge: its line |
| focus (keyboard) | A tab: the button's focus look, a `focus-ring-width` outline in `ring`, `focus-ring-offset` off. The edge: its line |
| selected | The shown tab: `secondary` ground, `foreground`, weight 500 |
| dragging | The edge: its line |
| titled | One tab, `soleTab="title"`: the heading in the tabs' place |
| sheet | In the shell's sheet: no start edge, no resize edge, head padded 8 at its end |

## Keyboard

- On a tab: ArrowLeft and ArrowRight move focus to the tab before or after (wrapping), and Home and
  End to the first or the last, without showing it. Enter or Space shows it.
- On the edge: ArrowLeft makes the panel 16 wider and ArrowRight 16 narrower. Home and End go to
  `minSize` and `maxSize`, and Enter puts back the default width.

## Words

`resize` Resize the side panel (`sidePanel.resize`), the edge's name.

## In cells

A column at the content's end from lg (120 columns): 42 columns by default, held between 33 and 76.
It stands on `sidebar` behind a column of the box glyphs' `down` in `border-strong`, which is also
its resize edge, drawn in `primary` while focused or dragged. Below lg it is drawn over the page
from the window's end, keeping that column as its edge. The head is one row (tabs or title, 1
column in, 6 kept at its end for the toggle), then a rule row. A tab is one row padded 1, with
keyboard focus as `focus-ring-start` and `focus-ring-end` in the gap column. A section is padded 2
columns, with a blank row at its top and bottom at regular only. Its title is one row in `faint`,
with its actions at the row's end.

## Where the other renderers differ today

- sokkel-egui, as of 1a87987: SidePanel and the Shell's panel, PanelSection and GroupLabel are
  built, from before this spec, and not yet compared with it.
- sokkel-tui, as of b99664f: a side panel (`Shell::panel`) sits at the content's end on
  `side-panel.base.rest.panel` behind an edge. It covers the page below md (90 columns), where this
  spec covers it below lg. The detail pane for it is built (`DetailPane`, `PaneSection`). Not yet:
  its tabs and its head; its close, resize and words are not reported.
