# Blog Platform API Reference

Base URL: `http://localhost:5000/api`

Protected endpoints use:

```http
Authorization: Bearer <token>
```

Most errors use:

```json
{ "message": "Human-readable explanation" }
```

Some post endpoints wrap successful responses in `{ "success": true, ... }`.
Response shapes are shown explicitly below.

## Health

### GET `/health`

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

## Users

### POST `/users/signup`

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
  "_id": "66f1...",
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "role": "reader",
  "bio": "Curious reader exploring stories of remarkable people.",
  "avatar": "",
  "hasSeenTutorial": false,
  "token": "<jwt>"
}
```

Public registration always creates a `reader`. Administrators are created with
`scripts/seedAdmin.js`.

### POST `/users/login`

```json
{
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `200`: the same shape as signup.

### GET `/users/profile`

Authentication required.

```json
{
  "_id": "66f1...",
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "role": "reader",
  "bio": "Curious reader.",
  "avatar": "/uploads/avatars/avatar-...jpg",
  "hasSeenTutorial": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z",
  "stats": {
    "posts": 0,
    "comments": 4
  }
}
```

### PUT `/users/profile`

Authentication required. All fields are optional.

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "bio": "Writing about technology and design.",
  "currentPassword": "a-strong-password",
  "newPassword": "a-new-strong-password"
}
```

A password change requires both `currentPassword` and `newPassword`.

Response `200`:

```json
{
  "success": true,
  "user": { "...": "public user fields" },
  "message": "Profile updated successfully"
}
```

### PUT `/users/avatar`

Authentication required. `multipart/form-data` with a single field named
`avatar`. Allowed types are images up to 5 MB.

Response `200`:

```json
{
  "success": true,
  "avatar": "/uploads/avatars/avatar-...jpg",
  "user": { "...": "public user fields" },
  "message": "Avatar updated successfully"
}
```

### POST `/users/tutorial-seen`

Authentication required.

```json
{ "success": true }
```

## Posts

### GET `/posts`

No authentication.

Response `200`:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "66f1...",
      "title": "A post title",
      "content": "Full content",
      "excerpt": "Short summary",
      "author": {
        "_id": "66f0...",
        "name": "Ayesha Khan",
        "email": "ayesha@example.com",
        "avatar": "/uploads/avatars/avatar-...jpg"
      },
      "authorName": "Ayesha Khan",
      "category": "Writers",
      "tags": ["writing", "process"],
      "image": {
        "url": "/uploads/posts/post-...jpg",
        "publicId": null
      },
      "likes": ["66f2..."],
      "likesCount": 1,
      "views": 12,
      "slug": "a-post-title",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET `/posts/:id`

No authentication. Increments `views` by one.

Response `200`:

```json
{
  "success": true,
  "data": { "...": "a single post" }
}
```

### POST `/posts`

Authentication required, `admin` role required.

Content type: `multipart/form-data`.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | Yes | Maximum 200 characters |
| `content` | Yes | Post body |
| `category` | Yes | Category name |
| `excerpt` | No | Generated from the content when missing |
| `tags` | No | Comma-separated string or repeated values |
| `image` | No | Image file up to 5 MB |

Response `201`:

```json
{
  "success": true,
  "post": { "...": "the created post" }
}
```

### PUT `/posts/:id`

Authentication required, `admin` role required. Same fields as creation. A new
image replaces the previous local file.

Response `200`:

```json
{
  "success": true,
  "post": { "...": "the updated post" }
}
```

### DELETE `/posts/:id`

Authentication required, `admin` role required. Deletes the post and its local
image.

Response `200`:

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

### PUT `/posts/:id/like`

Authentication required. A user can like a post once.

Response `200`:

```json
{
  "success": true,
  "data": { "...": "the updated post" }
}
```

### PUT `/posts/:id/unlike`

Authentication required. Removes the current user's like.

Response `200`:

```json
{
  "success": true,
  "data": { "...": "the updated post" }
}
```

## Comments

### POST `/comments`

Authentication required.

```json
{
  "postId": "66f1...",
  "content": "Useful article."
}
```

Response `201`: the created comment.

### GET `/comments/:postId`

No authentication. Returns an array of comments with the commenter's name:

```json
[
  {
    "_id": "66f3...",
    "post": "66f1...",
    "user": {
      "_id": "66f0...",
      "name": "Ayesha Khan"
    },
    "content": "Useful article.",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### DELETE `/comments/:id`

Authentication required. The comment author or an administrator can delete.

```json
{ "message": "Comment removed" }
```

## Categories

### GET `/categories`

No authentication. Returns an array of category documents.

### POST `/categories`

Authentication required, `admin` role required.

```json
{
  "name": "Writers",
  "description": "Authors and poets"
}
```

Response `201`: the created category.

## Uploads

Uploaded files are served from `http://localhost:5000/uploads/...`. The frontend
converts relative paths to absolute URLs before rendering them.

## cURL examples

```bash
# Login and capture a token
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin-password"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# List posts
curl http://localhost:5000/api/posts

# Create a post without an image
curl -X POST http://localhost:5000/api/posts \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=First post" \
  -F "content=The complete post body." \
  -F "category=Writers"

# Add a comment
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"postId":"<post id>","content":"Useful article."}'
```
