# Dashboard panel

The frame every dashboard panel shares. It is a box on the card ground. Its head holds the title, a
quiet subtitle such as the range the panel covers, a stale mark, the app's actions and the panel's
own tools: expand, the panel menu, and an arranged grid's grip and size. The content comes next,
padded or flush, then an optional foot. The panel spans part of a twelve-column grid, measured by
the grid's own width. A chart panel and a time series panel stand in it. A stat tile
(parts/stat-panel) draws a smaller head of its own on the same states. The structured spec is
[`dashboard-panel.json`](dashboard-panel.json).

Sources: sokkel-ui `packages/core/src/components/dashboard/DashboardGrid.tsx` (`DashboardPanel`,
`DashboardGrid`, `SPAN`, `PanelFailure`, `StaleMark`, `PANEL_STATE_WORDS`), `panel-tools.tsx`
(`PanelToolsProvider`, `PanelTools`), `Loaders.tsx` (`LoadingOverlay`), `Problem.tsx`,
`WindowedPane.tsx`; the charts package's `ChartPanel` and `TimeSeriesPanel` stand in it.

## Anatomy

| Piece | What it is |
|---|---|
| panel | `card`, a 1px `border-strong` edge, `radius-surface`, clipping; its span's columns of the grid |
| head | At least 40 tall, 12 across, 6 down, 8 between pieces, a 1px `border` rule under it |
| title | `text.sm` at 500, cut short; the subtitle 8 after it on its baseline |
| subtitle | `text.xs`, `muted-foreground` |
| stale | A 12 clock and since when, `text.xs`, `warning-ink` |
| tools | At the head's end, 8 apart: expand, the menu's button, an arranged grid's tools |
| tool | A `density.control-sm` square, `radius-md`, its icon `muted-foreground` (expand 14, the menu 16) |
| menu | parts/dropdown-menu, at the tool's end, 176 wide |
| body | 16 in all round unless flush or empty |
| loading bar | After 300 ms, a bar over the body, the content at half strength |
| empty | `words.empty`, centered, `text.sm`, `muted-foreground`, 16 across and 32 down |
| failure | What failed, the raw message folded away, Retry (outline, sm): parts/page-state's secondary failure, unframed |
| foot | 12 across, 6 down, a `border` rule over it, `text.xs`, `muted-foreground` |

## Options

`title`, `subtitle`, `span` (`sixth`, `quarter`, `third` by default, `half`, `two-thirds`, `full`),
`actions`, `menu`, `expandable` (with `expanded` and `onExpandedChange`), `fullscreen`, `loading`,
`empty`, `error` (with `technical` and `onRetry`), `stale`, `flush`, `footer`, `words`.

A span follows the grid's own width, never the window's. Wide, a span takes its named share of the
twelve columns. Tablet-wide, a sixth takes a third, a quarter half, and the rest the row. Phone-wide,
every span takes the row except a sixth and a quarter, which take half.

## States and tokens

| State | Paint |
|---|---|
| rest | the head over the content |
| hover | a tool on `hover`, its icon `foreground` |
| focus (keyboard) | a tool: the frame's focus outline in `ring` |
| loading | the body at 0.5 under the bar after 300 ms |
| empty | `words.empty` in the content's place |
| failed | the failure and Retry in the content's place; no stale mark |
| stale | the content kept, the stale mark in the head |
| expanded | the content in a full-screen dialog |

Loading, empty, failed and stale stay apart, so no reader takes a failure for no data
(principle 11).

## Keyboard

- Tab reaches the head's actions and tools, then the content.
- Enter or Space on expand opens the full-screen dialog.
- Enter, Space or ArrowDown on the menu's button opens the menu, which then takes parts/dropdown-menu's keys.
- Escape closes the menu or the dialog, and focus goes back to what opened it.

## Words

`expand` Expand, `menu` Panel actions, `empty` No data for this range., `failed` This panel could
not load., `retry` Retry, `stale` Not up to date. The panel's own words object is private.
`PANEL_STATE_WORDS` (`failed`, `retry`, `stale`) is exported.

## Where sokkel-egui differs today

As of 1a87987 there is no dashboard panel frame.

## Where sokkel-tui differs today

As of 64f4b19, drawn in cells as proposal c4 reads it (and the cells notes here say): the grid by its
own width, the head with the subtitle, the stale mark and the tools, the body padded or flush, the
foot; loading, empty, failed with Retry, and stale. Not yet: the expanded dialog and the panel
menu's own menu.
