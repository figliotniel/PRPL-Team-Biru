// src/services/reportService.js
import api from './api';

/**
 * Mengambil data laporan berdasarkan tipe dan rentang tanggal.
 * @param {object} reportOptions - Pilihan laporan
 * @param {string} reportOptions.startDate - Tanggal mulai (format YYYY-MM-DD)
 * @param {string} reportOptions.endDate - Tanggal selesai (format YYYY-MM-DD)
 * @param {string} reportOptions.type - Tipe laporan (misal: 'tanah', 'logs')
 */
export const generateReport = async (reportOptions) => {
  try {
    // Kita gunakan POST agar bisa mengirim 'body' berisi tanggal
    const response = await api.post('/reports/generate', reportOptions);
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error.response || error);
    throw error.response ? error.response.data : error;
  }
};