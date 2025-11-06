import React, { useState, useEffect, useCallback } from 'react';
import { 
    getUsers, 
    getRoles, 
    createUser, 
    updateUser, 
    deleteUser, 
    getUserDetail 
} from '../services/userService'; // <-- Diperbaiki ke path relatif
import '../assets/Layout.css'; // <-- Diperbaiki ke path relatif
import { useAuth } from '../hooks/useAuth'; // <-- Diperbaiki ke path relatif

// --- Komponen Modal Konfirmasi Hapus ---
// (Sama seperti di DashboardPage)
function ConfirmationModal({ show, title, message, onCancel, onConfirm, isDeleting = false }) {
    if (!show) return null;
    return (
        <div className="modal-backdrop">
            <div className="modal-dialog">
                <div className="modal-header">
                    <h4>{title}</h4>
                    <button onClick={onCancel} className="modal-close-btn" disabled={isDeleting}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onCancel} className="btn btn-secondary" disabled={isDeleting}>Batal</button>
                    <button onClick={onConfirm} className="btn btn-danger" disabled={isDeleting}>
                        {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Komponen Modal Form Pengguna (Tambah/Edit) ---
function UserFormModal({ show, mode, userId, roles, onCancel, onSave, isSaving = false }) {
    if (!show) return null;

    const [formData, setFormData] = useState({
        nama_lengkap: '',
        email: '',
        password: '',
        konfirmasi_password: '',
        role_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Ambil data user jika mode 'edit'
    useEffect(() => {
        if (mode === 'edit' && userId) {
            setLoading(true);
            getUserDetail(userId)
                .then(data => {
                    setFormData({
                        nama_lengkap: data.nama_lengkap,
                        email: data.email,
                        role_id: data.role_id,
                        password: '', // Password dikosongkan saat edit
                        konfirmasi_password: ''
                    });
                })
                .catch(err => console.error("Gagal ambil detail user:", err))
                .finally(() => setLoading(false));
        } else {
            // Reset form jika mode 'tambah'
            setFormData({
                nama_lengkap: '', email: '', password: '', konfirmasi_password: '', role_id: ''
            });
        }
    }, [mode, userId, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Hapus error jika user mulai mengetik
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nama_lengkap) newErrors.nama_lengkap = 'Nama lengkap wajib diisi.';
        if (!formData.email) newErrors.email = 'Email wajib diisi.';
        if (!formData.role_id) newErrors.role_id = 'Role wajib dipilih.';
        
        // Validasi password HANYA jika mode 'tambah' atau jika diisi saat mode 'edit'
        if (mode === 'tambah' || formData.password) {
            if (!formData.password) newErrors.password = 'Password wajib diisi.';
            if (formData.password.length < 8) newErrors.password = 'Password minimal 8 karakter.';
            if (formData.password !== formData.konfirmasi_password) {
                newErrors.konfirmasi_password = 'Konfirmasi password tidak cocok.';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Siapkan data untuk dikirim (jangan kirim konfirmasi password)
        const dataToSave = {
            nama_lengkap: formData.nama_lengkap,
            email: formData.email,
            role_id: formData.role_id
        };

        // Hanya kirim password jika diisi
        if (formData.password) {
            dataToSave.password = formData.password;
        }

        onSave(dataToSave);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-dialog">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h4>{mode === 'tambah' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}</h4>
                        <button type="button" onClick={onCancel} className="modal-close-btn" disabled={isSaving}>&times;</button>
                    </div>
                    <div className="modal-body">
                        {loading ? <p>Memuat data...</p> : (
                            <div className="grid-2-col" style={{gap: '10px'}}>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                                    <label htmlFor="nama_lengkap">Nama Lengkap</label>
                                    <input type="text" id="nama_lengkap" name="nama_lengkap" className="form-control" value={formData.nama_lengkap} onChange={handleChange} />
                                    {errors.nama_lengkap && <small className="form-error-text">{errors.nama_lengkap}</small>}
                                </div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                                    <label htmlFor="email">Email (Login)</label>
                                    <input type="email" id="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                                    {errors.email && <small className="form-error-text">{errors.email}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" id="password" name="password" className="form-control" value={formData.password} onChange={handleChange} placeholder={mode === 'edit' ? 'Isi jika ingin ganti' : ''} />
                                    {errors.password && <small className="form-error-text">{errors.password}</small>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="konfirmasi_password">Konfirmasi Password</label>
                                    <input type="password" id="konfirmasi_password" name="konfirmasi_password" className="form-control" value={formData.konfirmasi_password} onChange={handleChange} />
                                    {errors.konfirmasi_password && <small className="form-error-text">{errors.konfirmasi_password}</small>}
                                </div>
                                <div className="form-group" style={{gridColumn: '1 / -1'}}>
                                    <label htmlFor="role_id">Role / Peran</label>
                                    <select id="role_id" name="role_id" className="form-control" value={formData.role_id} onChange={handleChange}>
                                        <option value="">-- Pilih Role --</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.nama_role}</option>
                                        ))}
                                    </select>
                                    {errors.role_id && <small className="form-error-text">{errors.role_id}</small>}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSaving}>Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving || loading}>
                            {isSaving ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- Halaman Utama Manajemen Pengguna ---
function ManajemenPenggunaPage() {
    const { user: currentUser } = useAuth(); // User yang sedang login
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // State untuk Form Modal (Tambah/Edit)
    const [showFormModal, setShowFormModal] = useState(false);
    const [modalMode, setModalMode] = useState('tambah'); // 'tambah' or 'edit'
    const [currentUserId, setCurrentUserId] = useState(null); // ID user yang diedit
    const [isSaving, setIsSaving] = useState(false);

    // State untuk Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Fungsi untuk memuat semua data (users dan roles)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersData, rolesData] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (err) {
            setError("Gagal memuat data pengguna.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Panggil fetchData saat komponen dimuat
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handler untuk Form Modal (Tambah/Edit) ---
    const handleOpenTambahModal = () => {
        setModalMode('tambah');
        setCurrentUserId(null);
        setShowFormModal(true);
    };

    const handleOpenEditModal = (user) => {
        setModalMode('edit');
        setCurrentUserId(user.id);
        setShowFormModal(true);
    };

    const handleCloseFormModal = () => {
        if (isSaving) return;
        setShowFormModal(false);
    };

    const handleSaveUser = async (userData) => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            if (modalMode === 'tambah') {
                await createUser(userData);
                setSuccessMessage("Pengguna baru berhasil ditambahkan.");
            } else {
                await updateUser(currentUserId, userData);
                setSuccessMessage("Data pengguna berhasil diperbarui.");
            }
            fetchData(); // Muat ulang data tabel
            handleCloseFormModal();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data pengguna.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Handler untuk Delete Modal ---
    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeleting) return;
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        
        setIsDeleting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await deleteUser(userToDelete.id);
            setSuccessMessage(`Pengguna "${userToDelete.nama_lengkap}" berhasil dihapus.`);
            fetchData(); // Muat ulang data tabel
            handleCloseDeleteModal();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus pengguna.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            {/* --- Render Semua Modal --- */}
            <UserFormModal
                show={showFormModal}
                mode={modalMode}
                userId={currentUserId}
                roles={roles}
                onCancel={handleCloseFormModal}
                onSave={handleSaveUser}
                isSaving={isSaving}
            />
            <ConfirmationModal
                show={showDeleteModal}
                title="Konfirmasi Hapus Pengguna"
                message={`Apakah Anda yakin ingin menghapus pengguna "${userToDelete?.nama_lengkap}"? Aksi ini tidak dapat dibatalkan.`}
                onCancel={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <div className="content-header">
                <h1>Manajemen Pengguna</h1>
                <button onClick={handleOpenTambahModal} className="btn btn-primary">
                    <i className="fas fa-plus"></i> Tambah Pengguna
                </button>
            </div>

            {error && <div className="notification error" onClick={() => setError(null)}>{error}</div>}
            {successMessage && <div className="notification success" onClick={() => setSuccessMessage(null)}>{successMessage}</div>}

            <div className="card">
                <div className="card-header">
                    <h4>Daftar Pengguna Sistem</h4>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p style={{textAlign: 'center'}}>Memuat daftar pengguna...</p>
                    ) : (
                        <div className="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nama Lengkap</th>
                                        <th>Email (Login)</th>
                                        <th>Role / Peran</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.nama_lengkap}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`status-role role-${user.role_id}`}>{user.role?.nama_role || 'N/A'}</span>
                                                </td>
                                                <td>
                                                    {/* Ganti 'status' jika ada kolom status aktif/nonaktif */}
                                                    <span className="status disetujui">Aktif</span>
                                                </td>
                                                <td className="action-buttons">
                                                    <button onClick={() => handleOpenEditModal(user)} className="btn btn-sm btn-warning" title="Edit Data">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    
                                                    {/* Jangan biarkan user menghapus dirinya sendiri */}
                                                    <button 
                                                        onClick={() => handleOpenDeleteModal(user)} 
                                                        className="btn btn-sm btn-danger" 
                                                        title="Hapus Data"
                                                        disabled={user.id === currentUser?.id}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" style={{textAlign: 'center'}}>Belum ada data pengguna.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ManajemenPenggunaPage;