import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js'; 
// 💡 REMOVED: import uploadRoutes from './routes/uploadRoutes.js';

// --- ESM Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

const app = express();
app.use(cors()); // Use CORS for all requests

// 💡 REMOVED: Serving static files from 'uploads'
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Apply middleware per-route ---
app.use('/api/posts', postRoutes); 
app.use('/api/categories', express.json(), categoryRoutes);
app.use('/api/auth', express.json(), authRoutes);
// 💡 REMOVED: app.use('/api/upload', uploadRoutes); 

// Simple message to confirm the API is running
app.get('/', (req, res) => {
    res.send('MERN Blog API is running...');
});

// 🛑 REMOVED app.listen()
// 💡 NEW: Export the app for Vercel to use
export default app;