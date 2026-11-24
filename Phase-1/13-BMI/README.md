# BMI Calculator

A body mass index calculator with metric and imperial units, a category badge
and a healthy weight range.

## Features

- Weight in kilograms or pounds.
- Height in centimetres or inches.
- Values convert when the unit changes, instead of being reinterpreted.
- BMI value and category: underweight, normal, overweight or obese.
- Healthy weight range for the entered height.
- Keypad input with decimal support.
- Keyboard support for digits, decimal point and Backspace.
- Clear and calculate actions.
- Responsive card layout.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript

## Formula

```text
BMI = weight (kg) / height (m)²
```

Imperial values are converted to metric before the calculation.

## Categories

| BMI | Category |
| --- | --- |
| Below 18.5 | Underweight |
| 18.5 to 24.9 | Normal |
| 25 to 29.9 | Overweight |
| 30 and above | Obese |

The healthy weight range uses the 18.5 to 24.9 BMI band for the entered height.

## Running

```bash
cd "13-BMI"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Weight, height, BMI and keypad |
| `index.js` | Unit conversion, BMI calculation and category logic |

## Known limitations

- BMI is a screening measure, not a diagnosis. It does not account for muscle
  mass, age, sex or body composition.
- The app uses a fixed set of categories for adults.
- Values are not saved between sessions.
- Tailwind is loaded from a CDN.

## License

MIT
