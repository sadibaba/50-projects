# Movie Browser

A movie discovery application powered by the OMDB API, with a persistent
watchlist and a review system backed by MongoDB.

## Overview

The application lets a visitor search for movies, open detailed information,
maintain a watchlist and read or write reviews. The Express API proxies OMDB so
the API key stays on the server and stores watchlist entries and reviews in
MongoDB.

The application does not require an account. Each browser receives an anonymous
client id, which is used to scope the watchlist and to allow a reviewer to delete
their own review.

## Implemented features

### Discovery

- Search by title with a results grid.
- Movie detail page with poster, year, runtime, genre, rating, plot, director,
  cast, country and language.
- Popular search suggestions.
- Loading and error states.
- Keyboard-friendly search form.

### Watchlist

- Add a movie from the detail page.
- Watchlist page with poster cards.
- Remove a movie.
- Persisted in MongoDB per client id.
- Local cache fallback when the API is unavailable.
- Automatic migration of watchlist entries that were saved locally before the
  API existed.

### Reviews

- Ten-point rating and written comment.
- Review list with date and rating.
- Reviews stored in MongoDB.
- A reviewer can delete their own review.
- Local fallback when the API is unavailable.

### Backend

- OMDB proxy with a required keyword, timeout and error mapping.
- Per-client watchlist with a unique client/movie index.
- Review validation: rating 1 to 10, comment required, maximum 2000 characters.
- Health endpoint with database and OMDB configuration state.
- Central error and 404 handling.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Framer Motion, Lucide icons |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| External API | OMDB |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── Search ──────────────► GET /api/movies?keyword=
├── Detail ──────────────► GET /api/movies/:id
├── Watchlist ───────────► /api/watchlist with x-client-id
├── Reviews ─────────────► /api/reviews with x-client-id
└── localStorage cache
        │
        ▼
Express API (5000)
├── OMDB proxy
├── Watchlist controller
├── Review controller
└── MongoDB: watchlist, reviews
```

## Project structure

```text
5-movie browser/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── controllers/              movie, watchlist, review
│   ├── middlewares/              client id, logging, errors
│   ├── models/                   Watchlist, Review
│   ├── routes/                   movie, watchlist, review
│   ├── utils/http.js             ApiError and asyncHandler
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/services/api.js       API client with local fallback
│   ├── src/services/storage.js   localStorage cache
│   ├── src/pages/                home, detail, watchlist, reviews
│   └── src/App.jsx
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer
- An OMDB API key from `https://www.omdbapi.com/apikey.aspx`

### Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI and OMDB_API_KEY
npm install
npm run dev
```

The API starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The client starts on `http://localhost:5173`.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | API port |
| `NODE_ENV` | No | `development` | Runtime mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `OMDB_API_KEY` | Yes | - | OMDB API key |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed frontend origins |
| `VITE_API_URL` | No | `http://localhost:5000/api` | API base URL for the client |

The backend refuses to start without `MONGO_URI` or `OMDB_API_KEY`.

## API summary

| Method | Endpoint | Header | Purpose |
| --- | --- | --- | --- |
| GET | `/api/movies?keyword=&page=` | - | Search movies |
| GET | `/api/movies/:id` | - | Movie details |
| GET | `/api/watchlist` | `x-client-id` | Read the client's watchlist |
| POST | `/api/watchlist` | `x-client-id` | Add a movie |
| DELETE | `/api/watchlist/:movieId` | `x-client-id` | Remove a movie |
| POST | `/api/reviews` | `x-client-id` | Create a review |
| GET | `/api/reviews/:movieId` | `x-client-id` | List reviews |
| DELETE | `/api/reviews/:id` | `x-client-id` | Delete your review |
| GET | `/api/health` | - | Health check |

Full examples: [docs/API.md](docs/API.md).

## Data model

### Watchlist

| Field | Type | Notes |
| --- | --- | --- |
| `clientId` | String | Anonymous browser id, indexed |
| `movieId` | String | OMDB id |
| `createdAt`, `updatedAt` | Date | Timestamps |

Unique index: `{ clientId: 1, movieId: 1 }`.

### Review

| Field | Type | Notes |
| --- | --- | --- |
| `clientId` | String | Author's anonymous id |
| `movieId` | String | OMDB id, indexed |
| `rating` | Number | 1 to 10 |
| `comment` | String | Required, maximum 2000 characters |
| `createdAt`, `updatedAt` | Date | Timestamps |

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm start` | Start the API |
| backend | `npm run dev` | Start with nodemon |
| frontend | `npm run dev` | Development server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview the build |
| frontend | `npm run lint` | ESLint |

## Verification

```bash
cd backend
node --check server.js

cd ../frontend
npm run build
```

Manual checks:

1. Search for a movie and open its detail page.
2. Add it to the watchlist and refresh the watchlist page.
3. Post a review and confirm it appears after a refresh.
4. Delete your review and confirm it is removed.
5. Stop the API and confirm that the watchlist falls back to the local cache.

## Known limitations

- There is no user account. Watchlists are tied to a browser-generated client id.
- Reviews are public to every visitor; the client id only authorises deletion of
  the review that created it.
- Reviews cannot be edited after submission.
- The search results page does not expose OMDB pagination yet, even though the
  API accepts a `page` parameter.
- The OMDB API requires a personal key and has request limits.
- The local fallback is a cache, not a complete offline mode.
- There is no automated test suite.

## Roadmap

- Add accounts and move watchlists and reviews to user ids.
- Add pagination to the search results.
- Add review editing.
- Cache movie details on the server.
- Add automated API tests.
- Add a watched-history and rating summary.

## License

MIT
