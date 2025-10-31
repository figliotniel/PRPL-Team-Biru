import React from 'react'; // Mengganti 'StrictMode'
import ReactDOM from 'react-dom/client'; // Mengganti 'createRoot'
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Impor CSS Global
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- 1. Ini untuk Bootstrap
import './styles/main.css'; // <-- 2. Ini untuk font & warna (ganti nama file)

import App from './App.jsx';

// 3. Buat instance untuk React Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 4. Bungkus <App> dengan semua 'Provider' */}
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);