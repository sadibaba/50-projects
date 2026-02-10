import express from 'express';
import { protect, authorOnly } from '../middlewares/UserMiddleware.js';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, authorOnly, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, authorOnly, updatePost)
  .delete(protect, authorOnly, deletePost);

export default router;