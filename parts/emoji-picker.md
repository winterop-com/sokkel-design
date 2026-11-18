# Emoji picker

The full list of emoji to pick one from, 320 wide and 384 tall on the popover's ground: a search
over the emoji's English names and keywords with a skin tone button beside it, a grid of 8 to a row
grouped by kind under headings that stay at the top as it scrolls (Recent first when there are
recent emoji), and a tab per group along the foot that scrolls to it and marks the one in view. A
picked emoji goes to `onPick` in the chosen tone with its English name, and joins the recent ones.
`EmojiPickerPopover` holds it in a popover opened from a trigger. The structured spec is
[`emoji-picker.json`](emoji-picker.json).

Sources: sokkel-ui `packages/core/src/components/EmojiPicker.tsx` (`EmojiPicker`,
`EmojiPickerPopover`, `EMOJI_PICKER_WORDS`), `emoji-data.ts` (`loadEmojiData`, `searchEmoji`,
`inTone`), `src/data/emoji-en.json` (the data set), `SearchField.tsx`, `Loading.tsx` (`Pending`)
and `hooks/use-stored.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| box | `popover` ground and `popover-foreground` ink, `text.body`; its container's corners |
| head | 8 in at the top and sides, 6 over the grid: the search field (parts/text-field's search) and the tone button, 6 apart |
| toneButton | A `density.control` square (a finger below 768), `radius-md`, the raised hand in the chosen tone at `text.emoji` |
| toneChoice | In the head's place while open: six hands spread across, the chosen on `muted` |
| grid | 8 in at its sides and foot, scrolling; a section per group, 8 cells to a row |
| heading | Sticky, on `popover`, `muted-foreground`, `text.badge`, 4 across, 6 over and 4 under |
| cell | A square (38 in the 320 box), `radius-md`, the emoji at `text.emoji`; only the last reached is a tab stop |
| tabs | A toolbar along the foot, ruled over in `border`, 6 by 4, 2 between tabs |
| tab | 28 square, `radius-md`, a 16 icon in `muted-foreground`; the current one in `primary-ink` over a 2 tall `primary` bar 4 under its foot |
| loading, failed, empty | A 24 spinner shown after 250 ms; the failure with an outline Try again; No emoji found; all `muted-foreground` |

## Options

`onPick`; `recent`, `onRecentChange` and `recentLimit` (24); `skinTone` (0 to 5),
`onSkinToneChange` and `skinTones` (on); `storeKey` (`emoji`: `emoji.recent`, `emoji.tone`);
`autoFocus` (on); `onClose`; `defaultQuery`. `EmojiPickerPopover` adds `trigger` or `anchor`,
`open`, `defaultOpen`, `onOpenChange`, `side` (`top`), `align` (`start`) and `closeOnPick` (on).

**Lazy.** The data set loads the first time a picker is drawn (a popover's trigger starts it as the
pointer reaches it or it takes focus), and keeps only the emoji the fonts draw as one colored glyph.
The first drawing holds 400 emoji; the rest follow a frame later, at once when a key or a tab asks.

**Search.** Every word of the query must be in the name or a keyword; those named by it come first,
then those whose name starts with it, then shorter names.

## States and tokens

| State | Paint |
|---|---|
| hover | a cell, tab or hand on `hover`; a tab's icon `foreground` |
| focus (keyboard) | a `focus-ring-width` ring in `ring/50`, no offset; a cell on `hover` too |
| current | the tab's icon `primary-ink`, its bar `primary` |
| chosen | the chosen hand on `muted` |
| disabled | the tabs at `disabled-opacity` while loading |
| phone | below 768 the tone button is a finger square |

## Keyboard

- Down from the search enters the grid; Enter in the search picks the first found.
- In the grid, Left and Right move across cells and sections, Up and Down by rows in the same column
  (Up from the first row back to the search), Home and End to the ends; it stops at the ends.
  Enter or Space picks.
- Along the tabs, Left and Right move between them, stopping at the first and the last; Enter or
  Space shows the group.
- Escape clears a query first (a popover stays open), then calls `onClose` or closes the popover,
  focus back on its trigger. In the tone choice, Escape closes it, focus back on the tone button.

## Words

`search` Search, `searchLabel` Search emoji, `groups.recent` Recent, `groups.smileys` Smileys and
emotion, `groups.people` People and body, `groups.animals` Animals and nature, `groups.food` Food and
drink, `groups.activities` Activities, `groups.travel` Travel and places, `groups.objects` Objects,
`groups.symbols` Symbols, `groups.flags` Flags, `results` Search results, `empty` No emoji found,
`loading` Loading emoji, `failed` The emoji could not be loaded, `retry` Try again, `skinTone` Skin
tone, `tones.default` to `tones.dark` Default, Light, Medium-light, Medium, Medium-dark, Dark, `tabs`
Emoji groups, `label` Emoji. The emoji's names come from the data set.

## Where sokkel-egui differs today

As of 1a87987 there is no emoji picker.
