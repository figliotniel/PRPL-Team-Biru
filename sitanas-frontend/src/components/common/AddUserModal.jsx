// src/components/common/AddUserModal.jsx
import React, { useState, useEffect } from 'react';
import { createUser, getRoles } from '../../services/userService';
import { generatePassword } from '../../utils/passwordGenerator';

function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    role_id: '',
    password: '',
    password_confirmation: '',
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state saat modal dibuka
      setFormData({
        nama_lengkap: '',
        email: '',
        role_id: '',
        password: '',
        password_confirmation: '',
      });
      setError(null);
      setSuccess(false);
      fetchRoles();
    }
  }, [isOpen]);

  const fetchRoles = async () => {
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
      // Set role_id default ke role pertama (atau biarkan kosong jika ada placeholder)
      if (rolesData.length > 0) {
        setFormData(prev => ({ ...prev, role_id: rolesData[0].id.toString() }));
      }
    } catch (err) {
      console.error("Gagal mengambil Roles:", err);
      setError("Gagal memuat daftar role.");
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData(prev => ({
      ...prev,
      password: newPassword,
      password_confirmation: newPassword,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Cek password match
    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      await createUser(formData);
      setSuccess(true);
      // Panggil fungsi refresh di parent page
      if (onUserAdded) {
        onUserAdded();
      }
      // Tunggu sebentar sebelum menutup modal
      setTimeout(onClose, 1500); 

    } catch (err) {
      console.error("Error saat membuat pengguna:", err);
      // Coba ambil pesan error dari backend Laravel
      const apiError = err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Gagal membuat pengguna.";
      setError(apiError);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3>Tambah Pengguna Baru</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          
          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">Pengguna berhasil dibuat!</p>}

          <div className="input-group">
            <label htmlFor="nama_lengkap">Nama Lengkap</label>
            <input type="text" id="nama_lengkap" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="role_id">Role Pengguna</label>
            <select id="role_id" name="role_id" value={formData.role_id} onChange={handleChange} required>
              <option value="" disabled>Pilih Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.nama_role}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="Password" />
              <button type="button" className="btn btn-secondary" onClick={handleGeneratePassword} style={{ whiteSpace: 'nowrap' }}>
                Generate
              </button>
            </div>
          </div>
          
          {/* Laravel membutuhkan 'password_confirmation' untuk validasi 'confirmed' */}
          <div className="input-group">
            <label htmlFor="password_confirmation">Konfirmasi Password</label>
            <input type="text" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required minLength="6" placeholder="Ulangi Password" />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading || success}>
            {isLoading ? 'Menyimpan...' : 'Simpan Pengguna'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;