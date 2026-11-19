# Item card

The card for one thing: a project, a job, an album, a plan. Its title is the thing's name, or its code when it has none, the code drawn once in the code face. An icon on a tile may lead the title; a status, a description and facts at the foot follow, and media such as artwork may sit on top. Given href or onSelect the whole card is one control; selected marks the chosen card of a set, and a menu sits at the head's end as its own control. The structured spec is [`item-card.json`](item-card.json).

Sources: sokkel-ui `packages/core/src/components/ItemCard.tsx`, `packages/core/src/components/ItemHeading.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| card | The card: a column on card with a border-strong edge, rounded by radius-surface, text.sm in card-foreground. With href or onSelect the whole card is one control under its pieces. |
| media | With media: drawn edge to edge at the top, 16 by 9, on muted; in a box of fixed height it gives up height first. |
| body | The head, the status and the description, padded 16, 8 apart. |
| head | The icon's tile, the heading, the selected check and the menu in a row, 8 apart, set at the top. |
| icon | With icon: a 32 tile on muted, rounded by radius-lg, 4 more before the heading, its glyph 16 in foreground. |
| heading | The thing's heading as ItemHeading draws it at panel size: its name, else its code in the code face, the code under the name when both are given; up to titleLines lines, its whole text on hover when cut. |
| check | While selected: a 20 circle in primary with a check, 14, in primary-foreground. |
| menu | With menu: a 28 square button at the head's end, a dot-dot-dot, 16, in muted-foreground, opening parts/dropdown-menu at its end, 176 wide. It is its own control, over the card's. |
| status | With status: its chips and words in a row that wraps, 8 apart, text.xs in muted-foreground. |
| description | With description: up to three lines in muted-foreground. |
| facts | With facts: the card's foot behind a border rule, padded 16 across and 10 down, as many columns as fit (each at least 80), 12 apart: each fact's label in text.xs and muted-foreground over its value in text.sm in tabular figures, each cut to one line. |

## Options

- `title`: The name; with none, the code is the title.
- `code`: The thing's addressable code, drawn once in the code face.
- `description`: Up to three lines about it.
- `icon`: A glyph on a tile of its own before the title, saying what kind of thing the card is.
- `media`: Drawn edge to edge at the top: artwork, a preview.
- `status`: Chips and words in a row under the head.
- `facts`: The card's foot: each { label, value }.
- `menu`: Dropdown menu items behind the head's more button.
- `href`: The whole card is a link to it.
- `onSelect`: The whole card is a button that calls this.
- `selected`: Marks the chosen card when the cards are a set to choose from.
- `titleLines` (`2` by default): How many lines the title may take before it is cut short: 1, 2 or 3.

## Sizes

- body: padX `16`, padY `16`, gap `8`
- head: gap `8`
- icon: height `32`, width `32`, radius `radius-lg`
- check: height `20`, width `20`
- menu: height `28`, width `28`, radius `radius-md`
- status: gap `8`
- facts: padX `16`, padY `10`, gap `12`
- layout.factMin: `80`. A fact's column is at least this wide; the foot fits as many as its width holds.

## States and tokens

- rest: The card at rest.
- hover: The pointer is over a card that is a control: washed, its edge firmer.
- focus: Keyboard focus on the card: the focus outline around it.
- selected: The chosen card of a set: a primary edge with a 1px primary ring, and the check in the head.
- card at rest: ground `card`, edge `border-strong`, ink `card-foreground`, radius `radius-surface`, text `text.sm`.
- card at hover: ground `hover`, edge `foreground/25`.
- card at selected: edge `primary`, ring `{"color": "primary", "width": 1}`.
- card at focus: ring `{"color": "ring", "width": "focus-ring-width", "offset": "focus-ring-offset"}`.
- icon at rest: ground `muted`, ink `foreground`, radius `radius-lg`.
- check at rest: ground `primary`, ink `primary-foreground`.
- menu at rest: ink `muted-foreground`, radius `radius-md`.
- menu at hover: ground `hover`, ink `foreground`.
- menu at focus: ring `{"color": "ring", "width": "focus-ring-width", "offset": "focus-ring-offset"}`.
- status at rest: ink `muted-foreground`, text `text.xs`.
- description at rest: ink `muted-foreground`.
- facts at rest: rule `border`.

## Keyboard

- Tab: Reaches the card when it is a control, then its menu.
- Enter (the card has focus): Follows href, or calls onSelect.
- Enter, Space, ArrowDown (the menu button has focus): Opens the menu (parts/dropdown-menu's keys).

## Words

- `menu` More actions (`itemCard.menu`)

## Where each renderer stands

- sokkel-egui: As of fc9d27e: Always a control; no titleLines cap or hover text; no media, icon tile, menu or href; selected is a 2px stroke with no check; the status one line and the description not capped; facts split the width equally rather than fitting columns of at least 80.
- sokkel-tui: As of b99664f its reports name no such part.
