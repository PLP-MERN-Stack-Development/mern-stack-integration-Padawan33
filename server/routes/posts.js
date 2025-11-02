import express from 'express'; // 💡 Convert require('express') to import express from 'express'
import { getPosts, createPost } from '../controllers/postsController.js';
const router = express.Router();

// Route for getting all posts and creating a new post
// NOTE: We will update the createPost controller to handle file uploads in the next step!
router.route('/')
    .get(getPosts)
    .post(createPost);

// Add routes for single post operations (e.g., /:id) as needed later
// router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);


export default router; // ✅ Crucial for resolving the import in server.js
