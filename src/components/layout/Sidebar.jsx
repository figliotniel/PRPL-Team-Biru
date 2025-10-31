import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  RxDashboard 
} from 'react-icons/rx';
import { 
  TbReport 
} from 'react-icons/tb';
import { 
  HiOutlineDocumentText 
} from 'react-icons/hi';
import { 
  CgProfile 
} from 'react-icons/cg';
import { 
  FiLogOut 
} from 'react-icons/fi'; // Ikon untuk Logout
import './Layout.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Hapus token/session di sini
    console.log('User logged out');
    navigate('/login'); // Redirect ke halaman login
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3 className="text-white">SITANAS</h3>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            <RxDashboard className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/laporan" className="nav-link">
            <TbReport className="nav-icon" /> Laporan
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/log-aktivitas" className="nav-link">
            <HiOutlineDocumentText className="nav-icon" /> Log Aktivitas
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/profil-saya" className="nav-link">
            <CgProfile className="nav-icon" /> Profil Saya
          </NavLink>
        </li>
      </ul>

      {/* Bagian Logout di Paling Bawah */}
      <div className="sidebar-footer mt-auto">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <FiLogOut className="nav-icon" /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;