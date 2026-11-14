# Dialog

A box over the page that asks or shows one thing. A title and an optional line under it, a body
that scrolls when it is taller than the window allows, and a footer with Cancel and the one
confirming verb at its end. The page under it is shaded and out of reach. From 768 it is a box
edged in `border-strong` on `elevation-dialog`; **below 768**, on a phone or a foldable, any other
dialog is a full-screen sheet, at the line the rest of the frame turns at. **ConfirmDialog** is
this dialog at its narrowest (`sm`, 384) and stays a box sized to its words at every width: its
title is the question, its line the detail, its confirm the answer. The
settings dialog ([`parts/settings-dialog`](settings-dialog.md)) and the command palette
([`parts/command-palette`](command-palette.md)) are drawn in this dialog's box. The structured spec
is [`dialog.json`](dialog.json).

Sources: sokkel-ui `packages/core/src/components/DialogShell.tsx` (`DialogShell`, `ConfirmDialog`,
`DialogConfirm`, `DialogShellWords`/`DIALOG_SHELL_WORDS`, `shellParts`, `NESTED`, `WIDTHS`),
`ui/dialog.tsx` (`Dialog`, `DialogContent` with `showCloseButton` and `closeLabel`, `DialogOverlay`,
`DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`), `ui/button.tsx` (the verbs, a
confirm's `reason` and `busy`). sokkel-ui-egui: `crates/core/src/widgets/overlay.rs` (`Dialog`,
`ConfirmDialog`, `ConfirmAnswer`).

## Anatomy

| Piece | What it is |
|---|---|
| backdrop | The shade over the page, the dim alone. A press on it closes the dialog unless it is held or `closeOnOutsidePress` is false |
| box | Centered on the popover ground, a 1px `border-strong` edge and `elevation-dialog` under it, padded 16, its pieces 16 apart. As wide as its `width` allows, at most the window less 32 across and 64 down. Below 768 a sheet fills the screen with no edge or shadow |
| header | The title and the line under it, 8 apart; 32 kept at its end while the corner close is drawn |
| title, description | What the dialog is for, in the heading face; one line under it, muted. A ConfirmDialog's question and detail |
| close | The corner close, an `icon-sm` ghost button 8 in from the top and the end, named "Close". Only in a dialog with nothing to confirm that can be dismissed |
| header bar | What the app holds under the title, outside the scroll: a step indicator, a tab bar |
| body | The app's content, scrolling inside the box, its children 16 apart. Opening focuses its first field |
| status | Between the body and the footer, outside the scroll: a refusal (a problem line), a status line |
| footer | A band on `muted/50` under a rule: the app's note, the form's issue count, then the verbs |
| verbs | Cancel (ghost), Back (outline), the app's actions, the confirm. One row while they fit, else a line each with the confirm on top. Once a busy confirm has run `busy-release`, Cancel says "Stop waiting" |
| confirm | The one confirming verb (`parts/button`), default or destructive; shut with a reason, or busy |
| nested shade | `shade/40` over the whole box while another dialog is open over it |

## Options

- `width`, from 768: `sm` 384, `md` 512 (default), `lg` 672, `xl` 896, or `full`, the window less
  32 across and down (a workbench). ConfirmDialog is always `sm`.
- `phone`, below 768: `sheet` (default) fills the screen with square corners, no edge and no
  shadow, and holds the footer to its foot, clear of the home indicator; `fit` stays a box at its
  width, at most the window less 32, sized to its content. ConfirmDialog is always `fit`.
- `title`, `description`, `header`, `confirm` (`{ label, onConfirm, why?, busy?, busyLabel?,
  destructive? }`), `back`, `actions`, `status`, `footer`, `count`, the body.
- `dismissible` (default true; false drops Cancel and the close, and Escape and the backdrop leave it
  open), `closeOnOutsidePress` (default true), `busyRelease` (ms a busy confirm holds the dialog;
  `busy-release`, 5000, by default), `initialFocus` (`confirm` focuses the confirm, so
  Enter confirms), `finalFocus`.
- Which parts are drawn follows from what was given (`shellParts`): a confirm brings Cancel and no
  corner close; a dialog with nothing to confirm closes from the corner, its actions standing alone.

## Sizes

| | Value |
|---|---|
| box | padded 16, 16 between its pieces, `radius-surface`, `text.body`; at most the window less 32 wide and less 64 tall |
| widths | from 768: `sm` 384, `md` 512, `lg` 672, `xl` 896, `full` the window less 32; a `fit` dialog keeps its width below 768 too, at most the window less 32 |
| header | 8 between the title (`text.detail-title`) and the description (`text.body`) |
| close | `density.control-sm` square, corners at most 12, a finger square below 768, 8 from the top and the end |
| body | 16 between its children |
| footer | 16 all round, 8 between its pieces: 65 tall at regular with a default verb (61 compact); the note `text.help` |

## States and tokens

| State | Paint |
|---|---|
| rest | backdrop: `shade/10`, the dim alone. box: `popover`, `popover-foreground`, `radius-surface`, a 1px `border-strong` edge, `elevation-dialog` under it (`elevation-pop`'s layers until a theme sets its own). description: `muted-foreground`. footer: `muted/50`, a `border` rule along its top. note: `muted-foreground` |
| nested | `shade/40` over the whole box |
| shut | the confirm at 0.5, `not-allowed`, still focusable; its reason in the library's tooltip on hover and on keyboard focus (principle 13) |
| busy | the confirm's spinner before its busy label, at full strength and `progress`; Cancel and Back disabled; Escape and the backdrop do nothing |
| released | after `busy-release` (5 seconds) busy: Cancel says "Stop waiting" and closes, and Escape closes; the backdrop still holds, the confirm stays busy until the work settles; letting it go calls the confirm's `onStopWaiting`, where the app stops the work if it can and says how it ended elsewhere |
| held | `dismissible` false: no Cancel, no close; Escape and the backdrop do nothing |
| phone | below 768, `sheet`: the box fills the screen with square corners, no edge and no shadow |

**No blur.** Every renderer draws the same backdrop, the dim (`shade/10`) alone; nothing blurs what
is under it.

## Keyboard

- Tab moves through the dialog's controls, held inside it.
- Escape closes it, focus back on what opened it, unless it is held, or busy and not yet past
  `busy-release`.
- Enter on the confirm confirms; `initialFocus="confirm"` opens on it.

## Words

`DIALOG_SHELL_WORDS`: `cancel` "Cancel", `back` "Back", `close` "Close" (the corner close's name),
`stopWaiting` "Stop waiting" (Cancel's word once a busy confirm has run `busy-release`).
The app gives the title or question, the description or detail, the confirm's label, busy label and
reason, and the body.

## Renderer-specific

- **sokkel-ui:** Base UI's Dialog, a portal on `layer-dialog` over the page it makes inert; focus held
  inside and given back on close. Below `breakpoint-md` (`max-md`) a sheet fills the screen
  (`SHEET`) and a fit dialog keeps its width (`FIT_WIDTHS`); from it the width holds. Opening
  focuses the first field in the body, once the body is drawn. The box fades and zooms in from 95 percent over `motion-fast` (100 ms), as far as
  motion allows. The verbs wrap in reverse, each growing, so the confirm stands on top.
- **sokkel-ui-egui:** `Dialog::new(id, title).description(..).width(..).show(ctx, body, footer)`
  returns true when it asks to close; the footer is laid out from the end, so the app adds the confirm
  first. `ConfirmDialog::new(id, question, confirm)` with `detail`, `destructive`, `busy` and `cancel`
  answers `Confirm` or `Cancel`. egui's `Modal` blocks the page; its backdrop is the dim alone.

## Where sokkel-ui-egui differs today

As of 26b411f (`overlay.rs` unchanged since bee2a97), `Dialog` draws the box padded 16, the title
and description 8 apart, the body 16 under them and the footer band on `muted/50` under a rule, over
a `shade/10` backdrop; `ConfirmDialog` draws the question, the detail, Cancel and a default or
destructive answer, busy. The differences:
1. **Width:** 384 unless set, not held to the window. The spec has `md` (512) by default and the
   named widths, at most the window less 32.
2. **Edge and shadow:** a `foreground/10` stroke inside the box and a shadow (0 14, blur 44, black at
   18 percent, 47 in dark). The spec has a `border-strong` edge and `elevation-dialog`, and neither
   on a full-screen sheet.
3. **Footer:** 64 tall at every density, its rule inside. The spec has 16 over and under the verbs
   and the rule above: 65 at regular, 61 at compact.
4. **Verbs:** the app's closure, laid out from the end in one row. The spec places Cancel, Back, the
   actions and the confirm itself, wrapping to a line each.
5. **Story path:** `Primitives/Overlays/Dialog`; specimens pair by sokkel-ui's `Patterns/Dialogs`.
6. **Not built:** the corner close, the header bar, status, the footer's note and count, a shut
   confirm with its reason, back, actions, the nested shade, the phone sheet and `fit`, initial and
   final focus, a body that scrolls inside the window, `dismissible` and `closeOnOutsidePress`.
