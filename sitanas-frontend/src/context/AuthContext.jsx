import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk clear auth state
  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  // Fungsi untuk validasi token
  const validateToken = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/user');
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Token validation failed:", error);
      
      // Jika token expired atau invalid
      if (error.response?.status === 401) {
        clearAuth();
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        setError('Gagal memvalidasi sesi. Coba refresh halaman.');
      }
    } finally {
      setLoading(false);
    }
  }, [token, clearAuth]);

  // Validasi token saat mount dan saat token berubah
  useEffect(() => {
    validateToken();
  }, [validateToken]);

  // Fungsi login
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      
      const { token: newToken, user: newUser } = response.data;

      if (!newToken || !newUser) {
        throw new Error('Response tidak valid dari server');
      }

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      setError(null);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Login gagal. Periksa email dan password Anda.';
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi logout
  const logout = async () => {
    try {
      // Panggil API logout untuk invalidate token di server
      await api.post('/logout');
    } catch (error) {
      console.error("Logout API error:", error);
      // Tetap lanjutkan logout meski API gagal
    } finally {
      clearAuth();
    }
  };

  // Fungsi refresh user data
  const refreshUser = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await api.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  }, [token]);

  const value = {
    user,
    token,
    isLoggedIn: !!user && !!token,
    loading,
    error,
    login,
    logout,
    refreshUser,
    clearAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};