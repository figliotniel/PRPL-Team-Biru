import api from './api';

/**
 * API untuk 4 kartu statistik dashboard
 * @returns {Promise<Object>} Stats data
 */
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    
    // Return default values jika backend error
    return {
      total_aset: 0,
      total_luas: 0,
      aset_diproses: 0,
      aset_disetujui: 0
    };
  }
};

/**
 * API untuk tabel aset di dashboard (dengan filter & paginasi)
 * @param {number} page - Current page number
 * @param {string} status - Filter by status
 * @param {string} search - Search keyword
 * @returns {Promise<Object>} Paginated tanah data
 */
export const getTanahList = async (page = 1, status = '', search = '') => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (status) {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/tanah?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tanah list:", error);
    
    // Return empty pagination structure
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      total: 0,
      from: 0,
      to: 0,
      per_page: 10
    };
  }
};

/**
 * Get detail tanah by ID
 * @param {number} id - Tanah ID
 * @returns {Promise<Object>} Tanah detail
 */
export const getTanahById = async (id) => {
  try {
    const response = await api.get(`/tanah/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tanah detail:", error);
    throw error;
  }
};

/**
 * Create new tanah data
 * @param {Object} tanahData - Tanah data to create
 * @returns {Promise<Object>} Created tanah
 */
export const createTanah = async (tanahData) => {
  try {
    const response = await api.post('/tanah', tanahData);
    return response.data;
  } catch (error) {
    console.error("Error creating tanah:", error);
    throw error;
  }
};

/**
 * Update tanah data
 * @param {number} id - Tanah ID
 * @param {Object} tanahData - Updated tanah data
 * @returns {Promise<Object>} Updated tanah
 */
export const updateTanah = async (id, tanahData) => {
  try {
    const response = await api.put(`/tanah/${id}`, tanahData);
    return response.data;
  } catch (error) {
    console.error("Error updating tanah:", error);
    throw error;
  }
};

/**
 * Delete tanah data
 * @param {number} id - Tanah ID
 * @returns {Promise<Object>} Response message
 */
export const deleteTanah = async (id) => {
  try {
    const response = await api.delete(`/tanah/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting tanah:", error);
    throw error;
  }
};

/**
 * Validate tanah (Approve/Reject)
 * @param {number} id - Tanah ID
 * @param {Object} validationData - Validation data
 * @param {string} validationData.status_validasi - 'Disetujui' or 'Ditolak'
 * @param {string} validationData.catatan_validasi - Optional notes
 * @returns {Promise<Object>} Updated tanah
 */
export const validateTanah = async (id, validationData) => {
  try {
    const response = await api.post(`/tanah/${id}/validate`, validationData);
    return response.data;
  } catch (error) {
    console.error("Error validating tanah:", error);
    throw error;
  }
};

/**
 * Upload dokumen pendukung tanah
 * @param {number} tanahId - Tanah ID
 * @param {File} file - File to upload
 * @param {Object} metadata - Document metadata
 * @returns {Promise<Object>} Upload response
 */
export const uploadDokumen = async (tanahId, file, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tanah_id', tanahId);
    
    if (metadata.nama_dokumen) {
      formData.append('nama_dokumen', metadata.nama_dokumen);
    }
    if (metadata.kategori_dokumen) {
      formData.append('kategori_dokumen', metadata.kategori_dokumen);
    }
    if (metadata.tanggal_kadaluarsa) {
      formData.append('tanggal_kadaluarsa', metadata.tanggal_kadaluarsa);
    }
    
    const response = await api.post('/tanah/dokumen', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading dokumen:", error);
    throw error;
  }
};

/**
 * Get dokumen list for a tanah
 * @param {number} tanahId - Tanah ID
 * @returns {Promise<Array>} List of documents
 */
export const getDokumenList = async (tanahId) => {
  try {
    const response = await api.get(`/tanah/${tanahId}/dokumen`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dokumen list:", error);
    throw error;
  }
};

/**
 * Delete dokumen
 * @param {number} dokumenId - Dokumen ID
 * @returns {Promise<Object>} Response message
 */
export const deleteDokumen = async (dokumenId) => {
  try {
    const response = await api.delete(`/tanah/dokumen/${dokumenId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting dokumen:", error);
    throw error;
  }
};

/**
 * Export tanah data to Excel
 * @param {Object} filters - Export filters
 * @returns {Promise<Blob>} Excel file
 */
export const exportTanah = async (filters = {}) => {
  try {
    const response = await api.get('/tanah/export', {
      params: filters,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting tanah:", error);
    throw error;
  }
};

/**
 * Get tanah statistics by category
 * @returns {Promise<Object>} Stats by category
 */
export const getTanahStatsByCategory = async () => {
  try {
    const response = await api.get('/tanah/stats/by-category');
    return response.data;
  } catch (error) {
    console.error("Error fetching stats by category:", error);
    throw error;
  }
};

/**
 * Get tanah map data (coordinates)
 * @returns {Promise<Array>} Array of tanah with coordinates
 */
export const getTanahMapData = async () => {
  try {
    const response = await api.get('/tanah/map-data');
    return response.data;
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw error;
  }
};