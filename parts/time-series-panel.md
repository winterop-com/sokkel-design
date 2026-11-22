# Time series panel

A dashboard panel of values over time: lines over a fading or solid area or alone, side by side or
stacked, or in steps; a dashed series as a reference; a threshold scale's steps as dashed lines
across in their colors with their figures; and a legend under the chart as a row or a table of each
series' min, max, mean and current value. It stands in the dashboard panel's frame
([parts/dashboard-panel](dashboard-panel.md)) and draws [parts/chart](chart.md)'s `area`, `line` or
`step` kind. `ThresholdLegend` keys a threshold scale beside it. The structured spec is
[`time-series-panel.json`](time-series-panel.json).

Sources: sokkel-ui `packages/charts/src/dashboard/TimeSeriesPanel.tsx` (`TimeSeriesPanel`,
`SeriesFill`), `dashboard/series.ts` (`PanelSeries`, `PanelWords`, `seriesSpec`, `legendItems`),
`kinds/axes.ts` (`stepMarks`, `fading`), `kinds/categories.ts`, `ChartFrame.tsx`, `ChartLegend.tsx`,
and core `dashboard/ThresholdLegend.tsx` (`ThresholdLegend`, `thresholdBands`, `ThresholdWords`),
`dashboard/thresholds.ts` (`Threshold`, `thresholdColor`, `formatValue`) and
`dashboard/DashboardGrid.tsx` (`SPAN`).

## Where a check reads each value

The chart's height is the default `bodyClassName` (`h-48`) in `TimeSeriesPanel.tsx`; the fills,
the dashed widths and the threshold lines are literals in `kinds/categories.ts` and `kinds/axes.ts`;
`ThresholdLegend`'s sizes and paints are the classes it draws, on the server too; its words are its
private `WORDS`.

## Anatomy

| Piece | What it is |
|---|---|
| frame | parts/dashboard-panel's, spanning `span` of the grid's columns (`half` by default) |
| chart | 192 tall by default; `area`, `line` with `fill: 'none'`, `step` with `step` |
| series | A line over an area fading 40 to 4 percent (`gradient`), at 15 percent (`solid`), or none; stacked, solid at 55 |
| reference | A `dashed` series: a dashed line 1.25 wide, no area |
| threshold line | Each threshold after the first, dashed 1 wide across at its value, in its color, its figure at the end |
| legend | `list` (parts/chart's entries), `table` (`legendStats`: min, max, avg, current) or `none` |
| threshold legend | A list (12 swatches rounded `radius-mini` with a 1 wide `foreground/15` inset ring, 16 apart) or a bar (one strip 8 tall, bands 1 apart, values under the joins); `text.xs`; a title at 450; a hatched `muted` swatch for no data |

## Options

`x`, `series` (`{ name, values, color?, stack?, dashed? }`), `fill` (`none`, `gradient`, `solid`),
`stacked`, `step`, `thresholds`, `unit`, `decimals`, `format`, `min`, `max`, `labelEvery`, `legend`
(`list`, `table`, `none`), `legendStats`, `span` (`sixth`, `quarter`, `third`, `half`,
`two-thirds`, `full`), and the frame's own (parts/dashboard-panel). `ThresholdLegend`: `layout`
(`list`, `bar`), `labels`, `title`, `unit`, `decimals`, `format`, `noData`.

## Words

`category` Category, `series` Series, `value` Value (the data view's heads). `ThresholdLegend`:
`below` Below {value}, `range` {from} to {to}, `atLeast` {value} and up, `noData` No data.

## Where the renderers differ from the spec today

- **sokkel-egui:** as of 1a87987 it draws the mark, a target line across the chart; the fills,
  stacking, steps, dashed references, the legend and its table, `ThresholdLegend` and the frame are
  not built.
- **sokkel-tui:** built as of 64f4b19: lines in braille, one series' area in blocks, stacked and
  stepped series, dashed references, the legend as a row or a table, as the cells notes here say.

## Marks

`marks` draws lines across at values, such as a target or a limit, beside the thresholds: each
dashed, 1 wide, in its color token (`muted-foreground` by default), its label and value written
short at its end above it; the value axis reaches each where the figures do not (`ChartSpec`
`targets`, `ChartTarget`, in `kinds/axes.ts`). sokkel-egui's mark (b7e1763) draws the same.
