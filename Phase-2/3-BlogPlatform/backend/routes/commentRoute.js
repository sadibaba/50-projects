import express from 'express';
import { protect } from '../middlewares/UserMiddleware.js';
import { addComment, getComments, deleteComment } from '../controllers/commentController.js';
import { commentLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/', protect, commentLimiter, addComment);

router.get('/:postId', getComments);

router.delete('/:id', protect, deleteComment);

export default router;