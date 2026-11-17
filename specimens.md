# Specimens

Specimens are a fixed list of stories that every renderer draws, compared by eye. **A specimen's id
is a Storybook story path**: title and story name, exactly as sokkel-ui's sidebar shows them
(`Primitives/Actions/Button/Variants`). The egui storybook has a story at the same path, so the two
captures pair by name with no mapping file. Both capture the story's canvas only, never the
storybook's chrome. Motion is stopped, the scale is 2, and the file is
`{slug}--{theme}-{scheme}-{density}.png`. The slug is the id in lower case with `/` and spaces turned
into `_`, as sokkel-egui's snapshot test already names its files. The list is
[`specimens.json`](specimens.json).

Specimens fail nothing. They are what a person looks at when a check passes but something still
looks off, and what the owner looks at to judge whether egui wears the design.

## The matrices

| Matrix | Themes | Schemes | Densities | For |
|---|---|---|---|---|
| full | tidevann, paper, contrast | light, dark | regular, compact | Static states: does the part wear every theme and density the same |
| pair | tidevann | light, dark | regular | Interaction states (hover, focus, press) and narrow widths: does it behave the same |

The three themes are chosen for spread. **tidevann** is the base that defines every token.
**paper** has warm surfaces and an amber ink, and takes its surfaces from `derived`. **contrast** has
pure grounds, strong edges, and the most colors outside sRGB, where egui clips and a P3 screen shows
the web more vivid.

## The list

Existing stories are used where one already is the board. The content is what sokkel-ui's story
draws (its data and doc comment), and the egui story at that path draws the same. Three are **new**:
sokkel-ui adds them under the real title, from the fixtures in `specimens.json`.

| Story path | Matrix | Shows |
|---|---|---|
| Primitives/Actions/Button/Variants | full; pair for 12 interaction captures | variants at rest; then hover on six, keyboard focus on three, press on three |
| Primitives/Actions/Button/States | full | disabled, disabled outline, invalid, busy |
| Primitives/Actions/Button/Busy | full | busy at each size, with and without an icon |
| Primitives/Actions/Button/Reason | full; pair with focus | reasoned buttons; with keyboard focus, the reason in its tooltip |
| Primitives/Actions/Button/Sizes (new) | full; pair at 390 | xs to lg by label, icon and label, icon at the end, icon only; at 390 the finger heights |
| Primitives/Actions/Icon button/Variants | full | each variant at each icon size |
| Primitives/Inputs/Text field/Plain | full; pair with hover and focus | a plain field |
| Primitives/Inputs/Text field/With help | full | help under the control |
| Primitives/Inputs/Text field/Error | full; pair with focus | the issue mark; with focus, the 3px ring (focus only) |
| Primitives/Inputs/Text field/Multiline | full | a text area |
| Primitives/Inputs/Text field/States (new) | full | placeholder, disabled, read only, warning |
| Primitives/Inputs/Text field/Issue open (new) | full | the popover open with a detail and an action |
| Patterns/Data table/Sorted | full; pair with hover and active | 500 runs sorted by duration; a hovered row; the active row with keyboard focus |
| Patterns/Data table/Selection | full | three selected and the bar |
| Patterns/Data table/Stack width | full | a list as cards below its own stack width |
| Patterns/Data table/Empty | full | the heads and the words |
| Patterns/Data table/Loading | full | placeholder rows |
| Patterns/Data table/Stacked cards | full | cards at every width, a lead that opens the row, cards as tall as their notes |
| Patterns/Data table/Bands | pair | columns in bands, and the list's own search in its bar |
| Patterns/States/In a table | full | a refused read in a table's place, with Try again |
| Patterns/Rail/Expanded | full; pair with hover and edge focus | titled groups, the active bar, counts and a dot, the account; an entry under the pointer; the edge's line on keyboard focus |
| Patterns/Rail/Collapsed | full | icons alone, counts over them, rules for the group titles |
| Patterns/Rail/Described | full | a second line under each label |
| Patterns/Rail/Nested | full | a parent unfolded over the active entry, another folded beside its chevron |
| Patterns/Rail/Counts | full | the strip: icons over labels, counts at their corners, a dot |
| Patterns/Rail/Places above | full | a body's tree under the places, no row back |
| Patterns/Top bar/Current | full; pair at 390; pair with hover and focus | the trail to the current screen and the palette's button; at 390 the last crumb and the icon; the button hovered and focused |
| Patterns/Top bar/Ancestors | full; pair at 390 | the trail ending at the screen above; at 390 the way back |
| Patterns/Status line/Tones | full | each tone, the live dot, code and plain facts |
| Patterns/Page header/Actions | full | a title with its count and two actions, the primary last |
| Patterns/Page header/Details | full; pair at 390 | the name over its code, a sentence, facts and three actions; at 390 the actions under the title |
| Patterns/Page header/Folding | full; pair at 390 | five items before the primary; at 390 they fold into More |
| Patterns/Sections/Boxed | full | a page of boxed sections, each with its head bar |
| Patterns/Sections/Flat | full | the same page with flat headings over rules |
| Patterns/Sections/Critical | full | the critical box's rule and mark; a body on the graph's dot grid |
| Patterns/States/Page state | full | loading, refused, missing, not answering, empty, an empty state with its way in |
| Patterns/States/Secondary read | full | a side read failing in the warning tone beside the page's own content |
| Patterns/States/Failed page | pair | the failure as the page's heading |
| Primitives/Inputs/Select/Variants | full; pair with hover and focus | default and sm triggers and a placeholder, each as wide as its widest label; the trigger hovered (a look only in dark) and focused |
| Primitives/Inputs/Select/States | full | disabled, invalid with its placeholder, no options yet |
| Primitives/Inputs/Select/Quiet | full | the quiet trigger at default and sm |
| Primitives/Inputs/Select/Open | full; pair at 390; pair with a row highlighted | the list open with the chosen row's check; at 390 finger-tall rows; a row under the pointer |
| Primitives/Inputs/Select field/Icons and details | full | an option's icon in the trigger |
| Primitives/Inputs/Select field/Two-line options | full | the chosen option's detail in the trigger |
| Themes/Theme picker/Basic | full | the theme select with the chosen theme's swatch |
| Primitives/Overlays/Tooltip/Opened | full | the box above its trigger, with its arrow |
| Primitives/Overlays/Tooltip/With Shortcut | full | a box holding a key |
| Primitives/Overlays/Tooltip/Trigger | pair with hover and focus | the box after the delay, and at once on keyboard focus |
| Primitives/Menus/DropdownMenu/Row Actions | full; pair at 390; pair with highlight and destructive | icons, keys, a submenu row, a destructive row; at 390 finger-tall rows; a row and the destructive row under the pointer |
| Primitives/Menus/DropdownMenu/Items | full | check and radio rows, the gutter, inset, disabled and destructive rows |
| Primitives/Menus/DropdownMenu/Checks | full | checks and plain rows, as wide as the longest |
| Primitives/Menus/DropdownMenu/Submenus | full | two levels of submenus |
| Patterns/Dialogs/Confirm | full; pair at 390 | a ConfirmDialog, 384 wide, a destructive answer; at 390 still a box sized to its content |
| Patterns/Dialogs/Rename | full; pair with focus | a sm dialog with a shut confirm; with keyboard focus on it, its reason in the tooltip |
| Patterns/Dialogs/Busy | full | the confirm's spinner and busy label, Cancel disabled |
| Patterns/Dialogs/Run log | full | nothing to confirm: the corner close, actions alone in the footer |
| Patterns/Dialogs/Nested | full | a ConfirmDialog over a dialog that wears the nested shade |
| Patterns/Dialogs/Long content | pair; pair at 390 | a body that scrolls under its footer; at 390 a full-screen sheet |
| Apps/Settings/Dialog | full; pair at 390; pair with an entry hovered and the reset asked | the settings dialog on General; at 390 the section with Back; an entry under the pointer; the reset's ConfirmDialog over it |
| Apps/Settings/Search | full | the column and the pane narrowed by a search |
| Apps/Settings/No reset | full | a section with reset false: no Reset to defaults |
| Apps/Settings/Synced | full | the app's own footer note and a reset of every setting |
| Patterns/Command palette/Long | full; pair at 390 | groups, icons, hints, codes and keys, the list scrolling; at 390 finger-tall rows |
| Patterns/Command palette/Summaries | full; pair at 390 | a meta at each row's end, one in the critical ink (metaTone); at 390 folded under the label |
| Patterns/Command palette/Chooser | full | two-line rows, a critical second line, a hint in the warning ink |
| Patterns/Command palette/Foot | full | the strip at the foot |
| Patterns/Command palette/No match | full | No command matches. |
| Patterns/Command palette/Refused | pair with a row active and a command refused | the muted wash under the pointer; a refused command's words under the rows, the palette still open |
| Patterns/Shell/Search field | full; pair at 390 | the whole frame; at 390 the menu button, the last crumb, the palette icon |
| Patterns/Shell/Drawer | pair | the drawer open at 390 |
| Apps/Settings/Navbar | pair; pair at 390 | the settings dialog; at 390 a full-screen sheet on its list |
| Patterns/Run timeline/Month | full; pair at 390 | thirty days: the legend, day ticks, marks in each state's color, hollow upcoming runs, the Now line; at 390 the narrow names' column |
| Patterns/Run timeline/Day | full | one day: runs as bars as long as they took, hours along the ruler |
| Patterns/Run timeline/Shift | pair with a name hovered and the handle focused | a lane chosen with its handle and the hint; another name under the pointer; the handle with keyboard focus |
| Apps/Workspace/Schedules | pair | the timeline in a schedules page |
| Patterns/Clip timeline/Two tracks | full | a video and an audio track, read-only: the corner, the ruler, a waveform, the playhead |
| Patterns/Clip timeline/Editor | full; pair at 390 | four tracks with toggles, every kind's color, a dashed title, chosen clips; at 390 the narrow headers and sideways scroll |
| Patterns/Clip timeline/Locked tracks | full | a locked lane's shade, hidden and muted tracks' faint clips |
| Patterns/Clip timeline/Close zoom | full | frame ticks with minor ticks between |
| Patterns/Clip timeline/Short room | pair | the ruler, headers and corner pinned in a short room |
| Patterns/Emoji picker/Inline | full; pair with a cell hovered | Recent and the groups, the tone button, the current tab |
| Patterns/Emoji picker/Search | full | Search results for heart |
| Patterns/Emoji picker/No match | full | No emoji found |
| Patterns/Emoji picker/Skin tone | full | the medium tone chosen |
| Patterns/Emoji picker/Popover | pair | the picker in a popover over its trigger |
| Patterns/Reaction bar/Quick | full; pair with hover and focus | the quick reactions and the more button, framed |
| Patterns/Reaction bar/Selected | full | two given, pressed |
| Patterns/Reaction bar/Toolbar | full | sm, unframed |
| Patterns/Reaction bar/More | pair | the full picker open over the bar |
| Patterns/Reaction bar/Reaction counts | full | chips with counts, yours marked, the add button |
| Patterns/Composer/States | full; pair with focus in the text | stacked: empty, with files and a picture, busy, disabled; the edge and ring in `ring` with focus |
| Patterns/Composer/Inline | full; pair at 390 | the pill empty and with a short question; a wrapping question and a file open into the box; at 390 finger heights |
| Patterns/Composer/Uploads | full | upload rings and spinners, a recording and a video, Send waiting |
| Patterns/Composer/Mentions | pair | the suggestions at the caret |
| Patterns/Message composer/Empty | full; pair with hover and focus | the row with the toolbar hidden, Send faint; an action hovered, add focused |
| Patterns/Message composer/Formatting | full; pair at 390 | the toolbar, Write and Preview; at 390 More and one Preview action |
| Patterns/Message composer/Code languages | pair | the code block's menu open |
| Patterns/Message composer/JSON preview | full | a json fence in Preview |
| Patterns/Message composer/Thread reply | full | Also send to and the schedule chevron |
| Patterns/Call bar/Plain | full; pair with hover and focus; pair at 390 | every control on the floating bar, Leave as a pill; a control hovered, Mute focused; at 390 share and the hand in more |
| Patterns/Call bar/Muted and off | full | the microphone and the camera in the critical tone, share and the hand pressed |
| Patterns/Call bar/Device menu | pair | the microphone's devices, the ones in use checked |
| Patterns/Call bar/Reactions | pair | the reaction bar over the call bar |
| Patterns/Call bar/More menu | pair | the app's rows, captions checked |
| Patterns/Call bar/Docked | full | the strip on the background, a rule on top |
| Patterns/Call bar/Over a call | pair | the bar over a call's tiles |
| Patterns/Letter/Folded | full; pair with focus | a folded letter's head on one line; its focus ring |
| Patterns/Letter/Open | full; pair at 390 | an open letter, its recipients, the paperclip; at 390 no address, no indent |
| Patterns/Letter/Thread | full | folded, open, and the latest with a head that is no button |
| Patterns/Detail pane/Facts | full | a run's facts |
| Patterns/Detail pane/Sections | full | facts, steps, then the verbs |
| Patterns/Detail pane/Summary | pair | a sentence over its facts, and a diff |
| Patterns/Board item panel/Checklist | full; pair with hover and focus | 2/4 done, the bar half full, done steps quiet and struck through |
| Patterns/Board item panel/Item | full | a work item in full |
| Primitives/Inputs/Date field/Plain | full; pair with focus | a date with a value, an empty optional one with its format as the placeholder, a required one and one read only |
| Primitives/Inputs/Date field/Formats | full | the same day as YYYY-MM-DD, DD.MM.YYYY and MM/DD/YYYY |
| Primitives/Inputs/Date field/Bounds | full | a date before min, said at once by the critical edge and the issue mark; one within the bounds |
| Primitives/Inputs/Date field/Open | pair | the calendar open on the chosen day: the day filled, today marked, the days outside the bounds shut |
| Patterns/Dashboard panels/Stat tiles | full; pair with phone | values inked by thresholds, tiles filled by them, a trend behind the value, a change with what it is against, one with no data; a title cut short |
| Patterns/Dashboard panels/Panel menus | pair | a panel's and a tile's menu buttons in their heads; one menu open at the button's end |
| Patterns/Dashboard panels/Panel states | full | no data, a failed query with Retry and the raw message folded away, and figures kept but stale, on a stat tile, a panel and a chart panel |
| Patterns/Dashboard panels/Chart panels | full | chart panels in the frame: heads with titles and subtitles, the tools, padded content |
| Patterns/Dashboard panels/Figure hierarchy | pair | the three hierarchy options side by side: inked values, a fill only past a threshold, a quiet strip over plain tiles |
| Patterns/Editor/Code editor | full; pair with focus | editors in fields: YAML with a line that fails the check, a read-only JSON record, plain text without line numbers |
| Patterns/Editor/One line | full; pair with phone | a query on one line at a control's height |
| Patterns/Editor/Folding | full | a JSON record with the fold gutter and search |
| Patterns/Editor/Search | full | a read-only run log at sm, the find bar open with matches washed, the current one stronger |
| Patterns/Editor/Marks at paths | full | findings underlined on their values in the tones, dots in the lint gutter |
| Patterns/Editor/jq | full | a jq filter: keywords, strings, fields and variables colored, a ranged error underlined |
| Patterns/Editor/Languages | pair | sQL, shell and Jinja, each loaded on first use |
| Patterns/Editor/Schema | full | yAML checked against a schema: issues underlined with messages |
| Patterns/Editor/Markdown | full | a note at lg, wrapped: headings, emphasis, code, lists, quotes, links, [[links]] and #tags colored |
| Patterns/Editor/Caret line | full | activeLine always beside the default: the caret's line shaded without focus |
| Foundations/Code colors/Languages | full | every code-* color across the sample languages |
| Patterns/Dashboard panels/Targets | full | readings toward a target: the meter under each value, the reading filled in, a tick at the target and its value written out; one over its target, one with its own range, one with no data and no meter |
| Charts/Chart/Stacked | full | runs per job stacked by state in each run state's status color (statuses) |
| Charts/Chart/Palette | pair | series and slices in an app's palette in place of the theme's order |
| Charts/Line/Two series | full; pair with hover and focus | two lines over the day, the axes, grid and the legend under the chart |
| Charts/Frame/Legend list | full | the legend as a wrapped row, one series switched off: hollow swatch, struck label, 60 percent |
| Charts/Frame/Legend table | full | the legend as a table of each series' min, max, avg and current |
| Patterns/Dashboard panels/Time series | full | lines over fading areas, percentiles with a dashed threshold line in critical and a legend table, stacked areas, and steps |
| Charts/Scorecard/Solid | pair | thresholdLegend as one strip (bar layout) under a scorecard |

That is 117 stories across the full matrix (1404 captures) and 96 captures across the pair matrix
(192), **1596 per side**.

## How a state is reached

Static states are what the story draws. A hover, a focus or a press cannot be set by a story: CSS
cannot force `:hover` or `:focus-visible`, and sokkel-ui's stories must render the same without
interaction. So the specimen says the steps, each side's runner does them, and the capture's file
takes the step's name (`{slug}--{each}--...`).

| Step | Web (Playwright) | egui (egui_kittest) |
|---|---|---|
| hover | `locator.hover()` | the node's `hover()` |
| press | `mouse.down()` over it, held | a pointer-down held over the captured frame |
| click | `locator.click()` | the node's `click()`, frames run until settled |
| keyFocus | Tab until focused, so `:focus-visible` matches | Tab key events until the node has focus, so the last input kind is the keyboard |
| key | `keyboard.press` | a key event |
| resize | the viewport's width | the harness's size |

Targets are a role and a name (`button:Run now`, `row:2`, `table`), found by Playwright's
`getByRole` and by kittest's AccessKit queries alike. A part that cannot be found this way on one
side is itself a finding.

## How each side renders

**sokkel-ui.** The stories already exist, except the three new ones, which go into the existing
story files. A Playwright spec (`e2e/specimens.spec.ts`) walks the list. It opens each story's
iframe with the globals `look:<theme>;theme:<scheme>;density:<density>;motion:reduce` at the canvas
size and `deviceScaleFactor: 2`, does the steps, and saves the canvas with `animations: 'disabled'`
to `specimens/web/`. It runs in CI on request, never locally, as sokkel-ui's browser suites do.

**sokkel-egui.** One story per path in `examples/storybook`, drawing what the sokkel-ui story
draws. The snapshot test already renders one PNG per story path, so `tests/specimens.rs` only adds
the matrix and the steps: `Harness::builder().with_size(canvas).with_pixels_per_point(2.0)`, then
the appearance, the steps, `run_steps`, and the canvas into `specimens/egui/` (egui proposal,
Specimens).

**Side by side.** A script in sokkel-design (`scripts/side-by-side.ts`) reads both folders and
`specimens.json`, and writes one static page. There is a row per story and appearance, web on the
left and egui on the right. A toggle flips one over the other in place, which shows a shift of a
pixel or a shade better than looking across. Filters pick part, theme, scheme, density, and the
captures missing on one side. It is first a CI artifact of sokkel-design, and later a page beside
sokkel-ui's published Storybook. This draft publishes nothing.
