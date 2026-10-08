import express from 'express';
import {
    createPost,
    updatePost,
    deletePost,
    getPosts,
    getPost,
    likePost,
    unlikePost,
} from '../controllers/postController.js';
import { protect } from '../middlewares/UserMiddleware.js';
import { adminOnly } from '../middlewares/UserMiddleware.js';  
import { uploadPostImage } from '../middlewares/localUpload.js';
import { postLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// ── PUBLIC ──────────────────────────────────────────────
router.get('/', getPosts);
router.get('/:id', getPost);

// ── ADMIN ONLY (Create, Update, Delete) ─────────────────
router.post('/', protect, adminOnly, postLimiter, uploadPostImage.single('image'), createPost);
router.put('/:id', protect, adminOnly, uploadPostImage.single('image'), updatePost);
router.delete('/:id', protect, adminOnly, deletePost);

// ── ANY LOGGED-IN USER (Like / Unlike) ──────────────────
router.put('/:id/like', protect, likePost);
router.put('/:id/unlike', protect, unlikePost);

export default router;