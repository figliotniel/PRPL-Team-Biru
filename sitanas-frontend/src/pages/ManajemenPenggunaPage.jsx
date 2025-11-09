import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, getRoles } from '../services/userService';
import { generateStrongPassword } from '../utils/passwordGenerator';
import { useAuth } from '../hooks/useAuth';
import AddUserModal from '../components/common/AddUserModal';
import '../assets/Layout.css';

const initialFormState = { 
    nama_lengkap: '', 
    email: '', 
    password: '', 
    password_confirmation: '', 
    role_id: '' 
};

function ManajemenPenggunaPage() {
    const { user } = useAuth();
    
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialFormState);
    const [formError, setFormError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');

    // Fetch data
    const fetchUsersAndRoles = async () => {
        if (user?.role_id !== 1) {
            setError("Akses ditolak. Anda bukan Admin.");
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const [usersResponse, rolesResponse] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            
            setUsers(usersResponse);
            setRoles(rolesResponse);
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMessage = err.response?.status === 403 
                ? "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini."
                : "Gagal memuat data pengguna. " + (err.message || '');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersAndRoles();
    }, [user?.id]);

    // Auto-hide notifications
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error && error !== "Akses ditolak. Anda bukan Admin.") {
            const timer = setTimeout(() => setError(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Form handlers
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormError(null); // Clear error saat user mengetik
    };

    const handleGeneratePassword = () => {
        const newPass = generateStrongPassword();
        setForm({ ...form, password: newPass, password_confirmation: newPass });
    };

    const validateForm = () => {
        if (!form.nama_lengkap.trim()) {
            setFormError('Nama lengkap harus diisi');
            return false;
        }
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
            setFormError('Email tidak valid');
            return false;
        }
        if (!form.role_id) {
            setFormError('Peran harus dipilih');
            return false;
        }
        if (form.password.length < 8) {
            setFormError('Password minimal 8 karakter');
            return false;
        }
        if (form.password !== form.password_confirmation) {
            setFormError('Konfirmasi password tidak cocok');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setFormError(null);
        setIsSubmitting(true);
        
        try {
            await createUser(form);
            setSuccess(`Pengguna ${form.nama_lengkap} berhasil ditambahkan!`);
            setShowModal(false);
            setForm(initialFormState);
            await fetchUsersAndRoles();
        } catch (err) {
            console.error('Create user error:', err);
            const validationMessage = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join('; ')
                : err.response?.data?.message || "Gagal membuat pengguna. Periksa input.";
            setFormError(validationMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDelete = async (id, nama) => {
        if (!window.confirm(`Yakin ingin menonaktifkan pengguna "${nama}"?\n\nTindakan ini akan:\n- Mencabut akses login\n- Menyimpan data untuk audit\n- Dapat diaktifkan kembali nanti`)) {
            return;
        }
        
        try {
            await deleteUser(id);
            setSuccess(`${nama} berhasil dinonaktifkan.`);
            await fetchUsersAndRoles();
        } catch (err) {
            console.error('Delete error:', err);
            setError("Gagal menonaktifkan pengguna. " + (err.message || ''));
        }
    };

    const openModal = () => {
        setShowModal(true);
        setForm(initialFormState);
        setFormError(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm(initialFormState);
        setFormError(null);
    };

    // Filter logic
    const filteredUsers = users.filter(u => {
        const matchSearch = u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = filterRole ? u.role_id === parseInt(filterRole) : true;
        const matchStatus = filterStatus === 'active' ? !u.deleted_at : 
                           filterStatus === 'inactive' ? u.deleted_at : true;
        return matchSearch && matchRole && matchStatus;
    });

    // Guard checks
    if (user?.role_id !== 1) {
        return (
            <div>
                <h1>Akses Ditolak</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Anda tidak memiliki izin untuk mengakses halaman ini. Hanya Admin yang dapat mengelola pengguna.
                </div>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <div className="loading-spinner"></div>
                <p style={{marginTop: '1rem'}}>Memuat data pengguna...</p>
            </div>
        );
    }
    
    return (
        <div>
            <div className="content-header">
                <div>
                    <h1>Manajemen Pengguna</h1>
                    <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Kelola akses pengguna sistem SITANAS
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openModal}>
                    <i className="fas fa-user-plus"></i> Tambah Pengguna
                </button>
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
                    <h4>Daftar Pengguna ({filteredUsers.length} dari {users.length})</h4>
                </div>
                <div className="card-body">
                    {/* Filter Section */}
                    <div className="filter-form">
                        <div style={{flex: '1', minWidth: '200px'}}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Cari nama atau email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <select 
                            className="form-control" 
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            style={{minWidth: '150px'}}
                        >
                            <option value="">Semua Peran</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.nama_role}</option>
                            ))}
                        </select>
                        
                        <select 
                            className="form-control" 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{minWidth: '150px'}}
                        >
                            <option value="all">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                        </select>
                        
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterRole('');
                                setFilterStatus('active');
                            }}
                        >
                            <i className="fas fa-redo"></i> Reset
                        </button>
                    </div>

                    {/* Table */}
                    <div className="table-responsive" style={{marginTop: '1.5rem'}}>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Lengkap</th>
                                    <th>Email</th>
                                    <th>Peran</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u, index) => (
                                        <tr key={u.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{u.nama_lengkap}</strong>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.25rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    backgroundColor: u.role_id === 1 ? '#dbeafe' : u.role_id === 2 ? '#fef3c7' : '#e0e7ff',
                                                    color: u.role_id === 1 ? '#1e40af' : u.role_id === 2 ? '#92400e' : '#4338ca'
                                                }}>
                                                    {roles.find(r => r.id === u.role_id)?.nama_role || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status ${u.deleted_at ? 'ditolak' : 'disetujui'}`}>
                                                    {u.deleted_at ? 'Nonaktif' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button 
                                                    className="btn btn-sm btn-info" 
                                                    title="Detail"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-warning" 
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {!u.deleted_at && (
                                                    <button 
                                                        className="btn btn-sm btn-danger" 
                                                        title="Nonaktifkan" 
                                                        onClick={() => handleDelete(u.id, u.nama_lengkap)}
                                                    >
                                                        <i className="fas fa-user-slash"></i>
                                                    </button>
                                                )}
                                                {u.deleted_at && (
                                                    <button 
                                                        className="btn btn-sm btn-success" 
                                                        title="Aktifkan Kembali"
                                                    >
                                                        <i className="fas fa-redo"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                                            <i className="fas fa-users" style={{fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem'}}></i>
                                            <p>Tidak ada pengguna yang sesuai dengan filter.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <AddUserModal
                    onClose={closeModal}
                    roles={roles}
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formError={formError}
                    handleGeneratePassword={handleGeneratePassword}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}

export default ManajemenPenggunaPage;