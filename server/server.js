import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import connectDB from './config/db.js';
import postRoutes from './routes/posts.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js'; 
import comments from './models/Comment.js';

// 🛑 REMOVE: import uploadRoutes from './routes/uploadRoutes.js';

// --- ESM Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
app.use(cors()); // Use CORS for all requests

// Serve static files from 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Apply middleware per-route ---

// 💡 /api/posts uses Formidable, so it does NOT get express.json()
// It must come BEFORE the JSON routes that use the same base path
app.use('/api/posts', postRoutes); 

// These routes DO need to parse JSON
app.use('/api/categories', express.json(), categoryRoutes);
app.use('/api/auth', express.json(), authRoutes);

// 🛑 REMOVE: app.use('/api/upload', uploadRoutes); 

// Simple message to confirm the API is running
app.get('/', (req, res) => {
    res.send('MERN Blog API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});