# Reaction bar

Reactions, in two parts that work together. `ReactionBar` is a row of quick reactions as round
buttons with the emoji large, and a more button at its end that opens the full emoji picker
(parts/emoji-picker) in a popover; either way the emoji and its name go to `onReact`, and the ones
the person already gave are drawn pressed. Framed, it floats over a video or a message on the popup's
look; unframed, it sits in a toolbar or in `ReactionPopover`. In a narrow room the reactions scroll
sideways while the more button stays at the end. `ReactionChips` are the reactions under a message:
each emoji with its count, yours marked, a press adding or taking back yours, and a button that opens
the bar. The structured spec is [`reaction-bar.json`](reaction-bar.json).

Sources: sokkel-ui `packages/core/src/components/ReactionBar.tsx` (`ReactionBar`, `ReactionPopover`,
`ReactionChips`, `REACTION_BAR_WORDS`, `REACTION_CHIPS_WORDS`, `QUICK_REACTIONS`, `toggleReaction`,
`mineOf`), `EmojiPicker.tsx` and `lib/popup.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| bar | A toolbar; framed, the popup's look (`popover`, a 1px `border-strong` edge, `radius-surface`, `elevation-pop`), padded 4 |
| reactions | The quick reactions, 2 apart, scrolling sideways with no bar |
| reaction | A circle, 36 with the emoji at `text.emoji` (md), or 28 at `text.base` (sm) |
| more | The more button, outside the scroll, a 20 smile-plus in `muted-foreground` |
| chips | A wrapping row, 4 apart |
| chip | 24 tall, 6 across, 4 between the emoji and the count, `radius-control`, the count in `text.badge` |
| add | A chip-shaped button holding a 14 smile-plus, with a tooltip |

## Options

`ReactionBar`: `onReact`, `reactions` (`QUICK_REACTIONS` by default), `selected`, `more` (on),
`moreOpen`, `defaultMoreOpen`, `onMoreOpenChange`, `picker`, `size` (`md` or `sm`), `framed` (on).
`ReactionChips`: `reactions` (`{ id, icon, label, count, mine? }`), `onReact`, `onReaction` (opens
the bar) or `onAddReaction` (the app's own), `bar`.

## States and tokens

| State | Paint |
|---|---|
| hover | a reaction or the more button on `hover`, the more icon `foreground`; a chip or the add button edged `border-strong`, the add icon `foreground` |
| focus (keyboard) | a reaction or the more button: the focus outline in `ring`, `focus-ring-width`, drawn `focus-ring-offset` inside the circle, beside a given reaction's pressed ring; a chip or the add button: a `focus-ring-width` ring in `ring/50`, no offset |
| pressed | a given quick reaction on `primary/12` with a 1 wide `primary/60` ring |
| open | the more button on `hover`, the add button edged `border-strong` |
| chip rest | `muted` ground, no edge, `muted-foreground` ink |
| mine | `primary/12` ground, `primary/60` edge, `primary-ink` |

## Keyboard

- Left and Right move between the bar's buttons, the more button included, stopping at the first
  and the last.
- Enter or Space gives a reaction, opens the full list, toggles a chip or opens the bar.
- Escape closes an open popover, focus back on its button.

## Words

`label` Reactions, `more` More reactions, `react` Add a reaction, `count` {label}, {count} (the
count not grouped: `thumbs up, 1200`). The full list's words are parts/emoji-picker's.

## Where sokkel-ui-egui differs today

As of 48f51ce there is no reaction bar or reaction chips.
