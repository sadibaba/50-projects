# Authentication System

A complete JWT authentication flow with role-based access control, a protected
profile page and an administrator dashboard.

## Overview

The project is split into a React client and an Express API. The API stores users
in MongoDB, hashes passwords with bcrypt, issues seven-day JSON Web Tokens and
sets the token in an HTTP-only cookie. The client can also send the token as a
bearer header, which keeps the API usable from tools such as Postman.

## Implemented features

### Authentication

- Registration with name, email and password validation.
- Login with hashed-password verification.
- Seven-day JWT sessions.
- Token delivery through an HTTP-only cookie and a bearer token.
- Logout that clears the cookie and the client session.
- Protected routes on both the API and the React client.
- Automatic redirect to the login page when a request returns `401`.

### Roles

- Two roles: `user` and `admin`.
- The account registered with the email in `ADMIN_EMAIL` becomes an
  administrator.
- Admin-only API routes verify the session and the role on every request.
- The last administrator account cannot be deleted.

### Profile

- Real member-since date from `createdAt`.
- Real last-active date from `lastActiveAt`.
- Account status based on activity in the last seven days.
- Editable name and bio.
- Password change with current-password verification.
- No placeholder or random statistics.

### Admin dashboard

- Total users, administrators, active users and new users in the last 30 days.
- User table with role, activity status, last-active date and join date.
- Server-side search by name or email.
- Server-side pagination with working previous and next controls.
- Account deletion with self-deletion protection.

### API behaviour

- Validation of required fields, email format and password length.
- Consistent JSON error responses.
- CORS restricted through `CORS_ORIGINS`.
- Health endpoint.
- Graceful shutdown.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Cookies | `cookie-parser` |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── AuthContext
│   ├── login / signup / logout
│   ├── current user
│   └── token in localStorage
├── ProtectedRoute
├── Profile page
└── Admin dashboard
        │  /api proxy
        ▼
Express API (5000)
├── /api/auth/signup
├── /api/auth/login
├── /api/auth/logout
├── /api/auth/me
└── /api/auth/admin/*
        │
        ▼
MongoDB: users collection
```

## Project structure

```text
2-Authentication-System/
├── backend/
│   ├── controller/auth.controller.js
│   ├── database/db.js
│   ├── middlewares/auth.middleware.js
│   ├── middlewares/admin.middleware.js
│   ├── middlewares/error.middleware.js
│   ├── models/User.model.js
│   ├── routes/auth.routes.js
│   ├── utils/http.js
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/api/api.js
│   ├── src/api/auth.api.js
│   ├── src/context/AuthContext.js
│   ├── src/components/ProtectedRoute.jsx
│   ├── src/pages/Home.jsx
│   ├── src/pages/Login.jsx
│   ├── src/pages/Signup.jsx
│   ├── src/pages/Profile.jsx
│   └── src/pages/AdminDashboard.jsx
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
# Set MONGO_URI, JWT_SECRET and ADMIN_EMAIL
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

The client starts on `http://localhost:5173`. Vite proxies `/api` to the backend.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | API port |
| `NODE_ENV` | No | `development` | Enables secure cookies in production |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `ADMIN_EMAIL` | No | - | Email that receives the admin role on signup |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed frontend origins |

### Creating the first administrator

1. Set `ADMIN_EMAIL` to the email you intend to use.
2. Start the backend.
3. Register that email through the signup form.
4. The account is created with the `admin` role and the dashboard link appears.

## API summary

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/signup` | No | - | Create an account |
| POST | `/api/auth/login` | No | - | Obtain a JWT |
| POST | `/api/auth/logout` | No | - | Clear the cookie |
| GET | `/api/auth/me` | Bearer | Any | Current profile |
| PUT | `/api/auth/me` | Bearer | Any | Update name and bio |
| PUT | `/api/auth/me/password` | Bearer | Any | Change password |
| GET | `/api/auth/admin/stats` | Bearer | Admin | Dashboard counters |
| GET | `/api/auth/admin/users` | Bearer | Admin | Paginated user list |
| DELETE | `/api/auth/admin/users/:id` | Bearer | Admin | Delete an account |
| GET | `/api/health` | No | - | Health check |

Full request and response examples: [docs/API.md](docs/API.md).

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required, maximum 80 characters |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, bcrypt hash, excluded by default |
| `bio` | String | Optional, maximum 300 characters |
| `role` | Enum | `user` or `admin` |
| `lastActiveAt` | Date | Updated on login |
| `createdAt` | Date | Set by Mongoose timestamps |
| `updatedAt` | Date | Set by Mongoose timestamps |

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

1. Register a normal account and confirm that `/admin` redirects away.
2. Register the `ADMIN_EMAIL` account and confirm that the dashboard opens.
3. Update the profile and verify the new values after a page reload.
4. Change the password, sign out and sign in with the new password.
5. Search and paginate the user list.
6. Delete a user and confirm that self-deletion is rejected.

## Known limitations

- There is no email verification or password-reset flow.
- There is no refresh-token rotation. A stolen seven-day token stays valid until
  it expires.
- Two-factor authentication and session management are not implemented.
- The client stores the token in `localStorage`, so an XSS vulnerability would
  expose it. The HTTP-only cookie is the safer delivery path.
- There is no rate limiting on the authentication endpoints.
- The admin dashboard deletes accounts immediately and without recovery.

## Roadmap

- Add refresh tokens and a token revocation list.
- Add email verification and password reset.
- Add rate limiting and login attempt tracking.
- Add audit logging for administrative actions.
- Add automated API tests.

## License

MIT
