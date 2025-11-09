import React, { useState, useEffect } from 'react';
import { getStats, getTanahList } from '../services/tanahService'; // <-- Pastikan getTanahList diimpor
import StatCard from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth'; 
import { Link } from 'react-router-dom';
import '../assets/Layout.css';

function DashboardPage() {
    const { user } = useAuth();
    
    // State untuk data yang diambil
    const [stats, setStats] = useState({ total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 });
    const [tanahData, setTanahData] = useState(null); // <-- Harus menampung objek paginasi Laravel
    
    // State untuk filter dan pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(user?.role_id === 3 ? 'Disetujui' : '');
    const [currentPage, setCurrentPage] = useState(1);
    
    // State UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi utama untuk mengambil data
    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Logika untuk role BPD: hanya boleh lihat yang Disetujui
            const statusToFetch = user?.role_id === 3 ? 'Disetujui' : filterStatus;

            const [statsResponse, tanahResponse] = await Promise.all([
                getStats(),
                getTanahList(currentPage, statusToFetch, searchTerm), // <-- Mengambil data dengan Paginasi
            ]);

            setStats(statsResponse);
            setTanahData(tanahResponse); // <-- Mengisi state dengan respons paginasi
            
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data Dashboard. Coba reset filter atau periksa koneksi.");
        } finally {
            setLoading(false);
        }
    };

    // Panggil API setiap kali state filter atau halaman berubah
    useEffect(() => {
        fetchData();
    }, [currentPage, filterStatus, searchTerm, user?.role_id]); 
    
    // Fungsi untuk mengubah halaman (pagination)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= tanahData.last_page) {
            setCurrentPage(page);
        }
    };
    
    // Fungsi untuk submit filter (reset ke halaman 1)
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset ke halaman 1 setiap kali filter/search dijalankan
        // Karena useEffect sudah memantau, fetchData akan terpanggil otomatis
    };

    if (loading && !tanahData) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading data...</div>; 
    }

    return (
        <div>
            <div className="content-header">
                <h1>Dashboard Aset Tanah</h1>
                {/* Tombol Tambah HANYA untuk Admin (Role ID 1) */}
                {user?.role_id === 1 && (
                    <Link to="/tambah-tanah" className="btn btn-primary">
                        <i className="fas fa-plus"></i> Tambah Data Tanah
                    </Link>
                )}
            </div>

            {error && <div className="notification error">{error}</div>}

            {/* Bagian Statistik */}
            {user?.role_id !== 3 && ( // Sembunyikan Stats untuk BPD
                <div className="stats-grid">
                    <StatCard 
                        label="Total Aset Tercatat" 
                        value={stats.total_aset} 
                        icon="fa-landmark" 
                        color="#3b82f6" 
                    />
                    <StatCard 
                        label="Total Luas Disetujui" 
                        value={stats.total_luas.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                        unit=" m²"
                        icon="fa-ruler-combined" 
                        color="#22c55e" 
                    />
                    <StatCard 
                        label="Aset Menunggu Validasi" 
                        value={stats.aset_diproses} 
                        icon="fa-hourglass-half" 
                        color="#f59e0b" 
                    />
                    <StatCard 
                        label="Aset Telah Disetujui" 
                        value={stats.aset_disetujui} 
                        icon="fa-check-circle" 
                        color="#0ea5e9" 
                    />
                </div>
            )}
            
            {/* Bagian Tabel */}
            <div className="card">
                <div className="card-header">
                    <h4>Daftar Aset Tanah ({tanahData?.total || 0} data)</h4>
                </div>
                <div className="card-body">
                    {/* Form Filter */}
                    <form onSubmit={handleFilterSubmit} className="filter-form">
                        <input 
                            type="text" 
                            name="search" 
                            className="form-control" 
                            placeholder="Cari kode, asal, no. sertifikat..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {/* Filter Status HANYA untuk Admin/Kades */}
                        {user?.role_id !== 3 && ( 
                            <select 
                                name="status" 
                                className="form-control" 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Semua Status</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        )}
                        <button type="submit" className="btn btn-primary"><i className="fas fa-search"></i> Cari</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterStatus(user?.role_id === 3 ? 'Disetujui' : ''); setCurrentPage(1); }}>Reset</button>
                    </form>

                    {/* Tabel Aset */}
                    <div className="table-responsive" style={{marginTop: '20px'}}>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th><th>Kode</th><th>Asal</th><th>Luas (m²)</th><th>Penggunaan</th><th>Status</th><th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tanahData?.data.length > 0 ? (
                                    tanahData.data.map((tanah, index) => (
                                        <tr key={tanah.id}>
                                            <td>{tanahData.from + index}</td>
                                            <td>{tanah.kode_barang ?? '-'}</td>
                                            <td>{tanah.asal_perolehan}</td>
                                            <td>{tanah.luas.toLocaleString('id-ID', { maximumFractionDigits: 2 })}</td>
                                            <td>{tanah.penggunaan ?? '-'}</td>
                                            <td>
                                                <span className={`status ${tanah.status_validasi?.toLowerCase()}`}>{tanah.status_validasi}</span>
                                            </td>
                                            <td className="action-buttons">
                                                <Link to={`/detail-tanah/${tanah.id}`} className="btn btn-sm btn-info" title="Lihat Detail"><i className="fas fa-eye"></i></Link>
                                                
                                                {/* Aksi Admin (Role ID 1) */}
                                                {user?.role_id === 1 && (
                                                    <>
                                                        <button className="btn btn-sm btn-warning" title="Edit Data"><i className="fas fa-edit"></i></button>
                                                        <button className="btn btn-sm btn-danger" title="Hapus Data"><i className="fas fa-trash"></i></button>
                                                    </>
                                                )}
                                                
                                                {/* Aksi Kades (Role ID 2) jika status Diproses */}
                                                {user?.role_id === 2 && tanah.status_validasi === 'Diproses' && (
                                                    <>
                                                        <button className="btn btn-sm btn-success" title="Setujui"><i className="fas fa-check"></i></button>
                                                        <button className="btn btn-sm btn-danger" title="Tolak"><i className="fas fa-times"></i></button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Tidak ada data aset ditemukan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginasi */}
                    {tanahData && tanahData.last_page > 1 && (
                        <div className="pagination" style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '10px'}}>
                            {tanahData.current_page > 1 && (
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handlePageChange(tanahData.current_page - 1)}
                                >
                                    « Sebelumnya
                                </button>
                            )}
                            
                            {tanahData.last_page <= 5 ? ( // Tampilkan semua jika sedikit
                                Array.from({ length: tanahData.last_page }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page} 
                                        className={`btn btn-sm ${page === tanahData.current_page ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))
                            ) : (
                                <span style={{padding: '0 10px'}}>Halaman {tanahData.current_page} dari {tanahData.last_page}</span>
                            )}


                            {tanahData.current_page < tanahData.last_page && (
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handlePageChange(tanahData.current_page + 1)}
                                >
                                    Berikutnya »
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;