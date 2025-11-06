import api from './api';
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

// API untuk tabel aset di dashboard (dengan filter & paginasi)
export const getTanahList = async (page = 1, status = '', search = '') => {
  try {
    // Kita gunakan URLSearchParams untuk membuat query string
    const params = new URLSearchParams();
    params.append('page', page);
    if (status) {
      params.append('status', status);
    }
    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/tanah?${params.toString()}`);
    return response.data; // Asumsi Laravel kirim data paginasi
  } catch (error) {
    console.error("Gagal mengambil daftar tanah:", error);
    throw error;
  }
};

export const createTanah = async (tanahData) => {
    try {
        const response = await api.post('/tanah', tanahData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMasterData = async () => {
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

export const getTanahDetail = async (id) => {
    try {
        // Backend harus menggunakan Eager Loading di sini!
        const response = await api.get(`/tanah/${id}`); 
        return response.data;
    } catch (error) {
        throw error;
    }
};