import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  // Link to the post
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  // Link to the author
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;