import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar.jsx';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer.jsx';
import Home from './pages/Home';
import NuestraHistoria from './pages/NuestraHistoria';
import Logros from './pages/Logros';
import Voluntariado from './pages/Voluntariado';
import Categorias from './pages/Categorias';
import NuestroEquipo from './pages/NuestroEquipo.jsx';
import Calendario from './pages/Calendario.jsx';
import Eventos from './pages/Eventos.jsx';
import Contacto from './pages/Contacto.jsx';
import Tienda from './pages/Tienda.jsx';
import Aliados from './pages/Aliados.jsx';
import MostrarLoginyRegistro from './pages/MostrarLoginyRegistro';
import Noticia1 from './pages/Noticia1.jsx';
import Noticia2 from './pages/Noticia2.jsx';
import Noticia3 from './pages/Noticia3.jsx';
import NewsTest from './pages/NewsTest.jsx';
import PaginaTestimonios from './pages/Testimonio.jsx';
import EditarPerfil from './pages/EditarPerfil.jsx';
import Donaciones from './pages/Donaciones.jsx';
import SeleccionarAvatar from './pages/SeleccionarAvatar.jsx';

function App() {
	return (
		<>
			<ScrollToTop /> 
			<div className='app-container'>
				<CustomNavbar />
				<main className='main-content'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/historia' element={<NuestraHistoria />} />
						<Route path='/Categoria' element={<Categorias />} />
						<Route path='/NuestroEquipo' element={<NuestroEquipo />} />
						<Route path='/logros' element={<Logros />} />
						<Route path='/voluntariado' element={<Voluntariado />} />
						<Route path='/calendario' element={<Calendario />} />
						<Route path='/eventos' element={<Eventos />} />
						<Route path='/Contacto' element={<Contacto />} />
						<Route path='/tienda' element={<Tienda />} />
						<Route path='/aliados' element={<Aliados />} />
						<Route path='/perfil' element={<EditarPerfil />} />
						<Route path='/login' element={<MostrarLoginyRegistro />} />
						<Route path='/Noticia1' element={<NewsTest />}/>
						<Route path='/Noticia2' element={<Noticia2 />}/>
						<Route path='/Noticia3' element={<Noticia3 />}/>
						<Route path='/Testimonio' element={<PaginaTestimonios/>}/>
						<Route path='/Donaciones' element={<Donaciones/>}/>
						<Route path='/Avatars' element={<SeleccionarAvatar />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</>
	);
}

export default App;
