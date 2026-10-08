import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateAvatar,
    markTutorialSeen,
} from '../controllers/UserController.js';
import { protect } from '../middlewares/UserMiddleware.js';
import { uploadAvatarImage } from '../middlewares/localUpload.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public
router.post('/signup', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected — own account only
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, uploadAvatarImage.single('avatar'), updateAvatar);
router.post('/tutorial-seen', protect, markTutorialSeen);


export default router;