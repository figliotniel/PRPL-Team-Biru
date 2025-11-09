import React, { useState, useEffect } from 'react';
import { getLogs, exportLogs, deleteOldLogs } from '../services/logService';
import { getUsers } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import '../assets/Layout.css';

function LogsPage() {
    const { user } = useAuth();
    
    const [logs, setLogs] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Filter states
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        user_id: '',
        aksi: '',
        date_from: '',
        date_to: '',
        search: ''
    });
    
    // Daftar aksi yang tersedia (sesuaikan dengan backend)
    const aksiList = [
        'Login',
        'Logout',
        'Tambah Data',
        'Edit Data',
        'Hapus Data',
        'Validasi',
        'Export',
        'Import'
    ];

    // Fetch data logs dan users
    const fetchData = async () => {
        if (user?.role_id !== 1) {
            setError("Akses ditolak. Hanya Admin yang dapat melihat log aktivitas.");
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const [logsResponse, usersResponse] = await Promise.all([
                getLogs(currentPage, filters),
                getUsers()
            ]);
            
            setLogs(logsResponse);
            setUsers(usersResponse);
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMessage = err.response?.status === 403 
                ? "Akses ditolak. Anda tidak memiliki izin."
                : "Gagal memuat data log. " + (err.message || '');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, user?.id]);

    // Auto-hide notifications
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    // Handle filter submit
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchData();
    };

    // Reset filters
    const handleResetFilters = () => {
        setFilters({
            user_id: '',
            aksi: '',
            date_from: '',
            date_to: '',
            search: ''
        });
        setCurrentPage(1);
    };

    // Handle export
    const handleExport = async () => {
        try {
            setLoading(true);
            const blob = await exportLogs(filters);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `log-aktivitas-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            setSuccess('Log berhasil di-export!');
        } catch (err) {
            setError('Gagal export log: ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    // Handle cleanup old logs
    const handleCleanup = async () => {
        const days = prompt('Hapus log lebih dari berapa hari? (misal: 90)');
        if (!days || isNaN(days)) return;
        
        if (!window.confirm(`Yakin ingin menghapus log lebih dari ${days} hari?`)) {
            return;
        }
        
        try {
            await deleteOldLogs(parseInt(days));
            setSuccess(`Log lebih dari ${days} hari berhasil dihapus.`);
            fetchData();
        } catch (err) {
            setError('Gagal menghapus log: ' + (err.message || ''));
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && logs && page <= logs.last_page) {
            setCurrentPage(page);
        }
    };

    // Format tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get badge color for aksi
    const getAksiBadgeColor = (aksi) => {
        const colors = {
            'Login': 'success',
            'Logout': 'secondary',
            'Tambah Data': 'info',
            'Edit Data': 'warning',
            'Hapus Data': 'danger',
            'Validasi': 'success',
            'Export': 'info',
            'Import': 'info'
        };
        return colors[aksi] || 'secondary';
    };

    // Guard checks
    if (user?.role_id !== 1) {
        return (
            <div>
                <h1>Akses Ditolak</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Anda tidak memiliki izin untuk mengakses halaman ini. Hanya Admin yang dapat melihat log aktivitas.
                </div>
            </div>
        );
    }
    
    if (loading && !logs) {
        return (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <div className="loading-spinner"></div>
                <p style={{marginTop: '1rem'}}>Memuat data log aktivitas...</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="content-header">
                <div>
                    <h1>Log Aktivitas Sistem</h1>
                    <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Riwayat semua aktivitas pengguna di sistem SITANAS
                    </p>
                </div>
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <button className="btn btn-success" onClick={handleExport} disabled={loading}>
                        <i className="fas fa-file-excel"></i> Export Excel
                    </button>
                    <button className="btn btn-warning" onClick={handleCleanup} disabled={loading}>
                        <i className="fas fa-broom"></i> Cleanup
                    </button>
                </div>
            </div>
            
            {error && (
                <div className="notification error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}
            
            {success && (
                <div className="notification success">
                    <i className="fas fa-check-circle"></i>
                    {success}
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h4>Filter Log Aktivitas</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleFilterSubmit} className="filter-form">
                        <div style={{flex: '1', minWidth: '200px'}}>
                            <input 
                                type="text" 
                                name="search"
                                className="form-control" 
                                placeholder="Cari deskripsi aktivitas..." 
                                value={filters.search}
                                onChange={handleFilterChange}
                            />
                        </div>
                        
                        <select 
                            name="user_id"
                            className="form-control" 
                            value={filters.user_id}
                            onChange={handleFilterChange}
                            style={{minWidth: '180px'}}
                        >
                            <option value="">Semua Pengguna</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.nama_lengkap}</option>
                            ))}
                        </select>
                        
                        <select 
                            name="aksi"
                            className="form-control" 
                            value={filters.aksi}
                            onChange={handleFilterChange}
                            style={{minWidth: '150px'}}
                        >
                            <option value="">Semua Aksi</option>
                            {aksiList.map(aksi => (
                                <option key={aksi} value={aksi}>{aksi}</option>
                            ))}
                        </select>
                        
                        <input 
                            type="date" 
                            name="date_from"
                            className="form-control" 
                            value={filters.date_from}
                            onChange={handleFilterChange}
                            title="Dari Tanggal"
                        />
                        
                        <input 
                            type="date" 
                            name="date_to"
                            className="form-control" 
                            value={filters.date_to}
                            onChange={handleFilterChange}
                            title="Sampai Tanggal"
                        />
                        
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <i className="fas fa-search"></i> Cari
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={handleResetFilters}
                            disabled={loading}
                        >
                            <i className="fas fa-redo"></i> Reset
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Daftar Log Aktivitas ({logs?.total || 0} data)</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Waktu</th>
                                    <th>Pengguna</th>
                                    <th>Aksi</th>
                                    <th>Deskripsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs?.data && logs.data.length > 0 ? (
                                    logs.data.map((log, index) => (
                                        <tr key={log.id}>
                                            <td>{logs.from + index}</td>
                                            <td style={{whiteSpace: 'nowrap'}}>
                                                <i className="fas fa-clock" style={{marginRight: '0.5rem', color: 'var(--text-muted)'}}></i>
                                                {formatDate(log.created_at)}
                                            </td>
                                            <td>
                                                <strong>{log.user?.nama_lengkap || 'System'}</strong>
                                                <br/>
                                                <small style={{color: 'var(--text-muted)'}}>
                                                    {log.user?.email || '-'}
                                                </small>
                                            </td>
                                            <td>
                                                <span className={`status ${getAksiBadgeColor(log.aksi).toLowerCase()}`}>
                                                    {log.aksi}
                                                </span>
                                            </td>
                                            <td>{log.deskripsi || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{textAlign: 'center', padding: '2rem'}}>
                                            <i className="fas fa-history" style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem'}}></i>
                                            <p>Tidak ada log aktivitas yang sesuai dengan filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs && logs.last_page > 1 && (
                        <div className="pagination" style={{marginTop: '1.5rem'}}>
                            {logs.current_page > 1 && (
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handlePageChange(logs.current_page - 1)}
                                    disabled={loading}
                                >
                                    « Sebelumnya
                                </button>
                            )}
                            
                            <span style={{padding: '0 1rem', display: 'flex', alignItems: 'center'}}>
                                Halaman {logs.current_page} dari {logs.last_page}
                            </span>

                            {logs.current_page < logs.last_page && (
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => handlePageChange(logs.current_page + 1)}
                                    disabled={loading}
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

export default LogsPage;