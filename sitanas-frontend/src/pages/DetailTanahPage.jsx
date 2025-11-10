// src/pages/DetailTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Pastikan getTanahDetail sudah diimpor dari service
import { getTanahDetail } from '../services/tanahService'; 
import { useAuth } from '../hooks/useAuth';
import '../assets/Layout.css';
import ConfirmationModal from '../components/common/ConfirmationModal'; // Asumsi ada

function DetailTanahPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [tanah, setTanah] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fungsi untuk memformat tanggal
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        // Pastikan tanggal valid sebelum diformat
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return dateString; 
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id-ID', options);
        } catch (e) {
            return dateString;
        }
    };

    // Fungsi utama mengambil detail data
    const fetchDetail = async () => {
        try {
            setLoading(true);
            // Panggil API service yang sudah diperbarui
            const data = await getTanahDetail(id); 
            setTanah(data);
        } catch (err) {
            console.error("Gagal memuat detail tanah:", err);
            setError("Gagal memuat detail data tanah. Data mungkin tidak ditemukan atau terjadi error server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    // Handle aksi Edit
    const handleEdit = () => {
        navigate(`/edit-tanah/${id}`);
    };
    
    // Handle aksi kembali ke dashboard
    const handleBack = () => {
        navigate('/dashboard');
    };
    
    if (loading) {
        return <div className="loading-container" style={{textAlign: 'center', padding: '50px'}}>Memuat data detail...</div>;
    }

    if (error || !tanah) {
        return (
            <div className="content-header">
                <h1>Detail Aset Tanah</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-circle"></i> {error || "Data tidak ditemukan."}
                    <button onClick={handleBack} className="btn btn-sm btn-secondary" style={{marginLeft: '1rem'}}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }
    
    // Status Arsip
    const isArchived = !!tanah.deleted_at;

    return (
        <div>
            <div className="content-header">
                <div>
                    <h1>Detail Aset Tanah</h1>
                    <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Lihat informasi lengkap tentang aset dengan Kode: <strong>{tanah.kode_barang || '-'}</strong>
                    </p>
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={handleBack} className="btn btn-secondary">
                        <i className="fas fa-arrow-left"></i> Kembali
                    </button>

                    {/* Tombol Edit (Hanya Admin dan jika TIDAK diarsip) */}
                    {user?.role_id === 1 && !isArchived && (
                        <button onClick={handleEdit} className="btn btn-warning">
                            <i className="fas fa-edit"></i> Edit Data
                        </button>
                    )}
                </div>
            </div>

            {isArchived && (
                <div className="notification danger" style={{backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5'}}>
                    <i className="fas fa-archive"></i> Data ini telah diarsipkan (Soft Delete) pada {formatDate(tanah.deleted_at)}.
                </div>
            )}
            
            {success && (
                <div className="notification success">
                    <i className="fas fa-check-circle"></i> {success}
                </div>
            )}
            
            {/* --- Grid Layout untuk Detail --- */}
            <div className="detail-page-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>

                {/* Card 1: Informasi Dasar */}
                <div className="card" style={{gridColumn: '1 / -1'}}>
                    <div className="card-header">
                        <h4><i className="fas fa-info-circle"></i> Informasi Dasar Aset</h4>
                    </div>
                    <div className="card-body">
                        <div className="detail-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                            <div>
                                <label>Kode Barang / NUP</label>
                                <p>{tanah.kode_barang || '-'} / {tanah.nup || '-'}</p>
                            </div>
                            <div>
                                <label>Asal Perolehan</label>
                                <p>{tanah.asal_perolehan || '-'}</p>
                            </div>
                            <div>
                                <label>Tanggal Perolehan</label>
                                <p>{formatDate(tanah.tanggal_perolehan)}</p>
                            </div>
                            <div>
                                <label>Harga Perolehan</label>
                                <p>Rp {tanah.harga_perolehan ? parseFloat(tanah.harga_perolehan).toLocaleString('id-ID') : '0'}</p>
                            </div>
                            <div>
                                <label>Status Validasi</label>
                                <p>
                                    <span className={`status ${tanah.status_validasi?.toLowerCase()}`}>
                                        {tanah.status_validasi || 'Belum Divalidasi'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label>Diinput Oleh</label>
                                <p>{tanah.penginput?.nama_lengkap || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Card 2: Lokasi, Luas & Koordinat */}
                <div className="card" style={{gridColumn: '1 / -1'}}>
                    <div className="card-header">
                        <h4><i className="fas fa-map-marker-alt"></i> Lokasi & Fisik</h4>
                    </div>
                    <div className="card-body">
                        <div className="detail-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                            <div>
                                <label>Luas Aset</label>
                                <p>{(tanah.luas || 0).toLocaleString('id-ID')} m²</p>
                            </div>
                            <div>
                                <label>Kondisi Aset</label>
                                <p>{tanah.kondisi || '-'}</p>
                            </div>
                            <div style={{gridColumn: '1 / -1'}}>
                                <label>Lokasi / Alamat</label>
                                <p>{tanah.lokasi || '-'}</p>
                            </div>
                            <div style={{gridColumn: '1 / -1'}}>
                                <label>Koordinat (Latitude, Longitude)</label>
                                <p>
                                    {tanah.koordinat || '-'} 
                                    {tanah.koordinat && <button className="btn btn-sm btn-secondary" onClick={() => setShowMapModal(true)} style={{marginLeft: '10px'}}><i className="fas fa-map"></i> Lihat Peta</button>}
                                </p>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
                {/* Card 3: Sertifikat & Legalitas */}
                <div className="card" style={{gridColumn: '1 / -1'}}>
                    <div className="card-header">
                        <h4><i className="fas fa-certificate"></i> Sertifikat & Legalitas</h4>
                    </div>
                    <div className="card-body">
                        <div className="detail-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                            <div>
                                <label>Nomor Sertifikat</label>
                                <p>{tanah.nomor_sertifikat || '-'}</p>
                            </div>
                            <div>
                                <label>Status Sertifikat</label>
                                <p>{tanah.status_sertifikat || '-'}</p>
                            </div>
                            <div>
                                <label>Tanggal Sertifikat</label>
                                <p>{formatDate(tanah.tanggal_sertifikat)}</p>
                            </div>
                            <div>
                                <label>Bukti Perolehan</label>
                                <p>{tanah.bukti_perolehan || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Batas dan Keterangan */}
                <div className="card" style={{gridColumn: '1 / -1'}}>
                    <div className="card-header">
                        <h4><i className="fas fa-ruler"></i> Batas Wilayah & Penggunaan</h4>
                    </div>
                    <div className="card-body">
                        <div className="detail-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px'}}>
                            <div>
                                <label>Penggunaan Aset</label>
                                <p>{tanah.penggunaan || '-'}</p>
                            </div>
                            <div>
                                <label>Batas Utara</label>
                                <p>{tanah.batas_utara || '-'}</p>
                            </div>
                            <div>
                                <label>Batas Timur</label>
                                <p>{tanah.batas_timur || '-'}</p>
                            </div>
                            <div>
                                <label>Batas Selatan</label>
                                <p>{tanah.batas_selatan || '-'}</p>
                            </div>
                            <div>
                                <label>Batas Barat</label>
                                <p>{tanah.batas_barat || '-'}</p>
                            </div>
                            <div style={{gridColumn: '1 / -1'}}>
                                <label>Keterangan Tambahan</label>
                                <p>{tanah.keterangan || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Peta (Basic implementation) */}
            {showMapModal && tanah.koordinat && (
                <div className="modal" style={{ display: 'flex' }} onClick={() => setShowMapModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px', width: '90%'}}>
                        <h2>Peta Lokasi Aset</h2>
                        <p>Koordinat: {tanah.koordinat}</p>
                        <div style={{height: '400px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px'}}>
                            [Area Peta interaktif akan dimuat di sini]
                        </div>
                        <button onClick={() => setShowMapModal(false)} className="btn btn-secondary" style={{marginTop: '1rem'}}>Tutup</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DetailTanahPage;