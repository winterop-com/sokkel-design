# Page state

The states a read lands in, kept distinct all the way to the screen: loading, failed, empty, and
the content (principle 11). A failure is headed by what the server answered. Its diagnostic and the
problems it named stand under the heading, with Try again. A failed read of secondary data is a
warning about part of the page, not the page's failure. A state is drawn in a box of its own, or
unframed inside a panel, as a table draws its own failed read under its heads. The structured spec
is [`page-state.json`](page-state.json).

Sources: sokkel-ui `packages/core/src/components/PageState.tsx` (`PageState`, `PageStateProps`,
`PageStateWords`/`PAGE_STATE_WORDS`, `pageStateHeading`, `PageStateTone`, `PageStateHeadingLevel`,
`ReadOutcome`, `Frame`), `ProseText.tsx` (a written diagnostic's code) and `ui/button.tsx` (Try
again). sokkel-ui-egui: `crates/core/src/widgets/page.rs` (`PageState`, `PageStateTone`,
`PageStateWords`).

## Anatomy

| Piece | What it is |
|---|---|
| frame | The row a state is drawn in: a box of its own on the card's ground, or unframed (`frame={false}`) the same row with a panel's padding |
| spinner, loading word | Loading: a turning ring and "Loading", announced politely |
| mark | Failed: a circled alert at the row's start, level with the heading's first line; a triangle in the warning tone |
| heading | Failed: by what the server answered (below). A plain line, or the page's `h1` or a part's `h2` (`headingLevel`). Announced as an alert, politely in the warning tone |
| diagnostic | The server's words, or the app's sentence in their place |
| code | A written diagnostic's or problem's backticked part, in the code face on a muted chip |
| problems | Each failure a refusal named, a bulleted list under the diagnostic |
| retry | With `onRetry`: Try again, an outline `sm` button with a turning arrow |
| message | Empty: the one line the app gives |
| empty content | Empty with more than a sentence: the app's own empty state, in the frame's place |
| content | The read came back with something: drawn as given |

**The heading** says what the server answered: "The server is not answering" when no answer came,
"Nothing is there" for a 404 (an absence, not a refusal), "Part of this page could not be read" in
the warning tone, else "The server refused this read".

## Options

- `loading`; `error` (the server's words) with `status` (an HTTP status or `unreachable`, which
  picks the heading), `problems` and `onRetry`; `empty` with `emptyMessage` or `emptyRender`;
  `children`, the content.
- `tone`: `critical` (default, the page's own read) or `warning` (secondary data the page stands
  without).
- `headingLevel`: `p` (default), `h2` for a part under the page's heading, `h1` where the state
  stands in for a whole page, so the page still has its heading.
- `frame` (default true), `words`.

## Sizes

| | Value |
|---|---|
| Frame | pad 16 across and 24 down, 12 between its pieces, `radius-surface`, `text.body`. Its pieces set at the top; loading centers them |
| Unframed | pad `density.panel-pad` (12 / 8) across and 12 down, 12 between its pieces |
| Spinner, mark | 16; the mark 2 down, its center level with the heading's first line |
| Lines | the heading, the diagnostic and the problems 4 apart; 12 more to Try again |
| Problems | padded 16 at the start, the discs hanging in it |
| Code | padded 4 across, `radius-sm` |
| Try again | `density.control-sm` tall (parts/button, `sm`, outline) |

## States and tokens

| State | Piece: paint |
|---|---|
| rest | nothing: the content stands in its place |
| loading | frame: `card`, edge `border-strong`, `radius-surface`, ink `muted-foreground`. spinner: `muted-foreground` |
| failed | frame: `card`, edge `border-strong`. mark: `destructive`. heading: the ink around it (`foreground` on a page or a card), `text.action`. diagnostic and problems: `muted-foreground`, `text.help`. code: on `muted`, `radius-sm` |
| failed + warning | frame: `warning/8`, edge `warning/35`. mark: `warning-ink`, a triangle |
| empty | frame: `card`, edge `border-strong`, ink `muted-foreground`, `text.body` |
| unframed | no ground and no edge. A warning keeps its `warning/8` wash, with no edge (open questions) |

## Keyboard

- Tab reaches Try again. Enter or Space on it reads again.

## Words

`PAGE_STATE_WORDS`: `loading` "Loading", `refused` "The server refused this read", `missing`
"Nothing is there", `unreachable` "The server is not answering", `partRefused` "Part of this page
could not be read", `retry` "Try again". The app gives the diagnostic, the problems and the empty
line or its own empty state.

## Renderer-specific

- **sokkel-ui:** loading is `role=status`, a failure `role=alert` (`role=status` in the warning
  tone). `pageStateHeading` picks the heading, and `DataTable` uses it for its own failed read, an
  unframed `PageState` under its heads (`parts/table`). A string diagnostic or problem is drawn by
  `ProseText`. The spinner keeps turning when motion is reduced (`motion.css` leaves
  `animate-spin`). `emptyRender` and `children` are drawn as given.
- **sokkel-ui-egui:** the app picks the state by its constructor (`loading`, `refused`, `missing`,
  `unreachable`, `empty`) rather than an HTTP status; the headings are the same. `show` returns true
  when Try again was pressed (`retry(true)`). A richer empty state, and the content, are the app's
  own drawing in the state's place (such as `Empty`).

## Where sokkel-ui-egui differs today

As of dfb6079 (`page.rs` unchanged since b73200b), `PageState` draws loading, refused, missing, not
answering, a part refused and empty, framed or not, in both tones, with the diagnostic, the
problems, Try again, and the words as fields. Its frame, padding, gaps and paints match. The
differences:
1. **Unframed warning:** no ground. The spec keeps the `warning/8` wash.
2. **Problems:** each a label of its own after a bullet, 4 apart, a wrapped line running under the
   bullet. The spec draws a list padded 16, its lines close, a wrapped line under its own text.
3. **Code in the diagnostic:** plain text with the backticks shown.
4. **Try again** has no icon.
5. **The mark** is centered in a 22 tall slot (center 11). The spec puts it 2 down (center 10).
6. **Not built:** `headingLevel` and the announcements (polite while loading and for a warning, an
   alert for a failure).
