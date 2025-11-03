import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Table, Spinner, Alert, Form, Badge } from 'react-bootstrap';
// 1. Impor ikon-ikon yang kita butuhkan
import { FaFilter, FaSearch, FaUndo } from 'react-icons/fa';
// 2. Impor file CSS baru yang akan kita buat
import './LogAktivitasPage.css';
// 3. Impor hook dan library untuk fetch data
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // (Asumsi Anda akan menggunakannya)

// --- Integrasi Back-End (Contoh Fetching) ---
// TODO: Ganti fungsi fetchLogData ini dengan endpoint API Laravel Anda
const fetchLogData = async () => {
  // Simulasi pemanggilan API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Ini adalah data bohongan (dummy data) sesuai gambar Anda
  const dummyData = [
    { id: 1, waktu: '29 Sep 2025, 22:02:53', pengguna: 'Figlio Otniel', aksi: 'LOGIN', deskripsi: "User 'admin' berhasil login." },
    { id: 2, waktu: '29 Sep 2025, 21:01:47', pengguna: 'Figlio Otniel', aksi: 'LOGIN', deskripsi: "User 'admin' berhasil login." },
    { id: 3, waktu: '29 Sep 2025, 20:58:11', pengguna: 'Figlio Otniel', aksi: 'LOGOUT', deskripsi: "User 'admin' telah logout." },
    { id: 4, waktu: '29 Sep 2025, 20:57:34', pengguna: 'Figlio Otniel', aksi: 'LOGIN', deskripsi: "User 'admin' berhasil login." },
    { id: 5, waktu: '29 Sep 2025, 20:49:34', pengguna: 'Figlio Otniel', aksi: 'LOGOUT', deskripsi: "User 'admin' telah logout." },
  ];
  return dummyData;
};
// --- Akhir Bagian Integrasi ---

// Komponen helper untuk Badge Aksi
const AksiBadge = ({ aksi }) => {
  if (aksi === 'LOGIN') {
    return <Badge bg="success">LOGIN</Badge>;
  }
  if (aksi === 'LOGOUT') {
    return <Badge bg="danger">LOGOUT</Badge>;
  }
  // TODO: Tambahkan aksi lain (misal: CREATE, UPDATE, DELETE)
  return <Badge bg="secondary">{aksi}</Badge>;
};


const LogAktivitasPage = () => {
  // State untuk semua filter
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAksi, setSelectedAksi] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- Integrasi Back-End (Hook React Query) ---
  // TODO: Gunakan hook ini untuk mengambil data secara nyata
  // Anda bisa memasukkan state filter ke dalam queryKey
  // queryKey: ['logAktivitas', searchText, selectedUser, ...],
  const { data: laporanData, isLoading, isError } = useQuery({
    queryKey: ['logAktivitas'],
    queryFn: fetchLogData
  });
  // ---

  // --- Integrasi Back-End (Fungsi Filter) ---
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // TODO: Panggil fungsi refetch() dari useQuery
    // atau kirim state filter ke back-end
    console.log({ searchText, selectedUser, selectedAksi, startDate, endDate });
    alert('Fungsi filter belum terhubung ke back-end.');
  };

  const handleResetFilter = () => {
    setSearchText('');
    setSelectedUser('');
    setSelectedAksi('');
    setStartDate('');
    setEndDate('');
    // TODO: Panggil refetch() untuk memuat ulang data asli
  };
  // ---

  return (
    <Container fluid>
      {/* Header Halaman */}
      <h2 className="h4 mb-4">Log Aktivitas Sistem</h2>

      {/* Konten Filter */}
      <Card className="shadow-sm border-0 mb-4 log-filter-card">
        <Card.Header className="bg-white">
          <FaFilter className="me-2" />
          Filter & Cari Log Aktivitas
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Cari deskripsi atau nama..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- Semua Pengguna --</option>
                  <option value="Figlio Otniel">Figlio Otniel</option>
                  {/* TODO: Isi daftar pengguna dari API */}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedAksi}
                  onChange={(e) => setSelectedAksi(e.target.value)}
                >
                  <option value="">-- Semua Aksi --</option>
                  <option value="LOGIN">LOGIN</option>
                  <option value="LOGOUT">LOGOUT</option>
                  <option value="CREATE">CREATE</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                {/* Gunakan placeholder seperti di gambar */}
                <Form.Control
                  type="text"
                  placeholder="dd/mm/yyyy (Mulai)"
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="text"
                  placeholder="dd/mm/yyyy (Selesai)"
                  onFocus={(e) => (e.target.type = 'date')}
                  onBlur={(e) => (e.target.type = 'text')}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
              <Col md={1} className="d-flex">
                <Button type="submit" variant="primary" className="me-2">
                  <FaSearch />
                </Button>
                <Button type="button" variant="outline-secondary" onClick={handleResetFilter}>
                  <FaUndo />
                </Button>
              </Col>
            </Row>
            {/* Ubah tombol Terapkan/Reset jadi ikon saja agar muat */}
          </Form>
        </Card.Body>
      </Card>

      {/* Konten Riwayat Aktivitas (Tabel) */}
      <Card className="shadow-sm border-0 log-riwayat-card">
        <Card.Header className="bg-white">
          Riwayat Aktivitas (Total ditemukan: {isLoading ? '...' : laporanData?.length || 0})
        </Card.Header>
        <Card.Body>
          {/* Tampilkan Loading atau Error */}
          {isLoading && (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Memuat data log...</p>
            </div>
          )}

          {isError && (
            <Alert variant="danger">
              Terjadi kesalahan saat mengambil data log.
            </Alert>
          )}

          {/* Tabel Data (hanya tampil jika data sukses dimuat) */}
          {laporanData && (
            <Table responsive hover className="log-table align-middle">
              <thead className="table-light">
                <tr>
                  <th>WAKTU</th>
                  <th>PENGGUNA</th>
                  <th>AKSI</th>
                  <th>DESKRIPSI</th>
                </tr>
              </thead>
              
              <tbody>
                {laporanData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.waktu}</td>
                    <td>{item.pengguna}</td>
                    <td>
                      <AksiBadge aksi={item.aksi} />
                    </td>
                    <td>{item.deskripsi}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LogAktivitasPage;