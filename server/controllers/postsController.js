import Post from '../models/Post.js';
import Category from '../models/Category.js';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
    // 💡 DIAGNOSTIC LOGS 💡
    console.log('[GET /api/posts] Route hit. Fetching posts...');
    try {
        const posts = await Post.find({});
        console.log(`[GET /api/posts] Found ${posts.length} posts.`);
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        console.error("[GET /api/posts] Error fetching posts:", error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
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
    // ... (This function is working, no changes needed) ...
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
            const author = fields.author?.[0]; 

            if (!title || !content || !category || !author) {
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

// ... (updatePost and deletePost functions remain the same) ...
export const updatePost = async (req, res) => { /* ... */ };
export const deletePost = async (req, res) => { /* ... */ };