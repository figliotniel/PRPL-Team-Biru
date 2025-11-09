// src/pages/PemanfaatanTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// 1. Import service yang baru kita buat
import { getAllPemanfaatan, deletePemanfaatan } from '../services/pemanfaatanTanahService';
import AddPemanfaatanModal from '../components/common/AddPemanfaatanModal';

// Fungsi helper untuk format tanggal
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};

function PemanfaatanTanahPage() {
  // 2. State untuk data, loading, dan error
  const [pemanfaatan, setPemanfaatan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null); // Untuk edit

  // 3. useEffect untuk mengambil data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Panggil service
        const data = await getAllPemanfaatan();
        setPemanfaatan(data);
      } catch (err) {
        console.error('Gagal mengambil data pemanfaatan:', err);
        setError('Gagal memuat data. Coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Jalan sekali

  // 4. Fungsi untuk handle CRUD
  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pemanfaatan ini?')) {
      try {
        await deletePemanfaatan(id);
        setPemanfaatan(pemanfaatan.filter(item => item.id !== id));
      } catch (err) {
        console.error('Gagal menghapus data:', err);
        setError('Gagal menghapus data.');
      }
    }
  };

  const handleSave = (savedData, isEdit) => {
    if (isEdit) {
    // Logika untuk UPDATE:
    // Ganti data lama di state dengan data baru
    setPemanfaatan(pemanfaatan.map(item => 
      item.id === savedData.id ? savedData : item
    ));
  } else {
    // Logika untuk CREATE:
    // Tambahkan data baru ke state
    setPemanfaatan(currentData => [savedData, ...currentData]); // Tampilkan di paling atas
  }
    console.log('Data disimpan:', savedData);
  };
  
  // --- Tampilan Render ---

  if (isLoading) {
    return (
      <div className="page-content">
        <h2>Pemanfaatan Tanah Kas Desa</h2>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <h2>Pemanfaatan Tanah Kas Desa</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="header-container">
        <h2>Pemanfaatan Tanah Kas Desa</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaPlus /> Catat Pemanfaatan Baru
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Bidang Tanah</th>
              <th>Nama Pemanfaat</th>
              <th>Bentuk Pemanfaatan</th>
              <th>Tgl. Mulai</th>
              <th>Tgl. Selesai</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pemanfaatan.length > 0 ? (
              pemanfaatan.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  {/* Ambil nama tanah dari relasi */}
                  <td>{item.tanah_kas_desa ? item.tanah_kas_desa.nama_bidang : 'N/A'}</td>
                  <td>{item.nama_pemanfaat}</td>
                  <td>{item.bentuk_pemanfaatan}</td>
                  <td>{formatDate(item.tanggal_mulai)}</td>
                  <td>{formatDate(item.tanggal_selesai)}</td>
                  <td>
                    <button className="btn-icon" onClick={() => handleEdit(item)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(item.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  Belum ada data pemanfaatan tanah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {<AddPemanfaatanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        dataToEdit={editingData}
      />
      }
    </div>
  );
}

export default PemanfaatanTanahPage;