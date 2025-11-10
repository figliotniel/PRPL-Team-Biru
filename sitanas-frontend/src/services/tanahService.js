import api from './api';

/**
 * API untuk 4 kartu statistik dashboard
 */
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      total_aset: 0,
      total_luas: 0,
      aset_diproses: 0,
      aset_disetujui: 0
    };
  }
};

/**
 * API untuk tabel aset di dashboard (dengan filter, search & paginasi)
 * --- UPDATE: Menambah filter arsip (withArchived, archivedOnly) ---
 */
export const getTanahList = async (page = 1, status = '', search = '', withArchived = false, archivedOnly = false) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    
    if (status) {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }
    
    // Logic Filter Arsip
    if (withArchived) {
        params.append('with_archived', 'true');
    }
    if (archivedOnly) {
        params.append('archived_only', 'true');
    }

    const response = await api.get(`/tanah?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tanah list:", error);
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
 * Menggunakan getTanahById untuk mendapatkan detail data
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

export const getTanahDetail = getTanahById;

/**
 * Create new tanah data
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
 * --- Soft Delete (Arsip) ---
 * Memanggil endpoint DELETE /tanah/{id} yang sekarang Soft Delete
 */
export const softDeleteTanah = async (id) => {
  try {
    const response = await api.delete(`/tanah/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error soft deleting tanah:", error);
    throw error;
  }
};

/**
 * --- Restore (Mengembalikan dari Arsip) ---
 * Memanggil endpoint POST /tanah/{id}/restore
 */
export const restoreTanah = async (id) => {
  try {
    const response = await api.post(`/tanah/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error("Error restoring tanah:", error);
    throw error;
  }
};

export const deleteTanah = softDeleteTanah; // Alias untuk kode lama

/**
 * Validate tanah (Approve/Reject) - Untuk Kades
 * @param {number} id - Tanah ID
 * @param {string} status_validasi - 'Disetujui' or 'Ditolak'
 * @param {string} catatan_validasi - Optional notes
 * @returns {Promise<Object>} Updated tanah
 */
export const validateTanah = async (id, status_validasi, catatan_validasi = '') => {
  try {
    const response = await api.post(`/tanah/${id}/validate`, {
      status_validasi,
      catatan_validasi
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Error validating tanah:", error);
    throw error;
  }
};

// ... (Fungsi-fungsi master data dan export lainnya dipertahankan agar lengkap)
export const getMasterData = async () => {
    try {
        const response = await api.get('/master-data/tanah');
        return response.data;
    } catch (error) {
        console.error("Error fetching master data:", error);
        return {};
    }
};