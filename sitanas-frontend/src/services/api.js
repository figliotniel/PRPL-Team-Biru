// src/services/api.js
import axios from 'axios';

// Buat instance axios
const api = axios.create({
  // TENTUKAN URL BACKEND LARAVEL-MU DI SINI
  // Ini adalah URL tempat 'php artisan serve' berjalan
  baseURL: 'http://localhost:8000/api', // Ganti jika URL backend-mu beda
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // 'withCredentials' penting jika backend pakai Sanctum untuk auth SPA
  withCredentials: true, 
});

// Interceptor: Ini adalah "satpam"
// Ia akan otomatis menambahkan Token dari localStorage ke SETIAP request
// yang kamu kirim ke backend.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;