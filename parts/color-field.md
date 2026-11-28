# Color field

Status: preview. New in its round and specified in full, as it landed; its sizes, paints and layout may still move, and renderers other than sokkel-ui may wait before porting it.

A color typed (six or three hex digits after #, or rgb(r, g, b)) or picked, kept as #rrggbb: a field with a swatch of the color at its end that opens a picker of saturation and brightness, hue and swatches. The structured spec is [`color-field.json`](color-field.json).

Sources: sokkel-ui `packages/core/src/components/ColorField.tsx`, `packages/core/src/lib/color-value.ts`, `packages/core/src/components/entry.tsx`.

## Anatomy

| Piece | What it is |
|---|---|
| container | A field as the other typed fields draw it (parts/text-field's frame, label, help and issues), its placeholder #rrggbb. |
| swatch | At the frame's end, the picker's button: a square 16 across in the color, rounded by radius-mini, ringed 1 inside in foreground at 20 percent; empty, the ring alone. |
| picker | Under the frame in a popover padded 12: a column 224 wide, 12 apart, of the area, the hue strip and the swatches. |
| area | 144 tall, rounded by radius-control: the hue at full saturation under a fade to black upward from the foot and a fade from white at the start, so across is saturation and up is brightness; its mark a dot 14 across in the color, edged 2 in background, ringed 1 in foreground at 40 percent. |
| hue | A strip 12 tall, rounded full, through the hues around the circle; its thumb a dot 16 across in the hue at full saturation, edged as the area's mark. |
| swatches | With swatches: a grid of eight columns 6 apart of squares in each swatch's color, rounded by radius-control, ringed 1 inside in foreground at 15 percent; the one that is the value ringed 2 in foreground, offset 2 in popover. |

## Options

- `value`: The color as #rrggbb, or none.
- `onValueChange`: Called with each color typed that reads or picked, and none when emptied.
- `swatches`: Colors to pick with one press, each with its name.
- `required`: A required field has no clear button.
- `open`: Whether the picker is open.

## Sizes

- swatch: width `16`, height `16`, radius `radius-mini`. 
- area: height `144`, radius `radius-control`. 
- hue: height `12`. 

## States

- rest: The color written and shown in its swatch.
- open: The picker open under the frame.
- unreadable: Text that is not a color: the value kept as it was, the issue said once the field is left.
- focus: Keyboard focus on the area, the hue thumb or a swatch: the focus ring.

## Keyboard

- Alt, ArrowDown (the input has focus): Opens the picker.
- ArrowLeft, ArrowRight (the area has focus): Less or more saturation, a hundredth; with Shift, a tenth.
- ArrowUp, ArrowDown (the area has focus): More or less brightness, a hundredth; with Shift, a tenth.

## Words

- `unreadable` (`colorField.unreadable`): "Enter a color"
- `example` (`colorField.example`): "Write six hex digits after #, or rgb(r, g, b)."
- `pick` (`colorField.pick`): "Choose a color"
- `clear` (`colorField.clear`): "Clear"
- `area` (`colorPicker.area`): "Saturation and brightness"
- `areaValue` (`colorPicker.areaValue`): "Saturation {saturation}%, brightness {brightness}%"
- `hue` (`colorPicker.hue`): "Hue"
- `swatches` (`colorPicker.swatches`): "Swatches"

## Where each renderer stands

- sokkel-egui: As of 5532f68: no such part.
- sokkel-tui: As of b99664f its reports name no such part.
