// src/pages/DetailTanahPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTanahDetail } from '../services/tanahService';
import { useAuth } from '../hooks/useAuth';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Hapus icon default agar tidak error (asumsi sudah diatur di TambahTanahPage)
if (L.Icon.Default.prototype._getIconUrl) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
}


function DetailTanahPage() {
    const { id } = useParams(); // Mengambil ID dari URL
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await getTanahDetail(id);
                setData(response);
            } catch (err) {
                setError("Gagal memuat detail aset. Data mungkin tidak ditemukan.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Memuat Detail Aset...</div>;
    if (error) return <div className="notification error">{error}</div>;
    if (!data) return <div className="notification info">Data aset tidak ditemukan.</div>;
    
    // Konversi koordinat untuk peta
    const coords = data.koordinat?.split(',').map(c => parseFloat(c.trim()));
    const hasValidCoords = coords && coords.length === 2 && !isNaN(coords[0]);
    const initialLat = hasValidCoords ? coords[0] : -7.7956;
    const initialLng = hasValidCoords ? coords[1] : 110.3695;
    

    return (
        <div>
            <div className="content-header">
                <h1>Detail Aset Tanah (Kode: {data.kode_barang || 'N/A'})</h1>
                <div>
                    <Link to="/dashboard" className="btn btn-secondary">Kembali</Link>
                </div>
            </div>

            {/* Peta Lokasi */}
            {hasValidCoords && (
                <div className="card" style={{zIndex: 1}}>
                    <div className="card-header"><h4>Visualisasi Lokasi</h4></div>
                    <div className="card-body">
                        <MapContainer 
                            center={[initialLat, initialLng]} 
                            zoom={16} 
                            style={{ height: '300px', width: '100%', borderRadius: '8px' }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[initialLat, initialLng]} />
                        </MapContainer>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header"><h4>Data Utama Aset</h4></div>
                <div className="card-body grid-2-col">
                    {/* Data Utama */}
                    <ul className="detail-list" style={{gridColumn: 'span 2'}}>
                        <li><strong>Kode Barang</strong><span>{data.kode_barang || '-'}</span></li>
                        <li><strong>Luas</strong><span>{data.luas.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m²</span></li>
                        <li><strong>Lokasi</strong><span>{data.lokasi || '-'}</span></li>
                        <li><strong>Status Validasi</strong><span className={`status ${data.status_validasi?.toLowerCase()}`}>{data.status_validasi}</span></li>
                        <li><strong>Diinput Oleh</strong><span>{data.penginput?.nama_lengkap || 'Admin'}</span></li>
                    </ul>
                </div>
            </div>
            
            {/* Riwayat Pemanfaatan */}
            <div className="card">
                <div className="card-header"><h4>Riwayat Pemanfaatan</h4></div>
                <div className="card-body">
                    {/* Logika tabel pemanfaatan */}
                    {data.pemanfaatan?.length > 0 ? (
                        <p>Data Pemanfaatan akan ditampilkan di sini...</p>
                    ) : (
                        <p>Belum ada riwayat pemanfaatan tercatat.</p>
                    )}
                </div>
            </div>
            
            {/* Histori Aset */}
             <div className="card">
                <div className="card-header"><h4>Histori Perubahan Aset</h4></div>
                <div className="card-body">
                    {data.histori?.length > 0 ? (
                        <p>Data Histori akan ditampilkan di sini...</p>
                    ) : (
                        <p>Belum ada histori perubahan tercatat.</p>
                    )}
                </div>
            </div>

        </div>
    );
}

export default DetailTanahPage;