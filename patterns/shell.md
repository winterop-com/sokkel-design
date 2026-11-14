# Shell

The frame every sokkel app has, on every target. An app on the web, in Tauri, in Electron or in
egui opens on the same frame: the rail of places, a thin top bar with the trail, search and palette,
the page with its header as the one thing that scrolls, the status foot, settings as a dialog on its
own route over the page, and pages whose reads land in distinct states. This is what makes a native
app and a web app "built in a similar fashion". The structured spec is [`shell.json`](shell.json).

The rail, the top bar, the status line, the page header, the section, the page state, the dialog,
the settings dialog and the command palette are parts with specs of their own:
[`parts/rail`](../parts/rail.md), [`parts/top-bar`](../parts/top-bar.md),
[`parts/status-line`](../parts/status-line.md), [`parts/page-header`](../parts/page-header.md),
[`parts/section`](../parts/section.md), [`parts/page-state`](../parts/page-state.md),
[`parts/dialog`](../parts/dialog.md), [`parts/settings-dialog`](../parts/settings-dialog.md) and
[`parts/command-palette`](../parts/command-palette.md). This pattern says how the frame lays them
out and what it holds besides them.

Sources: sokkel-ui `Shell.tsx` (`Shell`, `Page`, `ShellTop`, `ShellHead`, `ShellWords`); the
settings route is `useOverlayRoute` in `hooks/use-overlay-route.ts`. The context is
`docs/plan.md`'s Themes section. sokkel-ui-egui: `crates/core/src/widgets/frame.rs` (`Shell`, story
`Patterns/Shell`), with working apps on it, `examples/runs` and `examples/tasks`.

## Anatomy

| Region | What it holds |
|---|---|
| rail | The app's places at the window's start: [`parts/rail`](../parts/rail.md). Its foot cell (the account) stands level with the foot |
| top bar | Over the content: [`parts/top-bar`](../parts/top-bar.md). It is as tall as the rail's head, so the two read as one strip across the window. Its rule ends at the rail's edge: the rail's head draws none, in the frame or in the drawer |
| panel toggle | A side panel's toggle in the window's top-right corner: over the top bar's end while the panel is closed or a sheet, in the panel header's corner while it is a column and open |
| banner | A state that holds (the server not answering), between the top bar and the content, not scrolling |
| content | The one scroller, its bar `scrollbar-width` (10) wide on a solid track that keeps its room either way, `scroll-track` with a `scroll-thumb` (egui's bars float over the content unless set solid) |
| page header | [`parts/page-header`](../parts/page-header.md): the title, what is known about it, the actions with the primary last. Held above the scroller with `ShellHead`. **No trail: the trail lives in the top bar**, where the page header states its own (`trailInTop`, its default in the frame) |
| page | Content at the page inset, its sections ([`parts/section`](../parts/section.md)) a page gap apart |
| page state | [`parts/page-state`](../parts/page-state.md): loading, failed, empty, or the content |
| panel | Optional: a right column, a sheet, or tabs in a strip at the foot |
| foot | [`parts/status-line`](../parts/status-line.md): one fixed row, level with the rail's foot cell so account and status read as one bar. It draws the strip itself; the shell gives it the room |
| overlays | [`parts/command-palette`](../parts/command-palette.md) (Mod+K), [`parts/settings-dialog`](../parts/settings-dialog.md) (`#/settings`), the shortcuts dialog (`?`) in [`parts/dialog`](../parts/dialog.md), the drawer (below 768) |

The places are **data** (the rail's groups), and so are the settings sections and the palette's
groups. The same data draws the frame on every target.

## Sizes

| | Value |
|---|---|
| Top bar, rail head | `spacing-shell-top` (46): see the parts |
| Foot, rail foot cell | `spacing-shell-foot` (46): see the parts |
| Panel toggle | `density.control` square (32 / 28), `radius-md`, icon 16; centered in the top bar's height, 8 from the window's end |
| Page | inset `density.page-inset-wide` (32 / 16) when the content box is 640 or wider, else `-narrow` (16 / 12); top `density.page-top`; gap `density.page-gap`; 40 at the foot |
| Panel strip tab | `spacing-shell-tabs` (56) |
| Desktop window, title bar hidden | `spacing-traffic-lights` (80) left for the window's buttons |

## Breakpoints

| Window | Form factors | The frame |
|---|---|---|
| below 768 (`breakpoint-md`) | foldable folded 344; phone 360, 390, 430; foldable open 690 | The rail becomes a **drawer** from the top bar's menu button (the rail's `drawer` state). It is drawn expanded with the account in it, and closed by a press outside, a link, Escape or a route change. The top bar keeps its last crumb and its palette's button is an icon (the top bar's `phone` state). The panel is a sheet, or a tab strip at the foot. Dialogs fill the screen as sheets and settings opens on its list of sections; a ConfirmDialog stays a box sized to its words. Rows and tabs are a finger tall. The frame keeps clear of the notch and home indicator |
| 768 to 1023 | tablet 768 | The rail is in the frame, as the app holds it. The panel is a sheet from the right |
| from 1024 (`breakpoint-lg`) | tablet 1024; desktop 1280, 1440, 1920 | The panel is the right column, level with the top bar. Desktop is the main target |

The window's width decides the frame. The page inset decides by the content's own box (640), as the
table stacks by its own box.

## Tokens

- Panel toggle: `muted-foreground`, hover `hover` and `foreground`, `foreground` while the panel is
  open; keyboard focus a `ring` outline `focus-ring-width` (2) wide, `focus-ring-offset` (2) off.
- Focus: one keyboard focus look for every control of the frame, the button's own: a `ring` outline
  `focus-ring-width` wide, `focus-ring-offset` off, on keyboard focus only. The rail's entries (expanded and collapsed), its mark,
  home link and collapse control, the top bar's menu button, crumbs and palette's button, the panel
  toggle and the account control in the rail's foot cell all wear it.
- page: `background`, `foreground`.
- Dialogs: in [`parts/dialog`](../parts/dialog.md). The drawer and sheets: `sidebar`, with
  `elevation-pop` and `scrim`, sliding in over `motion-base` on `motion-ease`, still when motion is
  reduced.
- Layers, from the bottom: the drawer (`layer-drawer`), dialogs and sheets (`layer-dialog`), popups
  (`layer-popover`, so a popup opened in a dialog shows over it), toasts (`layer-toast`).
- The rail, the top bar, the foot, the page header, sections and page states: in their parts.

## Before an egui app follows the shell

Decided (open questions, D7): this list is the gate. An egui app follows the shell only once
sokkel-ui-egui has every item, its behavior and its accessibility included, not only its look:

1. The rail's resize: its edge pulled, Enter, Space and the arrows, the width kept.
2. The top bar's search field at its start, with `/` to focus it.
3. Section (`parts/section`), with its boxed and flat heads.
4. Keyboard navigation through the frame: Tab order, the rail's and the lists' arrows.
5. Focus returned to what opened a layer when it closes, and moved to the new page's heading on a
   route change.
6. The shortcuts registry (Mod+K, `?`, `/`, sequences), quiet in a field and under an overlay.
7. A back stack, settings over the page as one of its entries, Back closing it.
8. The appearance kept: theme, scheme and density under the same keys as the web.

The other patterns (forms with their issue count, list beside detail, dashboards) come when an egui
app needs them (D5).

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
dialog. Escape closes the layer on top and gives focus back. A sequence such as G then D goes to a
place, its second key within a second. Keys are named by the character they type, so `?` and `/`
work on a Norwegian keyboard. Keys are quiet in a field and under an overlay unless a binding asks.
A route change moves focus to the new page's heading. How long sokkel-ui waits for a page still
loading (3 s) is its own detail. The rail's keys (its parents, its edge, reordering) and the top
bar's (`/` for its search) are in their parts.

## Words

The shell's default words are in the JSON (`Open the navigation`, `Close the navigation`, `Open the
command palette`, ...). The rail's, the top bar's, the page header's, the page states', the
dialog's, the settings dialog's and the palette's are in their parts. The app gives its name, its places, the trail, page titles and the settings'
sections. Actions follow their context: on Runs the button is "New", not "New run".

## Renderer-specific

- **sokkel-ui:** media queries at `breakpoint-md` and `breakpoint-lg` (768 and 1024), and a `cqi` clamp for the page inset. Real anchors
  through `LinkProvider`. `useOverlayRoute` for the settings route. `useOverlay` makes the page inert
  under an overlay. `useScrollMemory`. The safe-area insets. In Electron and Tauri the top strip is
  the title bar.
- **sokkel-ui-egui:** the available rect for the window's width, and the content rect for the inset
  (wide or narrow end only). A route is app state with a back stack. `Modal` serves dialogs and the
  drawer, and `Popup` serves menus. The page must refuse input under them. A hidden title bar drags
  with `ViewportCommand::StartDrag`.

## Where the renderers differ from the spec today

- **sokkel-ui-egui:** as of 267236c, `Shell` lays out the `Rail`, the `TopBar` and the `StatusLine`
  (each with its own spec and drift) with the rail's foot cell level with the status line, and it
  has `PageHeader` and `PageState` (each with its own spec and drift), `SettingsDialog` with the
  appearance settings and setting rows, `Dialog`, `Select` and the tooltip, `DropdownMenu`, and
  `CommandPalette` on Mod+K. `examples/runs` and `examples/tasks` are working apps on it, with
  settings over the page on Mod+comma and from the rail. Still to build: the drawer below 768, the
  panel and its toggle, the banner, and Section (`parts/section`). Settings is not a route: egui has no URL, so the dialog is open state the app holds.
  The page's scroll gutter is 11, where the spec says `scrollbar-width` (10).
