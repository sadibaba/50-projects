#  Performance Docs

> **What is this folder?**
> This folder contains the complete performance, optimization, and testing documentation for all projects in this repository. Writing code is not enough — a good developer also knows **how fast their code runs, how much load it can handle, and how to make it better.**

---

##  Folder Structure

```
performance-docs/
├── README.md          ← You are here
├── phase-2/           ← React projects (ongoing)
│   └── ...
├── phase-3/           ← Next.js projects (upcoming)
│   └── ...
```

> **Note:** As new phases are added (Phase 4 — AWS, Phase 5 — and beyond), their folders will be added here as well.

---

##  What Do We Test?

For every project, we measure **4 things**:

### 1.  Load Testing — How Many Users Can It Handle?
We check what happens when a large number of users access the application at the same time:
- **Target:** Stay stable under 100 concurrent users
- **Acceptable response time:** Under 200ms
- **Tool:** [k6](https://k6.io/) (free & open source)

```
Scenario A →  10 users  → Application must be perfectly stable
Scenario B →  50 users  → Response time must stay under 200ms
Scenario C → 100 users  → Maximum target — this is our benchmark
Scenario D → 200+ users → Stress test — see where it breaks
```

### 2.  Database Query Optimization
Slow database queries are the biggest cause of a slow application. We:
- Identify slow queries
- Diagnose them using `EXPLAIN ANALYZE`
- Add indexes where needed
- Compare Before & After response times

**Target:** No query should take longer than 50ms

### 3.  Bundle Size & Module Performance
In React/Next.js, a larger bundle means slower loading. We check:
- Total JS bundle size
- Where lazy loading has been applied
- Whether code splitting is working effectively
- Lighthouse score (Performance, Accessibility, SEO)

**Target:** Lighthouse Performance score of 85+

### 4.  Testing Coverage
We test at three levels:

| Test Type         | Tool                | What It Tests 
|-----------        |------               |---------------
| Unit Tests        | Vitest / Jest       | Individual functions & components 
| Integration       | Supertest           | API endpoints 
| E2E | Playwright  | Complete user flows |

**Target:** 70%+ test coverage on core features

---

##  Overall Benchmark Targets

| Metric                | Minimum Acceptable | Good     | Excellent 
|--------               |--------------------|------    |-----------
| Concurrent Users      | 50                 | 100      | 200+ 
| API Response Time     | < 500ms            | < 200ms  | < 100ms 
| Page Load Time        | < 3s               | < 1.5s   | < 1s 
| Lighthouse Score      | 70+                | 85+      | 95+ 
| Test Coverage         | 50%                | 70%      | 90%+ 
| Bundle Size (JS)      | < 500KB            | < 300KB  | < 150KB 

---

##  Phases Overview

###  Phase 1 — Vanilla JS (HTML, CSS, JavaScript)
No performance docs — this phase was purely for learning fundamentals. All projects were static pages with no backend.

###  Phase 2 — React (Current & Ongoing)
Optimization docs for React projects can be found here:
 [`phase-2/`](./phase-2/)

Focus areas:
- Component re-render optimization (React.memo, useMemo, useCallback)
- API call caching
- Bundle size reduction
- Load testing results

###  Phase 3 — Next.js (Upcoming)
Docs for Next.js projects will be added here:
 [`phase-3/`](./phase-3/)

Focus areas:
- SSR vs SSG vs ISR comparison
- Server Components performance
- Image optimization (next/image)
- Edge functions vs serverless latency

---

##  Tools We Use

| Tool                    | Purpose                                 | Link | Status |
|------                   |---------                                |-------|--------|
| k6                      | Load testing                            | [k6.io](https://k6.io) |  Active |
| Lighthouse              | Performance audit                       | Chrome DevTools (built-in) |  Active |
| Webpack Bundle Analyzer | Bundle size analysis                    | [npm](https://www.npmjs.com/package/webpack-bundle-analyzer) |  Active 
| Vitest | Unit testing   | [vitest.dev](https://vitest.dev)        |  Active 
| Playwright | E2E testing| [playwright.dev](https://playwright.dev)|  Active 
| React DevTools Profiler | Component performance | Chrome extension|  Active 

> **Note:** This tools list will be updated as the project grows. If a new tool is adopted in any phase, it will be added here with its purpose, link, and the phase it was introduced in.

---

##  How to Read These Docs

Inside each phase folder, every project has its own markdown file:

```
phase-2/
├── 01-todo-app.md
├── 02-auth-system.md
└── 03-dashboard.md
```

Each file follows this structure:

1. **Project Overview** — What was built
2. **Load Test Results** — How many users it handled
3. **DB Query Analysis** — Before/After query time
4. **Bundle Size Report** — Lighthouse score
5. **Test Coverage** — What was tested
6. **Key Learnings** — What was learned during optimization
7. **What's Next** — What can still be improved

---

##  Why This Matters

> A junior developer writes code.
> A mid-level developer writes working code.
> A senior developer writes **fast, tested, and scalable** code — and keeps **proof** of it.

This documentation is that proof. 

---

*Last Updated: June 2026 | Maintained by [@sadibaba](https://github.com/sadibaba)*