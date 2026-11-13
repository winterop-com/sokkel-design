# Shell

The frame every sokkel app has, on every target. An app on the web, in Tauri, in Electron or in
egui opens on the same frame: the rail of places, a thin top bar with the trail, search and palette,
the page with its header as the one thing that scrolls, the status foot, settings as a dialog on its
own route over the page, and pages whose reads land in distinct states. This is what makes a native
app and a web app "built in a similar fashion". The structured spec is [`shell.json`](shell.json).

Sources: sokkel-ui `Shell.tsx` (`Shell`, `Page`, `ShellTop`, `ShellHead`, `ShellWords`), `Rail.tsx`
(`RailGroup`, `RailEntry`, `RailWords`), `TopBar.tsx`, `PageHeader.tsx`, `StatusLine.tsx`,
`SettingsDialog.tsx` with `settings-parts.tsx` (`SETTINGS_WORDS`), `PageState.tsx`; the settings
route is `useOverlayRoute` in `hooks/use-overlay-route.ts`. The context is `docs/plan.md`'s Themes
section. sokkel-ui-egui: `crates/core/src/widgets/frame.rs` (story `Patterns/Shell`), with a working app on it,
`examples/runs`.

## Anatomy

| Region | What it holds |
|---|---|
| rail | Head (mark and name, leading home, as tall as the top bar); groups with optional titles; entries (icon, label, optional second line, a count or an unread dot, children folded under it); foot cell (the account menu). Its edge resizes it, and pulled outward expands a collapsed rail |
| top bar | Search field at its start (`/`), the trail after it, the app's actions, the palette button with its keys at the end, the panel toggle in the corner. It and the rail's head share one rule across the window |
| banner | A state that holds (the server not answering), between the top bar and the content, not scrolling |
| content | The one scroller, with a thin track that keeps its room either way: proposed 10 wide, solid, `scroll-track` with a `scroll-thumb` (egui's bars float over the content unless set solid) |
| page header | Title (the name, else the code), the code under it, a count, a description, meta, an aside picture, actions with the primary last and the rest folding into More. Held above the scroller with `ShellHead`. **No trail: the trail lives in the top bar** |
| page | Content at the page inset, sections a page gap apart |
| page state | Loading, failed, empty, or the content |
| panel | Optional: a right column, a sheet, or tabs in a strip at the foot |
| foot | The status line: a short note at the start and facts at the end, one fixed row, level with the rail's foot cell so account and status read as one bar |
| overlays | Command palette (Mod+K), settings dialog (`#/settings`), shortcuts dialog (`?`), the drawer (below 768) |

The places are **data** (`{ id, title?, entries: [{ id, label, description?, icon?, href?, count?,
unread?, entries? }] }`), and so are the settings sections and the palette's groups. The same data
draws the frame on every target.

## Sizes

| | Value |
|---|---|
| Top bar, rail head | `spacing-shell-top` (46) |
| Foot | `spacing-shell-foot` (46) |
| Rail | 240 by default, dragged between 200 and 360 and kept; collapsed 57; strip variant 72 |
| Rail entry | `density.row` (40 / 34), a finger tall below 768; collapsed 36 wide |
| Palette button | `density.control` tall (32 / 28), level with the search field; 224 wide with no search field; below 768 an icon, a finger square |
| Search field | `density.control` tall, 224 to 320 wide (256 from 1024) |
| Page | inset `density.page-inset-wide` (32 / 16) when the content box is 640 or wider, else `-narrow` (16 / 12); top `density.page-top`; gap `density.page-gap`; 40 at the foot |
| Panel strip tab | `spacing-shell-tabs` (56) |
| Desktop window, title bar hidden | `spacing-traffic-lights` (80) left for the window's buttons |

## Breakpoints

| Window | Form factors | The frame |
|---|---|---|
| below 768 | foldable folded 344; phone 360, 390, 430; foldable open 690 | The rail becomes a **drawer** from a menu button at the top bar's start. It is drawn expanded with the account in it, and closed by a press outside, a link, Escape or a route change. The search gives way to the palette button. The trail shows its last crumb only. The panel is a sheet, or a tab strip at the foot. Dialogs fill the screen, and settings opens on its list of sections. Rows and tabs are a finger tall. The frame keeps clear of the notch and home indicator |
| 768 to 1023 | tablet 768 | The rail is in the frame, as the app holds it. The panel is a sheet from the right |
| from 1024 | tablet 1024; desktop 1280, 1440, 1920 | The panel is the right column, level with the top bar. Desktop is the main target |

The window's width decides the frame. The page inset decides by the content's own box (640), as the
table stacks by its own box.

## Tokens

- rail: `sidebar`, `sidebar-foreground`, edge `border-strong`.
- Entries: `muted-foreground`, hover `hover` and `foreground`. Active: `sidebar-accent` and
  `sidebar-accent-foreground` at 500, with a 2px `sidebar-primary` bar at the start.
- Group titles: `faint`, `text.help` at 500, upper case; collapsed, a rule.
- top bar: `sidebar` ground, `border-strong` rule.
- Trail: `muted-foreground`, the current crumb `foreground` at 500, chevrons `faint`.
- Palette button: `field`, `border`, `muted-foreground`; hover `border-strong`, `foreground`.
- page: `background`, `foreground`. Title: `text.page-title` in `typeface-heading`, ink
  `page-title-ink`, falling back to `foreground` where a theme leaves it `currentcolor`.
- foot: `page-foot-ground`, `page-foot-line`, `page-foot-ink`, `text.help`. The note's tone is live
  `info`, warn `warning`, error `destructive`.
- Dialogs: `popover` on `radius-surface`, over `shade/10`. The drawer and sheets: `sidebar`, with
  `elevation-pop` and `scrim`.
- Page states: loading `muted-foreground`; failed on `card` with `border-strong` and a
  `destructive` mark.

## The settings route

Settings are only ever a dialog over the page the reader is on, on `#/settings`. They are never a
page, and never set into the layout. Back, Done or Escape returns to that page. A link that opens
the app on `#/settings` draws the app's home under the dialog. The footer says changes are kept as
they are made, ends with Done, and offers Reset to defaults for the shown section (a section with
nothing to put back has none). In sokkel-ui, `useOverlayRoute(route, 'settings')` draws it: handed
the app's route as its parts, it says whether the dialog is open and which page to draw under it,
and `close` goes back to that page, back in the history when the dialog was opened from it, so Back
afterwards does not open it again. It goes through the history and the hash unless the app hands it
its router's `back` and `replace`, so the library needs no router. In egui there is no URL: the
route is app state with a back stack, and "settings open" keeps the page under it.

## Keyboard

`Mod+K` opens the palette (a second press closes it; on a Mac Ctrl+K too). `?` opens the shortcuts
dialog. `/` focuses the search. Escape closes the layer on top and gives focus back. On a collapsed
rail's edge, Enter, Space or Right expands it. On an expanded rail's edge, Left and Right resize it.
A sequence such as G then D goes to a place, its second key within a second. Keys are named by the
character they type, so `?` and `/` work on a Norwegian keyboard. Keys are quiet in a field and
under an overlay unless a binding asks. A route change moves focus to the new page's heading. How long
sokkel-ui waits for a page still loading (3 s) is its own detail.

## Words

The shell's, rail's, top bar's, page header's, palette's, settings dialog's and page states' default
words are all in the JSON (`Open the navigation`, `All places`, `Where you are`, `Search or run a
command`, `Changes are saved as you make them`, `Done`, `Reset to defaults`, `Try again`, ...). The
app gives its name, its places, the trail, page titles and the settings' sections. Actions follow
their context: on Runs the button is "New", not "New run".

## Renderer-specific

- **sokkel-ui:** media queries at 768 and 1024, and a `cqi` clamp for the page inset. Real anchors
  through `LinkProvider`. `useOverlayRoute` for the settings route. `useOverlay` makes the page inert
  under an overlay. `useScrollMemory`. The safe-area insets. In Electron and Tauri the top strip is
  the title bar.
- **sokkel-ui-egui:** the available rect for the window's width, and the content rect for the inset
  (wide or narrow end only). A route is app state with a back stack. `Modal` serves dialogs and the
  drawer, and `Popup` serves menus. The page must refuse input under them. A hidden title bar drags
  with `ViewportCommand::StartDrag`.

## Where the renderers differ from the spec today

- **sokkel-ui-egui:** as of 38693ff it has `Shell`, `Rail` (groups, counts, collapse at 240 / 57),
  `TopBar` (the trail with chevrons in `faint`, on `sidebar` with a `border-strong` rule), `StatusLine`
  (`spacing-shell-foot` tall, its tones), `PageHeader` and `PageState`, `SettingsDialog` with the
  appearance settings and setting rows, `Dialog`, `Select` and the tooltip, `DropdownMenu`, and
  `CommandPalette` on Mod+K. `examples/runs` is a working app on it, with settings over the page on
  Mod+comma and from the rail. Still to build: rail resize by drag, the drawer below 768, the search
  field in the top bar and the panel. Settings is not a route: egui has no URL, so the dialog is open
  state the app holds.
