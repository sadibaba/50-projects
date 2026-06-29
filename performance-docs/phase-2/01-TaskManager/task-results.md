# Task Manager API - Performance Testing Documentation

##  Project Overview
A RESTful Task Management API built with Node.js, Express, and MongoDB. Supports user authentication (JWT) and CRUD operations for tasks.

---

##  Test Environment

| Component          | Specification |
|-----------         |---------------|
| **Backend**        | Node.js + Express |
| **Database**       | MongoDB (Mongoose ODM) |
| **Authentication** | JWT + bcryptjs |
| **Load Test Tool** | k6 |
| **Environment**    | Localhost:5000 |

---

##  Test Results Summary

### 1. Load Testing Results

| Scenario          | Users | Duration   | p95 Response   | Status |
|----------         |-------|----------  |--------------  |--------|
| **Warm-up**       | 10    | 30s        | 455ms          |  **PASS** |
| **Steady Load**   | 50    | 1m         | 5.12s (Before) |  **FAIL** |
| **After Indexes** | 50    | 1m         | 5.56s          |  **FAIL** |
| **Max Capacity**  | 20-25 | -          | ~400ms         |  **STABLE** |

**Conclusion:** System handles **20-25 concurrent users** stably.

---

### 2. Database Query Performance

| Query Type         | Time     | Status |
|------------        |------    |--------|
| Find User by Email | 3ms      |  FAST |
| Find Tasks by User | 2ms      |  FAST |
| Create Task        | 3ms      |  FAST |
| Update Task        | 4ms      |  FAST |
| Delete Task        | 3ms      |  FAST |
| **Average**        | **3ms**  |  **EXCELLENT** |

**Indexes Added:**
```javascript
 User: { email: 1 } - UNIQUE (already existed)
Task: { user: 1 } - ADDED
 Task: { user: 1, status: 1 } - ADDED
```

---

### 3. API Endpoint Performance (Single Request)

| Endpoint                | Time              | Status |
|----------               |------             |--------|
| POST /users/register    | 212ms             |  SLOW |
| POST /users/login       | 400 (Bad Request) |  FAIL |
| POST /tasks (with auth) | ~100ms            |  FAST |
| GET /tasks              | ~100ms            |  FAST |
| PUT /tasks/:id          | ~100ms            |  FAST |
| DELETE /tasks/:id       | ~100ms            |  FAST |

**Register Time:** 212ms (bcrypt hash + JWT sign)

---

### 4. Auth vs Tasks Performance

| Component                              | Average Time | Status |
|-----------                             |--------------|--------|
| **Auth Operations** (Register + Login) | 300-500ms |  SLOW |
| **Task Operations** (CRUD)             | 100-200ms |  FAST |
| **Difference**                         | Auth is 2x slower |  ISSUE |

---

### 5. Individual Component Performance

| Component             | Time | Status |
|-----------            |------|--------|
| bcrypt.hash (cost 10) | 73ms |  FAST |
| bcrypt.compare        | 66ms |  FAST |
| JWT.sign              | 2ms |  FAST |
| JWT.verify            | 1ms |  FAST |
| Auth Middleware       | 1-5ms |  FAST |
| Task Auth Middleware  | 1-5ms |  FAST |

---

##  Problem Diagnosis

### Issue 1: 50 Users Load Test Failed 
- **Before:** p95 = 5.12s
- **After Indexes:** p95 = 5.56s (No improvement)
- **Root Cause:** Not database indexes. Problem is at application layer.

### Issue 2: Auth is 2x Slower than Tasks 
- **Auth avg:** 300-500ms
- **Task avg:** 100-200ms
- **Root Cause:** bcrypt.hash (73ms) + JWT operations = CPU blocking

### Issue 3: Concurrency Bottleneck 
- **Single request:** ~100ms (fast)
- **50 concurrent requests:** 5.56s (slow)
- **Root Cause:** Event loop blocking due to synchronous CPU operations

---

##  Performance Comparison

| Metric                | 10 Users | 50 Users | Target |
|--------               |----------|----------|--------|
| **p95 Response Time** | 455ms    | 5.56s    | <500ms |
| **Success Rate**      | 100%     | 100%     | >99% |
| **Avg Response**      | 115ms    | 822ms    | <200ms |
| **Max Users Stable**  |  10      |  50      | 50+ |

---

##  Final Benchmark Results

| Metric            | Result           | Target | Status |
|--------           |--------          |--------|--------|
| Concurrent Users  | 20-25            | 50     |  BELOW TARGET |
| API Response Time | 822ms (50 users) | <200ms |  FAIL |
| Database Query    | 3ms              | <50ms  |  EXCELLENT |
| Auth Time         | 300-500ms        | <200ms |  FAIL |
| Task Time         | 100-200ms        | <200ms |  GOOD |

---

##  Key Learnings

### What Worked
1. **Database** is optimized and fast (2-4ms queries)
2. **Indexes** properly added on User and Task collections
3. **JWT operations** are fast (1-2ms)
4. **Middleware** has minimal overhead (1-5ms)
5. **Single user requests** complete within 100-200ms

### What Failed 
1. **50 concurrent users** cause p95 response of 5.56s
2. **Auth endpoints** are 2x slower than task endpoints
3. **bcrypt.hash** blocks the event loop under load
4. **System fails** when users exceed 25-30 concurrent
5. **Event loop blocking** due to CPU-bound operations

### Root Cause 
**CPU-bound operations (bcrypt.hash + JWT) block the Node.js event loop** when handling concurrent requests. Each request takes ~73ms for bcrypt + 66ms for compare = 139ms of CPU time. With 50 concurrent users, this creates a queue of ~6.5 seconds.

---

##  Before vs After Comparison

| Aspect            | Before Optimization   |  After Indexes |
|--------           |---------------------  |---------------|
| Database Indexes  |  Missing `user` index | Added both indexes |
| Query Time        | Unknown               | 2-4ms (fast) |
| 50 User Load Test | 5.12s                 | 5.56s |
| Improvement       | -                     |  NO IMPROVEMENT |

**Conclusion:** Indexes didn't help because the bottleneck is at the **application layer**, not the database.

---

##  Summary Chart

```
Performance Breakdown (50 Users):
┌────────────────────────────────────────────────────────────┐
│ Database Query    ██░░░░░░░░░░  3ms  (Fast)                │  
│ JWT Operations    ███░░░░░░░░░  5ms  (Fast)                │
│ bcrypt.hash       ████████░░░░  73ms (Medium)              │
│ bcrypt.compare    ███████░░░░░  66ms (Medium)              │
│ Total per req     ████████████  147ms (Fast)               │
│ 50 Users Total    ██████████████████████████  5.56s (FAIL) │
└────────────────────────────────────────────────────────────┘
```

---

##  Testing Tools Used

| Tool | Purpose | Status |
|------|---------|--------|
| k6 | Load Testing |  Active |
| MongoDB Explain | Query Analysis |  Active |
| Custom Scripts | Component Testing |  Active |
| Node.js Built-in | Performance Profiling |  Active |

---

##  Test Files Created

| File                      | Purpose |
|------                     |---------|
| `k6-load-test-fixed.js`   | 10-50 user load tests |
| `k6-find-max-users.js`    | Find max user capacity |
| `k6-auth-test.js`         | Auth-only load test |
| `compare-auth-tasks.js`   | Auth vs Task comparison |
| `test-db-queries.js`      | Database query performance |
| `test-api-endpoints.js`   | Individual endpoint testing |
| `test-bcrypt.js`          | bcrypt cost testing |
| `test-jwt.js`             | JWT performance |
| `test-middleware.js`      | Middleware chain testing |
| `check-indexes.js`        | Database index verification |
| `add-indexes.js`          | Add missing indexes |

---

##  What's Next

### Immediate Improvements Needed
1. **Reduce bcrypt cost** from 10 to 8 (faster hashing)
2. **Implement Redis caching** for JWT tokens
3. **Add connection pooling** for MongoDB
4. **Use async/await properly** to avoid blocking

### Long-term Recommendations
1. **Scale horizontally** with load balancer
2. **Use worker threads** for CPU-bound operations
3. **Implement rate limiting** to prevent overload
4. **Add pagination** for task listing

---

##  Overall Assessment

**Current Status:**  **NEEDS OPTIMIZATION**

| Metric                | Grade |
|--------               |-------|
| Database Performance  | A+ |
| Single User Experience| A- |
| 10 Concurrent Users   | B+ |
| 50 Concurrent Users   | D- |
| Code Quality          | B |
| Overall System        | **C+** |

---

##  Final Word

The system works well for **small-scale usage (20-25 users)** but **fails under load** due to CPU-bound authentication operations. The database is optimized, but the application layer needs improvement.

**Documentation End.** 