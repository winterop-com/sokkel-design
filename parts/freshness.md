# Freshness

How fresh a reading is, as a console says it of a track or a sensor: Live while it is just in, then 3 s ago, 2 min ago, quieter once stale and in the warning tone once lost, the time of the reading in its tooltip. Every mark reads one shared clock. The structured spec is [`freshness.json`](freshness.json).

Sources: sokkel-ui `packages/core/src/components/Freshness.tsx`, `packages/core/src/hooks/use-clock.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| container | One line, never wrapping, in tabular figures, text.help; a dot 6 square before the words, 6 apart, while live, stale or lost. |
| words | Live under the live threshold; then the largest whole unit: seconds, minutes, hours, days, each with ago; No data with no reading. |
| dot | Live: good, pulsing. Stale: hollow, edged in faint. Lost: warning. Recent: none. |
| tooltip | Updated and the time of the reading, its date too once a day old. |

## Options

- `at`: When the last reading came; none for no reading.
- `now`: The moment to count from; without it, a clock shared by every mark.
- `thresholds`: live, stale and lost, in milliseconds of age: 5000, 60000 and 300000 by default.
- `dot`: The dot before the words.

## States

- live: Younger than the live threshold.
- recent: Heard from a while ago.
- stale: Getting old: quieter.
- lost: Too old to trust, or never heard from: the warning tone.
- rest: The mark drawn, before its age is known to be live, recent, stale or lost.

## Words

- `live` (`freshness.live`): "Live"
- `never` (`freshness.never`): "No data"
- `seconds` (`freshness.seconds`): "{count, number} s ago"
- `minutes` (`freshness.minutes`): "{count, number} min ago"
- `hours` (`freshness.hours`): "{count, number} h ago"
- `days` (`freshness.days`): "{count, number} d ago"
- `updated` (`freshness.updated`): "Updated {time}"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
