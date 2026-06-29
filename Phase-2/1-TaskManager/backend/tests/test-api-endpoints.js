import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function testEndpoints() {
  console.log('========================================');
  console.log('  API ENDPOINT PERFORMANCE TEST');
  console.log('========================================\n');

  // 1. REGISTER
  console.log('📊 1. POST /users/register');
  const start1 = Date.now();
  const regRes = await axios.post(`${BASE_URL}/users/register`, {
    name: 'TestUser',
    email: `test_${Date.now()}@example.com`,
    password: 'password123',
  });
  const time1 = Date.now() - start1;
  console.log(`   Status: ${regRes.status}`);
  console.log(`   Time: ${time1}ms`);
  console.log(`   ✅ ${time1 < 200 ? 'FAST' : 'SLOW'}\n`);
  token = regRes.data.token;

  // 2. LOGIN
  console.log('📊 2. POST /users/login');
  const start2 = Date.now();
  const loginRes = await axios.post(`${BASE_URL}/users/login`, {
    email: 'test@example.com',
    password: 'password123',
  });
  const time2 = Date.now() - start2;
  console.log(`   Status: ${loginRes.status}`);
  console.log(`   Time: ${time2}ms`);
  console.log(`   ✅ ${time2 < 200 ? 'FAST' : 'SLOW'}\n`);

  // 3. CREATE TASK (with auth)
  console.log('📊 3. POST /tasks (with auth)');
  const start3 = Date.now();
  const taskRes = await axios.post(
    `${BASE_URL}/tasks`,
    { title: 'Test API', description: 'Testing', status: 'pending' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const time3 = Date.now() - start3;
  console.log(`   Status: ${taskRes.status}`);
  console.log(`   Time: ${time3}ms`);
  console.log(`   ✅ ${time3 < 200 ? 'FAST' : 'SLOW'}\n`);
  const taskId = taskRes.data._id;

  // 4. GET TASKS
  console.log('📊 4. GET /tasks');
  const start4 = Date.now();
  const getRes = await axios.get(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const time4 = Date.now() - start4;
  console.log(`   Status: ${getRes.status}`);
  console.log(`   Time: ${time4}ms`);
  console.log(`   ✅ ${time4 < 200 ? 'FAST' : 'SLOW'}`);
  console.log(`   Tasks: ${getRes.data.length}\n`);

  // 5. UPDATE TASK
  console.log('📊 5. PUT /tasks/:id');
  const start5 = Date.now();
  const updateRes = await axios.put(
    `${BASE_URL}/tasks/${taskId}`,
    { status: 'completed' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const time5 = Date.now() - start5;
  console.log(`   Status: ${updateRes.status}`);
  console.log(`   Time: ${time5}ms`);
  console.log(`   ✅ ${time5 < 200 ? 'FAST' : 'SLOW'}\n`);

  // 6. DELETE TASK
  console.log('📊 6. DELETE /tasks/:id');
  const start6 = Date.now();
  const delRes = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const time6 = Date.now() - start6;
  console.log(`   Status: ${delRes.status}`);
  console.log(`   Time: ${time6}ms`);
  console.log(`   ✅ ${time6 < 200 ? 'FAST' : 'SLOW'}\n`);

  // SUMMARY
  console.log('========================================');
  console.log('  SUMMARY');
  console.log('========================================');
  const avg = (time1 + time2 + time3 + time4 + time5 + time6) / 6;
  console.log(`Average Response: ${avg.toFixed(0)}ms`);
  console.log(`✅ ${avg < 200 ? 'GOOD' : 'NEEDS OPTIMIZATION'}`);
}

testEndpoints().catch(console.error);