# Top bar

The thin bar over the content. A search field at its start, the trail to the current screen
after it, the button that opens the command palette, and the screen's actions at the end. On a
phone the trail keeps its last crumb and the palette's button is an icon. The page header never
repeats the trail (principle 8). The structured spec is [`top-bar.json`](top-bar.json).

Sources: sokkel-ui `packages/core/src/components/TopBar.tsx` (`TopBar`, `TopBarProps`, `Crumb`,
`TrailEnd`, `TopBarWords`/`TOP_BAR_WORDS`). `Shell.tsx` draws the bar around it (its `header`, the
menu button, the panel toggle's room) and `AppBar.tsx` draws it for a screen without the shell.
Also `shell-context.ts` (`ShellTrail`, `ShellPalette`, `useShellTrail`), `SearchField.tsx` (`/`),
`ui/kbd.tsx`, and `lib/keys.ts` (`shortcutLabel`). sokkel-ui-egui:
`crates/core/src/widgets/frame.rs` (`TopBar`, `search_button`).

## Anatomy

In order, start to end:

| Piece | What it is |
|---|---|
| bar | `spacing-shell-top` tall, `sidebar` ground, a `border-strong` rule under it. The same height as the rail's head |
| menu | The shell's: opens the rail as the drawer, below 768 or at every width while the rail is hidden. Named by the shell's `menu` word |
| mark | With `mark`: the app's mark on a 28 tile, for a screen without the rail |
| search | With `search`: the app's search field (`SearchField`, or `Search` with its results), 224 wide (256 from 1024, at most 320), focused by `/`. Below 768 it gives way to the palette's button |
| trail | The crumbs, taking the room left, named by `words.trail`. A crumb with `href` is a link; the current screen's is plain words at 500, marked as the page. Chevrons (14, `faint`) stand between crumbs |
| palette | The button that opens the command palette. With no search field it is field-like and 224 wide: a magnifier, the word Search and the keys in a key cap. Beside a field it shows the keys alone (as small code text) or the magnifier. Below 768 it is an icon, a finger square, with no edge or ground |
| actions | The screen's actions, at the very end, 6 apart |

A shell panel's toggle stands in the window's corner over the bar's end while the panel is
closed, and the bar keeps 48 at its end for it. That toggle is the shell's (`patterns/shell`).

## Options

- `trail` (`{ label, href?, code? }`, `code` in the code face), and `trailEnds`: `current` (the
  default: the last crumb is the current screen, and on a phone the only crumb shown) or `ancestor`
  (only the screens above, every crumb with an `href` a link, a chevron after the last, and on a
  phone the last crumb alone is the way back after a back chevron).
- `mark`, `search`, `actions`.
- `palette` (default true; false leaves the button out, as for a specimen on a page), `onSearch`,
  and `shortcut` (the keys, shown only when bound).
- Context made explicit (rule 2):
  - `inShell`: in a `Shell`, a mounted screen's `useShellTrail` replaces the bar's trail, and the
    button opens the shell's palette with `shortcutLabel('k')` shown.
  - `menu`: the shell's menu button.
  - `panelToggle`: the room for a panel's toggle (`pr-12`).
  - `trafficLights`: the bar leaves `spacing-traffic-lights` where no rail head does.

## Sizes

| | Regular | Compact | |
|---|---|---|---|
| Bar | 46 | 46 | `spacing-shell-top`; pad 12; 8 between the menu button and the row, 12 between the row's pieces |
| Menu button | 32 | 28 | `density.control` square, `radius-md`, icon 16; a finger square (44) below 768 |
| Palette button | 32 | 28 | `density.control`; 224 wide, pad 10, gap 8, icon 16, `radius-control`, `text.body`. Beside a field, pad 8. Below 768, a finger square (44) |
| Key cap | 20 | 20 | at least 20 wide, pad 4, `radius-sm`, `text.badge` |

The trail is `text.body`, with crumbs and chevrons 4 apart. The back chevron is 16, 2 before its
crumb. The mark's tile is 28. The actions stand 6 apart.

## States and tokens

| State | Piece: paint |
|---|---|
| rest | bar: `sidebar`, rule `border-strong`. crumb: `muted-foreground`. chevrons: `faint`. palette: `field`, edge `border`, ink `muted-foreground`. keys: `muted` / `muted-foreground`. menu: `muted-foreground` |
| hover | crumb link: `foreground`. palette: edge `border-strong`, ink `foreground`. menu: ground `hover` |
| focus (keyboard) | palette: edge `ring` and a 1px `ring` ring. A crumb's link and the menu button take the browser's outline in `ring/50` |
| current | the current crumb: `foreground` at 500 |
| phone (below 768) | palette: no ground, no edge, a finger square. The crumbs before the last, the chevrons and the search field are not drawn |

## Keyboard

- Tab reaches the menu button, the search field, each crumb that is a link, the palette's button
  and the actions, in that order.
- `/` focuses the search field, outside a field (`SearchField`'s shortcut).
- Enter or Space on the palette's button opens the palette. `Mod+K` is the shell's.

## Words

`TOP_BAR_WORDS`: `search` "Search" (the button's word with no field), `palette` "Open the command
palette" (its name beside a field), `trail` "Where you are". The menu button says the shell's
`menu`. The app gives every crumb, the keys (as `shortcutLabel` writes them) and the actions, which
follow their context: on Runs the button is "New", not "New run".

## Renderer-specific

- **sokkel-ui:** the shell's `header` (or `AppBar`) is the bar, and `TopBar` the row inside it. A
  screen draws its own with `ShellTop` or states its trail with `useShellTrail`. Crumbs are `Link`.
  The phone layout is media queries (`max-md`, `md:hidden`). In a desktop window the bar drags the
  window.
- **sokkel-ui-egui:** a crumb's `href` is a route the app goes to on a press. The trail is laid
  out from the start and the end's controls from the end, so a long trail is cut short before
  them. The phone layout is chosen by the available width.

## Where sokkel-ui-egui differs today

As of 267236c, `TopBar` draws the bar, a trail of plain words (the last in the action weight), the
palette's button with its word and a key cap, and the actions. The bar and the button match
sokkel-ui within a point. The differences:
1. **Order at the end:** the actions, then the palette's button last, 6 apart. The spec puts the
   palette's button first and the actions last, 12 apart.
2. **Chevrons** 12, where the spec says 14. **Crumbs** 6 apart, where the spec says 4.
3. **The palette's focus** is the shared 2 wide ring, 2 off, on any focus. The spec draws the edge in
   `ring` and a 1px ring, on keyboard focus only.
4. **Not built:** crumbs as links, code crumbs, `trailEnds: ancestor`, the mark, the search field and
   `/`, the button beside a field, keys only when bound, the menu button, the phone layout, and the
   room for a panel toggle and for the window's buttons.
