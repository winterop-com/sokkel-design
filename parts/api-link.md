# API link

A small chip naming the request behind a screen, its method and path: GET /api/jobs/nightly-export. A press on its copy button copies the method and the path (or the app's own value, such as a curl line); with href the path is a link to the API's reference or the raw response; with open the whole chip is one link that opens the address in a new tab. The method is quiet for a read, in the warning ink for a write and in the critical ink for a delete. The structured spec is [`api-link.json`](api-link.json).

Sources: sokkel-ui `packages/core/src/components/ApiLink.tsx`, `packages/core/src/components/CopyButton.tsx`, `packages/core/src/components/Link.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| chip | The chip: 24 tall, on a faint muted wash with a border edge, rounded by radius-chip, 8 in at its start; the method, the path, then the copy button at its end, 6 apart. As wide as it needs, at most its room. |
| method | The method in capitals, in the code face at text.xs and 500: muted-foreground for a read (GET and the rest), warning-ink for POST, PUT and PATCH, critical-ink for DELETE. |
| path | The path in the code face at text.xs, cut to its room with its whole text on hover. With href, a link: underlined under the pointer, an arrow after it. |
| copy | parts/button's icon-xs copy button (CopyButton), naming words.copy and saying words.copied once pressed. |
| arrow | With open, an arrow up and right after the path, 12 square, in muted-foreground, standing for the new tab. |

## Options

- `method` (`"GET"` by default): The request's method, drawn in capitals.
- `path`: The path, such as /api/jobs/nightly-export.
- `href`: Makes the path a link that opens in a new tab: the API's reference or the raw response.
- `copyValue`: What the copy button copies in place of the method and the path, such as the full address or a curl line.
- `open` (`false` by default): The whole chip is one link that opens href (or the path) in a new tab, padded 8 at both ends, in place of the copy button.

## Sizes

- chip: height `24`, gap `6`, radius `radius-chip`. 8 in at the start (layout.chipStart); with open 8 at the end too, else the copy button ends it.
- layout.chipStart: `8`. The chip's padding before the method.

## States and tokens

- rest: A read: the method in the quiet ink.
- write: A write: the method in the warning ink.
- delete: A delete: the method in the critical ink.
- hover: The pointer is over the chip (open) or the path (href).
- focus: Keyboard focus on the chip (open) or the path (href): the focus outline.
- chip at rest: ground `muted/50`, edge `border`, radius `radius-chip`.
- open at rest: ground `muted/50`, edge `border`, ink `foreground`, radius `radius-chip`.
- open at hover: ground `hover`.
- open at focus: ring `{"color": "ring", "width": "focus-ring-width"}`.
- method at rest: ink `muted-foreground`, text `text.xs`, weight `500`.
- method at write: ink `warning-ink`.
- method at delete: ink `critical-ink`.
- path at rest: text `text.xs`.
- path at hover: underline `True`.
- path at focus: ring `{"color": "ring", "width": "focus-ring-width"}`.
- arrow at rest: ink `muted-foreground`.

## Keyboard

- Tab: Reaches the path when it is a link, then the copy button; with open, the chip.
- Enter (the path or the chip (open) has focus): Opens the address in a new tab.
- Enter, Space (the copy button has focus): Copies the request; the button says words.copied a moment.

## Words

- `copy` Copy the request (`apiLink.copy`)
- `copied` Copied (`apiLink.copied`)
- `opens` opens in a new tab (`apiLink.opens`)

## Where each renderer stands

- sokkel-egui: As of fc9d27e: The method at weight 400 (spec 500); the path is never cut and has no hover text; no href, open or opens; the copy button is a drawn 24 square, not button icon-xs. Ground, edge, radius, gaps and the verbs' inks match.
- sokkel-tui: As of b99664f its reports name no such part.
