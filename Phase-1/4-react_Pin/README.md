# React Image Gallery

A responsive image gallery built with React and Vite. It searches Pixabay photos
and loads additional pages as the user scrolls.

## Features

- Search by keyword.
- Infinite scrolling with duplicate protection.
- Responsive grid from two to four columns.
- Loading, empty, error and end-of-results states.
- Accessible labels and lazy-loaded images.

## Tech stack

- React 19
- Vite
- Tailwind CSS
- `react-infinite-scroll-component`
- Pixabay API

## Getting started

```bash
cp .env.example .env
# Add your own Pixabay API key to .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_PIXABAY_API_KEY` | Yes | Pixabay API key used by the client |

The API key is read from Vite's client environment. A client-side key is visible
to users, so use a restricted key and monitor its usage. If a key was ever
committed to source control, rotate it.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |

## Project structure

```text
4-react_Pin/
├── src/
│   ├── App.jsx
│   ├── components/images.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
└── vite.config.js
```

## Known limitations

- The Pixabay free tier has request limits.
- The API key is exposed to the browser by design for a static application.
- There is no local cache; repeating a search makes new requests.

## License

MIT
