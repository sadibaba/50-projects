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
import { uploadPostImage } from '../middlewares/localUpload.js';
import { postLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected
router.post('/', protect, postLimiter, uploadPostImage.single('image'), createPost);
router.put('/:id', protect, uploadPostImage.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

// Like / Unlike
router.put('/:id/like', protect, likePost);
router.put('/:id/unlike', protect, unlikePost);

export default router;