# Notification inbox

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

What the app has told the viewer, behind a bell that counts the unread: a list of notices, each with its tone, title, a line and when it came, the unread marked, with Mark all as read. The structured spec is [`notification-inbox.json`](notification-inbox.json).

Sources: sokkel-ui `packages/core/src/components/NotificationInbox.tsx`, `packages/core/src/components/Count.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| bell | A ghost icon button with a bell, named by bell; with any unread, parts' Count (small, round, critical) over its top end. |
| panel | A popover 320 wide aligned to the bell's end, unpadded: the head, then the list or the empty state. |
| head | A row padded 12 across and 8 down over a border edge: the title at text.sm, and with any unread and onMarkAllRead, Mark all as read (ghost, extra small) at its end. |
| list | No taller than 384, scrolling, padded 4: each notice a row 10 apart, padded 10 across and 8 down, rounded by radius-control. |
| notice | A dot 8 across in its tone (neutral muted-foreground at 50 percent, good, warning, critical), then a column 2 apart: the title at text.sm (500 while unread), a line at text.xs in muted-foreground, and when at text.2xs in muted-foreground; while unread, on primary at 5 percent with a dot 8 across in primary at its end. |
| empty | With no notices: a bell struck through, 20 square, over the empty words, at text.sm in muted-foreground, padded 32 down. |

## Options

- `notices`: Each notice: its id, title, line, time, tone and whether it is unread.
- `onOpen`: Makes each notice a button the app opens and marks read.
- `onMarkAllRead`: Shows Mark all as read while any is unread.
- `open`: Whether the inbox is open.

## Sizes

- panel: width `320`. 
- notice: padX `10`, padY `8`, gap `10`, radius `radius-control`. 

## States

- rest: The bell, with its count while any is unread.
- open: The panel open under the bell.
- unread: A notice not read yet: on a wash with a dot, its title at 500.
- empty: Nothing in the inbox: the empty words.
- hover: The pointer over a notice that is a button: washed.
- focus: Keyboard focus on a notice: the focus ring.

## Keyboard

- Enter (the bell or a notice has focus): Opens the inbox, or the notice with focus.
- Escape (the inbox is open): Closes the inbox.

## Words

- `bell` (`notificationInbox.bell`): "{'one': 'Notifications, {count} unread', 'other': 'Notifications, {count} unread'}"
- `title` (`notificationInbox.title`): "Notifications"
- `markAllRead` (`notificationInbox.markAllRead`): "Mark all as read"
- `empty` (`notificationInbox.empty`): "You are all caught up"
- `unread` (`notificationInbox.unread`): "Unread"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
