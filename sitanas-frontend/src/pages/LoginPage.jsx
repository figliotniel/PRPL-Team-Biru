// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Impor useNavigate
import { useAuth } from '../hooks/useAuth'; // 2. Impor useAuth
import '../assets/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 3. Inisialisasi hook navigasi
  const { login } = useAuth(); // 4. Ambil fungsi 'login' dari context

  const handleSubmit = async (event) => { // 5. Ubah jadi 'async'
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 6. Panggil fungsi login dari context (masih simulasi)
      await login(email, password);
      
      // 7. Jika sukses, pindah ke halaman dashboard
      navigate('/dashboard');

    } catch (err) {
      // 8. Jika gagal, tampilkan error
      setError(err.message || 'Login gagal, coba lagi.');
      setIsLoading(false);
    }
    // Tidak perlu setIsLoading(false) di sini jika sukses,
    // karena kita akan pindah halaman
  };

  // ... (bagian JSX / return tidak berubah)
  // ... (pastikan form-mu masih memanggil onSubmit={handleSubmit})
  
  return (
    // ... (kode JSX-mu yang sudah ada)
    // ... (pastikan <form onSubmit={handleSubmit}>)
    // ... (pastikan <button disabled={isLoading}>)
    // ...
    <div className="auth-container">
      <div className="auth-branding">
        <div className="auth-branding-logo">
          <i className="fas fa-landmark"></i>
        </div>
        <h1 className="auth-branding-title">SITANAS</h1>
        <p className="auth-branding-desc">
          Sistem Informasi Tanah Kas Desa untuk pengelolaan aset yang transparan
          dan efisien.
        </p>
      </div>

      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Selamat Datang Kembali</h2>
            <p>Silakan masuk untuk melanjutkan ke dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="input-field"
                required
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                required
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className="divider">atau</div>
          
          <p style={{textAlign: 'center'}}>
            Halaman publik (coming soon)
          </p>
          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;