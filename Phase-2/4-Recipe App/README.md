# Recipe App

A recipe browser that combines TheMealDB catalogue with a small Express API for
saved favourites and user-created recipes.

## Overview

The client searches meals, filters by category, area or ingredient, shows full
recipe details and keeps a favourites bar. The API proxies TheMealDB so the
external service is never called directly from the browser, and stores each
visitor's favourites in MongoDB using an anonymous client id.

## Implemented features

### Recipe discovery

- Search meals by name.
- Browse by first letter.
- Filter by category, area or ingredient.
- Random recipe button.
- Category list from TheMealDB.
- Recipe detail page with ingredients, measures, instructions, difficulty and a
  source link.
- Video link when TheMealDB provides one.

### Favourites

- Add and remove favourites from the grid or detail page.
- Persisted in MongoDB through `/api/favorites`.
- Anonymous ownership through an `x-client-id` header generated once per browser.
- Automatic migration of favourites that were stored in `localStorage` before
  the API existed.
- Local fallback when the API is unavailable; the UI shows which storage mode is
  active.

### Backend

- TheMealDB proxy with parameter validation and a ten-second timeout.
- Upstream failures return `502` with a clear message.
- Health endpoint with database state.
- Central error handling and 404 responses.
- Rate limiting on all routes.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| External API | TheMealDB |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── Search and filters
├── Recipe detail
├── Favourites bar
└── x-client-id stored in localStorage
        │
        ▼
Express API (5000)
├── /api/meals/*     proxy to TheMealDB
├── /api/recipes     stored recipes
├── /api/favorites   per-client favourites
└── MongoDB: Favorite, Recipe
```

## Project structure

```text
4-Recipe App/
├── backend/
│   ├── controllers/          favorite and recipe handlers
│   ├── database/db.js        MongoDB connection
│   ├── middlewares/          client id, rate limit, errors
│   ├── models/               Favorite and Recipe schemas
│   ├── routes/               meals, recipes and favorites
│   ├── utils/http.js         ApiError and asyncHandler
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/api/meals.js      TheMealDB proxy client
│   ├── src/api/favorites.js  favourites client with client id
│   ├── src/components/       search bar, cards, favourites, detail
│   ├── src/pages/            recipe page
│   └── src/App.jsx           routes and favourites state
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer
- Internet access for TheMealDB

### Backend

```bash
cd backend
cp .env.example .env
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
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed frontend origins |
| `VITE_API_URL` | No | `http://localhost:5000/api` | API base URL for the client |

## API summary

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/meals/search?q=` | Search meals by name |
| GET | `/api/meals/letter?f=` | Search by first letter |
| GET | `/api/meals/lookup/:id` | Meal by id |
| GET | `/api/meals/random` | Random meal |
| GET | `/api/meals/categories` | Categories |
| GET | `/api/meals/filter/ingredient?i=` | Filter by ingredient |
| GET | `/api/meals/filter/category?c=` | Filter by category |
| GET | `/api/meals/filter/area?a=` | Filter by area |
| GET | `/api/recipes` | Stored recipes |
| POST | `/api/recipes` | Create a stored recipe |
| GET | `/api/recipes/:id` | Stored recipe by id |
| GET | `/api/favorites` | Favourites for the client id |
| POST | `/api/favorites` | Save a favourite |
| DELETE | `/api/favorites/:mealId` | Remove a favourite |
| GET | `/api/health` | Health check |

Favourite routes require the `x-client-id` header. The client generates the id
automatically.

Full examples: [docs/API.md](docs/API.md).

## Data model

### Favorite

| Field | Type | Notes |
| --- | --- | --- |
| `clientId` | String | Anonymous browser id, indexed |
| `mealId` | String | TheMealDB meal id |
| `meal` | Mixed | Snapshot of the meal used for offline rendering |
| `createdAt` | Date | Sort order |

Unique index: `{ clientId: 1, mealId: 1 }`.

### Recipe

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required, maximum 160 characters |
| `description` | String | Optional |
| `ingredients` | String array | Optional |
| `instructions` | String | Optional |
| `image_url` | String | Optional |
| `tags` | String array | Optional |
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

1. Search for a meal and open its detail page.
2. Add a favourite and refresh the page; it should remain.
3. Remove the favourite and confirm it disappears after a refresh.
4. Stop the API and confirm the favourites bar still reads the local cache.
5. Confirm that the storage mode label changes when the API is unavailable.

## Known limitations

- There is no user account. Favourites belong to a browser-generated client id,
  so clearing browser storage loses access to the existing favourites.
- The recipes collection has API support but no dedicated authoring UI.
- The app depends on TheMealDB availability and its rate limits.
- The local fallback is a cache, not a full offline catalogue.
- There is no automated test suite.

## Roadmap

- Add accounts and share favourites across devices.
- Add a recipe authoring form for the stored recipes collection.
- Add meal planning and shopping lists.
- Cache TheMealDB responses on the server.
- Add automated API tests.

## License

MIT
