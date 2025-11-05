// src/components/layout/Topbar.jsx
import React from 'react';
import '../../assets/Layout.css';
// Ambil gambar avatar default (bisa kamu cari di internet dan simpan di src/assets)
// import defaultAvatar from '../../assets/default-avatar.png'; 

const Topbar = ({ user }) => {
  // Cek foto profil, jika tidak ada pakai default
  // const avatar = user?.foto_profil || defaultAvatar;

  return (
    <header className="topbar">
      <div className="profile-dropdown">
        <div className="profile-info">
          <span>
            Halo, <strong>{user?.nama_lengkap || 'Pengguna'}</strong>
          </span>
          {/* <img src={avatar} alt="Avatar" className="profile-avatar" /> */}
          <i className="fas fa-user-circle" style={{fontSize: "32px", marginLeft: "10px"}}></i>
        </div>
      </div>
    </header>
  );
};

export default Topbar;