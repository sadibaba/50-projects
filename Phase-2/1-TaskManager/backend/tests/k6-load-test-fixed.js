import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Start with 5 users
    { duration: '20s', target: 10 },  // Ramp to 10 users
    { duration: '30s', target: 10 },  // Stay at 10 users
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failed
  },
};

const BASE_URL = 'http://localhost:5000';

// Create a unique user for each VU
function getTestUser(vuId) {
  return {
    name: `TestUser_${vuId}`,
    email: `test_${vuId}_${Date.now()}@example.com`,
    password: 'password123',
  };
}

export default function () {
  const vuId = __VU; // Virtual User ID
  const user = getTestUser(vuId);
  
  let token = '';
  let taskId = '';

  // ============================================
  // STEP 1: REGISTER USER
  // ============================================
  const registerRes = http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify(user),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const registerCheck = check(registerRes, {
    ' User registered successfully': (r) => r.status === 200,
  });

  if (!registerCheck) {
    console.log(` Registration failed for ${user.email}: ${registerRes.status}`);
    sleep(1);
    return; // Skip this iteration if registration failed
  }

  // Store token from registration response
  try {
    const regData = JSON.parse(registerRes.body);
    token = regData.token;
  } catch (e) {
    console.log('❌ Failed to parse registration response');
    sleep(1);
    return;
  }

  // ============================================
  // STEP 2: CREATE TASK
  // ============================================
  const taskPayload = {
    title: `Task for ${user.name}`,
    description: 'This is a test task',
    status: 'pending',
    deadline: '2026-07-15T00:00:00.000Z',
  };

  const createRes = http.post(
    `${BASE_URL}/api/tasks`,
    JSON.stringify(taskPayload),
    { 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      } 
    }
  );

  const createCheck = check(createRes, {
    ' Task created successfully': (r) => r.status === 201,
  });

  if (createCheck) {
    try {
      const taskData = JSON.parse(createRes.body);
      taskId = taskData._id;
    } catch (e) {
      console.log('❌ Failed to parse task creation response');
    }
  }

  sleep(0.5);

  // ============================================
  // STEP 3: GET ALL TASKS
  // ============================================
  const getRes = http.get(
    `${BASE_URL}/api/tasks`,
    { 
      headers: { 
        'Authorization': `Bearer ${token}`,
      } 
    }
  );

  check(getRes, {
    ' Tasks retrieved successfully': (r) => r.status === 200,
    ' Response time under 200ms': (r) => r.timings.duration < 200,
  });

  sleep(0.5);

  // ============================================
  // STEP 4: UPDATE TASK (if task was created)
  // ============================================
  if (taskId) {
    const updatePayload = {
      title: `Updated Task for ${user.name}`,
      status: 'completed',
    };

    const updateRes = http.put(
      `${BASE_URL}/api/tasks/${taskId}`,
      JSON.stringify(updatePayload),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        } 
      }
    );

    check(updateRes, {
      ' Task updated successfully': (r) => r.status === 200,
    });
  }

  sleep(0.5);

  // ============================================
  // STEP 5: DELETE TASK (if task was created)
  // ============================================
  if (taskId) {
    const deleteRes = http.del(
      `${BASE_URL}/api/tasks/${taskId}`,
      null,
      { 
        headers: { 
          'Authorization': `Bearer ${token}`,
        } 
      }
    );

    check(deleteRes, {
      ' Task deleted successfully': (r) => r.status === 200,
    });
  }

  sleep(1);
}

// Setup function runs once before all VUs
export function setup() {
  console.log(' Starting load test with 10 users...');
  return { startTime: Date.now() };
}

// Teardown function runs once after all VUs
export function teardown(data) {
  console.log(' Load test completed!');
}