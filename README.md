# 50 Full-Stack Web Development Projects

A public collection of full-stack web development projects built with
JavaScript, TypeScript, React, Next.js, Node.js, Express and MongoDB. The
repository covers e-commerce, social media apps, real-time chat, admin
dashboards, REST APIs, JWT authentication, AI tools and vanilla JavaScript
mini apps.

Every built project has its own README, setup instructions, API notes where
relevant, and an honest statement of what is implemented and what is still
planned.

**24 projects are built.** The remaining roadmap items are marked as planned and
are not presented as complete.

[Browse the built projects](#built-project-highlights) ·
[Project status](#status-at-a-glance) ·
[Contributing](#contributing) ·
[Phase 1](Phase-1/README.md) ·
[Phase 2](Phase-2/README.md) ·
[Phase 3](Phase-3/README.md) ·
[Phase 4](Phase-4/README.md)

## Start here

| If you want to see | Open |
| --- | --- |
| A TypeScript e-commerce store with an admin dashboard | [VoltNest](<Phase-3/3-ECommerce/README.md>) |
| An Instagram-style social app with stories and reels | [Lumen](<Phase-3/2-InstagramClone/README.md>) |
| A Pinterest-style board and pin application | [Pinboard](<Phase-3/1-PinterestClone/README.md>) |
| A MERN task manager with boards and projects | [Task Manager](<Phase-2/1-TaskManager/README.md>) |
| Real-time chat with Socket.IO | [Chat App](<Phase-2/7-chatApp/README.md>) |
| Vanilla JavaScript fundamentals | [Phase 1](Phase-1/README.md) |

## Built project highlights

| Project | What it demonstrates | Stack |
| --- | --- | --- |
| [VoltNest e-commerce](<Phase-3/3-ECommerce/README.md>) | Storefront, cart, coupons, checkout, order tracking, admin dashboard, CSV export | Next.js 16, TypeScript, MongoDB |
| [Lumen Instagram clone](<Phase-3/2-InstagramClone/README.md>) | Feed, stories, reels, profiles, comments, notifications, private accounts | Next.js 16, TypeScript, MongoDB |
| [Pinboard Pinterest clone](<Phase-3/1-PinterestClone/README.md>) | Pins, boards, uploads, profiles, likes, reels | Next.js, Express, MongoDB |
| [Task Manager](<Phase-2/1-TaskManager/README.md>) | Boards, projects, task statistics and profiles | React, Express, MongoDB |
| [Blog Platform](<Phase-2/3-BlogPlatform/README.md>) | Posts, comments, likes, categories, uploads and admin tools | React, Express, MongoDB |
| [Chat App](<Phase-2/7-chatApp/README.md>) | One-to-one messaging and Socket.IO delivery | React, Express, MongoDB, Socket.IO |
| [Social Media Chat](<Phase-2/8-Social-media/README.md>) | Presence, typing indicators and real-time chat | React, Express, Socket.IO |
| [Authentication System](<Phase-2/2-Authentication-System/README.md>) | Signup, login, roles and an admin user manager | React, Express, MongoDB, JWT |

## Topics covered

JavaScript, TypeScript, React, Next.js App Router, Node.js, Express, MongoDB,
Mongoose, REST API design, JWT authentication, role-based authorisation,
Socket.IO, real-time messaging, e-commerce, admin dashboards, social media
applications, file uploads, responsive UI, accessibility, API documentation,
testing and full-stack portfolio projects.

## Contributing

Contributions are welcome: bug fixes, documentation, tests, responsive fixes,
accessibility improvements and new project ideas. You do not need to be an
expert to help.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md).
2. Pick an issue labelled `good first issue` or `documentation`, or open a small
   issue describing what you want to change.
3. Comment on the issue so work is not duplicated.
4. Open a focused pull request with a screenshot for UI changes.

Good first contributions:

- Fix a broken setup command or link in a project README.
- Add a missing `.env.example` entry.
- Improve an empty, loading or error state.
- Fix a mobile layout issue at a specific width.
- Add a unit test for a validator or helper.
- Add alt text, form labels or keyboard navigation.
- Report a bug with exact reproduction steps.

If you are unsure where to start, open an issue and ask. Small, well-tested pull
requests are reviewed faster than large rewrites.

## Status at a glance

| Phase | Built | Scope | Status |
| --- | --- | --- | --- |
| Phase 1 | 13 | Vanilla JavaScript, DOM, public APIs, localStorage | Complete |
| Phase 2 | 8 | React, Express, MongoDB, REST APIs, authentication | Complete |
| Phase 3 | 3 of 24 | Next.js, real-time features, larger full-stack systems | In progress |
| Phase 4 | 0 of 6 | AWS, Docker, microservices | Planned |
| Extra | 1 | AI SEO Analyzer, outside the original numbered list | Built |

## How this repository is built

I use AI assistants, search engines and official documentation while building.
That is how most professional developers work. The important part is the
architecture, the debugging process and the decisions behind each implementation,
and those are documented per project.

Honesty rules for this repository:

- A project is marked built only when it runs and has documentation.
- Planned projects are never listed as complete.
- Known limitations are written down instead of hidden.
- Commands and demo credentials are included where they are useful.

## Phase 1: Vanilla JavaScript

The first phase focuses on fundamentals: DOM APIs, events, localStorage, public
APIs and responsive layouts. Two projects use React and Vite; the rest run as
static HTML with JavaScript.

| # | Project | Main technologies |
| --- | --- | --- |
| 1 | [To-do dashboard](<Phase-1/1-To-do/README.md>) | JavaScript, localStorage, calendar |
| 2 | [Calculator](<Phase-1/2-Calculator/README.md>) | JavaScript, keyboard input |
| 3 | [Quiz web app](<Phase-1/3-Quiz-web/README.md>) | JavaScript, OpenTDB API |
| 4 | [React image gallery](<Phase-1/4-react_Pin/README.md>) | React, Vite, Pixabay API |
| 5 | [Weather dashboard](<Phase-1/5-Weather_web_app/README.md>) | JavaScript, Open-Meteo API |
| 6 | [Quote generator](<Phase-1/6-Quote Generator/README.md>) | JavaScript, DummyJSON |
| 7 | [Currency converter](<Phase-1/7-Currency Converter/README.md>) | JavaScript, exchange-rate API |
| 8 | [Countdown timer](<Phase-1/8-Countdown Timer/README.md>) | JavaScript, Date, localStorage |
| 9 | [Image gallery](<Phase-1/9-Image_Slider/README.md>) | JavaScript, search and keyboard navigation |
| 10 | [Colour picker](<Phase-1/10-colorPicker/README.md>) | JavaScript, colour conversion, clipboard |
| 11 | [Travel blog](<Phase-1/11-Blog/README.md>) | React, Vite, React Router |
| 12 | [Tip calculator](<Phase-1/12-Tip-c/README.md>) | JavaScript, keypad input |
| 13 | [BMI calculator](<Phase-1/13-BMI/README.md>) | JavaScript, unit conversion |

[Phase 1 documentation](Phase-1/README.md)

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

## Phase 3: Advanced full-stack roadmap

The original Phase 3 plan contains 24 projects (27-50). Three are built:
[Pinboard](<Phase-3/1-PinterestClone/README.md>),
[Lumen](<Phase-3/2-InstagramClone/README.md>) and
[VoltNest](<Phase-3/3-ECommerce/README.md>). The rest remain planned work and
are not presented as complete.

| # | Project | Core features | Stack | Status |
| --- | --- | --- | --- | --- |
| 27 | [Pinterest Clone / Pinboard](<Phase-3/1-PinterestClone/README.md>) | Pins, boards, uploads, profiles, likes, notifications, reels | Next.js, Express, MongoDB | Built |
| 28 | [Instagram Clone / Lumen](<Phase-3/2-InstagramClone/README.md>) | Photo feed, stories, reels, profiles, likes, comments, uploads | Next.js, TypeScript, MongoDB | Built |
| 29 | [E-Commerce Website / VoltNest](<Phase-3/3-ECommerce/README.md>) | Cart, checkout, coupons, orders, admin dashboard | Next.js, TypeScript, MongoDB | Built |
| 30 | Admin Dashboard | Analytics, user statistics, charts | React, full-stack | Planned |
| 31 | Social Media App | Profiles, follow, posts | Full-stack, real-time | Planned |
| 32 | Real-Time Chat App | Socket.IO rooms and auth | Next.js, WebSockets | Planned |
| 33 | Video Streaming Platform | Upload, stream, profiles | Full-stack | Planned |
| 34 | Blog with SSR and SSG | SEO, Markdown, dynamic routes | Next.js | Planned |
| 35 | Booking System | Room and restaurant booking, calendar | Full-stack | Planned |
| 36 | LMS Platform | Courses, quizzes, roles | Next.js, full-stack | Planned |
| 37 | Job Board Platform | Job posts, applications, search, admin | Full-stack | Planned |
| 38 | News Aggregator | APIs, categories, saved favourites | Next.js | Planned |
| 39 | Forum / Q&A Platform | Threads, replies, voting | Next.js, full-stack | Planned |
| 40 | Chatbot Interface | AI and rule-based bot | React, backend, real-time | Planned |
| 41 | Portfolio Generator | Form to downloadable static portfolio | Full-stack | Planned |
| 42 | Podcast Platform | Episodes, audio player, admin upload | Full-stack | Planned |
| 43 | Calendar / Planner App | Events, reminders, CRUD | Full-stack | Planned |
| 44 | Crypto Tracker | Live prices, charts, watchlist | Next.js, real-time | Planned |
| 45 | Task Automation Dashboard | Scheduled and automated tasks | Full-stack | Planned |
| 46 | Multi-Tenant SaaS App | Tenant data isolation, billing simulation | Next.js, full-stack | Planned |
| 47 | Fitness Tracker | Workouts, calories, charts | Full-stack | Planned |
| 48 | Chat Rooms with Auth | Public and private rooms | WebSockets | Planned |
| 49 | Calendar Booking with Payment | Slot booking, mock payment | Full-stack | Planned |
| 50 | Image Editing App | Filters, crop, rotate | JavaScript, backend | Planned |

### Phase 3 technology targets

```text
Frontend    Next.js App Router with SSR, SSG and client components
Backend     Node.js and Express
Databases   MongoDB and PostgreSQL
Real-time   Socket.IO / WebSockets
Auth        JWT and session management
Caching     Redis
DevOps      Docker and CI/CD basics
```

The repository also contains [2-AI-SEO-Analyzer-](<Phase-3/2-AI-SEO-Analyzer-/>),
an extra Next.js project that is not part of the original 27-50 list. It is kept
separate from the Phase 3 status table above.

[Phase 3 documentation and status](Phase-3/README.md)

## Phase 4: Cloud and microservices roadmap

Phase 4 is planned. None of these six products is built yet. They are listed so
the direction of the roadmap is explicit.

| # | Product | Focus |
| --- | --- | --- |
| 1 | DevCommerce Hub | Developer e-commerce with collaboration, logging and a developer vault |
| 2 | EduVerse | Learning platform with live classrooms, courses and resource sales |
| 3 | WorkOS | Browser-based workspace OS with teams, vaults and plugins |
| 4 | CloudLab | DevOps playground with container deployment and monitoring |
| 5 | CollabMart | Social commerce with real-time chat and seller tools |
| 6 | CodeVaultX | Developer legacy platform for projects, APIs, logs and templates |

### DevCommerce Hub

A developer-focused e-commerce platform with productivity layers behind the
storefront.

| Surface | Hidden layer |
| --- | --- |
| Product pages | Error log tracker |
| Shopping cart | Developer vault for snippets and templates |
| Order history | Debugging timeline |
| Reviews and ratings | Collaborative knowledge base |

Core scope: catalog, cart, checkout, Stripe/PayPal, AWS S3 images, TeamHub chat
and Kanban, error logging with Winston/Morgan and charts, GraphQL search and
Dockerised deployment.

Stack: React, TypeScript, Tailwind, Node.js, Express, GraphQL, PostgreSQL,
MongoDB, Redis, Socket.IO, Docker, Kubernetes, AWS EC2/S3/RDS/CloudWatch.

### EduVerse

A learning hub for courses, cheat sheets and live coding sessions.

- Real-time classrooms with WebSockets and video integration
- Notes and API documentation vault
- Error logger for teachers to track student issues
- E-commerce for selling courses and resources

Stack: React, Node.js, GraphQL, MongoDB or PostgreSQL, AWS Lambda and S3.

### WorkOS

A cinematic workspace that runs in the browser.

- Team collaboration with chat and boards
- Personal and shared vaults
- Per-project error logger dashboard
- Plugin marketplace

Stack: Next.js, Express, Redis, Docker, Kubernetes, AWS EC2.

### CloudLab

A practice cloud for deploying, monitoring and debugging applications.

- Container deployment with Docker and Kubernetes
- Error logger and monitoring dashboard
- Vault for deployment scripts and cheat sheets
- Marketplace for deployment templates

Stack: React, Node.js, GraphQL, PostgreSQL, AWS CloudWatch and ECS.

### CollabMart

Social commerce combined with team collaboration.

- Product marketplace with SQL and NoSQL data
- Real-time chat and community boards
- Error logger for sellers tracking failed orders
- Seller vault for documenting strategies

Stack: React, Express, MongoDB and PostgreSQL, AWS S3, Stripe.

### CodeVaultX

A developer legacy platform for documenting an entire journey.

- Vault for notes, cheat sheets and API documentation
- Per-project error logger
- Team collaboration
- E-commerce for templates and code snippets

Stack: Next.js, Node.js, GraphQL, MongoDB and PostgreSQL, Docker, AWS.

[Phase 4 documentation](Phase-4/README.md)

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
