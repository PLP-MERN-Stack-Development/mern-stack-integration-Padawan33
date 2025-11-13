import Post from '../models/Post.js';
import Category from '../models/Category.js';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob'; // 💡 NEW: Import Vercel Blob 'put' function

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
    
    // 1. Configure formidable to parse form data
    // We REMOVE 'uploadDir' to let formidable use the OS temp directory
    // This is writable on Vercel
    const form = formidable({ 
        multiples: false, 
        keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('[form.parse] Error parsing form:', err);
            return res.status(500).json({ success: false, error: 'File parse error' });
        }
        
        try {
            // 2. Get text fields from the 'fields' object
            // Note: formidable wraps fields in arrays, e.g., fields.title[0]
            const title = fields.title?.[0];
            const content = fields.content?.[0];
            const category = fields.category?.[0];
            const author = req.user.id; 

            if (!title || !content || !category) {
                return res.status(400).json({ success: false, error: 'Missing required text fields' });
            }

            let featuredImagePath = 'default-post.jpg'; // Default value
            const file = files.file?.[0]; // Get the file object

            // 3. Check if a file was uploaded
            if (file) {
                console.log('[createPost] File detected. Uploading to Vercel Blob...');
                
                // 4. Read the file from its temporary path on the server
                const fileBuffer = fs.readFileSync(file.filepath);
                
                // Use the original filename for the blob
                const filename = file.originalFilename || `post-image-${Date.now()}`;

                // 5. Upload the file buffer to Vercel Blob
                const { url } = await put(filename, fileBuffer, {
                  access: 'public',
                  // BLOB_READ_WRITE_TOKEN is read from Vercel env variables
                });

                // 6. Set featuredImagePath to the new public URL from Vercel Blob
                featuredImagePath = url;
                console.log(`[createPost] Upload successful. URL: ${featuredImagePath}`);
                
                // 7. (Optional but recommended) Clean up the temporary file
                fs.unlinkSync(file.filepath);

            } else {
                console.log('[createPost] No file detected. Using default image.');
            }

            // 8. Prepare data for MongoDB
            const postData = {
                title,
                content,
                category,
                author,
                featuredImage: featuredImagePath, // This is now either the default or a Vercel Blob URL
            };

            // 9. Create the post in the database
            const post = await Post.create(postData);
            res.status(201).json({ success: true, data: post });

        } catch (dbError) {
            console.error("[DB] Error creating post:", dbError);
            
            // Specific check for blob errors
            if (dbError.code === 'BLOB_STORE_NOT_FOUND') {
                 return res.status(500).json({ success: false, error: 'Blob store not found. Ensure Vercel Blob is configured.' });
            }

            res.status(500).json({ success: false, error: dbError.message });
        }
    });
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    // Note: This function currently only supports updating text fields.
    // For a future task, you could adapt the 'createPost' logic to handle
    // file replacement here as well.
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
    // Note: This function does not delete the image from Vercel Blob.
    // For a future task, you could add 'del(post.featuredImage)'
    // from '@vercel/blob' to remove the file from storage.
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