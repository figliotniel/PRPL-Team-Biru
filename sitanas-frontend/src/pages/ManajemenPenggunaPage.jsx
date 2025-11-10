import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deactivateUser, activateUser, getRoles } from '../services/userService';
import { generateStrongPassword } from '../utils/passwordGenerator';
import { useAuth } from '../hooks/useAuth';
import AddUserModal from '../components/common/AddUserModal';
import EditUserModal from '../components/common/EditUserModal';
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
    
    // State Modal Tambah
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState(initialFormState);
    const [modalError, setModalError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State Modal Edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editModalError, setEditModalError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Fetch data
    const fetchUsersAndRoles = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()]);
            setUsers(usersData);
            setRoles(rolesData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Gagal memuat data pengguna dan peran.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersAndRoles();
    }, []);

    // ... (Kontrol Modal, Submit, Update, Generate Password, dan Handle Change dihilangkan karena tidak ada perubahan) ...
    // --- Kontrol Modal TAMBAH ---
    const closeAddModal = () => {
        setShowAddModal(false);
        setForm(initialFormState);
        setModalError(null);
        setIsSubmitting(false);
    };

    const handleShowAddModal = () => {
        setForm(initialFormState);
        setModalError(null);
        setShowAddModal(true);
    };

    // --- Kontrol Modal EDIT ---
    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
        setEditModalError(null);
        setIsUpdating(false);
    };
    
    const handleShowEditModal = (user) => {
        setSelectedUser(user);
        setEditModalError(null);
        setShowEditModal(true);
    };

    // Handle submit new user
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (form.password !== form.password_confirmation) {
            setModalError('Konfirmasi password tidak cocok.');
            return;
        }

        setIsSubmitting(true);
        setModalError(null);
        setSuccess(null);

        try {
            const newUser = await createUser(form); 
            setSuccess('Pengguna baru berhasil ditambahkan!');
            closeAddModal();
            setUsers(prevUsers => [...prevUsers, newUser]);
        } catch (err) {
            console.error('Create user error:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                setModalError(errorMessages.join(' '));
            } else {
                setModalError(err.response?.data?.message || 'Terjadi kesalahan saat menambah pengguna.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle update user
    const handleUpdate = async (formData) => {
        if (formData.password && formData.password !== formData.password_confirmation) {
            setEditModalError('Konfirmasi password baru tidak cocok.');
            return;
        }
        
        setIsUpdating(true);
        setEditModalError(null);
        setSuccess(null);

        try {
            const dataToUpdate = {
                nama_lengkap: formData.nama_lengkap,
                email: formData.email,
                role_id: formData.role_id,
            };
            
            if (formData.password) {
                dataToUpdate.password = formData.password;
                dataToUpdate.password_confirmation = formData.password_confirmation;
            }

            const updatedUser = await updateUser(selectedUser.id, dataToUpdate);
            
            setSuccess('Data pengguna berhasil diperbarui!');
            closeEditModal();
            
            setUsers(prevUsers => prevUsers.map(user => 
                user.id === updatedUser.id ? updatedUser : user
            ));

        } catch (err) {
            console.error('Update user error:', err);
            if (err.response && err.response.data && err.response.data.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                setEditModalError(errorMessages.join(' '));
            } else {
                setEditModalError(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui pengguna.');
            }
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle form change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setModalError(null);
    };

    // Generate password
    const handleGeneratePassword = () => {
        const newPassword = generateStrongPassword();
        setForm({ ...form, password: newPassword, password_confirmation: newPassword });
        setModalError(null);
    };

    // --- LOGIKA AKTIFKAN/NONAKTIFKAN ---
    const handleDeactivate = async (userId) => {
        if (window.confirm('Yakin ingin menonaktifkan pengguna ini? Pengguna tidak akan bisa login.')) {
            try {
                const updatedUser = await deactivateUser(userId); 
                setSuccess('Pengguna berhasil dinonaktifkan.');
                
                // Mengganti user lama dengan user baru (dari response API)
                setUsers(prevUsers => prevUsers.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ));
            } catch (err) {
                console.error('Deactivate user error:', err);
                setError(err.response?.data?.message || 'Gagal menonaktifkan pengguna.');
            }
        }
    };

    const handleActivate = async (userId) => {
        if (window.confirm('Yakin ingin mengaktifkan kembali pengguna ini?')) {
            try {
                const updatedUser = await activateUser(userId); 
                setSuccess('Pengguna berhasil diaktifkan.');
                
                // Mengganti user lama dengan user baru (dari response API)
                setUsers(prevUsers => prevUsers.map(user => 
                    user.id === updatedUser.id ? updatedUser : user
                ));
            } catch (err) {
                console.error('Activate user error:', err);
                setError(err.response?.data?.message || 'Gagal mengaktifkan pengguna.');
            }
        }
    };
    
    // Handlers for search and filter
    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleRoleFilterChange = (e) => setFilterRole(e.target.value);
    const handleStatusFilterChange = (e) => setFilterStatus(e.target.value);

    // --- LOGIKA SEARCH & FILTER ---
    const filteredUsers = users.filter(u => {
        if (!u || !u.nama_lengkap || !u.email) return false; 
        
        const searchLower = searchTerm.toLowerCase();
        const roleName = u.role?.nama_role?.toLowerCase() || '';

        const matchesSearch = searchTerm ? (
                                u.nama_lengkap.toLowerCase().includes(searchLower) ||
                                u.email.toLowerCase().includes(searchLower) ||
                                roleName.includes(searchLower)
                            ) : true;
        
        const matchesRole = filterRole ? u.role_id === parseInt(filterRole) : true;
        
        // Filter Status
        const userStatus = u.status === 'Aktif' ? 'Aktif' : 'Tidak Aktif';
        const matchesStatus = filterStatus ? userStatus === filterStatus : true;
                              
        return matchesSearch && matchesRole && matchesStatus;
    });
    
    if (loading) {
        return <div className="loading-container"><span className="loading-spinner"></span> Memuat data...</div>;
    }
    
    if (user.role_id === 2) {
        return (
            <div>
                <h1>Akses Ditolak</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* ... (Markup Header, Notifications, Filters) ... */}
            <div className="content-header">
                <div>
                    <h1>Manajemen Pengguna</h1>
                    <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Kelola akun admin dan staf desa yang dapat mengakses sistem.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleShowAddModal}>
                    <i className="fas fa-plus"></i> Tambah Pengguna
                </button>
            </div>

            {error && (
                <div className="notification error" onClick={() => setError(null)}>
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
            )}
            {success && (
                <div className="notification success" onClick={() => setSuccess(null)}>
                    <i className="fas fa-check-circle"></i> {success}
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h4><i className="fas fa-filter"></i> Filter & Pencarian</h4>
                </div>
                <div className="card-body" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    <div className="form-group" style={{flex: '2 1 300px'}}>
                        <label htmlFor="search">Cari Pengguna</label>
                        <input
                            type="text"
                            id="search"
                            className="form-control"
                            placeholder="Cari nama, email, atau peran..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="form-group" style={{flex: '1 1 150px'}}>
                        <label htmlFor="filterRole">Peran</label>
                        <select
                            id="filterRole"
                            className="form-control"
                            value={filterRole}
                            onChange={handleRoleFilterChange}
                        >
                            <option value="">Semua Peran</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nama_role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{flex: '1 1 150px'}}>
                        <label htmlFor="filterStatus">Status</label>
                        <select
                            id="filterStatus"
                            className="form-control"
                            value={filterStatus}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="">Semua Status</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Tidak Aktif">Tidak Aktif</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="card">
                <div className="card-header">
                    <h4><i className="fas fa-users"></i> Daftar Pengguna</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
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
                                    filteredUsers.map((u, index) => {
                                        // Variabel penentu status (handle null/kosong)
                                        const isUserActive = u.status === 'Aktif';
                                        
                                        return (
                                            <tr key={u.id}>
                                                <td>{index + 1}</td>
                                                <td>{u.nama_lengkap}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`badge ${u.role_id === 1 ? 'badge-admin' : 'badge-kades'}`}>
                                                        {u.role ? u.role.nama_role : 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {/* Badge Status */}
                                                    <span className={`badge ${isUserActive ? 'badge-success' : 'badge-danger'}`}>
                                                        {isUserActive ? 'Aktif' : 'Tidak Aktif'}
                                                    </span>
                                                </td>
                                                <td style={{display: 'flex', gap: '0.5rem'}}>
                                                    {/* Tombol EDIT */}
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleShowEditModal(u)}
                                                        title="Edit Pengguna"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>

                                                    {/* Tombol Aksi (Aktifkan/Nonaktifkan) */}
                                                    {u.id !== user.id && ( // Tidak bisa mengubah akun yang sedang login
                                                        <>
                                                            {isUserActive ? (
                                                                // Jika Aktif, tampilkan NONAKTIFKAN
                                                                <button 
                                                                    className="btn btn-warning btn-sm" 
                                                                    onClick={() => handleDeactivate(u.id)}
                                                                    title="Nonaktifkan Pengguna"
                                                                >
                                                                    <i className="fas fa-user-slash"></i>
                                                                </button>
                                                            ) : (
                                                            // Jika Tidak Aktif (termasuk null/kosong), tampilkan AKTIFKAN
                                                                <button 
                                                                    className="btn btn-success btn-sm" 
                                                                    onClick={() => handleActivate(u.id)}
                                                                    title="Aktifkan Pengguna"
                                                                >
                                                                    <i className="fas fa-user-check"></i>
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
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

            {/* Modal Tambah */}
            {showAddModal && (
                <AddUserModal
                    onClose={closeAddModal}
                    roles={roles}
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formError={modalError}
                    handleGeneratePassword={handleGeneratePassword}
                    isSubmitting={isSubmitting}
                />
            )}

            {/* Modal Edit */}
            {showEditModal && (
                <EditUserModal
                    onClose={closeEditModal}
                    roles={roles}
                    userToEdit={selectedUser}
                    onUpdate={handleUpdate}
                    modalError={editModalError}
                    isSubmitting={isUpdating}
                />
            )}
        </div>
    );
}

export default ManajemenPenggunaPage;