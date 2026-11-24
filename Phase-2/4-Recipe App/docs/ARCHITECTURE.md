# Recipe App Architecture

## Purpose

The recipe app demonstrates two patterns that the other Phase 2 projects do not
cover: proxying a third-party API and giving anonymous visitors persistent data
without asking them to create an account.

## Request flow

```text
React client
├── Search / filter / random
│   └── GET /api/meals/*  ──►  Express proxy  ──►  TheMealDB
├── Recipe detail
│   └── GET /api/meals/lookup/:id
└── Favourites
    ├── localStorage cache
    └── GET/POST/DELETE /api/favorites with x-client-id
                          │
                          ▼
                       MongoDB
                    favorites collection
```

## Anonymous identity

A UUID is generated on the first visit and stored under
`flavorfusion_client_id`. The Axios instance adds it as `x-client-id` to every
request. The API middleware validates the header and attaches `req.clientId`.

This is not authentication. It is a device-scoped identity. It is appropriate
for a learning app with no personal data, but it should not be used for private
or sensitive records.

## Favourites lifecycle

1. On mount, the client reads the local cache and calls `GET /api/favorites`.
2. If the API returns favourites, they replace the local list.
3. If the API returns an empty list but local favourites exist, each local item
   is posted to the API. This migrates pre-API browser data.
4. If the API is unreachable, the local list remains and the UI reports local
   storage mode.
5. Add and remove actions update the UI immediately and then call the API. A
   failed request falls back to local mode.

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/mealRoutes.js` | Validate query parameters and proxy TheMealDB |
| `routes/favoriteRoutes.js` | Per-client favourite CRUD |
| `routes/recipeRoutes.js` | Stored recipe CRUD |
| `middlewares/clientId.js` | Validate `x-client-id` |
| `middlewares/errorHandler.js` | Normalise errors |
| `middlewares/rateLimiter.js` | 100 requests per 15 minutes per IP |
| `models/favorite.js` | Unique client and meal pair |
| `models/recipe.js` | Stored recipe documents |

The proxy uses a ten-second timeout and maps upstream failures to `502` so the
client can distinguish its own errors from TheMealDB downtime.

## Database indexes

| Collection | Index | Reason |
| --- | --- | --- |
| favorites | `{ clientId: 1 }` | List all favourites for a browser |
| favorites | `{ clientId: 1, mealId: 1 }` unique | Prevent duplicate favourites |
| recipes | `{ title: "text" }` | Text search support |

## Why store a meal snapshot

The favourite document stores the full meal object, not only the meal id. This
allows the favourites bar to render a name and image without calling TheMealDB
for every saved item. The trade-off is duplicated data if a meal changes on the
upstream service.

## Trade-offs

- No accounts, so favourites do not follow a user across devices.
- The local cache can become stale if favourites are changed in another tab.
- The recipes collection has no authoring UI, so only the API can create entries.
- The proxy adds a network hop but hides the external API and centralises
  timeouts, validation and error mapping.
- No automated tests are included.

## Future changes

1. Introduce accounts and move favourites to a user id.
2. Cache TheMealDB responses for common searches.
3. Add recipe authoring and editing screens.
4. Add meal plans and shopping lists built from recipe ingredients.
5. Add API integration tests with a test database.
