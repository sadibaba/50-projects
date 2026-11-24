# Phase 1: Vanilla JavaScript Projects

Phase 1 focuses on the fundamentals: the DOM, events, localStorage, public APIs,
responsive layouts and small state machines. Most projects are plain HTML, CSS
and JavaScript, so they run with any static file server. Two projects use React
and Vite.

## Projects

| # | Project | What it practises | Stack |
| --- | --- | --- | --- |
| 1 | [To-do dashboard](<1-To-do/README.md>) | Kanban state, localStorage, clock, calendar, media | HTML, Tailwind, JavaScript |
| 2 | [Calculator](<2-Calculator/README.md>) | Arithmetic state, keyboard input, theme switching | HTML, Tailwind, JavaScript |
| 3 | [Quiz app](<3-Quiz-web/README.md>) | Fetch, async state, scoring, answer feedback | HTML, Tailwind, JavaScript |
| 4 | [React image gallery](<4-react_Pin/README.md>) | Components, infinite scroll, environment variables | React, Vite, Tailwind |
| 5 | [Weather dashboard](<5-Weather_web_app/README.md>) | Geocoding, live weather, error states | HTML, Tailwind, JavaScript |
| 6 | [Quote generator](<6-Quote Generator/README.md>) | Fetch, fallback data, accessible status | HTML, Tailwind, JavaScript |
| 7 | [Currency converter](<7-Currency Converter/README.md>) | Live exchange rates, selects, swapping | HTML, Tailwind, JavaScript |
| 8 | [Countdown timer](<8-Countdown Timer/README.md>) | Date arithmetic, intervals, persistence | HTML, Tailwind, JavaScript |
| 9 | [Image gallery](<9-Image_Slider/README.md>) | Filtering, keyboard navigation, active state | HTML, Tailwind, JavaScript |
| 10 | [Colour picker](<10-colorPicker/README.md>) | Colour conversion, contrast, clipboard | HTML, Tailwind, JavaScript |
| 11 | [Travel blog](<11-Blog/README.md>) | Routing, lists, detail pages, responsive cards | React, Vite, Tailwind |
| 12 | [Tip calculator](<12-Tip-c/README.md>) | Keypad input, percentages, splitting a bill | HTML, Tailwind, JavaScript |
| 13 | [BMI calculator](<13-BMI/README.md>) | Unit conversion, derived values, health ranges | HTML, Tailwind, JavaScript |

## Running the plain projects

The HTML projects do not need a build step.

```bash
cd "1-To-do"
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly also works for
most projects, but a local server is recommended because some browsers restrict
`fetch` for `file://` URLs.

## Running the React projects

```bash
cd "4-react_Pin"
cp .env.example .env
# Add a Pixabay API key
npm install
npm run dev
```

```bash
cd "11-Blog"
npm install
npm run dev
```

Both React projects run on `http://localhost:5173` by default.

## Common conventions

- Plain projects use the Tailwind browser CDN and Remix Icon.
- State that should survive a refresh is stored in `localStorage`.
- Public API failures are shown to the user instead of being written only to the
  console.
- Every project README lists setup, features and known limitations.
- No real API keys are committed. The weather project uses Open-Meteo, which does
  not require a key; the React image gallery reads its Pixabay key from `.env`.

## Verification

```bash
# JavaScript syntax
find . -name "*.js" -not -path "*/node_modules/*" -exec node --check {} \;

# React builds
cd 4-react_Pin && npm run build
cd ../11-Blog && npm run build
```

## Notes on scope

These projects are intentionally small. They demonstrate browser APIs and state
handling, not production architecture. Hard-coded demo content is labelled as
such in the relevant README. Features that were not implemented are listed under
known limitations rather than presented as complete.
