# Lumen API Reference

Base URL: `http://localhost:3001/api`

Authentication uses an HttpOnly cookie named `ig_token`. The browser sends it
automatically. Requests from scripts can use a cookie jar.

Errors:

```json
{ "error": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

## Authentication

### POST `/auth/register`

```json
{
  "username": "maya",
  "email": "maya@example.com",
  "password": "a-strong-password",
  "name": "Maya Khan"
}
```

Rules:

- Username is 3-30 characters using letters, numbers, dots or underscores.
- A username cannot start or end with a dot or contain two dots.
- Email must be valid and unique.
- Password must be at least eight characters.
- Rate limited to eight attempts per minute per client.

Response `201`:

```json
{
  "user": {
    "_id": "66f1...",
    "username": "maya",
    "name": "Maya Khan",
    "email": "maya@example.com",
    "bio": "",
    "avatar": "",
    "website": "",
    "isPrivate": false,
    "followers": [],
    "following": [],
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

The response also sets the `ig_token` cookie.

### POST `/auth/login`

```json
{ "email": "maya@example.com", "password": "a-strong-password" }
```

Response `200`: `{ "user": { ... } }` and a fresh cookie.

### POST `/auth/logout`

Clears the cookie.

### GET `/auth/me`

Optional authentication. Returns `{ "user": null }` for guests or the current
user with email.

### PUT `/auth/password`

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

Rate limited to six attempts per minute.

## Posts

### GET `/posts`

Query parameters:

| Parameter | Values | Notes |
| --- | --- | --- |
| `scope` | `explore`, `feed`, `user`, `saved` | default explore |
| `username` | text | required for `scope=user` |
| `type` | `image`, `video` | reels |
| `page` | number | default 1 |
| `limit` | 1-30 | default 12 |

Response:

```json
{
  "posts": [
    {
      "_id": "66f2...",
      "imageUrl": "https://picsum.photos/seed/lumen-1/700/900",
      "videoUrl": "",
      "type": "image",
      "caption": "A quiet corner.",
      "altText": "A reading corner with a chair and lamp",
      "location": "Home",
      "tags": ["interiors", "books"],
      "author": {
        "_id": "66f1...",
        "username": "maya",
        "name": "Maya Khan",
        "avatar": "https://..."
      },
      "likesCount": 12,
      "liked": false,
      "saved": false,
      "commentsCount": 3,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "total": 16,
  "hasMore": true
}
```

Privacy: explore only includes posts from public authors. A private profile
returns `{ "posts": [], "private": true }` unless the viewer follows it. The
feed scope includes the viewer's own posts and the people they follow.

### POST `/posts`

Authentication required.

```json
{
  "imageUrl": "/uploads/abc123.jpg",
  "videoUrl": "",
  "caption": "Morning light.",
  "altText": "Sunlight across a minimal room",
  "location": "Home",
  "tags": ["light", "interiors"]
}
```

`imageUrl` must be an upload path or an HTTPS URL. `videoUrl` is optional and
must use HTTPS. A caption or alt text is required. Response `201`: the shaped
post.

### GET `/posts/:id`

Optional authentication. Private posts return `404` unless the viewer is the
owner or a follower.

### PATCH `/posts/:id`

Owner only. Accepts `caption`, `altText` and `location`.

### DELETE `/posts/:id`

Owner only. Also deletes comments, notifications and saved references.

### PUT `/posts/:id/like`

Toggles a like. Response:

```json
{ "liked": true, "likesCount": 13 }
```

Creates a notification for the author unless the author liked their own post.

### PUT `/posts/:id/save`

Toggles a save on the current user's `savedPosts`. Response:

```json
{ "saved": true }
```

### GET `/posts/:id/comments`

Returns comments with populated author username, name and avatar.

### POST `/posts/:id/comments`

Authentication required.

```json
{ "text": "This is beautiful." }
```

Creates a notification and increments `commentsCount`.

### DELETE `/posts/:id/comments/:commentId`

Allowed for the comment author or the post author.

## Users

### GET `/users/:username`

Optional authentication.

```json
{
  "user": { "...": "public user, email only for the owner" },
  "posts": [],
  "saved": [],
  "followersCount": 4,
  "followingCount": 2,
  "totalLikes": 37,
  "isFollowing": false,
  "canView": true
}
```

`saved` is only populated for the owner.

### PATCH `/users/me`

Authentication required. Accepts `name`, `username`, `bio`, `website`, `avatar`
and `isPrivate`. Avatar must be an upload path or an HTTPS URL.

### PUT `/users/:username/follow`

Authentication required. Toggles follow and returns:

```json
{ "following": true, "followersCount": 5 }
```

### GET `/users/:username/followers`

Returns public user summaries.

### GET `/users/:username/following`

Returns public user summaries.

### GET `/users/search?q=`

Returns up to 12 matching users.

### GET `/users/suggested`

Returns up to five people the current user does not follow.

## Notifications

### GET `/notifications`

Authentication required.

```json
{
  "notifications": [
    {
      "_id": "66f5...",
      "type": "like",
      "actor": { "username": "maya", "name": "Maya Khan", "avatar": "..." },
      "post": { "_id": "66f2...", "imageUrl": "...", "caption": "..." },
      "read": false,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "unread": 3
}
```

### PUT `/notifications/:id/read`

Marks one notification as read.

### PUT `/notifications/read-all`

Marks all notifications as read.

## Stories

### GET `/stories`

Public. Returns active stories (not expired) with user summaries.

### POST `/stories`

Authentication required.

```json
{ "imageUrl": "/uploads/abc123.jpg", "caption": "Morning light" }
```

Stories expire after 24 hours.

### DELETE `/stories/:id`

Owner only.

## Search

### GET `/search?q=`

Returns `{ users, posts }`. Private authors are excluded from post results.

## Upload

### POST `/upload`

Authentication required. `multipart/form-data` with a field named `image`.

Allowed: JPEG, PNG, WebP and GIF; maximum 8 MB. The route checks the file MIME
type and the file signature.

```json
{ "url": "/uploads/abc123.jpg", "size": 68210 }
```

## cURL example

```bash
BASE=http://localhost:3001/api

# Login and keep the cookie
curl -c cookies.txt -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@lumen.local","password":"demo12345"}'

# Read the feed
curl -b cookies.txt "$BASE/posts?scope=feed&limit=5"

# Create a post
curl -b cookies.txt -X POST $BASE/posts \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://picsum.photos/seed/test/700/900","caption":"Test","altText":"Test image"}'
```
