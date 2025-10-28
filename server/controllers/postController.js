const Post = require('../models/Post');
const Category = require('../models/Category'); 

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        // Find all posts without population to ensure stability before Task 5
        const posts = await Post.find({});
        
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        console.error("Error fetching posts:", error); 
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res) => {
    try {
        // Find by ID without population
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid ID format or server error' });
    }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Will be restricted in Task 5)
const createPost = async (req, res) => {
    const { title, content, category, author } = req.body;

    if (!title || !content || !category || !author) {
        return res.status(400).json({ success: false, error: 'Please include title, content, category, and author ID' });
    }

    try {
        // Check if category exists
        const exists = await Category.findById(category);
        if (!exists) {
            return res.status(400).json({ success: false, error: 'Category ID not found' });
        }

        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        // Handle Mongoose errors (e.g., validation, unique key)
        console.error("Error creating post:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private (Will be restricted in Task 5)
const updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private (Will be restricted in Task 5)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // We could also delete associated comments/files here, but keeping it simple for now.
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};
