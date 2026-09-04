// API client configuration
import axios, { AxiosInstance } from 'axios';

// In production (served from Django), use relative path
// In development, use VITE_API_URL or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.PROD ? '/api' : 'http://localhost:8000/api'
);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Required for Django session guest cart cookies
  withCredentials: true,
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle response errors — do not force-redirect guests on every 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('authToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Only bounce authenticated sessions that expired; keep guest browsing intact
      if (hadToken && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
