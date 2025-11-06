// src/context/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import '../assets/Layout.css'; // Kita akan tambahkan CSS-nya di sini

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const addNotification = useCallback((message, type = 'success') => {
        setNotification({ id: Date.now(), message, type });
        // Hapus notifikasi setelah 3 detik
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const closeNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            {/* Di sinilah notifikasi akan di-render */}
            {notification && (
                <div className={`notification-toast ${notification.type}`} onClick={closeNotification}>
                    {notification.message}
                </div>
            )}
        </NotificationContext.Provider>
    );
};

// Hook kustom untuk mempermudah pemanggilan
export const useNotification = () => {
    return useContext(NotificationContext);
};