import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https-unpkg-com.translate.goog/leaflet@1.7.1/dist/images/marker-icon-2x.png?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp'.replace('https-unpkg-com.translate.goog', 'https://unpkg.com').replace('?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp', ''),
    iconUrl: 'https-unpkg-com.translate.goog/leaflet@1.7.1/dist/images/marker-icon.png?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp'.replace('https-unpkg-com.translate.goog', 'https://unpkg.com').replace('?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp', ''),
    shadowUrl: 'https-unpkg-com.translate.goog/leaflet@1.7.1/dist/images/marker-shadow.png?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp'.replace('https-unpkg-com.translate.goog', 'https://unpkg.com').replace('?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp', ''),
});

// Komponen internal untuk menangani logika klik dan update marker
function LocationMarker({ position, onPositionChange }) {
    const map = useMapEvents({
        click(e) {
            // Saat peta di-klik, panggil callback untuk update koordinat
            onPositionChange(e.latlng);
        },
        locationfound(e) {
            onPositionChange(e.latlng);
            map.flyTo(e.latlng, 13);
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    // Tampilkan marker jika posisi valid
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}


function MapPicker({ initialCoordinates, onCoordinatesSelect }) {
    // Fungsi untuk mem-parsing string "lat, lng" dari form
    const parseCoordinates = (coords) => {
        if (typeof coords === 'string' && coords.includes(',')) {
            const parts = coords.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                // Leaflet menggunakan [lat, lng]
                return [parts[0], parts[1]];
            }
        }
        return null; // Kembalikan null jika tidak valid
    };

    // Tentukan posisi awal
    const initialPosition = useMemo(() => parseCoordinates(initialCoordinates), [initialCoordinates]);
    
    // Default center jika tidak ada koordinat (misal: tengah Indonesia)
    const defaultCenter = [-2.548926, 118.014863];

    // State untuk posisi marker
    const [markerPosition, setMarkerPosition] = useState(initialPosition);

    // Update state internal jika prop `initialCoordinates` berubah (misal: diketik manual di parent)
    useEffect(() => {
        setMarkerPosition(parseCoordinates(initialCoordinates));
    }, [initialCoordinates]);

    // Callback saat posisi di peta dipilih
    const handlePositionChange = useCallback((latlng) => {
        const newPos = [latlng.lat, latlng.lng];
        setMarkerPosition(newPos);
        // Kirim balik ke parent dalam format string "lat, lng"
        onCoordinatesSelect(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
    }, [onCoordinatesSelect]);

    return (
        // Styling ini akan membuat peta menyatu dengan desain form Anda
        <div style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
            <MapContainer 
                center={initialPosition || defaultCenter} 
                zoom={initialPosition ? 13 : 5} 
                scrollWheelZoom={true} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker 
                    position={markerPosition} 
                    onPositionChange={handlePositionChange} 
                />
            </MapContainer>
        </div>
    );
}

export default MapPicker;