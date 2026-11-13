# Button

A button: words, an icon and words, or an icon alone named by its label. A button that cannot act
now says why. A busy button keeps its place, its look and its focus. The structured spec is
[`button.json`](button.json).

Sources: sokkel-ui `packages/core/src/components/ui/button.tsx` (`Button`, `buttonVariants`) and
`IconButton.tsx`; sokkel-ui-egui `crates/core/src/widgets/button.rs`.

## Anatomy

| Piece | What it is |
|---|---|
| container | The pressable box: ground, a 1px edge (transparent unless the variant draws one), corners from `radius-control` |
| label | The words, on one line and never wrapped (`whitespace-nowrap`) |
| icon | A glyph before the label (`iconPlace: start`) or after it (`end`); all of an icon button |
| spinner | While `busy`: in the leading icon's place, or before the label when there is none; the label stays |
| tooltip | An icon button's `label`, a `reason`, and a `shortcut` drawn as a key |

## Options

- `variant`: `default` (filled), `outline`, `secondary`, `ghost`, `destructive`, `link`. One filled
  button per group, the main action, last.
- `size`: `xs` `sm` `default` `lg`, and the square `icon-xs` `icon-sm` `icon` `icon-lg`.
- `busy`, `reason`, `disabled`, `destructiveHover` (the `Button` prop; `IconButton`'s `destructive`).
- Icon button (`IconButton`): `label` (required: the accessible name and the tooltip, one string so
  they never drift), `tooltip`, `shortcut`, `pressed` for a toggle. It defaults to `ghost` and
  `icon-sm`, with its icon in `muted-foreground` until hovered.
- Context made explicit (rule 2): `iconPlace` stands for `has-data-[icon=inline-start|end]`,
  `opensMenu` for `aria-haspopup` and `aria-expanded`, and `inGroup` for
  `in-data-[slot=button-group]`.

## Sizes

Heights come from the control-height density tokens **landing in sokkel-ui** (a PR in progress):
`density.control-xs`, `-sm`, `density.control`, `-lg`. They are today's look at regular and one
step smaller at compact (the compact values may still shift slightly). Until the PR lands,
`button.tsx` fixes them at 24/28/32/36 at both densities.

| Size | Height (regular / compact) | Pad x (with icon) | Gap | Icon | Text | Corners | Below 768 |
|---|---|---|---|---|---|---|---|
| xs | `density.control-xs` 24 / 20 | 8 (6) | 4 | 12 | `text.badge` 13/20/500 | `radius-control`, at most 10 | unchanged |
| sm | `density.control-sm` 28 / 24 | 10 (6) | 4 | 14 | `text.badge` | `radius-control`, at most 12 | min height `spacing-finger` (44) |
| default | `density.control` 32 / 28 | 10 (8) | 6 | 16 | `text.action` 15/22/500 | `radius-control` | min height 44 |
| lg | `density.control-lg` 36 / 32 | 10 (8) | 6 | 16 | `text.action` | `radius-control` | min height 44 |
| icon-xs | square at `control-xs` | | | 12 | | at most 10 | unchanged |
| icon-sm | square at `control-sm` | | | 16 | | at most 12 | 44 x 44 |
| icon | square at `control` | | | 16 | | `radius-control` | 44 x 44 |
| icon-lg | square at `control-lg` | | | 16 | | `radius-control` | 44 x 44 |

Inside a group (`inGroup`), xs and sm take the full `radius-control`. The spinner has the icon's size.

## States

| State | Reached by | Effect |
|---|---|---|
| rest | | The variant's paint |
| hover | Pointer over an enabled, idle button | The variant's hover paint |
| focus | Keyboard (`on: keyboard`, `:focus-visible`) | A 2px `ring` outline, 2px off the box |
| pressed | Pointer down | Sinks 1px (`translate-y-px`); not when it opens a menu |
| open | Its menu is open (`aria-expanded`) | outline and ghost: `hover` ground; secondary keeps its rest |
| disabled | `reason` or `disabled` | Opacity 0.5, no presses. With `reason` it stays in the tab order and the reason shows on hover and on focus; `disabled` alone takes it out |
| invalid | `aria-invalid` (no prop sets it) | Edge `destructive` and a 3px `destructive/20` ring (dark: `destructive/50` and `destructive/40`) |
| busy | `busy` | The spinner shows. Presses are ignored. It keeps focus and its rest look at full opacity, with no hover (`aria-busy`, `aria-disabled`) |

## Tokens per variant

| Variant | Rest: ground / edge / ink | Hover |
|---|---|---|
| default | `primary` / none / `primary-foreground` | ground `primary/80`, which **replaces** the ground |
| outline | `background` / `border` / inherit; dark: `input/30` / `input` | ground `hover`, ink `foreground` |
| secondary | `secondary` / none / `secondary-foreground` | ground `mix(secondary, foreground 5%)` in oklch |
| ghost | none / none / inherit | ground `hover`, ink `foreground` |
| destructive | `destructive/10` (dark `/20`) / none / `destructive` | ground `destructive/20` (dark `/30`); focus edge `destructive/40` |
| link | none / none / `primary` | underlined, 4px offset |
| icon button | none / none / `muted-foreground` | ground `hover`, ink `foreground`; `pressed: true` gives ground `muted`, ink `foreground` |
| + destructiveHover | the variant's | ground `critical/10`, ink `critical-ink` |

`hover` is `foreground` at 8 percent (12 in dark) over transparent, so a hover wash shows the ground
beneath it.

## Keyboard

- Tab reaches the button. It also reaches a busy button and one with a `reason`, but not one
  `disabled` without a reason.
- Enter and Space press it, when it is enabled and not busy.
- Focus shows the tooltip: an icon button's label, a reason, a shortcut.

## Words

A button has no words of its own. The app gives every one: the content, an icon button's `label`,
the `reason`, the `tooltip` and the `shortcut` (as `shortcutLabel` writes it).

## Renderer-specific

- **sokkel-ui:** Base UI's `Button` with `focusableWhenDisabled`. The tooltip is Base UI's, wrapped
  around the button. The spinner is hidden from a screen reader, and the button says `aria-busy`.
  The hover expressions stay in its classes (`hover:bg-primary/80`); its parts test maps each paint
  expression to the class it expects.
- **sokkel-ui-egui:** it reads `paints` (`button.<variant>.<state>.container`) and never mixes. The
  spinner is painted, with a repaint each frame (it should stand still when motion is reduced; there
  is no motion token yet). A busy or reasoned button keeps its focus with
  `Sense::focusable_noninteractive`. A disabled tooltip is `on_disabled_hover_text`.

## Where sokkel-ui-egui differs today

As read on 2026-11-13. The hover now replaces the ground, and busy and reasoned buttons keep their
focus, so those are off this list.
1. **Secondary hover** blends in gamma space (`lerp_to_gamma`). It goes away once the widget reads
   the resolved paint.
2. **The focus ring shows on any focus**, not only keyboard focus. Keyboard-only means tracking the
   last input kind.
3. `sm` with an icon pads 8 where the spec says 6.
4. Not built yet: the icon sizes and IconButton, `destructiveHover`, `opensMenu` with `open`,
   `inGroup`, an icon at the end, `invalid`, the finger heights below 768, and heights from the
   control density tokens (fixed 24/28/32/36 today).

In sokkel-ui, the heights are fixed until the control-height tokens land.
