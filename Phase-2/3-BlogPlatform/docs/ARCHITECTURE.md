# Blog Platform Architecture

## Purpose

The blog is the largest Phase 2 application. It exercises public and
authenticated routes, role-based publishing, file uploads, relational data
between collections and a dashboard built from real data.

## Request flow

```text
Browser
├── Public reading
│   ├── GET /api/posts
│   ├── GET /api/posts/:id   (increments views)
│   ├── GET /api/comments/:postId
│   └── GET /api/categories
├── Reader actions
│   ├── PUT /api/posts/:id/like
│   ├── PUT /api/posts/:id/unlike
│   ├── POST /api/comments
│   └── profile and avatar endpoints
└── Administrator actions
    ├── POST /api/posts
    ├── PUT /api/posts/:id
    ├── DELETE /api/posts/:id
    └── POST /api/categories
        │
        ▼
Express API
├── Helmet, CORS, compression, sanitisation
├── rate limiters for API, auth and comments
├── JWT middleware (protect)
├── role middleware (adminOnly)
├── multer local uploads
├── controllers
└── Mongoose models
        │
        ▼
MongoDB + backend/uploads
```

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/` | Endpoint definitions and middleware chains |
| `middlewares/UserMiddleware.js` | Token verification and admin role check |
| `middlewares/localUpload.js` | Disk storage, file type filter, 5 MB limit |
| `middlewares/rateLimiter.js` | API, auth and comment rate limits |
| `middlewares/errorMiddleware.js` | 404 and error responses |
| `controllers/` | Validation, persistence and response shaping |
| `models/` | User, Post, Comment and Category schemas |
| `scripts/` | Administrator and category seed routines |
| `utils/AppError.js` | Operational error with status code |

## Authentication and roles

- Signup creates a `reader` account and returns a thirty-day JWT.
- `seedAdmin.js` creates or updates an administrator account.
- `protect` verifies the bearer token and loads the user.
- `adminOnly` checks the role before create, update and delete post operations.
- Like, unlike and comment routes only require a valid session.

The frontend mirrors these rules in the UI, but the API is the authority.

## Uploads

`localUpload.js` configures two Multer disk stores:

| Store | Destination | Used by |
| --- | --- | --- |
| Post images | `uploads/posts` | Create and update post |
| Avatars | `uploads/avatars` | Avatar update |

Only `image/*` files up to 5 MB are accepted. Filenames combine a timestamp and a
random number to avoid collisions. `app.js` serves the upload directory as
static files with a seven-day cache header.

Deleting a post removes its local image. Replacing a post image removes the old
file. The code is intentionally storage-specific: a deployment on multiple
instances should use shared storage.

## Frontend structure

- `App.jsx` lazy-loads every route and wraps the layout in a theme provider.
- `api/api.js` is a small fetch-based client with a request queue, auth headers
  and central error handling.
- `AllPosts.jsx` fetches posts, builds category filters and renders the grid.
- `BlogDetail.jsx` loads one post, comments and like state.
- `AccountPage.jsx` loads the profile and supports avatar and profile updates.
- `Dashboard.jsx` loads the profile and all posts, filters the current user's
  posts and fetches comments for those posts to produce real statistics.
- Legal pages share `LegalLayout`.

## Frontend data flow for the dashboard

```text
Dashboard mount
├── GET /api/users/profile  -> signed-in user and post/comment counts
└── GET /api/posts          -> all posts
        ├── filter posts by author id
        ├── sum likes and views
        └── GET /api/comments/:postId for up to 20 own posts
                └── total comment count
```

The comment count is capped at twenty posts. This is documented as a limitation
rather than hidden.

## Database relationships

```text
User 1 ─── n Post
User 1 ─── n Comment
Post 1 ─── n Comment
Category 1 ─── n Post (by name)
```

Posts embed the author reference and the author name so the list view can render
without an extra populate for the display name. The API still populates the
author document for avatar and profile links.

## Security decisions

| Decision | Reason |
| --- | --- |
| Helmet | Standard security headers |
| CORS allowlist | Only configured frontend origins |
| Rate limiting | Reduces brute-force and comment spam |
| Mongo sanitisation | Removes operators from user input |
| Inline XSS cleanup | Strips script tags from request bodies |
| Password hashing | bcrypt with ten rounds |
| Role checks in middleware | Prevents UI-only authorisation |
| Upload type and size limits | Reduces abuse of the upload endpoint |

## Trade-offs and limitations

- Local disk uploads do not scale horizontally.
- JWT sessions last thirty days and cannot be revoked individually.
- There is no refresh-token rotation.
- There is no password reset or email verification.
- The follow/follower feature was removed because no backend endpoints existed.
- The test suite covers error helpers, not database-backed controllers.
- The dashboard comment count is limited to twenty own posts to avoid a large
  number of parallel requests.

## Failure handling

- Invalid or missing token: `401`.
- Reader attempting an admin action: `403`.
- Invalid post or comment id: `400` or `404` depending on the operation.
- Upload too large or wrong type: `400` through Multer and `AppError`.
- Rate limit exceeded: `429`.
- Database or unexpected failure: `500` with a JSON message.
