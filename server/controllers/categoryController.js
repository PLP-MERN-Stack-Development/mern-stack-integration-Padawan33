// server/controllers/categoryController.js

const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Should be admin-only, but we'll treat it as private access for now)
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }
        // Handle unique constraint error (e.g., category name already exists)
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Category name already exists.' });
        }
        res.status(500).json({ success: false, error: error.message || 'Server Error' });
    }
};