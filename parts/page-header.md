# Page header

A page's head. Its title (the name, else the code) with a count beside it, then the code, a
description and a line of facts under it. A back button and a picture can stand before it. The
page's actions sit at the row's end, the primary one last. The actions stay on the title's row while
there is room and wrap under it when there is not. Actions given as items fold into More instead,
so the title keeps its width and the row stays one line. The header lays out by its own box, never
the window's width. In the frame it never draws a trail of its own (principle 8). The structured
spec is [`page-header.json`](page-header.json).

Sources: sokkel-ui `packages/core/src/components/PageHeader.tsx` (`PageHeader`, `PageHeaderProps`,
`PageHeaderWords`/`PAGE_HEADER_WORDS`), `Toolbar.tsx` (the items, More and the primary),
`IconButton.tsx` (the back button), `ItemHeading.tsx` (`identityOf`: the name, else the code),
`Link.tsx` (the crumbs) and `shell-context.ts` (`useShellTrail`, `ShellTrailAsk`). sokkel-ui-egui:
`crates/core/src/widgets/page.rs` (`PageHeader`).

## Anatomy

| Piece | What it is |
|---|---|
| header | A row that wraps: the title block at its start, the actions at its end, level with the block's foot. Its own box decides how it lays out |
| title block | One line under another: the trail, the title with its count, the code, the description, the meta. Beside a back button or an aside it is a grid, so every line starts where the title starts |
| back | With `onBack`: a ghost icon button with a back chevron, level with the title |
| aside | A picture (an avatar, a project's mark, artwork) before the title block, centered on it down the side of every line; after the back button |
| trail | The places above the page, small over the title, a chevron after each crumb (the last too), named "Where you are". Drawn only outside a `Shell`, or without `trailInTop` |
| title | The page's `h1`, in the heading face: its name, else its code. It wraps. A code standing as the title, or `singleLine`, stays on one line, cut short with the whole of it on hover |
| count | A short count on the title's baseline, 8 after it |
| code | The addressable code under the title, in the code face, cut short; not drawn when it is the title |
| description | A sentence under the title, at most a reading measure (65ch) wide |
| meta | A line of small facts, wrapping |
| actions | `lead`, then `items`, More and `primary`, then `actions`. They stay beside the title while there is room, and wrap under it, then onto lines of their own |
| lead | A part that is not a verb, such as a status chip, at the actions' start; it never folds |
| items | Outline buttons that move, from the last, into More as the header narrows, measured on the header itself |
| primary | The primary action as an item: filled, never folding, its related ways under a chevron |
| more | The icon button that holds the folded items |

## Options

- `title`, `code`, `count`, `description`, `meta`, `aside`.
- `actions` (the primary last), `lead`, `items` with `primary` and `wordsOnly`, and `actionsFill`
  (set by `items`): the actions take the room the title leaves rather than their own width.
- `trail` (`{ label, href?, code? }`) and `trailInTop`. Inside a `Shell`, `trailInTop` states the
  trail for the top bar (`useShellTrail`, ending at the place above) and draws none here.
- `onBack`, `singleLine`, `words`.
- Context made explicit (rule 2): `inShell`, the `Shell` around it (`ShellTrailAsk`), which is what
  sends the trail to the top bar.

## Sizes

Nothing varies by density except the back button, whose square is `density.control-sm`.

| | Value |
|---|---|
| Header | 16 across between the title block and the actions; 12 down when they wrap under it |
| Title row | the title in `text.page-title`, its count 8 after it on the baseline |
| Back | `density.control-sm` square (28 / 24), icon 16, `radius-control` capped at 12; a finger square below 768. 8 before the block's lines |
| Aside | 12 before the block's lines (and after the back button) |
| Trail | `text.help`, crumbs and chevrons 4 apart; chevron 12 |
| Lines | the code right under the title; the description 4 down; the meta 6 down, its facts 12 apart and 4 between lines |
| Actions | 8 apart |

How the row shares its width, by the header's own box:
- Actions that fill (`items`, `primary`, `actionsFill`): from 512 of the header's box the row stays one
  line. The title takes its own width up to 60 percent of the row and the actions the rest, at least
  128 (More and the primary), folding what does not fit. Below 512 they wrap under the title.
- A title with a description or meta asks for 256 before the actions wrap under it.
- A title alone takes its own width below 512, so a short one keeps its actions beside it on a
  phone. From 512 it takes the room they leave, at least 128, and wraps there rather than pushing
  them under it.

## States and tokens

| State | Piece: paint |
|---|---|
| rest | title: `page-title-ink`, else `foreground`, in `text.page-title` and `typeface-heading`. count, code (code face), meta: `muted-foreground`, `text.help`. description: `muted-foreground`, `text.body`. crumb: `muted-foreground`. chevron: `faint`. back: `muted-foreground`, `radius-control` |
| hover | crumb link: `foreground`. back: ground `hover`, ink `foreground` |
| focus (keyboard) | back: a 2px `ring` outline 2 off. A crumb's link: the browser's outline in `ring/50` |
| wrapped | the actions under the title, 12 down |
| folded | the items the row cannot hold in More, from the last |
| codeTitle | the title in the code face, on one line, cut short |
| trailInTop | the trail in the top bar, none here |

The actions, More and the primary are buttons (`parts/button`): outline items, More an outline
icon button, the primary filled.

## Keyboard

- Tab reaches the back button, each crumb that is a link, then the actions in their order (the
  lead's controls, the items in the row, More, the primary, the actions).
- Enter or Space on the back button calls `onBack`. More's menu keys are the menu's.

## Words

`PAGE_HEADER_WORDS`: `back` "Back", `trail` "Where you are", `more` "More" (the button that holds
the folded items), `moreWays` "More ways" (an item's chevron). The app gives the title, the code, the
count, the description, the meta, every crumb and every action. Actions follow their context: on Jobs
the button is "New", not "New job"; an item's face may be shorter than the label that names it.

## Renderer-specific

- **sokkel-ui:** the header is a size container (`@container/page-header`, `@lg` = 512). Items fold
  by measuring their widths on the header (`Toolbar`), and More is Base UI's menu. The title is the
  page's `h1`, so `Shell`'s `routeKey` moves focus to it. Crumbs are `Link`. `trailInTop` calls
  `useShellTrail(trail, { ends: 'ancestor' })`. A cut-short title or code says the whole of it in
  its `title` attribute.
- **sokkel-ui-egui:** `PageHeader::show(ui, actions)` lays the actions out right to left from the
  row's end, so the app adds the primary first. The header lays out by the available rect.

## Where sokkel-ui-egui differs today

As of dfb6079 (`page.rs` unchanged since b73200b), `PageHeader` draws the title in
`text.page-title` and `page-title-ink` (else `foreground`), a count in `text.help`, the code in the
code face, a description in `text.body`, and actions from the row's end. The differences:
1. **Lines:** every line 4 apart. The spec has the code right under the title, the description 4
   down and the meta 6 down.
2. **Count:** centered on the title's line, where the spec sets it on the baseline.
3. **Description:** at most 640 wide, where the spec says a reading measure (65ch).
4. **Actions** never wrap under the title.
5. **Not built:** the back button, the trail, the aside, the meta, the lead, items folding into
   More with the primary and `wordsOnly`, `actionsFill`, the code standing as the title, `singleLine`,
   and the words.
