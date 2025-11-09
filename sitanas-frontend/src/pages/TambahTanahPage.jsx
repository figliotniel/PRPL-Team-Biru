import React, { useState, useEffect } from 'react';
// Asumsi Anda akan menginstal react-leaflet dan leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../assets/Layout.css'; 
import { getMasterData } from '../services/tanahService';

// Fix Leaflet Default Icon issue dengan Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Komponen Peta Interaktif untuk mengambil koordinat
const LocationMarker = ({ setKoordinat }) => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setKoordinat(`${e.latlng.lat}, ${e.latlng.lng}`);
            // Pindahkan peta ke lokasi yang diklik
            map.flyTo(e.latlng, map.getZoom()); 
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
};

// State awal untuk form (disinkronkan dengan Migration TanahKasDesa)
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
    keterangan: '',
};


function TambahDataTanahPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pastikan hanya Admin yang bisa akses halaman ini
    useEffect(() => {
        if (user && user.role_id !== 1) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        // Penanganan input number agar tidak crash saat kosong
        if (name === 'harga_perolehan' || name === 'luas') {
            setForm({ ...form, [name]: value === '' ? 0 : parseFloat(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const setKoordinatFromMap = (coords) => {
        setForm(prev => ({ ...prev, koordinat: coords }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        // ** PERBAIKAN: LAKUKAN VALIDASI DASAR DULU **
        if (!form.koordinat) {
             setError("Harap klik peta untuk menentukan Koordinat Lokasi.");
             setIsLoading(false);
             return;
        }

        try {
            const response = await postTanahData(form); // <-- POST DATA SEKARANG!
            
            alert(response.message || "Data Tanah berhasil disimpan!");
            navigate('/dashboard'); // Setelah berhasil, user akan diarahkan kembali ke dashboard
        } catch (err) {
            // Penanganan error lebih baik (misalnya dari backend Laravel)
            const validationMessage = err.response?.data?.errors 
                                      ? Object.values(err.response.data.errors).flat().join('; ')
                                      : err.response?.data?.message || "Gagal menyimpan data tanah.";
            setError(validationMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (user?.role_id !== 1) return <div className="notification error">Akses ditolak. Anda bukan Admin.</div>;
    
    // Default center (misal: Yogyakarta)
    const defaultCenter = [-7.7956, 110.3695]; 

    return (
        <div>
            <div className="content-header">
                <h1>Tambah Data Tanah Kas Desa</h1>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                    <i className="fas fa-arrow-left"></i> Kembali
                </button>
            </div>
            
            {error && <div className="notification error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card-group">
                    {/* CARD 1: INFORMASI DASAR */}
                    <div className="card">
                        <div className="card-header"><h4><i className="fas fa-file-alt icon-left"></i> Detail Aset</h4></div>
                        <div className="card-body grid-cols-2">
                            <div className="form-group"><label>Kode Barang</label><input type="text" name="kode_barang" className="form-control" value={form.kode_barang} onChange={handleChange} /></div>
                            <div className="form-group"><label>NUP</label><input type="text" name="nup" className="form-control" value={form.nup} onChange={handleChange} /></div>
                            <div className="form-group"><label>Asal Perolehan</label><input type="text" name="asal_perolehan" className="form-control" value={form.asal_perolehan} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Tanggal Perolehan</label><input type="date" name="tanggal_perolehan" className="form-control" value={form.tanggal_perolehan} onChange={handleChange} /></div>
                            <div className="form-group"><label>Harga Perolehan</label><input type="number" name="harga_perolehan" className="form-control" value={form.harga_perolehan} onChange={handleChange} /></div>
                            <div className="form-group"><label>Luas (m²)</label><input type="number" name="luas" className="form-control" value={form.luas} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Penggunaan Saat Ini</label><input type="text" name="penggunaan" className="form-control" value={form.penggunaan} onChange={handleChange} /></div>
                            <div className="form-group">
                                <label>Kondisi</label>
                                <select name="kondisi" className="form-control" value={form.kondisi} onChange={handleChange}>
                                    <option value="Baik">Baik</option>
                                    <option value="Rusak Ringan">Rusak Ringan</option>
                                    <option value="Rusak Berat">Rusak Berat</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: LOKASI DAN PETA */}
                    <div className="card">
                        <div className="card-header"><h4><i className="fas fa-map-marker-alt icon-left"></i> Lokasi & Peta</h4></div>
                        <div className="card-body">
                            <div className="form-group"><label>Nomor Sertifikat</label><input type="text" name="nomor_sertifikat" className="form-control" value={form.nomor_sertifikat} onChange={handleChange} /></div>
                            <div className="form-group"><label>Status Sertifikat</label><input type="text" name="status_sertifikat" className="form-control" value={form.status_sertifikat} onChange={handleChange} /></div>
                            <div className="form-group"><label>Lokasi Detail (Alamat)</label><textarea name="lokasi" className="form-control" value={form.lokasi} onChange={handleChange}></textarea></div>
                            
                            <div className="form-group">
                                <label>Koordinat (Lat, Lng)</label>
                                <input type="text" name="koordinat" className="form-control" value={form.koordinat} onChange={handleChange} placeholder="Klik peta untuk mendapatkan koordinat" required readOnly />
                            </div>

                            <div className="form-group">
                                <label>Pilih Lokasi di Peta (Klik untuk Tandai)</label>
                                <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                    <MapContainer 
                                        center={defaultCenter} 
                                        zoom={13} 
                                        scrollWheelZoom={true} 
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <LocationMarker setKoordinat={setKoordinatFromMap} />
                                        {/* Tampilkan marker jika koordinat sudah ada */}
                                        {form.koordinat && (() => {
                                            const parts = form.koordinat.split(',').map(p => parseFloat(p.trim()));
                                            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                                                return <Marker position={[parts[0], parts[1]]} />;
                                            }
                                            return null;
                                        })()}
                                    </MapContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> {/* End card-group */}
                
                {/* CARD 3: BATAS DAN KETERANGAN */}
                <div className="card">
                    <div className="card-header"><h4><i className="fas fa-ruler-combined icon-left"></i> Batas & Keterangan</h4></div>
                    <div className="card-body grid-cols-4"> {/* Layout 4 kolom untuk batas */}
                        <div className="form-group"><label>Batas Utara</label><input type="text" name="batas_utara" className="form-control" value={form.batas_utara} onChange={handleChange} /></div>
                        <div className="form-group"><label>Batas Timur</label><input type="text" name="batas_timur" className="form-control" value={form.batas_timur} onChange={handleChange} /></div>
                        <div className="form-group"><label>Batas Selatan</label><input type="text" name="batas_selatan" className="form-control" value={form.batas_selatan} onChange={handleChange} /></div>
                        <div className="form-group"><label>Batas Barat</label><input type="text" name="batas_barat" className="form-control" value={form.batas_barat} onChange={handleChange} /></div>
                    </div>
                    <div className="card-body">
                        <div className="form-group"><label>Keterangan Tambahan</label><textarea name="keterangan" className="form-control" value={form.keterangan} onChange={handleChange} rows="3"></textarea></div>
                    </div>
                </div>

                <div className="card-footer" style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb', textAlign: 'right' }}>
                    <button type="submit" className="btn btn-success" disabled={isLoading}>
                        {isLoading ? (
                            <span><i className="fas fa-spinner fa-spin icon-left"></i> Menyimpan...</span>
                        ) : (
                            <span><i className="fas fa-save icon-left"></i> Simpan Data Tanah</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TambahDataTanahPage;