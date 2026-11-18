# Message composer

Where a message to people is written, as at the foot of a team chat's channel: the formatting
toolbar on top, the text, and a row with add, the text style toggle, emoji, mention, the app's
actions and a round Send, in a box on the field's ground rounded by `radius-composer`. The
structured spec is [`message-composer.json`](message-composer.json).

Sources: sokkel-ui `packages/core/src/components/MessageComposer.tsx` (`MessageComposer`,
`MessageComposerAction`, `CODE_LANGUAGES`), `Mentions.tsx`, `EmojiPicker.tsx`, `Segmented.tsx`,
`Markdown.tsx`, `TagChips.tsx` (`fitCount`) and `ui/dropdown-menu.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| box | `field` ground, a 1px `border-strong` edge, `radius-composer`, `text.body`; its edge `ring` with focus inside |
| toolbar | Bold, italic, underline, strikethrough; link, numbered and bulleted lists; code and code block, 2 apart with a 16 `border` rule between groups; those that do not fit behind More formatting |
| action | A 28 round button, a 16 icon in `muted-foreground`; hover and an open menu on `hover` in `foreground`; pressed in `foreground` |
| mode | Write and Preview as a segmented choice from 448 wide (the composer's own width); narrower, one Preview action |
| text | At least 40 tall, 12 by 8 on a 24 line, growing to 240; hidden while previewing |
| preview | The message as a sent one draws it, scrolling past 384 |
| alsoSend | A checkbox, Also send to and the channel, `text.help` in `muted-foreground` |
| row | 8 in and 6 under, 2 apart |
| add | A 28 round button on `secondary`, a plus in `muted-foreground` |
| send | 28 round; `primary` with something written, `faint` and shut when empty; with a schedule, the left of a pair with the chevron, ruled in `primary-foreground/25` |

## Options

`value`, `onChange`, `onSend`; `onAttach`; `emojiPicker` or `onEmoji`; `mentions` or `onMention`;
`actions`, `onMore`; `schedule`, `onSchedule`, `onSendLater`; `alsoSendTo`, `alsoSend`,
`onAlsoSendChange`; `defaultFormatting` (on), `preview` (on), `math` (on); `mode` (`write` or
`preview`); `codeLanguages`; `disabled`.

## Keyboard

- Enter sends when the text holds something, not while an input method composes; Shift+Enter
  breaks the line. On a touch screen Enter breaks the line and only Send sends.
- The suggestions' keys are parts/composer's.
- Each action is a button: Tab reaches it, Enter or Space presses it. The menus are
  parts/dropdown-menu's; the emoji picker parts/emoji-picker's.

## Words

`placeholder` Message, `send` Send, `sendLater` Schedule for later, `customTime` Custom time,
`alsoSend` Also send to, `attach` Attach, `formatting` Show or hide formatting, `emoji` Emoji,
`mention` Mention someone, `more` More, `moreFormatting` More formatting, `mode` Write or preview,
`write` Write, `preview` Preview, `nothingToPreview` Nothing to preview, `codeLanguage` Language,
`plainText` Plain text, `format.*` the formats' names, `mentions.*` the suggestions' words.

## Where sokkel-egui differs today

As of 1a87987 there is no message composer.
