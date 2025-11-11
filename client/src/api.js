import axios from 'axios';

// Checks if the app is running in the Vercel production environment
const isProduction = process.env.NODE_ENV === 'production';

// If in production, use the relative path '/api'. 
// If in development (local), use the full server address.
const API_BASE_URL = isProduction ? '/api' : 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;