# Chart

The look every chart kind shares. A chart takes rows, a `kind` that says how to draw them and the
fields to read, and draws in the theme it sits in: quiet axes, grid lines across the value axis,
series in the theme's categorical order, a tooltip on the popover's look, dashed lines at a scale's
steps and at marked categories, and a legend beside it that hides and emphasizes series. The kinds
are listed, not specified one by one yet; the frame around a chart (title, menu, export, expand,
data view, loading, empty, failed) is [parts/dashboard-panel](dashboard-panel.md). The structured
spec is [`chart.json`](chart.json).

Sources: sokkel-ui `packages/charts/src/look.ts` (`readLook`, `SERIES_ORDER`, `tooltipMarkup`),
`theme.ts` (`chartTheme`), `Chart.tsx`, `ChartLegend.tsx`, `legend-table.tsx`, `kinds/spec.ts`
(`withStatuses`, `ChartWords`), `kinds/axes.ts` (`stepMarks`, `categoryMarks`), `kinds/index.ts`
(`KINDS`), core `lib/status.ts` (`STATUS_CSS`), and `docs/charts.md`.

## Where a check reads each value

ECharts takes no classes, so a renderer and a test read the chart's look where sokkel-ui writes it:

- **Colors ECharts draws:** `look.ts` `readLook` names each token it resolves (`muted:
  token('muted-foreground')`, `border: token('border')`, `grid: mix('var(--border)', 65)`,
  `popover: token('popover')`, `faint: token('faint')`), and `theme.ts` `chartTheme` says where each
  is drawn (`axisLabel.color: look.muted`, `axisLine.lineStyle.color: look.border`,
  `splitLine.lineStyle.color: look.grid`).
- **Lengths ECharts draws:** literals in `theme.ts` (`grid` 4/10/10/4, `lineStyle.width: 1.5`,
  `symbolSize: 5` and `7`, `barMaxWidth: 28`, `legend.itemWidth: 10`, `itemGap: 14`, the pie's
  `borderWidth: 2`) and the size tokens `readLook` reads (`chart-text-size`, `chart-text-size-small`,
  `chart-stat-size`, `chart-stat-size-small`).
- **The palette:** `SERIES_ORDER` in `look.ts`.
- **The tooltip:** the class string in `tooltipMarkup` (`look.ts`).
- **The legend:** the classes `ChartLegend` draws, on the server too.

## Anatomy

| Piece | What it is |
|---|---|
| plot | Fills its box, no ground of its own; the grid keeps 4 at the start and foot, 10 at the end and top |
| axis line | The category or time axis' line, 1 wide in `border`; a value axis draws none; no ticks |
| axis label | `chart-text-size`, `muted-foreground`; a value axis hides overlapping labels; an axis name `chart-text-size-small` |
| grid line | Across at each value step, 1 wide, `border` 65 percent into `card` (oklab) |
| series | In order: the spec's `colors`, its `palette`, the theme's order `chart-2`, `chart-3`, `chart-4`, `kind-teal`, `kind-pink`, `kind-green`, `kind-blue`, `chart-5`. A line 1.5 wide, points 5 on hover; an area fading 40 to 4 percent of `card`; bars at most 28 wide, corners 0.4 of the radius; points 7 at 85 percent |
| reference | A dashed series, 1.25 wide, no area |
| step line | A scale's steps after the first, dashed across in their color (`muted-foreground` by default), the figure at the end in `chart-text-size-small` |
| mark line | A mark, dashed down at its category, its label at the top |
| axis pointer | A dashed `muted-foreground` line, or a 14 percent shade behind bars |
| tooltip | `popover`, a `border` edge, `radius-md`, `elevation-pop`, 10 by 6, `text.xs`; the category at 450; rows of a 10 swatch, the name in `muted-foreground`, the figure in the code face at 450 |
| legend | A wrapping row of entries 4 apart, or a list table of min, max, avg and current |
| legend entry | A button 24 tall (a finger below md), 6 across, `radius-md`, `text.xs` in `muted-foreground`; a 10 swatch rounded `radius-mini` |
| missing | Left out of a tooltip; written `—` where a figure is written |
| candleRise, candleFall | The candlestick's mark: a body from open to close, 60 percent of the band and at most 14 wide, edged 1 wide, and a wick 1 wide from low to high; a rise (closing at or above its open) in `good`, a fall in `critical` |
| ohlcBar | `ohlc.style` `bars`: a line 1.5 wide from low to high, a tick left at the open and right at the close, each 30 percent of the band and at most 7 long |
| volumeRise, volumeFall | `ohlc.volume`: a bar per category in a panel under the candles, a quarter of the height, in its candle's color 45 percent into `card` (oklab) |
| average | A moving average of the closes, a line 1.25 wide with no points, in its series color |

## Options

`kind` (the 28 kinds `KINDS` holds), `label`, `rows` and the fields a kind reads with `fieldNames`,
`palette` (the theme's order by default), `colors` (a token per name, `name/45` with an alpha),
`statuses` (`true`: each run state in `status-<state>`; or an app's `StatusMap`), `steps`, `marks`, `targets` (lines across at values, dashed, their label and value at the end, the value axis reaching each),
`format` with `unit`, `hidden` and `hovered`, `words`. The candlestick reads `ohlc` (`{ open, high, low,
close, volume?, style? }`, `style` `candles` or `bars`) and `averages` (spans, `[5, 20]`), and with
the linked kind `zoom` (`[from, to]` in percent or the first and last category in view).

## States and tokens

| State | Paint |
|---|---|
| hover | the axis pointer and the tooltip; a series emphasized, its points shown; a legend entry on `hover` in `foreground` |
| blurred | the other series: a line at 20 percent, an area at 4, a bar or point at 25 |
| focus (keyboard) | a legend entry: the focus outline in `ring`, drawn inside it |
| hidden | the series not drawn; its entry at `disabled-opacity`, label struck through, swatch hollow; ECharts' own legend in `faint` |

## Keyboard

- Tab moves between the legend's entries.
- Enter or Space hides or shows an entry's series; focus emphasizes it.

## Words

The chart's (`ChartWords`, private in `kinds/spec.ts`): `count` Count, `total` Total, `rise` Rise,
`fall` Fall, `change` Change, `low` Low, `lower` Lower quartile, `median` Median, `upper` Upper
quartile, `high` High, `outlier` Outlier, `ofFirst` of first, `target` Target, `observed` Observed,
`all` All, `to` to, `open` Open, `close` Close, `average` Average (a moving average's name before its span,
`Average 5`). The legend's (`LegendWords`, private in `ChartLegend.tsx`): `series` Series,
`min` Min, `max` Max, `avg` Avg, `current` Current.

## Kinds

bar, line, area, donut, pie, heatmap, scatter, histogram, boxplot, waterfall, funnel, bullet, radar,
rose, gauge, rings, dual, treemap, sunburst, sankey, calendar, parallel, stream, step, range, fan,
linked, candlestick. Each reads the look above; what each draws of its own is for later rounds
(open-questions.md), save the candlestick's, below.

### Candlestick

Prices or readings over time as open, high, low and close (`kinds/candlestick.ts`,
`kinds/legend-candles.ts`). A candle per category of `x`; several rows of one category make one
candle (the first open, the last close, the highest high, the lowest low, the summed volume). A
rise closes at or above its open and takes `good`, a fall `critical`, as a waterfall's rises and
falls; `colors` names others for the words Rise and Fall. The value axis fits the figures in view.
`ohlc.volume` adds a panel under the candles, a quarter of the height, on the same category axis,
named over its axis, its bars in their candle's color 45 percent into `card`. `averages` draws a
line per span, named `Average 5`, in the palette's order. `zoom` adds the linked kind's zoom: a
slider under the last panel, a drag or a pinch, moving both panels. The legend lists Rise, Fall and
each average, each hiding its series. The tooltip writes Open, High, Low and Close by `format` and
the first `unit`, each average, and the volume with the second `unit`.

## Where the renderers differ from the spec today

- **sokkel-ui:** ECharts on its canvas renderer, its parts loaded as an option first uses them;
  colors resolved from the theme to hex by `useChartLook`, again when the theme changes; a server
  draws the box alone.
- **sokkel-egui:** draws charts with its painter. As of 1a87987 the chart look is not built as a
  whole; StatPanel and TimeSeriesPanel draw their own.
- **sokkel-tui:** as of b99664f the look is drawn for the time series panel only (axes, grid, labels,
  the legend), its glyphs read from `glyphs.json`; the other kinds are not built.
