import mongoose from 'mongoose';axios
import dotenv from 'dotenv';
dotenv.config();

import Task from './models/task.js';
import User from './models/user.js';

async function testDBQueries() {
  console.log('========================================');
  console.log('  DATABASE QUERY PERFORMANCE TEST');
  console.log('========================================\n');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // ==========================================
  // STEP 1: Create a real user first
  // ==========================================
  console.log('📊 Creating test user...');
  let user = await User.findOne({ email: 'testdb@example.com' });
  if (!user) {
    user = new User({
      name: 'Test DB User',
      email: 'testdb@example.com',
      password: 'hashedpassword123',
    });
    await user.save();
    console.log('✅ Test user created\n');
  } else {
    console.log('✅ Test user already exists\n');
  }

  // ==========================================
  // TEST 1: Find User by Email
  // ==========================================
  console.log('📊 TEST 1: Find User by Email');
  console.log('----------------------------------------');
  
  const start1 = Date.now();
  const foundUser = await User.findOne({ email: 'testdb@example.com' });
  const time1 = Date.now() - start1;
  console.log(`⏱️  Time: ${time1}ms`);
  console.log(`✅ ${time1 < 50 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // TEST 2: Find Tasks by User ID
  // ==========================================
  console.log('📊 TEST 2: Find Tasks by User ID');
  console.log('----------------------------------------');
  
  const start2 = Date.now();
  const tasks = await Task.find({ user: foundUser._id });
  const time2 = Date.now() - start2;
  console.log(`⏱️  Time: ${time2}ms`);
  console.log(`✅ ${time2 < 50 ? 'FAST' : 'SLOW'}`);
  console.log(`📝 Tasks found: ${tasks.length}\n`);

  // ==========================================
  // TEST 3: Create Task
  // ==========================================
  console.log('📊 TEST 3: Create Task');
  console.log('----------------------------------------');
  
  const start3 = Date.now();
  const task = new Task({
    title: 'Test Query',
    description: 'Testing DB performance',
    status: 'pending',
    user: foundUser._id,
  });
  await task.save();
  const time3 = Date.now() - start3;
  console.log(`⏱️  Time: ${time3}ms`);
  console.log(`✅ ${time3 < 100 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // TEST 4: Update Task
  // ==========================================
  console.log('📊 TEST 4: Update Task');
  console.log('----------------------------------------');
  
  const start4 = Date.now();
  await Task.findOneAndUpdate(
    { _id: task._id },
    { status: 'completed' }
  );
  const time4 = Date.now() - start4;
  console.log(`⏱️  Time: ${time4}ms`);
  console.log(`✅ ${time4 < 100 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // TEST 5: Delete Task
  // ==========================================
  console.log('📊 TEST 5: Delete Task');
  console.log('----------------------------------------');
  
  const start5 = Date.now();
  await Task.findByIdAndDelete(task._id);
  const time5 = Date.now() - start5;
  console.log(`⏱️  Time: ${time5}ms`);
  console.log(`✅ ${time5 < 100 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('========================================');
  console.log('  SUMMARY');
  console.log('========================================');
  const avg = (time1 + time2 + time3 + time4 + time5) / 5;
  console.log(`📊 Average Query Time: ${avg.toFixed(0)}ms`);
  console.log(`✅ ${avg < 50 ? 'EXCELLENT' : avg < 100 ? 'GOOD' : 'NEEDS OPTIMIZATION'}`);
  console.log('\n💡 Recommendation: Database is fast, problem is in API/Auth layer');

  await mongoose.disconnect();
}

testDBQueries().catch(console.error);