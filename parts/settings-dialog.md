# Settings dialog

An app's preferences as one large dialog over the page it was opened from, on its own route
(principle 9). A head with the title and a close; the sections in a column under their group titles,
with a search over every setting at its top; the shown section's rows beside it, scrolling on their
own; and a footer with Reset to defaults for the shown section, a note that changes are kept as they
are made, and Done. Below 640 it fills the screen and the column is a list to go into. It wears the
box and the footer of [`parts/dialog`](dialog.md), and its reset asks through a ConfirmDialog. The
structured spec is [`settings-dialog.json`](settings-dialog.json).

Sources: sokkel-ui `packages/core/src/components/SettingsDialog.tsx` (`SettingsDialog`,
`SETTINGS_DIALOG_WORDS`, `phoneStart`, `resetScope`), `settings-parts.tsx` (`SettingsGroup`,
`SettingsSection` with `reset`, `Setting`, `SETTINGS_WORDS`, `filterSettings`, `shownSettings`,
`SettingsNavList`, `SettingRows`, `SettingsReset`), `SettingRow.tsx` (`SettingRow`,
`SettingRowLayout`), `SearchField.tsx`, `DialogShell.tsx` (`NESTED`, `ConfirmDialog`),
`ui/dialog.tsx`, and the route, `hooks/use-overlay-route.ts`. sokkel-ui-egui:
`crates/core/src/widgets/settings.rs` (`SettingsDialog`, `SettingsSection`, `SettingsWords`,
`SettingsOutcome`, `setting_row`, `setting_row_found_by`).

## Anatomy

| Piece | What it is |
|---|---|
| box | parts/dialog's box with no padding: 896 by 704, at most the window less 32 across and 64 down |
| head | 48 tall under a rule: the title, the close at its end; on a phone in a section, Back before the title |
| column | 224 wide under a rule at its end, scrolling on its own: the search, then each group under its title, 16 apart |
| search | Over every setting: it narrows the column to the sections with a match and the pane to the matching rows |
| group title | Small and muted over its sections; a group may have none |
| entry | A section: its icon and label, cut short. The shown one is marked. On a phone a finger tall with a chevron, none marked |
| pane | The shown section, scrolling on its own: its heading, its lead, its rows, its foot; "No setting matches the search." when nothing is left |
| row | One setting: its title, what it does under it, its control at the end while the row is 512 wide (else under its words), a note under both; rows ruled apart |
| footer | parts/dialog's band: Reset to defaults, the note, Done |
| reset | Reset to defaults, ghost, asking once more before it resets the shown section (or every setting with `resetScope="all"`); left out while the shown section says `reset: false` |
| saved | The note: "Changes are saved as you make them", or the app's own, announced as a status |
| done | Done, default, closing the dialog |

**The search** keeps a setting that holds every word typed in its title, its description, its
keywords, or its section's label or heading, so a search for a section's name keeps the whole
section. A section or group left empty is dropped, and the first section left is shown when the
chosen one has no match.

## Options

- `groups`: `[{ id, title?, sections: [{ id, label, icon?, heading?, lead?, foot?, settings, reset?
  }] }]`, each setting `{ id, title, description?, note?, control, layout?, keywords? }`. Data, the
  same on every target.
- `active` (the shown section), `search`, `phoneStart` (`list` by default, or `section`), `footer`
  (the app's note), `onReset` with `resetScope` (`section` by default, or `all`).
- A section's `reset: false` leaves Reset to defaults out while it is shown.
- A setting's `layout`: `auto` (default; at the end while the row is 512 wide, else below),
  `trailing` or `below`.

## Sizes

| | Value |
|---|---|
| box | 896 by 704, `radius-surface` |
| head | 48, padded 16 across (8 at its start on a phone), 4 between its pieces; the title `text.detail-title`; the close `density.control-sm` square, a finger square below 768 |
| column | 224 (the whole width on a phone), padded 12, 16 between the search and each group |
| group title | 8 across, 4 under it, `text.badge` |
| entry | 8 across, 6 down: 34 tall from 640; a finger tall below 768; 10 between the icon (16) and the label; `radius-md`; `text.body`; 2 apart |
| pane | 32 across (16 on a phone) and 20 down; the heading `text.detail-title`, 4 under it |
| row | 16 down; 32 between the words and a trailing control; the title `text.action`, the description `text.body` 2 under it; a control below its words 12 under them; the note 8 under, padded 10 by 6, `radius-control`, `text.help` |
| footer | parts/dialog's: 16 all round, 8 between its pieces, 65 tall at regular; the note `text.help` |

## States and tokens

| State | Paint |
|---|---|
| rest | box: parts/dialog's (`popover`, a 1px `foreground/10` ring, no shadow). head and column: `border` rules, no ground of their own. group title: `muted-foreground`, `text.badge`. entry: `muted-foreground`, `radius-md`. lead and description: `muted-foreground`. note: `muted` ground, `muted-foreground`. rows: a `border` rule between each two. footer: `muted/50` under a `border` rule. saved: `muted-foreground`, `text.help` |
| hover | entry: `hover` ground, `foreground` ink |
| focus (keyboard) | entry: a 2px `ring` outline |
| shown | entry: `secondary` ground, `foreground`, `text.action` |
| searching | the column and the pane narrowed, as above |
| noReset | no Reset to defaults in the footer |
| confirming | a ConfirmDialog over it ("Reset General to its defaults?", "Every setting in General goes back to its default.", a destructive Reset and Cancel); the settings dialog under it wears the nested shade |
| phoneList | below 640: the column fills the screen; entries a finger tall with a `faint` chevron, the box's ink, none marked; a section's reset left out |
| phoneSection | below 640: the pane fills the screen, with Back in the head |

## Keyboard

- Tab moves from the search through the entries, the pane and the footer, inside the dialog.
- Enter or Space on an entry shows that section (on a phone, goes into it).
- Escape closes the dialog: on `#/settings`, back to the page it was opened from.

## Words

`SETTINGS_DIALOG_WORDS`: `title` "Settings", `search` "Search", `searchLabel` "Search the
settings", `clear` "Clear the search", `noMatch` "No setting matches the search.", `saved` "Changes
are saved as you make them", `done` "Done", `reset` "Reset to defaults", `resetSection` "Reset
{section} to its defaults?", `resetSectionDetail` "Every setting in {section} goes back to its
default.", `resetAll` "Reset every setting to its default?", `resetAllDetail` "Every setting in every
section goes back to its default.", `resetConfirm` "Reset", `cancel` "Cancel", `close` "Close",
`back` "Back". The app gives every group's, section's and setting's words and its own footer note.

## The route

`#/settings` draws the dialog over the page it was opened from; Back, Done, the close or Escape
returns there. The shell owns the route (`patterns/shell`); in sokkel-ui `useOverlayRoute` draws it,
and in egui, which has no URL, settings is open state the app holds with a back stack.

## Renderer-specific

- **sokkel-ui:** the app holds `open`, `active` and `search`. From 640 the search takes focus on
  opening; on a phone the view in sight does, so no keyboard rises. The pane is keyed by the shown
  section, so a new section starts at its top. A row's `auto` layout is a container query (`@lg`,
  32rem). On a phone the footer pads its foot by the home indicator's inset. The backdrop's blur is
  the web's own (parts/dialog). `SettingsNavList` also draws the sections beside a settings page on
  the rail's ground; that page is not this part.
- **sokkel-ui-egui:** `SettingsDialog::new(id, sections, &mut active).show(ctx, rows)` returns
  `SettingsOutcome { close, reset }`; `rows` draws a section with `setting_row` or
  `setting_row_found_by`. The dialog holds its search and clears it on closing. `theme_settings`
  draws the appearance rows every app shares.

## Where sokkel-ui-egui differs today

As of 26b411f (`settings.rs` unchanged since bee2a97), `SettingsDialog` draws the box at 896 by 704,
the head (48, the title, a 28 close 16 from the end), the column (224, padded 12, the search, group
titles, entries 34 tall and 2 apart, the shown one on `secondary` at `text.action`), the pane padded
32 by 20 with the section's title and its rows, and the footer (65, `muted/50` under a rule, Reset to
defaults unless the section says `reset(false)`, the note, Done). The differences:
1. **Column ground:** `muted` at 30 percent; the spec has none of its own.
2. **Edge and shadow:** a stroke inside and a shadow (0 14, blur 44); the spec has parts/dialog's
   ring outside and no shadow.
3. **Height:** at most the window less 96; the spec has less 64.
4. **Search:** the column keeps every section, none marked, and the pane lists every section's
   matching rows. The spec narrows the column and shows one section.
5. **Group titles:** 12 under the search and 14 under the last entry, 10 to the first entry; the spec
   has 16, then 4 and 2. The titles stand 4 higher, later groups 2 lower.
6. **Entries:** the ink stays muted under the pointer, and keyboard focus draws no ring.
7. **Rows:** the control always at the end, no note, a rule under every row; the spec places the
   control by the row's width, adds the note, and rules only between rows.
8. **Reset** reports at once (`SettingsOutcome.reset`); the spec asks once more.
9. **Words:** `no_match` is "No setting matches"; `searchLabel`, `clear`, the reset's questions,
   `resetConfirm`, `cancel` and `back` are missing.
10. **Story path:** `Patterns/Settings dialog`; specimens pair by sokkel-ui's `Apps/Settings`.
11. **Not built:** the phone (the sheet below 640, the list and the section with Back,
    `phoneStart`), `resetScope="all"`, the app's footer note, a section's heading, lead and foot, the
    nested shade under the reset's question, Enter and Space on an entry, and the route.
