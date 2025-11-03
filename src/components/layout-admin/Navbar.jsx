import React from 'react';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Image } from 'react-bootstrap';

const Navbar = () => {
  return (
    <BootstrapNavbar bg="white" expand="lg" className="px-4 py-3 shadow-sm">
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        {/* Gunakan ms-auto untuk mendorong item ke kanan */}
        <Nav className="ms-auto">
          <Nav.Link href="#home" className="d-flex align-items-center">
            Halo, Figlio Otniel
            <Image 
              src="https://via.placeholder.com/40" // Ganti dengan foto profil user
              roundedCircle 
              width={40} 
              height={40} 
              className="ms-2"
            />
          </Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;