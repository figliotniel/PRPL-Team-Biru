import api from './api';

/**
 * Mengambil daftar semua pengguna (Admin Only)
 * @returns {Promise<Array>} Array of users
 */
export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Mengambil detail satu pengguna berdasarkan ID
 * @param {number} userId - ID pengguna
 * @returns {Promise<Object>} User object
 */
export const getUserById = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

/**
 * Membuat pengguna baru (Admin Only)
 * @param {Object} userData - Data pengguna baru
 * @param {string} userData.nama_lengkap - Nama lengkap
 * @param {string} userData.email - Email
 * @param {string} userData.password - Password
 * @param {string} userData.password_confirmation - Konfirmasi password
 * @param {number} userData.role_id - ID role
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

/**
 * --- BARU: Mengupdate pengguna (Admin Only) ---
 * @param {number} userId - ID pengguna
 * @param {Object} userData - Data pengguna yang akan diupdate
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData) => {
    try {
        // Backend (UserController@update) Anda mengharapkan 'nama_lengkap', 'email', 'role_id'
        // dan 'password' (opsional)
        const response = await api.put(`/users/${userId}`, userData);
        return response.data; // Kembalikan data user yang sudah diupdate
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

/**
 * --- BARU: Menonaktifkan pengguna (Admin Only) ---
 * @param {number} userId - ID pengguna
 * @returns {Promise<Object>} Respon dari server (user yang diupdate)
 */
export const deactivateUser = async (userId) => {
    try {
        // Ini memanggil endpoint baru: POST /api/users/{id}/deactivate
        const response = await api.post(`/users/${userId}/deactivate`);
        return response.data; // Kembalikan data user yang sudah diupdate
    } catch (error) {
        console.error('Error deactivating user:', error);
        throw error;
    }
};

/**
 * Mengaktifkan pengguna (Admin Only)
 * @param {number} userId - ID pengguna
 * @returns {Promise<Object>} Respon dari server (user yang diupdate)
 */
export const activateUser = async (userId) => {
    try {
        // Ini memanggil endpoint baru: POST /api/users/{id}/activate
        const response = await api.post(`/users/${userId}/activate`);
        return response.data;
    } catch (error) {
        console.error('Error activating user:', error);
        throw error;
    }
};

/**
 * Mengambil daftar semua peran (Admin Only)
 * @returns {Promise<Array>} Array of roles
 */
export const getRoles = async () => {
    try {
        const response = await api.get('/roles');
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

/**
 * Get statistik pengguna (untuk admin dashboard)
 * @returns {Promise<Object>} User statistics
 */
export const getUserStats = async () => {
    try {
        const response = await api.get('/users/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};

/**
 * Bulk import users dari CSV/Excel (Admin Only)
 * @param {File} file - File CSV/Excel
 * @returns {Promise<Object>} Import result
 */
export const importUsers = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await api.post('/users/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error importing users:', error);
        throw error;
    }
};

/**
 * Export users ke Excel (Admin Only)
 * @param {Object} filters - Filter untuk export
 * @returns {Promise<Blob>} Excel file
 */
export const exportUsers = async (filters = {}) => {
    try {
        const response = await api.get('/users/export', {
            params: filters,
            responseType: 'blob' // Penting untuk download file
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting users:', error);
        throw error;
    }
};