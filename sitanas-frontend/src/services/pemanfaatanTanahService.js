// src/services/pemanfaatanTanahService.js
import api from './api'; // Instance axios kita

/**
 * Mengambil semua data pemanfaatan.
 * @param {string|number} [tanahId] - (Opsional) Filter berdasarkan ID tanah
 */
export const getAllPemanfaatan = async (tanahId = null) => {
  try {
    let url = '/pemanfaatan-tanah';
    if (tanahId) {
      // Tambahkan query parameter jika tanahId ada
      url += `?tanah_id=${tanahId}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data pemanfaatan:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Membuat data pemanfaatan baru.
 * @param {object} pemanfaatanData - Data baru
 */
export const createPemanfaatan = async (pemanfaatanData) => {
  try {
    const response = await api.post('/pemanfaatan-tanah', pemanfaatanData);
    return response.data;
  } catch (error) {
    console.error('Error creating data pemanfaatan:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengupdate data pemanfaatan berdasarkan ID.
 * @param {string|number} id - ID data pemanfaatan
 * @param {object} pemanfaatanData - Data baru
 */
export const updatePemanfaatan = async (id, pemanfaatanData) => {
  try {
    const response = await api.put(`/pemanfaatan-tanah/${id}`, pemanfaatanData);
    return response.data;
  } catch (error) {
    console.error('Error updating data pemanfaatan:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Menghapus data pemanfaatan berdasarkan ID.
 * @param {string|number} id - ID data pemanfaatan
 */
export const deletePemanfaatan = async (id) => {
  try {
    const response = await api.delete(`/pemanfaatan-tanah/${id}`);
    return response.data; // Berisi pesan sukses (biasanya null/kosong)
  } catch (error) {
    console.error('Error deleting data pemanfaatan:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Mengambil satu data pemanfaatan berdasarkan ID (jika diperlukan).
 * @param {string|number} id - ID data pemanfaatan
 */
export const getPemanfaatanById = async (id) => {
  try {
    const response = await api.get(`/pemanfaatan-tanah/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data pemanfaatan ${id}:`, error.response || error);
    throw error.response ? error.response.data : error;
  }
};