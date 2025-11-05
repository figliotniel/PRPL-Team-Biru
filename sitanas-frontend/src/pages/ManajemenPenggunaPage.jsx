import React, { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser, getRoles } from '../services/userService';
import { generateStrongPassword } from '../utils/passwordGenerator';
import { useAuth } from '../hooks/useAuth';
import AddUserModal from '../components/common/AddUserModal'; // <-- Import komponen Modal yang baru
import '../assets/Layout.css'; 
// import '../assets/style.css'; // Pastikan diimpor jika tidak di Layout.css


// State awal form
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
    
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialFormState);
    const [formError, setFormError] = useState(null);

    // Fetch data utama
    const fetchUsersAndRoles = async () => {
        if (user?.role_id !== 1) return; 
        try {
            setLoading(true);
            const [usersResponse, rolesResponse] = await Promise.all([
                getUsers(),
                getRoles()
            ]);
            setUsers(usersResponse);
            setRoles(rolesResponse);
        } catch (err) {
            // Cek jika error 403 (Akses Ditolak), tampilkan pesan yang spesifik
            const errorMessage = err.response?.status === 403 
                                ? "Akses ditolak. Anda tidak memiliki izin untuk melihat data ini."
                                : "Gagal memuat data pengguna.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // FIX: Tambahkan dependency array user.id agar fetch terjadi setelah login berhasil
    useEffect(() => {
        fetchUsersAndRoles();
    }, [user?.id]); // Hanya panggil saat user ID berubah (login berhasil)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleGeneratePassword = () => {
        const newPass = generateStrongPassword();
        setForm({ ...form, password: newPass, password_confirmation: newPass });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await createUser(form);
            alert("Pengguna berhasil ditambahkan!");
            setShowModal(false);
            setForm(initialFormState); // Reset form
            fetchUsersAndRoles(); // Refresh data
        } catch (err) {
             // Tangani error validasi (cth: email sudah dipakai)
            const validationMessage = err.response?.data?.errors 
                                      ? Object.values(err.response.data.errors).flat().join('; ')
                                      : err.response?.data?.message || "Gagal membuat pengguna. Periksa input.";
            setFormError(validationMessage);
        }
    };
    
    const handleDelete = async (id, nama) => {
        if (window.confirm(`Yakin ingin menonaktifkan pengguna ${nama}? Tindakan ini bersifat permanen.`)) {
            try {
                await deleteUser(id);
                alert(`${nama} berhasil dinonaktifkan.`);
                fetchUsersAndRoles(); 
            } catch (err) {
                setError("Gagal menonaktifkan pengguna.");
            }
        }
    };

    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak. Anda bukan Admin.</div>;
    }
    
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading data pengguna...</div>; 
    
    return (
        <div>
            <div className="content-header">
                <h1>Manajemen Pengguna</h1>
                <button className="btn btn-primary" onClick={() => {setShowModal(true); setForm(initialFormState); setFormError(null);}}>
                    <i className="fas fa-user-plus"></i> Tambah Pengguna
                </button>
            </div>
            
            {error && <div className="notification error">{error}</div>}

            <div className="card">
                <div className="card-header"><h4>Daftar Aparatur Desa ({users.length} data)</h4></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>No</th><th>Nama Lengkap</th><th>Email</th><th>Peran</th><th>Status</th><th>Aksi</th></tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? (
                                    users.map((u, index) => (
                                        <tr key={u.id}>
                                            <td>{index + 1}</td>
                                            <td>{u.nama_lengkap}</td>
                                            <td>{u.email}</td>
                                            <td>{roles.find(r => r.id === u.role_id)?.nama_role || 'N/A'}</td>
                                            <td>
                                                <span className={`status ${u.deleted_at ? 'ditolak' : 'disetujui'}`}>
                                                    {u.deleted_at ? 'Nonaktif' : 'Aktif'}
                                                </span>
                                            </td>
                                            <td className="action-buttons">
                                                <button className="btn btn-sm btn-warning" title="Edit"><i className="fas fa-edit"></i></button>
                                                {!u.deleted_at && (
                                                    <button 
                                                        className="btn btn-sm btn-danger" 
                                                        title="Nonaktifkan" 
                                                        onClick={() => handleDelete(u.id, u.nama_lengkap)}
                                                    >
                                                        <i className="fas fa-user-slash"></i>
                                                    </button>
                                                )}
                                                {/* Tombol aktifkan kembali jika diperlukan */}
                                                {u.deleted_at && (
                                                    <button className="btn btn-sm btn-success" title="Aktifkan Kembali"><i className="fas fa-redo"></i></button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{textAlign: 'center'}}>Tidak ada data pengguna.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Pengguna */}
            {showModal && (
                <AddUserModal
                    onClose={() => setShowModal(false)}
                    roles={roles}
                    form={form}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formError={formError}
                    handleGeneratePassword={handleGeneratePassword}
                />
            )}
        </div>
    );
}

export default ManajemenPenggunaPage;