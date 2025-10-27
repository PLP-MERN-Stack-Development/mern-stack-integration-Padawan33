// server/controllers/postController.js

const Post = require('../models/Post');
// Assuming we need Category to ensure a valid category ID is provided
const Category = require('../models/Category'); 

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        // Find all posts and populate the category and author fields for richer data
        const posts = await Post.find({})
            .populate('category', 'name') // Populate category name
            .populate('author', 'username'); // Populate author username (Task 5)
        
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('category', 'name')
            .populate('author', 'username');

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        // Handle Mongoose CastError (e.g., invalid ID format)
        res.status(400).json({ success: false, error: 'Invalid ID format or server error' });
    }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Will be protected in Task 5)
exports.createPost = async (req, res) => {
    try {
        // BASIC VALIDATION: Check if category ID is valid
        if (!await Category.findById(req.body.category)) {
            return res.status(400).json({ success: false, error: 'Invalid category ID provided.' });
        }
        
        // Note: For now, we are hardcoding the author ID or assuming it's passed 
        // in req.body. In Task 5, we will get it from the JWT.
        
        const newPost = await Post.create(req.body);
        
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        // Handle Mongoose validation errors (required fields, unique fields)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(500).json({ success: false, error: error.message || 'Server Error during creation' });
    }
};

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private (Will be protected in Task 5)
exports.updatePost = async (req, res) => {
    try {
        // Check if category ID is valid if it's being updated
        if (req.body.category && !await Category.findById(req.body.category)) {
            return res.status(400).json({ success: false, error: 'Invalid category ID provided.' });
        }

        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation on update
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        res.status(400).json({ success: false, error: error.message || 'Server Error during update' });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Will be protected in Task 5)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Return a 204 No Content status on successful deletion
        res.status(204).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};