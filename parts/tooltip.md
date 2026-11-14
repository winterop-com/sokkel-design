# Tooltip

The library's one tooltip: a short line about a control, in a small inverted box beside it with an
arrow toward it. It shows once the pointer has rested on the control for 500 ms, or at once while
the control has keyboard focus, and goes when both leave. It names an icon button, says why a
control is off (a button's `reason`), names a collapsed rail's entries, and can add the key that
does the same. A touch screen has no hover: there a tap on a shut button shows its reason (`tap`).
The structured spec is [`tooltip.json`](tooltip.json).

Sources: sokkel-ui `packages/core/src/components/ui/tooltip.tsx` (`Tooltip`, `TooltipTrigger`,
`TooltipContent`, `TooltipProvider`), `ui/kbd.tsx` (`Kbd`, the key cap inside the box) and
`lib/finger.ts` (`FINGER_HIT`, `takesFinger`) and `lib/tap-tip.ts` (`tapTip`, what a tap does). sokkel-ui-egui: `crates/core/src/widgets/overlay.rs`
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
- `tap`: a tap by touch or pen on the trigger shows the box too, for a trigger a tap does nothing
  else with, such as a shut button saying why. It stays up for `tip-hold` (4000 ms), until the next
  press anywhere, or until a tap on the trigger again. A mouse press does nothing more; hover and
  focus show it as ever. A button with a `reason` sets it (parts/button).
- **Delay:** a tooltip waits 500 ms under a resting pointer, the primitive's own default, so it
  holds with or without a `TooltipProvider`; a provider's tooltips share one delay group, a
  neighbor showing at once after one has shown. Keyboard focus shows it at once.

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
  element places itself or draws its own `::after`. `TooltipTrigger` waits `TOOLTIP_DELAY` (500)
  by default, or its provider's delay. A `Button`'s reason and an `IconButton`'s name show in it,
  a `Button`'s reason also as its description (`aria-describedby`). `Tooltip` holds whether it is
  open itself, Base UI's root controlled (or as `open` says), so a tap can open it: with `tap`,
  `TooltipTrigger` tells the tooltip of a press that ends on it (`pointerup`, which a shut Base UI
  button still hears where it drops its own press and click), and a press by touch or pen shows
  it; a second tap, Base UI's outside press or `TIP_HOLD` (from `tip-hold`) closes it, and while a
  tap holds it a hover's close is refused, as a pen lifting reports one. The rail's collapsed entries and `SwitchField`'s help mark
  show in it too; no part draws a tooltip of its own.
- **sokkel-ui-egui:** `tooltip(response, text)` and `tooltip_shown(response, text)` on egui's
  `Popup` (`PopupKind::Tooltip`); the delay counts from the first frame the pointer is over the
  trigger.

## Where sokkel-ui-egui differs today

As of 26b411f (`overlay.rs` unchanged since bee2a97), the tooltip draws the box on `foreground` in
the `background` ink, `radius-md`, padded 12 by 6, `text.help`, at most 320 wide, on hover and on
keyboard focus. The differences:
1. **Side:** always under the trigger; the spec puts it above by default, with `side` and `align`.
2. **Not built:** the arrow, keys, `side` and `align`, a delay group, Escape, the finger hit area
   below 768, and `tap`.
