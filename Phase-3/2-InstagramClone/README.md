# Lumen — Instagram Clone

A full-stack Instagram alternative built with Next.js App Router and TypeScript.
Everything runs in one application: the React interface and the API route
handlers share the same project. There is no separate backend folder.

The product keeps the parts of Instagram that work — photo sharing, stories,
reels, profiles and following — and removes or fixes the parts that get in the
way.

## What is implemented

### Feed and discovery

- Following feed and a public "For you" feed.
- Chronological ordering. No engagement ranking.
- Stories bar with 24-hour stories and a story viewer.
- Explore grid with people suggestions and caption/tag filtering.
- Search across people, captions, tags and locations.
- Vertical Reels feed with video, like, save, comment link and share.
- Guest browsing without a login wall.

### Posts

- Create a post from an uploaded image.
- Caption, alt text, location and tags.
- Optional video URL to publish a Reel.
- Like and unlike, with double-click support.
- Comments with author avatars and delete permissions.
- Save and unsave.
- Share through the Web Share API with a clipboard fallback.
- Download the original image.
- Edit caption, alt text and location.
- Delete a post, including its comments and notifications.

### Profiles and social

- Avatar, name, username, bio, website and private-account setting.
- Follow and unfollow.
- Followers and following counts with user lists.
- Pins-style post grid and a private Saved tab.
- Real totals for posts, followers, following and likes.
- Profile editor with image upload.
- Private accounts: posts are filtered by the server for non-followers.

### Notifications

- Like, comment, follow and save notifications.
- Unread badge in the navigation bar.
- Notification dropdown and a full notifications page.
- Mark one or all as read.
- Polling every 30 seconds. No socket server required.

### Security and auth

- Registration and login with bcrypt password hashing (12 rounds).
- JWT stored in an HttpOnly, SameSite=Lax cookie.
- Seven-day sessions with a secure cookie in production.
- Same-origin checks for mutating auth and upload routes.
- In-memory rate limits for login, registration and password changes.
- Password change flow with current-password verification.
- Input validation for usernames, emails, passwords, captions, object ids and
  image URLs.
- Image uploads restricted by MIME type, 8 MB size and magic-byte signature.
- Private post access checked in the API, not only in the UI.
- React escaping for all user content. No `dangerouslySetInnerHTML`.
- Secret JWT; no fallback secret is accepted.

### Accessibility and product choices

- Alt text is supported and used in image `alt` attributes.
- Keyboard-friendly buttons, labels and form controls.
- Responsive layout with a mobile bottom navigation.
- No ads, no sponsored posts and no tracking pixels.
- Download and edit actions that Instagram does not put first.
- Public browsing for people who do not want an account.

## How this improves on Instagram

| Instagram friction | Lumen |
| --- | --- |
| Login wall for browsing | Public home, explore, posts, profiles and reels |
| Ads and sponsored posts | None |
| Algorithm-first feed | Chronological Following and For you feeds |
| Suggested posts mixed into the feed | Kept separate in Explore and suggestions |
| Saving a post is one-way | Save/unsave with a private Saved page |
| Downloading is awkward | Download button on every post |
| Alt text is buried | Required alongside caption when publishing |
| Private posts can still leak through links | Private post access is enforced by the API |
| Editing a post is limited | Caption, alt text and location editing |
| Cluttered mobile navigation | Focused bottom navigation |
| Tracking-heavy experience | No third-party trackers |

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19, custom CSS |
| API | Next.js Route Handlers (`app/api`) |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs, HttpOnly cookies |
| Uploads | Local disk under `public/uploads` |
| Images | Picsum for seed and demo content |
| Toasts | react-hot-toast |
| Tests | Node test runner via `tsx` |

## Architecture

```text
Next.js application (port 3001)
├── App Router pages
│   ├── /                 feed and guest landing
│   ├── /explore          public posts and people
│   ├── /reels            vertical video feed
│   ├── /create           image + caption composer
│   ├── /p/[id]           post detail and comments
│   ├── /u/[username]     profile, posts and saved
│   ├── /notifications
│   ├── /saved
│   ├── /settings
│   └── /search
├── Route Handlers
│   ├── /api/auth
│   ├── /api/posts
│   ├── /api/users
│   ├── /api/notifications
│   ├── /api/stories
│   ├── /api/search
│   └── /api/upload
├── lib/                  db, auth, validators, privacy, helpers
├── models/               User, Post, Comment, Story, Notification
└── public/uploads        uploaded images (local development)
        │
        ▼
MongoDB
```

There is no separate Express server. Route Handlers are server-side TypeScript
functions in the same Next.js project.

## Project structure

```text
2-InstagramClone/
├── app/
│   ├── api/                  auth, posts, users, comments, stories, search, upload
│   ├── p/[id]/               post detail
│   ├── u/[username]/         profile
│   ├── explore/ reels/ create/ saved/ notifications/ settings/ search/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/               Navbar, PostCard, PostGrid, Comments, StoriesBar
├── context/AuthContext.tsx
├── lib/                      db, auth, api, validators, serialize, privacy, notify
├── models/                   Mongoose models
├── scripts/                  seed and smoke test
├── services/                 typed browser API client
├── tests/                    unit tests
├── types/                    shared TypeScript types
├── docs/
└── public/uploads
```

## Getting started

### Prerequisites

- Node.js 20.9 or newer
- MongoDB 6 or newer
- npm 9 or newer

### Install

```bash
cd Phase-3/2-InstagramClone
cp .env.example .env.local
npm install
```

Set `MONGO_URI` and `JWT_SECRET` in `.env.local`.

### Seed demo data

```bash
npm run seed
```

The seed is idempotent: it exits early if posts already exist.

### Run

```bash
npm run dev
```

Open `http://localhost:3001`.

### Demo login

```text
Email:    demo@lumen.local
Password: demo12345
```

Other seeded accounts use the same password:
`maya@lumen.local`, `noah@lumen.local`, `aria@lumen.local`, `leo@lumen.local`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Token signing secret |
| `NEXT_PUBLIC_APP_URL` | Recommended | Origin allowed by the same-origin check |
| `NODE_ENV` | No | `production` enables secure cookies |

## API overview

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Sign in and set the cookie |
| POST | `/api/auth/logout` | No | Clear the cookie |
| GET | `/api/auth/me` | Optional | Current user |
| PUT | `/api/auth/password` | Yes | Change password |
| GET | `/api/posts` | Optional | List posts by scope |
| POST | `/api/posts` | Yes | Create a post |
| GET | `/api/posts/:id` | Optional | Post detail |
| PATCH | `/api/posts/:id` | Yes | Edit own post |
| DELETE | `/api/posts/:id` | Yes | Delete own post |
| PUT | `/api/posts/:id/like` | Yes | Toggle like |
| PUT | `/api/posts/:id/save` | Yes | Toggle save |
| GET/POST | `/api/posts/:id/comments` | Optional/Yes | List or add comments |
| DELETE | `/api/posts/:id/comments/:commentId` | Yes | Delete a comment |
| GET | `/api/users/:username` | Optional | Profile and posts |
| PATCH | `/api/users/me` | Yes | Update own profile |
| PUT | `/api/users/:username/follow` | Yes | Follow or unfollow |
| GET | `/api/users/:username/followers` | Optional | Followers |
| GET | `/api/users/:username/following` | Optional | Following |
| GET | `/api/users/search?q=` | Optional | Search people |
| GET | `/api/users/suggested` | Optional | Suggested people |
| GET | `/api/notifications` | Yes | Notifications and unread count |
| PUT | `/api/notifications/read-all` | Yes | Mark all read |
| GET | `/api/stories` | No | Active stories |
| POST | `/api/stories` | Yes | Add a story |
| GET | `/api/search?q=` | Optional | Search people and posts |
| POST | `/api/upload` | Yes | Upload an image |
| GET | `/api/health` | No | Health check |

Full request and response examples: [docs/API.md](docs/API.md).

## Documentation

- [API reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Product notes and Instagram comparison](docs/PRODUCT.md)

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server on 3001 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run seed` | Seed demo users, posts, reels and stories |
| `npm test` | Unit tests with the Node test runner |
| `npm run smoke` | API smoke test against a running app |

## Verification performed

- `npx tsc --noEmit`: pass.
- `npm run build`: pass, 27 routes generated.
- `npm test`: 7 tests pass.
- API checks against MongoDB:
  - register, login, me and logout
  - list posts, create post, like, save
  - comment, search, upload
  - follow and notifications from a second account
  - stories
- All page routes return HTTP 200 in production mode.

## Known limitations

- Local disk uploads are not suitable for multi-instance production. Use S3 or
  another object store before deploying.
- Rate limiting is in memory; a multi-instance deployment needs Redis or another
  shared store.
- Notifications use polling, not WebSockets.
- There is no password-reset email flow yet.
- Reels use public sample videos. Replace them with licensed content.
- There is no content moderation or reporting workflow.
- Comments are not paginated.
- Search uses regular expressions rather than a dedicated search engine.
- There is no native mobile application.

## Roadmap

- Object storage and image resizing.
- Redis-backed rate limiting and sessions.
- Password reset with email.
- Real-time notifications and direct messages.
- Comment pagination and mentions.
- Content moderation and reporting.
- PWA support and offline saved posts.

## License

MIT
