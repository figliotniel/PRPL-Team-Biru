import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTanahById } from '../services/tanahService';
import { createPemanfaatan } from '../services/pemanfaatanTanahService';
import { useAuth } from '../hooks/useAuth';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../assets/Layout.css'; // <-- Path CSS dikembalikan ke original

// --- Fix ikon Leaflet ---
if (L.Icon.Default.prototype._getIconUrl) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}

// --- Helper ---
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
};
const formatCurrency = (number) => {
    if (!number) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(number);
};

// --- Komponen Modal Validasi (Kades) ---
// (Disalin dari DashboardPage)
function ValidationModal({ show, action, onCancel, onConfirm, isSaving = false }) {
    if (!show) return null;
    const [catatan, setCatatan] = useState('');
    const [error, setError] = useState('');
    const title = action === 'Disetujui' ? 'Setujui Aset' : 'Tolak Aset';

    const handleSubmit = () => {
        if (action === 'Ditolak' && !catatan.trim()) {
            setError('Catatan wajib diisi jika aset ditolak.');
            return;
        }
        onConfirm(catatan);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-dialog">
                <div className="modal-header">
                    <h4>{title}</h4>
                    <button onClick={onCancel} className="modal-close-btn" disabled={isSaving}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>Apakah Anda yakin ingin <strong>{action === 'Disetujui' ? 'Menyetujui' : 'Menolak'}</strong> aset ini?</p>
                    <div className="form-group">
                        <label htmlFor="catatan_validasi">Catatan Validasi {action === 'Ditolak' && <span style={{ color: 'red' }}>*</span>}</label>
                        <textarea
                            id="catatan_validasi"
                            className="form-control"
                            rows="3"
                            value={catatan}
                            onChange={(e) => {
                                setCatatan(e.target.value);
                                if (error) setError('');
                            }}
                            disabled={isSaving}
                        ></textarea>
                        {error && <small className="form-error-text">{error}</small>}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onCancel} className="btn btn-secondary" disabled={isSaving}>Batal</button>
                    <button
                        onClick={handleSubmit}
                        className={`btn ${action === 'Disetujui' ? 'btn-success' : 'btn-danger'}`}
                        disabled={isSaving}
                    >
                        {isSaving ? "Menyimpan..." : (action === 'Disetujui' ? 'Ya, Setujui' : 'Ya, Tolak')}
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Komponen Modal Form Pemanfaatan (Admin) ---
// (Komponen BARU)
const BENTUK_PEMANFAATAN = ['Sewa', 'Pinjam Pakai', 'Kerja Sama Pemanfaatan (KSP)', 'Bangun Guna Serah (BGS)', 'Bangun Serah Guna (BSG)', 'Lainnya'];
const STATUS_PEMBAYARAN = ['Lunas', 'Belum Lunas', 'Cicilan'];

function PemanfaatanFormModal({ show, onCancel, onSave, isSaving = false }) {
    if (!show) return null;

    const [formData, setFormData] = useState({
        bentuk_pemanfaatan: '',
        pihak_ketiga: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        nilai_kontribusi: '',
        status_pembayaran: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.bentuk_pemanfaatan) newErrors.bentuk_pemanfaatan = 'Bentuk pemanfaatan wajib diisi.';
        if (!formData.pihak_ketiga) newErrors.pihak_ketiga = 'Pihak ketiga wajib diisi.';
        if (!formData.tanggal_mulai) newErrors.tanggal_mulai = 'Tanggal mulai wajib diisi.';
        if (!formData.tanggal_selesai) newErrors.tanggal_selesai = 'Tanggal selesai wajib diisi.';
        if (formData.tanggal_selesai && new Date(formData.tanggal_selesai) < new Date(formData.tanggal_mulai)) {
            newErrors.tanggal_selesai = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
        }
        if (!formData.nilai_kontribusi || formData.nilai_kontribusi < 0) newErrors.nilai_kontribusi = 'Nilai kontribusi wajib diisi (min. 0).';
        if (!formData.status_pembayaran) newErrors.status_pembayaran = 'Status pembayaran wajib dipilih.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-dialog modal-lg"> {/* Modal lebih besar */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                        <h4>Tambah Riwayat Pemanfaatan</h4>
                        <button type="button" onClick={onCancel} className="modal-close-btn" disabled={isSaving}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <div className="grid-2-col" style={{ gap: '15px' }}>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="bentuk_pemanfaatan">Bentuk Pemanfaatan</label>
                                <select id="bentuk_pemanfaatan" name="bentuk_pemanfaatan" className="form-control" value={formData.bentuk_pemanfaatan} onChange={handleChange}>
                                    <option value="">-- Pilih Bentuk --</option>
                                    {BENTUK_PEMANFAATAN.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {errors.bentuk_pemanfaatan && <small className="form-error-text">{errors.bentuk_pemanfaatan}</small>}
                            </div>
                            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                <label htmlFor="pihak_ketiga">Pihak Ketiga</label>
                                <input type="text" id="pihak_ketiga" name="pihak_ketiga" className="form-control" value={formData.pihak_ketiga} onChange={handleChange} />
                                {errors.pihak_ketiga && <small className="form-error-text">{errors.pihak_ketiga}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal_mulai">Tanggal Mulai</label>
                                <input type="date" id="tanggal_mulai" name="tanggal_mulai" className="form-control" value={formData.tanggal_mulai} onChange={handleChange} />
                                {errors.tanggal_mulai && <small className="form-error-text">{errors.tanggal_mulai}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="tanggal_selesai">Tanggal Selesai</label>
                                <input type="date" id="tanggal_selesai" name="tanggal_selesai" className="form-control" value={formData.tanggal_selesai} onChange={handleChange} />
                                {errors.tanggal_selesai && <small className="form-error-text">{errors.tanggal_selesai}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="nilai_kontribusi">Nilai Kontribusi (Rp)</label>
                                <input type="number" id="nilai_kontribusi" name="nilai_kontribusi" className="form-control" value={formData.nilai_kontribusi} onChange={handleChange} placeholder="Contoh: 5000000" />
                                {errors.nilai_kontribusi && <small className="form-error-text">{errors.nilai_kontribusi}</small>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="status_pembayaran">Status Pembayaran</label>
                                <select id="status_pembayaran" name="status_pembayaran" className="form-control" value={formData.status_pembayaran} onChange={handleChange}>
                                    <option value="">-- Pilih Status --</option>
                                    {STATUS_PEMBAYARAN.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.status_pembayaran && <small className="form-error-text">{errors.status_pembayaran}</small>}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSaving}>Batal</button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? "Menyimpan..." : "Simpan Pemanfaatan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


// --- Halaman Utama Detail ---
function DetailTanahPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // State untuk Modal Validasi
    const [showValidateModal, setShowValidateModal] = useState(false);
    const [validationAction, setValidationAction] = useState(''); // 'Disetujui' or 'Ditolak'
    const [isSavingValidation, setIsSavingValidation] = useState(false);
    
    // State untuk Modal Pemanfaatan (BARU)
    const [showPemanfaatanModal, setShowPemanfaatanModal] = useState(false);
    const [isSavingPemanfaatan, setIsSavingPemanfaatan] = useState(false);

    // Fungsi ambil data
    const fetchDetail = useCallback(async () => {
        setLoading(true); // Tampilkan loading setiap kali refresh
        try {
            const response = await getTanahDetail(id);
            setData(response);
        } catch (err) {
            setError("Gagal memuat detail aset. Data mungkin tidak ditemukan.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]); // fetchDetail sudah di-wrap useCallback

    // --- Handler Validasi (Kades) ---
    const handleOpenValidateModal = (action) => {
        setValidationAction(action);
        setShowValidateModal(true);
    };
    const handleCloseValidateModal = () => {
        if (isSavingValidation) return;
        setShowValidateModal(false);
    };
    const handleConfirmValidate = async (catatan) => {
        setIsSavingValidation(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await validateTanah(id, validationAction, catatan);
            setSuccessMessage(`Aset berhasil ${validationAction}.`);
            fetchDetail(); // Refresh data halaman
            handleCloseValidateModal();
            // Arahkan kembali ke Dashboard setelah 2 detik
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan validasi.");
        } finally {
            setIsSavingValidation(false);
        }
    };
    
    // --- Handler Pemanfaatan (Admin) ---
    const handleOpenPemanfaatanModal = () => {
        setShowPemanfaatanModal(true);
    };
    const handleClosePemanfaatanModal = () => {
        if (isSavingPemanfaatan) return;
        setShowPemanfaatanModal(false);
    };
    const handleSavePemanfaatan = async (formData) => {
        setIsSavingPemanfaatan(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await createPemanfaatan(id, formData);
            setSuccessMessage("Riwayat pemanfaatan berhasil ditambahkan.");
            fetchDetail(); // Refresh data halaman (terutama tabel pemanfaatan)
            handleClosePemanfaatanModal();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data pemanfaatan.");
        } finally {
            setIsSavingPemanfaatan(false);
        }
    };
    

    if (loading && !data) return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat Detail Aset...</div>;
    if (error && !data) return <div className="notification error">{error}</div>;
    if (!data) return <div className="notification error">Data aset tidak ditemukan.</div>;
    
    const coords = data.koordinat?.split(',').map(c => parseFloat(c.trim()));
    const hasValidCoords = coords && coords.length === 2 && !isNaN(coords[0]);
    const mapPosition = hasValidCoords ? [coords[0], coords[1]] : [-7.7956, 110.3695];
    const mapZoom = hasValidCoords ? 16 : 10;
    
    const isAdmin = user?.role_id === 1;
    const isKades = user?.role_id === 2;
    const needsValidation = data.status_validasi === 'Diproses';

    return (
        <div>
            {/* --- Render Semua Modal --- */}
            <ValidationModal
                show={showValidateModal}
                action={validationAction}
                onCancel={handleCloseValidateModal}
                onConfirm={handleConfirmValidate}
                isSaving={isSavingValidation}
            />
            <PemanfaatanFormModal
                show={showPemanfaatanModal}
                onCancel={handleClosePemanfaatanModal}
                onSave={handleSavePemanfaatan}
                isSaving={isSavingPemanfaatan}
            />

            <div className="content-header">
                <h1>Detail Aset (Kode: {data.kode_barang || 'N/A'})</h1>
                <div>
                    {/* Tombol Admin */}
                    {isAdmin && (
                        <Link to={`/edit-tanah/${data.id}`} className="btn btn-warning" style={{ marginRight: '10px' }}>
                            <i className="fas fa-edit"></i> Edit Data
                        </Link>
                    )}
                    
                    {/* Tombol Kades (Validasi) */}
                    {isKades && needsValidation && (
                        <>
                            <button onClick={() => handleOpenValidateModal('Ditolak')} className="btn btn-danger" style={{ marginRight: '10px' }}>
                                <i className="fas fa-times"></i> Tolak Aset
                            </button>
                            <button onClick={() => handleOpenValidateModal('Disetujui')} className="btn btn-success" style={{ marginRight: '10px' }}>
                                <i className="fas fa-check"></i> Setujui Aset
                            </button>
                        </>
                    )}
                    
                    <Link to="/dashboard" className="btn btn-secondary">Kembali</Link>
                </div>
            </div>

            {/* Notifikasi Global Halaman */}
            {error && <div className="notification error" onClick={() => setError(null)}>{error}</div>}
            {successMessage && <div className="notification success" onClick={() => setSuccessMessage(null)}>{successMessage}</div>}
            
            {/* Loading overlay saat refresh data */}
            {loading && (
                <div className="loading-overlay">
                    <p>Memperbarui data...</p>
                </div>
            )}

            {/* Peta Lokasi */}
            {hasValidCoords && (
                <div className="card" style={{ zIndex: 1 }}>
                    <div className="card-header"><h4>Visualisasi Peta Lokasi</h4></div>
                    <div className="card-body">
                        <MapContainer 
                            center={mapPosition} 
                            zoom={mapZoom} 
                            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={mapPosition} />
                        </MapContainer>
                    </div>
                </div>
            )}

            {/* Informasi Detail Aset */}
            <div className="card">
                <div className="card-header"><h4>Informasi Detail Aset</h4></div>
                <div className="card-body grid-2-col">
                    <div>
                        <h5>Data Utama</h5>
                        <ul className="detail-list">
                            <li><strong>Kode Barang</strong><span>{data.kode_barang || '-'}</span></li>
                            <li><strong>NUP</strong><span>{data.nup || '-'}</span></li>
                            <li><strong>Asal Perolehan</strong><span>{data.asal_perolehan || '-'}</span></li>
                            <li><strong>Tgl. Perolehan</strong><span>{formatDate(data.tanggal_perolehan)}</span></li>
                            <li><strong>Harga Perolehan</strong><span>{formatCurrency(data.harga_perolehan)}</span></li>
                            <li><strong>Bukti Perolehan</strong><span>{data.bukti_perolehan || '-'}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Data Yuridis (Legalitas)</h5>
                        <ul className="detail-list">
                            <li><strong>Status Tanah (Hak)</strong><span>{data.status_sertifikat || '-'}</span></li>
                            <li><strong>No. Sertifikat</strong><span>{data.nomor_sertifikat || '-'}</span></li>
                            <li><strong>Tgl. Sertifikat</strong><span>{formatDate(data.tanggal_sertifikat)}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Data Fisik</h5>
                        <ul className="detail-list">
                            <li><strong>Luas</strong><span>{data.luas?.toLocaleString('id-ID')} m²</span></li>
                            <li><strong>Lokasi / Alamat</strong><span>{data.lokasi || '-'}</span></li>
                            <li><strong>Penggunaan</strong><span>{data.penggunaan || '-'}</span></li>
                            <li><strong>Koordinat</strong><span>{data.koordinat || '-'}</span></li>
                            <li><strong>Kondisi</strong><span>{data.kondisi || '-'}</span></li>
                        </ul>
                    </div>
                    <div>
                        <h5>Batas Wilayah</h5>
                        <ul className="detail-list">
                            <li><strong>Batas Utara</strong><span>{data.batas_utara || '-'}</span></li>
                            <li><strong>Batas Timur</strong><span>{data.batas_timur || '-'}</span></li>
                            <li><strong>Batas Selatan</strong><span>{data.batas_selatan || '-'}</span></li>
                            <li><strong>Batas Barat</strong><span>{data.batas_barat || '-'}</span></li>
                        </ul>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <h5>Status & Keterangan</h5>
                        <ul className="detail-list">
                            <li><strong>Status Validasi</strong><span><span className={`status ${data.status_validasi?.toLowerCase()}`}>{data.status_validasi}</span></span></li>
                            <li><strong>Catatan Validasi</strong><span>{data.catatan_validasi || '-'}</span></li>
                            <li><strong>Diinput oleh</strong><span>{data.penginput?.nama_lengkap || '-'} pada {formatDate(data.created_at)}</span></li>
                            <li><strong>Divalidasi oleh</strong><span>{data.validator?.nama_lengkap || '-'}</span></li>
                            <li><strong>Keterangan</strong><span>{data.keterangan || '-'}</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Riwayat Pemanfaatan */}
            <div className="card">
                <div className="card-header">
                    <h4>Riwayat Pemanfaatan Aset</h4>
                    {/* Tombol ini sekarang memanggil modal */}
                    {isAdmin && (
                        <button onClick={handleOpenPemanfaatanModal} className="btn btn-primary btn-sm"><i className="fas fa-plus"></i> Tambah Pemanfaatan</button>
                    )}
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>Bentuk</th><th>Pihak Ketiga</th><th>Periode</th><th>Nilai (Rp)</th><th>Status Bayar</th></tr>
                            </thead>
                            <tbody>
                                {data.pemanfaatan?.length > 0 ? (
                                    data.pemanfaatan.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.bentuk_pemanfaatan}</td>
                                            <td>{p.pihak_ketiga}</td>
                                            <td>{formatDate(p.tanggal_mulai)} s/d {formatDate(p.tanggal_selesai)}</td>
                                            <td>{formatCurrency(p.nilai_kontribusi)}</td>
                                            <td><span className={`status-bayar ${p.status_pembayaran?.toLowerCase()}`}>{p.status_pembayaran}</span></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" style={{ textAlign: 'center' }}>Belum ada data pemanfaatan.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Histori Aset */}
             <div className="card">
                <div className="card-header"><h4>Riwayat & Histori Aset</h4></div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Deskripsi Perubahan</th></tr>
                            </thead>
                            <tbody>
                                {data.histori?.length > 0 ? (
                                    data.histori.map(h => (
                                        <tr key={h.id}>
                                            <td>{new Date(h.timestamp).toLocaleString('id-ID')}</td>
                                            <td>{h.user?.username || 'Sistem'}</td>
                                            <td><span className={`status ${h.aksi?.toLowerCase()}`}>{h.aksi}</span></td>
                                            <td>{h.deskripsi_perubahan}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{ textAlign: 'center' }}>Belum ada histori yang tercatat.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default DetailTanahPage;