import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Mencoba path absolut dari 'src'
import { NotificationProvider } from './context/NotificationContext.jsx';

// Menggunakan path absolut dari 'src'
import LoginPage from './pages/LoginPage.jsx';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Import semua halaman
import DashboardPage from './pages/DashboardPage.jsx';
import LaporanPage from './pages/LaporanPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import ManajemenPenggunaPage from './pages/ManajemenPenggunaPage.jsx';
import ManajemenTanahPage from './pages/ManajemenTanahPage';
import PemanfaatanTanahPage from './pages/PemanfaatanTanahPage';
import TambahTanahPage from './pages/TambahTanahPage.jsx';
import EditTanahPage from './pages/EditTanahPage.jsx';
import DetailTanahPage from './pages/DetailTanahPage.jsx';


function App() {
  return (
    // --- BUNGKUS SEMUANYA DENGAN PROVIDER INI ---
    <NotificationProvider>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<LoginPage />} />

        {/* Grup Rute Terlindungi */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Halaman Indeks: Arahkan ke dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Rute di dalam Layout */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Aset */}
          <Route path="tambah-tanah" element={<TambahTanahPage />} />
          <Route path="edit-tanah/:id" element={<EditTanahPage />} />
          <Route path="detail-tanah/:id" element={<DetailTanahPage />} />

          {/* Laporan & Log */}
          <Route path="/tanah" element={<ManajemenTanahPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="/pemanfaatan" element={<PemanfaatanTanahPage />} />
          <Route path="logs" element={<LogsPage />} />

          {/* Admin */}
          <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
        </Route>

        {/* Rute 404 (Halaman tidak ditemukan) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </NotificationProvider> // --- PENUTUP PROVIDER ---
  );
}

export default App;