// server/routes/posts.js

const express = require('express');
const router = express.Router();
const { 
    getPosts, 
    getPost, 
    createPost, 
    updatePost, 
    deletePost 
} = require('../controllers/postController');

// Routes that handle both GET (all posts) and POST (create a new post)
router.route('/')
    .get(getPosts)
    .post(createPost); 

// Routes that handle single post operations (GET, PUT, DELETE) by ID
router.route('/:id')
    .get(getPost)
    .put(updatePost)
    .delete(deletePost);

module.exports = router;