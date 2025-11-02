// server/models/Post.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      unique: true, // Ensuring title is unique
      maxLength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    // Relationship: A post belongs to a Category (Required for Task 2)
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', // Reference the Category model
      required: [true, 'Post must belong to a category'],
    },
    // For Task 5: User/Authentication (Keep this for later)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Note: Changing 'required: true' to 'required: false' temporarily 
      // until we implement User authentication in Task 5, 
      // or ensure it defaults to a known ID. Let's keep it required 
      // as it was in your original code to maintain integrity, but be aware 
      // we'll need to handle it in the controller.
      required: [true, 'Post must have an author'],
    },
    // For Task 5: Image Uploads
    featuredImage: {
      type: String, // URL to the image
      default: 'default-post.jpg',
    },
    // Comments array for Task 5
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Other fields from your original code (optional but useful)
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    // Ensure virtuals are included when converting to JSON
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
  }
);

// Middleware to automatically create a slug from the title before saving
PostSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        // More robust slug generation: convert to lowercase, replace non-alphanumeric/spaces with hyphen, trim leading/trailing hyphens.
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-*|-*$/g, '');
    }
    next();
});

// We can keep the methods and virtual from your original code if we plan to use them.

// Virtual for post URL (Optional)
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment (Optional, for Task 5)
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content });
  return this.save();
};

// Method to increment view count (Optional)
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

const Post = mongoose.model('Post', PostSchema);

export default Post;