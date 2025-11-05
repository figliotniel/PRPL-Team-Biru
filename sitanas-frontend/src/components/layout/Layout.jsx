// src/components/layout/Layout.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // 1. Impor Outlet & useNavigate
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../hooks/useAuth'; // 2. Impor useAuth
import '../../assets/Layout.css';

const Layout = () => {
  // 3. Ambil data asli dari context
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Panggil fungsi logout dari context
    navigate('/login'); // Arahkan ke halaman login
  };

  return (
    <div className="main-wrapper">
      {/* 4. Kirim data & fungsi asli ke Sidebar/Topbar */}
      <Sidebar user={user} onLogout={handleLogout} />
      
      <div className="main-container">
        <Topbar user={user} />
        
        <main className="content">
          {/* 5. Outlet adalah "placeholder"
            Di sinilah React Router akan merender halaman 
            (DashboardPage, LaporanPage, dll)
          */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;