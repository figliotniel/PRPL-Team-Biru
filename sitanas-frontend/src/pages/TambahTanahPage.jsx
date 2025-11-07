import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Perbaikan Path: Menggunakan path absolut dari 'src/' dan ekstensi .js
import { createTanah, getMasterData } from '../services/tanahService'; 
import TanahForm from '../components/common/TanahForm';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

// State awal form
const initialFormState = {
    kategori_utama: '', sub_kategori: '', kode_barang: '',
    nup: '', asal_perolehan: '', tanggal_perolehan: '',
    harga_perolehan: '', bukti_perolehan: '', nomor_sertifikat: '',
    tanggal_sertifikat: '', status_sertifikat: '', luas: '',
    penggunaan: '', koordinat: '', kondisi: 'Baik',
    lokasi: '', batas_utara: '', batas_timur: '',
    batas_selatan: '', batas_barat: '', keterangan: '',
};

// --- HANYA ADA SATU DEFINISI FUNGSI ---
function TambahTanahPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification(); // Panggil hook notifikasi
    const [masterData, setMasterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Ambil data master (dropdown, dll) saat halaman dimuat
    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const data = await getMasterData();
                setMasterData(data);
            } catch (err) {
                // Tampilkan notifikasi error jika gagal memuat
                showNotification("Gagal memuat data master (kodefikasi, dll). Pastikan backend berjalan.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchMaster();
    }, [showNotification]); // Tambahkan showNotification sebagai dependency

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e, form) => {
        e.preventDefault();
        setSubmitLoading(true);

        // Map data form
        const dataToSend = {
            ...form,
            // Pastikan angka dikirim sebagai angka, bukan string
            harga_perolehan: parseFloat(form.harga_perolehan || 0), 
            luas: parseFloat(form.luas),
            // Hapus field sementara yang tidak perlu dikirim ke backend
            kategori_utama: undefined, 
            sub_kategori: undefined,
        };

        try {
            await createTanah(dataToSend);
            
            // Ganti alert() dengan notifikasi sukses
            showNotification("Data aset berhasil ditambahkan!", "success");
            
            // Arahkan kembali ke dashboard setelah sukses
            navigate('/dashboard'); 

        } catch (err) {
            // Tangkap error validasi dari backend (jika ada)
            const validationError = err.response?.data?.errors 
                                    ? Object.values(err.response.data.errors).flat().join('; ')
                                    : "Gagal menyimpan data. Periksa koneksi atau data Anda.";
            
            // Tampilkan notifikasi error
            showNotification(validationError, "error");
        } finally {
            setSubmitLoading(false);
        }
    };

    // --- Validasi Role ---
    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak. Hanya Admin yang dapat menambah data.</div>;
    }

    // --- Tampilan Loading ---
    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Memuat data formulir...</div>;
    }

    // --- Tampilan Halaman ---
    return (
        <>
            <div className="content-header">
                <h1>Tambah Data Tanah Baru</h1>
                <Link to="/dashboard" className="btn btn-secondary">Kembali</Link>
            </div>
            
            <div className="card">
                <div className="card-body">
                    <TanahForm
                        initialData={initialFormState}
                        masterData={masterData}
                        onSubmit={handleSubmit}
                        submitLoading={submitLoading}
                        // Error sekarang ditangani oleh useNotification,
                        // jadi kita tidak perlu mengirim prop 'error' lagi
                    />
                </div>
            </div>
        </>
    );
}

export default TambahTanahPage;