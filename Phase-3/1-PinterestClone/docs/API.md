# Pinboard API Reference

Base URL: `http://localhost:5000/api`

Public endpoints accept an optional bearer token so the response can include
`liked` and `saved` flags. Protected endpoints require:

```http
Authorization: Bearer <token>
```

Errors use:

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
  "username": "ayesha",
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Rules: username is 3-30 characters using letters, numbers or underscores;
email must be valid and unique; password must be at least 8 characters.

Response `201`:

```json
{
  "token": "<jwt>",
  "user": {
    "_id": "66f1...",
    "username": "ayesha",
    "name": "ayesha",
    "email": "ayesha@example.com",
    "bio": "",
    "avatar": "",
    "cover": "",
    "website": "",
    "location": "",
    "followers": [],
    "following": [],
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

### POST `/auth/login`

```json
{ "email": "ayesha@example.com", "password": "a-strong-password" }
```

Response `200`: `{ "token": "<jwt>", "user": { ... } }`.

### GET `/auth/me`

Authentication required. Returns the private user shape, including email.

### PUT `/auth/me`

Authentication required. Any subset of:

```json
{
  "name": "Ayesha Khan",
  "username": "ayesha",
  "bio": "Interiors, light and small spaces.",
  "avatar": "https://...",
  "cover": "https://...",
  "website": "https://example.com",
  "location": "Karachi"
}
```

### PUT `/auth/me/password`

```json
{ "currentPassword": "old-password", "newPassword": "new-password" }
```

## Pins

### GET `/pins`

Public. Query parameters:

| Parameter | Values | Notes |
| --- | --- | --- |
| `page` | number | default 1 |
| `limit` | 1-50 | default 20 |
| `q` | text | title, description, tags and category |
| `category` | text | exact category, `All` for everything |
| `type` | `image`, `video` | filter reels |
| `userId` | ObjectId | pins by one creator |
| `saved` | `me` | requires auth |
| `liked` | `me` | requires auth |
| `following` | `me` | requires auth; own and followed creators |
| `sort` | `latest`, `popular` | default latest |

Response:

```json
{
  "pins": [
    {
      "_id": "66f2...",
      "title": "Warm minimal living room",
      "description": "A quiet room with natural materials.",
      "imageUrl": "https://picsum.photos/seed/interiors-4/600/900",
      "videoUrl": "",
      "posterUrl": "https://picsum.photos/seed/interiors-4/600/900",
      "type": "image",
      "category": "Interiors",
      "tags": ["interiors", "minimal"],
      "sourceName": "Picsum",
      "sourceUrl": "https://picsum.photos",
      "createdBy": { "_id": "66f1...", "username": "maya", "name": "Maya Khan", "avatar": "..." },
      "likes": ["66f3..."],
      "saves": [],
      "likesCount": 1,
      "savesCount": 0,
      "commentsCount": 2,
      "liked": true,
      "saved": false,
      "views": 140,
      "width": 600,
      "height": 900,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "total": 35,
  "hasMore": true
}
```

### GET `/pins/:id`

Public. Increments `views` and returns the pin plus `related`, which contains up
to eight pins in the same category with the same `liked`/`saved` decoration.

### POST `/pins`

Authentication required.

```json
{
  "title": "A quiet reading corner",
  "description": "Warm lamp, low chair, one shelf.",
  "imageUrl": "https://...",
  "category": "Interiors",
  "tags": ["reading", "interiors"],
  "boardId": "66f4...",
  "videoUrl": "",
  "sourceName": "Uploaded",
  "sourceUrl": "",
  "width": 600,
  "height": 900
}
```

`title` and `imageUrl` are required. If `videoUrl` is present the pin type becomes
`video`. If `boardId` belongs to the current user, the pin is added to that
board.

Response `201`: the created pin with counts and flags.

### PUT `/pins/:id`

Authentication required and owner only. Accepts the same fields as creation.

### DELETE `/pins/:id`

Authentication required and owner only. Removes the pin from boards and deletes
its comments and notifications.

### PUT `/pins/:id/like`

Authentication required.

```json
{ "liked": true, "likesCount": 12 }
```

Creates a `like` notification for the pin owner unless the owner is the actor.

### PUT `/pins/:id/unlike`

Authentication required.

```json
{ "liked": false, "likesCount": 11 }
```

### PUT `/pins/:id/save`

Authentication required.

```json
{ "boardId": "66f4..." }
```

`boardId` is optional. When supplied, the pin is also added to that board.
Creates a `save` notification.

Response:

```json
{ "saved": true, "savesCount": 3 }
```

### PUT `/pins/:id/unsave`

Authentication required. Removes the save and removes the pin from every board
owned by the current user.

```json
{ "saved": false, "savesCount": 2 }
```

## Boards

### GET `/boards`

Public. Query parameters: `userId`, `mine=1`.

Secret boards are removed for other users and for guests.

### POST `/boards`

Authentication required.

```json
{
  "name": "Home edit",
  "description": "Warm rooms and useful objects.",
  "isSecret": false,
  "cover": "https://..."
}
```

### GET `/boards/:id`

Public, but secret boards are only visible to their owner.

### PUT `/boards/:id`

Authentication required and owner only. Accepts `name`, `description`,
`isSecret`, `cover`.

### DELETE `/boards/:id`

Authentication required and owner only.

### POST `/boards/:id/pins`

Authentication required and owner only.

```json
{ "pinId": "66f2..." }
```

### DELETE `/boards/:id/pins/:pinId`

Authentication required and owner only.

## Users

### GET `/users/:id/profile`

Public. `:id` accepts a user id or a username. Returns:

```json
{
  "user": { "...": "public user, email only for the owner" },
  "pins": [],
  "boards": [],
  "saved": [],
  "followers": [],
  "following": [],
  "followersCount": 4,
  "followingCount": 2,
  "totalLikes": 37,
  "isFollowing": false
}
```

`saved` is only populated for the profile owner.

### PUT `/users/:id/follow`

Authentication required. Cannot follow yourself.

```json
{ "following": true, "followersCount": 5 }
```

### PUT `/users/:id/unfollow`

Authentication required.

```json
{ "following": false, "followersCount": 4 }
```

### GET `/users/:id/followers`

Public. Returns a list of users.

### GET `/users/:id/following`

Public. Returns a list of users.

### GET `/users/search?q=`

Public. Matches username or name, limited to 12 results.

### GET `/users/me/saved`

Authentication required. Returns the current user's saved pins.

## Comments

### GET `/pins/:id/comments`

Public. Returns comments with populated author username, name and avatar.

### POST `/pins/:id/comments`

Authentication required.

```json
{ "text": "This is exactly what I needed." }
```

Creates a notification for the pin owner. `commentsCount` is incremented.

### DELETE `/comments/:id`

Authentication required. Allowed for the comment author or the pin owner.

## Notifications

All notification routes require authentication.

### GET `/notifications`

```json
{
  "notifications": [
    {
      "_id": "66f5...",
      "type": "like",
      "actor": { "username": "maya", "name": "Maya Khan", "avatar": "..." },
      "pin": { "_id": "66f2...", "title": "...", "imageUrl": "..." },
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

## Search

### GET `/search?q=`

Public. Returns `{ pins, boards, users }`. Boards exclude secret boards. Pins
match title, description, tags or category.

## Discover

### GET `/discover/categories`

Public.

```json
[
  { "name": "All", "count": 35 },
  { "name": "Travel", "count": 3 },
  { "name": "Interiors", "count": 3 }
]
```

### GET `/discover/images?q=&page=&limit=`

Public. Returns Picsum image URLs with no API key.

```json
{
  "results": [
    {
      "id": "free-interior-1-0",
      "title": "interior inspiration 1",
      "alt_description": "interior inspiration",
      "urls": {
        "regular": "https://picsum.photos/seed/interior-1-0/600/900",
        "small": "https://picsum.photos/seed/interior-1-0/400/594",
        "thumb": "https://picsum.photos/seed/interior-1-0/200/300"
      },
      "user": { "name": "Lorem Picsum", "username": "picsum" },
      "sourceName": "Picsum",
      "sourceUrl": "https://picsum.photos",
      "width": 600,
      "height": 900,
      "likes": 0
    }
  ],
  "page": 1,
  "hasMore": true,
  "source": "Picsum (no API key required)"
}
```

## Upload

### POST `/upload`

Authentication required. `multipart/form-data` with a field named `image`.
Allowed: image MIME types, maximum 8 MB.

```json
{
  "url": "http://localhost:5000/uploads/8473...png",
  "filename": "8473...png",
  "size": 68210
}
```

The file is served from `/uploads/<filename>`.

## cURL examples

```bash
BASE=http://localhost:5000/api

# Login
TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"curator@pinterest.local","password":"demo12345"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# List popular pins
curl "$BASE/pins?sort=popular&limit=5"

# Create a pin
curl -X POST $BASE/pins \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Free image test","imageUrl":"https://picsum.photos/seed/test/600/900","category":"Tech"}'

# Upload an image
curl -X POST $BASE/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@./image.png"

# Notifications
curl $BASE/notifications -H "Authorization: Bearer $TOKEN"
```
