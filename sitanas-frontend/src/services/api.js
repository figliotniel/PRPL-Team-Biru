import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 detik timeout
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor untuk handle error global
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle berbagai jenis error
    if (error.response) {
      // Server merespons dengan status error
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - token invalid/expired
          console.error('Unauthorized: Token invalid atau expired');
          localStorage.removeItem('token');
          
          // Redirect ke login jika bukan di halaman login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - tidak punya akses
          console.error('Forbidden: Akses ditolak');
          break;

        case 404:
          // Not Found
          console.error('Not Found: Endpoint tidak ditemukan');
          break;

        case 422:
          // Validation Error
          console.error('Validation Error:', data.errors);
          break;

        case 500:
          // Internal Server Error
          console.error('Server Error: Terjadi kesalahan di server');
          break;

        default:
          console.error(`Error ${status}:`, data.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error('Network Error: Tidak dapat terhubung ke server');
      error.message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    } else {
      // Error lain
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;