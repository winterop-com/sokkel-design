# Stat

One number with what it counts: runs today, the failure rate, the median duration. A change against an earlier period stands beside it, inked by whether the change is good, which the app says, since a rise in failures and a rise in runs mean opposite things. A state's dot may lead the label; as a tile it stands on a card of its own and may be one control that goes to what it counts; emphasis edges the one tile that asks for work in its dot's color, and size lg draws the one hero figure larger than its neighbors. The structured spec is [`stat.json`](stat.json).

Sources: sokkel-ui `packages/core/src/components/Stat.tsx`, `packages/core/src/components/Dot.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A column, 4 apart. As a tile: on card with a border-strong edge, rounded by radius-surface, padded 16, in card-foreground; with href or onSelect the whole tile is one control under its pieces. |
| label | What it counts, cut to one line, after the dot (8 apart): plain, text.xs in muted-foreground; as a tile, text.label in foreground. |
| dot | With dot: the color the app gives (a status's), small in plain, large in a tile. |
| value | The number in tabular figures, its unit and the change after it on one baseline, 8 apart; 4 more above it in a tile. plain: text.page at 500; tile: text.statistic; lg: text.statistic-hero. |
| unit | With unit: text.sm in muted-foreground. |
| change | With change: an arrow up and right (or down and right for a change written with a minus), 14, then the change, text.xs at 450 in tabular figures, 2 apart: muted-foreground when good is not given, good when good, critical when not. |
| note | With note: under the number; plain, text.xs in faint; in a tile, text.help in muted-foreground, wrapping evenly. |
| trend | With trend: a small chart under the number, 4 down, such as a sparkline. |

## Options

- `label`: What it counts.
- `value`: The number.
- `unit`: Its unit, after it.
- `change`: The change written for a reader: +12%, -0.4s; a minus turns the arrow down.
- `good`: Whether the change is an improvement; neutral when not given.
- `note`: A short qualifier under the number: vs last week.
- `trend`: A small chart under the number, such as a sparkline.
- `dot`: A color drawn as a dot before the label, such as a status's.
- `variant` (`plain`, `tile`; `plain` by default): plain sits in whatever holds it; tile is a card of its own.
- `href`: Where the tile leads, such as a list filtered to what it counts.
- `onSelect`: Called on a press on the tile.
- `emphasis` (`false` by default): Edges the tile in its dot's color at 55 percent alpha, `<dot>/55` (`status-failed/55` for a failed dot), as `primary/80` is primary at 80: the count that asks for work. The dot is a color the app gives, so no paint resolves it; a renderer draws the dot's color at that alpha.
- `size` (`md`, `lg`; `md` by default): lg draws the number at text.statistic-hero: the one hero figure, larger than its neighbors.

## Sizes

- container: gap `4`
- tile: padX `16`, padY `16`, gap `4`, radius `radius-surface`
- label: gap `8`
- value: gap `8`
- change: gap `2`
- md: text `text.statistic`. A tile's number; plain, text.page at 500.
- lg: text `text.statistic-hero`

## States and tokens

- rest: The number and what it counts; a change neutral.
- good: The change is an improvement: in good.
- bad: The change is a setback: in critical.
- hover: The pointer is over a tile that is a control: washed, its edge firmer.
- focus: Keyboard focus on the tile: the focus outline around it.
- tile at rest: ground `card`, edge `border-strong`, ink `card-foreground`, radius `radius-surface`.
- tile at hover: ground `hover`, edge `foreground/25`.
- label at rest: ink `muted-foreground`, text `text.xs`.
- value at rest: text `text.page`, weight `500`.
- unit at rest: ink `muted-foreground`, text `text.sm`.
- change at rest: ink `muted-foreground`, text `text.xs`, weight `450`.
- change at good: ink `good`.
- change at bad: ink `critical`.
- note at rest: ink `faint`, text `text.xs`.

## Keyboard

- Tab: Reaches the tile when it is a control.
- Enter (the tile has focus): Follows href, or calls onSelect.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-egui: As of fc9d27e: No public plain stat (only inside KpiRow), and that one has no dot or change and its value takes page-title tracking; the tile has no change and is always a control; the change sits 8 after the value, not 4 from its arrow; the accessible name is the label alone. The tile's paints match.
- sokkel-tui: As of b99664f its reports name no such part.
