# Phase 2: Full-Stack Applications

Phase 2 moves from browser-only JavaScript to complete applications: a React
client, an Express API and MongoDB persistence. Every project has its own README,
API reference and architecture notes.

## Projects

| # | Project | Scope | API | Database |
| --- | --- | --- | --- | --- |
| 1 | [Task Manager](<1-TaskManager/README.md>) | Task planner, projects, profile, statistics, password reset | Express, port 5000 | MongoDB |
| 2 | [Authentication System](<2-Authentication-System/README.md>) | Signup, login, roles, profile, admin user manager | Express, port 5000 | MongoDB |
| 3 | [Blog Platform](<3-BlogPlatform/README.md>) | Posts, comments, likes, categories, uploads, dashboard | Express, port 5000 | MongoDB |
| 4 | [Recipe App](<4-Recipe App/README.md>) | Recipe search, filters, saved favourites | Express, port 5000 | MongoDB |
| 5 | [Movie Browser](<5-movie browser/README.md>) | Movie search, details, watchlist, reviews | Express, port 5000 | MongoDB |
| 6 | [Notes App](<6-NotesApp/README.md>) | Notes, tags, filtering, account settings | Express, port 5000 | MongoDB |
| 7 | [Chat App](<7-chatApp/README.md>) | One-to-one chat, history, Socket.IO delivery | Express, port 5000 | MongoDB |
| 8 | [Social Media Chat](<8-Social-media/README.md>) | Real-time chat, presence, typing indicators | Express, port 3000 | MongoDB |

## Shared conventions

- **Runtime:** Node.js 18 or newer.
- **Database:** MongoDB 6 or newer, running locally or on Atlas.
- **Environment:** every backend has an `.env.example`. Copy it to `.env`; the
  example files contain no real credentials.
- **Ports:** the React apps run on `5173`. The APIs use `5000`, except the chat
  project in `8-Social-media`, which uses `3000` for both HTTP and Socket.IO.
- **Authentication:** JWT bearer tokens are used by projects 1, 2, 3, 6 and 7.
  Projects 4 and 5 identify an anonymous client with an `x-client-id` header.
- **Documentation:** each project contains:
  - `README.md`: overview, setup, features, limitations
  - `docs/API.md`: endpoint reference with request and response examples
  - `docs/ARCHITECTURE.md`: data flow, decisions and trade-offs

## Quick start

```bash
# Example: start the backend
cd 1-TaskManager/backend
cp .env.example .env
npm install
npm run dev

# In a second terminal, start the frontend
cd 1-TaskManager/frontend
npm install
npm run dev
```

The exact environment variables and commands are listed in each project README.

## Status definitions

- **Implemented**: the feature exists in the code and is reachable from the UI or
  API.
- **Documented limitation**: the feature is intentionally out of scope and is
  listed in the project README rather than presented as complete.
- **Roadmap**: a possible extension, not part of the current implementation.

## Verification checklist

For each project, the following checks are expected to pass:

```bash
cd backend && node --check server.js
cd frontend && npm run build
```

The Blog Platform additionally includes unit tests:

```bash
cd 3-BlogPlatform/backend
npm test
```

Database-backed endpoints require a running MongoDB instance and a filled `.env`
file.

## What is intentionally not here

- There is no shared authentication service between projects; each project owns
  its own user collection. This keeps the projects independent for learning.
- There is no Docker or CI configuration in Phase 2. Those topics belong to
  Phase 4.
- Some projects keep certain data in the browser (for example, planner state in
  the Task Manager). This is documented in the relevant README rather than
  hidden behind a backend claim.
