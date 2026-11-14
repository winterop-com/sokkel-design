# Dropdown menu

A menu of actions opened from a trigger. Rows a control tall with an icon, a label and the keys
that do the same; groups under labels; separators; check and radio rows with their marks in a
gutter at the start; rows that open a submenu beside them; and destructive rows in the destructive
ink. As wide as its widest row, every row a finger tall on a phone, and the arrows stop at its
first and last rows. The structured spec is [`dropdown-menu.json`](dropdown-menu.json).

Sources: sokkel-ui `packages/core/src/components/ui/dropdown-menu.tsx` (`DropdownMenu`,
`DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` with `variant` and `inset`,
`DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`,
`DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`,
`DropdownMenuSubContent`, `GUTTER`, `ROW_HEIGHT`), `ui/deferred-menu.tsx` and `ui/menu-engine.ts`
(Base UI's menu, fetched after the page is drawn, and the trigger's stand-in until then),
`lib/popup.ts` (`POPUP`, the look every popup wears), `lib/finger.ts` and `lib/focus.ts`. sokkel-ui-egui: `crates/core/src/widgets/menu.rs`
(`DropdownMenu`, `MenuItem`, `action_row`).

## Anatomy

| Piece | What it is |
|---|---|
| trigger | The control that opens it, most often a button or an icon button; below 768 a finger's hit area, centered |
| popup | The box under the trigger, 4 away, its start level with the trigger's; padded 4, in every popup's look; as wide as its widest row, at least the trigger and 128, at most the window less 32; scrolling when taller than the room |
| item | An action: its icon, its label, and the keys that do the same at its end |
| check item | A check row or a radio row: its check in the gutter, 6 from its start, while it is on |
| gutter | While the menu holds a check or radio row, every other row, label and submenu row steps in 28, so all words start at one edge |
| label | A group's name, small and muted |
| separator | A rule between groups, the menu's full width |
| shortcut | The keys at a row's end, small, tracked wide, muted |
| submenu row | A chevron at its end; washed while its submenu is open |
| submenu | A popup at its row's end, its first row level with it, in the menu's own look, at least 96 wide |

## Options

- `align` (`start` by default, `center`, `end`) and `side` (`bottom` by default); the menu moves to
  the other side when there is no room.
- The rows: actions with `variant` (`default` or `destructive`), `disabled` and `inset`; labels;
  separators; check rows; radio groups; submenus.
- Context made explicit (rule 2): `inGutter`, the menu holding a check or radio row
  (`has-[[role=menuitemcheckbox],[role=menuitemradio]]` on the popup), which steps every other row
  in 28.

## Sizes

The rows follow the density.

| | Value |
|---|---|
| popup | 4 all round, `radius-surface` |
| item, submenu row | `density.control` tall on one line (32 / 28): 6 across, 2 down around a 22 line; icons 16, 6 before the label; `text.body`; `radius-md`; a finger tall below 768 |
| check item | 28 at its start (the gutter), 6 at its end, its check 16 at 6 from the start; otherwise as an item |
| label | 6 across, 4 down; `text.badge` |
| separator | 1, 4 above and below, across the popup's pad |
| shortcut | `text.help`, tracked 0.1em |
| trigger | a `spacing-finger` hit area below 768 |

## States and tokens

| State | Paint |
|---|---|
| rest | popup: every popup's look, `popover`, `popover-foreground`, `radius-surface`, a 1px `border-strong` edge, `elevation-pop` under it, a submenu's the same. rows: the menu's ink, their icons too. label and shortcut: `muted-foreground` |
| highlighted | row: `accent` ground, `accent-foreground` ink, its icon and keys too |
| destructive | ink `destructive`, its icon too; highlighted, ground `destructive/10` (`destructive/20` in dark) |
| checked | the check shows |
| subOpen | the submenu row washed as highlighted |
| disabled | the row at 0.5 |

## Keyboard

- Tab reaches the trigger. On it, ArrowDown, ArrowUp, Enter and Space open the menu with its first
  row highlighted (its last on ArrowUp).
- In the menu: ArrowDown and ArrowUp move the highlight and stop at the first and the last row, as
  every list of choices does; Home and End go to them; a character moves to the next row whose
  label starts with it.
- Enter or Space does the highlighted row: an action closes the menu, a check row turns over and a
  radio row is chosen with the menu staying open, a submenu row opens its submenu. ArrowRight opens
  a submenu and ArrowLeft closes it.
- Escape closes the menu, focus back on the trigger.

## Words

None of its own. The app gives every row's label, the keys a shortcut shows, the groups' labels and
the trigger's name.

## Renderer-specific

- **sokkel-ui:** Base UI's Menu, fetched after the page is drawn; until it arrives the trigger is a
  stand-in that looks and reads the same, and a press or an arrow on it opens the menu once it is
  here. The menu is a portal. A submenu also opens under a resting pointer. The menu and its
  submenus stop at their ends (Base UI's `loopFocus` off). Focus goes back to the trigger after a
  keyboard close only. The trigger takes the finger hit area unless its `render` element places
  itself. `AccountMenu` and `NavBar` draw their menus with Base UI's menu at once, in the same popup
  look (`lib/popup`), rows and highlight.
- **sokkel-ui-egui:** `DropdownMenu::new(&items).show(&trigger)` returns the index pressed;
  `MenuItem` is an action, a label or a separator; `end()` lines the menu's end up with the trigger's.
  `tint`, `hint`, `id` and `keywords` serve the palette and the board.

## Where sokkel-ui-egui differs today

As of 26b411f (`menu.rs` unchanged since 5dd7c34), `DropdownMenu` draws actions 30 tall, 6 in, a 16
icon and 22 to the label, keys or a hint at the end, labels, separators, destructive and disabled
rows, the `accent` highlight under the pointer, and start or end alignment. The differences:
1. **Width:** at least 220 as well (the `width` default), with no most; the spec has the widest row,
   at least the trigger and 128, at most the window less 32.
2. **Row height:** 30 at every density; the spec has `density.control` (32 / 28).
3. **Edge and shadow:** a `foreground/10` stroke inside the box and one shadow (0 4, blur 12); the
   spec has every popup's `border-strong` edge and `elevation-pop`.
4. **Icons:** `muted-foreground` unless the row is lit, destructive or tinted; the spec has them in
   the row's ink.
5. **Keys at a row's end:** 1 of extra letter spacing and `muted-foreground` in every row; the spec
   tracks them 0.1em and turns them `accent-foreground` in a highlighted row.
6. **Destructive highlight:** `destructive/10` in dark too; the spec has `destructive/20` there.
7. **Story path:** the egui story is at `Primitives/Menus/Dropdown menu`; specimens pair by
   sokkel-ui's `Primitives/Menus/DropdownMenu`.
8. **Not built:** check and radio rows, the gutter, `inset`, submenus, `side`, finger rows and the
   trigger's hit area below 768, and the keys (the arrows stopping at the ends among them).
