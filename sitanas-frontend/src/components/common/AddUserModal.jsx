import React from 'react';

// Props yang diterima: showModal, onClose, roles, form, handleChange, handleSubmit, formError, handleGeneratePassword
const AddUserModal = ({ 
    onClose, 
    roles, 
    form, 
    handleChange, 
    handleSubmit, 
    formError, 
    handleGeneratePassword 
}) => {
    return (
        <div className="modal" style={{ display: 'flex' }}> {/* Gunakan class modal dari Layout.css */}
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <span className="close-button" onClick={onClose}>&times;</span>
                <h3 id="modalTitle">Tambah Pengguna Baru</h3>
                <p>Isi detail akun baru. Password akan di-*hash* secara otomatis di server.</p>
                
                <form onSubmit={handleSubmit}>
                    {formError && <div className="notification error">{formError}</div>}
                    
                    <div className="form-group"><label>Nama Lengkap</label><input type="text" name="nama_lengkap" className="form-control" value={form.nama_lengkap} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Email</label><input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required /></div>
                    
                    <div className="form-group">
                        <label>Peran</label>
                        <select name="role_id" className="form-control" value={form.role_id} onChange={handleChange} required>
                            <option value="">-- Pilih Peran --</option>
                            {roles.map(r => (
                                <option key={r.id} value={r.id}>{r.nama_role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div style={{display: 'flex', gap: '10px'}}>
                            <input type="text" name="password" className="form-control" value={form.password} onChange={handleChange} required />
                            <button type="button" className="btn btn-secondary btn-sm" onClick={handleGeneratePassword} style={{minWidth: '150px'}}><i className="fas fa-key"></i> Generate</button>
                        </div>
                    </div>
                    <div className="form-group"><label>Konfirmasi Password</label><input type="text" name="password_confirmation" className="form-control" value={form.password_confirmation} onChange={handleChange} required /></div>

                    <button type="submit" className="btn btn-primary btn-block">Simpan Pengguna</button>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;