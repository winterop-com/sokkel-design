# Section

A titled part of a page. **Boxed**, the default, is a bordered surface whose head is a bar of its
own, its title set like a table's column heads in the text color. Its line and ground are a framed
table's and a card's, and its head is as tall as a listing's head row, so they sit together in every
theme. **Flat** is a heading over a rule with the content on the page's own ground, for the rare
page that wants it. Either takes a count or fact beside the title, a description under it, and
actions at the head's end. A tone draws the body as a graph's dot grid or marks the section
critical. The structured spec is [`section.json`](section.json).

Sources: sokkel-ui `packages/core/src/components/Section.tsx` (`Section`, `SectionProps`,
`SectionTone`, `GRAPH`) and `PaneHeader.tsx`, which draws the head (`variant="panel"` in the box,
`plain` with `inset={false}` over a flat section). sokkel-ui-egui has no Section yet:
`crates/core/src/widgets/display.rs` (`Card` with `bar(true)`) draws the boxed head.

## Anatomy

| Piece | What it is |
|---|---|
| box | Boxed: the card's ground in a 1px edge, rounded `radius-surface`, clipping its content to its corners |
| head | Boxed: the bar across the box's top on the section heads' ground over their rule. At least `density.panel-head` tall; it grows to hold a description |
| flat head | Flat: the heading line over a rule on the page's ground, with no inset of its own |
| mark | Tone critical: a warning mark before the title |
| title | An `h2`, cut short on one line: `text.head` in the box, in its own case, and `text.section-title` in the flat head. The section is labelled by it |
| meta | A count or short fact beside the title, drawn as a page header's count: the body face with tabular figures. It drops under the title when both do not fit |
| description | A sentence under the title, in the head |
| actions | Controls at the head's end; under the title when they would squeeze it, wrapping from the end when wider than the head |
| body | Padded `density.panel-pad` in the box unless `flush`; on the page's ground a section gap under a flat head. With `fill` it scrolls inside a box of the height given |

## Options

- `title`, `meta`, `description`, `actions`.
- `variant`: `boxed` (default) or `flat`.
- `tone`: `plain` (default), `graph` or `critical`.
- `headingId`, `flush`, `fill`.

## Sizes

| | Regular | Compact | |
|---|---|---|---|
| Head | at least 36 | at least 32 | `density.panel-head`; pad `density.panel-pad` (12 / 8) across, its pieces 8 apart; the title's column 4 down and up |
| Described head | grows | grows | padded 8 down and up, its pieces set at the top |
| Flat head | at least 36 | at least 32 | `density.panel-head`, no inset, 8 apart |
| Body | pad 12 | pad 8 | `density.panel-pad` all round, in the box unless `flush` |
| Flat gap | 16 | 12 | `density.section-gap`, between the flat head and its content |

Fixed at both densities: the mark 16; the meta 8 after the title; actions 4 apart; the critical rule
2. The title keeps 160 (or its own width) before the actions go under it, and 96 before the meta
drops under it. The graph's dots are 1 in radius, one every 18 both ways, centered.

## States and tokens

| State | Piece: paint |
|---|---|
| rest | box: `card`, edge `border-strong`, `radius-surface`. head: `section-head-ground`, rule `section-head-line`. flat head: no ground, rule `border`. title: `section-head-ink`, else `foreground`, in `typeface-heading`, `text.head` in the box and `text.section-title` in the flat head. meta (body face, tabular figures) and description: `muted-foreground`, `text.help` |
| described | the head grows to hold the description |
| toneCritical | box: a 2 wide `critical` rule across its top, the rest of its edge as it was. flat head: its rule `critical`. mark: `critical` |
| toneGraph | body: `canvas` with a dot of `panel-dot` every 18; rounded `radius-surface` under a flat head |
| fill | the box takes the height given and its body scrolls |

`text.head` carries the table head's size, weight and tracking, never its case: the title keeps its
own, so a boxed head can hold a name such as a job's. A count beside the title looks the same as a
page header's (`parts/page-header`): `text.help` in the body face, tabular figures,
`muted-foreground`, 8 after the title. The code face is for codes.

## Keyboard and words

No keys and no words of its own. The app gives the title, the meta, the description and the
actions, which follow their context.

## Renderer-specific

- **sokkel-ui:** a `section` labelled by its heading (`aria-labelledby`, `headingId`). The box clips
  its content (`overflow-hidden`). The head's pieces wrap by flex basis. `className` and
  `bodyClassName` lay it out in its container. `Surface`, beside it in the module, is the bordered
  surface with no heading, for content that is a surface under a flat heading.
- **sokkel-ui-egui:** no Section yet; `Card` with `bar(true)` is the nearest.

## Where sokkel-ui-egui differs today

As of dfb6079 (`display.rs` unchanged since b73200b) there is no Section. `Card` with `bar(true)`
draws the boxed head: `density.panel-head` tall, `section-head-ground` over a `section-head-line`
rule, the title in `text.head` and `section-head-ink` (else `card-foreground`, the same color as
`foreground` in every theme). The differences:
1. **Insets:** 16 across the head and round the body at both densities. The spec says
   `density.panel-pad` (12 / 8).
2. **Description:** in the body in `text.body`. The spec puts it in the head in `text.help`.
3. **Not built:** the flat variant, the meta, the actions, the tones, `flush`, `fill`, and the head
   growing for a description.
