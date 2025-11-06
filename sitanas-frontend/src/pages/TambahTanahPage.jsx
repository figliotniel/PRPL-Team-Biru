// src/pages/TambahTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createTanah, getMasterData } from '../services/tanahService';
import TanahForm from '../components/common/TanahForm'; // <-- Impor form
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification'; // <-- 1. Impor hook

function TambahTanahPage() {
    // ... (state lain)
    const { addNotification } = useNotification(); // <-- 2. Panggil hook

    // ...

    const handleSubmit = async (e, form) => {
        // ... (logika submit)
        try {
            await createTanah(dataToSend);
            
            // 3. GANTI alert() DENGAN INI:
            addNotification("Data aset berhasil ditambahkan!"); 
            
            navigate('/dashboard'); 
        } catch (err) {
            // ... (logika error)
            setSubmitError(validationError);
            
            // 4. Kita juga bisa pakai ini untuk error
            addNotification("Gagal menyimpan: " + validationError, "error");
        } finally {
            setSubmitLoading(false);
        }
    };

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

function TambahTanahPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [masterData, setMasterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const data = await getMasterData();
                setMasterData(data);
            } catch (err) {
                setSubmitError("Gagal memuat data master (kodefikasi, dll).");
            } finally {
                setLoading(false);
            }
        };
        fetchMaster();
    }, []);

    const handleSubmit = async (e, form) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitError(null);

        // Map data form
        const dataToSend = {
            ...form,
            harga_perolehan: parseFloat(form.harga_perolehan || 0),
            luas: parseFloat(form.luas),
            kategori_utama: undefined, // Hapus field sementara
            sub_kategori: undefined,
        };

        try {
            await createTanah(dataToSend);
            alert("Data aset berhasil ditambahkan!");
            navigate('/dashboard'); 
        } catch (err) {
            const validationError = err.response?.data?.errors 
                                    ? Object.values(err.response.data.errors).flat().join('; ')
                                    : "Gagal menyimpan data.";
            setSubmitError(validationError);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak.</div>;
    }
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>;

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
                        error={submitError}
                    />
                </div>
            </div>
        </>
    );
    }
}

export default TambahTanahPage;