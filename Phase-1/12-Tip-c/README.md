# Tip Calculator

A mobile-friendly tip calculator with an on-screen keypad, adjustable tip
percentage and bill splitting.

## Features

- Keypad input for the bill amount with decimal support.
- Tip percentage from 0 to 100.
- Split between 1 and 50 people.
- Per-person total and grand total with tip.
- Clear and apply actions.
- Keyboard support for digits, decimal point, Backspace and Escape.
- Status message confirming the applied values.
- Responsive card layout.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript

## Running

```bash
cd "12-Tip-c"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Calculation

```text
tip amount   = bill × tip / 100
grand total  = bill + tip amount
per person   = grand total / split
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Bill display, tip and split controls, keypad |
| `index.js` | Input handling, calculations and status messages |

## Known limitations

- Currency is hard-coded to PKR.
- The bill amount is not persisted between sessions.
- There is no receipt or export action.
- Tailwind is loaded from a CDN.
- The keypad is the primary input method; there is no text field.

## License

MIT
