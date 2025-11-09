// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/Layout.css';

const Sidebar = () => {
  const { user, logout } = useAuth(); // Ambil user dan logout
  
  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.role_id === 1; // Admin
  // const isKades = user?.role_id === 2; // (Bisa digunakan nanti)

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Logo Anda */}
        <i className="fas fa-landmark sidebar-logo"></i> 
        <h2 className="sidebar-title">SITANAS</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard">
              <i className="fas fa-tachometer-alt fa-fw"></i> Dashboard
            </NavLink>
          </li>
          
          {/* --- Menu Inti (Ditambahkan/Diperbaiki) --- */}
          <li>
            <NavLink to="/tanah">
              <i className="fas fa-map-marked-alt fa-fw"></i> Tanah Kas Desa
            </NavLink>
          </li>
          <li>
            <NavLink to="/pemanfaatan">
              <i className="fas fa-handshake fa-fw"></i> Pemanfaatan
            </NavLink>
          </li>
          <li>
            <NavLink to="/laporan">
              <i className="fas fa-file-alt fa-fw"></i> Laporan
            </NavLink>
          </li>
          
          {/* --- Menu Admin (HANYA untuk Admin) --- */}
          
          {isAdmin && (
            <li>
              {/* Diperbaiki: Rute di App.jsx adalah /users */}
              <NavLink to="/users"> 
                <i className="fas fa-users-cog fa-fw"></i> Manajemen Pengguna
              </NavLink>
            </li>
          )}
          
          {isAdmin && (
            <li>
              <NavLink to="/logs">
                <i className="fas fa-history fa-fw"></i> Log Aktivitas
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-danger">
          <i className="fas fa-sign-out-alt fa-fw"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;