// src/pages/ManajemenPenggunaPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getUsers, deleteUser } from '../services/userService';
import AddUserModal from '../components/common/AddUserModal';
import { useAuth } from '../hooks/useAuth'; 

function ManajemenPenggunaPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: currentUser } = useAuth(); // Ambil data user yang sedang login

  // Fungsi untuk fetch data user
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Gagal mengambil data pengguna:", err);
      // Jika status 403 (Akses Ditolak), tampilkan pesan spesifik
      if (err.response && err.response.status === 403) {
        setError("Anda tidak memiliki izin untuk melihat halaman ini (Hanya Admin).");
      } else {
        setError("Gagal memuat data pengguna.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Pastikan hanya Admin yang mencoba fetch data
    if (currentUser && currentUser.role_id === 1) {
      fetchUsers();
    } else if (currentUser && currentUser.role_id !== 1) {
      setLoading(false);
      setError("Anda tidak memiliki izin untuk melihat halaman ini.");
    }
  }, [currentUser, fetchUsers]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Apakah Anda yakin ingin MENONAKTIFKAN pengguna ini? Akses pengguna akan dicabut, namun datanya tetap tersimpan (Soft Delete).")) {
      return;
    }

    try {
      await deleteUser(userId);
      alert("Pengguna berhasil dinonaktifkan!");
      // Refresh list setelah berhasil
      fetchUsers();
    } catch (err) {
      console.error("Gagal menonaktifkan pengguna:", err);
      alert(err.response?.data?.message || "Gagal menonaktifkan pengguna.");
    }
  };

  const getStatus = (user) => {
    return user.deleted_at ? 
      <span style={{ color: 'red', fontWeight: 'bold' }}>Nonaktif</span> : 
      <span style={{ color: 'green', fontWeight: 'bold' }}>Aktif</span>;
  };
  
  // Tampilkan loading/error jika tidak ada izin atau sedang memuat
  if (loading) return <p>Memuat data pengguna...</p>;
  if (error) return <p className="alert alert-error">{error}</p>;
  
  // Setelah dipastikan Admin dan data sudah ter-load
  return (
    <div className="content-container">
      <div className="content-header">
        <h2>Manajemen Pengguna</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <i className="fas fa-plus"></i> Tambah Pengguna
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Role ID</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={user.deleted_at ? { backgroundColor: '#fdd' } : {}}>
                  <td>{user.id}</td>
                  <td>{user.nama_lengkap}</td>
                  <td>{user.email}</td>
                  <td>{user.role_id}</td>
                  <td>{getStatus(user)}</td>
                  <td>
                    {/* Cegah Admin menghapus dirinya sendiri */}
                    {currentUser.id !== user.id ? (
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={!!user.deleted_at} // Nonaktifkan tombol jika sudah nonaktif
                      >
                        {user.deleted_at ? 'Sudah Nonaktif' : 'Nonaktifkan'}
                      </button>
                    ) : (
                      <button className="btn btn-sm" disabled>Akun Anda</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUserAdded={fetchUsers} // Panggil fetchUsers untuk me-refresh tabel
      />
    </div>
  );
}

export default ManajemenPenggunaPage;