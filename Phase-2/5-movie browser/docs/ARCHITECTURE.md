# Movie Browser Architecture

## Purpose

This project demonstrates an external API proxy, anonymous per-browser data and
a local cache that keeps the interface usable when the API is unavailable.

## Request flow

```text
React client
├── Search page
│   └── GET /api/movies?keyword=  ──►  Express  ──►  OMDB
├── Detail page
│   └── GET /api/movies/:id
├── Watchlist
│   ├── GET/POST/DELETE /api/watchlist  (x-client-id)
│   └── localStorage cache fallback
└── Reviews
    ├── GET/POST/DELETE /api/reviews    (x-client-id)
    └── localStorage cache fallback
                    │
                    ▼
                 MongoDB
          watchlist and reviews
```

## Anonymous identity

The browser generates a UUID on the first visit and stores it under
`movie_app_client_id`. The Axios client adds it to every request as
`x-client-id`. The API validates the header before reaching the controllers.

This scopes the watchlist and authorises review deletion. Reviews themselves are
public, which matches the product behaviour of a public review section.

## Local fallback and migration

`services/api.js` wraps every watchlist and review call:

1. Try the API.
2. On success, return the API data.
3. On failure, use `services/storage.js`.
4. When the API returns an empty watchlist but local entries exist, post each
   local entry to the API.

The fallback keeps the UI functional during local development when the API is
not running. It is a cache, not a conflict-free offline store.

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/movieRoutes.js` | OMDB search and detail |
| `routes/watchlistRoutes.js` | Per-client watchlist |
| `routes/reviewRoutes.js` | Public reviews with owner-only deletion |
| `middlewares/clientId.js` | Validate the client header |
| `middlewares/loggingMiddleware.js` | Request logging and duration |
| `middlewares/errorHandlingMiddleware.js` | Error and 404 responses |
| `controllers/` | Validation, OMDB proxy and persistence |
| `models/` | Watchlist and Review schemas |

## Database indexes

| Collection | Index | Reason |
| --- | --- | --- |
| watchlist | `{ clientId: 1 }` | Read one client's list |
| watchlist | `{ clientId: 1, movieId: 1 }` unique | Prevent duplicate entries |
| reviews | `{ clientId: 1 }` | Owner lookup |
| reviews | `{ movieId: 1 }` | List a movie's reviews |

## Why the API proxies OMDB

- The OMDB key stays on the server.
- The client only needs one base URL.
- Timeouts and upstream errors are normalised.
- A future cache can be added without changing the client.

The trade-off is an extra network hop for every search and detail request.

## Trade-offs

- No accounts; the client id is device-specific.
- Reviews are public and cannot be edited.
- The local cache can drift when the same browser uses multiple tabs.
- Search pagination is available in the API but not exposed by the UI.
- No automated tests are included.

## Failure handling

| Failure | Behaviour |
| --- | --- |
| Missing keyword | `400` |
| OMDB returns no results | `404` |
| OMDB unreachable | `502` |
| Missing API key | `503` |
| Missing client id | `400` on watchlist and review routes |
| Invalid rating | `400` |
| Review owned by another client | `404` on delete |
| MongoDB unavailable at startup | Process exits with a clear error |
