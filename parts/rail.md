# Rail

The app's places down the window's start. A head with the mark and the name, groups of entries,
and a foot cell for the account. Expanded, an entry is its icon and label, with a description
under it when it has one. Collapsed, the rail is its icons alone, each named in a tooltip. As a
strip, it is a narrow column of icons over short labels. Its end edge resizes it, and pulled
outward expands a collapsed rail. The structured spec is [`rail.json`](rail.json).

Sources: sokkel-ui `packages/core/src/components/Rail.tsx` (`Rail`, `RailProps`, `RailGroup`,
`RailEntry`, `RailWords`/`RAIL_WORDS`, `rowClass`, `iconClass`, `HEAD_BUTTON`, `Strip`),
`ResizeHandle.tsx` (the edge), `GroupLabel.tsx` (the group title), `Count.tsx` (a count over an
icon), `RailDrops.tsx` (reordering), `shell-context.ts` (`ShellDrawer`, `ShellRailMode`,
`ShellFootCell`, `ShellDesktop`), `Shell.tsx` (the drawer and the foot row),
`hooks/use-panel-size.ts`. sokkel-ui-egui: `crates/core/src/widgets/frame.rs` (`Rail`, `RailGroup`,
`RailEntry`).

## Anatomy

| Piece | What it is |
|---|---|
| frame | The column, the window's full height: `sidebar` ground, a 1px edge at its end |
| head | As tall as the top bar (`spacing-shell-top`), so the top bar's rule ends level with it. It draws no rule of its own, in the frame or in the drawer. Expanded: the mark and the name (one link home with `markHref`), then the collapse control at its end, or in the drawer the control that closes the drawer. Collapsed: the mark alone, which expands the rail and shows the expand icon under the pointer |
| groups | A titled group's title in upper case (`GroupLabel`); a group without a title stands at the top. Collapsed, a rule takes each title's place |
| entry | Mark (an icon, a color `dot`, or nothing in a rail of text), label, optional `description` under the label, and at its end a count, an unread dot or a parent's chevron. The active one wears a 2 wide bar at its start over a wash |
| parent | An entry with `entries`. Expanded, a chevron at its end folds them under it, lined up under its label. A parent with a page of its own has its own chevron button; one without folds on a press anywhere on its row. Collapsed or in a strip, it opens them in a flyout beside the rail |
| icon entry | Collapsed: a tile 36 wide and `density.row` tall, its icon alone, a count or dot at its corner, named in a tooltip beside it |
| edge | `ResizeHandle` along the end edge: an 8 wide hit area, a 2 wide `primary` line while hovered, focused or dragged |
| foot cell | The account control's cell, `spacing-shell-foot` tall, level with the status line. In a shell with a foot it is drawn in the shell's foot row on the foot's ground (`ShellFootCell`) |
| body | With `body`, app content in place of the groups (a tree with its search), under a row back to the places ("All places") |
| strip | `variant="strip"`: 72 wide, the workspace's tile at the top, each entry a 36 tile over its 11px label, the foot's items stacked at the bottom. It neither collapses nor resizes |

The places are data (`RailGroup`: `{ id, title?, entries, onReorder? }`; `RailEntry`: `{ id,
label, description?, icon?, href?, active?, count?, unread?, dot?, keywords?, entries?, drop? }`),
the same on every target. The command palette lists them too (`placeCommands`).

## Options

- `variant`: `nav` (default) or `strip`.
- `collapsed` with `onCollapsedChange`. Without the handler there is no collapse control.
- `size` with `onSizeChange`, else the rail holds its own from `defaultSize` (240), between
  `minSize` 200 and `maxSize` 360. `resizable={false}` keeps it fixed.
- `mark`, `name`, `markHref`, `foot`.
- `expanded` with `onExpandedChange`, or `defaultExpanded`. A parent holding the active entry starts
  unfolded. `defaultFlyout` names a flyout open at the start.
- `body` with `view` (`places` or `body`) and `onViewChange`.
- Context made explicit (rule 2):
  - `narrowed`: the shell's `railMode="collapsed"`, `useRailMode`, or an open panel on a window
    under 1280 (`ShellRailMode`). The rail draws collapsed whatever the app holds, and its mark and
    edge widen it until the ask changes.
  - `inDrawer`: the shell's drawer below 768 (`ShellDrawer`). The rail is drawn expanded, without
    its edge, and the head's control closes the drawer with the shell's `close` word.
  - `docked`: a shell with a foot or a bottom strip (`ShellFootCell`). The foot cell stands in the
    shell's foot row.
  - `trafficLights`: a desktop window with its title bar hidden (`ShellDesktop`). The head leaves
    `spacing-traffic-lights` at its start and drags the window.

## Sizes

| | Regular | Compact | |
|---|---|---|---|
| Head | 46 | 46 | `spacing-shell-top`; pad 12, gap 8; mark tile 32 square, `radius-md` |
| Entry | 40 | 34 | `density.row`; a finger (44) tall below 768. Pad 12 both ends, the 2 wide bar inside the start pad; gap 12; icon 16; `text.body` |
| Described entry | at least 40 | at least 34 | grows with its description (`text.help`); pad 6 down; the icon and the end level with the label |
| Icon entry | 40 x 36 | 34 x 36 | collapsed; icon 16 |
| Foot cell | 46 | 46 | `spacing-shell-foot` |

Fixed at both densities: the rail 240 wide (200 to 360), 57 collapsed (3.5rem and its edge), 72 as
a strip. Groups pad 8 across, entries 4 apart. A group title has 16 above it, a 20 line and 6 below,
8 in (16 from the rail's start), in `text.badge`, upper case and tracked 0.025em. A collapsed rail
keeps the same room and centers its 1px rule in that 20 line. A group without a title at the top
keeps 4 above its first entry, room for the entry's focus look. Expanded entries have `radius-sm` at
the start corners and `radius-md` at the end. A child row pads its start 38 under a parent with an
icon, so its label stands under the parent's, and 22 in a rail of text. The chevron button is 28,
4 from the row's end. A count over an icon is 16 tall, fully round, 11 text at 600, and 99+ above
99. The unread dot is 8. The edge moves 16 a press. A flyout is at least 176 wide, 12 beside a
collapsed rail (8 beside a strip). A tooltip is the library's one (`parts/tooltip`), 8 away. The width
eases over `motion-base` (200 ms) as far as motion allows.

## States and tokens

| State | Piece: paint |
|---|---|
| rest | frame: `sidebar`, ink `sidebar-foreground`, edge `border-strong`. mark: `primary` / `primary-foreground`. name: `text.detail-title` tracked -0.025em. group title: `faint`, `text.badge`. entry: ink `muted-foreground`, no ground. description: `muted-foreground`, `text.help`. count: `foreground` at 600. unread dot: `foreground`. chevron: `muted-foreground`. corner count: `critical` / `critical-foreground` at 600, ringed 2 in `sidebar` |
| hover | entry, icon entry, collapse control: ground `hover`, ink `foreground`. chevron button: ground `hover`. strip entry: ink `foreground`, its tile `hover` |
| focus (keyboard) | every control of the rail (the home link, the collapse control, the collapsed mark, an expanded, icon or strip entry, a parent's chevron button): the button's own focus look, a 2px `ring` outline 2 off. edge: its line shows |
| active | entry: ground `sidebar-accent`, ink `sidebar-accent-foreground` at 500, a 2 wide `sidebar-primary` bar at its start; hover leaves it as it is. Its description: `sidebar-accent-foreground/75`. icon entry and strip tile: `sidebar-accent` / `sidebar-accent-foreground` |
| holding | a parent unfolded over the active entry: ink `foreground` at 500 |
| open | a collapsed parent or a strip parent while its flyout is open: ground `hover`. An unfolded parent's chevron turns 90 degrees |
| collapsed | icons alone; `border-strong` rules in the titles' places |
| dragging | the edge's line shows |
| docked | foot cell: `page-foot-ground` under a `page-foot-line` rule, ink `sidebar-foreground`, its end edge `border-strong` |
| drawer | expanded, no edge, the head's control closes the drawer |

## Keyboard

- Tab reaches the home link, the head's control, each entry (a parent's row, or its link and its
  chevron button) and the edge.
- Enter follows an entry's link. On a parent without a page of its own it folds or unfolds it, and
  on a collapsed parent it opens the flyout.
- In the expanded rail, ArrowRight unfolds the focused parent. ArrowLeft folds it, and from one of
  its entries folds it and moves focus to its row (`RailParent`'s `keys`).
- On a collapsed rail's edge, Enter, Space or ArrowRight expand the rail (`ResizeHandle`'s
  `onExpand`).
- On the expanded rail's edge, ArrowLeft and ArrowRight move it 16 a press and Home and End go to
  the narrowest and the widest. Enter, or a double click, puts back `defaultSize`.
- In a group with `onReorder` inside `RailDrops`, Alt with ArrowUp or ArrowDown moves the focused
  entry a place, and focus stays on it.
- Escape closes an open flyout. In the drawer it closes the drawer (the shell's).

## Words

`RAIL_WORDS`: `collapse` "Collapse the navigation", `expand` "Expand the navigation", `resize`
"Resize the navigation", `unread` "Unread" (the dot's name), `places` "All places" (the row back
from a body). In the drawer the head's control says the shell's `close`. The app gives its name,
every group title, label, description and keyword, and a body's title.

## Renderer-specific

- **sokkel-ui:** entries and the home link are `Link`, drawn as the app's `LinkProvider` says, and
  the active entry says `aria-current="page"`. Tooltips are the library's one (`parts/tooltip`) and
  flyouts Base UI's popover, and a flyout opened from the keyboard focuses its first entry. Reordering loads the drag engine only inside
  `RailDrops`. A body stays mounted while hidden. In a desktop window the head is a drag region.
- **sokkel-ui-egui:** there are no URLs, so a press sets the app's active place. The rail fills the
  rect the `Shell` gives it, and a width the reader drags is app state the `Shell` is told. A
  collapsed entry's name shows in the library's tooltip.

## Where sokkel-ui-egui differs today

As of 267236c, `Rail` has titled groups, entries with an icon and a count, the active bar and wash,
the hover wash, and collapse at 240 / 57 with hover names. Its head, entry rows and group titles match
sokkel-ui within a point. The differences:
1. **Entry inset:** the icon at 10 and the label at 38, where the spec's 2 wide bar inside a 12 pad
   puts them at 12 and 40.
2. **Corners:** the active row's start corners are 2, and the hover wash is `radius-md` all round.
   The spec has `radius-sm` (3.5, floored to 3) at the start and `radius-md` at the end in every
   state.
3. **Count weight:** 500 (`TextRole::Badge`), where the spec says 600.
4. **Collapsed groups:** 26 from one group's last entry to the next one's first, with the rule 20
   down. The spec keeps the title's room, 46, with the rule 26 down.
5. **Keyboard focus:** entries paint none, where the spec draws the button's focus look.
6. **Collapsed entry tooltip:** egui's own `on_hover_text` (`frame.rs:202`), where the spec has the
   library's one tooltip (`parts/tooltip`), 8 away.
7. **Not built:** descriptions, the unread and color dots, entries without icons, parents, counts
   over a collapsed icon, the head's collapse control and the mark as the expand control,
   `markHref`, resizing and expanding by the edge, the strip, a body, reordering, the drawer,
   finger-tall rows below 768, and room for the window's buttons.
