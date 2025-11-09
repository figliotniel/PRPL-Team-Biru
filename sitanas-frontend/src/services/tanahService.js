import api from './api';

const TANAH_URL = '/tanah'; // Base URL untuk semua rute tanah

// ------------------------------------------------------------------------
// 1. STATISTIK
// ------------------------------------------------------------------------

// API untuk 4 kartu statistik
export const getStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error("Gagal mengambil stats:", error);
    throw error;
  }
};


// ------------------------------------------------------------------------
// 2. READ (Dashboard List)
// ------------------------------------------------------------------------

// API untuk tabel aset di dashboard (dengan filter & paginasi)
// Nama ini lebih deskriptif untuk list yang berpaginasi.
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

    const response = await api.get(`${TANAH_URL}?${params.toString()}`);
    return response.data; // Mengembalikan objek paginasi Laravel
  } catch (error) {
    console.error("Gagal mengambil daftar tanah:", error);
    throw error;
  }
};


// API untuk mengambil detail satu aset
export const getTanahDetail = async (id) => {
    try {
        const response = await api.get(`${TANAH_URL}/${id}`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};


// ------------------------------------------------------------------------
// 3. CRUD: CREATE, UPDATE, DELETE
// ------------------------------------------------------------------------

// API: CREATE (Menggantikan postTanahData)
export const createTanah = async (tanahData) => {
    try {
        const response = await api.post(TANAH_URL, tanahData); // POST ke /api/tanah
        return response.data; 
    } catch (error) {
        throw error;
    }
};

// API: UPDATE 
export const updateTanah = async (id, tanahData) => {
    try {
        // Menggunakan method PUT untuk update
        const response = await api.put(`${TANAH_URL}/${id}`, tanahData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// API: DELETE 
export const deleteTanah = async (id) => {
    try {
        // Menggunakan method DELETE (untuk Soft Delete di backend)
        const response = await api.delete(`${TANAH_URL}/${id}`);
        return response.data; 
    } catch (error) {
        throw error;
    }
};


// ------------------------------------------------------------------------
// 4. VALIDASI (Approve/Reject)
// ------------------------------------------------------------------------

export const validateTanah = async (id, status, catatan) => {
    try {
        // Endpoint: POST /api/tanah/{id}/validate
        // (Pastikan Anda telah mendaftarkan rute ini di backend routes/api.php)
        const response = await api.post(`${TANAH_URL}/${id}/validate`, { 
            status: status, 
            catatan: catatan // Nama field disesuaikan agar sama dengan backend
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ------------------------------------------------------------------------
// 5. MASTER DATA / LAPORAN (Optional & Future Use)
// ------------------------------------------------------------------------

export const getMasterData = async () => {
    // Fungsi ini tidak digunakan di Dashboard/Tambah Tanah, biarkan saja
    try {
        const response = await api.get('/master-data/tanah'); 
        return response.data;
    } catch (error) {
        return {
            kodefikasi: {},
            asal: [],
            statusSertifikat: [],
            penggunaan: []
        };
    }
};

export const getLaporan = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);
        Object.keys(filters).forEach(key => {
            if (!filters[key]) {
                params.delete(key);
            }
        });

        const response = await api.get(`/laporan/tanah?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Gagal mengambil laporan:", error);
        throw error;
    }
};

export const createPemanfaatan = async (tanahId, data) => {
    try {
        const response = await api.post(`${TANAH_URL}/${tanahId}/pemanfaatan`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};