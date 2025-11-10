import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get all comments for a specific post
// @route   GET /api/posts/:postId/comments
export const getCommentsForPost = async (req, res) => {
  console.log(`[Comments] Hit GET /api/posts/${req.params.postId}/comments`);
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 'desc' });
    
    console.log(`[Comments] Found ${comments.length} comments.`);
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error('[Comments] Error in getCommentsForPost:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new comment for a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const createComment = async (req, res) => {
  console.log(`[Comments] Hit POST /api/posts/${req.params.postId}/comments`);
  try {
    const { content } = req.body;
    const postId = req.params.postId;
    const authorId = req.user.id; 

    if (!content) {
      console.log('[Comments] Error: Content is required.');
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      console.log(`[Comments] Error: Post not found with ID ${postId}`);
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: authorId,
    });
    
    console.log('[Comments] Comment created, populating author...');
    const populatedComment = await Comment.findById(comment._id)
                                    .populate('author', 'username');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    console.error('[Comments] Error in createComment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};