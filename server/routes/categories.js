// server/routes/categories.js

const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    createCategory 
} = require('../controllers/categoryController');

// Routes that handle both GET (all categories) and POST (create a new category)
router.route('/')
    .get(getCategories)
    .post(createCategory);

module.exports = router;