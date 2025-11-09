// src/pages/ManajemenPenggunaPage.jsx
import React, { useState, useEffect } from 'react';
// Hanya import ikon yang kita pakai di halaman ini
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import AddUserModal from '../components/common/AddUserModal';

// Import service HANYA untuk user
import { getAllUsers, deleteUser } from '../services/userService'; 

function ManajemenPenggunaPage() {
  const [users, setUsers] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);     
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Gagal mengambil data pengguna:', err);
        setError('Gagal memuat data pengguna. Coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fungsi ini dipanggil setelah modal 'AddUserModal' berhasil create user
  const handleUserAdded = (newUserFromApi) => {
    setUsers((currentUsers) => [...currentUsers, newUserFromApi]);
  };

  const handleEdit = (user) => {
    console.log('Edit user:', user);
    // TODO: Implementasi logika edit (misal: buka modal edit)
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error('Gagal menghapus pengguna:', err);
        setError('Gagal menghapus pengguna.');
      }
    }
  };

  // --- Render (Tampilan) ---
  if (isLoading) {
    return (
      <div className="page-content">
        <h2>Manajemen Pengguna</h2>
        <p>Loading data pengguna...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-content">
        <h2>Manajemen Pengguna</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="header-container">
        <h2>Manajemen Pengguna</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <FaPlus /> Tambah Pengguna
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role ? user.role.name : 'N/A'}</td> 
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(user)} title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(user.id)} title="Hapus">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Belum ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}

export default ManajemenPenggunaPage;