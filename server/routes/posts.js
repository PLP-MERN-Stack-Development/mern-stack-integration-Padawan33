import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postsController.js';
import { protect } from '../middleware/authMiddleware.js'; // 💡 NEW: Import protect

const router = express.Router();

// Public Routes (anyone can see)
router.route('/').get(getPosts);
router.route('/:id').get(getPost);

// Protected Routes (only logged-in users can access)
router.route('/').post(protect, createPost); // 💡 NEW: Add 'protect'
router.route('/:id').put(protect, updatePost); // 💡 NEW: Add 'protect'
router.route('/:id').delete(protect, deletePost); // 💡 NEW: Add 'protect'

export default router;