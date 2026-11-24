# Movie Browser Frontend

React client for the Movie Browser. See the [project README](../README.md) for
the API reference and backend setup.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Configuration

The API base URL defaults to `http://localhost:5000/api`. Override it with
`VITE_API_URL` in a `.env` file.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Search and results grid |
| `/movie/:id` | Movie details and watchlist action |
| `/watchlist` | Saved movies |
| `/reviews/:movieId` | Reviews for a movie |

## Local cache

`src/services/storage.js` stores watchlist entries and reviews in
`localStorage`. `src/services/api.js` prefers the API and falls back to the cache
when the request fails.
