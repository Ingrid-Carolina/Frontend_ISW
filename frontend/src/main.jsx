// src/main.jsx
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';


// Páginas del panel de administración
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Comentarios from './pages/admin/Comentarios.jsx';
import StatsJugadores from './pages/admin/StatsJugadores.jsx';
import ManageTestimonios from './pages/admin/ManageTestimonios.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Todas tus rutas actuales viven dentro de App */}
        <Route path="/*" element={<App />} />

        {/* Rutas específicas del panel admin */}
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="comments" element={<Comentarios/>} />
          <Route path="players" element={<StatsJugadores/>} />
          <Route path="mngtestimonios" element={<ManageTestimonios/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

