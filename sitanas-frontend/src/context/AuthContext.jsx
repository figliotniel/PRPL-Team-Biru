// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. TAMBAHAN
import api from '../services/api'; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate(); // <-- 2. TAMBAHAN

  useEffect(() => {
    // ... (Fungsi useEffect Anda sudah benar, biarkan saja)
    const checkUser = async () => {
      if (token) {
        try {
          const response = await api.get('/user'); 
          setUser(response.data);
        } catch (error) {
          console.error("Token tidak valid:", error);
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
      const response = await api.post('/login', { email, password });
      const { token: newToken, user: newUser } = response.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      
      navigate('/dashboard'); // <-- 3. TAMBAHAN INI YANG PALING PENTING

    } catch (error) {
      console.error("Login gagal:", error);
      throw new Error(error.response?.data?.message || "Email atau Password salah");
    }
  };

  const logout = async () => {
    // ... (Fungsi logout Anda sudah benar)
    try {
      await api.post('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      // Arahkan kembali ke login saat logout
      navigate('/login'); 
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