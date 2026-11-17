# Stat panel

One reading as a dashboard tile. It has a small title and the value written large with its unit.
It can also draw a faint trend behind the value, a change against an earlier period in its tone, a
note, and a meter toward a target. A threshold scale, or a fixed color token, picks the reading's
color. That color inks the value or fills the whole tile. A null value says there is no data. The
tile shares the dashboard panel's states (parts/dashboard-panel). The structured spec is
[`stat-panel.json`](stat-panel.json).

Sources: sokkel-ui `packages/core/src/components/dashboard/StatPanel.tsx` (`StatPanel`,
`TargetMeter`, `SparkArea`), `thresholds.ts` (`Threshold`, `thresholdColor`, `formatValue`,
`tokenVar`), `ThresholdLegend.tsx` (the key to the same scale), `DashboardGrid.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| tile | At least 112 tall (144 with a target), `radius-surface`, a `border` edge on `card`; filled, the tone as a gradient in `on-fill` |
| spark | The trend as a faint area across the foot, 45 percent of the height (a quarter with a target) |
| head | At least 28 tall, 10 across, 4 over, 4 between: title, change, info, menu, grid tools |
| title | `text.xs` at 500, `muted-foreground`, two lines at most |
| delta | An arrow (14) and the change in `text.xs` at 500, then what it is against; `good`, `critical` or `muted-foreground` |
| tool | 20 square, `radius-md`, `muted-foreground`: info (12) and the menu (14) |
| value | `text.statistic`, tabular; the unit 4 after at `text.sm` and 500; no data in `text.detail-title`, `muted-foreground` |
| note | `text.xs`, `muted-foreground` |
| meter | Under the value, 8 below it and 12 over the foot, at most 192 wide |
| track | 6 tall, `radius-mini`, the value's ink at 15 percent, filled as far as the reading |
| tick | 2 wide at the target, 4 over and under the track, `foreground` (`on-fill` when filled) |
| target label | `Target 99.5%`: `text.xs`, the figure in the code face, `muted-foreground` |
| failure | What failed at `text.xs` in `critical-ink`, then Retry |
| cover | With `href` or `onSelect`: the whole tile as one link or button |

## Options

`title`, `value`, `unit`, `decimals`, `format`, `thresholds`, `color`, `colorMode` (`value` by
default, `background`, `none`), `sparkline`, `delta`, `compared`, `good`, `target`, `targetRange`,
`note`, `info`, `menu`, `href`, `onSelect`, `span` (`sixth` by default), `loading`, `error` with
`onRetry`, `stale`, `words`.

A threshold scale is `[{ value?, color }]`: from each step's value up, a reading takes the step's
color token, and the first step covers everything below the second. The meter places the reading
and the target between `targetRange`, or between 0 and the larger of the two.

## States and tokens

| State | Paint |
|---|---|
| rest | `card`, `border`, `card-foreground` |
| hover | a tile that is a link: `hover` and a `foreground/25` edge; a tool's icon `foreground` |
| focus (keyboard) | the cover: the focus outline in `ring`, inside the edge; a tool: the outline in `ring` |
| inked | the value, its unit and trend in the reading's color (run time) |
| filled | the tile in the reading's color, no edge, inks `on-fill` (90, 85 or 80 percent for the quieter ones) |
| good / bad | the change in `good` / `critical` |
| noData | No data in `text.detail-title`, `muted-foreground`; no unit, trend, change or meter |
| loading | parts/dashboard-panel's |
| failed | the failure and Retry in the value's place |
| stale | the stale mark under the value |

## Keyboard

- Tab reaches the cover, then info, the menu and the grid's tools.
- Enter follows the link, and Enter or Space presses the button.
- Enter, Space or ArrowDown opens the menu, and Escape closes it.

## Words

`noData` No data, `info` About this panel, `menu` Panel actions, `loading` Loading, `target` Target,
`failed`, `retry` and `stale` as parts/dashboard-panel's. The tile's words object is private. The
value is written by `format`, else by `formatValue` in en-US (`3,526`, `99.3`).

## Where sokkel-egui differs today

As of b7e1763 `StatPanel` draws the target meter: `target(value, range)`, a 6 tall track, a tick at
the target, Target and its value under it, and the tile 144 tall. The rest of the tile is not built.
