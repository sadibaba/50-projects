import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
import User from '../models/user_model.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router