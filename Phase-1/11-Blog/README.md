# Travel Blog

A small React blog with a responsive story grid and a detail page for each
profile.

## Features

- Responsive card grid: one column on mobile, up to four on large screens.
- Client-side routing with React Router.
- Detail page with portrait, description and full story.
- Back link and not-found state.
- Local data in `src/components/cardList.jsx`; no backend required.
- Accessible image alt text and semantic article elements.

## Tech stack

- React 19
- Vite
- Tailwind CSS
- React Router

## Getting started

```bash
cd "11-Blog"
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |

## Project structure

```text
11-Blog/
├── src/
│   ├── App.jsx
│   ├── components/card.jsx
│   ├── components/cardList.jsx
│   ├── components/profile.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Data

`cardList.jsx` contains fourteen profiles with a name, image, short description
and a long story. The data is demo content; replace it with your own.

## Known limitations

- The stories are static and very long; the detail page is intentionally simple.
- Images are loaded from Unsplash.
- There is no search, pagination or admin editor.
- The `lenis` dependency is present but not used by the current UI.
- There are no automated tests.

## License

MIT
