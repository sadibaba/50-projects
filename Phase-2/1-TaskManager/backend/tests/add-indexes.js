import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function addIndexes() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  // Add index on Task.user
  console.log('📊 Adding index on Task.user...');
  await mongoose.connection.db.collection('tasks').createIndex(
    { user: 1 },
    { name: 'user_index' }
  );
  console.log('✅ Task.user index added\n');

  // Add compound index on Task.user and status (for filtered queries)
  console.log('📊 Adding compound index on Task.user and Task.status...');
  await mongoose.connection.db.collection('tasks').createIndex(
    { user: 1, status: 1 },
    { name: 'user_status_index' }
  );
  console.log('✅ Task.user + status compound index added\n');

  // Verify indexes
  console.log('📊 Updated Task Collection Indexes:');
  const indexes = await mongoose.connection.db.collection('tasks').indexes();
  indexes.forEach(idx => {
    console.log(`   ${JSON.stringify(idx.key)} - ${idx.name}`);
  });

  console.log('\n✅ Indexes added successfully!');
  await mongoose.disconnect();
}

addIndexes().catch(console.error);