# Code editor

A document in a language, colored by its tokens in the `code-*` colors, with line numbers, the
caret's line shaded, bracket matching, undo and Tab indenting. Marks wash a line or underline a
range (in JSON or YAML the value at a path) in a tone; a JSON Schema checks a JSON or YAML document
as it is typed and completes its keys and values, a key whose object requires keys going in whole as
a snippet. The app's words are offered while typing and described on hover. A find and replace bar,
a fold gutter, brackets colored by depth and indent guides are options, dropped past a megabyte. It
is boxed like a field, fills a pane, or is one line at a control's height as a query bar. In markdown
it completes `[[links]]` to other notes and follows one clicked with Mod held. The structured spec is
[`code-editor.json`](code-editor.json).

Sources: sokkel-ui `packages/core/src/components/CodeEditor.tsx` (`CodeEditor`, `CodeEditorProps`,
`CodeMark`, `CodeProblem`, `codeProblems`, `CodeCompletion`, `CodeRange`, `CodeLinks`,
`linkCompletions`, `wikiLinkAt`, `defineLanguage`, `loadCodeLanguage`, `languageForMediaType`,
`LARGE_DOCUMENT`, `codeReadOnly`, and the module's `HIGHLIGHT`, `THEME` and `SIZES`), `code/schema.ts`
(`SCHEMA_WORDS`, `schemaCompletion`, `requiredSnippet`, `schemaProblems`, `schemaHover`,
`pathRange`), `code/guides.ts`, `code/jq.ts`, `code/markdown.ts`, `code/shared.ts`,
`lib/issue-edge.ts` (`ISSUE_WITHIN_EDGE`), `lib/wiki-links.ts` and `lib/plugins.ts`.

## Where each look is set

Two places, and the parts test reads each from its own:

- **The box** is Tailwind classes on the host (`data-slot="code-editor"`): `bg-field border
  border-input rounded-control`, `min-h-24` for `field`, `h-(--density-control)
  max-md:min-h-finger` for `line`, `bg-background` for `pane`, `focus-within:border-ring/80`,
  `ISSUE_WITHIN_EDGE.critical` while `invalid`, and the read-only ground through `--editor-paper`.
- **Everything inside** is CodeMirror's: the token colors in `HIGHLIGHT` (a `HighlightStyle`, each
  tag group in a `var(--code-*)`), the chrome in `THEME` (an `EditorView.theme`, each rule naming a
  token's variable), the text size in `SIZES`. The `.json` notes name each rule's selector.

## Anatomy

| Piece | What it is |
|---|---|
| box | `field`: field ground, 1px `input` edge, `radius-control`, at least 96 tall; `pane`: `background`, no edge; `line`: `density.control` tall, a finger below md |
| text | Mono (`typeface-mono`), `foreground`, 8 over and under, lines 12 in at the sides; on the `editor-ground` wash |
| gutter | Line numbers in `editor-gutter-ink` on the `editor-gutter` wash, opaque; 12 before and 8 after, at least 40 wide |
| activeLine | `foreground/5` while focused (or always with `activeLine: 'always'`); the caret's number in `foreground` |
| selection | `primary/28`; the matching bracket `primary/22` with a 1px `primary/50` outline |
| lineMark | A whole line in its tone: `critical/14`, `warning/14`, `info/12` |
| rangeMark | A wavy underline in the tone, 0.2em under; the problem at the caret on `warning/18` |
| lintDot | An 8 dot in the tone, in a 16 wide gutter |
| tooltip | `popover`, 1px `border` edge, `radius-control`, `elevation-pop`, `text.xs`, padded 10 by 6; a problem's message with a 3 wide start rule in its tone |
| completion | Mono rows 8 by 2, icon and detail in `muted-foreground`, matched letters at 600; the chosen row `accent` in `accent-foreground`; a deprecated word struck through |
| foldGutter, foldPlaceholder | Fold marks padded 4, `foreground` under the pointer; a folded block on `muted` in `muted-foreground`, 6 across |
| searchPanel | On `muted`, a 1px `border` rule under it, `text.xs`; fields on `field` with an `input` edge (`ring` on focus), buttons on `background` with a `border` edge (`accent` under the pointer); matches `warning/24`, the current `warning/48` |
| bracket | By depth in `code-bracket-1`, `-2`, `-3` |
| indentGuide | 1px `border` rule per indent step |
| wikiLink | Underlined, pointer a hand, while Mod is held |
| syntax-* | One piece per token group (below) |

## Languages and their colors

`json`, `yaml`, `jq` and `markdown` are carried; `sql`, `shell` and `jinja` load the first time an
editor shows one; `text` colors nothing. An installed domain plugin adds its languages by name and
media type. A language may also be a CodeMirror `LanguageSupport` or a named stream parser.

| Token group | Color |
|---|---|
| keywords (definition, modifier, control, module) | `code-keyword` |
| operators | `code-operator` |
| punctuation, separators, brackets; markdown list marks | `code-punctuation` |
| strings, characters; markdown inline code | `code-string` |
| regular expressions, escapes | `code-regexp` |
| numbers | `code-number` |
| booleans, null, atoms, named constants | `code-constant` |
| comments (italic); markdown quotes | `code-comment` |
| functions, macros | `code-function` |
| special variables, self (`$`, `@` names) | `code-variable` |
| types, classes, namespaces | `code-type` |
| property names (JSON and YAML keys) | `code-property` |
| tag names | `code-tag` |
| attribute names, labels | `code-attribute` |
| headings (600) | `code-heading` |
| links, addresses, `[[links]]`, `#tags` | `code-link` |
| inserted, deleted | `code-inserted`, `code-deleted` |
| invalid | `code-invalid` |

Strong text is drawn at 600, emphasis italic, strikethrough struck, all in the text's ink.

## Options

`language`, `value` or `doc` (a shared document), `variant` (`field`, `pane`, `line`), `size` (`sm`
at `text.xs`, `md` at `text.sm` on `leading-code`, `lg` at `text.base`), `readOnly`,
`lineNumbers`, `activeLine` (`true`, `false`, `always`), `wrap`, `marks`, `completions`,
`languageWords`, `links`, `onFollowLink`, `hover`, `onRun`, `keys`, `search` with `defaultSearch`,
`folding`, `bracketColors`, `indentGuides`, `schema` with `deferred` and `resolveSchema`, `reveal`,
`onProblems`, `onDocument`, `invalid`, `placeholder`, `label`, `id`, `phrases`, `words`.

**Schema completion.** With a schema, a JSON or YAML document's property names and enum values are
offered while typing, the required ones first; a key with a default goes in with the default
selected; a key whose object requires keys goes in as a snippet holding the whole object, each
required key with its default, its constant or first choice, or a field for the type it takes, Tab
going from field to field. Keys already written are not offered again; a key's type and description
show on hover.

## States and tokens

| State | Paint |
|---|---|
| rest | the box on `field` with an `input` edge; the text in `foreground` on `editor-ground` |
| focus (any) | the edge `ring/80`; the caret's line `foreground/5`, its number `foreground` |
| invalid | the edge `critical/80`; with focus `critical` and the `invalid-ring` ring, `invalid-ring-width` |
| readOnly | outside a pane, the ground `mix-oklab(muted 40%, background)` |
| always | the caret's line shaded without focus |
| held | `[[links]]` underlined, the pointer a hand |
| error, warning, info | a mark or problem in `critical`, `warning` or `info` |

## Keyboard

- Mod+Enter runs (`onRun`); in the `line` variant Enter runs too, and never breaks the line.
- Tab and Shift+Tab indent; Escape then Tab leaves the editor. Mod+Z, Mod+Y and Mod+Shift+Z undo
  and redo, one history across a shared document's editors.
- Ctrl+Space opens the completion list; the arrows and Page keys move in it, Enter puts the word in,
  Escape closes it; Tab and Shift+Tab move between a snippet's fields.
- With `search`: Mod+F opens the bar, F3 or Mod+G and Shift+F3 or Mod+Shift+G move between
  matches, Escape closes it; Mod+D, Mod+Shift+L and Mod+Alt+G select the next occurrence, every
  occurrence, or go to a line.
- With `folding`: Ctrl+Shift+[ and Ctrl+Shift+] (Cmd+Alt+[ and ] on a Mac) fold and unfold the
  block, Ctrl+Alt+[ and ] every block. These are CodeMirror's own keys on `[` and `]`, which
  principle 17 keeps off a part's primary keys; the fold gutter is the other way in
  (open-questions.md).
- Mod+click follows a `[[link]]` with `onFollowLink`.

## Words

The schema check's words, `SCHEMA_WORDS` in `code/schema.ts`, merged with `words`: `say(issue)`
says each issue kind (written here as `issue.<kind>`, with `exclusiveMinimum` and
`exclusiveMaximum` for the exclusive limits): Missing the property {property}, {property} is not a
known property, Expected {a} {expected}, Expected one of {values}, Expected {value}, Must be at
least or more than {limit}, Must be at most or less than {limit}, Use at least or at most {count}
characters, Must match {pattern}, Expected the {format} format, Needs at least or Holds at most
{count} items, Each item only once, the deprecated sentence, The schema cannot be checked:
{reason}, and the checker's own message with its first letter raised. `syntax(language)` says Not
valid JSON or Not valid YAML; `deprecated` stands beside a deprecated key offered in completion.
CodeMirror's own words (the find bar, the fold marks) are passed through `phrases`.

## Renderer notes

- **sokkel-ui:** CodeMirror 6 is its one code editing engine. Settings that change are compartments
  reconfigured in place, so the document, the caret and the history stay. The schema checker and
  three languages load on first use. A document's `$schema` address is untrusted: the editor
  fetches nothing, `resolveSchema` decides.
- **sokkel-egui:** draws the `code-*` colors, the marks and the problems from this spec with an
  engine of its own choice.

## Where sokkel-egui differs today

As of b7e1763 there is no code editor.

## Folding's keys

Mod+. folds the block at the caret and Mod+Shift+. unfolds it; Mod+Alt+. folds every block and
Mod+Alt+Shift+. unfolds them (`FOLD_KEYS` in `CodeEditor.tsx`). CodeMirror's bracket keys,
Ctrl+Shift+[ and ] and Ctrl+Alt+[ and ], stay as the second keys, as principle 17 asks of a part that
offers a bracket.
