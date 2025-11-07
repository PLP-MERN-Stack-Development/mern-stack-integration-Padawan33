import Category from '../models/Category.js'; // Ensure your model path and extension are correct

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error); 
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (for now)
export const createCategory = async (req, res) => {
    try {
        // We only expect a 'name' from the request body
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, error: 'Please provide a category name' });
        }
        
        const category = await Category.create({ name });
        res.status(201).json({ success: true, data: category });

    } catch (error) {
        // Handle validation errors (e.g., duplicate name)
        console.error("Error creating category:", error);
        res.status(400).json({ success: false, error: error.message });
    }
};