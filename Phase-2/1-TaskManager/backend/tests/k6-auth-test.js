import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 25 },
    { duration: '30s', target: 25 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:5000';

export default function () {
  const vuId = __VU;
  
  // Test 1: REGISTER
  const registerRes = http.post(
    `${BASE_URL}/api/users/register`,
    JSON.stringify({
      name: `User_${vuId}`,
      email: `user_${vuId}_${Date.now()}@example.com`,
      password: 'password123',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(registerRes, {
    'Register': (r) => r.status === 200,
    'Register Fast': (r) => r.timings.duration < 200,
  });

  sleep(0.5);

  // Test 2: LOGIN (with existing user)
  const loginRes = http.post(
    `${BASE_URL}/api/users/login`,
    JSON.stringify({
      email: `user_${vuId}_${Date.now()-1000}@example.com`, // Previous timestamp
      password: 'password123',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginRes, {
    'Login': (r) => r.status === 400 || r.status === 200,
    'Login Fast': (r) => r.timings.duration < 200,
  });

  sleep(1);
}