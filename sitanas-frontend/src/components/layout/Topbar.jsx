import React from 'react';
import { useAuth } from 'hooks/useAuth'; // <-- 1. Path diubah ke absolut
import 'assets/Layout.css'; // <-- 2. Path diubah ke absolut

const Topbar = () => {
  const { user } = useAuth(); // <-- Panggil hook untuk ambil data user

  return (
    <header className="topbar">
      <div className="profile-dropdown">
        <div className="profile-info">
          <span>
            Halo, <strong>{user?.nama_lengkap || 'Pengguna'}</strong>
          </span>
          <i className="fas fa-user-circle" style={{fontSize: "32px", marginLeft: "10px"}}></i>
        </div>
      </div>
    </header>
  );
};

export default Topbar;