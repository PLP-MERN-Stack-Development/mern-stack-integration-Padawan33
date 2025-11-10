import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  // 🛑 REMOVED the default 'Content-Type': 'application/json' header
});

export default api;