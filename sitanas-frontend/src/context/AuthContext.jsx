import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // 1. Impor 'api' kita

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. Ganti simulasi 'checkUser' dengan API call
    const checkUser = async () => {
      if (token) {
        try {
          // 'api' sudah otomatis pasang token di header
          // Kita pakai /user (sesuai diskusi)
          const response = await api.get('/user'); 
          setUser(response.data); // Asumsi backend kirim data user
        } catch (error) {
          // Token tidak valid atau error server
          console.error("Token tidak valid:", error);
          localStorage.removeItem('token'); // Hapus token palsu
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
      const response = await api.post('/login', { email, password });
      
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);

    } catch (error) {
      console.error("Login gagal:", error);
      throw new Error(error.response?.data?.message || "Email atau Password salah");
    }
  };

  const logout = async () => {
    // 4. Panggil API logout (opsional tapi bagus)
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Bersihkan data di frontend (WAJIB)
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
      {!loading && children}
    </AuthContext.Provider>
  );
};