import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Komponen Peta Internal
const MapPicker = ({ onMapClick, position }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return position ? <Marker position={position} /> : null;
};

// Komponen Form Utama
function TanahForm({ initialData, masterData, onSubmit, submitLoading, error }) {
    const [form, setForm] = useState(initialData);

    // Update form jika initialData berubah (penting untuk mode Edit)
    useEffect(() => {
        setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Logic update Kode Barang
        if (name === 'kategori_utama') {
            setForm(prev => ({ ...prev, sub_kategori: '', kode_barang: value }));
        } else if (name === 'sub_kategori' && form.kategori_utama) {
            setForm(prev => ({ ...prev, kode_barang: `${form.kategori_utama}.${value}` }));
        }
    };

    const handleSetKoordinat = (latlng) => {
        const lat = latlng.lat.toFixed(6);
        const lng = latlng.lng.toFixed(6);
        setForm(prev => ({ ...prev, koordinat: `${lat},${lng}` }));
    };
    
    // Konversi koordinat string ke array [lat, lng] untuk Marker
    const getMapPosition = () => {
        if (!form.koordinat) return null;
        const parts = form.koordinat.split(',');
        if (parts.length === 2) {
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lat, lng];
            }
        }
        return null;
    };

    const mapPosition = getMapPosition();
    const mapCenter = mapPosition || [-7.7956, 110.3695]; // Default Yogyakarta

    // Filter sub-kategori berdasarkan kategori utama yang dipilih
    // 'selectedSubs' SEKARANG ADALAH OBJEK: { "001": "Nama Sub 1", "002": "Nama Sub 2" }
    const selectedSubs = form.kategori_utama && masterData?.kodefikasi 
                        ? masterData.kodefikasi[form.kategori_utama] || {} // Default ke objek kosong
                        : {};

    return (
        <form onSubmit={(e) => onSubmit(e, form)}>
            {/* Notifikasi error sekarang ditangani oleh useNotification di halaman parent */}
            {/* {error && <div className="notification error">{error}</div>} */}
            
            <div className="grid-2-col">
                
                {/* Kodefikasi */}
                <div className="form-group">
                    <label htmlFor="kategori_utama">Kategori Utama Tanah</label>
                    <select id="kategori_utama" name="kategori_utama" className="form-control" value={form.kategori_utama} onChange={handleChange} required>
                        <option value="" disabled>-- Pilih Kategori Utama --</option>
                        {masterData?.master_kode_utama?.map(k => (
                            <option key={k.kode_utama} value={k.kode_utama}>{k.nama_utama}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="sub_kategori">Sub-Kategori Tanah</label>
                    <select id="sub_kategori" name="sub_kategori" className="form-control" value={form.sub_kategori} onChange={handleChange} required>
                        <option value="" disabled>-- Pilih Sub-Kategori --</option>
                        
                        {/* --- PERBAIKAN UTAMA ADA DI SINI --- */}
                        {/* Kita tidak bisa .map() sebuah OBJEK.
                            Kita gunakan Object.entries() untuk mengubah 
                            { "001": "Nama Sub" } 
                            menjadi 
                            [ ["001", "Nama Sub"] ] 
                            yang bisa di-map().
                        */}
                        {Object.entries(selectedSubs).map(([kode_sub, nama_sub]) => (
                            <option key={kode_sub} value={kode_sub}>{nama_sub}</option>
                        ))}
                        {/* --- BATAS PERBAIKAN --- */}

                    </select>
                </div>
                
                {/* Data Perolehan */}
                <div className="form-group"><label htmlFor="nup">NUP</label><input type="text" id="nup" name="nup" className="form-control" value={form.nup} onChange={handleChange} placeholder="001" /></div>
                <div className="form-group">
                    <label htmlFor="asal_perolehan">Asal Perolehan</label>
                    <input type="text" id="asal_perolehan" name="asal_perolehan" className="form-control" list="asal-list" value={form.asal_perolehan} onChange={handleChange} required placeholder="Hibah / Pembelian" />
                    <datalist id="asal-list">
                        {/* Perbaikan: Gunakan masterData.asal (bukan asal.nama_asal) */}
                        {masterData?.asal?.map((a) => <option key={a.id} value={a.nama_asal} />)}
                    </datalist>
                </div>

                <div className="form-group"><label htmlFor="tanggal_perolehan">Tgl. Perolehan</label><input type="date" id="tanggal_perolehan" name="tanggal_perolehan" className="form-control" value={form.tanggal_perolehan} onChange={handleChange} /></div>
                <div className="form-group"><label htmlFor="harga_perolehan">Harga Perolehan (Rp)</label><input type="number" id="harga_perolehan" name="harga_perolehan" className="form-control" value={form.harga_perolehan} onChange={handleChange} placeholder="50000000" /></div>
                <div className="form-group" style={{gridColumn: 'span 2'}}><label htmlFor="bukti_perolehan">Bukti Perolehan</label><input type="text" id="bukti_perolehan" name="bukti_perolehan" className="form-control" value={form.bukti_perolehan} onChange={handleChange} placeholder="No. Akta Hibah/BAST" /></div>
                
                {/* Data Yuridis */}
                <div className="form-group"><label htmlFor="nomor_sertifikat">Nomor Sertifikat</label><input type="text" id="nomor_sertifikat" name="nomor_sertifikat" className="form-control" value={form.nomor_sertifikat} onChange={handleChange} /></div>
                <div className="form-group"><label htmlFor="tanggal_sertifikat">Tanggal Sertifikat</label><input type="date" id="tanggal_sertifikat" name="tanggal_sertifikat" className="form-control" value={form.tanggal_sertifikat} onChange={handleChange} /></div>
                <div className="form-group">
                    <label htmlFor="status_sertifikat">Status Tanah (Hak)</label>
                    <input type="text" id="status_sertifikat" name="status_sertifikat" className="form-control" list="status-sertifikat-list" value={form.status_sertifikat} onChange={handleChange} placeholder="Hak Milik / HGB" />
                    <datalist id="status-sertifikat-list">
                        {/* Perbaikan: Gunakan masterData.statusSertifikat */}
                        {masterData?.statusSertifikat?.map((s) => <option key={s.id} value={s.nama_status} />)}
                    </datalist>
                </div>
                
                {/* Data Fisik */}
                <div className="form-group"><label htmlFor="luas">Luas (m²)</label><input type="number" step="0.01" id="luas" name="luas" className="form-control" value={form.luas} onChange={handleChange} required /></div>
                <div className="form-group">
                    <label htmlFor="penggunaan">Penggunaan Lahan</label>
                    <input type="text" id="penggunaan" name="penggunaan" className="form-control" list="penggunaan-list" value={form.penggunaan} onChange={handleChange} placeholder="Sawah / Gedung" />
                    <datalist id="penggunaan-list">
                        {/* Perbaikan: Gunakan masterData.penggunaan */}
                        {masterData?.penggunaan?.map((p) => <option key={p.id} value={p.nama_penggunaan} />)}
                    </datalist>
                </div>
                <div className="form-group"><label htmlFor="koordinat">Koordinat (Lat, Long)</label><input type="text" id="koordinat" name="koordinat" className="form-control" value={form.koordinat} onChange={handleChange} placeholder="Klik peta atau isi manual" /></div>
                
                <div className="form-group">
                    <label htmlFor="kondisi">Kondisi Aset</label>
                    <select id="kondisi" name="kondisi" className="form-control" value={form.kondisi} onChange={handleChange}>
                        <option value="Baik">Baik (B)</option>
                        {/* Perbaikan: Value harus sesuai dengan migrasi backend */}
                        <option value="Rusak Ringan">Rusak Ringan (RR)</option>
                        <option value="Rusak Berat">Rusak Berat (RB)</option>
                    </select>
                </div>
                <div className="form-group" style={{gridColumn: 'span 2'}}><label htmlFor="lokasi">Lokasi/Alamat</label><textarea id="lokasi" name="lokasi" className="form-control" value={form.lokasi} onChange={handleChange}></textarea></div>
                
                {/* Batas Wilayah */}
                <div className="form-group"><label htmlFor="batas_utara">Batas Utara</label><input type="text" id="batas_utara" name="batas_utara" className="form-control" value={form.batas_utara} onChange={handleChange} /></div>
                <div className="form-group"><label htmlFor="batas_timur">Batas Timur</label><input type="text" id="batas_timur" name="batas_timur" className="form-control" value={form.batas_timur} onChange={handleChange} /></div>
                <div className="form-group"><label htmlFor="batas_selatan">Batas Selatan</label><input type="text" id="batas_selatan" name="batas_selatan" className="form-control" value={form.batas_selatan} onChange={handleChange} /></div>
                <div className="form-group"><label htmlFor="batas_barat">Batas Barat</label><input type="text" id="batas_barat" name="batas_barat" className="form-control" value={form.batas_barat} onChange={handleChange} /></div>
                
                <div className="form-group" style={{gridColumn: 'span 2'}}><label htmlFor="keterangan">Keterangan Tambahan</label><textarea id="keterangan" name="keterangan" className="form-control" value={form.keterangan} onChange={handleChange}></textarea></div>
            </div>

            <div className="form-group" style={{gridColumn: '1 / -1', marginTop: '1rem'}}>
                <label>Pilih Lokasi di Peta</label>
                <div style={{height: '350px', width: '100%', borderRadius: '8px', zIndex: 1}}>
                    <MapContainer 
                        center={mapCenter} 
                        zoom={mapPosition ? 16 : 13} 
                        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapPicker onMapClick={handleSetKoordinat} position={mapPosition} />
                    </MapContainer>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                {submitLoading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
        </form>
    );
}

export default TanahForm;