// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/Layout.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role_id === 1; // Admin
  const isKades = user?.role_id === 2; // Kepala Desa
  const isBPD = user?.role_id === 3; // BPD

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-landmark sidebar-logo"></i>
        <h2 className="sidebar-title">SITANAS</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
              <i className="fas fa-tachometer-alt fa-fw"></i> Dashboard
            </NavLink>
          </li>
          
          {/* Laporan tersedia untuk semua (Admin, Kades, BPD) */}
          <li>
            <NavLink to="/laporan" className={({isActive}) => isActive ? 'active' : ''}>
              <i className="fas fa-file-alt fa-fw"></i> Laporan
            </NavLink>
          </li>
          
          {/* Manajemen Pengguna HANYA untuk Admin */}
          {isAdmin && (
            <li>
              <NavLink to="/manajemen-pengguna" className={({isActive}) => isActive ? 'active' : ''}>
                <i className="fas fa-users-cog fa-fw"></i> Manajemen Pengguna
              </NavLink>
            </li>
          )}
          
          {/* Log Aktivitas HANYA untuk Admin */}
          {isAdmin && (
            <li>
              <NavLink to="/logs" className={({isActive}) => isActive ? 'active' : ''}>
                <i className="fas fa-history fa-fw"></i> Log Aktivitas
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn btn-danger">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;