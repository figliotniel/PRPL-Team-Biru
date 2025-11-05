// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Hook yang baru kita perbaiki
import { Navigate } from 'react-router-dom';

// Komponen ini akan "membungkus" halaman yang ingin kita lindungi
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  // 1. Tampilkan loading jika context masih mengecek token
  if (loading) {
    return <div>Loading, please wait...</div>; // Atau buat komponen spinner
  }

  // 2. Jika sudah selesai loading DAN tidak login, tendang ke /login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. Jika lolos, tampilkan halaman yang dibungkusnya (children)
  return children;
};

export default ProtectedRoute;