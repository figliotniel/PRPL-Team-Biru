import React, { useState, useEffect } from 'react';
import { getStats, getTanahList, softDeleteTanah, restoreTanah } from '../services/tanahService'; 
import StatCard from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom'; 
import ConfirmationModal from '../components/common/ConfirmationModal';
import '../assets/Layout.css';

function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // State Statistik
    const [stats, setStats] = useState({ total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 });
    // State Data Tanah
    const [tanahData, setTanahData] = useState(null); 
    
    // State Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(user?.role_id === 3 ? 'Disetujui' : '');
    const [filterArchived, setFilterArchived] = useState('active'); // 'active', 'archived', 'all'
    const [currentPage, setCurrentPage] = useState(1);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // State Modal Aksi
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null); // 'delete' (arsip) atau 'restore'
    const [selectedTanah, setSelectedTanah] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const statusToFetch = user?.role_id === 3 ? 'Disetujui' : filterStatus;
            
            // Logika filter arsip untuk API
            let withArchived = false;
            let archivedOnly = false;
            
            if (user?.role_id === 1) { // Hanya Admin yang bisa melihat arsip
                if (filterArchived === 'all') {
                    withArchived = true;
                } else if (filterArchived === 'archived') {
                    archivedOnly = true;
                }
            }

            // Fetch stats dan tanah secara parallel
            const [statsResponse, tanahResponse] = await Promise.all([
                getStats().catch(err => {
                    console.warn('Stats error:', err);
                    return { total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 };
                }),
                getTanahList(currentPage, statusToFetch, searchTerm, withArchived, archivedOnly).catch(err => {
                    console.warn('Tanah list error:', err);
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
        // PERMINTAAN 1: Data muncul langsung saat load
        fetchData(); 
    }, [currentPage, filterStatus, searchTerm, filterArchived, user?.role_id]); 
    
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
    
    // --- LOGIKA AKSI (Soft Delete & Restore) ---
    const showConfirm = (tanah, action) => {
        setSelectedTanah(tanah);
        setConfirmAction(action);
        setShowConfirmModal(true);
        setSuccess(null);
        setError(null);
    };

    const handleConfirmAction = async () => {
        if (!selectedTanah) return;
        
        setLoading(true);
        setShowConfirmModal(false);

        try {
            if (confirmAction === 'delete') {
                await softDeleteTanah(selectedTanah.id);
                setSuccess(`Data Tanah ${selectedTanah.kode_barang || 'Tanpa Kode'} berhasil diarsip (soft delete).`);
            } else if (confirmAction === 'restore') {
                await restoreTanah(selectedTanah.id);
                setSuccess(`Data Tanah ${selectedTanah.kode_barang || 'Tanpa Kode'} berhasil dikembalikan dari arsip.`);
            }
            
            fetchData(); // Refresh data setelah aksi
            
        } catch (err) {
            console.error('Action error:', err);
            setError(`Gagal melakukan aksi ${confirmAction}. Coba lagi.`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- LOGIKA EDIT (Permintaan 2) ---
    const handleEdit = (tanahId) => {
        navigate(`/edit-tanah/${tanahId}`); // Redirect ke halaman edit
    };

    // --- Component Rendering (Loading and Error) ---
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

    // --- Component Rendering (Main UI) ---
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

            {/* Notifikasi Error dan Success */}
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
            {success && (
                <div className="notification success" onClick={() => setSuccess(null)}>
                    <i className="fas fa-check-circle"></i> {success}
                </div>
            )}

            {/* Statistik (Permintaan 3: Perbaikan Tampilan) */}
            {user?.role_id !== 3 && (
                <div className="stats-grid">
                    {/* Total Aset Tercatat */}
                    <StatCard 
                        label="Total Aset Tercatat" 
                        value={stats.total_aset || 0} 
                        icon="fa-landmark" 
                        color="#3b82f6" 
                    />
                    {/* Total Luas Disetujui */}
                    <StatCard 
                        label="Total Luas Disetujui" 
                        value={(stats.total_luas || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })}
                        unit=" m²"
                        icon="fa-ruler-combined" 
                        color="#22c55e" 
                    />
                    {/* Aset Menunggu Validasi */}
                    <StatCard 
                        label="Aset Menunggu Validasi" 
                        value={stats.aset_diproses || 0} 
                        icon="fa-hourglass-half" 
                        color="#f59e0b" 
                    />
                    {/* Aset Telah Disetujui */}
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
                    {/* --- FILTER FORM (Permintaan 2: Maksimal) --- */}
                    <form onSubmit={handleFilterSubmit} className="filter-form" style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                        <input 
                            type="text" 
                            name="search" 
                            className="form-control" 
                            style={{flexGrow: 2}}
                            placeholder="Cari kode, asal, no. sertifikat, lokasi, status..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        {user?.role_id !== 3 && ( 
                            <select 
                                name="status" 
                                className="form-control" 
                                style={{flexGrow: 1, minWidth: '150px'}}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Status Validasi</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Ditolak">Ditolak</option>
                            </select>
                        )}
                        
                        {/* Filter Status Arsip (Admin Only) */}
                        {user?.role_id === 1 && ( 
                            <select 
                                name="archived_status" 
                                className="form-control" 
                                style={{flexGrow: 1, minWidth: '150px'}}
                                value={filterArchived}
                                onChange={(e) => setFilterArchived(e.target.value)}
                            >
                                <option value="active">Data Aktif</option>
                                <option value="archived">Data Terarsip</option>
                                <option value="all">Semua Data</option>
                            </select>
                        )}
                        
                        <button type="submit" className="btn btn-primary" style={{minWidth: '80px'}}>
                            <i className="fas fa-search"></i> Cari
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            style={{minWidth: '80px'}}
                            onClick={() => { 
                                setSearchTerm(''); 
                                setFilterStatus(user?.role_id === 3 ? 'Disetujui' : ''); 
                                setFilterArchived('active');
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
                                    <th>Status Validasi</th>
                                    <th>Arsip</th> 
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tanahData?.data && tanahData.data.length > 0 ? (
                                    tanahData.data.map((tanah, index) => {
                                        const isArchived = !!tanah.deleted_at; // Cek soft delete
                                        
                                        // TAMPILAN BARIS UNTUK ARSIP (Abu-abu, coretan)
                                        return (
                                            <tr 
                                                key={tanah.id} 
                                                style={{ 
                                                    backgroundColor: isArchived ? '#f0f0f0' : 'inherit', 
                                                    color: isArchived ? 'var(--text-muted)' : 'inherit',
                                                    textDecoration: isArchived ? 'line-through' : 'none'
                                                }}
                                            >
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
                                                <td>
                                                    {isArchived ? 
                                                        <span className="badge badge-danger" style={{backgroundColor: '#e53e3e', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
                                                            <i className="fas fa-archive"></i> Ya
                                                        </span> : 'Tidak'
                                                    }
                                                </td>
                                                <td className="action-buttons" style={{minWidth: '150px'}}>
                                                    {/* 1. Tombol Lihat Detail */}
                                                    <Link 
                                                        to={`/detail-tanah/${tanah.id}`} 
                                                        className="btn btn-sm btn-info" 
                                                        title="Lihat Detail"
                                                        style={{backgroundColor: '#3b82f6'}}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Link>
                                                    
                                                    {user?.role_id === 1 && ( // Aksi Admin
                                                        <>
                                                            {/* 2. Tombol EDIT */}
                                                            {!isArchived && (
                                                                <button 
                                                                    className="btn btn-sm btn-warning" 
                                                                    title="Edit Data"
                                                                    onClick={() => handleEdit(tanah.id)} 
                                                                    style={{backgroundColor: '#f59e0b'}}
                                                                >
                                                                    <i className="fas fa-edit"></i>
                                                                </button>
                                                            )}
                                                            
                                                            {/* 3. Tombol Soft Delete/Restore */}
                                                            {isArchived ? (
                                                                // Restore
                                                                <button 
                                                                    className="btn btn-sm btn-success" 
                                                                    title="Kembalikan dari Arsip"
                                                                    onClick={() => showConfirm(tanah, 'restore')}
                                                                    style={{backgroundColor: '#22c55e'}}
                                                                >
                                                                    <i className="fas fa-undo"></i>
                                                                </button>
                                                            ) : (
                                                                // Soft Delete
                                                                <button 
                                                                    className="btn btn-sm btn-danger" 
                                                                    title="Arsipkan Data"
                                                                    onClick={() => showConfirm(tanah, 'delete')}
                                                                    style={{backgroundColor: '#e53e3e'}}
                                                                >
                                                                    <i className="fas fa-archive"></i>
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                    
                                                    {/* Tombol Validasi (Kades) */}
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
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>
                                            <i className="fas fa-inbox" style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block'}}></i>
                                            <p>Tidak ada data aset ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
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
            
            {/* Modal Konfirmasi Soft Delete/Restore */}
            {showConfirmModal && selectedTanah && (
                <ConfirmationModal 
                    title={confirmAction === 'delete' ? 'Konfirmasi Arsip Data' : 'Konfirmasi Kembalikan Data'}
                    message={
                        confirmAction === 'delete' 
                            ? `Anda yakin ingin mengarsip (soft delete) data Tanah Kas Desa dengan kode: ${selectedTanah.kode_barang || 'Tanpa Kode'}? Data akan disembunyikan dari daftar aktif dan tampil sebagai abu-abu.`
                            : `Anda yakin ingin mengembalikan data Tanah Kas Desa dengan kode: ${selectedTanah.kode_barang || 'Tanpa Kode'} dari arsip? Data akan kembali ke daftar aktif.`
                    }
                    onConfirm={handleConfirmAction}
                    onCancel={() => setShowConfirmModal(false)}
                    confirmText={confirmAction === 'delete' ? 'Ya, Arsipkan' : 'Ya, Kembalikan'}
                    confirmButtonClass={confirmAction === 'delete' ? 'btn-danger' : 'btn-success'}
                />
            )}
        </div>
    );
}

export default DashboardPage;