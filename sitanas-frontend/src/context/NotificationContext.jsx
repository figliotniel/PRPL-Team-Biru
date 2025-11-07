import React, { createContext, useState, useCallback, useContext } from 'react';

// 1. Buat Context
// --- SAYA TAMBAHKAN 'export' DI SINI ---
export const NotificationContext = createContext(null);

// 2. Buat Komponen Provider
export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null); // { message, type: 'success' | 'error' }

// ... sisa kode ...
    // Fungsi untuk menampilkan notifikasi
    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
        
        // Sembunyikan notifikasi setelah 5 detik
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    }, []);

    // Fungsi untuk menutup notifikasi secara manual
    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {/* Ini adalah komponen UI yang menampilkan notifikasi */}
            {notification && (
                <NotificationDisplay 
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
            {children}
        </NotificationContext.Provider>
    );
};

// 3. Buat Komponen Tampilan UI Notifikasi
function NotificationDisplay({ message, type, onClose }) {
// ... sisa kode ...
    const style = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: '#fff',
        backgroundColor: type === 'success' ? '#28a745' : '#dc3545', // Hijau untuk sukses, Merah untuk error
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '300px',
        maxWidth: '400px',
    };

    const closeButtonStyle = {
        marginLeft: '20px',
        border: 'none',
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: '20px',
        cursor: 'pointer',
        lineHeight: '1',
    };

    return (
        <div style={style}>
            <span>{message}</span>
            <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>
    );
}