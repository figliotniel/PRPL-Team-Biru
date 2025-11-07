import React from 'react';
// DIUBAH: Path dikembalikan ke relatif, sama seperti Sidebar.jsx
import { useAuth } from '../../hooks/useAuth'; 
import '../../assets/Layout.css';
// import defaultAvatar from '../../assets/default-avatar.png'; 

const Topbar = () => { // Hapus { user } dari props
  
  // Ambil user langsung dari hook
  const { user } = useAuth(); 

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