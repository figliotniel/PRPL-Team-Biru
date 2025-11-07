import React from 'react';
import { Link } from 'react-router-dom';
// Gunakan path relatif dari folder 'pages' ke 'assets'
import '../assets/Layout.css'; 

function NotFoundPage() {
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: '#333',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f4f7f6'
  };
  
  const h1Style = {
    fontSize: 'clamp(5rem, 20vw, 10rem)', // Font responsif
    fontWeight: '900',
    color: '#E0E0E0', // Abu-abu muda
    margin: '0',
    lineHeight: '1'
  };

  const h2Style = {
    fontSize: '2rem',
    margin: '20px 0 10px 0',
    fontWeight: '600',
    color: '#444'
  };

  const pStyle = {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '30px'
  };

  return (
    <div style={pageStyle}>
      <h1 style={h1Style}>404</h1>
      <h2 style={h2Style}>Halaman Tidak Ditemukan</h2>
      <p style={pStyle}>Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
      {/* Kita asumsikan .btn dan .btn-primary ada di Layout.css */}
      <Link to="/dashboard" className="btn btn-primary">
        <i className="fas fa-home"></i> Kembali ke Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;