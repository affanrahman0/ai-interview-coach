// PHASE 1: Central Axios instance - attaches JWT token to every request.

import axios from 'axios';

// Create Axios client pointed at your FastAPI backend
//http://localhost:8000/api/auth/login these are the kind of endpoints needed to be called from backend . By doing the below operation we will only need to call /auth/login from frontend and the rest i.e http://localhost:8000/api will be auto appended to it automatically before reaching the backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request Interceptor: Automatically attach JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
