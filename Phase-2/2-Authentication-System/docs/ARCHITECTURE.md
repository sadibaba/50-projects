# Authentication System Architecture

## Purpose

This project isolates authentication and authorisation from the other Phase 2
applications. It demonstrates password hashing, token issuance, cookie handling,
role checks and administrative user management.

## Request flow

```text
Signup form
  └─ POST /api/auth/signup
       ├─ validate name, email, password
       ├─ hash password with bcrypt
       ├─ assign role from ADMIN_EMAIL
       └─ insert user

Login form
  └─ POST /api/auth/login
       ├─ find user and compare hash
       ├─ update lastActiveAt
       ├─ sign JWT (id, role, 7 days)
       ├─ set HTTP-only cookie
       └─ return token and public user

Protected request
  └─ Authorization: Bearer <token> or cookie
       ├─ verify signature and expiry
       ├─ load the current user from MongoDB
       ├─ attach { id, role } to req.user
       └─ continue to controller
```

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/auth.routes.js` | Endpoint map and middleware order |
| `middlewares/auth.middleware.js` | Token verification and user lookup |
| `middlewares/admin.middleware.js` | Role check |
| `middlewares/error.middleware.js` | Normalised error responses |
| `controller/auth.controller.js` | Validation, password handling and queries |
| `models/User.model.js` | Schema, unique constraints and selected fields |
| `utils/http.js` | `ApiError`, `asyncHandler`, public user shaping |

The authentication middleware reloads the user on every request instead of
trusting the role in the token. This means a role change or deleted account takes
effect immediately, at the cost of one database read per authenticated request.

## Frontend state

`AuthContext` owns:

- the current user,
- the loading state during the initial profile check,
- login, signup and logout actions,
- profile and password updates.

The token is stored in `localStorage`. The Axios request interceptor attaches it
to each request, and the response interceptor removes it and redirects to
`/login` on `401`.

`ProtectedRoute` waits for the initial profile check before deciding whether to
render the page, redirect to login, or redirect away from an admin-only page.

## Admin dashboard data

The dashboard calls two endpoints in parallel:

- `/api/auth/admin/stats` for the four summary cards.
- `/api/auth/admin/users` for the current page of users.

Search is performed on the server, and pagination is part of the response. This
keeps the table correct when the user collection is larger than one page.

## Security decisions

| Decision | Reason |
| --- | --- |
| bcrypt with ten rounds | Slow enough to resist fast offline guessing without excessive login latency |
| Password field `select: false` | Prevents accidental password exposure in queries and responses |
| JWT signature verification | Prevents forged tokens |
| HTTP-only cookie | Removes token access from JavaScript when the cookie path is used |
| Role reload per request | Avoids stale roles in long-lived tokens |
| Generic login error | Does not reveal whether an email is registered |
| Self-deletion guard | Prevents an administrator from locking themselves out |
| Last-admin guard | Keeps at least one administrator account |

## Known weaknesses

- The token is also stored in `localStorage`, which is readable by JavaScript.
  A strict production implementation would use only the HTTP-only cookie and CSRF
  protection.
- There is no refresh-token rotation or revocation list.
- Login attempts are not rate limited.
- There is no email verification, password reset or two-factor authentication.
- Admin actions are not written to an audit log.
- Automated tests are not included; verification is manual plus a production
  build check.

## Why cookies and bearer tokens

The API is used by both the React client and API tools. Returning a bearer token
keeps Postman and curl workflows simple, while the cookie demonstrates the safer
browser pattern. A production application should choose one delivery mechanism
and apply CSRF protection to cookie-based sessions.
