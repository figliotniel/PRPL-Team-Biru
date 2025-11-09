// src/components/common/DokumenModal.jsx
import React, { useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaFilePdf, FaFileImage, FaFileAlt } from 'react-icons/fa';

// 1. Import service dokumen
import { getAllDokumen, uploadDokumen, deleteDokumen } from '../../services/dokumenPendukungService';

// Gunakan CSS yang sama
import '../../assets/AddUserModal.css'; 

// Helper untuk ikon
const FileIcon = ({ jenis }) => {
  if (jenis.toLowerCase() === 'pdf') return <FaFilePdf style={{ color: '#E53E3E' }} />;
  if (['jpg', 'jpeg', 'png'].includes(jenis.toLowerCase())) return <FaFileImage style={{ color: '#48BB78' }} />;
  return <FaFileAlt />;
};

function DokumenModal({ isOpen, onClose, tanahId, tanahName }) {
  
  // 2. State untuk list dokumen
  const [dokumenList, setDokumenList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. State untuk form upload
  const [namaDokumen, setNamaDokumen] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('Sertifikat');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // 4. useEffect untuk fetch data dokumen saat modal dibuka
  useEffect(() => {
    if (isOpen && tanahId) {
      const fetchDokumen = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getAllDokumen(tanahId);
          setDokumenList(data);
        } catch (err) {
          setError('Gagal memuat daftar dokumen.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDokumen();
    }
  }, [isOpen, tanahId]); // Jalan tiap kali modal dibuka / tanahId berubah

  // Handle file dipilih
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 5. Handle SUBMIT UPLOAD
  const handleSubmitUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !namaDokumen || !jenisDokumen) {
      setUploadError('Semua field (Nama, Jenis, dan File) wajib diisi.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // 6. Buat FormData untuk kirim file
    const formData = new FormData();
    formData.append('tanah_id', tanahId);
    formData.append('nama_dokumen', namaDokumen);
    formData.append('jenis_dokumen', jenisDokumen);
    formData.append('file', selectedFile); // 'file' harus cocok dengan backend

    try {
      const newDokumen = await uploadDokumen(formData);
      // Langsung tambahkan ke list
      setDokumenList(currentList => [newDokumen, ...currentList]);
      
      // Reset form
      setNamaDokumen('');
      setSelectedFile(null);
      e.target.reset(); // Reset input file

    } catch (err) {
      setUploadError(err.message || 'Upload gagal.');
    } finally {
      setIsUploading(false);
    }
  };

  // 7. Handle HAPUS Dokumen
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus dokumen ini? File fisik juga akan dihapus.')) {
      try {
        await deleteDokumen(id);
        // Hapus dari state
        setDokumenList(dokumenList.filter(doc => doc.id !== id));
      } catch (err) {
        setError('Gagal menghapus dokumen.');
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  // Render form
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <h2>Dokumen Pendukung</h2>
        <p style={{ marginTop: '-1rem', marginBottom: '1.5rem' }}>
          Untuk: <strong>{tanahName || '...'}</strong>
        </p>
        
        {/* --- FORM UPLOAD --- */}
        <form onSubmit={handleSubmitUpload} className="upload-form">
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            <FaUpload /> Upload Dokumen Baru
          </h4>
          {uploadError && <p className="modal-error">{uploadError}</p>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label htmlFor="nama_dokumen">Nama Dokumen</label>
              <input type="text" id="nama_dokumen" value={namaDokumen}
                onChange={(e) => setNamaDokumen(e.target.value)}
                disabled={isUploading}
              />
            </div>
            <div className="form-group" style={{ flex: '1 1 150px' }}>
              <label htmlFor="jenis_dokumen">Jenis</label>
              <select id="jenis_dokumen" value={jenisDokumen}
                onChange={(e) => setJenisDokumen(e.target.value)}
                disabled={isUploading}
              >
                <option value="Sertifikat">Sertifikat</option>
                <option value="Peta Bidang">Peta Bidang</option>
                <option value="Akta Jual Beli">Akta Jual Beli</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="file">Pilih File (PDF, JPG, PNG - Max 5MB)</label>
            <input type="file" id="file"
              onChange={handleFileChange}
              disabled={isUploading}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isUploading || !selectedFile}>
            {isUploading ? 'Mengupload...' : 'Upload'}
          </button>
        </form>

        {/* --- DAFTAR DOKUMEN --- */}
        <div className="dokumen-list" style={{ marginTop: '2rem' }}>
          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Dokumen Tersimpan
          </h4>
          {isLoading && <p>Loading dokumen...</p>}
          {error && <p className="modal-error">{error}</p>}
          
          <ul style={{ listStyle: 'none', paddingLeft: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {dokumenList.length > 0 ? (
              dokumenList.map(doc => (
                <li key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileIcon jenis={doc.jenis_dokumen} />
                    <div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, textDecoration: 'none' }}>
                        {doc.nama_dokumen}
                      </a>
                      <small style={{ display: 'block', color: '#777' }}>{doc.jenis_dokumen}</small>
                    </div>
                  </div>
                  <button className="btn-icon btn-danger" onClick={() => handleDelete(doc.id)}>
                    <FaTrash />
                  </button>
                </li>
              ))
            ) : (
              !isLoading && <p style={{ textAlign: 'center', color: '#777' }}>Belum ada dokumen.</p>
            )}
          </ul>
        </div>
        
        <div className="modal-actions" style={{ marginTop: '1rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default DokumenModal;