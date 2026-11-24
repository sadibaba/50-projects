# Task Manager API Reference

Base URL: `http://localhost:5000/api`

All request and response bodies are JSON. Protected endpoints require:

```http
Authorization: Bearer <token>
```

Errors use a consistent shape:

```json
{
  "message": "Human-readable explanation"
}
```

Validation failures return `400`, authentication failures return `401`,
forbidden access returns `403`, missing resources return `404`, conflicts return
`409`, and unexpected failures return `500`.

## Health

### GET `/health`

No authentication.

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Authentication

### POST `/users/register`

Creates an account and returns a token immediately.

Request:

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `201`:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "66f1...",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "phone": "",
    "location": "",
    "website": "",
    "bio": "",
    "settings": {
      "emailNotifications": true,
      "pushNotifications": false,
      "language": "en",
      "theme": "system",
      "privacy": "private"
    },
    "lastLoginAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

Rules:

- `name` is required.
- `email` must be valid and unique.
- `password` must be at least eight characters.

### POST `/users/login`

Request:

```json
{
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `200`: the same shape as registration. `lastLoginAt` is updated.

### POST `/users/forgot-password`

Request:

```json
{ "email": "ayesha@example.com" }
```

Response `200`:

```json
{
  "message": "If an account exists for this email, a password reset link has been generated.",
  "resetUrl": "http://localhost:5173/reset-password/<token>"
}
```

`resetUrl` is included only when `NODE_ENV` is not `production`. The response is
the same for unknown emails so the endpoint does not reveal registered accounts.

### POST `/users/reset-password`

Request:

```json
{
  "token": "<token from the reset link>",
  "password": "a-new-strong-password"
}
```

Response `200`:

```json
{ "message": "Password updated. You can now sign in." }
```

The token is hashed in the database and expires after 15 minutes.

## Profile

### GET `/users/profile`

Authentication required.

Response `200`: the public user object.

### PUT `/users/profile`

Authentication required. Only these fields are accepted:

```json
{
  "name": "Ayesha Khan",
  "phone": "+92 300 0000000",
  "location": "Karachi, Pakistan",
  "website": "https://example.com",
  "bio": "Product engineer and part-time writer."
}
```

Email changes are intentionally not supported.

### PUT `/users/change-password`

```json
{
  "currentPassword": "a-strong-password",
  "newPassword": "a-new-strong-password"
}
```

Response `200`:

```json
{ "message": "Password changed successfully" }
```

### PUT `/users/settings`

Settings can be sent directly or under a `settings` key:

```json
{
  "settings": {
    "emailNotifications": true,
    "pushNotifications": false,
    "language": "en",
    "theme": "dark",
    "privacy": "private"
  }
}
```

Response `200`: the updated public user object.

### GET `/users/stats`

Response `200`:

```json
{
  "totalTasks": 24,
  "completedTasks": 16,
  "pendingTasks": 8,
  "overdueTasks": 2,
  "completionRate": 67,
  "activeDays": 9,
  "memberSince": "2026-01-01T00:00:00.000Z"
}
```

### DELETE `/users/account`

Deletes the account and every task owned by it.

Response `200`:

```json
{ "message": "Account and all associated tasks were deleted" }
```

## Tasks

All task endpoints require authentication. Tasks are always scoped to the
authenticated user; a task belonging to another user returns `404`.

### GET `/tasks`

Optional query parameters:

| Parameter | Values |
| --- | --- |
| `status` | `pending`, `in-progress`, `completed` |
| `category` | `unplanned`, `withoutProject`, `scheduled` |

Response `200`: an array of task objects sorted by creation date, newest first.

### GET `/tasks/stats`

```json
{
  "total": 24,
  "completed": 16,
  "pending": 8,
  "overdue": 2,
  "completionRate": 67
}
```

### POST `/tasks`

```json
{
  "title": "Write the release notes",
  "description": "Summarise the changes for version 1.2.",
  "status": "pending",
  "priority": "high",
  "category": "scheduled",
  "deadline": "2026-02-01T12:00:00.000Z"
}
```

Response `201`: the created task.

### PUT `/tasks/:id`

Accepts any subset of `title`, `description`, `status`, `priority`, `category`
and `deadline`. Setting `status` to `completed` records `completedAt`; moving
away from `completed` clears it.

Response `200`: the updated task.

### DELETE `/tasks/:id`

Response `200`:

```json
{ "message": "Task deleted" }
```

## cURL examples

```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login and keep the token
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"First task","priority":"high"}'

# Read profile statistics
curl http://localhost:5000/api/users/stats \
  -H "Authorization: Bearer $TOKEN"
```
