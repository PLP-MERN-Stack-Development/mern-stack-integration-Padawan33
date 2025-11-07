import Post from '../models/Post.js';
import Category from '../models/Category.js';
// 🛑 REMOVE formidable, path, fs, and fileURLToPath imports

// ... (getPosts and getPost functions remain the same) ...
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        console.error("[GET /api/posts] Error fetching posts:", error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
export const getPost = async (req, res) => { /* ... */ };

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private (Now expects JSON)
export const createPost = async (req, res) => {
    
    // 💡 This controller now receives plain JSON
    try {
        const { title, content, category, featuredImage } = req.body;
        const author = req.user.id; // Get author from 'protect' middleware

        if (!title || !content || !category || !author) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const postData = {
            title,
            content,
            category,
            author,
            featuredImage: featuredImage || 'default-post.jpg', // Use uploaded image path or default
        };
        
        const post = await Post.create(postData);
        res.status(201).json({ success: true, data: post });

    } catch (dbError) {
        console.error("[DB] Error creating post:", dbError);
        res.status(500).json({ success: false, error: dbError.message });
    }
};

// ... (updatePost and deletePost functions remain the same) ...
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