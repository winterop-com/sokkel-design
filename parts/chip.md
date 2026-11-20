# Chip

A short value as a chip: a tag on a job, a state that has no run color, a value that is absent. Its tone says how it reads: neutral, a semantic color's wash with its own ink, outline (a hairline edge) or absent (dashed, muted). hue gives it a category's color instead, from the chart palette or a kind color. It may be a button (onSelect, a toggle with selected), a link (href), a menu's trigger (menu), and may end in a remove button (onRemove). No press on it reaches a row or a card around it. A badge says how loud a value is; a chip is a value that can be pressed, chosen, removed or opened. The structured spec is [`chip.json`](chip.json).

Sources: sokkel-ui `packages/core/src/components/Chip.tsx`, `packages/core/src/lib/kind.ts (KIND_CHIP)`.

## Anatomy

| Piece | What it is |
|---|---|
| container | The chip: rounded by radius-chip with a 1px edge (transparent but where a tone, hue or selection draws it), on one line, as wide as its words and never wider than its room, the words ending in an ellipsis. |
| face | What the chip says: its icon, then its words, 4 apart, padded across; the press when the chip is a button, a link or a menu's trigger, reaching over the chip's edge so it is as tall as the chip. |
| icon | Before the words, at the chip's icon size; an icon given its own size keeps it. |
| chevron | After the words of a menu's trigger, at 70 percent. |
| externalMark | After the words of an external link, an arrow up and right at 70 percent, with words for a screen reader saying it opens in a new tab. |
| remove | A button at the chip's end, its own stop in the tab order: an X, padded 2 and 2 in from the chip's end, rounded by radius-mini, at 70 percent until hovered. |

## Options

- `tone` (`neutral`, `good`, `critical`, `warning`, `info`, `outline`, `absent`; `neutral` by default): How it reads: neutral on a faint wash; good, critical, warning and info on their color's wash at 15 percent with its ink; outline only edged; absent, dashed in border-strong around muted words, for a value that is not there.
- `hue` (`1`, `2`, `3`, `4`, `5`, `blue`, `green`, `jade`, `pink`, `teal`, `violet`): A category's color, worn in place of the tone, for chips that tell kinds apart: one of the chart palette's five, set by a theme with the charts', or a kind color, the same paints as a badge's kind. Its wash at 12 percent, its edge at 30, its ink.
- `size` (`default`, `control`; `default` by default): default sits in a line of text or a table cell; control stands alone as a control does, as tall as a field or a button, and a finger tall below md.
- `mono` (`false` by default): The words in the code face, for an id, a tag or a key.
- `icon`: Drawn before the words.
- `title`: Said on hover: the whole value when the chip cuts it short, or what it means.
- `onSelect`: Makes the face a button. Its press stops at the chip.
- `selectLabel`: The button's or the link's name and tooltip, when a press does more than the words say ("Filter by harbor"); the words by default.
- `selected`: With onSelect, a toggle: the button says it is pressed, and the chip wears an edge in its own ink over a stronger wash.
- `menu`: Makes the face a menu's trigger, with a chevron after the words; a press opens the items (label, icon, onSelect, disabled, destructive) in parts/dropdown-menu's menu under the chip. It takes the place of onSelect and href.
- `menuAlign` (`start`, `center`, `end`; `start` by default): Where the menu lines up under the chip.
- `href`: Makes the face a link to what the chip names, through the app's link provider. It takes the place of onSelect.
- `external` (`false` by default): Opens href in a new tab, safely, with the external mark after the words.
- `open`: The menu open, held by the app; left out, the chip holds it (defaultOpen, onOpenChange).
- `onRemove`: Ends the chip in a remove button, named by words.remove. Its press stops at the chip.
- `children`: The words.

## Sizes

- default: height `20`, padX `6`, gap `4`, icon `12`, text `text.badge`, radius `radius-chip`. padX is the face's; with a remove button the face keeps only its start pad.
- control: height `density.control`, padX `10`, gap `4`, icon `14`, text `text.xs`, radius `radius-chip`, phoneMinHeight `spacing-finger`.
- remove: padX `2`, padY `2`, radius `radius-mini`. 2 in from the chip's end on each side (mx 2).

## States and tokens

- rest: The chip drawn.
- hover: The pointer is over a pressable face (its words underlined) or the remove button (washed, at full strength).
- focus: Keyboard focus on the face or the remove button: the focus outline, 1 out.
- selected: A toggle chip turned on: pressed, edged in its own ink over a stronger wash.
- neutral at rest: ground `faint/15`, ink `muted-foreground`.
- neutral at selected: ground `faint/35`, ink `foreground`, edge `foreground`.
- good at rest: ground `good/15`, ink `good-ink`.
- good at selected: ground `good/30`, ink `good-ink`, edge `good-ink`.
- critical at rest: ground `critical/15`, ink `critical-ink`.
- critical at selected: ground `critical/30`, ink `critical-ink`, edge `critical-ink`.
- warning at rest: ground `warning/15`, ink `warning-ink`.
- warning at selected: ground `warning/30`, ink `warning-ink`, edge `warning-ink`.
- info at rest: ground `info/15`, ink `info-ink`.
- info at selected: ground `info/30`, ink `info-ink`, edge `info-ink`.
- outline at rest: edge `border`, ink `foreground`.
- outline at selected: ground `faint/25`, ink `foreground`, edge `foreground`.
- absent at rest: edge `border-strong`, ink `muted-foreground`. The edge is dashed.
- hue-1 at rest: ground `chart-1/12`, edge `chart-1/30`, ink `chart-1`.
- hue-2 at rest: ground `chart-2/12`, edge `chart-2/30`, ink `chart-2`.
- hue-3 at rest: ground `chart-3/12`, edge `chart-3/30`, ink `chart-3`.
- hue-4 at rest: ground `chart-4/12`, edge `chart-4/30`, ink `chart-4`.
- hue-5 at rest: ground `chart-5/12`, edge `chart-5/30`, ink `chart-5`.
- hue-blue at rest: ground `kind-blue/12`, edge `kind-blue/30`, ink `kind-blue-ink`.
- hue-green at rest: ground `kind-green/12`, edge `kind-green/30`, ink `kind-green-ink`.
- hue-jade at rest: ground `kind-jade/12`, edge `kind-jade/30`, ink `kind-jade-ink`.
- hue-pink at rest: ground `kind-pink/12`, edge `kind-pink/30`, ink `kind-pink-ink`.
- hue-teal at rest: ground `kind-teal/12`, edge `kind-teal/30`, ink `kind-teal-ink`.
- hue-violet at rest: ground `kind-violet/12`, edge `kind-violet/30`, ink `kind-violet-ink`.
- hue-1 at selected: ground `chart-1/20`, edge `chart-1`, ink `chart-1`.
- hue-2 at selected: ground `chart-2/20`, edge `chart-2`, ink `chart-2`.
- hue-3 at selected: ground `chart-3/20`, edge `chart-3`, ink `chart-3`.
- hue-4 at selected: ground `chart-4/20`, edge `chart-4`, ink `chart-4`.
- hue-5 at selected: ground `chart-5/20`, edge `chart-5`, ink `chart-5`.
- hue-blue at selected: ground `kind-blue-ink/20`, edge `kind-blue-ink`, ink `kind-blue-ink`.
- hue-green at selected: ground `kind-green-ink/20`, edge `kind-green-ink`, ink `kind-green-ink`.
- hue-jade at selected: ground `kind-jade-ink/20`, edge `kind-jade-ink`, ink `kind-jade-ink`.
- hue-pink at selected: ground `kind-pink-ink/20`, edge `kind-pink-ink`, ink `kind-pink-ink`.
- hue-teal at selected: ground `kind-teal-ink/20`, edge `kind-teal-ink`, ink `kind-teal-ink`.
- hue-violet at selected: ground `kind-violet-ink/20`, edge `kind-violet-ink`, ink `kind-violet-ink`.
- face at rest: underline `False`.
- face at hover: underline `True`.
- remove at rest: opacity `0.7`.
- remove at hover: ground `hover`, opacity `1`.

## Keyboard

- Tab: Reaches the face when it is a button, a link or a menu's trigger, then the remove button; a plain chip takes no focus.
- Enter, Space (the face has focus): Presses the face (selects, toggles, follows the link or opens the menu) without pressing a row or a card around the chip.
- Enter, Space (the remove button has focus): Removes the chip, without pressing a row or a card around it.
- ArrowDown (the face is a menu's trigger): Opens the menu, as parts/dropdown-menu's trigger does.

## Words

- `remove` (`chip.remove`): "Remove"
- `newTab` (`chip.newTab`): "opens in a new tab"

## sokkel-ui only

- words.remove may be a function of the chip's words ("Remove harbor").
- Any other attribute of a span and ref go to the root, so a chip can be a tooltip or popover trigger's render target.
- The menu is parts/dropdown-menu (Base UI's), loaded when first opened.

## Where each renderer stands

- sokkel-tui: As of b99664f its reports name no such part.
