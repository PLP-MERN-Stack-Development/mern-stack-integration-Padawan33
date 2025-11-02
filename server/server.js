import express from 'express';
import dotenv from 'dotenv';
import path from 'path'; // Required for static file serving
import { fileURLToPath } from 'url'; // Required for static file serving in ESM

import connectDB from './config/db.js'; // Note: Changed to .js extension for ESM
import postRoutes from './routes/posts.js'; // Note: Changed to .js extension for ESM
import uploadRoutes from './routes/uploadRoutes.js'; // 💡 NEW: Import upload routes

// --- ESM Setup for Directory ---
// Get the current file path and directory name for static serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

// Load environment variables from config.env
dotenv.config({ path: './config/config.env' });

// Connect to the database immediately
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up CORS - Crucial for allowing React to talk to Express
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// 💡 NEW: Serve files uploaded to the 'uploads' directory statically 💡
// This makes uploaded images accessible via /uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount the Post routes
app.use('/api/posts', postRoutes);

// 💡 NEW: Mount the Upload routes 💡
app.use('/api/upload', uploadRoutes);


// Simple message to confirm the API is running
app.get('/', (req, res) => {
    res.send('MERN Blog API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});