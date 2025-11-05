// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // <-- Import useAuth
import '../../assets/Layout.css';

const Sidebar = () => {
  const { user, logout } = useAuth(); // Ambil user dan logout
  
  const handleLogout = () => {
    logout();
  };

  const isAdmin = user?.role_id === 1; // Admin
  const isKades = user?.role_id === 2; // Kepala Desa
  // BPD (Role ID 3) sudah disiapkan

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-landmark sidebar-logo"></i>
        <h2 className="sidebar-title">SITANAS</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard"><i className="fas fa-tachometer-alt fa-fw"></i> Dashboard</NavLink>
          </li>
          {/* Laporan tersedia untuk semua (Admin, Kades, BPD) */}
          <li>
            <NavLink to="/laporan"><i className="fas fa-file-alt fa-fw"></i> Laporan</NavLink>
          </li>
          
          {/* Manajemen Pengguna HANYA untuk Admin */}
          {isAdmin && (
            <li>
              <NavLink to="/manajemen-pengguna">
                <i className="fas fa-users-cog fa-fw"></i> Manajemen Pengguna
              </NavLink>
            </li>
          )}
          
          {/* Log Aktivitas HANYA untuk Admin */}
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
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;