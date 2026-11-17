# Composer

Where a message to an assistant is written: a box on the field's ground, rounded by
`radius-composer` (twice the control radius), holding a text that grows with what is typed, the
files waiting to go, and the controls: attach, the app's tools, the microphone and a round Send,
which becomes Stop while an answer streams. Stacked, the text is on top and the controls in a row
under it; inline, it is one line, a pill, until the text needs a line of its own. The structured
spec is [`composer.json`](composer.json).

Sources: sokkel-ui `packages/core/src/components/Composer.tsx` (`Composer`, `ComposerLayout`),
`Mentions.tsx` (`useMentions`, `MentionList`, `MENTION_WORDS`), `IconButton.tsx`, `ui/textarea.tsx`,
`lib/keys.ts` (`touchTyping`, `composing`), `hooks/use-dictation.ts` and `hooks/use-file-drop.ts`.

## Anatomy

| Piece | What it is |
|---|---|
| box | `field` ground, a 1px `border-strong` edge, `elevation-surface`, `radius-composer`; with focus inside, edge and a 1 wide ring in `ring`; files dragged over it, `primary` and a 2 wide `primary/30` ring |
| text | No frame of its own; grows to 240, then scrolls; the placeholder in `muted-foreground`. Stacked: at least 48 tall, 12 in, 12 over, 4 under. Inline: 6 by 4 on a 24 line |
| row | Stacked: 8 in at the sides and foot, 4 apart: attach, the tools, a gap, the microphone, Send |
| attach | Round: a ghost paper clip at `icon-sm` stacked, a secondary plus at `icon` inline; a dictation's cancel while it hears |
| tools | The app's controls, their buttons, toggles and selects drawn round |
| dictate | A round microphone before Send; a check while it hears; shut while it transcribes |
| send, stop | Round; Send filled (`primary`), shut at `disabled-opacity` while not ready; Stop in its place while busy |
| attachments | Files over the text: file chips (56 tall, at most 224 wide, `card`, `radius-md`), image squares, recordings with a player, videos that play in a dialog; a 20 round remove at each one's corner |
| dropOverlay | `Drop files to attach them` over the box on `background/80` |
| failure | Why a dictation failed, `critical-ink`, `text.help`, on a line of its own over the row |
| dictationStrip | A pulsing `critical` mark, the level or the words heard, and the time, 32 tall |
| mentionList | People suggested at the caret, 256 wide and at most 256 tall, 4 from the line |

## Inline: the pill and the box

`layout="inline"` draws attach, the text, the tools and Send on one line, a pill whose corners are
half its height plus 12 (half of `density.control`, or of a finger below 768, plus 12). It opens
into the box, the text on a line of its own over the controls and the corners `radius-composer`,
once the text (or the placeholder, while there is none) is wider than the room the controls leave,
breaks a line or wraps past a line and a half, or files, dictation or a failure show. It closes back
once the text fits with 8 px to spare, so it does not flip at the edge. The corners ease between
the two over `motion-base`.

## Options

`value`, `onChange`, `onSend`, `onStop`, `busy`; `attachments` (kind `image`, `file`, `audio`,
`video`), `onAttach`, `onRemove`, `onCancel`, `accept`, `onRefuse`; `tools`; `dictation`;
`mentions`; `layout` (`stacked` by default, or `inline`); `disabled`.

## Keyboard

- Enter sends when the composer is ready, not while an input method composes; Shift+Enter breaks
  the line. On a touch screen (a coarse pointer and no hover) Enter breaks the line and only Send
  sends.
- With the suggestions open: Down and Up move, stopping at the ends; Enter or Tab puts the person in
  as `@handle` (Enter does not send); Escape closes them.
- Escape cancels a dictation that hears or transcribes, or clears its failure.

## Words

`placeholder` Ask anything, `send` Send, `stop` Stop, `attach` Attach files, `remove` Remove, `drop`
Drop files to attach them, `cancel` Cancel upload, `uploading` Uploading, `waiting` Waiting for files
to upload, `close` Close; `dictation.*`: Dictate, Finish dictating, Cancel dictation, Listening,
Transcribing, Voice level, and the three failures; `mentions.*`: People to mention, No one by that
name, Searching. The players' words are the media players'.

## Where sokkel-ui-egui differs today

As of 48f51ce there is no composer.
