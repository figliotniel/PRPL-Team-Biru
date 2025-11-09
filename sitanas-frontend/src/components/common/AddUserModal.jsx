import React, { useEffect } from 'react';

const AddUserModal = ({ 
    onClose, 
    roles, 
    form, 
    handleChange, 
    handleSubmit, 
    formError, 
    handleGeneratePassword,
    isSubmitting 
}) => {
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
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="modal" 
            style={{ display: 'flex' }} 
            onClick={handleBackdropClick}
        >
            <div className="modal-content" style={{ maxWidth: '550px' }}>
                <button 
                    className="close-button" 
                    onClick={onClose}
                    type="button"
                    aria-label="Tutup"
                >
                    ×
                </button>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-user-plus" style={{ color: 'var(--primary-color)' }}></i>
                        Tambah Pengguna Baru
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 0 }}>
                        Isi detail akun baru. Password akan di-hash secara otomatis di server.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    {formError && (
                        <div className="notification error" style={{ marginBottom: '1.5rem' }}>
                            <i className="fas fa-exclamation-circle"></i>
                            {formError}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label htmlFor="nama_lengkap">
                            Nama Lengkap <span style={{ color: 'var(--danger-color)' }}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="nama_lengkap"
                            name="nama_lengkap" 
                            className="form-control" 
                            value={form.nama_lengkap} 
                            onChange={handleChange} 
                            required 
                            placeholder="Masukkan nama lengkap"
                            autoFocus
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">
                            Email <span style={{ color: 'var(--danger-color)' }}>*</span>
                        </label>
                        <input 
                            type="email" 
                            id="email"
                            name="email" 
                            className="form-control" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="contoh@email.com"
                        />
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Email harus unik dan belum terdaftar
                        </small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="role_id">
                            Peran <span style={{ color: 'var(--danger-color)' }}>*</span>
                        </label>
                        <select 
                            id="role_id"
                            name="role_id" 
                            className="form-control" 
                            value={form.role_id} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">-- Pilih Peran --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.nama_role}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password <span style={{ color: 'var(--danger-color)' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                                type="text" 
                                id="password"
                                name="password" 
                                className="form-control" 
                                value={form.password} 
                                onChange={handleChange} 
                                required 
                                placeholder="Minimal 8 karakter"
                                style={{ flex: 1 }}
                            />
                            <button 
                                type="button" 
                                className="btn btn-secondary btn-sm" 
                                onClick={handleGeneratePassword}
                                title="Generate password kuat"
                                style={{ minWidth: '120px' }}
                            >
                                <i className="fas fa-key"></i> Generate
                            </button>
                        </div>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Minimal 8 karakter. Gunakan tombol Generate untuk password kuat.
                        </small>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password_confirmation">
                            Konfirmasi Password <span style={{ color: 'var(--danger-color)' }}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="password_confirmation"
                            name="password_confirmation" 
                            className="form-control" 
                            value={form.password_confirmation} 
                            onChange={handleChange} 
                            required 
                            placeholder="Ulangi password"
                        />
                        {form.password && form.password_confirmation && (
                            <small style={{ 
                                color: form.password === form.password_confirmation ? 'var(--success-color)' : 'var(--danger-color)', 
                                fontSize: '0.75rem', 
                                marginTop: '0.25rem', 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <i className={`fas ${form.password === form.password_confirmation ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                {form.password === form.password_confirmation ? 'Password cocok' : 'Password tidak cocok'}
                            </small>
                        )}
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
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
                                <>
                                    <span className="loading-spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Simpan Pengguna
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;