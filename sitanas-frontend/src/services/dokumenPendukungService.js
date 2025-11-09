// src/services/dokumenPendukungService.js
import api from './api'; // Instance axios kita

/**
 * Mengambil semua dokumen untuk SATU bidang tanah.
 * @param {string|number} tanahId - ID tanah (Wajib)
 */
export const getAllDokumen = async (tanahId) => {
  if (!tanahId) {
    throw new Error('tanahId wajib diisi untuk mengambil dokumen');
  }
  try {
    const response = await api.get(`/dokumen-pendukung?tanah_id=${tanahId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dokumen:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengupload file dokumen baru.
 * @param {FormData} formData - Data form yang berisi file dan data lainnya
 */
export const uploadDokumen = async (formData) => {
  try {
    // 1. Panggil API dengan FormData
    // Axios akan otomatis mengatur 'Content-Type: multipart/form-data'
    const response = await api.post('/dokumen-pendukung', formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading dokumen:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Menghapus data dokumen berdasarkan ID.
 * @param {string|number} id - ID dokumen
 */
export const deleteDokumen = async (id) => {
  try {
    const response = await api.delete(`/dokumen-pendukung/${id}`);
    return response.data; // Berisi null
  } catch (error) {
    console.error('Error deleting dokumen:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};