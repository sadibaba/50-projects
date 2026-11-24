# Authentication API Reference

Base URL: `http://localhost:5000/api`

Protected endpoints accept either the HTTP-only cookie set at login or:

```http
Authorization: Bearer <token>
```

Error responses use:

```json
{ "message": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

## Authentication

### POST `/auth/signup`

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
  "message": "Account created successfully",
  "user": {
    "_id": "66f1...",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "role": "user",
    "bio": "",
    "lastActiveAt": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

If the email matches `ADMIN_EMAIL`, `role` is `admin`.

Rules:

- Name, email and password are required.
- Email must be valid and unique.
- Password must be at least eight characters.

### POST `/auth/login`

```json
{
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `200`:

```json
{
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "_id": "66f1...",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "role": "user",
    "bio": "",
    "lastActiveAt": "2026-01-01T00:00:00.000Z",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

The response also sets an HTTP-only `token` cookie with a seven-day maximum age.

### POST `/auth/logout`

Clears the cookie.

```json
{ "message": "Logged out successfully" }
```

The client also removes its local token.

## Profile

### GET `/auth/me`

Authentication required.

Response `200`: the public user object.

### PUT `/auth/me`

Authentication required.

```json
{
  "name": "Ayesha Khan",
  "bio": "Backend developer focused on Node.js and MongoDB."
}
```

Both fields are optional, but `name` cannot be empty if provided. Bio is limited
to 300 characters.

### PUT `/auth/me/password`

Authentication required.

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

## Admin

All admin endpoints require a valid session with `role: "admin"`.

### GET `/auth/admin/stats`

```json
{
  "totalUsers": 24,
  "adminUsers": 2,
  "activeUsers": 9,
  "newUsers": 5,
  "activeWindowDays": 7
}
```

`activeUsers` counts accounts whose `lastActiveAt` is within seven days.

### GET `/auth/admin/users`

Query parameters:

| Parameter | Default | Notes |
| --- | --- | --- |
| `page` | `1` | Minimum 1 |
| `limit` | `20` | 1 to 100 |
| `q` | empty | Case-insensitive match on name or email |

Response `200`:

```json
{
  "users": [
    {
      "_id": "66f1...",
      "name": "Ayesha Khan",
      "email": "ayesha@example.com",
      "role": "user",
      "bio": "",
      "lastActiveAt": "2026-01-01T00:00:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 24,
    "pages": 2
  }
}
```

### DELETE `/auth/admin/users/:id`

Response `200`:

```json
{ "message": "User deleted successfully" }
```

Rules:

- An administrator cannot delete their own account from this endpoint.
- The last remaining administrator cannot be deleted.

## cURL examples

```bash
# Create an account
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login and capture the token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# Read the current profile
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Admin statistics (requires an admin account)
curl http://localhost:5000/api/auth/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```
