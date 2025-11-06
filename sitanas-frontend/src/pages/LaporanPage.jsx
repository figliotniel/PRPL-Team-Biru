import React, { useState, useEffect } from 'react';
import { getLaporan, getMasterData } from 'services/tanahService';
import 'assets/Layout.css';

// Helper untuk format Tanggal
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};

function LaporanPage() {
    const [filters, setFilters] = useState({
        tanggal_mulai: '',
        tanggal_selesai: '',
        status_validasi: '',
        asal_perolehan: ''
    });
    const [masterData, setMasterData] = useState({ asal: [] });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [laporanDibuat, setLaporanDibuat] = useState(false); // Untuk header cetak

    // Ambil data master untuk filter (Asal Perolehan)
    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const data = await getMasterData();
                setMasterData({ asal: data.asal || [] });
            } catch (err) {
                console.error("Gagal memuat master data untuk filter:", err);
            }
        };
        fetchMaster();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk memanggil API
    const handleGenerateLaporan = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setLaporanDibuat(false);
        try {
            const data = await getLaporan(filters);
            setResults(data);
            setLaporanDibuat(true); // Tampilkan header laporan
        } catch (err) {
            setError('Gagal mengambil data laporan. Pastikan backend siap.');
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mencetak
    const handlePrint = () => {
        window.print();
    };

    // CSS untuk Halaman Cetak
    const printStyles = `
        @media print {
            body * {
                visibility: hidden;
            }
            .printable-area, .printable-area * {
                visibility: visible;
            }
            .printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .content-header, .filter-form, .btn {
                display: none !important;
            }
            .card {
                box-shadow: none;
                border: 1px solid #ccc;
            }
            table {
                width: 100%;
                font-size: 10pt;
            }
            th, td {
                padding: 4px 8px;
            }
            .report-header {
                display: block !important;
                margin-bottom: 20px;
                text-align: center;
            }
            @page {
                size: A4 landscape;
                margin: 20mm;
            }
        }
    `;

    return (
        <div>
            <style>{printStyles}</style>

            <div className="content-header">
                <h1>Laporan Aset Tanah</h1>
                <div>
                    <button 
                        onClick={handlePrint} 
                        className="btn btn-info" 
                        disabled={!laporanDibuat || results.length === 0}
                    >
                        <i className="fas fa-print"></i> Cetak Laporan
                    </button>
                </div>
            </div>

            {/* Area Filter (Tidak ikut dicetak) */}
            <div className="card filter-form">
                <div className="card-header"><h4>Filter Laporan</h4></div>
                <div className="card-body">
                    <form onSubmit={handleGenerateLaporan} className="filter-form" style={{gridTemplateColumns: '1fr 1fr 1fr 1fr auto', alignItems: 'flex-end'}}>
                        <div className="form-group">
                            <label>Tanggal Perolehan (Mulai)</label>
                            <input 
                                type="date" 
                                name="tanggal_mulai" 
                                className="form-control"
                                value={filters.tanggal_mulai}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tanggal Perolehan (Selesai)</label>
                            <input 
                                type="date" 
                                name="tanggal_selesai" 
                                className="form-control"
                                value={filters.tanggal_selesai}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status Validasi</label>
                            <select 
                                name="status_validasi" 
                                className="form-control"
                                value={filters.status_validasi}
                                onChange={handleFilterChange}
                            >
                                <option value="">Semua Status</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Asal Perolehan</label>
                            <select 
                                name="asal_perolehan" 
                                className="form-control"
                                value={filters.asal_perolehan}
                                onChange={handleFilterChange}
                            >
                                <option value="">Semua Asal</option>
                                {masterData.asal.map(asal => (
                                    <option key={asal.id} value={asal.nama}>{asal.nama}</option>
                                ))}
                            </select>
                        </div>
                        
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Memuat..." : <><i className="fas fa-filter"></i> Terapkan</>}
                        </button>
                    </form>
                </div>
            </div>

            {error && <div className="notification error">{error}</div>}

            {/* Area Laporan (Ikut dicetak) */}
            <div className="printable-area">
                
                {/* Header Laporan (Hanya tampil saat dicetak atau setelah generate) */}
                <div className="report-header" style={{display: laporanDibuat ? 'block' : 'none', marginBottom: '20px'}}>
                    <h2 style={{textAlign: 'center', margin: 0}}>Laporan Rekapitulasi Aset Tanah</h2>
                    <h4 style={{textAlign: 'center', margin: 0, fontWeight: 'normal'}}>
                        Periode: {filters.tanggal_mulai ? formatDate(filters.tanggal_mulai) : 'Semua'} s/d {filters.tanggal_selesai ? formatDate(filters.tanggal_selesai) : 'Semua'}
                    </h4>
                    <p style={{textAlign: 'center', margin: 0, fontSize: '10pt'}}>
                        Status: {filters.status_validasi || 'Semua'} | Asal Perolehan: {filters.asal_perolehan || 'Semua'}
                    </p>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h4>Hasil Laporan ({results.length} data ditemukan)</h4>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Kode Barang</th>
                                        <th>Asal Perolehan</th>
                                        <th>Tgl. Perolehan</th>
                                        <th>Luas (m²)</th>
                                        <th>Lokasi</th>
                                        <th>Penggunaan</th>
                                        <th>Status Sertifikat</th>
                                        <th>No. Sertifikat</th>
                                        <th>Status Validasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr><td colSpan="10" style={{textAlign: 'center'}}>Memuat data...</td></tr>
                                    )}
                                    {!loading && results.length > 0 ? (
                                        results.map((aset, index) => (
                                            <tr key={aset.id}>
                                                <td>{index + 1}</td>
                                                <td>{aset.kode_barang}</td>
                                                <td>{aset.asal_perolehan}</td>
                                                <td>{formatDate(aset.tanggal_perolehan)}</td>
                                                <td>{aset.luas?.toLocaleString('id-ID')}</td>
                                                <td>{aset.lokasi}</td>
                                                <td>{aset.penggunaan}</td>
                                                <td>{aset.status_sertifikat}</td>
                                                <td>{aset.nomor_sertifikat}</td>
                                                <td>
                                                    <span className={`status ${aset.status_validasi?.toLowerCase()}`}>{aset.status_validasi}</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        !loading && (
                                            <tr><td colSpan="10" style={{textAlign: 'center'}}>
                                                {laporanDibuat ? 'Tidak ada data ditemukan.' : 'Silakan terapkan filter untuk melihat laporan.'}
                                            </td></tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default LaporanPage;