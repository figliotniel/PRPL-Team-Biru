import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTanah } from '../services/tanahService';
import { useAuth } from '../hooks/useAuth';
import '../assets/Layout.css';

// Initial form state
const initialFormState = {
    kode_barang: '',
    nup: '',
    asal_perolehan: '',
    tanggal_perolehan: '',
    harga_perolehan: '',
    nomor_sertifikat: '',
    status_sertifikat: '',
    luas: '',
    lokasi: '',
    penggunaan: '',
    koordinat: '',
    kondisi: 'Baik',
    batas_utara: '',
    batas_timur: '',
    batas_selatan: '',
    batas_barat: '',
    keterangan: ''
};

function TambahTanahPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [form, setForm] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: null });
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        
        if (!form.asal_perolehan.trim()) {
            errors.asal_perolehan = 'Asal perolehan harus diisi';
        }
        
        if (!form.luas || parseFloat(form.luas) <= 0) {
            errors.luas = 'Luas harus diisi dan lebih dari 0';
        }
        
        if (form.harga_perolehan && parseFloat(form.harga_perolehan) < 0) {
            errors.harga_perolehan = 'Harga perolehan tidak boleh negatif';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setError('Mohon lengkapi semua field yang wajib diisi');
            return;
        }
        
        setError(null);
        setIsSubmitting(true);
        
        try {
            // Konversi string kosong ke null untuk field numeric
            const cleanedData = {
                ...form,
                harga_perolehan: form.harga_perolehan ? parseFloat(form.harga_perolehan) : null,
                luas: parseFloat(form.luas),
                tanggal_perolehan: form.tanggal_perolehan || null,
                kode_barang: form.kode_barang || null,
                nup: form.nup || null,
                nomor_sertifikat: form.nomor_sertifikat || null,
                status_sertifikat: form.status_sertifikat || null,
                lokasi: form.lokasi || null,
                penggunaan: form.penggunaan || null,
                koordinat: form.koordinat || null,
                batas_utara: form.batas_utara || null,
                batas_timur: form.batas_timur || null,
                batas_selatan: form.batas_selatan || null,
                batas_barat: form.batas_barat || null,
                keterangan: form.keterangan || null
            };

            const response = await createTanah(cleanedData);
            
            // Sukses - redirect ke dashboard
            alert('Data tanah berhasil ditambahkan!');
            navigate('/dashboard');
            
        } catch (err) {
            console.error('Submit error:', err);
            
            // Handle validation errors dari backend
            if (err.response?.data?.errors) {
                const backendErrors = {};
                Object.keys(err.response.data.errors).forEach(key => {
                    backendErrors[key] = err.response.data.errors[key][0];
                });
                setValidationErrors(backendErrors);
                setError('Terdapat kesalahan pada form. Periksa kembali input Anda.');
            } else {
                setError(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Yakin ingin membatalkan? Data yang diisi akan hilang.')) {
            navigate('/dashboard');
        }
    };

    // Guard - hanya admin dan kades
    if (user?.role_id !== 1 && user?.role_id !== 2) {
        return (
            <div>
                <h1>Akses Ditolak</h1>
                <div className="notification error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Anda tidak memiliki izin untuk menambah data tanah.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="content-header">
                <div>
                    <h1>Tambah Data Tanah Kas Desa</h1>
                    <p style={{color: 'var(--text-muted)', marginTop: '0.5rem'}}>
                        Lengkapi form di bawah untuk menambahkan data aset tanah baru
                    </p>
                </div>
            </div>

            {error && (
                <div className="notification error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Card 1: Informasi Dasar */}
                <div className="card">
                    <div className="card-header">
                        <h4><i className="fas fa-info-circle"></i> Informasi Dasar</h4>
                    </div>
                    <div className="card-body">
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                            <div className="form-group">
                                <label htmlFor="kode_barang">Kode Barang</label>
                                <input 
                                    type="text"
                                    id="kode_barang"
                                    name="kode_barang"
                                    className="form-control"
                                    value={form.kode_barang}
                                    onChange={handleChange}
                                    placeholder="Contoh: TKD.001.2024"
                                />
                                {validationErrors.kode_barang && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.kode_barang}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nup">Nomor Urut Pendaftaran (NUP)</label>
                                <input 
                                    type="text"
                                    id="nup"
                                    name="nup"
                                    className="form-control"
                                    value={form.nup}
                                    onChange={handleChange}
                                    placeholder="Contoh: 001/2024"
                                />
                                {validationErrors.nup && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.nup}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="asal_perolehan">
                                    Asal Perolehan <span style={{color: 'var(--danger-color)'}}>*</span>
                                </label>
                                <input 
                                    type="text"
                                    id="asal_perolehan"
                                    name="asal_perolehan"
                                    className="form-control"
                                    value={form.asal_perolehan}
                                    onChange={handleChange}
                                    placeholder="Contoh: Hibah, Pembelian, Wakaf"
                                    required
                                />
                                {validationErrors.asal_perolehan && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.asal_perolehan}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="tanggal_perolehan">Tanggal Perolehan</label>
                                <input 
                                    type="date"
                                    id="tanggal_perolehan"
                                    name="tanggal_perolehan"
                                    className="form-control"
                                    value={form.tanggal_perolehan}
                                    onChange={handleChange}
                                />
                                {validationErrors.tanggal_perolehan && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.tanggal_perolehan}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="harga_perolehan">Harga Perolehan (Rp)</label>
                                <input 
                                    type="number"
                                    id="harga_perolehan"
                                    name="harga_perolehan"
                                    className="form-control"
                                    value={form.harga_perolehan}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                                {validationErrors.harga_perolehan && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.harga_perolehan}</small>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="luas">
                                    Luas (m²) <span style={{color: 'var(--danger-color)'}}>*</span>
                                </label>
                                <input 
                                    type="number"
                                    id="luas"
                                    name="luas"
                                    className="form-control"
                                    value={form.luas}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                {validationErrors.luas && (
                                    <small style={{color: 'var(--danger-color)'}}>{validationErrors.luas}</small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Informasi Sertifikat */}
                <div className="card">
                    <div className="card-header">
                        <h4><i className="fas fa-certificate"></i> Informasi Sertifikat</h4>
                    </div>
                    <div className="card-body">
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                            <div className="form-group">
                                <label htmlFor="nomor_sertifikat">Nomor Sertifikat</label>
                                <input 
                                    type="text"
                                    id="nomor_sertifikat"
                                    name="nomor_sertifikat"
                                    className="form-control"
                                    value={form.nomor_sertifikat}
                                    onChange={handleChange}
                                    placeholder="Contoh: 123/2024"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="status_sertifikat">Status Sertifikat</label>
                                <select
                                    id="status_sertifikat"
                                    name="status_sertifikat"
                                    className="form-control"
                                    value={form.status_sertifikat}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Pilih Status --</option>
                                    <option value="Sudah Bersertifikat">Sudah Bersertifikat</option>
                                    <option value="Belum Bersertifikat">Belum Bersertifikat</option>
                                    <option value="Proses Sertifikasi">Proses Sertifikasi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Lokasi & Penggunaan */}
                <div className="card">
                    <div className="card-header">
                        <h4><i className="fas fa-map-marker-alt"></i> Lokasi & Penggunaan</h4>
                    </div>
                    <div className="card-body">
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                            <div className="form-group" style={{gridColumn: '1 / -1'}}>
                                <label htmlFor="lokasi">Lokasi / Alamat Lengkap</label>
                                <textarea
                                    id="lokasi"
                                    name="lokasi"
                                    className="form-control"
                                    value={form.lokasi}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Contoh: Jl. Raya Desa No. 123, RT 01/RW 02, Desa..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="penggunaan">Penggunaan Tanah</label>
                                <select
                                    id="penggunaan"
                                    name="penggunaan"
                                    className="form-control"
                                    value={form.penggunaan}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Pilih Penggunaan --</option>
                                    <option value="Kantor Desa">Kantor Desa</option>
                                    <option value="Balai Desa">Balai Desa</option>
                                    <option value="Lapangan">Lapangan</option>
                                    <option value="Makam">Makam</option>
                                    <option value="Jalan">Jalan</option>
                                    <option value="Pertanian">Pertanian</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="kondisi">Kondisi Tanah</label>
                                <select
                                    id="kondisi"
                                    name="kondisi"
                                    className="form-control"
                                    value={form.kondisi}
                                    onChange={handleChange}
                                >
                                    <option value="Baik">Baik</option>
                                    <option value="Rusak Ringan">Rusak Ringan</option>
                                    <option value="Rusak Berat">Rusak Berat</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="koordinat">Koordinat (Lat, Long)</label>
                                <input 
                                    type="text"
                                    id="koordinat"
                                    name="koordinat"
                                    className="form-control"
                                    value={form.koordinat}
                                    onChange={handleChange}
                                    placeholder="Contoh: -6.200000, 106.816666"
                                />
                                <small style={{color: 'var(--text-muted)', fontSize: '0.75rem'}}>
                                    Format: latitude, longitude
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: Batas-Batas */}
                <div className="card">
                    <div className="card-header">
                        <h4><i className="fas fa-border-all"></i> Batas-Batas Tanah</h4>
                    </div>
                    <div className="card-body">
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
                            <div className="form-group">
                                <label htmlFor="batas_utara">Batas Utara</label>
                                <input 
                                    type="text"
                                    id="batas_utara"
                                    name="batas_utara"
                                    className="form-control"
                                    value={form.batas_utara}
                                    onChange={handleChange}
                                    placeholder="Contoh: Jalan Raya"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="batas_timur">Batas Timur</label>
                                <input 
                                    type="text"
                                    id="batas_timur"
                                    name="batas_timur"
                                    className="form-control"
                                    value={form.batas_timur}
                                    onChange={handleChange}
                                    placeholder="Contoh: Tanah Pak Ahmad"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="batas_selatan">Batas Selatan</label>
                                <input 
                                    type="text"
                                    id="batas_selatan"
                                    name="batas_selatan"
                                    className="form-control"
                                    value={form.batas_selatan}
                                    onChange={handleChange}
                                    placeholder="Contoh: Sungai"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="batas_barat">Batas Barat</label>
                                <input 
                                    type="text"
                                    id="batas_barat"
                                    name="batas_barat"
                                    className="form-control"
                                    value={form.batas_barat}
                                    onChange={handleChange}
                                    placeholder="Contoh: Tanah Bu Siti"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 5: Keterangan */}
                <div className="card">
                    <div className="card-header">
                        <h4><i className="fas fa-sticky-note"></i> Keterangan Tambahan</h4>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <label htmlFor="keterangan">Keterangan</label>
                            <textarea
                                id="keterangan"
                                name="keterangan"
                                className="form-control"
                                value={form.keterangan}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Catatan atau informasi tambahan..."
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card">
                    <div className="card-body">
                        <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                <i className="fas fa-times"></i> Batal
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"></i> Simpan Data
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TambahTanahPage;