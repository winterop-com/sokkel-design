# JSON tree

A JSON value as a tree that folds, in the code face. Each list or object is a line with a
disclosure, its key and its opening bracket. It is open to a depth and folded below it, and a folded
one shows how many entries it holds. Its entries stand one under the other behind a guide line, and
strings, numbers, booleans and null are inked by type. An open list or object draws its first
entries up to a limit, with a step under them that draws as many more, so a long response opens at
once. The structured spec is [`json-tree.json`](json-tree.json).

Sources: sokkel-ui `packages/core/src/components/JsonTree.tsx` (`JsonTree`, `JsonTreeProps`,
`JSON_TREE_WORDS`, `JSON_TREE_MESSAGES`). Stories: Patterns/Data (JSON tree, Long JSON), and a run's
Outputs in a side panel (`src/stories/fixtures/runPanel.tsx`).

## Anatomy

| Piece | What it is |
|---|---|
| tree | `font-mono text-xs leading-5`: `text.xs` in the code face, lines 20 tall |
| node | A native button with `aria-expanded`: the disclosure, the key, the opening bracket, and when folded the count and the closing bracket. `radius-sm` |
| disclosure | A 14 chevron in `muted-foreground`, turned 90 degrees while open |
| key | The entry's name and `: ` in `foreground`. List entries have none |
| bracket | `{ }` or `[ ]` in `muted-foreground` |
| count | Folded only, in `faint`, 4 in from each bracket: `words.keys` for an object, the bare number for a list |
| entries | 7 in to a 1px `border` guide line, then 4 more |
| leaf | 16 in: its key, then the value |
| string, number, boolean, null | `kind-green-ink` in quotes (breaking anywhere), `kind-blue-ink` in tabular figures, `kind-violet-ink`, `muted-foreground` |
| close | The closing bracket on its own line, 16 in from the node's start |
| step | `words.more`, 16 in from the entries' start, in `primary-ink`, underlined on hover |

## Options

`value`, `open` (2: levels open at the start), `limit` (100: entries drawn before the step, at least
1), `words`.

## States and tokens

| State | Paint |
|---|---|
| rest | A folded node, a leaf |
| open | The disclosure turned down, the entries behind the guide, the step while more remain, the closing bracket on its own line |
| hover | A node: `hover` ground. The step: underlined |
| focus (keyboard) | A node or the step: a `focus-ring-width` ring in `ring` on its own edge, no offset |

## Keyboard

- Tab reaches each node and each step.
- Enter or Space on a node folds or unfolds it. On a step, it draws the next entries up to the limit.

## Words

`keys` {count} key / {count} keys (`jsonTree.keys`), the folded object's count. `more` Show {count}
more (`jsonTree.more`), where `count` is what a press adds: the limit, or the rest when fewer remain.

## In cells

One row a node or leaf; a long string wraps at any character. The tree keeps a column at its start
for a top node's focus bar. A node is the disclosure (`chevron-right` folded, `chevron-down` open,
in `muted-foreground`), a blank column, the key, then the bracket. Folded, the count follows 1 column
in from each bracket. An open node's entries stand 2 columns in: the guide (the box glyphs' `down`
in `border`) under the disclosure, a blank column, then the entries. A leaf, the closing bracket and
the step stand 2 columns further in, where a node's key starts. Keyboard focus is `focus-ring-start`
and `focus-ring-end` in `ring` beside a node or the step. Density changes nothing.

## Where the other renderers differ today

- sokkel-egui, as of 1a87987: JsonTree is built, from before this spec, and not yet compared with it.
- sokkel-tui, as of b99664f: there is no JSON tree.
