import Post from '../models/Post.js';
import Category from '../models/Category.js';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all blog posts (with pagination AND search/filter)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    try {
        const limit = 6; // Posts per page
        const page = Number(req.query.page) || 1; // Get page number from query, default to 1

        // 💡 NEW: Build the search filter object
        const filter = {};
        
        // 1. Keyword filter (searches title)
        if (req.query.keyword) {
            filter.title = {
                $regex: req.query.keyword, // The search term
                $options: 'i', // 'i' for case-insensitive
            };
        }
        
        // 2. Category filter (searches by category ID)
        if (req.query.category) {
            filter.category = req.query.category;
        }
        // --- End of new filter logic ---

        // Count documents *with* the filter applied
        const count = await Post.countDocuments(filter);
        const totalPages = Math.ceil(count / limit);

        const posts = await Post.find(filter) // 💡 Apply the filter to the find() query
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));

        res.status(200).json({ 
            success: true, 
            count: posts.length, 
            page, 
            totalPages,
            totalPosts: count,
            data: posts 
        });
    } catch (error) {
        console.error("[GET /api/posts] Error fetching posts:", error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ... (getPost, createPost, updatePost, deletePost functions remain the same) ...

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username')
            .populate('category', 'name');

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Invalid ID format or server error' });
    }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Handles FormData)
export const createPost = async (req, res) => {
    
    const form = formidable({ 
        multiples: false, 
        keepExtensions: true,
        uploadDir: path.join(__dirname, '../uploads'), 
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ success: false, error: 'File parse error' });
        }
        try {
            const title = fields.title?.[0];
            const content = fields.content?.[0];
            const category = fields.category?.[0];
            const author = req.user.id; 

            if (!title || !content || !category) {
                return res.status(400).json({ success: false, error: 'Missing required text fields' });
            }

            let featuredImagePath = 'default-post.jpg';
            const file = files.file?.[0]; 

            if (file) {
                featuredImagePath = `/uploads/${file.newFilename}`;
            }

            const postData = {
                title,
                content,
                category,
                author,
                featuredImage: featuredImagePath,
            };

            const post = await Post.create(postData);
            res.status(201).json({ success: true, data: post });

        } catch (dbError) {
            console.error("[DB] Error creating post:", dbError);
            res.status(500).json({ success: false, error: dbError.message });
        }
    });
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        if (post.author.toString() !== req.user.id) {
             return res.status(401).json({ success: false, error: 'Not authorized' });
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        if (post.author.toString() !== req.user.id) {
             return res.status(401).json({ success: false, error: 'Not authorized' });
        }
        await post.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};