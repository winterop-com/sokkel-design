# Tooltip

A short line about a control, in a small inverted box beside it with an arrow toward it. It shows
once the pointer rests on the control, or while the control has keyboard focus, and goes when both
leave. It names an icon button, says why a control is off (a button's `reason`), and can add the
key that does the same. The structured spec is [`tooltip.json`](tooltip.json).

Sources: sokkel-ui `packages/core/src/components/ui/tooltip.tsx` (`Tooltip`, `TooltipTrigger`,
`TooltipContent`, `TooltipProvider`), `ui/kbd.tsx` (`Kbd`, the key cap inside the box) and
`lib/finger.ts` (`FINGER_HIT`, `takesFinger`). sokkel-ui-egui: `crates/core/src/widgets/overlay.rs`
(`tooltip`, `tooltip_shown`).

## Anatomy

| Piece | What it is |
|---|---|
| trigger | The control it speaks for; below 768 it takes a finger's hit area, centered, keeping its drawn size |
| box | The line on the `foreground` ground in the `background` ink, as wide as its words up to 320, then wrapping; above the trigger by default, 4 away, centered |
| arrow | A 10 square turned 45 degrees at the box's edge toward the trigger, in the box's ground |
| keys | A key cap after the words, on a wash of the background over the box |

## Options

- `side` (`top` by default, then `bottom`, `left`, `right`, `inline-start`, `inline-end`) and `align`
  (`center` by default, `start`, `end`); the box moves to the other side when there is no room.
- `sideOffset` (4), `delay`, `open`, and keys (`Kbd`) after the words.
- **Delay:** a tooltip waits Base UI's 600 ms under a resting pointer. Inside sokkel-ui's
  `TooltipProvider` it waits 0, and the provider's tooltips share one delay group. Keyboard focus
  shows it at once.

## Sizes

| | Value |
|---|---|
| box | 12 across, 6 down, 6 between the words and the keys; `text.help`; `radius-md`; at most 320 wide; with keys its end pads 6 |
| arrow | 10 square, `radius-mini`, half of it past the box's edge |
| keys | 20 tall, at least 20 wide, 4 across; `text.badge`; `radius-sm` |
| trigger | a `spacing-finger` hit area below 768 |

Nothing varies by density.

## States and tokens

| State | Paint |
|---|---|
| rest | not shown |
| open | box: ground `foreground`, ink `background`, `radius-md`, no edge and no shadow. arrow: `foreground`. keys: ground `background/20` (`background/10` in dark), ink `background`, `radius-sm` |

## Keyboard

- Tab onto the trigger shows the box while the focus stays.
- Escape hides it; the focus stays on the trigger.

## Words

None of its own. The app gives the line (what the control does, or why it is off) and the keys,
which never say anything said nowhere else.

## Renderer-specific

- **sokkel-ui:** Base UI's Tooltip, a portal, shown on hover and on `focus-visible`, moving to the
  other side when there is no room. `TooltipTrigger` adds the finger hit area unless its `render`
  element places itself or draws its own `::after`. A `Button`'s reason and an `IconButton`'s name
  show in it. The rail's collapsed entries and `SwitchField`'s reason draw a box of their own on the
  popover ground without an arrow (`parts/rail`).
- **sokkel-ui-egui:** `tooltip(response, text)` and `tooltip_shown(response, text)` on egui's
  `Popup` (`PopupKind::Tooltip`); the delay counts from the first frame the pointer is over the
  trigger.

## Where sokkel-ui-egui differs today

As of 26b411f (`overlay.rs` unchanged since bee2a97), the tooltip draws the box on `foreground` in
the `background` ink, `radius-md`, padded 12 by 6, `text.help`, at most 320 wide, on hover and on
keyboard focus. The differences:
1. **Side:** always under the trigger; the spec puts it above by default, with `side` and `align`.
2. **Delay:** 0.5 s, where the spec has 600 ms (0 inside a provider).
3. **Not built:** the arrow, keys, `side` and `align`, a delay group, Escape, and the finger hit
   area below 768.
