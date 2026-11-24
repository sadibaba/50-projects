# Colour Picker

A colour tool that converts between HEX, RGB and HSL, previews the result and
reports its contrast against white.

## Features

- Native colour picker and editable HEX field.
- Three- and six-digit HEX support.
- Live RGB and HSL output.
- Large colour preview.
- WCAG contrast ratio against white with an AA note.
- Copy buttons for HEX, RGB and HSL.
- Responsive two-column layout that stacks on mobile.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript

## Running

```bash
cd "10-colorPicker"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## How it works

- `hexToRgb` validates and expands short HEX values.
- `rgbToHsl` converts RGB to HSL for display.
- `getRelativeLuminance` and `contrastRatio` implement the WCAG relative
  luminance formula.
- `navigator.clipboard.writeText` copies the selected value.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Inputs, preview and output fields |
| `index.js` | Conversion, preview, contrast and clipboard handling |

## Known limitations

- The contrast note only compares against white.
- The HSL field is read-only; there are no HSL sliders.
- Clipboard access requires a secure context (`https` or `localhost`). The code
  reports an error if the browser blocks it.
- Tailwind is loaded from a CDN.

## License

MIT
