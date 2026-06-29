import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Start 10
    { duration: '20s', target: 10 },   // Hold 10
    { duration: '10s', target: 20 },   // Ramp to 20
    { duration: '20s', target: 20 },   // Hold 20
    { duration: '10s', target: 30 },   // Ramp to 30
    { duration: '20s', target: 30 },   // Hold 30
    { duration: '10s', target: 40 },   // Ramp to 40
    { duration: '20s', target: 40 },   // Hold 40
    { duration: '10s', target: 50 },   // Ramp to 50
    { duration: '20s', target: 50 },   // Hold 50
    { duration: '10s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Fail if >500ms
    http_req_failed: ['rate<0.05'],   // Fail if >5% errors
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const vuId = __VU;
  const user = {
    name: `User_${vuId}`,
    email: `user_${vuId}_${Date.now()}@example.com`,
    password: 'password123',
  };

  let token = '';
  let taskId = '';

  // REGISTER
  const regRes = http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify(user),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const regCheck = check(regRes, { 'Register': (r) => r.status === 200 });

  if (!regCheck) {
    console.log(`❌ Register failed at ${__VU} users`);
    sleep(1);
    return;
  }

  token = JSON.parse(regRes.body).token;

  // CREATE TASK
  const createRes = http.post(
    `${BASE_URL}/api/tasks`,
    JSON.stringify({ title: `Task ${Date.now()}`, description: 'Test', status: 'pending' }),
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
  );

  const createCheck = check(createRes, { 'Create': (r) => r.status === 201 });

  if (createCheck) {
    taskId = JSON.parse(createRes.body)._id;
  }

  sleep(0.3);

  // GET TASKS
  const getRes = http.get(
    `${BASE_URL}/api/tasks`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  check(getRes, { 
    'Get': (r) => r.status === 200,
    'Fast': (r) => r.timings.duration < 200 
  });

  sleep(0.3);

  // UPDATE
  if (taskId) {
    const updateRes = http.put(
      `${BASE_URL}/api/tasks/${taskId}`,
      JSON.stringify({ status: 'completed' }),
      { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
    );
    check(updateRes, { 'Update': (r) => r.status === 200 });
  }

  sleep(0.3);

  // DELETE
  if (taskId) {
    const delRes = http.del(
      `${BASE_URL}/api/tasks/${taskId}`,
      null,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    check(delRes, { 'Delete': (r) => r.status === 200 });
  }

  sleep(1);
}