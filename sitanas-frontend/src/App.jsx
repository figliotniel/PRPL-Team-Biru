import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from 'pages/LoginPage'; // Menghapus ./
import Layout from 'components/layout/Layout'; // Menghapus ./
import ProtectedRoute from 'components/common/ProtectedRoute'; // Menghapus ./

// --- Impor Semua Halaman Anda ---
import DashboardPage from 'pages/DashboardPage'; // Menghapus ./
import LaporanPage from 'pages/LaporanPage'; // Menghapus ./
import LogsPage from 'pages/LogsPage'; // Menghapus ./
import ManajemenPenggunaPage from 'pages/ManajemenPenggunaPage'; // Menghapus ./
import TambahTanahPage from 'pages/TambahTanahPage'; // Menghapus ./
import EditTanahPage from 'pages/EditTanahPage'; // Menghapus ./
import DetailTanahPage from 'pages/DetailTanahPage'; // Menghapus ./
// Halaman 404 bisa dibuat nanti, untuk sekarang kita pakai teks
// import NotFoundPage from 'pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Rute Publik (Login) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rute Terlindungi (Semua halaman setelah login) */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Halaman Indeks: Langsung arahkan ke dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Rute Utama */}
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Rute Aset Tanah */}
        <Route path="tambah-tanah" element={<TambahTanahPage />} />
        <Route path="edit-tanah/:id" element={<EditTanahPage />} />
        <Route path="detail-tanah/:id" element={<DetailTanahPage />} /> 

        {/* Rute Lainnya (dari kode Anda sebelumnya) */}
        <Route path="laporan" element={<LaporanPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />

      </Route>
      
      {/* Rute 404 (Halaman Tidak Ditemukan) */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
      <Route path="*" element={<h2 style={{textAlign: 'center', marginTop: '50px'}}>404: Halaman Tidak Ditemukan</h2>} />
    </Routes>
  );
}

export default App;