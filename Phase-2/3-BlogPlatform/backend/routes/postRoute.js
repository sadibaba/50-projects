import express from 'express';
import { 
    createPost, 
    updatePost, 
    deletePost,
    getPosts,
    getPost,
    likePost,
    unlikePost
} from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { postLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post('/', 
    protect, 
    postLimiter,
    upload.single('image'), 
    createPost
);

router.put('/:id', 
    protect, 
    upload.single('image'), 
    updatePost
);

router.delete('/:id', protect, deletePost);

// Like/Unlike routes
router.put('/:id/like', protect, likePost);
router.put('/:id/unlike', protect, unlikePost);

export default router;