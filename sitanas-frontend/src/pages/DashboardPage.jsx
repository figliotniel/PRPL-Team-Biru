// src/pages/DashboardPage.jsx - DENGAN ERROR HANDLING LEBIH BAIK
import React, { useState, useEffect } from 'react';
import { getStats, getTanahList } from '../services/tanahService';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../assets/Layout.css';

function DashboardPage() {
    const { user } = useAuth();
    
    const [stats, setStats] = useState({ total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 });
    const [tanahData, setTanahData] = useState(null); 
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(user?.role_id === 3 ? 'Disetujui' : '');
    const [currentPage, setCurrentPage] = useState(1);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const statusToFetch = user?.role_id === 3 ? 'Disetujui' : filterStatus;

            // Fetch stats dan tanah secara parallel
            const [statsResponse, tanahResponse] = await Promise.all([
                getStats().catch(err => {
                    console.warn('Stats error:', err);
                    // Return default jika gagal
                    return { total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 };
                }),
                getTanahList(currentPage, statusToFetch, searchTerm).catch(err => {
                    console.warn('Tanah list error:', err);
                    // Return empty pagination
                    return { data: [], current_page: 1, last_page: 1, total: 0, from: 0, to: 0 };
                })
            ]);

            setStats(statsResponse);
            setTanahData(tanahResponse);
            
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError("Terjadi kesalahan saat memuat data. Silakan refresh halaman.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, filterStatus, searchTerm, user?.role_id]); 
    
    const handlePageChange = (page) => {
        if (page >= 1 && tanahData && page <= tanahData.last_page) {
            setCurrentPage(page);
        }
    };
    
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    const handleRetry = () => {
        setError(null);
        fetchData();
    };

    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <div className="loading-spinner"></div>
                <p style={{marginTop: '1rem', color: 'var(--text-muted)'}}>
                    Memuat data dashboard...
                </p>
            </div>
        ); 
    }

    return (
        <div>
            <div className="content-header">
                <h1>Dashboard Aset Tanah</h1>
                {user?.role_id === 1 && (
                    <Link to="/tambah-tanah" className="btn btn-primary">
                        <i className="fas fa-plus"></i> Tambah Data Tanah
                    </Link>
                )}
            </div>

            {error && (
                <div className="notification error" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                    <button className="btn btn-sm btn-secondary" onClick={handleRetry}>
                        <i className="fas fa-redo"></i> Coba Lagi
                    </button>
                </div>
            )}

            {user?.role_id !== 3 && (
                <div className="stats-grid">
                    <StatCard 
                        label="Total Aset Tercatat" 
                        value={stats.total_aset || 0} 
                        icon="fa-landmark" 
                        color="#3b82f6" 
                    />
                    <StatCard 
                        label="Total Luas Disetujui" 
                        value={(stats.total_luas || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                        unit=" m²"
                        icon="fa-ruler-combined" 
                        color="#22c55e" 
                    />
                    <StatCard 
                        label="Aset Menunggu Validasi" 
                        value={stats.aset_diproses || 0} 
                        icon="fa-hourglass-half" 
                        color="#f59e0b" 
                    />
                    <StatCard 
                        label="Aset Telah Disetujui" 
                        value={stats.aset_disetujui || 0} 
                        icon="fa-check-circle" 
                        color="#0ea5e9" 
                    />
                </div>
            )}
            
            <div className="card">
                <div className="card-header">
                    <h4>Daftar Aset Tanah ({tanahData?.total || 0} data)</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleFilterSubmit} className="filter-form">
                        <input 
                            type="text" 
                            name="search" 
                            className="form-control" 
                            placeholder="Cari kode, asal, no. sertifikat..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
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
                        <button type="submit" className="btn btn-primary">
                            <i className="fas fa-search"></i> Cari
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => { 
                                setSearchTerm(''); 
                                setFilterStatus(user?.role_id === 3 ? 'Disetujui' : ''); 
                                setCurrentPage(1); 
                            }}
                        >
                            Reset
                        </button>
                    </form>

                    <div className="table-responsive" style={{marginTop: '20px'}}>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Kode</th>
                                    <th>Asal</th>
                                    <th>Luas (m²)</th>
                                    <th>Penggunaan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tanahData?.data && tanahData.data.length > 0 ? (
                                    tanahData.data.map((tanah, index) => (
                                        <tr key={tanah.id}>
                                            <td>{tanahData.from + index}</td>
                                            <td>{tanah.kode_barang || '-'}</td>
                                            <td>{tanah.asal_perolehan}</td>
                                            <td>{(tanah.luas || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}</td>
                                            <td>{tanah.penggunaan || '-'}</td>
                                            <td>
                                                <span className={`status ${tanah.status_validasi?.toLowerCase()}`}>
                                                    {tanah.status_validasi}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <Link 
                                                    to={`/detail-tanah/${tanah.id}`} 
                                                    className="btn btn-sm btn-info" 
                                                    title="Lihat Detail"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Link>
                                                
                                                {user?.role_id === 1 && (
                                                    <>
                                                        <button className="btn btn-sm btn-warning" title="Edit Data">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-danger" title="Hapus Data">
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {user?.role_id === 2 && tanah.status_validasi === 'Diproses' && (
                                                    <>
                                                        <button className="btn btn-sm btn-success" title="Setujui">
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-danger" title="Tolak">
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>
                                            <i className="fas fa-inbox" style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block'}}></i>
                                            <p>Tidak ada data aset ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
                            
                            <span style={{padding: '0 10px', display: 'flex', alignItems: 'center'}}>
                                Halaman {tanahData.current_page} dari {tanahData.last_page}
                            </span>

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