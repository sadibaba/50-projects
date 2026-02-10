import express from 'express';
import { protect, adminOnly } from '../middlewares/UserMiddleware.js';
import { createCategory, getCategories } from '../controllers/categoryControllers.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protect, adminOnly, createCategory);

export default router;