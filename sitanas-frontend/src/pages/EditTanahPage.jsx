// src/pages/EditTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Pastikan semua service yang diperlukan diimpor
import { getTanahDetail, updateTanah, getMasterData } from '../services/tanahService'; 
import { useAuth } from '../hooks/useAuth';
import TanahForm from '../components/common/TanahForm'; // <-- Wajib ada
import '../assets/Layout.css';

function EditTanahPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [initialForm, setInitialForm] = useState(null); // Data awal untuk form
    const [masterData, setMasterData] = useState(null); // Data master untuk dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Guard: Hanya Admin yang boleh mengedit (opsional, sesuaikan dengan role_id Anda)
    if (user?.role_id !== 1) {
        return (
            <div>
                <h1>Akses Ditolak</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Anda tidak memiliki izin untuk mengedit data tanah.
                </div>
            </div>
        );
    }

    // Fungsi untuk memuat data awal
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Ambil detail data tanah
            const tanahDetailPromise = getTanahDetail(id);
            // Ambil data master (diperlukan untuk dropdown di form)
            const masterDataPromise = getMasterData(); 
            
            const [tanahData, masterResponse] = await Promise.all([
                tanahDetailPromise,
                masterDataPromise
            ]);
            
            // Set data tanah ke state form
            setInitialForm(tanahData); 
            setMasterData(masterResponse);
            
        } catch (err) {
            console.error("Gagal memuat data edit:", err);
            // Memberikan pesan spesifik jika masterData gagal
            const errorMessage = err.message === 'Gagal memuat master data' 
                                 ? 'Gagal memuat data Master. Cek koneksi API dan endpoint Master Data.'
                                 : err.response?.data?.message || "Gagal memuat data untuk pengeditan. Silakan coba lagi.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Handler saat form disubmit
    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Panggil fungsi updateTanah dari service
            await updateTanah(id, formData); 
            
            alert('Data tanah berhasil diperbarui!');
            navigate(`/detail-tanah/${id}`); // Redirect ke halaman detail
            
        } catch (err) {
            console.error('Update error:', err);
            setError(err.response?.data?.message || 'Gagal menyimpan perubahan. Periksa kembali input Anda.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading-container" style={{textAlign: 'center', padding: '50px'}}>Memuat data pengeditan...</div>;
    }

    // Menampilkan pesan error jika fetching data gagal total
    if (error && !initialForm) {
        return (
            <div className="content-header">
                <h1>Edit Aset Tanah</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{marginTop: '10px'}}>
                    Kembali ke Dashboard
                </button>
            </div>
        );
    }
    
    // Pengecekan apakah data yang dimuat sudah diarsip (Tidak bisa diedit)
    if (initialForm?.deleted_at) {
        return (
            <div className="content-header">
                <h1>Edit Aset Tanah</h1>
                <div className="notification warning" style={{backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fcd34d'}}>
                    <i className="fas fa-archive"></i> Data ini sudah diarsipkan dan tidak bisa diedit. Silakan kembalikan dari arsip di Dashboard.
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                    Kembali ke Dashboard
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="content-header">
                <h1>Edit Data Tanah Kas Desa</h1>
                <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                    Perbarui informasi aset dengan Kode: <strong>{initialForm?.kode_barang || '-'}</strong>
                </p>
            </div>

            {error && (
                <div className="notification error">
                    <i className="fas fa-exclamation-circle"></i> {error}
                </div>
            )}
            
            {/* Komponen TanahForm akan menerima data awal dan handler submit */}
            {/* Hanya render jika initialForm dan masterData tersedia */}
            {initialForm && masterData ? (
                <TanahForm
                    initialData={initialForm}
                    masterData={masterData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    isEditing={true}
                    onCancel={() => navigate(`/detail-tanah/${id}`)}
                />
            ) : (
                <div className="loading-container" style={{textAlign: 'center', padding: '50px'}}>Memuat form...</div>
            )}
            
        </div>
    );
}

export default EditTanahPage;