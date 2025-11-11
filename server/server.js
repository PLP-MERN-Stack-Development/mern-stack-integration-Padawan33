import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js'; 
import uploadRoutes from './routes/uploadRoutes.js';

// --- ESM Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
app.use(cors()); // Use CORS for all requests

// Serve static files from 'uploads'
// We use path.resolve to create an absolute path Vercel can understand
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// --- Apply middleware per-route ---
app.use('/api/posts', postRoutes); 
app.use('/api/categories', express.json(), categoryRoutes);
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/upload', uploadRoutes); 

// Simple message to confirm the API is running
app.get('/api/test', (req, res) => { // Added /api prefix for testing
    res.send('MERN Blog API is running...');
});

// 🛑 IMPORTANT 🛑
// We no longer call app.listen(). 
// Vercel will handle running the server.
// We just need to export the 'app'.
export default app;