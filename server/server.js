import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import uploadRoutes from './routes/uploadRoutes.js'; // 💡 NEW: Import upload routes

// --- ESM Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
app.use(cors());

// 💡 ADD THIS BACK: We need this for the JSON submission to /api/posts
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes); // 💡 NEW: Mount upload route

// ... (rest of server.js) ...
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT || 5000}`);
});