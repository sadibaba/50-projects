import jwt from 'jsonwebtoken';

const payload = { id: '123456789012345678901234' };
const secret = 'testsecret';

console.log('📊 Testing JWT sign...');
const start = Date.now();
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
const time = Date.now() - start;
console.log(`⏱️ Sign time: ${time}ms`);

console.log('\n📊 Testing JWT verify...');
const start2 = Date.now();
jwt.verify(token, secret);
const time2 = Date.now() - start2;
console.log(`⏱️ Verify time: ${time2}ms`);