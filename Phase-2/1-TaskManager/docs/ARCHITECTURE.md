# Task Manager Architecture

## Purpose

The project demonstrates a complete authentication and account flow next to a
local-first planning interface. The API is the source of truth for identity,
profile data and task statistics. The board is deliberately client-side so it
remains usable without a network connection.

## High-level design

```text
React client
├── Auth pages ───────────────► /api/users/register, /api/users/login
├── Account page ─────────────► /api/users/profile, /api/users/stats
├── Planner board ────────────► localStorage
└── Project cards ────────────► localStorage
                                      │
                                      ▼
Express API
├── auth middleware (JWT)
├── user controller
├── task controller
├── error middleware
└── Mongoose models
                                      │
                                      ▼
                                   MongoDB
```

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/` | Map HTTP methods and paths to controllers |
| `middlewares/auth.js` | Verify the bearer token and attach `req.userId` |
| `middlewares/error.js` | Convert thrown errors into a consistent JSON response |
| `controllers/` | Validate input, call models and shape responses |
| `models/` | Mongoose schemas, indexes and constraints |
| `utils/http.js` | `ApiError` and `asyncHandler` helpers |

Controllers throw `ApiError` for expected failures. `asyncHandler` forwards
rejected promises to the Express error middleware, which normalises Mongoose
validation errors, cast errors and duplicate-key errors.

## Authentication flow

1. A user registers. The password is hashed with bcrypt using twelve rounds.
2. The API signs a JWT with the user id and a seven-day expiry.
3. The client stores the token in `localStorage` (keep me signed in) or
   `sessionStorage` (session only).
4. Axios adds `Authorization: Bearer <token>` to every request.
5. A `401` response clears the session and redirects to the login page.

Password reset uses a different token:

1. `POST /users/forgot-password` generates 32 random bytes.
2. Only the SHA-256 hash is stored, together with a 15-minute expiry.
3. The raw token is placed in the reset URL.
4. `POST /users/reset-password` hashes the supplied token, finds a matching
   non-expired record and replaces the password.

## Frontend structure

| Area | Location |
| --- | --- |
| Routes | `src/App.jsx` |
| Session helpers | `src/api/axios.js` |
| Auth forms | `src/components/authForm.jsx`, `ForgotPasswordForm.jsx` |
| Planner | `src/pages/Home.jsx`, `components/PlannerPanel.jsx`, `PlannerTodo.jsx` |
| Projects | `src/components/ProjectCard.jsx` |
| Account | `src/pages/Profile.jsx` |

The account page is a single tabbed view. It loads the profile and statistics in
parallel, then updates them through the API. The export action collects the
profile, statistics, task list and local projects into one JSON file.

## Data ownership

Every task query includes `user: req.userId`. Update and delete operations use a
compound filter (`_id` plus `user`) so a valid session cannot modify another
user's task. Profile endpoints only ever read or write `req.userId`.

## Why the planner is local-first

The original planner was built before the API. Moving it to the server would
require a migration path for existing browser data and conflict handling for
offline edits. Rather than presenting a half-synchronised board as complete, the
current implementation keeps planner state in `localStorage` and documents the
task API as an available, tested backend surface. The next iteration should:

1. Add server ids to planner items.
2. Push local changes when online.
3. Reconcile conflicts using `updatedAt`.
4. Keep a local cache for offline use.

## Database indexes

| Collection | Index | Reason |
| --- | --- | --- |
| users | `{ email: 1 }` unique | Login and registration lookups |
| tasks | `{ user: 1 }` | List all tasks for a user |
| tasks | `{ user: 1, status: 1 }` | Filtered task lists and statistics |

## Trade-offs

- **Single access token.** There is no refresh-token rotation. A seven-day
  token keeps the learning scope focused on the core flow.
- **No email provider.** The reset link is returned in development. Production
  deployments must connect SMTP and stop returning the link.
- **No refresh on every mutation.** The client trusts optimistic UI state and
  shows a message if a request fails.
- **No automated API tests.** The repository includes syntax checks, a frontend
  build and k6 load scripts, but not a database-backed integration suite.

## Failure handling

| Failure | Behaviour |
| --- | --- |
| Invalid or expired token | `401`, client clears the session |
| Validation error | `400` with the first human-readable message |
| Duplicate email | `409` |
| Task not found or owned by another user | `404` |
| MongoDB unavailable at startup | Process exits with a clear error |
| Unhandled controller error | `500` with a generic message |
