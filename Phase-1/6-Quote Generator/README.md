# Random Quote Generator

A small quote generator that loads a random quote from DummyJSON and falls back
to a saved quote when the service is unavailable.

## Features

- Random quote on page load.
- New quote button with a disabled loading state.
- Author attribution.
- Graceful fallback when the request fails.
- Accessible live region for the quote.
- Responsive card layout.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript
- DummyJSON quotes API

## Running

```bash
cd "6-Quote Generator"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## API

```text
https://dummyjson.com/quotes/random
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Quote card and controls |
| `index.js` | Fetch, loading state, fallback and rendering |

## Known limitations

- Quotes come from a third-party demo API and are not curated.
- There is no copy or share button.
- The fallback quote is fixed.
- Tailwind is loaded from a CDN.

## License

MIT
