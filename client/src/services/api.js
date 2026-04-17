import axios from 'axios';

// Get API URL from environment variable (Vite)
// In production, we use a relative path (empty string) to hit the same domain
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: API_BASE_URL
});

// Automatically add the JWT token to requests if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('siia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
