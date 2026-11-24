# Calculator

A keyboard-friendly calculator with a light and dark theme.

## Features

- Addition, subtraction, multiplication and division.
- Decimal input, sign toggle and percentage.
- Clear button and live expression preview.
- Keyboard support: digits, `.`, `+`, `-`, `*`, `/`, `Enter`, `Escape`.
- Light and dark themes.
- Responsive card that fits small screens.

## Running

```bash
cd "2-Calculator"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `0` to `9` | Enter a digit |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Choose an operation |
| `Enter` or `=` | Calculate |
| `%` | Convert the current value to a percentage |
| `Escape` or `c` | Clear |
| `Backspace` | Handled by the browser; use AC for a full clear |

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Layout, display and buttons |
| `index.js` | Calculator state, formatting and events |

## Known limitations

- Division by zero displays `Error` rather than a detailed message.
- There is no calculation history.
- The calculator handles one operation at a time; there are no parentheses.
- Tailwind is loaded from a CDN, so the page needs a network connection for
  styling.

## License

MIT
