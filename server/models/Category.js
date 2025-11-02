// server/models/Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxLength: [50, 'Category name cannot be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true,
    }
}, {
    timestamps: true
});

// Middleware to automatically create a slug from the name before saving
CategorySchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
    }
    next();
});

const Category = mongoose.model('Category', CategorySchema);

export default Category;