import React, { useState, useEffect } from 'react';
// Import deleteTanah
// --- PERBAIKAN: Mengembalikan ke path relative ../ ---
import { getStats, getTanahList, deleteTanah } from '../services/tanahService';
import StatCard from '../components/common/StatCard';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import '../assets/Layout.css';
// Impor Modal (jika Anda punya komponen modal)
// import Modal from 'components/common/Modal'; 

// --- Komponen Modal Sederhana (Jika belum punya) ---
// Kita akan buat modal sederhana langsung di sini
function ConfirmationModal({ show, title, message, onCancel, onConfirm, confirmText = "Hapus", cancelText = "Batal", isDeleting = false }) {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-dialog">
                <div className="modal-header">
                    <h4>{title}</h4>
                    <button onClick={onCancel} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onCancel} className="btn btn-secondary" disabled={isDeleting}>{cancelText}</button>
                    <button onClick={onConfirm} className="btn btn-danger" disabled={isDeleting}>
                        {isDeleting ? "Menghapus..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
// --- Akhir Komponen Modal ---


function DashboardPage() {
    const { user } = useAuth(); 
    
    // State data
    const [stats, setStats] = useState({ total_aset: 0, total_luas: 0, aset_diproses: 0, aset_disetujui: 0 });
    const [tanahData, setTanahData] = useState(null); 
    
    // State filter & pagination
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState(user?.role_id === 3 ? 'Disetujui' : '');
    const [currentPage, setCurrentPage] = useState(1);
    
    // State UI (Loading & Error)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Notifikasi sukses

    // --- STATE BARU UNTUK MODAL HAPUS ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tanahToDelete, setTanahToDelete] = useState(null); // Menyimpan data (id, kode) yg akan dihapus
    const [isDeleting, setIsDeleting] = useState(false);


    // Fungsi utama untuk mengambil data
    const fetchData = async (page = currentPage) => {
        try {
            // Reset notifikasi setiap kali fetch
            setError(null);
            setSuccessMessage(null); 
            setLoading(true);
            
            const statusToFetch = user?.role_id === 3 ? 'Disetujui' : filterStatus;

            const [statsResponse, tanahResponse] = await Promise.all([
                getStats(),
                getTanahList(page, statusToFetch, searchTerm),
            ]);

            setStats(statsResponse);
            setTanahData(tanahResponse);
            setCurrentPage(page); // Pastikan state halaman sinkron
            
        } catch (err) {
            console.error(err);
            setError("Gagal memuat data Dashboard. Coba reset filter atau periksa koneksi.");
        } finally {
            setLoading(false);
        }
    };

    // Panggil API saat filter/halaman berubah
    useEffect(() => {
        // Panggil fetchData saat komponen pertama kali dimuat
        fetchData(1); 
    }, [filterStatus, searchTerm, user?.role_id]); // Hanya panggil saat filter berubah
    
    // Handler untuk pindah halaman
    const handlePageChange = (page) => {
        if (page >= 1 && page <= tanahData.last_page) {
            fetchData(page); // Panggil fetchData dengan halaman baru
        }
    };
    
    // Handler untuk submit filter
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchData(1); // Reset ke halaman 1 setiap kali filter/search
    };

    // --- FUNGSI BARU UNTUK HAPUS DATA ---

    // 1. Membuka modal
    const handleOpenDeleteModal = (tanah) => {
        setTanahToDelete(tanah);
        setShowDeleteModal(true);
    };

    // 2. Menutup modal
    const handleCloseDeleteModal = () => {
        if (isDeleting) return; // Jangan tutup jika sedang proses hapus
        setShowDeleteModal(false);
        setTanahToDelete(null);
    };

    // 3. Konfirmasi Hapus (dipanggil oleh modal)
    const handleConfirmDelete = async () => {
        if (!tanahToDelete) return;

        setIsDeleting(true);
        setError(null); // Reset error
        setSuccessMessage(null); // Reset sukses

        try {
            const response = await deleteTanah(tanahToDelete.id);
            setSuccessMessage(response.message || `Aset (Kode: ${tanahToDelete.kode_barang || tanahToDelete.id}) berhasil dihapus.`);
            
            // Tutup modal
            setShowDeleteModal(false);
            setTanahToDelete(null);
            
            // Muat ulang data di halaman saat ini
            // Cek jika ini item terakhir di halaman, mundur 1 halaman
            if (tanahData.data.length === 1 && currentPage > 1) {
                fetchData(currentPage - 1);
            } else {
                fetchData(currentPage);
            }

        } catch (err) {
            console.error("Gagal menghapus:", err);
            // Tampilkan error di halaman
            setError(err.response?.data?.message || "Gagal menghapus aset.");
            // Tutup modal
            setShowDeleteModal(false);
            setTanahToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };


    // Tampilan loading utama
    if (loading && !tanahData) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading data...</div>; 
    }

    return (
        <div>
            {/* --- MODAL KONFIRMASI HAPUS --- */}
            <ConfirmationModal 
                show={showDeleteModal}
                title="Konfirmasi Hapus Aset"
                message={`Apakah Anda yakin ingin menghapus aset ${tanahToDelete?.kode_barang || ''}? Data yang sudah dihapus tidak dapat dikembalikan.`}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <div className="content-header">
                <h1>Dashboard Aset Tanah</h1>
                {user?.role_id === 1 && (
                    <Link to="/tambah-tanah" className="btn btn-primary">
                        <i className="fas fa-plus"></i> Tambah Data Tanah
                    </Link>
                )}
            </div>

            {/* Tampilkan notifikasi Error atau Sukses */}
            {error && <div className="notification error">{error}</div>}
            {successMessage && <div className="notification success" onClick={() => setSuccessMessage(null)}>{successMessage}</div>}

            {/* Statistik (Sembunyikan untuk BPD) */}
            {user?.role_id !== 3 && (
                <div className="stats-grid">
                    {/* ... StatCard ... */}
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
                        <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterStatus(user?.role_id === 3 ? 'Disetujui' : ''); fetchData(1); }}>Reset</button>
                    </form>
                    
                    {/* Overlay loading saat fetch data (bukan loading awal) */}
                    {loading && <div className="table-loading-overlay">Memuat data...</div>}

                    {/* Tabel Aset */}
                    <div className="table-responsive" style={{marginTop: '20px', opacity: loading ? 0.5 : 1}}>
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
                                                {/* Tombol Detail */}
                                                <Link to={`/detail-tanah/${tanah.id}`} className="btn btn-sm btn-info" title="Lihat Detail"><i className="fas fa-eye"></i></Link>
                                                
                                                {/* Aksi Admin (Role ID 1) */}
                                                {user?.role_id === 1 && (
                                                    <>
                                                        {/* Tombol Edit */}
                                                        <Link to={`/edit-tanah/${tanah.id}`} className="btn btn-sm btn-warning" title="Edit Data">
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        
                                                        {/* --- PERUBAHAN TOMBOL HAPUS --- */}
                                                        <button 
                                                            className="btn btn-sm btn-danger" 
                                                            title="Hapus Data"
                                                            onClick={() => handleOpenDeleteModal(tanah)} // Membuka modal
                                                            disabled={isDeleting} // Disable jika sedang proses hapus
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
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
                        <div className="pagination-container">
                            
                            <div className="pagination-info">
                                Menampilkan {tanahData.from} sampai {tanahData.to} dari {tanahData.total} aset.
                            </div>

                            <div className="pagination">
                                {/* Tombol Sebelumnya */}
                                <button 
                                    className={`btn btn-secondary ${tanahData.current_page === 1 ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(tanahData.current_page - 1)}
                                    disabled={loading || tanahData.current_page === 1}
                                >
                                    « Sebelumnya
                                </button>

                                {/* ... Logika Tombol Angka ... */}
                                {Array.from({ length: tanahData.last_page }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === tanahData.last_page || (page >= tanahData.current_page - 2 && page <= tanahData.current_page + 2))
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && page > array[index - 1] + 1 && (
                                                <span className="pagination-ellipsis">...</span>
                                            )}
                                            <button 
                                                className={`btn ${page === tanahData.current_page ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick={() => handlePageChange(page)}
                                                disabled={loading}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                ))}

                                {/* Tombol Berikutnya */}
                                <button 
                                    className={`btn btn-secondary ${tanahData.current_page === tanahData.last_page ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(tanahData.current_page + 1)}
                                    disabled={loading || tanahData.current_page === tanahData.last_page}
                                >
                                    Berikutnya »
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;