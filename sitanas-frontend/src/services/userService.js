import api from './api';

// Mengambil daftar semua pengguna (Admin Only)
export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data; // Asumsi Laravel mengembalikan array user
    } catch (error) {
        throw error;
    }
};

// Membuat pengguna baru (Admin Only)
export const createUser = async (userData) => {
    try {
        // userData harus berisi: nama_lengkap, email, password, role_id
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Menonaktifkan/Menghapus pengguna (Admin Only)
export const deleteUser = async (userId) => {
    try {
        // Karena kita sepakat pakai soft delete, backend harus mengatur kolom 'deleted_at'
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Mengambil data Roles (Admin akan butuh ini di form)
export const getRoles = async () => {
    try {
        const response = await api.get('/master-data/roles');
        return response.data;
    } catch (error) {
        // SIMULASI jika backend belum buat
        return [
            { id: 1, nama_role: 'Admin Desa' },
            { id: 2, nama_role: 'Kepala Desa' },
            { id: 3, nama_role: 'BPD (Pengawas)' }
        ];
    }
};