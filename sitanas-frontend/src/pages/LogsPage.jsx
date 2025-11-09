import React, { useState, useEffect } from 'react';
import { getLogs } from '../services/logService';
import { getAllUsers } from '../services/userService';
import '../assets/Layout.css';

// Helper format tanggal
const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
};

function LogsPage() {
    const [logData, setLogData] = useState(null); // Data paginasi
    const [users, setUsers] = useState([]); // Untuk dropdown filter
    
    const [filters, setFilters] = useState({
        user_id: '',
        tanggal_mulai: '',
        tanggal_selesai: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi untuk mengambil data log
    const fetchLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryFilters = {
                ...filters,
                page: currentPage
            };
            const data = await getLogs(queryFilters);
            setLogData(data);
        } catch (err) {
            setError("Gagal memuat data log. Pastikan backend siap.");
        } finally {
            setLoading(false);
        }
    };

    // Ambil data user untuk filter dropdown
    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(err => console.error("Gagal memuat users untuk filter:", err));
    }, []);

    // Panggil API setiap kali filter atau halaman berubah
    useEffect(() => {
        fetchLogs();
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset ke halaman 1
        fetchLogs(); // fetchLogs() sudah dipanggil oleh useEffect, tapi ini untuk submit manual
    };
    
    const handleResetFilter = () => {
        setFilters({
            user_id: '',
            tanggal_mulai: '',
            tanggal_selesai: ''
        });
        setCurrentPage(1);
    };

    // Fungsi untuk mengubah halaman (pagination)
    const handlePageChange = (page) => {
        if (page >= 1 && page <= logData.last_page) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <div className="content-header">
                <h1>Log Aktivitas Sistem</h1>
            </div>

            {error && <div className="notification error">{error}</div>}

            {/* Area Filter */}
            <div className="card">
                <div className="card-header"><h4>Filter Log</h4></div>
                <div className="card-body">
                    <form onSubmit={handleFilterSubmit} className="filter-form" style={{ gridTemplateColumns: '1fr 1fr 1fr auto auto', alignItems: 'flex-end' }}>
                        <div className="form-group">
                            <label>Pengguna</label>
                            <select name="user_id" className="form-control" value={filters.user_id} onChange={handleFilterChange}>
                                <option value="">Semua Pengguna</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.nama_lengkap} ({user.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Tanggal (Mulai)</label>
                            <input type="date" name="tanggal_mulai" className="form-control" value={filters.tanggal_mulai} onChange={handleFilterChange} />
                        </div>
                        <div className="form-group">
                            <label>Tanggal (Selesai)</label>
                            <input type="date" name="tanggal_selesai" className="form-control" value={filters.tanggal_selesai} onChange={handleFilterChange} />
                        </div>
                        
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "..." : <><i className="fas fa-filter"></i> Terapkan</>}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleResetFilter} disabled={loading}>
                            Reset
                        </button>
                    </form>
                </div>
            </div>

            {/* Tabel Hasil Log */}
            <div className="card">
                <div className="card-header">
                    <h4>Hasil Log ({logData?.total || 0} catatan)</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Waktu</th>
                                    <th>Pengguna</th>
                                    <th>Aksi</th>
                                    <th>Deskripsi</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Memuat data log...</td></tr>
                                )}
                                {!loading && logData?.data.length > 0 ? (
                                    logData.data.map(log => (
                                        <tr key={log.id}>
                                            <td>{formatTimestamp(log.timestamp)}</td>
                                            <td>{log.user?.nama_lengkap || 'Sistem'}</td>
                                            <td><span className={`status ${log.aksi?.toLowerCase()}`}>{log.aksi}</span></td>
                                            <td>{log.deskripsi}</td>
                                            <td>{log.ip_address}</td>
                                        </tr>
                                    ))
                                ) : (
                                    !loading && (
                                        <tr><td colSpan="5" style={{ textAlign: 'center' }}>Tidak ada data log ditemukan.</td></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginasi (Sama seperti Dashboard) */}
                    {logData && logData.last_page > 1 && (
                        <div className="pagination-container">
                            <div className="pagination-info">
                                Menampilkan {logData.from} sampai {logData.to} dari {logData.total} catatan.
                            </div>
                            <div className="pagination">
                                {/* Tombol Sebelumnya */}
                                <button
                                    className={`btn btn-secondary ${currentPage === 1 ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                >
                                    « Sebelumnya
                                </button>
                                
                                {/* Angka Halaman (Logika sederhana) */}
                                {Array.from({ length: logData.last_page }, (_, i) => i + 1)
                                    .filter(page => page === 1 || page === logData.last_page || (page >= currentPage - 2 && page <= currentPage + 2))
                                    .map((page, index, array) => (
                                        <React.Fragment key={page}>
                                            {index > 0 && page > array[index - 1] + 1 && (
                                                <span className="pagination-ellipsis">...</span>
                                            )}
                                            <button
                                                className={`btn ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick={() => handlePageChange(page)}
                                                disabled={loading}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    ))}

                                {/* Tombol Berikutnya */}
                                <button
                                    className={`btn btn-secondary ${currentPage === logData.last_page ? 'disabled' : ''}`}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === logData.last_page || loading}
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

export default LogsPage;