# Call bar

The controls of a video or audio call, as a round bar floating over the call's picture or a strip
docked across its foot: the microphone and the camera, each with a chevron opening the app's lists
of devices; sharing the screen; reactions, a toggle that stands the reaction bar
(parts/reaction-bar) over the bar; raising a hand; more, the app's own rows; and Leave. A muted
microphone and a camera off are drawn in the critical tone; sharing, a raised hand and open
reactions are drawn pressed. Each control is offered only when its handler is given, and one menu is
open at a time. The bar measures its own room and moves its less needed controls into more as it
narrows, so it never widens the page. The structured spec is [`call-bar.json`](call-bar.json).

Sources: sokkel-ui `packages/core/src/components/CallBar.tsx` (`CallBar`, `CALL_BAR_WORDS`,
`CALL_BAR_SHORTCUTS`, `CallDeviceList`, `CallBarItem`, `CallBarMenu`), with `ui/button.tsx`,
`ui/dropdown-menu.tsx`, `ui/popover.tsx`, `ui/tooltip.tsx` and `ReactionBar.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| frame | As wide as its container, centering the bar; docked, a strip on `background` with a 1px `border` rule on top, 12 across and 8 down |
| bar | A toolbar, controls 8 apart; floating, the popup's look (`popover`, a 1px `border-strong` edge, `elevation-pop`), fully round, padded 6 |
| control | A circle `density.control-lg` square, a ghost button on `muted`, icon 16, a finger square below 768 |
| microphone, camera | Toggles; with device lists, joined to their chevron as one round control |
| devices | The chevron, 24 wide (at least 32 below 768), an up chevron 14, opening a menu of radio groups under headings |
| share, hand | Pressed toggles, in a wide room only |
| reactions | A pressed toggle while the reaction bar stands over it, in a popover padded 4 |
| more | An ellipsis opening the moved controls and the app's rows |
| leave | On `critical`; a pill with its icon and Leave, 16 in, in a wide room; round otherwise |
| tooltip | Each control's name above it, with its keys for the microphone and the camera |

## Room

Measured on the frame's own box, never the window: from 576 (36rem) everything is in the bar;
below it share and raise hand move into more as check items and Leave is round; below 416 (26rem)
the device lists follow as submenus of more.

## Options

`muted`/`onMutedChange`, `microphones`, `cameraOff`/`onCameraOffChange`, `cameras`,
`sharing`/`onSharingChange`, `onReact`, `reactions`, `reactionPicker`,
`handRaised`/`onHandRaisedChange`, `more` (`CallBarItem`s), `onLeave`, `openMenu`
(`microphone`, `camera`, `reactions`, `more`; with `defaultOpenMenu` and `onOpenMenuChange`),
`placement` (`floating` or `docked`), `shortcuts` (off; `true` for Mod+D and Mod+E, or the app's own
chords).

## States and tokens

| State | Paint |
|---|---|
| rest | a control on `muted` in `foreground`; Leave on `critical` in `critical-foreground` |
| hover | a control on `hover` in `foreground`; Leave on `critical/85` |
| focus (keyboard) | the button's focus outline: `ring`, `focus-ring-width`, `focus-ring-offset` outside |
| pressed | `primary/12` ground, `primary-ink`, a 1 wide `primary/60` ring |
| open | a chevron or more on `hover` in `foreground` |
| off | the toggle and its chevron on `critical/15` in `critical-ink`; under the pointer `critical/25`, still in `critical-ink` |

The docked strip's controls stand on `background`, the floating bar's on `popover`; the spec's
`standsOn` names the floating one.

## Keyboard

- Left and Right move between the bar's controls, the chevrons included, stopping at the first and
  the last.
- Enter or Space presses a control.
- With `shortcuts`: Mod+D mutes or unmutes, Mod+E turns the camera off or on, in a text input too.
- Escape closes an open menu or the reaction bar, focus back on its control.

## Words

`label` Call controls, `mute` Mute, `unmute` Unmute, `microphoneDevices` Microphone settings,
`cameraOff` Turn off camera, `cameraOn` Turn on camera, `cameraDevices` Camera settings,
`microphone` Microphone, `camera` Camera, `share` Share screen, `reactions` Reactions, `raiseHand`
Raise hand, `more` More options, `leave` Leave, `shortcutGroup` Call, `shortcutMicrophone` Mute or
unmute, `shortcutCamera` Turn the camera on or off. The reaction bar's words are
parts/reaction-bar's, passed through `words.reactionBar`.

## Where sokkel-egui differs today

As of 9038006 there is no call bar.
