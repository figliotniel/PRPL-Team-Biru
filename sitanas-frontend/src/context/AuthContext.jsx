// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          // Validasi token dengan backend
          const response = await api.get('/user');
          setUser(response.data);
        } catch (error) {
          console.error("Token tidak valid:", error);
          // Bersihkan token yang tidak valid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      // Panggil API login
      const response = await api.post('/login', { email, password });
      
      // Ekstrak data dari response
      const { token: newToken, user: newUser } = response.data;

      if (!newToken || !newUser) {
        throw new Error("Response dari server tidak lengkap");
      }

      // Simpan token dan user
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error("Login gagal:", error);
      
      // Handle berbagai jenis error
      if (error.response) {
        // Server merespons dengan status error
        const status = error.response.status;
        const message = error.response.data?.message;
        
        if (status === 401) {
          throw new Error("Email atau Password salah");
        } else if (status === 500) {
          throw new Error("Terjadi kesalahan di server. Silakan coba lagi.");
        } else if (status === 422) {
          throw new Error(message || "Data yang Anda masukkan tidak valid");
        } else {
          throw new Error(message || `Error: ${status}`);
        }
      } else if (error.request) {
        // Request dikirim tapi tidak ada response
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      } else {
        // Error lain
        throw new Error(error.message || "Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  const logout = async () => {
    try {
      // Panggil API logout (optional, tapi recommended)
      await api.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
      // Tetap lanjutkan logout di frontend meski API gagal
    } finally {
      // Bersihkan data di frontend
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};