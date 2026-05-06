import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // In production, this will use the same host
});

// For local dev, we might need to point to localhost:3000
if (import.meta.env.MODE === 'development') {
  api.defaults.baseURL = 'http://localhost:3000/api';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
