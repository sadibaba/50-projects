import bcrypt from 'bcryptjs';

async function testBcrypt() {
  const password = 'password123';
  
  console.log('📊 Testing bcrypt with cost 10...');
  const start = Date.now();
  const hash = await bcrypt.hash(password, 10);
  const time = Date.now() - start;
  console.log(`⏱️ Hash time: ${time}ms`);
  console.log(`✅ ${time < 100 ? 'FAST' : 'SLOW'}`);
  
  console.log('\n📊 Testing bcrypt compare...');
  const start2 = Date.now();
  await bcrypt.compare(password, hash);
  const time2 = Date.now() - start2;
  console.log(`⏱️ Compare time: ${time2}ms`);
}

testBcrypt();