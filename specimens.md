# Specimens

Specimens are a fixed list of stories that both renderers draw, compared by eye. **A specimen's id
is a Storybook story path**: title and story name, exactly as sokkel-ui's sidebar shows them
(`Primitives/Actions/Button/Variants`). The egui storybook has a story at the same path, so the two
captures pair by name with no mapping file. Both capture the story's canvas only, never the
storybook's chrome. Motion is stopped, the scale is 2, and the file is
`{slug}--{theme}-{scheme}-{density}.png`. The slug is the id in lower case with `/` and spaces turned
into `_`, as sokkel-ui-egui's snapshot test already names its files. The list is
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
| Patterns/States/In a table | full | a refused read in a table's place, with Try again |
| Patterns/Rail/Expanded | full; pair with hover and edge focus | titled groups, the active bar, counts and a dot, the account; an entry under the pointer; the edge's line on keyboard focus |
| Patterns/Rail/Collapsed | full | icons alone, counts over them, rules for the group titles |
| Patterns/Rail/Described | full | a second line under each label |
| Patterns/Rail/Nested | full | a parent unfolded over the active entry, another folded beside its chevron |
| Patterns/Rail/Counts | full | the strip: icons over labels, counts at their corners, a dot |
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
| Patterns/Shell/Search field | full; pair at 390 | the whole frame; at 390 the menu button, the last crumb, the palette icon |
| Patterns/Shell/Drawer | pair | the drawer open at 390 |
| Apps/Settings/Navbar | pair; pair at 390 | the settings dialog; at 390 a full-screen sheet on its list |

That is 35 stories across the full matrix (420 captures) and 32 captures across the pair matrix
(64), **484 per side**.

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

**sokkel-ui-egui.** One story per path in `examples/storybook`, drawing what the sokkel-ui story
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
