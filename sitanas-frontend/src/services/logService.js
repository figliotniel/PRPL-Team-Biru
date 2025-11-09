import api from './api';

/**
 * Mengambil daftar log aktivitas dengan pagination
 * @param {number} page - Halaman saat ini
 * @param {Object} filters - Filter untuk log
 * @returns {Promise<Object>} Paginated logs data
 */
export const getLogs = async (page = 1, filters = {}) => {
    try {
        const params = new URLSearchParams();
        params.append('page', page);
        
        if (filters.user_id) {
            params.append('user_id', filters.user_id);
        }
        if (filters.aksi) {
            params.append('aksi', filters.aksi);
        }
        if (filters.date_from) {
            params.append('date_from', filters.date_from);
        }
        if (filters.date_to) {
            params.append('date_to', filters.date_to);
        }
        if (filters.search) {
            params.append('search', filters.search);
        }
        
        const response = await api.get(`/logs?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};

/**
 * Get detail log aktivitas
 * @param {number} logId - ID log
 * @returns {Promise<Object>} Log detail
 */
export const getLogById = async (logId) => {
    try {
        const response = await api.get(`/logs/${logId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching log detail:', error);
        throw error;
    }
};

/**
 * Get statistik log aktivitas
 * @returns {Promise<Object>} Log statistics
 */
export const getLogStats = async () => {
    try {
        const response = await api.get('/logs/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching log stats:', error);
        throw error;
    }
};

/**
 * Export logs ke Excel/CSV
 * @param {Object} filters - Filter untuk export
 * @returns {Promise<Blob>} File export
 */
export const exportLogs = async (filters = {}) => {
    try {
        const response = await api.get('/logs/export', {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting logs:', error);
        throw error;
    }
};

/**
 * Hapus log lama (Admin only)
 * @param {number} days - Hapus log lebih dari X hari
 * @returns {Promise<Object>} Response message
 */
export const deleteOldLogs = async (days) => {
    try {
        const response = await api.delete('/logs/cleanup', {
            data: { days }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting old logs:', error);
        throw error;
    }
};