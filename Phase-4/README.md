# Phase 4: Cloud and Microservices

Phase 4 is planned. It is the AWS and microservices phase: containerised services,
cloud deployment, CI/CD, observability and multi-tenant data.

None of the six products in this phase is built yet. They are documented here so
the scope is explicit and can be tracked as work begins.

## Planned products

| # | Product | Focus | Main stack |
| --- | --- | --- | --- |
| 1 | DevCommerce Hub | Developer-focused e-commerce with team tools, logging and a vault | React, Node.js, GraphQL, PostgreSQL, MongoDB, Redis, Docker, AWS |
| 2 | EduVerse | Learning platform with live classrooms and course sales | React, Node.js, GraphQL, MongoDB, PostgreSQL, AWS Lambda, S3 |
| 3 | WorkOS | Browser-based workspace OS with teams, vaults and plugins | Next.js, Express, Redis, Docker, Kubernetes, AWS EC2 |
| 4 | CloudLab | DevOps playground for deploying and monitoring containers | React, Node.js, GraphQL, PostgreSQL, AWS CloudWatch, ECS |
| 5 | CollabMart | Social commerce with chat and seller tools | React, Express, MongoDB, PostgreSQL, AWS S3, Stripe |
| 6 | CodeVaultX | Developer legacy platform for projects, APIs, logs and templates | Next.js, Node.js, GraphQL, MongoDB, PostgreSQL, Docker, AWS |

## 1. DevCommerce Hub

A storefront with a developer workspace behind it.

| Surface | Hidden layer |
| --- | --- |
| Product pages | Error log tracker |
| Shopping cart | Developer vault for snippets and templates |
| Order history | Debugging timeline |
| Reviews and ratings | Collaborative knowledge base |

Core scope:

- Catalog, cart, checkout, Stripe/PayPal and S3 image storage
- TeamHub chat and Kanban boards with role-based access
- Error logger with Winston/Morgan, charts, Slack and email alerts
- Developer vault with notes, cheat sheets, GraphQL search and Markdown editing
- Dockerised services, GitHub Actions and AWS deployment

## 2. EduVerse

A learning hub for courses, cheat sheets and live coding sessions.

- Real-time classrooms with WebSockets and video integration
- Notes and API documentation vault
- Error logger for teachers to track student issues
- E-commerce for courses and resources

## 3. WorkOS

A cinematic workspace that runs inside the browser.

- Team chat and boards
- Personal and shared vaults
- Per-project error logger dashboard
- Plugin marketplace

## 4. CloudLab

A practice cloud for deploying, monitoring and debugging applications.

- Docker and Kubernetes deployment
- Error logger and monitoring dashboard
- Deployment scripts and cheat-sheet vault
- Marketplace for deployment templates

## 5. CollabMart

Social commerce combined with team collaboration.

- Product marketplace with SQL and NoSQL data
- Real-time chat and community boards
- Error logger for sellers tracking failed orders
- Seller vault for documenting strategies

## 6. CodeVaultX

A developer legacy platform for documenting an entire journey.

- Vault for notes, cheat sheets and API documentation
- Per-project error logger
- Team collaboration
- E-commerce for templates and code snippets

## Scope note

This folder is a roadmap, not a claim of completed work. Each product will get its
own implementation and README when it is built.
