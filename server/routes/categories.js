import express from 'express';
// Make sure the controller path is correct and includes the .js extension
import { getCategories, createCategory } from '../controllers/categoryController.js';

const router = express.Router();

// Routes for /api/categories
router.route('/')
    .get(getCategories)
    .post(createCategory);

export default router; // Use default export