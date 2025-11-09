// src/services/tanahService.js
import api from './api'; // Instance axios kita

/**
 * Mengambil semua data tanah dari backend.
 */
export const getAllTanah = async () => {
  try {
    const response = await api.get('/tanah');
    
    // Sama seperti user, tangani jika data ada di 'response.data.data' (pagination)
    // atau langsung di 'response.data'
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching data tanah:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Membuat data tanah baru.
 * @param {object} tanahData - Data tanah baru
 */
export const createTanah = async (tanahData) => {
  try {
    // Catatan: Jika mengirim file/gambar, 'Content-Type' harus 'multipart/form-data'.
    // Untuk saat ini, kita asumsikan hanya data teks.
    const response = await api.post('/tanah', tanahData);
    return response.data;
  } catch (error)
 {
    console.error('Error creating data tanah:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengupdate data tanah berdasarkan ID.
 * @param {string|number} id - ID tanah yang akan diupdate
 * @param {object} tanahData - Data baru untuk tanah
 */
export const updateTanah = async (id, tanahData) => {
  try {
    // Catatan: Untuk update (PUT/PATCH), API Laravel seringkali
    // tidak bisa langsung menangani 'multipart/form-data'.
    // Cara umum adalah menggunakan POST dengan field '_method: PUT'.
    // Kita akan coba 'api.put' dulu, jika gagal, kita ubah.
    const response = await api.put(`/tanah/${id}`, tanahData);
    return response.data;
  } catch (error) {
    console.error('Error updating data tanah:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Menghapus data tanah berdasarkan ID.
 * @param {string|number} id - ID tanah yang akan dihapus
 */
export const deleteTanah = async (id) => {
  try {
    const response = await api.delete(`/tanah/${id}`);
    return response.data; // Berisi pesan sukses
  } catch (error) {
    console.error('Error deleting data tanah:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengambil data satu tanah berdasarkan ID.
 * @param {string|number} id - ID tanah
 */
export const getTanahById = async (id) => {
  try {
    const response = await api.get(`/tanah/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data tanah ${id}:`, error.response || error);
    throw error.response ? error.response.data : error;
  }
};