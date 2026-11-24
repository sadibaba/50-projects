# Task Manager

A task and project planner built with React, Express and MongoDB. The planner
combines a drag-and-drop board, project milestones, a task dashboard and a
database-backed user profile.

## Overview

The application has two layers:

- A React client with a planner board, project cards, statistics and an account
  area.
- An Express API that handles registration, login, password reset, profile
  management and task storage.

The planner is a local-first interface. Task and project state is stored in the
browser so the board keeps working without a network connection. The API
implements the task endpoints as well, and the account area uses the API for
everything it owns: profile, password, preferences, statistics and export.

## Implemented features

### Authentication

- Registration with name, email and password validation.
- Login with bcrypt password verification.
- JWT access tokens valid for seven days.
- Protected API routes and protected React routes.
- "Keep me signed in" using `localStorage`; otherwise the token is kept in
  `sessionStorage`.
- Forgot-password flow with a hashed, single-use token that expires after 15
  minutes.
- Reset-password page at `/reset-password/:token`.

### Account area

- Editable profile: name, phone, location, website and bio.
- Read-only email with a clear explanation.
- Password change with current-password verification.
- Stored preferences: email notifications, push notifications, language, theme
  and privacy.
- Task statistics from MongoDB: total, completed, pending, overdue, completion
  rate and active days.
- JSON export of profile, task statistics and locally stored projects.
- Account deletion that also removes the user's tasks.

### Planner

- Multi-column board with drag and drop using `@hello-pangea/dnd`.
- Quick task entry and scheduled tasks.
- Project cards with up to ten milestones, favourites, completion state and
  progress.
- JSON import and export for project data.
- Automatic save to `localStorage`.

### API behaviour

- Consistent JSON error format.
- Request validation for task and profile payloads.
- CORS restricted through `CORS_ORIGINS`.
- Health endpoint with database state.
- Graceful shutdown on `SIGINT` and `SIGTERM`.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios, Lucide icons |
| Drag and drop | `@hello-pangea/dnd` |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Validation | Explicit controller validation |
| Tooling | ESLint, nodemon |

## Architecture

```text
Browser
├── React pages and components
│   ├── Planner state -> localStorage
│   └── Account state -> Axios -> Express API
└── JWT in localStorage or sessionStorage
        │
        ▼
Express API (port 5000)
├── /api/users  authentication, profile, settings, statistics
├── /api/tasks  task CRUD and task statistics
└── Mongoose models: User, Task
        │
        ▼
MongoDB
```

## Project structure

```text
1-TaskManager/
├── backend/
│   ├── config/db.js              MongoDB connection
│   ├── controllers/              user and task request handlers
│   ├── middlewares/              auth, task ownership, error handling
│   ├── models/                   User and Task schemas
│   ├── routes/                   /api/users and /api/tasks
│   ├── tests/                    k6 load tests and database scripts
│   ├── utils/http.js             ApiError and asyncHandler
│   ├── app.js                    Express application
│   └── server.js                 process entry point
├── frontend/
│   ├── src/api/axios.js          Axios client and session helpers
│   ├── src/components/           planner and project components
│   ├── src/pages/                auth, planner, profile and reset pages
│   └── src/App.jsx               route table
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
| `NODE_ENV` | No | `development` | Enables development-only reset links and error details |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret used to sign access tokens |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated allowed origins |
| `FRONTEND_URL` | No | `http://localhost:5173` | Base URL used in password reset links |
| `VITE_API_URL` | No | `http://localhost:5000/api` | API base URL used by the client |

The backend refuses to start when `MONGO_URI` or `JWT_SECRET` is missing.

### Password reset without an email provider

This project does not include an SMTP integration. In development the API logs
the reset URL and returns it in the response so the flow can be tested. In
production the URL is only logged, and a mail provider should be connected
before exposing the feature.

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/users/register` | No | Create an account |
| POST | `/api/users/login` | No | Obtain a JWT |
| POST | `/api/users/forgot-password` | No | Generate a reset token |
| POST | `/api/users/reset-password` | No | Set a new password |
| GET | `/api/users/profile` | Bearer | Read the current profile |
| PUT | `/api/users/profile` | Bearer | Update profile fields |
| PUT | `/api/users/change-password` | Bearer | Change the password |
| PUT | `/api/users/settings` | Bearer | Update preferences |
| GET | `/api/users/stats` | Bearer | Task statistics |
| DELETE | `/api/users/account` | Bearer | Delete the account and tasks |
| GET | `/api/tasks` | Bearer | List tasks |
| POST | `/api/tasks` | Bearer | Create a task |
| GET | `/api/tasks/stats` | Bearer | Task counters |
| PUT | `/api/tasks/:id` | Bearer | Update a task |
| DELETE | `/api/tasks/:id` | Bearer | Delete a task |
| GET | `/api/health` | No | Health and database state |

The full request and response reference is in [docs/API.md](docs/API.md).

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, maximum 80 characters |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, bcrypt hash, excluded from responses |
| `phone` | String | Optional |
| `location` | String | Optional |
| `website` | String | Optional |
| `bio` | String | Optional, maximum 500 characters |
| `settings` | Object | Notification, language, theme and privacy preferences |
| `lastLoginAt` | Date | Updated on login |
| `resetPasswordToken` | String | SHA-256 hash, excluded from responses |
| `resetPasswordExpires` | Date | 15-minute expiry |

### Task

| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required |
| `description` | String | Optional |
| `status` | Enum | `pending`, `in-progress`, `completed` |
| `priority` | Enum | `low`, `medium`, `high` |
| `category` | Enum | `unplanned`, `withoutProject`, `scheduled` |
| `deadline` | Date | Optional |
| `completedAt` | Date | Set when status becomes `completed` |
| `user` | ObjectId | Owner of the task |

Indexes: unique email, `user` on tasks, and a compound `user + status` index.

## Scripts

### Backend

| Command | Purpose |
| --- | --- |
| `npm start` | Start the API |
| `npm run dev` | Start with nodemon |

### Frontend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

### Load tests

The `backend/tests` folder contains k6 scripts and database inspection scripts.
They are development utilities, not part of the automated test suite. Run k6
scripts with the k6 binary while the API is running.

## Verification

```bash
# Backend syntax
cd backend
node --check server.js

# Frontend production build
cd ../frontend
npm run build
```

## Known limitations

- Planner tasks and projects are stored in `localStorage`, not in the task
  collection. The REST task endpoints are implemented, but the current board UI
  does not synchronise with them. This keeps the planner usable offline and is
  the main integration left for a future revision.
- There is no email provider, so password reset links are surfaced in
  development instead of being emailed.
- Two-factor authentication and active-session management were removed from the
  UI because they were not backed by a real implementation.
- The frontend uses a single API base URL and has no offline queue.
- The k6 scripts use fixed local credentials and are intended for a local test
  database only.

## Roadmap

- Synchronise planner tasks with the existing task API.
- Add refresh tokens and logout-all-sessions support.
- Connect an SMTP provider for password reset and reminders.
- Add automated API tests with an in-memory MongoDB instance.
- Add calendar export for scheduled tasks.

## License

MIT
