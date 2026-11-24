# Movie Browser API Reference

Base URL: `http://localhost:5000/api`

Watchlist and review routes require:

```http
x-client-id: <an id of 8 to 128 characters>
```

Errors use:

```json
{ "error": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{
  "status": "ok",
  "database": "connected",
  "omdbConfigured": true,
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Movies

### GET `/movies`

Query parameters:

| Parameter | Required | Notes |
| --- | --- | --- |
| `keyword` | Yes | Search text |
| `page` | No | OMDB result page, default 1 |

Example:

```bash
curl "http://localhost:5000/api/movies?keyword=inception"
```

Response `200`: the OMDB search payload.

```json
{
  "Search": [
    {
      "Title": "Inception",
      "Year": "2010",
      "imdbID": "tt1375666",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/..."
    }
  ],
  "totalResults": "123",
  "Response": "True"
}
```

Errors:

| Status | Meaning |
| --- | --- |
| `400` | `keyword` is missing |
| `404` | OMDB found no matches |
| `502` | OMDB is unreachable |
| `503` | `OMDB_API_KEY` is not configured |

### GET `/movies/:id`

Returns the full OMDB record with `plot=full`.

A missing or invalid id returns `404` with the OMDB error message.

## Watchlist

All routes require `x-client-id`.

### GET `/watchlist`

```json
[
  {
    "_id": "66f1...",
    "clientId": "8d1c...",
    "movieId": "tt1375666",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### POST `/watchlist`

```json
{ "movieId": "tt1375666" }
```

The operation is idempotent for the same client and movie. It returns `201` with
the stored document.

### DELETE `/watchlist/:movieId`

```json
{ "message": "Removed from watchlist" }
```

Returns `404` when the movie is not in the client's watchlist.

## Reviews

All routes require `x-client-id`.

### POST `/reviews`

```json
{
  "movieId": "tt1375666",
  "rating": 9,
  "comment": "A tightly constructed heist film with a strong final act."
}
```

Validation:

- `movieId` and `comment` are required.
- `comment` is trimmed and limited to 2000 characters.
- `rating` must be a number from 1 to 10.

Response `201`:

```json
{
  "_id": "66f2...",
  "clientId": "8d1c...",
  "movieId": "tt1375666",
  "rating": 9,
  "comment": "A tightly constructed heist film with a strong final act.",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### GET `/reviews/:movieId`

Returns all reviews for the movie, newest first.

```json
[
  {
    "_id": "66f2...",
    "clientId": "8d1c...",
    "movieId": "tt1375666",
    "rating": 9,
    "comment": "A tightly constructed heist film with a strong final act.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### DELETE `/reviews/:id`

Deletes the review only when it belongs to the requesting client id.

```json
{ "message": "Review deleted" }
```

## cURL examples

```bash
CLIENT_ID="client-demo-12345678"

# Search
curl "http://localhost:5000/api/movies?keyword=arrival"

# Add to watchlist
curl -X POST http://localhost:5000/api/watchlist \
  -H "Content-Type: application/json" \
  -H "x-client-id: $CLIENT_ID" \
  -d '{"movieId":"tt2543164"}'

# Post a review
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "x-client-id: $CLIENT_ID" \
  -d '{"movieId":"tt2543164","rating":9,"comment":"Quiet, intelligent science fiction."}'

# Read reviews
curl http://localhost:5000/api/reviews/tt2543164 \
  -H "x-client-id: $CLIENT_ID"
```
