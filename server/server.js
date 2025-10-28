const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/posts');

// Load environment variables from config.env
dotenv.config({ path: './config/config.env' });

// Connect to the database immediately
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up CORS - Crucial for allowing React (on port 5500/5173) to talk to Express (on port 5000)
// For development, we allow all origins.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Mount the Post routes
app.use('/api/posts', postRoutes);

// Simple message to confirm the API is running
app.get('/', (req, res) => {
    res.send('MERN Blog API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // Fixed log message
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
