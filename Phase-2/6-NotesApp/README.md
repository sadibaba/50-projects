# Notes App

A notes application with rich text, colour-coded tags, tag filtering and an
account area. Every note and tag belongs to the signed-in user.

## Overview

The client is a React single-page application. The API is an Express service with
JWT authentication and MongoDB persistence. Notes are written in a rich-text
editor, stored as HTML and rendered as plain text in the card list. Tags are
created by the user and can be attached to any number of notes.

## Implemented features

### Accounts

- Registration with username, email and password validation.
- Login with bcrypt password verification.
- Thirty-day JWT sessions.
- Protected API routes and protected React routes.
- Profile page with editable username.
- Password change with current-password verification.
- Account deletion that removes the user's notes and tags.
- Member-since and activity statistics from real data.

### Notes

- Create, edit and delete notes.
- Rich-text editor with headings, lists, links and basic formatting.
- Tag selection and inline tag creation.
- Tag filtering from the notes page and dashboard.
- Notes and tags are always scoped to the authenticated user.
- Notes sorted by last update.
- Server-side search by title or content.

### Dashboard

- Total note count.
- Notes created in the last seven days.
- Recent notes list.
- Quick link to the notes page.

### UI

- Animated page transitions with Framer Motion.
- Toast notifications for success and error feedback.
- Responsive layout.
- Empty states for notes and tags.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Framer Motion |
| Editor | React Quill |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | Explicit controller validation |
| Rate limiting | express-rate-limit |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── AuthContext (token, user, account actions)
├── NoteContext (notes, tags, filters, CRUD)
├── ProtectedRoute
└── Pages: dashboard, notes, profile
        │  Axios + Bearer token
        ▼
Express API (5000)
├── /api/users  signup, login, profile, password, deletion
├── /api/notes  note CRUD, tag filter, search
├── /api/tags   per-user tag CRUD
└── MongoDB: users, notes, tags
```

## Project structure

```text
6-NotesApp/
├── backend/
│   ├── controllers/          user, note, tag handlers
│   ├── database/db.js        MongoDB connection
│   ├── middlewares/          auth, errors, rate limit
│   ├── models/               User, Note, Tag
│   ├── routes/               users, notes, tags
│   ├── utils/http.js         ApiError and asyncHandler
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/context/          AuthContext and NoteContext
│   ├── src/components/       notes, tags, auth, layout, profile
│   ├── src/pages/            dashboard and notes
│   └── src/App.jsx
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
npm install
npm run dev
```

The API starts on `http://localhost:5000`.

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
| `NODE_ENV` | No | `development` | Runtime mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed frontend origins |
| `VITE_API_URL` | No | `http://localhost:5000/api` | API base URL for the client |

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/users/register` | No | Create an account |
| POST | `/api/users/login` | No | Obtain a JWT |
| GET | `/api/users/profile` | Bearer | Current profile |
| PUT | `/api/users/profile` | Bearer | Change username |
| PUT | `/api/users/password` | Bearer | Change password |
| DELETE | `/api/users/account` | Bearer | Delete the account |
| GET | `/api/notes` | Bearer | List notes, filter or search |
| POST | `/api/notes` | Bearer | Create a note |
| GET | `/api/notes/:id` | Bearer | Read one note |
| PUT | `/api/notes/:id` | Bearer | Update a note |
| DELETE | `/api/notes/:id` | Bearer | Delete a note |
| GET | `/api/tags` | Bearer | List the user's tags |
| POST | `/api/tags` | Bearer | Create a tag |
| DELETE | `/api/tags/:id` | Bearer | Delete a tag |
| GET | `/api/health` | No | Health check |

Full examples: [docs/API.md](docs/API.md).

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `username` | String | Required, unique, maximum 40 characters |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, bcrypt hash, excluded by default |
| `createdAt`, `updatedAt` | Date | Timestamps |

### Note

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required |
| `content` | String | Required, HTML from the rich-text editor |
| `user` | ObjectId | Owner |
| `tags` | ObjectId array | References to the user's tags |
| `createdAt`, `updatedAt` | Date | Timestamps |

### Tag

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, maximum 40 characters |
| `user` | ObjectId | Owner |
| `createdAt`, `updatedAt` | Date | Timestamps |

Unique index: `{ user: 1, name: 1 }`.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm start` | Start the API |
| backend | `npm run dev` | Start with nodemon |
| frontend | `npm run dev` | Development server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview the build |
| frontend | `npm run lint` | ESLint |

## Verification

```bash
cd backend
node --check server.js

cd ../frontend
npm run build
```

Manual checks:

1. Register two accounts.
2. Create a tag and a note with that tag in the first account.
3. Sign in to the second account and confirm that neither the note nor the tag
   is visible.
4. Filter notes by tag.
5. Edit a note and confirm that the update time changes.
6. Change the password, sign out and sign back in.
7. Delete a tag and confirm that it is removed from its notes.

## Known limitations

- There is no password reset or email verification.
- Rich-text content is stored as HTML. The card view strips tags, but a full
  production implementation should sanitise HTML on the server before storage.
- There is no pagination; a very large notebook will load every note.
- Search is a regular-expression query, not a text index search.
- Tags are per user, which is intentional, but there is no tag sharing or global
  taxonomy.
- There are no automated tests.

## Roadmap

- Add sanitisation for rich-text HTML.
- Add pagination or virtual scrolling for large notebooks.
- Add a text index for search.
- Add password reset.
- Add note sharing and public read-only links.
- Add automated API tests.

## License

MIT
