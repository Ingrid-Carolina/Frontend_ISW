import { useState } from 'react';
// Importa los logos de React y Vite (no usados en el render principal)
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
// Importa el sistema de rutas de React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importa los estilos globales de la aplicación
import './App.css';
// Importa el componente de barra de navegación personalizada
import CustomNavbar from './components/Navbar.jsx';
// Importa el componente para controlar el scroll al navegar entre rutas
import ScrollToTop from './components/ScrollToTop';
// Importa el componente de pie de página
import Footer from './components/Footer.jsx';

// Importa todas las páginas que se pueden mostrar en la aplicación
import Home from './pages/Home';
import NuestraHistoria from './pages/NuestraHistoria';
import Logros from './pages/Logros';
import Voluntariado from './pages/Voluntariado';
import Categorias from './pages/Categorias';
import NuestroEquipo from './pages/NuestroEquipo.jsx';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad.jsx';
import Calendario from './pages/Calendario.jsx';
import Eventos from './pages/Eventos.jsx';
import Contacto from './pages/Contacto.jsx';
import Tienda from './pages/Tienda.jsx';
import Aliados from './pages/Aliados.jsx';
import MostrarLoginyRegistro from './pages/MostrarLoginyRegistro';
import NoticiaDetalle from './pages/NoticiaDetalle.jsx';
import Noticia1 from './pages/Noticia1.jsx';
import Noticia2 from './pages/Noticia2.jsx';
import Noticia3 from './pages/Noticia3.jsx';
import NewsTest from './pages/NewsTest.jsx';
import PaginaTestimonios from './pages/Testimonio.jsx';
import EditarPerfil from './pages/EditarPerfil.jsx';
import Donaciones from './pages/Donaciones.jsx';
import EnVivo from './pages/EnVivo.jsx';
import SeleccionarAvatar from './pages/SeleccionarAvatar.jsx';

// Componente principal de la aplicación
function App() {
    return (
        <>
            {/* Componente para asegurar que el scroll se reinicia al navegar */}
            <ScrollToTop /> 
            {/* Contenedor principal con estructura de la app */}
            <div className='app-container'>
                {/* Barra de navegación superior */}
                <CustomNavbar />
                {/* Área principal de contenido, donde se renderizan las páginas según la ruta */}
                <main className='main-content'>
                    {/* Sistema de rutas: cada ruta muestra una página diferente */}
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/historia' element={<NuestraHistoria />} />
                        <Route path='/Categoria' element={<Categorias />} />
                        <Route path='/nuestroequipo' element={<NuestroEquipo />} />
                        <Route path='/logros' element={<Logros />} />
                        <Route path='/voluntariado' element={<Voluntariado />} />
                        <Route path='/calendario' element={<Calendario />} />
                        <Route path='/eventos' element={<Eventos />} />
                        <Route path="/noticia/:id" element={<NoticiaDetalle />} />
                        <Route path='/Contacto' element={<Contacto />} />
                        <Route path='/PoliticaPrivacidad' element={<PoliticaPrivacidad />} />
                        <Route path='/tienda' element={<Tienda />} />
                        <Route path='/aliados' element={<Aliados />} />
                        <Route path='/perfil' element={<EditarPerfil />} />
                        <Route path='/login' element={<MostrarLoginyRegistro />} />
                        <Route path='/Noticia1' element={<NewsTest />}/>
                        <Route path='/Noticia2' element={<Noticia2 />}/>
                        <Route path='/Noticia3' element={<Noticia3 />}/>
                        <Route path='/Testimonio' element={<PaginaTestimonios/>}/>
                        <Route path='/Donaciones' element={<Donaciones/>}/>
                        <Route path='/EnVivo' element={<EnVivo/>}/>
                        <Route path='/Avatars' element={<SeleccionarAvatar />} />
                    </Routes>
                </main>
                {/* Pie de página fijo en la parte inferior */}
                <Footer />
            </div>
        </>
    );
}

// Exporta el componente principal para ser usado en el punto de entrada de la app
export default App;
