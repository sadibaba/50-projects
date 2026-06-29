import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const requestCounter = new Counter('requests');

export const options = {
  stages: [
    // Scenario A: 10 users (warm-up)
    { duration: '30s', target: 10 },
    // Scenario B: 50 users (steady load)
    { duration: '1m', target: 50 },
    // Scenario C: 100 users (peak load - benchmark)
    { duration: '1m', target: 100 },
    // Scenario D: 200+ users (stress test)
    { duration: '1m', target: 200 },
    // Cool down
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
    errors: ['rate<0.05'],            // Less than 5% error rate
  },
};

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'testuser',
  email: `test_${Date.now()}@example.com`,
  password: 'password123',
};

let authToken = '';
let taskId = '';

export function setup() {
  // 1. Register a new user
  const registerRes = http.post(
    `${BASE_URL}/users/register`,
    JSON.stringify(testUser),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(registerRes, {
    'User registered successfully': (r) => r.status === 200 || r.status === 400,
  });

  // 2. Login to get token
  const loginRes = http.post(
    `${BASE_URL}/users/login`,
    JSON.stringify({ email: testUser.email, password: testUser.password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (loginRes.status === 200) {
    const loginData = JSON.parse(loginRes.body);
    authToken = loginData.token;
  }

  return { token: authToken, userEmail: testUser.email };
}

export default function (data) {
  const token = data.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  // ============================
  // 1. CREATE TASK (POST)
  // ============================
  const createPayload = JSON.stringify({
    title: `Task ${Date.now()}`,
    description: 'Test task description',
    status: 'pending',
    deadline: '2026-07-15T00:00:00.000Z',
  });

  const createRes = http.post(
    `${BASE_URL}/tasks`,
    createPayload,
    { headers }
  );

  const createSuccess = check(createRes, {
    'Task created successfully': (r) => r.status === 201,
  });
  errorRate.add(!createSuccess);
  requestCounter.add(1);

  if (createRes.status === 201) {
    const taskData = JSON.parse(createRes.body);
    taskId = taskData._id;
  }

  sleep(0.5);

  // ============================
  // 2. GET TASKS (GET)
  // ============================
  const getRes = http.get(
    `${BASE_URL}/tasks`,
    { headers }
  );

  const getSuccess = check(getRes, {
    'Tasks retrieved successfully': (r) => r.status === 200,
    'Response time under 200ms': (r) => r.timings.duration < 200,
  });
  errorRate.add(!getSuccess);
  requestCounter.add(1);

  sleep(0.5);

  // ============================
  // 3. UPDATE TASK (PUT)
  // ============================
  if (taskId) {
    const updatePayload = JSON.stringify({
      title: `Updated Task ${Date.now()}`,
      status: 'completed',
    });

    const updateRes = http.put(
      `${BASE_URL}/tasks/${taskId}`,
      updatePayload,
      { headers }
    );

    const updateSuccess = check(updateRes, {
      'Task updated successfully': (r) => r.status === 200,
    });
    errorRate.add(!updateSuccess);
    requestCounter.add(1);
  }

  sleep(0.5);

  // ============================
  // 4. DELETE TASK (DELETE)
  // ============================
  if (taskId) {
    const deleteRes = http.del(
      `${BASE_URL}/tasks/${taskId}`,
      null,
      { headers }
    );

    const deleteSuccess = check(deleteRes, {
      'Task deleted successfully': (r) => r.status === 200,
    });
    errorRate.add(!deleteSuccess);
    requestCounter.add(1);
  }

  sleep(0.5);
}

export function teardown(data) {
  // Optional cleanup
  console.log('Load test completed!');
}