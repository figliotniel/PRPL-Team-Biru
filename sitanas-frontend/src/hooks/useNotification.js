import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext'; 

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification harus digunakan di dalam NotificationProvider');
    }
    return context;
};