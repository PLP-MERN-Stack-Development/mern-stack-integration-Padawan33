import axios from 'axios';

// 💡 NEW: Check if we are in production
// Vercel sets this variable to 'production' automatically.
const isProduction = process.env.NODE_ENV === 'production';

// If in production, use a relative path.
// If in development, use the localhost server.
const API_BASE_URL = isProduction ? '/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;