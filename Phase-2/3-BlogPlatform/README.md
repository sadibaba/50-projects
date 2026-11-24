# Blog Platform

A full-stack publishing platform with posts, comments, likes, categories, image
uploads, an account area and a dashboard that reports real statistics.

## Overview

The application separates public reading from authenticated interaction:

- Visitors can read posts, open a single post, browse categories and read
  comments.
- Registered readers can like posts, comment and manage their own account.
- Administrators can publish, edit and delete posts and manage categories.

The backend uses Express, MongoDB and JWT authentication. Images are stored on
the local disk under `backend/uploads` and served by the API.

## Implemented features

### Accounts

- Registration and login with bcrypt password hashing.
- Thirty-day JWT sessions.
- Reader and administrator roles.
- Profile editing with name, bio and avatar.
- Avatar upload with file type and 5 MB size validation.
- Account statistics: post count and comment count.
- Onboarding tutorial state stored per account.

### Posts

- Public list and single-post pages.
- Admin-only create, update and delete.
- Optional cover image upload.
- Title, excerpt, content, category and tags.
- Automatic unique slug generation.
- View counter incremented when a post is opened.
- Likes and unlikes per authenticated user.
- Search by title, content, author or category.
- Category filtering on the posts page.

### Comments

- Authenticated comment creation.
- Public comment list per post.
- Comment deletion by the author or an administrator.

### Categories

- Public category list.
- Admin-only category creation.
- Seeded default categories.

### Dashboard

- Post count, likes received, views and comment count for the signed-in user.
- Recent posts with links to the public post page.
- Quick actions for browsing posts, account settings and post creation.
- No hardcoded statistics.

### Frontend

- Theme switcher with persisted preference.
- Responsive layout.
- Lazy-loaded routes.
- Cookie consent banner.
- Legal pages: terms, privacy, cookies, disclaimer, acceptable use, DMCA and
  refund policy.
- Request queue and response error handling for the API client.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Framer Motion, GSAP |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Uploads | Multer, local disk storage |
| Security | Helmet, rate limiting, Mongo sanitisation, XSS input cleanup |
| Testing | Jest, Supertest |
| Tooling | ESLint, Prettier, nodemon |

## Architecture

```text
React client (5173)
├── Public pages: home, posts, post detail, about, contact, legal
├── Auth: signup, login
├── Account: profile, avatar
└── Dashboard: own statistics and posts
        │  fetch /api
        ▼
Express API (5000)
├── Helmet, CORS, compression, rate limiting
├── /api/users
├── /api/posts
├── /api/comments
├── /api/categories
├── /uploads static files
└── Mongoose models: User, Post, Comment, Category
        │
        ▼
MongoDB
```

## Project structure

```text
3-BlogPlatform/
├── backend/
│   ├── controllers/          users, posts, comments, categories
│   ├── middlewares/          auth, uploads, errors, rate limiting
│   ├── models/               User, Post, Comment, Category
│   ├── routes/               API route definitions
│   ├── scripts/              admin and category seed scripts
│   ├── services/             logger and auxiliary services
│   ├── tests/unit/           Jest unit tests
│   ├── uploads/              local post and avatar images
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/api/api.js        API client with request queue
│   ├── src/components/       posts, account, dashboard, legal pages
│   ├── src/context/          theme context
│   └── src/App.jsx           lazy-loaded routes
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer
- npm 9 or newer

### Backend

```bash
cd backend
cp .env.example .env
# Set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

The API starts on `http://localhost:5000`.

### Seed an administrator

Registration always creates a `reader` account. Create the first administrator
with the seed script:

```bash
cd backend
# ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME must be set in .env
node scripts/seedAdmin.js
```

The script creates the account or updates it if the email already exists.

### Seed categories

```bash
cd backend
node scripts/seedCategories.js
```

This replaces the category collection with the default list.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The client starts on `http://localhost:5173`.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | API port |
| `NODE_ENV` | No | `development` | Production mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `JWT_EXPIRES_IN` | No | `90d` | Token lifetime used by the service layer |
| `FRONTEND_URL` | No | `http://localhost:5173` | CORS origin |
| `CORS_ORIGINS` | No | - | Additional allowed origins |
| `ADMIN_EMAIL` | Seed only | - | Administrator email for `seedAdmin.js` |
| `ADMIN_PASSWORD` | Seed only | - | Administrator password |
| `ADMIN_NAME` | Seed only | - | Administrator display name |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Requests per window |
| `LOG_LEVEL` | No | `info` | Logger level |

Cloudinary and Redis variables were removed because the running application uses
local uploads and does not require those services.

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/users/signup` | No | Create a reader account |
| POST | `/api/users/login` | No | Obtain a JWT |
| GET | `/api/users/profile` | Bearer | Current profile and stats |
| PUT | `/api/users/profile` | Bearer | Update name and bio |
| PUT | `/api/users/avatar` | Bearer | Upload an avatar |
| POST | `/api/users/tutorial-seen` | Bearer | Mark onboarding as seen |
| GET | `/api/posts` | No | List posts |
| GET | `/api/posts/:id` | No | Read one post and increment views |
| POST | `/api/posts` | Admin | Create a post |
| PUT | `/api/posts/:id` | Admin | Update a post |
| DELETE | `/api/posts/:id` | Admin | Delete a post |
| PUT | `/api/posts/:id/like` | Bearer | Like a post |
| PUT | `/api/posts/:id/unlike` | Bearer | Remove a like |
| POST | `/api/comments` | Bearer | Add a comment |
| GET | `/api/comments/:postId` | No | List comments |
| DELETE | `/api/comments/:id` | Bearer | Delete a comment |
| GET | `/api/categories` | No | List categories |
| POST | `/api/categories` | Admin | Create a category |
| GET | `/health` | No | Health check |

Full examples: [docs/API.md](docs/API.md).

## Data model

### User

`name`, `email`, `password`, `role` (`admin` or `reader`), `bio`, `avatar`,
`hasSeenTutorial`, timestamps.

### Post

`title`, `content`, `excerpt`, `author`, `authorName`, `category`, `tags`,
`image` (`url`, `publicId`), `likes` (user ids), `likesCount`, `views`, `slug`,
timestamps.

### Comment

`post`, `user`, `content`, timestamps.

### Category

`name`, `description`, timestamps.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm start` | Start the API |
| backend | `npm run dev` | Start with nodemon |
| backend | `npm run prod` | Start with `NODE_ENV=production` |
| backend | `npm test` | Jest unit tests |
| backend | `npm run test:coverage` | Coverage report |
| backend | `npm run lint` | ESLint |
| backend | `npm run format` | Prettier |
| frontend | `npm run dev` | Development server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview the build |
| frontend | `npm run lint` | ESLint |

## Verification

```bash
cd backend
node --check server.js
npm test

cd ../frontend
npm run build
```

Manual checks:

1. Seed an administrator and a few categories.
2. Sign in as the administrator and publish a post with an image.
3. Open the post as a reader and confirm the view counter increments.
4. Like the post and add a comment.
5. Confirm that a reader cannot open the create-post modal.
6. Open the dashboard and confirm the statistics match the account.

## Known limitations

- Only administrators can publish. Reader accounts can like and comment.
- Uploads are stored on the local disk. A multi-instance deployment needs shared
  storage or an object-storage service.
- There is no password reset, email verification or email notification flow.
- The token lifetime is long and there is no refresh-token rotation.
- The follow/follower feature was removed because the backend never implemented
  it. It is listed as future work instead of being presented as complete.
- The dashboard loads comments for up to twenty of the user's posts, so the
  count is capped for accounts with very large post histories.
- There is no automated integration test with a database; the included tests
  cover error helpers only.

## Roadmap

- Add refresh tokens and logout-all-sessions support.
- Add password reset through an email provider.
- Move uploads to S3 or Cloudinary for horizontal scaling.
- Add a proper integration test suite with an in-memory MongoDB.
- Add drafts, scheduled publishing and post revisions.
- Add follow/follower features with the corresponding backend endpoints.

## License

MIT
