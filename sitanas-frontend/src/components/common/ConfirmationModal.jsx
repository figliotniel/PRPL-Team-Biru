// src/components/common/ConfirmationModal.jsx
import React from 'react';

const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText = "Ya, Lanjutkan", cancelText = "Batal" }) => {
    return (
        <div className="modal" style={{ display: 'flex' }}>
            <div className="modal-content" style={{ maxWidth: '450px' }}>
                <span className="close-button" onClick={onCancel}>&times;</span>
                <h3 id="modalTitle" style={{ color: 'var(--danger-color)' }}>
                    {title || 'Konfirmasi Tindakan'}
                </h3>
                <p style={{ margin: '1rem 0' }}>{message || 'Apakah Anda yakin ingin melanjutkan?'}</p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;