import React from 'react';
import { Container, Row, Col, Button, Card, Table, Spinner, Alert } from 'react-bootstrap';
// 1. Impor ikon-ikon yang kita butuhkan
import { FaFileExport, FaPrint, FaBook } from 'react-icons/fa';
// 2. Impor file CSS baru yang akan kita buat
import './LaporanPage.css';
// 3. Impor hook dan library untuk fetch data
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // (Asumsi Anda akan menggunakannya)

// --- Integrasi Back-End (Contoh Fetching) ---
// TODO: Ganti fungsi fetchLaporan ini dengan endpoint API Laravel Anda
const fetchDaftarAkun = async () => {
  // Simulasi pemanggilan API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Ini adalah data bohongan (dummy data) sesuai gambar Anda
  const dummyData = [
    {
      id: 1,
      jenis: 'Tanah Kas Desa',
      kode: '01.01.05.03',
      nup: '001',
      luas: 300000.00,
      tahun: 1970,
      alamat: 'Tugu Jogja',
      hak: 'Sertifikat Hak Guna Bangunan (SHGB)',
      tglSertifikat: '12/12/1959',
      noSertifikat: '10.20.05.011.00123',
      penggunaan: 'Fasilitas Umum (Jalan Desa)',
      asal: 'Bantuan Pemerintah (Lain Desa)',
      harga: 500000000,
      kondisi: 'B',
      keterangan: '-'
    },
    {
      id: 2,
      jenis: 'Tanah Kas Desa',
      kode: '01.01.03.01',
      nup: '002',
      luas: 900000.00,
      tahun: 2012,
      alamat: 'Cafe 28',
      hak: 'Girik / Petok D',
      tglSertifikat: '29/09/2025',
      noSertifikat: '11.30.15.011.00987',
      penggunaan: 'Lahan Pertanian Produktif',
      asal: 'Bantuan Pemerintah Kabupaten/Kota',
      harga: 6000000,
      kondisi: 'B',
      keterangan: 'wireok detok'
    }
  ];
  return dummyData;
};
// --- Akhir Bagian Integrasi ---


const LaporanPage = () => {

  // --- Integrasi Back-End (Hook React Query) ---
  // TODO: Gunakan hook ini untuk mengambil data secara nyata
  const { data: laporanData, isLoading, isError } = useQuery({
    queryKey: ['laporanAset'],
    queryFn: fetchLaporanAset
  });
  // ---

  // Fungsi helper untuk format Rupiah (bisa Anda pindah ke file terpisah)
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const formatLuas = (angka) => {
    return new Intl.NumberFormat('id-ID').format(angka);
  };

  // --- Integrasi Back-End (Tombol) ---
  const handleExportCSV = () => {
    // TODO: Tambahkan fungsi untuk 'Export to CSV'
    // Biasanya ini memanggil API endpoint '/api/laporan/export-csv'
    // atau menggunakan library front-end seperti 'react-csv'
    alert('Fungsi Ekspor CSV belum diimplementasikan.');
  };

  const handleCetak = () => {
    // TODO: Tambahkan fungsi untuk 'Cetak Laporan'
    // Cara sederhana: window.print()
    // Cara lebih baik: Buat halaman khusus cetak atau generate PDF
    alert('Fungsi Cetak belum diimplementasikan. (Contoh: window.print())');
  };
  // ---

  return (
    <Container fluid>
      {/* Header Halaman */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="h4">Laporan Aset Desa</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" className="me-2" onClick={handleExportCSV}>
            <FaFileExport className="me-1" /> Export ke CSV
          </Button>
          <Button variant="primary" onClick={handleCetak}>
            <FaPrint className="me-1" /> Cetak Laporan
          </Button>
        </Col>
      </Row>

      {/* Konten Laporan (Tabel) */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaBook className="me-2" />
            Buku Inventaris Aset Desa
          </h5>
          <small className="text-muted">
            Tampilan di layar dioptimalkan untuk penjelajahan data. Gunakan tombol 'Cetak' untuk format laporan resmi.
          </small>
        </Card.Header>
        <Card.Body>
          {/* Tampilkan Loading atau Error */}
          {isLoading && (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat data laporan...</p>
            </div>
          )}

          {isError && (
            <Alert variant="danger">
              Terjadi kesalahan saat mengambil data laporan.
            </Alert>
          )}

          {/* Tabel Data (hanya tampil jika data sukses dimuat) */}
          {laporanData && (
            <Table responsive hover className="laporan-table">
              {/* Header Tabel yang Kompleks */}
              <thead className="table-light">
                <tr>
                  <th rowSpan={2} className="text-center align-middle">NO</th>
                  <th rowSpan={2} className="text-center align-middle">JENIS BARANG / NAMA BARANG</th>
                  <th rowSpan={2} className="text-center align-middle">KODE BARANG</th>
                  <th rowSpan={2} className="text-center align-middle">NUP</th>
                  <th rowSpan={2} className="text-center align-middle">LUAS (M²)</th>
                  <th rowSpan={2} className="text-center align-middle">TAHUN PEROLEHAN</th>
                  <th rowSpan={2} className="text-center align-middle">LETAK / ALAMAT</th>
                  <th colSpan={3} className="text-center align-middle">STATUS TANAH</th>
                  <th rowSpan={2} className="text-center align-middle">PENGGUNAAN</th>
                  <th rowSpan={2} className="text-center align-middle">ASAL USUL</th>
                  <th rowSpan={2} className="text-center align-middle">HARGA (RP)</th>
                  <th rowSpan={2} className="text-center align-middle">KONDISI (B/KB/RB)</th>
                  <th rowSpan={2} className="text-center align-middle">KETERANGAN</th>
                </tr>
                <tr>
                  <th className="text-center">HAK</th>
                  <th className="text-center">TGL. SERTIFIKAT</th>
                  <th className="text-center">NO. SERTIFIKAT</th>
                </tr>
              </thead>
              
              {/* Isi Tabel */}
              <tbody>
                {laporanData.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.jenis}</td>
                    <td>{item.kode}</td>
                    <td>{item.nup}</td>
                    <td className="text-end">{formatLuas(item.luas)}</td>
                    <td className="text-center">{item.tahun}</td>
                    <td>{item.alamat}</td>
                    <td>{item.hak}</td>
                    <td className="text-center">{item.tglSertifikat}</td>
                    <td>{item.noSertifikat}</td>
                    <td>{item.penggunaan}</td>
                    <td>{item.asal}</td>
                    <td className="text-end">{formatRupiah(item.harga)}</td>
                    <td className="text-center">{item.kondisi}</td>
                    <td>{item.keterangan}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        
        {/* Footer Halaman (sesuai gambar) */}
        <Card.Footer className="text-center text-muted bg-white">
          © 2025 Pemerintah Desa Makmur Jaya. Diberdayakan oleh SITANAS.
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default LaporanPage;