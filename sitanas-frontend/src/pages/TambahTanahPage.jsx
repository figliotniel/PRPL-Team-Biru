import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTanah, getMasterData } from '../services/tanahService';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../hooks/useAuth';

// Hapus icon default agar tidak error
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Component Picker Peta
const MapPicker = ({ setKoordinat, currentKoordinat }) => {
    const map = useMapEvents({
        click(e) {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            setKoordinat(`${lat},${lng}`);
        },
    });

    return currentKoordinat ? <Marker position={currentKoordinat.split(',')} /> : null;
};

// State awal form
const initialFormState = {
    kategori_utama: '',
    sub_kategori: '',
    kode_barang: '',
    nup: '',
    asal_perolehan: '',
    tanggal_perolehan: '',
    harga_perolehan: '',
    bukti_perolehan: '',
    nomor_sertifikat: '',
    tanggal_sertifikat: '',
    status_sertifikat: '',
    luas: '',
    penggunaan: '',
    koordinat: '',
    kondisi: 'Baik',
    lokasi: '',
    batas_utara: '',
    batas_timur: '',
    batas_selatan: '',
    batas_barat: '',
    keterangan: '',
};

function TambahTanahPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(initialFormState);
    const [masterData, setMasterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Ambil Master Data saat komponen dimuat
    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const data = await getMasterData();
                setMasterData(data);
            } catch (err) {
                console.error("Gagal memuat master data:", err);
                setSubmitError("Gagal memuat data master (kodefikasi, asal perolehan).");
            } finally {
                setLoading(false);
            }
        };
        fetchMaster();
    }, []);

    // Logic Handle Change
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
    
    // Logic Handle Map Click
    const handleSetKoordinat = (coords) => {
        setForm(prev => ({ ...prev, koordinat: coords }));
    };

    // Logic Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setSubmitError(null);

        // Map form data ke format yang diharapkan backend
        const dataToSend = {
            ...form,
            // Pastikan harga dan luas adalah angka (jika form mengembalikan string)
            harga_perolehan: parseFloat(form.harga_perolehan || 0),
            luas: parseFloat(form.luas),
            // Hapus field yang tidak ada di DB tapi ada di form state
            kategori_utama: undefined,
            sub_kategori: undefined,
        };

        try {
            await createTanah(dataToSend);
            alert("Data aset berhasil ditambahkan dan menunggu validasi!");
            navigate('/dashboard'); 
        } catch (err) {
            // Tangani error validasi dari Laravel (Status 422)
            const validationError = err.response?.data?.errors 
                                    ? Object.values(err.response.data.errors).flat().join('; ')
                                    : "Gagal menyimpan data. Cek input atau koneksi server.";
            setSubmitError(validationError);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (user?.role_id !== 1) {
        return <div className="notification error">Akses ditolak. Hanya Admin yang dapat menambah data.</div>;
    }

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Master Data...</div>;

    // Filter sub-kategori berdasarkan kategori utama yang dipilih
    const selectedSubs = form.kategori_utama && masterData?.kodefikasi 
                        ? masterData.kodefikasi[form.kategori_utama] || [] 
                        : [];

    return (
        <>
        <div className="content-header">
            <h1>Tambah Data Tanah Baru (Kode: {form.kode_barang || 'Belum dipilih'})</h1>
            <a href="/dashboard" className="btn btn-secondary">Kembali</a>
        </div>
        
        <div className="card">
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    {submitError && <div className="notification error">{submitError}</div>}
                    
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
                                {selectedSubs.map((s, index) => (
                                    <option key={index} value={s.kode_sub}>{s.nama_sub}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Data Perolehan */}
                        <div className="form-group"><label htmlFor="nup">NUP</label><input type="text" id="nup" name="nup" className="form-control" value={form.nup} onChange={handleChange} placeholder="001" /></div>
                        <div className="form-group">
                            <label htmlFor="asal_perolehan">Asal Perolehan</label>
                            <input type="text" id="asal_perolehan" name="asal_perolehan" className="form-control" list="asal-list" value={form.asal_perolehan} onChange={handleChange} required placeholder="Hibah / Pembelian" />
                            <datalist id="asal-list">
                                {masterData?.asal?.map((a, index) => <option key={index} value={a.nama_asal} />)}
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
                                {masterData?.statusSertifikat?.map((s, index) => <option key={index} value={s.nama_status} />)}
                            </datalist>
                        </div>
                        
                        {/* Data Fisik */}
                        <div className="form-group"><label htmlFor="luas">Luas (m²)</label><input type="number" step="0.01" id="luas" name="luas" className="form-control" value={form.luas} onChange={handleChange} required /></div>
                        <div className="form-group">
                            <label htmlFor="penggunaan">Penggunaan Lahan</label>
                            <input type="text" id="penggunaan" name="penggunaan" className="form-control" list="penggunaan-list" value={form.penggunaan} onChange={handleChange} placeholder="Sawah / Gedung" />
                            <datalist id="penggunaan-list">
                                {masterData?.penggunaan?.map((p, index) => <option key={index} value={p.nama_penggunaan} />)}
                            </datalist>
                        </div>
                        <div className="form-group"><label htmlFor="koordinat">Koordinat (Lat, Long)</label><input type="text" id="koordinat" name="koordinat" className="form-control" value={form.koordinat} onChange={handleChange} placeholder="Klik peta atau isi manual" /></div>
                        
                        <div className="form-group">
                            <label htmlFor="kondisi">Kondisi Aset</label>
                            <select id="kondisi" name="kondisi" className="form-control" value={form.kondisi} onChange={handleChange}>
                                <option value="Baik">Baik (B)</option>
                                <option value="Kurang Baik">Kurang Baik (KB)</option>
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
                                center={[-7.7956, 110.3695]} // Default Yogyakarta
                                zoom={13} 
                                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <MapPicker setKoordinat={handleSetKoordinat} currentKoordinat={form.koordinat} />
                            </MapContainer>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                        {submitLoading ? 'Menyimpan...' : 'Simpan Data'}
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default TambahTanahPage;