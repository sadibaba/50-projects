# Notes App API Reference

Base URL: `http://localhost:5000/api`

Protected endpoints use:

```http
Authorization: Bearer <token>
```

Errors use:

```json
{ "message": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Users

### POST `/users/register`

```json
{
  "username": "ayesha",
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `201`:

```json
{
  "_id": "66f1...",
  "username": "ayesha",
  "email": "ayesha@example.com",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "token": "<jwt>"
}
```

Rules: username and email must be unique; password must be at least eight
characters.

### POST `/users/login`

```json
{
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `200`: the same shape as registration, without a duplicate account
creation.

### GET `/users/profile`

Authentication required.

```json
{
  "_id": "66f1...",
  "username": "ayesha",
  "email": "ayesha@example.com",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### PUT `/users/profile`

Authentication required.

```json
{ "username": "ayesha-k" }
```

Returns the updated public user.

### PUT `/users/password`

Authentication required.

```json
{
  "currentPassword": "a-strong-password",
  "newPassword": "a-new-strong-password"
}
```

```json
{ "message": "Password changed successfully" }
```

### DELETE `/users/account`

Authentication required. Deletes the user, every note and every tag.

```json
{ "message": "Account and all notes were deleted" }
```

## Notes

### GET `/notes`

Authentication required.

Optional query parameters:

| Parameter | Purpose |
| --- | --- |
| `tag` | Tag name; returns notes that use that tag |
| `search` | Case-insensitive title or content match |

Response `200`:

```json
[
  {
    "_id": "66f2...",
    "title": "Architecture notes",
    "content": "<p>Keep the API thin.</p>",
    "user": "66f1...",
    "tags": [
      {
        "_id": "66f3...",
        "name": "backend",
        "user": "66f1..."
      }
    ],
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-02T00:00:00.000Z"
  }
]
```

### POST `/notes`

```json
{
  "title": "Architecture notes",
  "content": "<p>Keep the API thin.</p>",
  "tags": ["66f3..."]
}
```

Title and content are required. Only tag ids owned by the current user are
accepted. Invalid or foreign tag ids are ignored.

Response `201`: the created note with populated tags.

### GET `/notes/:id`

Returns one note owned by the current user, or `404`.

### PUT `/notes/:id`

Accepts any subset of `title`, `content` and `tags`. Empty title or content
returns `400`.

Response `200`: the updated note with populated tags.

### DELETE `/notes/:id`

```json
{ "message": "Note removed" }
```

## Tags

### GET `/tags`

Returns only the current user's tags, sorted by name.

```json
[
  {
    "_id": "66f3...",
    "name": "backend",
    "user": "66f1...",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### POST `/tags`

```json
{ "name": "backend" }
```

Tag names are unique per user. A duplicate returns `409`.

### DELETE `/tags/:id`

Deletes the tag and removes it from every note owned by the user.

```json
{ "message": "Tag removed" }
```

## cURL examples

```bash
# Register and capture a token
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"password123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# Create a tag
TAG=$(curl -s -X POST http://localhost:5000/api/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"backend"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0))._id")

# Create a note with that tag
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"First note\",\"content\":\"<p>Hello.</p>\",\"tags\":[\"$TAG\"]}"

# List notes filtered by tag name
curl "http://localhost:5000/api/notes?tag=backend" \
  -H "Authorization: Bearer $TOKEN"
```
