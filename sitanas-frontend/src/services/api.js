// src/services/api.js
import axios from 'axios';

// Buat instance axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 detik timeout
});

// Request Interceptor - Tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors secara global
api.interceptors.response.use(
  (response) => {
    // Response sukses, langsung return
    return response;
  },
  (error) => {
    // Handle berbagai jenis error
    if (error.response) {
      // Server merespons dengan status error
      const status = error.response.status;
      
      if (status === 401) {
        // Unauthorized - Token tidak valid atau expired
        console.warn('Token tidak valid, membersihkan session...');
        localStorage.removeItem('token');
        
        // Redirect ke login jika sedang tidak di halaman login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        console.error('Akses ditolak (Forbidden)');
      } else if (status === 500) {
        console.error('Server error:', error.response.data);
      }
    } else if (error.request) {
      // Request dikirim tapi tidak ada response
      console.error('Tidak ada response dari server:', error.request);
      error.message = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
    } else {
      // Error lain
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;