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
        
        // Re-throw dengan informasi lebih detail
        if (error.response?.data?.errors) {
            const validationErrors = error.response.data.errors;
            error.validationErrors = validationErrors;
        }
        
        throw error;
    }
};

/**
 * Update data pengguna (Admin Only)
 * @param {number} userId - ID pengguna
 * @param {Object} userData - Data yang akan diupdate
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        
        if (error.response?.data?.errors) {
            error.validationErrors = error.response.data.errors;
        }
        
        throw error;
    }
};

/**
 * Menonaktifkan/Menghapus pengguna (Soft Delete - Admin Only)
 * @param {number} userId - ID pengguna
 * @returns {Promise<Object>} Response message
 */
export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

/**
 * Mengaktifkan kembali pengguna yang nonaktif (Admin Only)
 * @param {number} userId - ID pengguna
 * @returns {Promise<Object>} Response message
 */
export const restoreUser = async (userId) => {
    try {
        const response = await api.post(`/users/${userId}/restore`);
        return response.data;
    } catch (error) {
        console.error('Error restoring user:', error);
        throw error;
    }
};

/**
 * Mengambil daftar roles dari backend
 * @returns {Promise<Array>} Array of roles
 */
export const getRoles = async () => {
    try {
        const response = await api.get('/master-data/roles');
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        
        // FALLBACK: Jika backend belum siap, gunakan data statis
        console.warn('Using fallback roles data');
        return [
            { id: 1, nama_role: 'Admin Desa' },
            { id: 2, nama_role: 'Kepala Desa' },
            { id: 3, nama_role: 'BPD (Pengawas)' }
        ];
    }
};

/**
 * Reset password pengguna (Admin Only)
 * @param {number} userId - ID pengguna
 * @param {string} newPassword - Password baru
 * @returns {Promise<Object>} Response message
 */
export const resetPassword = async (userId, newPassword) => {
    try {
        const response = await api.post(`/users/${userId}/reset-password`, {
            password: newPassword,
            password_confirmation: newPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

/**
 * Update password sendiri (semua user bisa)
 * @param {string} currentPassword - Password lama
 * @param {string} newPassword - Password baru
 * @param {string} newPasswordConfirmation - Konfirmasi password baru
 * @returns {Promise<Object>} Response message
 */
export const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
        const response = await api.post('/user/change-password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmation
        });
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

/**
 * Update profile sendiri (semua user bisa)
 * @param {Object} profileData - Data profile yang akan diupdate
 * @returns {Promise<Object>} Updated user data
 */
export const updateProfile = async (profileData) => {
    try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};

/**
 * Upload foto profil
 * @param {File} file - File foto
 * @returns {Promise<Object>} Response dengan URL foto
 */
export const uploadProfilePhoto = async (file) => {
    try {
        const formData = new FormData();
        formData.append('photo', file);
        
        const response = await api.post('/user/profile-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading photo:', error);
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
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error exporting users:', error);
        throw error;
    }
};