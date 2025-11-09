import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // Impor hook useAuth
import '../assets/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, setError } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Email dan password harus diisi.");
      return;
    }
    await login(email, password);
  };

  // Fungsi helper untuk membersihkan error saat pengguna mengetik
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null); // Hapus error jika ada
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null); // Hapus error jika ada
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h2>SITANAS</h2>
            <p>Sistem Informasi Tanah Kas Desa</p>
            <p>Silakan masuk untuk melanjutkan ke dashboard.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Tampilkan error dari context */}
            {error && <p className="login-error-message">{error}</p>}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="input-field"
                required
                placeholder="Masukkan email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
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
                onChange={handlePasswordChange} // Gunakan handler baru
                disabled={isLoading} // Nonaktifkan saat loading
              />
            </div>
            
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