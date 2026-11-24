# Weather Dashboard

A live weather dashboard that uses Open-Meteo for geocoding and current
conditions. No API key is required.

## Features

- Search any city by name.
- Current temperature, feels-like temperature, humidity, wind and cloud cover.
- Daily high and low.
- Weather condition text and icon.
- Saves the last searched city in `localStorage` and restores it on load.
- Loading, success and error messages.
- Responsive two-column layout that stacks on mobile.

## Tech stack

- HTML
- Tailwind CSS browser build
- Remix Icon
- Vanilla JavaScript
- Open-Meteo geocoding and forecast APIs

## Running

```bash
cd "5-Weather_web_app"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## APIs

```text
https://geocoding-api.open-meteo.com/v1/search?name=<city>
https://api.open-meteo.com/v1/forecast?latitude=...&longitude=...
```

Open-Meteo is free for non-commercial use and does not require a key.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Search form, current conditions and detail cards |
| `index.js` | Geocoding, forecast request, weather-code mapping and rendering |

## Known limitations

- The app shows current conditions and today's high/low, not a multi-day
  forecast.
- Search uses the first geocoding result.
- Units are always Celsius and km/h.
- An internet connection is required.

## License

MIT
