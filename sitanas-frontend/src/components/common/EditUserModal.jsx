// src/components/common/EditUserModal.jsx
import React, { useState, useEffect } from 'react';

const EditUserModal = ({ 
    onClose, 
    roles, 
    userToEdit, // User yang akan diedit
    onUpdate,   // Fungsi untuk submit update
    modalError, 
    isSubmitting 
}) => {
    
    // State form internal, diisi dengan data user yang akan diedit
    const [form, setForm] = useState({
        nama_lengkap: '',
        email: '',
        role_id: '',
        password: '', // Password baru (opsional)
        password_confirmation: '', // Konfirmasi (opsional)
    });

    // Isi form saat userToEdit berubah
    useEffect(() => {
        if (userToEdit) {
            setForm({
                nama_lengkap: userToEdit.nama_lengkap || '',
                email: userToEdit.email || '',
                role_id: userToEdit.role_id || '',
                password: '',
                password_confirmation: '',
            });
        }
    }, [userToEdit]);

    // Handle change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    
    // Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(form); // Kirim data form ke parent
    };

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent scroll on body when modal open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    return (
        <div 
            className="modal" 
            style={{ display: 'flex' }} 
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="modal-content" style={{ maxWidth: '550px' }}>
                <button 
                    className="close-button" 
                    onClick={onClose}
                    type="button"
                    aria-label="Tutup"
                >
                    &times;
                </button>
                <h2 style={{marginTop: 0}}>Edit Pengguna</h2>
                <p style={{color: 'var(--text-muted)', marginTop: '-0.5rem', marginBottom: '1.5rem'}}>
                    Perbarui data untuk pengguna: <strong>{userToEdit?.nama_lengkap}</strong>
                </p>

                <form onSubmit={handleSubmit}>
                    {modalError && (
                        <div className="notification error" style={{marginBottom: '1rem'}}>
                            <i className="fas fa-exclamation-circle"></i>
                            {modalError}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="edit-nama_lengkap">Nama Lengkap <span className="required-star">*</span></label>
                        <input
                            type="text"
                            id="edit-nama_lengkap"
                            name="nama_lengkap"
                            className="form-control"
                            value={form.nama_lengkap}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="edit-email">Email <span className="required-star">*</span></label>
                        <input
                            type="email"
                            id="edit-email"
                            name="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-role_id">Peran <span className="required-star">*</span></label>
                        <select
                            id="edit-role_id"
                            name="role_id"
                            className="form-control"
                            value={form.role_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Pilih Peran --</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nama_role}</option>
                            ))}
                        </select>
                    </div>

                    <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem'}}>
                        Isi kata sandi di bawah ini hanya jika Anda ingin mengubahnya.
                    </p>

                    <div className="form-group">
                        <label htmlFor="edit-password">Password Baru</label>
                        <input
                            type="password"
                            id="edit-password"
                            name="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-password_confirmation">Konfirmasi Password Baru</label>
                        <input
                            type="password"
                            id="edit-password_confirmation"
                            name="password_confirmation"
                            className="form-control"
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex', 
                        gap: '1rem', 
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid var(--border-color)'
                    }}>
                        <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={onClose}
                            disabled={isSubmitting}
                            style={{ flex: 1 }}
                        >
                            <i className="fas fa-times"></i> Batal
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={isSubmitting}
                            style={{ flex: 1 }}
                        >
                            {isSubmitting ? (
                                <><span className="loading-spinner"></span> Menyimpan...</>
                            ) : (
                                <><i className="fas fa-save"></i> Simpan Perubahan</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;