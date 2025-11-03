import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

const MainLayout = () => {
  return (
    <div className="d-flex main-layout">
      {/* Sidebar (Kiri) */}
      <Sidebar />
      
      {/* Konten Utama (Kanan) */}
      <div className="content-wrapper flex-grow-1">
        <Navbar />
        <main className="p-4">
          {/* Outlet adalah tempat halaman (Dashboard, Laporan, dll) akan dirender */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;