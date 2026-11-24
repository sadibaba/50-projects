# Full-Stack Development Journey

A record of the projects I have built while learning full-stack development. The
repository is organised by phase, and each project has its own documentation,
setup instructions and API reference.

## How I work

I use AI assistants, search engines and official documentation while building.
That is how most professional developers work. The important part is the
architecture, the debugging process and the decisions behind each implementation,
and those are documented per project in this repository.

## Roadmap

| Phase | Focus | Status |
| --- | --- | --- |
| Phase 1 | Vanilla JavaScript, DOM, public APIs, localStorage | 13 projects |
| Phase 2 | React, Express, MongoDB, REST APIs, authentication | 8 projects |
| Phase 3 | Next.js, real-time features, larger full-stack systems | In progress |
| Phase 4 | AWS, Docker, microservices | Planned |

## Phase 1: Vanilla JavaScript

The first phase focuses on fundamentals without frameworks.

| # | Project | Main technologies |
| --- | --- | --- |
| 1 | To-do list | JavaScript, localStorage |
| 2 | Calculator | JavaScript |
| 3 | Quiz web app | JavaScript, questions API |
| 4 | React pin board | React, CSS |
| 5 | Weather web app | Public weather API |
| 6 | Quote generator | Quote API |
| 7 | Currency converter | Currency API |
| 8 | Countdown timer | JavaScript, Date |
| 9 | Image slider | JavaScript, CSS |
| 10 | Colour picker | HTML, CSS, JavaScript |
| 11 | Blog frontend | React, static data |
| 12 | Tip calculator | JavaScript |
| 13 | BMI calculator | JavaScript |

## Phase 2: Full-stack applications

Phase 2 is where the full request cycle is practised: React client, Express API,
MongoDB persistence, JWT authentication and REST conventions. Each project below
has a separate README and a `docs` folder.

| # | Project | Description | Stack |
| --- | --- | --- | --- |
| 1 | [Task Manager](<Phase-2/1-TaskManager/README.md>) | Task planner with boards, projects, profiles and task statistics | React, Express, MongoDB |
| 2 | [Authentication System](<Phase-2/2-Authentication-System/README.md>) | Signup, login, roles, profile management and an admin user manager | React, Express, MongoDB, JWT |
| 3 | [Blog Platform](<Phase-2/3-BlogPlatform/README.md>) | Posts, comments, likes, categories, uploads and an admin dashboard | React, Express, MongoDB |
| 4 | [Recipe App](<Phase-2/4-Recipe App/README.md>) | Recipe search through TheMealDB with saved favourites | React, Express, MongoDB |
| 5 | [Movie Browser](<Phase-2/5-movie browser/README.md>) | Movie search through OMDB with watchlists and reviews | React, Express, MongoDB |
| 6 | [Notes App](<Phase-2/6-NotesApp/README.md>) | Notes with tags, tag filtering and account management | React, Express, MongoDB |
| 7 | [Chat App](<Phase-2/7-chatApp/README.md>) | One-to-one messaging with REST history and Socket.IO delivery | React, Express, MongoDB, Socket.IO |
| 8 | [Social Media Chat](<Phase-2/8-Social-media/README.md>) | Real-time chat with online presence and typing indicators | React, Express, MongoDB, Socket.IO |

The Phase 2 index contains the same projects with more detail about what is
implemented and what is intentionally left as future work:

[Phase 2 documentation](Phase-2/README.md)

Some projects from the original learning list, such as the contact book and
GitHub profile viewer, were not built. They are not listed as complete.

## What Phase 2 covers

- REST API design with Express routers, controllers and models
- MongoDB schemas, indexes and data ownership rules
- JWT authentication, password hashing and protected routes
- Role-based authorisation for administrative endpoints
- File uploads for the blog platform
- Real-time messaging with Socket.IO
- Environment-based configuration and `.env.example` files
- Frontend build verification and production builds
- Per-project documentation covering architecture, API and limitations

## Repository structure

```text
50-projects/
├── Phase-1/               Vanilla JavaScript projects
├── Phase-2/               React and Express full-stack projects
│   ├── 1-TaskManager/
│   ├── 2-Authentication-System/
│   ├── 3-BlogPlatform/
│   ├── 4-Recipe App/
│   ├── 5-movie browser/
│   ├── 6-NotesApp/
│   ├── 7-chatApp/
│   ├── 8-Social-media/
│   └── README.md
├── Phase-3/               Next.js and real-time projects
├── Phase-4/               AWS and microservices projects (planned)
├── Production-projects/
└── README.md
```

## Running a project

Every Phase 2 project follows the same pattern:

1. Read the project README.
2. Copy `backend/.env.example` to `backend/.env` and fill in the values.
3. Install dependencies in `backend` and `frontend`.
4. Start MongoDB.
5. Run the API and the React development server in separate terminals.

Each project README lists the exact commands, ports and environment variables.

## Security notes

- No real credentials are committed. The `.env.example` files contain
  placeholders only.
- Uploaded images and local databases are not part of the source code.
- The projects are learning applications, not audited production systems. The
  limitations section of each project README describes the trade-offs.
- See [SECURITY.md](SECURITY.md) for credential-rotation guidance and notes on
  values that appeared in earlier commits.

## License

Released under the [MIT License](LICENSE). Individual project READMEs state
their own license when it differs.
