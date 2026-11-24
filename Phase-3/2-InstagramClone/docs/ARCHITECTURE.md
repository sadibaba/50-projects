# Architecture

## One application, two runtimes

Lumen is a single Next.js project. Pages and API route handlers live in the same
repository. There is no separate Express backend.

```text
Browser
├── React Server/Client Components
├── AuthContext (fetches /api/auth/me)
└── services/ (typed fetch client)
        │
        ▼
Next.js server
├── App Router pages
├── Route Handlers under app/api
├── lib/auth.ts       JWT, cookies, rate limiting
├── lib/privacy.ts    private-post access
├── lib/validators.ts input rules
├── lib/serialize.ts  response shaping
└── models/           Mongoose schemas
        │
        ▼
MongoDB
```

## Why no separate backend

The project is a learning step from the earlier Express projects. Keeping the
API inside Next.js demonstrates:

- colocated route handlers,
- server-side TypeScript,
- HttpOnly cookie handling through `next/headers`,
- shared validation between the API and the UI.

The trade-off is that the API can only be deployed with the Next.js app. That is
acceptable for this project and documented rather than hidden.

## Authentication flow

1. `POST /api/auth/register` validates the input, hashes the password with bcrypt
   (12 rounds) and creates the user.
2. A JWT with the user id is signed using `JWT_SECRET`.
3. The token is placed in an HttpOnly, SameSite=Lax cookie with a seven-day
   lifetime. In production the cookie is also `Secure`.
4. `getCurrentUser` verifies the cookie on protected and optional-auth routes.
5. `requireUser` turns a missing session into a `401`.
6. Logout overwrites the cookie with an expired value.

The JWT is never exposed to client JavaScript. The client learns the user from
`/api/auth/me`.

## Authorization

| Resource | Rule |
| --- | --- |
| Post edit/delete | Author only |
| Comment delete | Comment author or post author |
| Profile edit | Owner only |
| Follow | Authenticated, not yourself |
| Private post read | Owner or follower only |
| Private profile posts | Owner or follower only |
| Saved list | Owner only |
| Upload | Authenticated |

Privacy is enforced in `lib/privacy.ts` and in the post list filters. The UI also
hides private content, but the server is the authority.

## Data model

```text
User 1 ─── n Post
User 1 ─── n Comment
User 1 ─── n Story
User 1 ─── n Notification (recipient)
Post 1 ─── n Comment
User n ─── n User (followers / following)
User 1 ─── n Post (savedPosts)
```

### User

`username`, `email`, `password` (select false), `name`, `bio`, `avatar`,
`website`, `isPrivate`, `followers`, `following`, `savedPosts`, timestamps.

### Post

`author`, `imageUrl`, `videoUrl`, `type`, `caption`, `altText`, `location`,
`tags`, `likes`, `commentsCount`, timestamps.

### Comment

`post`, `user`, `text`, timestamps.

### Story

`user`, `imageUrl`, `caption`, `expiresAt`, timestamps.

### Notification

`recipient`, `actor`, `type`, `post`, `read`, timestamps.

## Uploads

`POST /api/upload` runs in the Node.js runtime, writes to `public/uploads` and
returns a relative URL. Validation:

- authenticated user,
- allowed MIME type,
- 8 MB size limit,
- magic-byte signature check,
- random filename with an extension derived from the MIME type.

The local disk is suitable for development. Production should use object storage
and a CDN.

## Frontend state

`AuthContext` owns the current user and exposes login, register, logout and
refresh. Pages own their data fetching and loading state. The typed service layer
in `services/` is the only place that calls the API.

## Trade-offs

- Route handlers and pages share one deployment unit.
- Rate limiting is in memory; multiple instances need Redis.
- Notifications poll every 30 seconds.
- Seed images use Picsum, a free no-key service.
- Reels use public sample videos in the demo.
- Search uses regular expressions; a production system would use a search index.
