import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postsController.js';
import { protect } from '../middleware/authMiddleware.js';

// 💡 NEW: Import the comment router
import commentRoutes from './commentRoutes.js';

const router = express.Router();

// 💡 NEW: Tell the router to use commentRoutes for nested URLs
// This forwards /api/posts/:postId/comments to the comment router
router.use('/:postId/comments', commentRoutes);

// Public Routes
router.route('/').get(getPosts);
router.route('/:id').get(getPost);

// Protected Routes
router.route('/').post(protect, createPost);
router.route('/:id').put(protect, updatePost);
router.route('/:id').delete(protect, deletePost);

export default router;