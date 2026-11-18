# Principles

These are the rules every renderer keeps, whatever its toolkit: sokkel-ui (React), sokkel-egui
(egui) and sokkel-tui (ratatui, in a terminal). They are lifted from sokkel-ui's
`AGENTS.md` and `docs/plan.md` and rewritten for any renderer. Each one gives the rule, why it holds,
and how a renderer honors it.

### 1. Every value comes from a token

**Rule.** Every color, typeface, text size, length and corner a part draws comes from a token, never
a literal. **Why.** A theme can then change anything, and two renderers that read the same tokens
draw the same thing. **Renderer.** sokkel-ui uses token classes and `var()`, and `src/rules.test.ts`
fails a hand-set size or color. sokkel-egui uses `tokens(ctx)`: `color`, `color_at`, `length`,
`density`, `radius`, `text`. The focus ring, the invalid ring, the disabled opacity, the motion, the
layers, the elevations, the breakpoints and the scroll bar are tokens too. Lengths that are still
literals in both (paddings, gaps, a table's select column) wait for the named spacing scale (open
questions, "Later").

### 2. Every corner from the radius ladder

**Rule.** Corners go by role: a control rounds by `radius-control`, a surface by `radius-surface`,
a chip by `radius-chip`, and so on. Each is derived from the one `radius` a theme sets. **Why.** One
theme has sharp surfaces and round controls and another the reverse, with no part knowing.
**Renderer.** Read the role's token (`radius-control`). A small size may cap it (a 24 button caps
at 10) but never invents it. A native renderer that keeps a corner in whole points floors a
half-point radius (4.5 draws as 4): egui feathers its edges, so rounding up to 5 read about 40
percent rounder than Chromium at 2x (10 px against 7, measured), where 4 reads 8 against 7.

### 3. Text by role

**Rule.** Text is set by role (page title, section title, head, body, action, label, help, badge,
...), each a size, line height, weight and tracking. A part never sets a size and a weight of its
own. A column head stands one text step above the cell text it heads, at medium weight in the
foreground or the head ink a theme names, never weaker than its rows: body cells take
`text.column-head`, one step up, and a table's group heads take the same step. A label over a single
value (a stacked card's) labels it rather than heads a column, and may stay small and quiet.
**Why.** Type stays one system across parts and themes, and a heading reads as one over what it heads. **Renderer.** sokkel-ui uses the
`text-<role>` classes. sokkel-egui uses `TextRole::rich`, the weight on the variable face's
`wght` axis. Mono is sized by x-height (`mono-x-height`) in both.

### 4. Density is a setting, two levels

**Rule.** `regular` and `compact` change spacing and the heights of rows, controls, panel heads and
page insets, through `density.*`. A part that sits in rows or bars reads them. **Why.** One app
serves readers who want room and readers who want rows. **Renderer.** Resolve the level's lengths
once per frame. Never scale a whole part.

### 5. Finger-sized targets below the phone breakpoint

**Rule.** Below 768 every press target is at least `spacing-finger` (44) tall, and a square one 44
wide. A bare trigger takes a finger-sized hit area without growing. **Why.** A finger is not a
pointer. **Renderer.** Read the window's width each frame and apply the part's `phoneMinHeight`.
egui knows the width from the available rect.

### 6. Desktop first, every form factor working

**Rule.** Desktop is the main target. Phones, foldables and tablets must still work at 344, 360,
390, 430, 690, 768 and 1024, and no screen scrolls sideways at those widths. Name the form factor
(phone at 390, foldable folded, tablet), never a vague class of device. **Why.** The same apps run
in a browser window, a desktop shell and a phone. **Renderer.** The frame decides by the window's
width (`md` 768, `lg` 1024). A part that fills its container decides by its own box, never the
window, so it holds up in any container.

### 7. One frame for every app

**Rule.** Every app sits in the same frame: the rail of places, the top bar with the trail, search
and palette, the page, the status foot (`patterns/shell`, with `parts/rail`, `parts/top-bar` and
`parts/status-line`). **Why.** Apps on any target read as one family, and a reader who knows one
knows them all. **Renderer.** Build the frame once in the renderer. The app gives its places,
settings and pages as data and parts.

### 8. The trail lives in the top bar only

**Rule.** Every page shows where it is in the top bar's trail. The page header shows the title and
its actions, never a second trail. **Why.** One place to look, and the header keeps its width for
the title. **Renderer.** A page states its trail to the frame (`useShellTrail` in sokkel-ui). It
never draws one itself.

### 9. Settings are a dialog over the page, on its own route

**Rule.** An app's preferences open only as the settings dialog over the page the reader is on, on
`#/settings`. It is never a page and never set into the layout. Back returns to that page. Reset to
defaults resets the shown section. Light and dark are one of its settings: the scheme is chosen in
Settings › Appearance and in the command palette only, the account menu's Appearance entry opens
Settings there, and no top bar or account menu holds a scheme toggle. **Why.** Settings are a
detour, not a place. Closing them puts the reader back where they were. The look has one home, so no
two toggles disagree. **Renderer.** On the web, a hash route drawn as an overlay
(`useOverlayRoute` in sokkel-ui). In a native app, an app state with a back stack.

### 10. A missing value is a quiet dash

**Rule.** A value that is not there is drawn as a dash in a quiet ink, never as a blank and never as
"null" or "undefined". **Why.** A blank reads as a layout bug or a value still loading. **Renderer.**
Cells, description lists and facts draw the dash themselves when given no value.

### 11. States are distinct, all the way to the screen

**Rule.** A read lands in one of loading, failed, empty, or the content, and each looks different.
A failure is headed by what the server answered (refused, nothing there, not answering), with the
diagnostic under it and a way to try again. A failed read of secondary data is a warning about part
of the page, not the page's failure. **Why.** "Nothing here" must never be said of a read that
failed or has not come back. **Renderer.** Model the read as those four states (`PageState`; a table
draws them itself, under its heads). Never draw empty while loading.

### 12. A form never changes height

**Rule.** A field's problem is said by a mark at its control's end, its message opening from the
mark, and a form counts its issues beside its verb. Nothing is inserted under a field. Issues have a
tone: critical stops the submit, warning does not. **Why.** Text appearing under fields moves the
form under the reader's hand. **Renderer.** Reserve the mark's room inside the control. The issue
shape is the same one sokkel-api sends.

### 13. A blocked action says why, a busy one keeps its place

**Rule.** A control that cannot act now is disabled with a reason, said on hover and on keyboard
focus, and stays reachable by the keyboard. A control whose work is under way shows a spinner in its
icon's place, keeps its label, look and focus, and ignores presses. **Why.** A dead button with no
reason is a dead end. A button that moves or loses focus while busy loses the reader. **Renderer.**
Keep the widget focusable while ignoring presses.

### 14. One table for every listing

**Rule.** Every listing and table, short or long, flat or a tree, is the one table part. Its columns
resize by default, and below its own box's stack width its rows become cards. **Why.** One fix
reaches every listing, and every listing sorts, selects and moves by the keyboard the same way.
**Renderer.** Build one table widget with a `list` variant. Never draw a listing by hand.

### 15. One engine per job

**Rule.** Each kind of drawing has exactly one engine in a renderer: one for charts, one for maps,
one for interactive graphs, one for terminals, one for live video, one for diagrams written as text,
one for formulas, one for dragging. Sparklines are plain drawing. **Why.** Two engines for one job
means two looks, two sets of bugs and twice the size. **Renderer.** sokkel-ui names its engines in
its plan. sokkel-egui picks its own one per job (the painter for charts, one map crate) and keeps
to it.

### 16. Words are the app's to translate, and follow their context

**Rule.** Every word a part says is an option with an English default, in American English. Words
follow their context: an action in a page drops the noun the page already names (on Runs, "New" and
"Search", not "New run"). The noun stays where nothing around it names the thing: a dialog's title,
global navigation, the command palette, an icon-only button's name, and an action among siblings that
make different things ("New folder" beside "Upload files"). **Why.** Apps ship in other languages,
and repeated nouns are noise. **Renderer.** Every part takes a `words` set with the spec's keys and
defaults, and the check compares them.

### 17. Keys are named by what they type

**Rule.** A shortcut names its key by the character it types (`?`, `/`, `*`), so it works on a
Norwegian keyboard as on an American one. `Mod` is Cmd on a Mac and Ctrl elsewhere. Keys are quiet
while typing in a field and under an overlay, unless a binding asks. **Why.** A layout that needs
Alt for `[` or `/` must not lose the app's keys. **Renderer.** Match the typed character, not the
physical key code. In a terminal (sokkel-tui), Cmd almost never reaches the program, so `Mod` is Ctrl
there on every system; no binding is an Alt chord, since a terminal's Option or Alt is often Meta or
types a character; and no part takes `[` or `]` as its primary key, since with Option as Meta a
Norwegian keyboard cannot type them. A part that offers one keeps a second key for it.

### 18. Fix the part, never the example

**Rule.** When something looks wrong in one app or story, the fix goes into the part, or the part
gets a new option. An app never patches a part's size, spacing or shape locally. **Why.** A local
patch fixes one screen and leaves the bug for the next, on every target. **Renderer.** If a renderer
cannot meet the spec, the spec is questioned here, never worked around in an app.

### 19. The library knows no app

**Rule.** No renderer, spec or specimen names a product that uses it. Every example is the fictional
Tidevann workspace: jobs nightly-export, sync-inventory, rebuild-index, send-digest and
import-orders; run states; people ada, grace, linus and margaret; projects harbor, juniper and
larkspur; hosts on example.org. **Why.** The design system is shared and will be open. **Renderer.**
Specimens use the fixtures in `specimens.json` only.

### 20. Paints come resolved

**Rule.** Every color and ring a spec paints is drawn from the resolved paints
(`tokens.resolved.json`'s `paints`, keyed `<part>.<variant>.<state>.<piece>`), never mixed by the
renderer: no alpha, blend or `color-mix` of its own on those paths. Sizes stay in `sizes`, resolved
per density. A color the app supplies at run time (a project's color, a chart series, a row's fill)
stays free. **Why.** Two renderers that mix the same expression in different spaces draw different
colors (a gamma blend is not an oklch mix); resolving once makes them the same, and `verify-colors`
holds the resolved paints to what Chromium draws. One exception, for a renderer that cannot blend
(a terminal): the cells under a layer with a scrim (a dialog, a drawer, the palette) are flattened
under the scrim's resolved color at run time, since what lies there may be the app's own run-time
colors; it is the one blend such a renderer does, sRGB source-over as the browser composites
(`index.json`, `colorDepth.underLayer`). **Renderer.** sokkel-ui keeps its expressions in
classes (`hover:bg-primary/80`), and its parts test checks each one is the spec's. sokkel-egui
reads `paints`, and a check fails a widget that mixes on a painted path.

### 21. In cells, a row is a line

**Rule.** A renderer with a cell grid (a terminal) lays parts out in rows and columns, never px. A
control, a row, a bar and a head is one row whatever its px height. A horizontal length is
`round(px / 8.4)` columns, at least 1 where it is not 0. Room between stacked pieces is whole blank
rows, and density changes blank rows and side padding, never a row's height. The breakpoints are 90
and 120 columns, and specimens are drawn at 60x20, 80x24, 120x40 and 200x50. Text keeps of its role
what the cell table gives it: bold or not, italic or not, the piece's ink. Corners are rounded where
the corner role is above 0, square at 0. A one-row control has no room for an edge above and below
it: it draws its edge as one-eighth blocks at its ends (`edge-start` and `edge-end`, `▏` and `▕`),
inside its padding in the edge's flat color, and brackets in ASCII. There is no room outside a cell
for the focus outline either: keyboard focus on a one-row control is a bar (`focus-ring-start` and
`focus-ring-end`, `┃`; `>` and `<` in ASCII) in `ring` in the cell beside each end, outside its width,
in the one-column gap kept between controls, as `focus-ring-offset` keeps the outline off the box;
without color, the control in reverse video. A row of a table or a list takes `focus-mark` in `ring`
at its start, so a focused row and a selected one stay apart, as they do on the web. **Why.** A
terminal has one type size and whole cells; a part divided by px would land on half rows. Without
its edge an outline button reads as a ghost one, and a ring drawn in the control's own cells would
hide it where the ring and the ground are one color. **Renderer.** Read `index.json`'s `cells` and
each part's `cells`; draw glyphs from `glyphs.json` in the form the terminal can show.

### 22. Color at the terminal's depth, meaning without it

**Rule.** A renderer that cannot blend draws each paint's opaque form: `flat`, each field laid over
the surface the piece stands on (its spec's `standsOn`), and `faded`, the paint drawn at a fading
state's opacity, never the terminal's faint attribute. In 256 colors each opaque color is the nearest
of xterm's fixed indices 16 to 255 in OKLab, never 0 to 15, which the terminal's own theme sets. The
sixteen ANSI colors stand for the `ansi-*` tokens, the colors a sokkel `TerminalView` shows for them.
In sixteen colors a paint takes its index by role, never by nearness (`colorDepth.ansi16.paints`):
the critical tones red, warning yellow, good green, info, primary and the ring blue, the quiet inks
bright black, grounds and inks the terminal's own defaults, and hover, the accent and a selection
reverse video, so a part means the same whatever the terminal's theme. Under a layer with a scrim,
truecolor and 256 colors flatten each cell at run time (principle 20's one exception), and sixteen
colors and no color draw it in two fixed colors (`colorDepth.underLayer`).
With no color (`NO_COLOR`), every state is carried by its words and its glyphs, and only bold,
reverse and underline remain. A part drawn on a surface other than the one it stands on takes its
paints' opaque forms for that surface (`flatOn`, `fadedOn`), where its spec names the surface in
`alsoStandsOn`. **Why.** Principle 20 holds in a terminal too: the blend is the
resolver's, checked against the browser. A state said only by color is lost on a terminal without
it, as principle 11 says of states in general. **Renderer.** Read `paints[...].flat[field]` (over
another surface the spec names, `flatOn[surface][field]`), else the field; the depth from the environment (`NO_COLOR`, `COLORTERM`), never assumed.

### 23. A tip a renderer cannot float is said in the status line

**Rule.** A renderer without floating boxes (a terminal, where a pointer may not exist) says a
tooltip's words, and a disabled control's reason (principle 13), in the status line's note while the
control has keyboard focus, and its keys after them. A field's issues are said there the same way
while its control has focus. **Why.** A tip under a pointer that never moves is never seen, and a
reason no one can read is a dead end. **Renderer.** The status line takes the focused control's tip
in its note's place and gives the note back when focus moves on.

### 24. One catalog translates every renderer

**Rule.** Every word a part says has a message id, `<part>.<word>` (`dataTable.rows`,
`callBar.leave`), and its English is an ICU MessageFormat string in sokkel-ui's catalogs, which the
contract carries as `messages/en.json` at the pinned commit. Each spec's `messages` names the id
and the English of each of its words. Renderers key their strings by these ids and read the same
ICU catalogs, an app's translation spread over the English one, so one translation serves all
three. A word a part takes from another part keeps that part's id (`field.required`), so it is
translated once. **Why.** An app that ships in another language translates the library once, not
once per renderer, and a renderer's words cannot drift from the web's. **Renderer.** sokkel-ui
resolves words through `LocaleProvider` and `useWords` (a part's own `words`, then the catalog,
then English). sokkel-egui and sokkel-tui look each word up by its id in the catalog the app gives,
falling back to `messages/en.json`, and format it with an ICU MessageFormat library in the app's
locale (plurals by the locale's rules, `{count, number}` grouped as the locale groups).
