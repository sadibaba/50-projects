# Recipe App API Reference

Base URL: `http://localhost:5000/api`

Errors use:

```json
{ "message": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

## Meal proxy

The following endpoints proxy TheMealDB and return its JSON shape.

| Method | Endpoint | Required parameter |
| --- | --- | --- |
| GET | `/meals/search` | `q` (search text) |
| GET | `/meals/letter` | `f` (single letter) |
| GET | `/meals/lookup/:id` | Path id |
| GET | `/meals/random` | None |
| GET | `/meals/categories` | None |
| GET | `/meals/filter/ingredient` | `i` |
| GET | `/meals/filter/category` | `c` |
| GET | `/meals/filter/area` | `a` |

Example:

```bash
curl "http://localhost:5000/api/meals/search?q=chicken"
```

Response:

```json
{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strCategory": "Chicken",
      "strArea": "Japanese",
      "strInstructions": "...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/...jpg"
    }
  ]
}
```

Errors:

| Status | Meaning |
| --- | --- |
| `400` | A required query parameter is missing or invalid |
| `502` | TheMealDB is unreachable |

## Stored recipes

### GET `/recipes`

Optional query parameter: `search` matches the title.

Response `200`: an array of recipes.

### POST `/recipes`

```json
{
  "title": "Chicken curry",
  "description": "A simple weeknight curry.",
  "ingredients": ["Chicken", "Onion", "Tomato"],
  "instructions": "Cook the onion, add the chicken, simmer.",
  "image_url": "https://example.com/curry.jpg",
  "tags": ["dinner", "curry"]
}
```

`title` is required. The array fields default to empty arrays.

Response `201`: the created recipe.

### GET `/recipes/:id`

Response `200`: the recipe or `404`.

## Favourites

All favourite routes require:

```http
x-client-id: <an id of 8 to 128 characters>
```

The frontend generates a UUID and stores it in `localStorage` under
`flavorfusion_client_id`.

### GET `/favorites`

Response `200`:

```json
[
  {
    "_id": "66f1...",
    "clientId": "8d1c...",
    "mealId": "52772",
    "meal": {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/...jpg"
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### POST `/favorites`

```json
{
  "meal": {
    "idMeal": "52772",
    "strMeal": "Teriyaki Chicken Casserole",
    "strMealThumb": "https://www.themealdb.com/images/media/meals/...jpg"
  }
}
```

The endpoint is idempotent for the same client and meal. It returns the saved
document with status `201`.

### DELETE `/favorites/:mealId`

Response `200`:

```json
{ "message": "Favorite removed" }
```

Returns `404` when the favourite does not exist for that client.

## cURL examples

```bash
CLIENT_ID="client-demo-12345678"

# Save a favourite
curl -X POST http://localhost:5000/api/favorites \
  -H "Content-Type: application/json" \
  -H "x-client-id: $CLIENT_ID" \
  -d '{"meal":{"idMeal":"52772","strMeal":"Teriyaki Chicken Casserole"}}'

# Read favourites
curl http://localhost:5000/api/favorites \
  -H "x-client-id: $CLIENT_ID"

# Remove a favourite
curl -X DELETE http://localhost:5000/api/favorites/52772 \
  -H "x-client-id: $CLIENT_ID"
```
