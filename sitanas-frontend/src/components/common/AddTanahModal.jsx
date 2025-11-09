import React, { useState, useEffect } from 'react';

// 1. Import service create dan update
import { createTanah, updateTanah } from '../../services/tanahService';
// Gunakan CSS yang sama dengan AddUserModal
import '../../assets/AddUserModal.css'; 

function AddTanahModal({ isOpen, onClose, onSave, tanahToEdit }) {
  
  // 2. Tentukan mode 'edit' atau 'tambah'
  const isEditMode = Boolean(tanahToEdit);
  const modalTitle = isEditMode ? 'Edit Data Tanah' : 'Tambah Data Tanah Baru';
  const buttonText = isEditMode ? 'Update' : 'Simpan';

  // 3. State untuk semua field form
  const [formData, setFormData] = useState({
    nama_bidang: '',
    lokasi: '',
    luas: 0,
    status_kepemilikan: 'Milik Desa', // Default value
    koordinat_bidang: '',
    keterangan: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4. useEffect untuk mengisi form jika mode 'edit'
  useEffect(() => {
    if (isEditMode && tanahToEdit) {
      // Jika edit, isi form dengan data yang ada
      setFormData({
        nama_bidang: tanahToEdit.nama_bidang || '',
        lokasi: tanahToEdit.lokasi || '',
        luas: tanahToEdit.luas || 0,
        status_kepemilikan: tanahToEdit.status_kepemilikan || 'Milik Desa',
        koordinat_bidang: tanahToEdit.koordinat_bidang || '',
        keterangan: tanahToEdit.keterangan || '',
      });
    } else {
      // Jika mode tambah, reset form
      setFormData({
        nama_bidang: '',
        lokasi: '',
        luas: 0,
        status_kepemilikan: 'Milik Desa',
        koordinat_bidang: '',
        keterangan: '',
      });
    }
  }, [isOpen, isEditMode, tanahToEdit]); // Jalankan tiap kali modal dibuka

  // 5. Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 6. Handle submit (bisa create atau update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isEditMode) {
        // Panggil API update
        response = await updateTanah(tanahToEdit.id, formData);
      } else {
        // Panggil API create
        response = await createTanah(formData);
      }

      // 7. Panggil callback 'onSave' dengan data baru/updated
      onSave(response.data || response, isEditMode);
      onClose(); // Tutup modal jika sukses

    } catch (err) {
      console.error('Gagal menyimpan data tanah:', err);
      if (err.errors) {
        const firstError = Object.values(err.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.message || 'Terjadi kesalahan saat menyimpan data.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  // Render form
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{modalTitle}</h2>
        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nama_bidang">Nama Bidang/Persil</label>
            <input
              type="text" id="nama_bidang" name="nama_bidang"
              value={formData.nama_bidang} onChange={handleChange}
              disabled={isLoading} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lokasi">Lokasi (Dusun/Blok)</label>
            <input
              type="text" id="lokasi" name="lokasi"
              value={formData.lokasi} onChange={handleChange}
              disabled={isLoading} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="luas">Luas (m²)</label>
            <input
              type="number" id="luas" name="luas"
              value={formData.luas} onChange={handleChange}
              disabled={isLoading} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status_kepemilikan">Status Kepemilikan</label>
            <select
              id="status_kepemilikan" name="status_kepemilikan"
              value={formData.status_kepemilikan} onChange={handleChange}
              disabled={isLoading}
            >
              <option value="Milik Desa">Milik Desa</option>
              <option value="Sewa">Sewa</option>
              <option value="Aset Pemda">Aset Pemda</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="koordinat_bidang">Koordinat (Opsional)</label>
            <input
              type="text" id="koordinat_bidang" name="koordinat_bidang"
              value={formData.koordinat_bidang} onChange={handleChange}
              disabled={isLoading} placeholder="Contoh: -7.123, 110.456"
            />
          </div>

          <div className="form-group">
            <label htmlFor="keterangan">Keterangan (Opsional)</label>
            <textarea
              id="keterangan" name="keterangan"
              value={formData.keterangan} onChange={handleChange}
              disabled={isLoading} rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTanahModal;