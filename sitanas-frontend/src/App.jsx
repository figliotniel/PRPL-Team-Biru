import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ManajemenPenggunaPage from './pages/ManajemenPenggunaPage'; 
import LaporanPage from './pages/LaporanPage'; 
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Grup Rute Terlindungi */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Rute Aset */}
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Rute Laporan & Log */}
        <Route path="laporan" element={<LaporanPage />} />
        <Route path="logs" element={<LogsPage />} />

        {/* Rute Manajemen Pengguna */}
        <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
        
        {/* Rute Tambahan (Isi dengan halaman baru lainnya) */}

      </Route>
      
      {/* Rute 404 */}
      <Route path="*" element={<h2>404: Halaman Tidak Ditemukan</h2>} />
      <Route path="tambah-tanah" element={<TambahTanahPage />} />
    </Routes>
  );
}

export default App;