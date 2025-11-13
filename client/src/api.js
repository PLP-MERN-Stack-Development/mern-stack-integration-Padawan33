import axios from 'axios';

// 💡 NEW LOGIC:
// When Vercel builds (PROD=true), use a relative '/api' path.
// When running locally (PROD=false), use the full URL from the .env file.
const API_BASE_URL = import.meta.env.PROD
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default axios.create({
  baseURL: API_BASE_URL,
});