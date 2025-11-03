import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// 1. Impor 'Link' untuk navigasi "Login di sini"
import { Link } from 'react-router-dom'; 
// 2. Kita pakai ulang CSS yang sama dari Halaman Login
import './LoginPage.css'; 
import { FaBuildingColumns } from 'react-icons/fa6';

const RegisterPage = () => { // Ganti nama komponen
  // 3. Tambahkan state baru untuk 'Nama Lengkap'
  const [namaLengkap, setNamaLengkap] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Ganti nama fungsi
  const handleRegister = (e) => {
    e.preventDefault();
    // Tambahkan 'namaLengkap' ke log
    console.log({ namaLengkap, role, username, password });
    // TODO: Panggil API register di sini
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 vh-100">
        {/* Bagian Kiri: Ini sama persis dengan halaman Login Anda */}
        <Col md={7} className="login-bg-container">
          <div className="logo-wrapper">
            <div className="logo-icon-simple">
              <FaBuildingColumns /> 
            </div>
          </div>
          <div className="brand-title">
            <h1>SITANAS</h1>
            <p>
              Sistem Informasi Tanah Kas Desa untuk pengelolaan
              <br />
              aset yang transparan dan efisien.
            </p>
          </div>
        </Col>

        {/* Bagian Kanan: Form Pendaftaran (Ini yang kita ubah) */}
        <Col md={5} className="d-flex align-items-center justify-content-center bg-white">
          <div className="login-form-container">
            {/* 4. Ubah Teks Judul */}
            <h2>Buat Akun Baru</h2>
            <p className="text-muted">Lengkapi data di bawah untuk mendaftar.</p>

            <Form onSubmit={handleRegister} className="mt-4">
              
              {/* 5. Tambahkan Form Group untuk Nama Lengkap */}
              <Form.Group className="mb-3" controlId="formNamaLengkap">
                <Form.Label>Nama Lengkap</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                />
              </Form.Group>

              {/* Form Group Username (Sama) */}
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              {/* Form Group Password (Sama) */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              
              {/* Form Group Role (Ganti Label) */}
              <Form.Group className="mb-3" controlId="formRole">
                <Form.Label>Daftar Sebagai</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">-- Pilih Peran --</option>
                  <option value="admin">Admin</option>
                  <option value="kades">Kepala Desa</option>
                  <option value="bpd">BPD (Pengawas)</option>
                </Form.Select>
              </Form.Group>

              {/* 6. Ubah Teks Tombol */}
              <Button variant="primary" type="submit" className="w-100">
                Buat Akun
              </Button>
            </Form>

            {/* 7. Ubah Link Footer */}
            <div className="text-center my-3">
              <span className="text-muted">
                Sudah punya akun? <Link to="/login">Login di sini</Link>
              </span>
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage; // Ganti nama export