# Markdown view

A markdown text drawn as prose: GitHub-flavored markdown with callouts, math, diagrams, the app's own
parts, links between notes and tags, and notes as a vault writes them (frontmatter, comments,
titled and folded callouts, highlights, embeds). Raw HTML is shown as typed unless the app allows
it, and then it is sanitized. Text other people wrote is held to what the app allows. Every color
and size is the theme's. The structured spec is [`markdown-view.json`](markdown-view.json).

Sources: sokkel-ui `packages/core/src/components/markdown-view.tsx` (`MarkdownView`,
`MARKDOWN_WORDS`, `splitFrontmatter`, `markdownSection`, `markdownHeadings`), `Markdown.tsx` (with
math and diagrams), `PlainMarkdown.tsx` (without them), `MermaidDiagram.tsx` (the diagram frame),
`ui/code-block.tsx` (a fence's frame and copy), and `lib/wiki-links.ts`, `lib/highlighter.tsx`,
`lib/math.ts`, `lib/markdown-html.ts`.

## Text and tree

A text is read once into its tree, and the tree is drawn. The tree holds what the text says (mdast
with the nodes linked notes add, [`markdown/README.md`](../markdown/README.md)); what the app allows
is held as it is drawn. `tree` draws a tree read elsewhere, such as on a server that reads each note
once for every renderer, exactly as the text would draw: sokkel-ui's tests hold the two the same.

## What is drawn for each kind of node

| Node | Drawn as |
|---|---|
| body | `text.sm` on relaxed lines in `foreground`; a block's first child has no space above, its last none below. With `measure`, prose stops at `reading-measure` while tables, code, diagrams, math and parts take the full width |
| heading | By level and scale, below; h5 and h6 in the body's text. With `anchors`, an id from its words, a repeat numbered `-1`, `-2` |
| paragraph | 8 above and below. A single line break is a space (CommonMark) |
| list | Disc or decimal, 20 in, 8 above and below, items 2 apart; a task item's checkbox is read only |
| quote | A 2 wide `border-strong` rule, 12 in, in `muted-foreground` |
| rule | A 1px `border` rule, 16 above and below |
| table | Scrolls sideways inside itself; cells with a 1px `border` edge, 10 across and 4 down; the head row on `muted`, its text a column head (one step above the cells); a head row of empty cells left out |
| code in a sentence | `chip` on `muted` (default), `plain`, or `wash` (on `secondary`, no fill in a table) |
| fence | The code block in the `code-*` colors, with a copy. Built in: bash, css, diff, html, javascript, jq, json, jsx, markdown, python, rust, sql, tsx, typescript, xml, yaml, and ansi output |
| diagram | A `mermaid` fence in the theme's colors, a pie's slices and an xychart's bars and lines in `chart-1` to `chart-5` in order, in its frame: a diagram and source toggle, a copy and an expand into a window. Bad source shows the source and `failed`; while streaming, the source |
| math | `$...$`, `\(...\)`, `$$...$$`, `\[...\]` and a `math` fence; a lone `$` is math only as Pandoc reads it; a formula that does not parse is its source in the failed ink |
| link | `primary-ink`, underlined; in-page links stay, `onLink` keeps the app's own, others open a new tab; a scheme not allowed draws the words |
| `[[link]]` | With `links`: followed through `onOpen`, the heading after a chevron, a missing note at 60 percent |
| `#tag` | With `onTag`: a chip on `primary/12` |
| image | Its own size, at most the view's width; with `images` off its alt text and address, nothing fetched |
| `![[...]]` | A note through `links.embed`, set off by a 2 wide `border-strong` rule, else its link in a 1px `border` frame; an image file as an image (`|300` a width, `|300x200` both, other words its alt); any other file a link. Never a stray `!` |
| callout | `[!kind]` on its first line: the kind's wash, edge, icon and title. The title is the rest of the marker's line, or the kind's word. `-` folds it closed and `+` open, the title then the fold's control with a chevron |
| frontmatter | A YAML block at the top whose lines read as properties: `hide` (default), `show` as YAML code above the text, or `markdown` |
| comment | `<!-- ... -->`: never drawn, HTML allowed or not |
| `==words==` | A highlight on `warning/25` in the text's own ink |
| search match | With `highlight`: on `primary/15` in `primary-ink`, outside code and math |
| part | `<!-- part:ID -->`: the app's part, a block on its own line (12 above and below), inline in a sentence |
| footnotes | References as superscript links; the notes at the end, each with a link back |
| caret | With `caret` while streaming: a 6 by 16 `foreground` block after the last words, pulsing |

Not read, so shown as typed: `%%comments%%`, inline footnotes `^[...]` and block ids `^id`.

## Prose text roles

The contract adds no prose roles: headings take the page's own roles, so a document's h1 matches a
page title and a reply's largest heading a detail title.

| Level | `message` scale | `document` scale |
|---|---|---|
| h1 | `text.detail-title`, 20 above, 8 below | `text.page-title`, 24 above, 12 below |
| h2 | `text.section-title` at 600, 16 above, 8 below | `text.detail-title`, 20 above, 8 below |
| h3 | `text.section-title`, 12 above, 6 below | `text.section-title`, 16 above, 6 below |
| h4 | `text.head`, 12 above, 4 below | `text.head`, 12 above, 4 below |
| h5, h6 | the body's | the body's |

## Callout kinds

| Kind | Wash | Edge | Ink | Icon | Further markers drawn as it |
|---|---|---|---|---|---|
| note | `info/8` | `info/45` | `info-ink` | info | info, todo, abstract, summary, tldr, example, quote, cite |
| tip | `good/8` | `good/45` | `good-ink` | lightbulb | hint, success, check, done |
| important | `kind-violet/8` | `kind-violet/45` | `kind-violet-ink` | message-square-warning | question, help, faq |
| warning | `warning/8` | `warning/50` | `warning-ink` | triangle-alert | attention |
| caution | `critical/8` | `critical/45` | `critical-ink` | circle-alert | danger, error, failure, fail, missing, bug |

A further marker with no title written is titled with its own word, capitalized (`Todo`); any other
marker leaves a quote. Each box is 12 across and 10 down, its icon 16 and 10 from the title.

## Options

`content` or `tree`, `scale` (`message`, `document`), `inlineCode` (`chip`, `plain`, `wash`), `frontmatter` (`hide`,
`show`, `markdown`), `streaming`, `caret`, `allowHtml`, `images`, `linkSchemes`, `resolveUrl`,
`inline`, `headingOffset`, `anchors`, `math`, `measure`, `parts`, `partMarker`, `links`, `live`,
`highlight`, `onLink` and `words`, as the JSON says. `live={false}` draws every link as its words,
and `highlight` marks a search's words: together they draw a backlink's line in the row that opens
its note.

## Words

The callouts' titles: `note`, `tip`, `important`, `warning`, `caution` (`markdown.*`). A fence's copy
says `codeBlock.copy` and `codeBlock.copied`; a diagram's frame says `mermaidDiagram.*` (`source`,
`diagram`, `failed`, `expand`, `close`, `away`, `copy`, `copied`).

## Renderers

sokkel-ui draws it with react-markdown, KaTeX and Mermaid (`rendererSpecific`). sokkel-egui has a
markdown widget of its own, built before this spec, without tables, math, images, footnotes or
frontmatter; sokkel-tui has none yet (`drift`).
