# Track roster

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

The tracks a console watches as one list: a table's list (parts/table) of track-card rows gathered under their affiliations' heads, friend first, each head with its count and folding its group; its bar holds a search, filters on the affiliation, the kind and the states, and a sort menu, the list having no column heads. The track picked is drawn as chosen and shared with a map; one picked from outside unfolds its group and comes into view without taking the focus. The structured spec is [`track-roster.json`](track-roster.json).

Sources: sokkel-ui `packages/core/src/components/TrackRoster.tsx`, `packages/core/src/components/DataTable.tsx`, `packages/core/src/components/TrackCard.tsx`, `packages/core/src/components/FilterBar.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A table in its list look (parts/table), rows as tall as their cards, never stacking. |
| bar | The search (placeholder Search), the count, the sort menu (Name, Affiliation, Kind, Last heard: the freshest first) and, under them, the filter bar. |
| groupHead | A dot in the affiliation's color and its name, the count after it; a press folds the group. Order: friend, hostile, neutral, unknown, pending. |
| row | A track card unframed (parts/track-card), padded 6 across the row's own inset; the picked track's row drawn as the table's chosen row. |

## Options

- `tracks`: The tracks: id, name, kind, affiliation, and what the card shows.
- `selected`: The id of the track picked.
- `onSelect`: Hears the track pressed.
- `onAffiliationChange`: Makes each card's affiliation a menu.
- `filters`: The filters, held by the app or by the roster.
- `sort`: The order: name (the default), affiliation, kind or updated.
- `foldedGroups`: The affiliations folded.
- `framed`: false for a panel that draws its own frame.

## States

- rest: The tracks under their heads, sorted by name.
- selected: A track picked: its row drawn as the table's chosen row.
- empty: No tracks, or none kept: No tracks.

## Keyboard

- /: Focuses the search.
- ArrowUp, ArrowDown: Moves the active row, as the table does; the group heads are no stops of theirs.
- Enter (the list has focus): Picks the active track (onSelect).

## Words

- `search` (`trackRoster.search`): "Search"
- `affiliation` (`trackRoster.affiliation`): "Affiliation"
- `kind` (`trackRoster.kind`): "Kind"
- `state` (`trackRoster.state`): "State"
- `name` (`trackRoster.name`): "Name"
- `freshest` (`trackRoster.freshest`): "Last heard"
- `empty` (`trackRoster.empty`): "No tracks."

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
