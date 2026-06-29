import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './models/user.js';
import Task from './models/task.js';

const app = express();
app.use(express.json());

// ==========================================
// MIDDLEWARE 1: Auth Middleware (JWT Verify)
// ==========================================
const authMiddleware = (req, res, next) => {
  const start = Date.now();
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ msg: 'No token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    const time = Date.now() - start;
    console.log(`⏱️ Auth Middleware: ${time}ms`);
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};

// ==========================================
// MIDDLEWARE 2: Task Auth (DB Query)
// ==========================================
const taskAuthMiddleware = async (req, res, next) => {
  const start = Date.now();
  try {
    const task = await Task.findById(req.params.id);
    const time = Date.now() - start;
    console.log(`⏱️ Task Auth Middleware (DB): ${time}ms`);
    
    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }
    
    if (task.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// ==========================================
// TEST ENDPOINTS
// ==========================================

// 1. WITHOUT any middleware (baseline)
app.get('/api/test/no-middleware', (req, res) => {
  res.json({ msg: 'No middleware', time: Date.now() });
});

// 2. ONLY auth middleware
app.get('/api/test/auth-only', authMiddleware, (req, res) => {
  res.json({ msg: 'Auth only', user: req.user });
});

// 3. BOTH middlewares
app.get('/api/test/both/:id', authMiddleware, taskAuthMiddleware, (req, res) => {
  res.json({ msg: 'Both middlewares', user: req.user });
});

// ==========================================
// RUN TESTS
// ==========================================
async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB\n');
  
  // Create test user and task
  let user = await User.findOne({ email: 'testmiddleware@example.com' });
  if (!user) {
    user = new User({
      name: 'Test Middleware',
      email: 'testmiddleware@example.com',
      password: await bcrypt.hash('password123', 10),
    });
    await user.save();
    console.log('✅ Test user created');
  }
  
  let task = await Task.findOne({ user: user._id });
  if (!task) {
    task = new Task({
      title: 'Test Task',
      description: 'For middleware testing',
      status: 'pending',
      user: user._id,
    });
    await task.save();
    console.log('✅ Test task created\n');
  }
  
  // Generate token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  console.log('✅ Token generated\n');
  
  // ==========================================
  // TEST 1: No Middleware
  // ==========================================
  console.log('📊 TEST 1: No Middleware');
  console.log('----------------------------------------');
  const start1 = Date.now();
  const res1 = await fetch('http://localhost:5000/api/test/no-middleware');
  const time1 = Date.now() - start1;
  console.log(`⏱️ Total: ${time1}ms`);
  console.log(`✅ ${time1 < 10 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // TEST 2: Auth Only Middleware
  // ==========================================
  console.log('📊 TEST 2: Auth Middleware Only');
  console.log('----------------------------------------');
  const start2 = Date.now();
  const res2 = await fetch('http://localhost:5000/api/test/auth-only', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const time2 = Date.now() - start2;
  console.log(`⏱️ Total: ${time2}ms`);
  console.log(`✅ ${time2 < 50 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // TEST 3: Both Middlewares
  // ==========================================
  console.log('📊 TEST 3: Both Middlewares (Auth + Task Auth)');
  console.log('----------------------------------------');
  const start3 = Date.now();
  const res3 = await fetch(`http://localhost:5000/api/test/both/${task._id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const time3 = Date.now() - start3;
  console.log(`⏱️ Total: ${time3}ms`);
  console.log(`✅ ${time3 < 100 ? 'FAST' : 'SLOW'}\n`);

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('========================================');
  console.log('  MIDDLEWARE PERFORMANCE SUMMARY');
  console.log('========================================');
  console.log(`No Middleware:    ${time1}ms  (baseline)`);
  console.log(`Auth Only:        ${time2}ms  (+${time2 - time1}ms overhead)`);
  console.log(`Both Middlewares: ${time3}ms  (+${time3 - time1}ms overhead)`);
  console.log('\n💡 Middleware overhead: ' + (time2 - time1) + 'ms');

  await mongoose.disconnect();
}

// ==========================================
// START SERVER AND RUN TESTS
// ==========================================
const PORT = 5001;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Test server running on port ${PORT}\n`);
  setTimeout(async () => {
    await runTests();
    server.close();
  }, 1000);
});