import React, { useState } from 'react';
import '../../assets/AddUserModal.css';
import { generatePassword } from '../../utils/passwordGenerator';

// 1. Import service createUser
import { createUser } from '../../services/userService'; 

// Props 'onSave' sekarang kita ganti namanya jadi 'onUserAdded'
// agar lebih jelas fungsinya
function AddUserModal({ isOpen, onClose, onUserAdded }) { 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Asumsi '1' = Admin, '2' = User/Pengguna. Sesuaikan jika perlu.
  const [role, setRole] = useState('2'); 

  // 2. Tambah state untuk loading dan error di dalam modal
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleGeneratePassword = () => {
    setPassword(generatePassword(12)); // Buat password 12 karakter
  };

  // 3. Ubah handleSubmit menjadi async untuk memanggil API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi sederhana
    if (!name || !email || !password || !role) {
      setError('Semua field harus diisi.');
      setIsLoading(false);
      return;
    }
    
    try {
      // 4. Susun data dan panggil API
      // Perhatikan: Backend Anda kemungkinan besar mengharapkan 'role_id'
      const userData = {
        name,
        email,
        password,
        role_id: parseInt(role) // Kirim ID role (bukan string 'Admin')
      };
      
      // Panggil API. Asumsi backend merespon dengan data user yang baru dibuat
      const response = await createUser(userData); 

      // 5. Panggil callback 'onUserAdded' dengan data baru dari API
      // 'response.data' atau 'response' tergantung setup backend Anda
      onUserAdded(response.data || response); 

      // 6. Reset form dan tutup modal (HANYA JIKA SUKSES)
      setName('');
      setEmail('');
      setPassword('');
      setRole('2');
      onClose();

    } catch (err) {
      console.error('Gagal menambah user:', err);
      // Tangani error validasi dari Laravel
      if (err.errors) {
        const firstError = Object.values(err.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.message || 'Terjadi kesalahan saat menambah pengguna.');
      }
    } finally {
      setIsLoading(false); // Selalu stop loading
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Pengguna Baru</h2>
        
        {/* Tampilkan error di dalam modal */}
        {error && <p className="modal-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button type="button" onClick={handleGeneratePassword} className="btn-secondary" disabled={isLoading}>
                Generate
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="1">Admin</option>
              <option value="2">User</option>
              {/* TODO: Ambil daftar role dari API jika perlu */}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUserModal;