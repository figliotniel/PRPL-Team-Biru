// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth';

// 1. Import ikon dan service baru
import { FaUsers, FaMapMarkedAlt, FaChartArea, FaUserShield } from 'react-icons/fa';
import { getDashboardStats, getRecentActivities } from '../services/dashboardService';

function DashboardPage() {
  const { user } = useAuth(); // Ambil data user yang sedang login

  // 2. State untuk data, loading, dan error
  const [stats, setStats] = useState({
    total_users: 0,
    total_tanah: 0,
    total_luas: 0,
    total_admin: 0,
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect untuk mengambil data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Panggil kedua API secara bersamaan
        const [statsData, activitiesData] = await Promise.all([
          getDashboardStats(),
          getRecentActivities()
        ]);
        
        // Asumsi statsData merespon dengan:
        // { total_users: 10, total_tanah: 50, total_luas: 12345, total_admin: 2 }
        setStats(statsData); 
        
        // Asumsi activitiesData adalah array
        setActivities(activitiesData);

      } catch (err) {
        console.error('Gagal memuat data dashboard:', err);
        setError('Gagal memuat data dashboard. Pastikan backend berjalan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependensi kosong, jalankan sekali

  // 4. Render Loading atau Error
  if (isLoading) {
    return (
      <div className="page-content">
        <h2>Dashboard</h2>
        <p>Loading data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h2>Dashboard</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  // 5. Render data asli
  return (
    <div className="page-content">
      <h2>Dashboard</h2>
      <p>Selamat datang kembali, {user ? user.name : 'Pengguna'}!</p>

      {/* --- Statistik Cards --- */}
      <div className="stat-cards-container">
        <StatCard
          icon={<FaUsers />}
          title="Total Pengguna"
          value={stats.total_users}
        />
        <StatCard
          icon={<FaMapMarkedAlt />}
          title="Total Tanah Kas Desa"
          value={stats.total_tanah}
        />
        <StatCard
          icon={<FaChartArea />}
          title="Total Luas Tanah (m²)"
          // Format angka agar mudah dibaca
          value={stats.total_luas ? stats.total_luas.toLocaleString('id-ID') : 0}
        />
        <StatCard
          icon={<FaUserShield />}
          title="Total Admin"
          value={stats.total_admin}
        />
      </div>

      {/* --- Aktivitas Terbaru --- */}
      <div className="recent-activities">
        <h3>Aktivitas Terbaru</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Aktivitas</th>
                <th>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    {/* Sesuaikan 'activity.user.name' jika struktur data berbeda */}
                    <td>{activity.user ? activity.user.name : 'Sistem'}</td>
                    <td>{activity.deskripsi}</td>
                    {/* Format tanggal agar lebih rapi */}
                    <td>{new Date(activity.created_at).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    Belum ada aktivitas terbaru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;