import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const vuId = __VU;
  const email = `user_${vuId}_${Date.now()}@example.com`;

  // ==========================================
  // AUTH ENDPOINTS (Register + Login)
  // ==========================================
  console.log('🔐 AUTH TEST');
  
  const regRes = http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify({ name: `User_${vuId}`, email, password: 'pass123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  check(regRes, { 'Auth Register': (r) => r.status === 200 });
  const authTime = regRes.timings.duration;

  const loginRes = http.post(
    `${BASE_URL}/api/users/login`,
    JSON.stringify({ email, password: 'pass123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  check(loginRes, { 'Auth Login': (r) => r.status === 200 });
  const authTime2 = loginRes.timings.duration;

  sleep(1);

  // ==========================================
  // TASK ENDPOINTS (Create + Get + Delete)
  // ==========================================
  console.log('📝 TASK TEST');
  
  const token = JSON.parse(loginRes.body).token;
  
  const createRes = http.post(
    `${BASE_URL}/api/tasks`,
    JSON.stringify({ title: 'Test', description: 'Test', status: 'pending' }),
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
  );
  check(createRes, { 'Task Create': (r) => r.status === 201 });
  const taskTime = createRes.timings.duration;

  const getRes = http.get(
    `${BASE_URL}/api/tasks`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  check(getRes, { 'Task Get': (r) => r.status === 200 });
  const taskTime2 = getRes.timings.duration;

  // RESULTS
  console.log(`\n📊 Auth Avg: ${(authTime + authTime2)/2}ms`);
  console.log(`📊 Task Avg: ${(taskTime + taskTime2)/2}ms`);
  console.log(`📈 Difference: ${Math.abs(authTime - taskTime)}ms\n`);
}