import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function checkIndexes() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('========================================');
  console.log('  DATABASE INDEXES');
  console.log('========================================\n');
  
  // Check User indexes
  const userIndexes = await mongoose.connection.db
    .collection('users')
    .indexes();
  console.log('📊 User Collection Indexes:');
  userIndexes.forEach(idx => {
    console.log(`   ${JSON.stringify(idx.key)} - ${idx.unique ? 'UNIQUE' : ''}`);
  });
  
  // Check Task indexes
  const taskIndexes = await mongoose.connection.db
    .collection('tasks')
    .indexes();
  console.log('\n📊 Task Collection Indexes:');
  taskIndexes.forEach(idx => {
    console.log(`   ${JSON.stringify(idx.key)}`);
  });
  
  console.log('\n========================================');
  console.log('  RECOMMENDED INDEXES');
  console.log('========================================');
  console.log('✅ User: { email: 1 } (unique) - EXISTS?');
  console.log('✅ Task: { user: 1 } - EXISTS?');
  console.log('✅ Task: { user: 1, status: 1 } - RECOMMENDED');
  
  await mongoose.disconnect();
}

checkIndexes();