# Select

One value chosen from a list. The trigger shows the chosen option, or the placeholder, with a
chevron at its end. The list it opens holds rows with an optional lead (an icon, or a theme's
swatch), the label, a quiet detail at the row's end or under the label, and a check on the chosen
one; groups under labels, separators between them, and arrows that scroll a long list. As a field
it wears the text field's frame (`parts/text-field`): the label, the help and the issue mark. The
structured spec is [`select.json`](select.json).

Sources: sokkel-ui `packages/core/src/components/ui/select.tsx` (`Select`, `SelectTrigger` with
`variant`, `size` and `widest`, `SelectValue`, `SelectContent`, `SelectItem` with `detail` and
`detailPlacement`, `SelectGroup`, `SelectLabel`, `SelectSeparator`, the scroll arrows),
`SelectField.tsx` (`SelectField`, `SelectFieldOption`, `OptionRow`, `chosenDetail`, `mono`),
`ThemePicker.tsx` (the theme select: `Choice`, `OptionLabel`, `Swatch`), `lib/appearance.ts`
(`ThemeOption.swatch`), `lib/issue-edge.ts` (`INVALID_EDGE`) and `lib/focus.ts`
(`returnFocusOnKeyboard`). sokkel-ui-egui: `crates/core/src/widgets/overlay.rs` (`Select`,
`paint_swatch`) and `crates/core/src/tokens.rs` (`Swatch`, `swatch`).

## Anatomy

| Piece | What it is |
|---|---|
| trigger | The control: the chosen option's lead and label (and its detail with `chosenDetail`), else the placeholder, and the chevron. As wide as what it shows, as the widest label with `widest`, or the room it is given (a field's select fills its row) |
| value | What the trigger shows, one line, cut short |
| chevron | A down chevron at the trigger's end, muted |
| list | The popup on the popover ground, scrolling when taller than the room. Laid over the trigger with the chosen row level with the value (`alignItemWithTrigger`), or under it, 4 away. As wide as the trigger and at least 144 |
| row | One option: lead, label, detail, and the check at its end on the chosen one. Washed while highlighted |
| lead | An option's icon, muted, or a theme's swatch, before the label in the row and in the trigger |
| swatch | A theme's sample: 28 by 16 on that theme's background with its edge, its foreground, primary and third chart color as three 6 dots, 2 apart. An option without a theme, among options with themes, draws an empty dashed box |
| detail | A quiet fact: at the row's end, or under the label (`detailPlacement="below"`); in the trigger with `chosenDetail` |
| check | The chosen row's check, 16, 8 from the row's end |
| group, group label | Rows under one label, padded 4; the label small and muted |
| separator | A rule between groups, the list's full width |
| scroll arrow | At the list's top or foot while it can scroll that way |

## Options

- `variant`: `field` (a form field's control) or `quiet` (a ghost button that shows the chosen
  value, for a value picked in a bar or beside a heading). `size`: `default` or `sm`.
- `options` (`{ value, label, icon?, detail?, disabled? }`), `value`, `placeholder`, `widest`,
  `detailPlacement` (`end` or `below`), `chosenDetail`, `mono`, `readOnly`, `disabled`.
- `swatch`: each option leads with its theme's swatch. In sokkel-ui this is the theme select's
  (`ThemePicker`, `ThemeOption.swatch`), not an option of `Select` or `SelectField` themselves; see
  the open questions.
- `alignItemWithTrigger` (default true): the list laid over the trigger when a pointer opened it and
  there is room. The theme select sets false.

## Sizes

The trigger follows the density; the list's rows do not.

| | Value |
|---|---|
| default | `density.control` (32 / 28); pads 10 at its start and 8 at its end; 6 between the value and the chevron; icons 16; `text.body`; `radius-control`; a finger tall below 768 |
| sm | `density.control-sm` (28 / 24); corners at most 10; otherwise as default |
| quiet | pads 8 at its start and 6 at its end; `text.action` |
| row | 30 tall at every density (4 over and under a 22 line), a finger tall below 768; pads 6 at its start and 32 at its end, where the check stands; `radius-md`; `text.body` |
| lead | an icon 16, 8 before the label in the row and 6 in the trigger; a swatch 8 before the label in both |
| detail | `text.help`; 8 after the label at the row's end |
| group | 4 all round; rows outside a group stand flush with the list's edge |
| group label | 6 across, 4 down; `text.help` |
| separator | 1, 4 above and below, across the group's pad |

## States and tokens

| State | Paint |
|---|---|
| rest | field trigger: ground `field`, edge `input`, the ink around it. quiet: no ground or edge, `text.action`. chevron: `muted-foreground`. list: `popover`, `popover-foreground`, `radius-surface`, a 1px `foreground/10` ring as its edge, Tailwind's `shadow-md` under it |
| placeholder | the value in `muted-foreground` |
| hover | field: nothing in light, `input/50` in dark. quiet: `hover` |
| focus (keyboard) | field: edge `ring` and a 1px `ring`. quiet: no edge, the 1px ring |
| open | field: no look of its own. quiet: `hover` |
| highlighted | row: `accent` ground, `accent-foreground` ink, and its lead, detail and check too |
| chosen | the check shows |
| disabled | trigger at 0.5, not focusable, `not-allowed`; a disabled row at 0.5 |
| readOnly | no look of its own; the list opens to look through |
| invalid | edge `critical/80`; with keyboard focus `critical` and a 3px `critical/20` ring (`critical/40` in dark) |
| noTheme | the swatch's edge dashed in `border-strong`, no ground |

The swatch wears its own theme (`data-theme-scope`): `background` ground, `border` edge, dots in
`foreground`, `primary` and `chart-3`, whatever the page wears.

## Keyboard

- Tab reaches the trigger; a disabled select is passed over.
- On the trigger: Enter, Space, ArrowDown or ArrowUp open the list with the chosen row highlighted.
  A character chooses the next option whose label starts with it, the list staying closed
  (nothing while `readOnly`).
- In the list: ArrowDown and ArrowUp move the highlight and stop at the ends; Home and End go to
  the first and the last; a character moves to the next matching row, past disabled ones; Enter or
  Space chooses and closes; Escape closes without choosing. Both put the focus back on the trigger.

## Words

None of its own. The app gives the select's name (its field's label, or an `aria-label`), every
option's label and detail, the groups' labels and the placeholder.

## Renderer-specific

- **sokkel-ui:** Base UI's Select; the list is a portal and opens on a mouse down, laid over the
  trigger only for a pointer and where there is room. Focus goes back to the trigger after a
  keyboard close only (`returnFocusOnKeyboard`). `widest` lays every label unseen in one grid cell.
  A hidden input carries the value. The theme select draws each swatch in its theme, opens under the
  trigger at most 320 tall, and is as wide as its widest row up to 384.
- **sokkel-ui-egui:** `Select::new(&mut chosen, options, label)` with the chosen option as an index;
  the list is egui's `Popup::menu`; swatches come from `tokens::swatch(theme, dark)`.

## Where sokkel-ui-egui differs today

As of 26b411f (`overlay.rs` unchanged since bee2a97), `Select` draws the field trigger at
`density.control` with the value, the chevron and an optional swatch, and a list of rows with a
check on the chosen one. The differences:
1. **Trigger width:** 220 unless set, where the spec has it as wide as what it shows or the room
   given.
2. **Trigger edge:** `ring` while open or focused, with the shared 2px focus ring 2 off; the spec has
   the ring edge and a 1px ring on keyboard focus only.
3. **Trigger hover:** `hover` in both schemes; the spec has nothing in light and `input/50` in dark.
4. **List:** always under the trigger with no least width; 4 all round inside; a stroke inside the
   box and one shadow (0 4, blur 12). The spec lays it over the trigger for a pointer, at least 144
   wide, rows flush outside a group, a ring outside and `shadow-md`.
5. **Rows:** `density.control` less 4 tall, the label 8 in, the check centered 14 from the end,
   highlighted in `hover`. The spec has 30 at every density, 6 in, the check 8 from the end, and
   the `accent` highlight.
6. **Swatch:** its corners half of `radius-control` rather than half of `--radius`; in a row 8 in
   rather than 6. In the trigger it matches (10 in, the label 36 in).
7. **Not built:** `sm`, `quiet`, the placeholder, `widest`, invalid, disabled and `readOnly`, option
   icons and details, disabled options, groups, labels and separators, scroll arrows, `mono`, finger
   rows below 768, and the keys.
