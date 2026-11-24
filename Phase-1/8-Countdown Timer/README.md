# Countdown Timer

A countdown timer with a target date picker, quick presets and persistence
across page reloads.

## Features

- Countdown to a chosen date and time.
- Quick presets for one hour, one day, seven days and thirty days.
- Days, hours, minutes and seconds display.
- Target saved in `localStorage` and resumed after a refresh.
- Clear finished state when the target passes.
- Reset action.
- Responsive four-column display on desktop and two columns on mobile.
- Accessible live region for the countdown.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript
- `datetime-local` input
- `localStorage`

## Running

```bash
cd "8-Countdown Timer"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## How it works

1. The user chooses a future date and time.
2. The target is stored as an ISO timestamp.
3. A one-second interval renders the remaining time.
4. When the target is reached, the interval stops and the display resets to
   zero.
5. On reload, a future saved target resumes automatically.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Countdown cards, date input and controls |
| `index.js` | Target handling, interval, rendering and persistence |

## Known limitations

- The timer uses the visitor's local clock, so an inaccurate system clock
  produces an inaccurate countdown.
- Only one countdown can be saved at a time.
- There is no sound or browser notification on completion.
- Tailwind is loaded from a CDN.

## License

MIT
