// src/components/common/TanahForm.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Utility Functions (Wajib) ---

// Fix ikon Leaflet (agar marker muncul)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Fungsi untuk memformat string tanggal dari backend ke YYYY-MM-DD
const formatToDateInput = (dateString) => {
    if (!dateString) return '';
    // Memastikan hanya mengambil bagian tanggal (YYYY-MM-DD)
    return dateString.substring(0, 10);
};

// Fungsi untuk parsing koordinat awal ke objek Leaflet
const parseInitialKoordinat = (koordinatString) => {
    if (!koordinatString) return null;
    const parts = koordinatString.split(',').map(s => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        // Menggunakan L.latLng untuk objek Leaflet
        return L.latLng(parts[0], parts[1]); 
    }
    return null;
};

// Komponen Peta Internal (untuk Marker dan Click Handler)
const MapPicker = ({ onMapClick, position }) => {
    const map = useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        }
    });

    // Pindahkan view peta ke marker baru/posisi awal
    useEffect(() => {
        if (position) {
            map.setView(position, 16, { animate: true, duration: 0.5 });
        }
    }, [position, map]);

    return position ? <Marker position={position} /> : null;
};


// Komponen Form Utama
function TanahForm({ initialData, masterData, onSubmit, submitLoading, error, onCancel, isEditing }) {
    
    // --- LOGIC DATA INITIALIZATION ---
    // Fungsi untuk memproses data awal dari API
    const processInitialData = (data) => {
        if (!data) return {};
        
        // Buat salinan untuk dimanipulasi
        const processedData = { ...data };

        // Format tanggal agar sesuai dengan input type="date" (KRITIS)
        processedData.tanggal_perolehan = formatToDateInput(data.tanggal_perolehan);
        processedData.tanggal_sertifikat = formatToDateInput(data.tanggal_sertifikat);

        // Tambahkan default kategori utama jika belum ada (hanya untuk tambah data)
        if (!processedData.kategori_utama) {
            // Asumsi kode_barang 01.01.01.01.01, ambil 01.01.01
            processedData.kategori_utama = data.kode_barang?.substring(0, 8) || '';
        }
        
        return processedData;
    };

    // State form diinisialisasi dengan data awal yang sudah diproses
    const [form, setForm] = useState(processInitialData(initialData));
    
    // State untuk kontrol peta (objek Leaflet)
    const initialMapPosition = parseInitialKoordinat(initialData.koordinat);
    const [mapCenter, setMapCenter] = useState(initialMapPosition || L.latLng(-6.200000, 106.816666)); // Default Jakarta
    const [mapPosition, setMapPosition] = useState(initialMapPosition);


    // Update form dan peta jika initialData berubah (KRITIS UNTUK EDIT)
    useEffect(() => {
        const newFormData = processInitialData(initialData);
        setForm(newFormData);
        
        // Update posisi peta
        const newMapPosition = parseInitialKoordinat(initialData.koordinat);
        setMapPosition(newMapPosition);
        if (newMapPosition) {
            setMapCenter(newMapPosition); // Pindahkan center peta
        }
    }, [initialData]); 
    // --- END LOGIC DATA INITIALIZATION ---
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Logic update Kode Barang
        if (name === 'kategori_utama') {
            // ... (logika Anda yang ada untuk kode barang) ...
            // Di sini Anda mungkin ingin mereset kode_barang dan nup
            setForm(prev => ({ 
                ...prev, 
                [name]: value,
                kode_barang: masterData.kodefikasi[value]?.kode_barang_default || '',
                nup: ''
            }));
        }
    };

    const handleSetKoordinat = (latlng) => {
        const newKoordinat = `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
        setForm(prev => ({ ...prev, koordinat: newKoordinat }));
        setMapPosition(latlng);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lakukan validasi sederhana di sini jika perlu
        onSubmit(form);
    };

    // --- RENDERING ---
    const availableKodefikasi = masterData.kodefikasi[form.kategori_utama]?.nup_options || [];

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="notification error">{error}</div>}

            {/* Card 1: Informasi Dasar */}
            <div className="card">
                <div className="card-header"><h4><i className="fas fa-file-alt"></i> Informasi Dasar</h4></div>
                <div className="card-body">
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                        
                        <div className="form-group">
                            <label htmlFor="asal_perolehan">Asal Perolehan <span className="required-star">*</span></label>
                            <select id="asal_perolehan" name="asal_perolehan" className="form-control" value={form.asal_perolehan} onChange={handleChange} required>
                                <option value="">-- Pilih Asal Perolehan --</option>
                                {masterData.asal?.map(asal => <option key={asal.nama} value={asal.nama}>{asal.nama}</option>)}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="tanggal_perolehan">Tanggal Perolehan</label>
                            <input type="date" id="tanggal_perolehan" name="tanggal_perolehan" className="form-control" value={form.tanggal_perolehan} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="luas">Luas (m²) <span className="required-star">*</span></label>
                            <input type="number" id="luas" name="luas" className="form-control" value={form.luas} onChange={handleChange} placeholder="Contoh: 1000" required min="0.01" step="0.01" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="harga_perolehan">Harga Perolehan (Rp)</label>
                            <input type="number" id="harga_perolehan" name="harga_perolehan" className="form-control" value={form.harga_perolehan} onChange={handleChange} placeholder="Contoh: 150000000" min="0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Kodefikasi & Sertifikat */}
            <div className="card">
                <div className="card-header"><h4><i className="fas fa-certificate"></i> Kodefikasi & Sertifikat</h4></div>
                <div className="card-body">
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                        
                        <div className="form-group">
                            <label htmlFor="kategori_utama">Kategori Kode Barang</label>
                            <select id="kategori_utama" name="kategori_utama" className="form-control" value={form.kategori_utama} onChange={handleChange}>
                                <option value="">-- Pilih Kategori --</option>
                                {masterData.master_kode_utama?.map(item => (
                                    <option key={item.kode} value={item.kode}>{item.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="kode_barang">Kode Barang</label>
                            <input type="text" id="kode_barang" name="kode_barang" className="form-control" value={form.kode_barang} onChange={handleChange} readOnly />
                        </div>

                        <div className="form-group">
                            <label htmlFor="nup">NUP (Nomor Urut Pendaftaran)</label>
                            <select id="nup" name="nup" className="form-control" value={form.nup} onChange={handleChange}>
                                <option value="">-- Pilih NUP --</option>
                                {availableKodefikasi.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nomor_sertifikat">Nomor Sertifikat</label>
                            <input type="text" id="nomor_sertifikat" name="nomor_sertifikat" className="form-control" value={form.nomor_sertifikat} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status_sertifikat">Status Sertifikat</label>
                            <select id="status_sertifikat" name="status_sertifikat" className="form-control" value={form.status_sertifikat} onChange={handleChange}>
                                <option value="">-- Pilih Status --</option>
                                {masterData.statusSertifikat?.map(status => <option key={status.nama} value={status.nama}>{status.nama}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tanggal_sertifikat">Tanggal Sertifikat</label>
                            <input type="date" id="tanggal_sertifikat" name="tanggal_sertifikat" className="form-control" value={form.tanggal_sertifikat} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3: Lokasi & Peta */}
            <div className="card">
                <div className="card-header"><h4><i className="fas fa-map-marker-alt"></i> Lokasi & Peta</h4></div>
                <div className="card-body">
                    <div className="form-group" style={{gridColumn: '1 / -1'}}>
                        <label htmlFor="lokasi">Lokasi / Alamat Lengkap</label>
                        <textarea id="lokasi" name="lokasi" className="form-control" value={form.lokasi} onChange={handleChange} rows="3" placeholder="Contoh: Jl. Raya Desa No. 123..." />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem'}}>
                        <div className="form-group">
                            <label htmlFor="penggunaan">Penggunaan Tanah</label>
                            <select id="penggunaan" name="penggunaan" className="form-control" value={form.penggunaan} onChange={handleChange}>
                                <option value="">-- Pilih Penggunaan --</option>
                                {masterData.penggunaan?.map(guna => <option key={guna.nama} value={guna.nama}>{guna.nama}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="kondisi">Kondisi Tanah</label>
                            <select id="kondisi" name="kondisi" className="form-control" value={form.kondisi} onChange={handleChange}>
                                <option value="Baik">Baik</option>
                                <option value="Rusak Ringan">Rusak Ringan</option>
                                <option value="Rusak Berat">Rusak Berat</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
                        <label>Koordinat Lokasi (Klik Peta)</label>
                        <input type="text" id="koordinat" name="koordinat" className="form-control" value={form.koordinat} onChange={handleChange} readOnly={!isEditing} placeholder="Latitude, Longitude" />
                        <div style={{height: '350px', width: '100%', borderRadius: '8px', zIndex: 1, marginTop: '10px'}}>
                            <MapContainer 
                                center={mapCenter} 
                                zoom={mapPosition ? 16 : 13} 
                                scrollWheelZoom={true}
                                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapPicker onMapClick={handleSetKoordinat} position={mapPosition} />
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 4: Batas dan Keterangan */}
            <div className="card">
                <div className="card-header"><h4><i className="fas fa-ruler"></i> Batas & Keterangan</h4></div>
                <div className="card-body">
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem'}}>
                        <div className="form-group"><label htmlFor="batas_utara">Batas Utara</label><input type="text" id="batas_utara" name="batas_utara" className="form-control" value={form.batas_utara} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="batas_timur">Batas Timur</label><input type="text" id="batas_timur" name="batas_timur" className="form-control" value={form.batas_timur} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="batas_selatan">Batas Selatan</label><input type="text" id="batas_selatan" name="batas_selatan" className="form-control" value={form.batas_selatan} onChange={handleChange} /></div>
                        <div className="form-group"><label htmlFor="batas_barat">Batas Barat</label><input type="text" id="batas_barat" name="batas_barat" className="form-control" value={form.batas_barat} onChange={handleChange} /></div>
                    </div>
                    
                    <div className="form-group" style={{gridColumn: 'span 2', marginTop: '1.5rem'}}><label htmlFor="keterangan">Keterangan Tambahan</label><textarea id="keterangan" name="keterangan" className="form-control" value={form.keterangan} onChange={handleChange}></textarea></div>
                </div>
            </div>

            {/* Tombol Aksi */}
            <div className="card">
                <div className="card-body">
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                        {onCancel && (
                            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitLoading}>
                                <i className="fas fa-times"></i> Batal
                            </button>
                        )}
                        <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                            {submitLoading ? (<><span className="loading-spinner"></span> Menyimpan...</>) : (<><i className="fas fa-save"></i> Simpan Data</>)}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default TanahForm;