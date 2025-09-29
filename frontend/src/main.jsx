// src/main.jsx

// Importa los estilos del carrusel Slick para los componentes de slider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Importa StrictMode para ayudar a detectar problemas potenciales en la app
import { StrictMode } from 'react';
// Importa createRoot para inicializar la aplicación React en el DOM
import { createRoot } from 'react-dom/client';

// Importa el sistema de rutas de React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa los estilos globales base
import './index.css';
// Importa el componente principal de la aplicación
import App from './App.jsx';

// Páginas del panel de administración
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import NoticiasAdmin from './pages/admin/NoticiasAdmin.jsx';
import StatsJugadores from './pages/admin/StatsJugadores.jsx';
import ManageTestimonios from './pages/admin/ManageTestimonios.jsx';
import ManageOrders from './pages/admin/ManageOrders.jsx';
import ProdDonaciones from './pages/admin/ProdDonaciones.jsx';
import ManageUsuarios from './pages/admin/ManageUsuarios.jsx';
import BitacoraDonaciones from './pages/admin/BitacoraDonaciones.jsx';

// Punto de entrada principal de la aplicación React
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter habilita la navegación por rutas en la app */}
    <BrowserRouter>
      {/* Define todas las rutas de la aplicación */}
      <Routes>
        {/* Todas las rutas públicas y de usuario viven dentro de App */}
        <Route path="/*" element={<App />} />

        {/* Rutas específicas para el panel de administración */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Ruta principal del dashboard admin */}
          <Route index element={<NoticiasAdmin />} />
          {/* Ruta explícita al dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* Ruta para gestión de noticias */}
          <Route path="newsadm" element={<NoticiasAdmin />} />
          {/* Ruta para estadísticas de jugadores */}
          <Route path="players" element={<StatsJugadores />} />
          {/* Ruta para gestión de testimonios */}
          <Route path="mngtestimonios" element={<ManageTestimonios />} />
          {/* Ruta para gestión de órdenes de tienda */}
          <Route path="mngordenes" element={<ManageOrders />} />
          {/* Ruta para gestión de productos de donaciones */}
          <Route path="mngproddonaciones" element={<ProdDonaciones />} />
          {/* Ruta para gestión de usuarios */}
          <Route path="mngusuarios" element={<ManageUsuarios />} />
          {/* Ruta para bitácora de donaciones */}
          <Route path="mngdonaciones" element={<BitacoraDonaciones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

