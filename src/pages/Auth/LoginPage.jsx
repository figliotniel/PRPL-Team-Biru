import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './LoginPage.css';
import { FaBuildingColumns } from 'react-icons/fa6';

const LoginPage = () => {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ role, username, password });
    // TODO: Panggil API login di sini
  };

  return (
    <Container fluid className="vh-100 p-0">
      <Row className="g-0 vh-100">
        {/* Bagian Kiri: Gambar Background dan Branding */}
        <Col md={7} className="login-bg-container">
          
          {/* 1. Hapus 'logo-wrapper' yang tidak perlu */}
          <div className="logo-icon-simple">
            <FaBuildingColumns /> 
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

        {/* Bagian Kanan: Form Login (Tidak ada perubahan) */}
        <Col md={5} className="d-flex align-items-center justify-content-center bg-white">
          {/* ... (sisa kode form Anda sama, tidak perlu diubah) ... */}
          <div className="login-form-container">
            <h2>Selamat Datang Kembali</h2>
            <p className="text-muted">Silakan masuk untuk melanjutkan ke Dashboard.</p>

            <Form onSubmit={handleLogin} className="mt-4">
              <Form.Group className="mb-3" controlId="formRole">
                <Form.Label>Login Sebagai</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">-- Pilih Peran Anda --</option>
                  <option value="admin">Admin</option>
                  <option value="kades">Kepala Desa</option>
                  <option value="bpd">BPD (Pengawas)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>

            <div className="text-center my-3">
              <span className="text-muted">Belum punya akun? <a href="#">Daftar di sini</a></span>
            </div>
            
            <div className="text-center text-muted or-divider">atau</div>

            <Button variant="outline-secondary" className="w-100 mt-3">
              Lihat Informasi Publik
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;