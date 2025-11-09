import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../assets/LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // Redirect jika sudah login
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Jika sukses, useEffect akan handle redirect
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                border: '1px solid #fca5a5'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Loading...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="divider">atau</div>
          
          <p style={{textAlign: 'center', color: '#6b7280', fontSize: '0.875rem'}}>
            Halaman publik (coming soon)
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;