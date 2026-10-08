import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateAvatar,
    getUserByUsername,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from '../controllers/UserController.js';
import { protect } from '../middlewares/UserMiddleware.js';
import { uploadAvatarImage } from '../middlewares/localUpload.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public
router.post('/signup', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// Protected
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, uploadAvatarImage.single('avatar'), updateAvatar);

// Follow/Unfollow
router.post('/:userId/follow', protect, followUser);
router.post('/:userId/unfollow', protect, unfollowUser);
router.get('/:userId/followers', protect, getFollowers);
router.get('/:userId/following', protect, getFollowing);

// Public view
router.get('/by-username/:username', getUserByUsername);

export default router;