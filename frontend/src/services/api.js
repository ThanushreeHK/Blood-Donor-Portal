/**
 * @file api.js
 * @description Axios instance with interceptors for JWT and error handling.
 */
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Request Interceptor: Attach token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bpt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('bpt_token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Is the backend running?');
    }
    return Promise.reject(error);
  }
);

export default api;