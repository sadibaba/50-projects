# Notes App Architecture

## Purpose

The notes app demonstrates authenticated ownership of two related collections.
Every note and every tag belongs to exactly one user, and the API enforces that
boundary on every query.

## Request flow

```text
React client
├── AuthContext
│   ├── token in localStorage
│   ├── login / register / logout
│   ├── profile update
│   └── password change / account deletion
├── NoteContext
│   ├── notes and tags for the current user
│   ├── selected tag filter
│   └── note and tag CRUD
└── Pages: dashboard, notes, profile
        │  Axios with Bearer token
        ▼
Express API
├── protect middleware
├── user controller
├── note controller
├── tag controller
└── MongoDB: users, notes, tags
```

## Ownership model

| Operation | Query scope |
| --- | --- |
| List notes | `{ user: req.user._id }` |
| Read note | `{ _id, user }` |
| Update note | `{ _id, user }` |
| Delete note | `{ _id, user }` |
| List tags | `{ user }` |
| Create tag | duplicate check inside `{ name, user }` |
| Delete tag | `{ _id, user }` |

When a note is created or updated, the submitted tag ids are filtered against the
user's own tags. A tag id belonging to another account is silently discarded
rather than attached to the note.

Deleting a tag removes its id from every note owned by the same user.

## Tag filtering

The client sends the tag name, not the id:

```text
GET /api/notes?tag=backend
```

The controller looks up the tag by name and user, then filters notes by the tag's
object id. This keeps URLs readable while preserving ownership.

## Frontend state

`AuthContext` exposes the token so `NoteContext` can react to authentication
changes. This was a defect in an earlier version: the note provider read a token
that the auth provider did not expose, so notes never loaded. The current
provider exposes `token` and the note provider re-fetches when it changes.

`NoteContext` loads notes and tags after login, re-fetches when the selected tag
changes, and clears both lists on logout.

## Rich-text handling

Notes are authored with React Quill and stored as HTML. The card list strips tags
with a regular expression and displays a plain-text preview. The editor view uses
the stored HTML.

The server does not currently sanitise the HTML. A production implementation
should sanitise on write, not only on display, and should render with a vetted
sanitizer on read.

## Database indexes

| Collection | Index | Reason |
| --- | --- | --- |
| users | `{ email: 1 }` unique | Login |
| users | `{ username: 1 }` unique | Profile and duplicate check |
| tags | `{ user: 1 }` | List a user's tags |
| tags | `{ user: 1, name: 1 }` unique | Prevent duplicate tags per user |
| notes | `{ user: 1 }` from query | List a user's notes |

## Trade-offs

- The API returns every note for a user. Pagination is future work.
- Search uses a regular expression rather than a text index.
- Rich text is stored as HTML, which requires careful sanitisation.
- No password reset or email verification.
- No automated tests.

## Failure handling

| Failure | Behaviour |
| --- | --- |
| Missing or invalid token | `401` |
| Note not found or owned by another user | `404` |
| Empty title or content | `400` |
| Duplicate tag for the user | `409` |
| Invalid tag id | Ignored |
| MongoDB unavailable at startup | Process exits |
| Rate limit exceeded | `429` |
