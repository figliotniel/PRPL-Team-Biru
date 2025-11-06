import api from './api';

/**
 * Mengambil data log aktivitas dari server
 * Menerima filter sebagai query params
 * @param {object} filters - Contoh: { page, user_id, tanggal_mulai, tanggal_selesai }
 */
export const getLogs = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters);

        // Hapus parameter yang kosong
        Object.keys(filters).forEach(key => {
            if (!filters[key]) {
                params.delete(key);
            }
        });

        const response = await api.get(`/logs?${params.toString()}`);
        return response.data; // Asumsi backend mengembalikan data paginasi
    } catch (error) {
        console.error("Gagal mengambil data logs:", error);
        throw error;
    }
};