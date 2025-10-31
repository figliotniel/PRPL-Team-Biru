import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/Auth/LoginPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
//import LaporanPage from '../pages/Laporan/LaporanPage';
//import LogAktivitasPage from '../pages/LogAktivitas/LogAktivitasPage';
//import ProfilPage from '../pages/Profil/ProfilPage';

// Komponen placeholder untuk halaman lain
const Laporan = () => <div>Halaman Laporan</div>;
const LogAktivitas = () => <div>Halaman Log Aktivitas</div>;
const ProfilSaya = () => <div>Halaman Profil Saya</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rute untuk Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rute yang dilindungi di dalam MainLayout (punya sidebar & navbar) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} /> {/* Halaman default */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="laporan" element={<Laporan />} />
        <Route path="log-aktivitas" element={<LogAktivitas />} />
        <Route path="profil-saya" element={<ProfilSaya />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;