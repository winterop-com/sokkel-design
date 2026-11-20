# Badge

A short value as a chip: a state, a version, a count, a tag. Its variants say how loud it is; kind draws it in one of the six kind colors, a wash edged faintly in the color with its ink, for a categorical value a reader learns to tell apart at a glance (what sort of form a card is, which domain a code belongs to). The same value wears the same color wherever it is shown. The structured spec is [`badge.json`](badge.json).

Sources: sokkel-ui `packages/core/src/components/ui/badge.tsx`, `packages/core/src/lib/kind.ts (KIND_CHIP, kindOf)`.

## Anatomy

| Piece | What it is |
|---|---|
| container | The chip: 20 tall, padded 6 across and 2 down, rounded by radius-chip, a 1px edge (none but where a variant or kind draws one), text.badge, on one line; an icon, 12, before or after the words, 4 apart. As wide as its words. |

## Options

- `variant` (`default`, `secondary`, `destructive`, `outline`, `ghost`, `link`; `default` by default): How loud it is: default on primary, secondary on secondary, destructive on a destructive wash, outline only edged, ghost bare, link in primary.
- `kind` (`blue`, `green`, `jade`, `pink`, `teal`, `violet`): One of the kind colors, laid over the variant: the color's wash at 12 percent, its edge at 30, its ink. kindOf(name) picks one steadily from a name, so the same value always wears the same color. The same paints as a chip's kind hue (`KIND_CHIP`, [chip](chip.md)); a badge is not a chip.
- `children`: The words, with an icon before or after them.

## Sizes

- container: height `20`, padX `6`, padY `2`, gap `4`, radius `radius-chip`, text `text.badge`. Its icon 12 square.

## States and tokens

- rest: The chip drawn.
- hover: The pointer is over it: only ghost and link answer, and a badge drawn as a link (default, secondary, destructive and outline then wash too).
- focus: Keyboard focus on a badge drawn as a link: the focus outline.
- default at rest: ground `primary`, edge `none`, ink `primary-foreground`.
- secondary at rest: ground `secondary`, edge `none`, ink `secondary-foreground`.
- destructive at rest: ground `destructive/10`, edge `none`, ink `destructive`, dark `{"ground": "destructive/20"}`.
- outline at rest: edge `border`, ink `foreground`.
- ghost at rest: edge `none`.
- ghost at hover: ground `hover`, ink `muted-foreground`.
- link at rest: edge `none`, ink `primary`.
- link at hover: underline `True`.
- kind-blue at rest: ground `kind-blue/12`, edge `kind-blue/30`, ink `kind-blue-ink`.
- kind-green at rest: ground `kind-green/12`, edge `kind-green/30`, ink `kind-green-ink`.
- kind-jade at rest: ground `kind-jade/12`, edge `kind-jade/30`, ink `kind-jade-ink`.
- kind-pink at rest: ground `kind-pink/12`, edge `kind-pink/30`, ink `kind-pink-ink`.
- kind-teal at rest: ground `kind-teal/12`, edge `kind-teal/30`, ink `kind-teal-ink`.
- kind-violet at rest: ground `kind-violet/12`, edge `kind-violet/30`, ink `kind-violet-ink`.

## Keyboard

- Tab: Reaches a badge drawn as a link (render); a plain badge takes no focus.

## Words

None: every word is the app's.

## Where each renderer stands

- sokkel-egui: As of fc9d27e: No kind on the badge (its paints are on Chip as ChipTone::Kind); no ghost or link hover; never drawn as a link; no icon after the words. The six variants and their sizes match.
- sokkel-tui: As of b99664f its reports name no such part.
