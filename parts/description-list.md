# Description list

Facts about one thing as terms and values: a run's state and duration, a service's base address. A value that is missing is a quiet dash, never a blank. The pairs stand side by side (each term in a column beside its value, every pair sharing the list's term column), stacked (each term over its value) or in a row that wraps, for a strip of facts under a title; columns 2 sets the side and stacked pairs two to a row from md, and size sm fits a narrow inspector. The structured spec is [`description-list.json`](description-list.json).

Sources: sokkel-ui `packages/core/src/components/DescriptionList.tsx (DescriptionList, DescriptionListGroup)`.

## Anatomy

| Piece | What it is |
|---|---|
| list | The pairs: text.sm on 20 lines (sm: text.xs on 16), the rows 8 apart (sm: 4). |
| term | A fact's term: text.xs in muted-foreground. Side by side, in the list's term column, as wide as termWidth. |
| value | A fact's value in the list's text; in the code face where the fact says code, in tabular figures where it says numeric, wrapping anywhere it must. A value not given is a dash in faint. |
| wide | A wide fact takes the list's full width: side by side its value goes under its term; in a two-column stacked list it spans both columns. |

## Options

- `items`: The facts, in order: { term, value, code?, numeric?, wide? }.
- `layout` (`side`, `stacked`, `row`; `side` by default): side: each term in a column beside its value. stacked: each term over its value. row: the pairs one after another in a line that wraps.
- `columns` (`1` by default): Two sets the side and stacked pairs two to a row from md (breakpoint-md); below it they stand one to a row.
- `termWidth` (`"96"` by default): How wide the term column is side by side: a CSS length, or auto for as wide as the longest term (at most 40 percent of the list), so every value starts at one line.
- `size` (`default`, `sm`; `default` by default): sm sets the values at text.xs with tighter gaps, for a narrow inspector.

## Sizes

- side: gap `12`. Between the term column and the values; sm 8. With columns 2, the two pairs 24 apart from md (sm 16).
- stacked: gap `24`. Between the columns of a two-column list; sm 16. A term and its value 2 apart.
- row: gap `20`. Between the pairs on a line, 4 between lines (sm: 16 and 2); a term and its value 6 apart.
- layout.rowGap: `8`. Between one row of pairs and the next (sm: 4).
- layout.termWidth: `96`. termWidth's default (6rem).
- layout.termMax: `0.4`. With termWidth auto, the term column is as wide as the longest term, at most this share of the list.

## States and tokens

- rest: The facts drawn.
- missing: A fact with no value: a dash in faint.
- term at rest: ink `muted-foreground`, text `text.xs`.
- value at rest: text `text.sm`.
- value at missing: ink `faint`.

## Keyboard

None of its own.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-egui: As of 1a87987, DescriptionList was built (d163191) before this spec, with columns 2 in the stacked layout; not compared with this spec.
- sokkel-tui: As of b99664f its reports name no such part.
