import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaPencilAlt, FaTrash, FaPlus, FaFileExport } from 'react-icons/fa';
import { 
  BiArchive, BiArea, BiTime, BiCheckCircle 
} from 'react-icons/bi';
import './DashboardPage.css';

// Fungsi helper untuk format angka (menghilangkan ,00)
const formatNumber = (num) => {
  // Menggunakan 'id-ID' untuk format ribuan dengan titik
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0, // Ini kuncinya: menghilangkan desimal
  }).format(num);
};

// Fungsi dummy untuk simulasi fetch data
const fetchDashboardData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi loading
  return {
    summary: {
      totalAset: 2,
      totalLuasDisetujui: 1200000.00, // Data asli mungkin punya desimal
      asetMenungguValidasi: 0,
      asetTelahDisetujui: 2,
    },
    asetList: [
      {
        id: 1,
        kode: '01.01.03.01',
        asal: 'Bantuan Pemerintah Kabupaten/Kota',
        luas: 900000,
        penggunaan: 'Lahan Pertanian Produktif',
        status: 'Disetujui',
      },
      {
        id: 2,
        kode: '01.01.05.03',
        asal: 'Bantuan Pemerintah Provinsi',
        luas: 300000,
        penggunaan: 'Fasilitas Umum (Jalan Desa)',
        status: 'Disetujui',
      },
    ],
  };
};

// Komponen Card
const SummaryCard = ({ title, value, icon, unit, color }) => (
  <Col md={3}>
    <Card className="summary-card shadow-sm border-0">
      <Card.Body>
        <Row>
          <Col xs={4}>
            <div className={`icon-wrapper ${color}`}>
              {icon}
            </div>
          </Col>
          <Col xs={8} className="text-end">
            <h5 className="card-title">{title}</h5>
            <h3 className="card-value">
              {value} {unit && <span className="card-unit">{unit}</span>}
            </h3>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>
);

const DashboardPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Semua Status');

  // Menggunakan React Query untuk fetch dan cache data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Memuat data dashboard...</p>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert variant="danger">Gagal memuat data. Silakan coba lagi nanti.</Alert>
      </Container>
    );
  }

  const { summary, asetList } = data;

  return (
    <Container fluid>
      {/* Header Dashboard */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h2 className="h4">Dashboard Aset Tanah</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" className="me-2">
            <FaPlus className="me-1" /> Tambah Data Tanah
          </Button>
          <Button variant="outline-secondary">
            <FaFileExport className="me-1" /> Lihat Laporan
          </Button>
        </Col>
      </Row>

      {/* Baris Kartu Summary */}
      <Row className="mb-4">
        <SummaryCard 
          title="Total Aset Tercatat" 
          value={summary.totalAset} 
          icon={<BiArchive />}
          color="blue"
        />
        <SummaryCard 
          title="Total Luas Disetujui" 
          // Permintaan terpenuhi: formatNumber menghilangkan desimal (koma)
          value={formatNumber(summary.totalLuasDisetujui)} 
          unit="m²"
          icon={<BiArea />}
          color="green"
        />
        <SummaryCard 
          title="Aset Menunggu Validasi" 
          value={summary.asetMenungguValidasi} 
          icon={<BiTime />}
          color="orange"
        />
        <SummaryCard 
          title="Aset Telah Disetujui" 
          value={summary.asetTelahDisetujui} 
          icon={<BiCheckCircle />}
          color="cyan"
        />
      </Row>

      {/* Tabel Data Aset */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="card-title mb-3">Daftar Aset Tanah ({asetList.length} data ditemukan)</h5>
          
          {/* Filter dan Search */}
          <Form className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Control 
                  type="text" 
                  placeholder="Cari kode, asal, no. sertifikat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>Semua Status</option>
                  <option>Disetujui</option>
                  <option>Menunggu Validasi</option>
                  <option>Ditolak</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button variant="primary" className="me-2">Cari</Button>
                <Button variant="outline-secondary">Reset</Button>
              </Col>
            </Row>
          </Form>

          {/* Tabel */}
          <Table responsive hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>NO</th>
                <th>KODE</th>
                <th>ASAL</th>
                <th>LUAS (M²)</th>
                <th>PENGGUNAAN</th>
                <th>STATUS</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {asetList.map((aset, index) => (
                <tr key={aset.id}>
                  <td>{index + 1}</td>
                  <td>{aset.kode}</td>
                  <td>{aset.asal}</td>
                  <td>{formatNumber(aset.luas)}</td>
                  <td>{aset.penggunaan}</td>
                  <td>
                    <Badge bg="success">{aset.status}</Badge>
                  </td>
                  <td>
                    <Button variant="primary" size="sm" className="me-1">
                      <FaEye />
                    </Button>
                    <Button variant="warning" size="sm" className="me-1 text-white">
                      <FaPencilAlt />
                    </Button>
                    <Button variant="danger" size="sm">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DashboardPage;