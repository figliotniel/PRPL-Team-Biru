// src/pages/ManajemenTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFileAlt } from 'react-icons/fa';

import { getStats, deleteTanah } from '../services/tanahService';
import AddTanahModal from '../components/common/AddTanahModal';
import DokumenModal from '../components/common/DokumenModal';

function ManajemenTanahPage() {
  const [tanah, setTanah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTanah, setEditingTanah] = useState(null);

  const [isDokumenModalOpen, setIsDokumenModalOpen] = useState(false);
  const [selectedTanah, setSelectedTanah] = useState(null);

  useEffect(() => {
    const fetchTanah = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllTanah();
        setTanah(data);
      } catch (err) {
        console.error('Gagal mengambil data tanah:', err);
        setError('Gagal memuat data tanah. Coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTanah();
  }, []);

  const handleAdd = () => {
    setEditingTanah(null);
    setIsModalOpen(true);
  };

  const handleEdit = (data) => {
    setEditingTanah(data);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data tanah ini?')) {
      try {
        await deleteTanah(id);
        setTanah(tanah.filter(item => item.id !== id));
      } catch (err) {
        console.error('Gagal menghapus data tanah:', err);
        setError('Gagal menghapus data tanah.');
      }
    }
  };
  
  const handleOpenDokumen = (tanah) => {
    setSelectedTanah(tanah);
    setIsDokumenModalOpen(true);
  };

  const handleSave = (savedData, isEdit) => {
    if (isEdit) {
      setTanah(tanah.map(item => 
        item.id === savedData.id ? savedData : item
      ));
    } else {
      setTanah(currentTanah => [...currentTanah, savedData]);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading data tanah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification error">{error}</div>
    );
  }

  return (
    <div className="page-content">
      <div className="header-container">
        <h2>Manajemen Tanah Kas Desa</h2>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FaPlus /> Tambah Data Tanah
        </button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Bidang</th>
              <th>Lokasi</th>
              <th>Luas (m²)</th>
              <th>Status Kepemilikan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tanah.length > 0 ? (
              tanah.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.nama_bidang}</td>
                  <td>{item.lokasi}</td>
                  <td>{item.luas ? item.luas.toLocaleString('id-ID') : 0}</td>
                  <td>{item.status_kepemilikan}</td>
                  <td>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleOpenDokumen(item)} 
                      title="Dokumen Pendukung"
                    >
                      <FaFileAlt />
                    </button>
                    <button className="btn-icon" onClick={() => handleEdit(item)} title="Edit Data">
                      <FaEdit />
                    </button>
                    <button className="btn-icon btn-danger" onClick={() => handleDelete(item.id)} title="Hapus Data">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Belum ada data tanah kas desa.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal untuk Tambah/Edit Tanah */}
      <AddTanahModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        tanahToEdit={editingTanah}
      />

      {/* Modal Dokumen */}
      <DokumenModal
        isOpen={isDokumenModalOpen}
        onClose={() => setIsDokumenModalOpen(false)}
        tanahId={selectedTanah?.id}
        tanahName={selectedTanah?.nama_bidang}
      />
      
    </div>
  );
}

export default ManajemenTanahPage;