# Performance Documentation

This folder records the performance work done on the projects in this
repository: load tests, database query analysis, index changes and bundle-size
checks. The goal is to measure behaviour instead of guessing, and to keep a
before-and-after record for each change.

## Folder layout

```text
performance-docs/
├── README.md
└── phase-2/
    ├── 01-TaskManager/
    │   ├── 01-project-Overview.md
    │   ├── backend_final.md
    │   ├── task-results.md
    │   └── tests/
    └── 02-auth-system/
        ├── 01-project-Overview.md
        ├── 02-load-test-results.md
        └── 03-db-query-analysis.md
```

## What is measured

### 1. Load testing

Tools: k6, with the scripts kept next to each project.

Scenarios used during the Task Manager tests:

| Scenario | Virtual users | Purpose |
| --- | --- | --- |
| Baseline | 10 | Confirm the API is stable under light traffic |
| Normal | 50 | Check response time under expected use |
| Target | 100 | Measure the intended capacity |
| Stress | 200 or more | Find the point where the service degrades |

Metrics recorded:

- request duration (average, minimum, maximum, p95)
- failed request rate
- requests per second
- server wait time versus receiving time

The results are stored in each project's `tests/load` folder with the k6 summary
and any screenshots that were captured.

### 2. Database query analysis

For each slow query:

1. Record the query and the collection size.
2. Run `explain("executionStats")`.
3. Check the number of documents examined versus returned.
4. Add or adjust an index.
5. Repeat the measurement and record the difference.

The Task Manager analysis covers the task-by-user and user-by-email lookups. The
Authentication System analysis covers login and user listing queries.

### 3. Bundle size

React production builds are inspected for:

- total JavaScript and CSS size,
- the largest chunks,
- whether route-level lazy loading is working,
- opportunities for code splitting.

### 4. Test coverage

The Blog Platform has a Jest unit suite. The other projects use manual API
checks and build verification. This folder records the checks that were run; it
does not claim coverage that does not exist.

## Record format

Each result document should contain:

- date and environment,
- command used to run the test,
- test data size,
- raw metrics,
- interpretation,
- any change made as a result.

## Current status

| Project | Load test | Query analysis | Bundle check | Automated tests |
| --- | --- | --- | --- | --- |
| Task Manager | Recorded | Recorded | Build verified | No |
| Authentication System | Recorded | Recorded | Build verified | No |
| Blog Platform | Not recorded | Not recorded | Build verified | Unit tests |
| Recipe App | Not recorded | Not recorded | Build verified | No |
| Movie Browser | Not recorded | Not recorded | Build verified | No |
| Notes App | Not recorded | Not recorded | Build verified | No |
| Chat App | Not recorded | Not recorded | Build verified | No |
| Social Media Chat | Not recorded | Not recorded | Build verified | No |

## Reproducing a load test

```bash
# Start the API and MongoDB first
cd Phase-2/1-TaskManager/backend
npm run dev

# In another terminal
cd Phase-2/1-TaskManager/backend/tests
k6 run k6-load-test.js
```

The k6 scripts use `http://localhost:5000` and create test users. Run them
against a development database, never against data you need to keep.
