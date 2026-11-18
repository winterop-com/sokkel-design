# Server menu

The server an app talks to, for the top bar's actions: a dot in the state's color (pulsing while the app asks), the server's name and its version in the code face, opening a menu that says the state in words with the server's facts under it, Check again, and the app's own items. The app may add states of its own (degraded), draw a quiet face that is a silent dot until something is wrong, and list every check behind the state in a tooltip on the face and in the menu. The structured spec is [`server-menu.json`](server-menu.json).

Sources: sokkel-ui `packages/core/src/components/ServerMenu.tsx`, `packages/core/src/components/Dot.tsx`, `packages/core/src/components/ui/badge.tsx`, `packages/core/src/components/ui/dropdown-menu.tsx`, `packages/core/src/components/ui/tooltip.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| face | parts/button's ghost at sm, 8 across and 8 between its pieces: the dot, the name, the version and a chevron. Its name says words.label, the name, the version and the state. On a phone the name gives way; the dot and the version stay. |
| dot | The state's dot (index.json statuses): up in succeeded, down in failed, checking in skipped and pulsing, an app's own state in its color. Quiet and wrong, the dot also says the state in words. |
| name | The server's name, cut to its room; hidden below md. |
| version | The version in the code face on parts/badge's secondary chip. |
| chevron | A chevron down, 16, in muted-foreground; not drawn with onPress or quiet. |
| menu | parts/dropdown-menu's popup at the face's end, 288 wide: the state's label with its icon, the info, the checks behind a separator, then Check again and the app's items behind a separator. |
| stateLabel | The menu's label: the state's icon (a plug while well, a crashed server while down, turning arrows while checking, an alert otherwise), then the state in words. |
| info | Under the label, padded 8 across and 6 under, 4 apart, text.help in muted-foreground: the name at 500 in foreground, the environment after it, the version in the code face while quiet, then each fact on its own line. |
| checks | Every check behind the state, one a line, 4 apart: its dot, its name at 500, its state's words and its detail, quieter; in the menu padded 8 across and 6 down, in the tooltip under its head. |
| tooltip | With checks or checkedAt: parts/tooltip at the face's end, under it: the name at 500, the environment and the version, then words.checkedAt, then the checks. |

## Options

- `name`: What the server is called, such as the deployment's name.
- `version`: The version it answers with, drawn in the code face beside the name.
- `environment`: Which deployment it is, such as production, said beside the name in the tooltip and the menu.
- `state` (`up`, `down`, `checking`): Whether the server answers, does not, or the app is asking it now; or a state the app names in states.
- `states`: The app's own states with their words and colors, such as degraded in warning; one named up, down or checking changes that state's words or color.
- `quiet` (`false` by default): A face that is the dot alone while the server is well (its state drawn good or succeeded) or being asked, and the dot with the state in words when it is not. The name and the version stay in the menu and in the face's name.
- `checks`: Every check behind the state, each { name, state, detail? }, listed in a tooltip on the face and in the menu.
- `checkedAt`: When the server was last asked, said in the tooltip relative to now: words.checkedAt.
- `recheck`: Called as the tooltip opens while the server is not being asked, so the app can ask again.
- `onPress`: Pressing the face calls this in place of opening the menu, for an app with its own pane about the server; no menu and no chevron.
- `facts`: Lines under the name in the menu: its address, what it serves, how it stores.
- `onCheck`: Asks the server again: adds Check again to the menu, its icon turning while checking, when it says words.checking and is disabled.
- `children`: The app's own items after Check again, such as a link to a page about the server.
- `defaultOpen` (`false` by default): Starts with the menu open.

## Sizes

- face: padX `8`, gap `8`. parts/button's sm, its padding and gap set to 8.
- chevron: height `16`, width `16`
- menu: width `288`
- info: padX `8`, gap `4`. 6 under it.

## States and tokens

- rest: Up: the dot in succeeded.
- down: Not answering: the dot in failed; quiet, the state in words beside it.
- checking: Being asked: the dot in skipped, pulsing; Check again turns its icon and says words.checking.
- hover: The pointer is over the face.
- focus: Keyboard focus on the face: parts/button's focus outline.
- open: The menu is open.
- chevron at rest: ink `muted-foreground`.
- version at rest: ground `secondary`, ink `secondary-foreground`, radius `radius-chip`, text `text.badge`.
- info at rest: ink `muted-foreground`, text `text.help`.

## Keyboard

- Tab: Reaches the face; its tooltip shows on focus.
- Enter, Space, ArrowDown (the face has focus): Opens the menu (parts/dropdown-menu's keys), or calls onPress.
- Escape (the menu is open): Shuts the menu, the focus back on the face.

## Words

- `up` Connected (`serverMenu.up`)
- `down` Not answering (`serverMenu.down`)
- `checking` Checking (`serverMenu.checking`)
- `check` Check again (`serverMenu.check`)
- `label` Server (`serverMenu.label`)
- `checkedAt` Checked {ago} (`serverMenu.checkedAt`)

## Where each renderer stands

- sokkel-egui: As of 1a87987, ServerMenu was built (d163191) before this spec: the dot, the name, the version, a menu of the state, the facts, Check again and the app's items. Not yet: the checks' tooltip; not compared with this spec.
- sokkel-tui: As of b99664f its reports name no such part.
