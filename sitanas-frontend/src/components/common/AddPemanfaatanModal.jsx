import React, { useState, useEffect } from 'react';
import { createPemanfaatan, updatePemanfaatan } from '../../services/pemanfaatanTanahService';
import { getStats } from '../../services/tanahService';
import '../../assets/AddUserModal.css'; 

const formatDateToInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};
function AddPemanfaatanModal({ isOpen, onClose, onSave, dataToEdit }) {
  
  // 2. Tentukan mode
  const isEditMode = Boolean(dataToEdit);
  const modalTitle = isEditMode ? 'Edit Pemanfaatan Tanah' : 'Catat Pemanfaatan Baru';
  const buttonText = isEditMode ? 'Update' : 'Simpan';

  // 3. State untuk list tanah (dropdown)
  const [tanahList, setTanahList] = useState([]);

  // 4. State untuk form
  const [formData, setFormData] = useState({
    tanah_id: '',
    nama_pemanfaat: '',
    bentuk_pemanfaatan: 'Sewa', // Default value
    tanggal_mulai: '',
    tanggal_selesai: '',
    keterangan: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 5. useEffect untuk mengambil data tanah (untuk dropdown)
  useEffect(() => {
    // Hanya fetch jika modal terbuka dan data tanah belum ada
    if (isOpen && tanahList.length === 0) {
      const fetchTanah = async () => {
        try {
          const data = await getAllTanah();
          setTanahList(data);
        } catch (err) {
          console.error("Gagal load data tanah:", err);
          setError("Gagal memuat daftar tanah. Coba tutup dan buka lagi modal.");
        }
      };
      fetchTanah();
    }
  }, [isOpen, tanahList.length]);

  // 6. useEffect untuk mengisi form jika mode 'edit'
  useEffect(() => {
    if (isEditMode && dataToEdit) {
      setFormData({
        tanah_id: dataToEdit.tanah_id || '',
        nama_pemanfaat: dataToEdit.nama_pemanfaat || '',
        bentuk_pemanfaatan: dataToEdit.bentuk_pemanfaatan || 'Sewa',
        tanggal_mulai: formatDateToInput(dataToEdit.tanggal_mulai),
        tanggal_selesai: formatDateToInput(dataToEdit.tanggal_selesai),
        keterangan: dataToEdit.keterangan || '',
      });
    } else {
      // Reset form
      setFormData({
        tanah_id: '',
        nama_pemanfaat: '',
        bentuk_pemanfaatan: 'Sewa',
        tanggal_mulai: '',
        tanggal_selesai: '',
        keterangan: '',
      });
    }
  }, [isOpen, isEditMode, dataToEdit]);

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 7. Handle submit (create atau update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi sederhana
    if (!formData.tanah_id || !formData.nama_pemanfaat || !formData.tanggal_mulai) {
      setError('Data Tanah, Nama Pemanfaat, dan Tanggal Mulai wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      let response;
      if (isEditMode) {
        // Panggil API update
        response = await updatePemanfaatan(dataToEdit.id, formData);
      } else {
        // Panggil API create
        response = await createPemanfaatan(formData);
      }

      // 8. Panggil callback 'onSave' dengan data baru/updated
      onSave(response, isEditMode);
      onClose(); // Tutup modal jika sukses

    } catch (err) {
      console.error('Gagal menyimpan data:', err);
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
            <label htmlFor="tanah_id">Pilih Bidang Tanah</label>
            <select
              id="tanah_id" name="tanah_id"
              value={formData.tanah_id} onChange={handleChange}
              disabled={isLoading} required
            >
              <option value="" disabled>-- Pilih Tanah --</option>
              {tanahList.length > 0 ? (
                tanahList.map(tanah => (
                  <option key={tanah.id} value={tanah.id}>
                    {tanah.nama_bidang} ({tanah.lokasi})
                  </option>
                ))
              ) : (
                <option disabled>Loading data tanah...</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="nama_pemanfaat">Nama Pemanfaat</label>
            <input
              type="text" id="nama_pemanfaat" name="nama_pemanfaat"
              value={formData.nama_pemanfaat} onChange={handleChange}
              disabled={isLoading} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bentuk_pemanfaatan">Bentuk Pemanfaatan</label>
            <select
              id="bentuk_pemanfaatan" name="bentuk_pemanfaatan"
              value={formData.bentuk_pemanfaatan} onChange={handleChange}
              disabled={isLoading}
            >
              <option value="Sewa">Sewa</option>
              <option value="Pinjam Pakai">Pinjam Pakai</option>
              <option value="Kerja Sama">Kerja Sama</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
            <input
              type="date" id="tanggal_mulai" name="tanggal_mulai"
              value={formData.tanggal_mulai} onChange={handleChange}
              disabled={isLoading} required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tanggal_selesai">Tanggal Selesai (Opsional)</label>
            <input
              type="date" id="tanggal_selesai" name="tanggal_selesai"
              value={formData.tanggal_selesai} onChange={handleChange}
              disabled={isLoading}
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

export default AddPemanfaatanModal;