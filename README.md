This is the official library used to create Xbox One saved game editors for [Vantage](https://vantagemods.com).

*Pull requests are very welcome!*

## Crypto API

- `alder32(buffer: Buffer, initial?: number): number`
- `crc32(buffer: Buffer, offset?: number, length?: number, seed?: number): number`
- `fnv0(value: string, init: number, prime: number): number`

## Components

- `card` - Hosts all other components.
  - `<card label="God Mode"><!-- component --></card>`
- `v-button` - Just a button.
  - `<v-button click.trigger="increaseHealth()">Increase Health</v-button>`
- `v-switch` - A switch with an on or off state.
  - `<v-switch value.bind="unlimitedAmmo"></v-switch>`
- `v-text` - A text input.
  - `<v-text value.bind="squadName"></v-text>`
- `v-number` - Numeric input with `-` and `+` buttons.
  - `<v-number value.bind="ammo" min="0" max="100"></v-number>`
- `v-slider` - Number slider with value label.
  - `<v-slider value.bind="gravity" min="0" max="10" step="0.1"></v-slider>`
- `v-selection` - A combo box/selection input.
  - `<v-selection value.bind="color" options.bind="[{value: 'blue', label: 'Blue'}, {value: 'red', label: 'Red'}]"></v-selection>`

## Value Converters

### Arrays
- `pluck` - Get an array of property values of the given objects.
  - `weapons | pluck:'name'`
- `take` - Get the first *n* elements of an array.
  - `inventory | take:5`
- `sort` - Sort an array by the given property.
  - `weapons | sort:'name'`

### Numbers
- `formatNumber` - Format a number with commas.
  - `gold | formatNumber`
- `byteFormat` - Convert bytes to KB, MB, GB, etc.
  - `bytes | byteFormat`

### Objects
- `objectKeys` - Get an array of an object's own property names.
  - `dvars | objectKeys`


## Stream

`Stream` is a wrapper around Node's `Buffer` class that makes reading and writing to Buffers less verbose. See `stream.ts` for usage details.

## Miscellaneous and Internal
- `setEditor(editor: SaveEditor)` - Set the editor implementation used by Vantage. This is done by [main.ts](https://github.com/vantagemods/editor-skeleton/blob/master/src/main.ts) in the Editor Skeleton.
- `openDevTools()` - Open the dev tools. This is done automatically by Vantage in development mode. You can also press `Ctrl + Shift + D`.