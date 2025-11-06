// src/pages/EditTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTanahDetail, getMasterData, updateTanah } from '../services/tanahService';
import TanahForm from '../components/common/TanahForm'; // <-- Impor form
import { useAuth } from '../hooks/useAuth';

function EditTanahPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [initialData, setInitialData] = useState(null); // Data awal form
    const [masterData, setMasterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [masterResponse, detailResponse] = await Promise.all([
                    getMasterData(),
                    getTanahDetail(id)
                ]);
                
                setMasterData(masterResponse);
                
                // Set data awal untuk form
                const data = detailResponse;
                setInitialData({
                    ...data,
                    // Format tanggal YYYY-MM-DD
                    tanggal_perolehan: data.tanggal_perolehan ? data.tanggal_perolehan.split('T')[0] : '',
                    tanggal_sertifikat: data.tanggal_sertifikat ? data.tanggal_sertifikat.split('T')[0] : '',
                    // TODO: Logic untuk set kategori_utama & sub_kategori dari kode_barang
                });

            } catch (err) {
                setSubmitError("Gagal memuat data aset lama.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
            await updateTanah(id, dataToSend);
            alert("Data aset berhasil diperbarui!");
            navigate(`/detail-tanah/${id}`);
        } catch (err) {
            const validationError = err.response?.data?.errors 
                                    ? Object.values(err.response.data.errors).flat().join('; ')
                                    : "Gagal menyimpan perubahan.";
            setSubmitError(validationError);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak.</div>;
    }
    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Data...</div>;

    return (
        <>
            <div className="content-header">
                <h1>Edit Data Tanah (Kode: {initialData?.kode_barang || ''})</h1>
                <Link to={`/detail-tanah/${id}`} className="btn btn-secondary">Batalkan Edit</Link>
            </div>
            
            <div className="card">
                <div className="card-body">
                    {/* Render form HANYA jika data awal sudah siap */}
                    {initialData && (
                        <TanahForm
                            initialData={initialData}
                            masterData={masterData}
                            onSubmit={handleSubmit}
                            submitLoading={submitLoading}
                            error={submitError}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default EditTanahPage;