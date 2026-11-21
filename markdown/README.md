# The markdown tree

A markdown text is read once into a tree, and every renderer draws the tree. A server can read a
note and send the tree to the web, egui and terminal apps alike, and they agree on what the note
holds: its headings and links, its callouts, its embeds, its properties. sokkel-ui's
`parseMarkdown` (`lib/markdown-tree`) is the reference reader, and its `Markdown` draws a tree with
`tree` as it draws text. The schema is [`schema/markdown-tree.schema.json`](../schema/markdown-tree.schema.json).

## What the tree holds

The tree holds what the text says, never what an app allows. Whether a link is live, whether an
image is fetched, which schemes are allowed, where an address points (`resolveUrl`) and whether raw
HTML is read are decided when the tree is drawn, by each renderer, from the app's options
(`parts/markdown-view`). The same tree drawn under two policies draws two ways.

It is [mdast](https://github.com/syntax-tree/mdast): CommonMark and GitHub-flavored markdown
(tables, task items, strikethrough, footnotes, autolinks) and math (`math`, `inlineMath`), with the
nodes below. Every node is a plain object: no `data`, and `position` only where a reader is asked to
keep it. Asked to keep it, a reader places the nodes notes add too: a `wikiLink`, `embed`, `tag` or
`highlight` spans what was written for it (`[[...]]`, `![[...]]`, `#tag`, `==...==`), escapes and
character references included, and a text cut from another keeps its own words' place; the words
a link or embed shows are made from it and have none. Text next to text is one node. A renderer given a tree draws no node's `data`, which in
mdast can name any element and property to draw: what is drawn comes from the node types alone. Link references stay references, resolved by their
`definition` when drawn, as mdast has them.

| Node | Fields | Read from |
|---|---|---|
| `yaml` | `value`, `properties`? | The frontmatter: `---` on the first line, closed by `---` or `...` on a line of its own, every line between reading as YAML properties (blank, a comment, indented, a list item, or a key and a colon). First in the root, its `value` with `\n` line ends whatever the text was written with. `properties` is the YAML read as JSON values when it is a mapping |
| `callout` | `kind`, `marker`, `fold`?, children | A quote whose first line starts `[!marker]`: the marker lowercased, the kind it draws as, `+` (open) or `-` (closed) after it |
| `calloutTitle` | children | The rest of the marker's line, first in its callout. A further marker with nothing written after it is titled with its own word, capitalized (`Todo`); one of the five kinds with nothing written has no title, and a renderer says the kind's word |
| `wikiLink` | `target`, `heading`?, `label`?, children | `[[target#heading\|label]]`; the children are the words shown: the label, else the target, with ` › ` and the heading; a `[` written escaped (`\[[`) opens none |
| `embed` | `kind: note`, `target`, `heading`?, children | `![[note]]`; a block where it stands alone in a paragraph (it takes the paragraph's place), inline in a sentence; an escaped `\!` leaves the `!` a word and the `[[note]]` a link |
| `embed` | `kind: image`, `target`, `alt`, `width`?, `height`? | `![[file.png\|300]]` or `\|300x200`; other words after the bar are its alt text, else the target is |
| `embed` | `kind: file`, `target`, children | `![[file.pdf]]`: any other file ending but `.md` |
| `tag` | `tag` | `#tag` after the start, a space or an opening mark: letters, digits, `_`, `-` and `/`, at least one of them not a digit; a `#` written escaped (`\#`) opens none |
| `highlight` | children | `==words==` on one line, a non-space after the opening `==` and before the closing one; its words may run through inline nodes (`==a **b** c==`), the two `==` in texts of the same parent; an `=` written escaped (`\=`) neither opens nor closes one |
| `part` | `id` | `<!-- part:ID -->` (or another word a reader is given); a block where its parent holds blocks, inline in a sentence |

Callout markers draw as the five kinds: `note`, `info`, `todo`, `abstract`, `summary`, `tldr`,
`example`, `quote` and `cite` as note; `tip`, `hint`, `success`, `check` and `done` as tip;
`important`, `question`, `help` and `faq` as important; `warning` and `attention` as warning;
`caution`, `danger`, `error`, `failure`, `fail`, `missing` and `bug` as caution. Any other marker
leaves a quote, a word every object of the renderer's language has (`constructor`, `toString`)
included.

Image file endings: apng, avif, bmp, gif, jpg, jpeg, png, svg and webp.

What is never read into the tree: HTML comments (dropped), `%%` comments (dropped: from a `%%` to
the next, inline or over any number of lines, blank lines and blocks inside included; a `%%` inside
code, written escaped as `\%%`, or left open with no `%%` after it stays words), anything inside code
(no links, tags or highlights there), links between notes inside a markdown link's words,
`[[#heading]]` with no note. What a comment leaves stands as written: `a %%x%% b` reads `a  b`, and
a paragraph a comment leaves with no words is no paragraph.

What is read as text, left for later: inline footnotes `^[...]`, block ids `^id`.
A single line break is a space in the text, as CommonMark has it.

## Math

A `$` is math as Pandoc reads it: a non-space after the opening `$`, a non-space before the closing
one and no digit after it, on one line, so prices stay prices. `\(...\)` is inline math, and
`$$...$$`, `\[...\]` and a `math` fence on lines of their own are display math.

## Fixtures

[`fixtures/`](fixtures) holds texts (`.md`) and the trees they read into (`.json`), read with every
option on and positions off. A reader of the tree reads each text into its tree exactly; sokkel-ui
checks its own against them, and `scripts/check.py` holds each tree to the schema. A new rule comes
with a fixture that shows it.
