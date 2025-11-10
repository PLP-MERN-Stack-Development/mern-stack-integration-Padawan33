import express from 'express';
import { getCommentsForPost, createComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// 💡 NEW: Apply the JSON parser middleware ONLY to this router
router.use(express.json());

// GET /api/posts/:postId/comments
router.route('/').get(getCommentsForPost);

// POST /api/posts/:postId/comments
// The request will now be parsed as JSON before it hits createComment
router.route('/').post(protect, createComment);

export default router;