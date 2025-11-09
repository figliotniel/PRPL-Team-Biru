import api from './api';

/**
 * Mengambil semua data pengguna dari backend.
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Membuat pengguna baru.
 * @param {object} userData - Data pengguna baru (misal: { name, email, password, role_id })
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengupdate data pengguna berdasarkan ID.
 * @param {string|number} id - ID pengguna yang akan diupdate
 * @param {object} userData - Data baru untuk pengguna
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Menghapus pengguna berdasarkan ID.
 * @param {string|number} id - ID pengguna yang akan dihapus
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data; // Biasanya berisi pesan sukses
  } catch (error) {
    console.error('Error deleting user:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengambil data satu pengguna (jika diperlukan).
 * @param {string|number} id - ID pengguna
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error.response || error);
    throw error.response ? error.response.data : error;
  }
};