// src/pages/LaporanPage.jsx
import React, { useState } from 'react';
import { FaFileDownload } from 'react-icons/fa';

// 1. Import service baru
import { generateReport } from '../services/reportService';

// Fungsi helper untuk mendapatkan tanggal hari ini (YYYY-MM-DD)
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

function LaporanPage() {
  // 2. State untuk filter
  const [reportType, setReportType] = useState('tanah'); // 'tanah' atau 'logs'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(getTodayDate());

  // 3. State untuk data, loading, dan error
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4. Fungsi untuk handle generate laporan
  const handleGenerate = async () => {
    if (!startDate) {
      setError('Tanggal mulai harus diisi.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportData([]); // Kosongkan data lama

    try {
      const options = {
        type: reportType,
        startDate,
        endDate,
      };
      const data = await generateReport(options);
      setReportData(data);
    } catch (err) {
      console.error('Gagal generate laporan:', err);
      setError(err.message || 'Gagal mengambil data laporan.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 5. Fungsi (dummy) untuk print/download
  const handleDownload = () => {
    alert('Fitur download/print belum diimplementasikan. \nAnda bisa menggunakan Ctrl+P untuk print halaman ini.');
    // Di aplikasi nyata, ini akan memanggil library seperti jsPDF atau react-to-print
  };

  // 6. Fungsi untuk merender tabel berdasarkan tipe laporan
  const renderReportTable = () => {
    if (isLoading) {
      return <p>Loading data laporan...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (reportData.length === 0) {
      return <p>Silakan generate laporan untuk melihat data.</p>;
    }

    // --- Tabel untuk Laporan Tanah ---
    if (reportType === 'tanah') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Bidang</th>
              <th>Lokasi</th>
              <th>Luas (m²)</th>
              <th>Status</th>
              <th>Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_bidang}</td>
                <td>{item.lokasi}</td>
                <td>{item.luas ? item.luas.toLocaleString('id-ID') : 0}</td>
                <td>{item.status_kepemilikan}</td>
                <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // --- Tabel untuk Laporan Log Aktivitas ---
    if (reportType === 'logs') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Pengguna</th>
              <th>Aktivitas</th>
              <th>Waktu</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.user ? item.user.name : 'Sistem'}</td>
                <td>{item.deskripsi}</td>
                <td>{new Date(item.created_at).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    
    return null;
  };

  return (
    <div className="page-content">
      <div className="header-container">
        <h2>Generate Laporan</h2>
        <button className="btn btn-secondary" onClick={handleDownload} disabled={reportData.length === 0}>
          <FaFileDownload /> Download PDF
        </button>
      </div>

      {/* --- Filter Bar --- */}
      <div className="filter-bar" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div>
          <label>Tipe Laporan</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="tanah">Data Tanah Kas Desa</option>
            <option value="logs">Log Aktivitas</option>
          </select>
        </div>
        <div>
          <label>Tanggal Mulai</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>Tanggal Selesai</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* --- Hasil Laporan --- */}
      <div className="report-content">
        <h3>Hasil Laporan: {reportType === 'tanah' ? 'Data Tanah' : 'Log Aktivitas'}</h3>
        <p>Periode: {startDate || '...'} s/d {endDate || '...'}</p>
        <div className="table-responsive">
          {renderReportTable()}
        </div>
      </div>
    </div>
  );
}

export default LaporanPage;