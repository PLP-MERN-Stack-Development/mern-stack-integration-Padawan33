// server/server.js

// 1. Load Environment Variables (Crucial for MONGO_URI)
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes and Error Middleware
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth'); // For Task 5
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); 

// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middleware ---
app.use(cors()); // Allows cross-origin requests from the client
app.use(express.json()); // Allows the server to accept JSON in request body
app.use(express.urlencoded({ extended: true }));

// --- API Routes (Prefix all routes with /api) ---
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);

// Simple default route for testing
app.get('/', (req, res) => {
    res.send('MERN Blog API is running!');
});

// --- Error Handling Middleware (MUST be placed after routes) ---
// 404 Not Found Handler (Catches requests that fall through all routes)
app.use(notFound);

// General Error Handler
app.use(errorHandler);


// --- Database Connection and Server Start ---

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in the .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected successfully.');
        
        // Start the Express server only after the DB connection is successful
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`API URL: http://localhost:${PORT}/api/posts`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err.message);
        // Exit process on connection failure
        process.exit(1);
    });
