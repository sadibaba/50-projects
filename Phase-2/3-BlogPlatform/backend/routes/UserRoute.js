import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/UserController.js';
import { protect } from '../middlewares/UserMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;