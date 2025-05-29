import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx'; 
import Home from './pages/Home';
import NuestraHistoria from './pages/NuestraHistoria';
import Logros from './pages/Logros';
import Voluntariado from './pages/Voluntariado'
import Categorias from './pages/Categorias';
import Jugadores from './pages/Juagadores';

function App() {
	return (
		<>
		<Router>
      <div className="app-container">
        <CustomNavbar/>
        <main className="main-content">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<NuestraHistoria />} />
        <Route path="/Categoria" element={<Categorias/>} />
        <Route path="/Jugadores" element={<Jugadores/>} />
        <Route path="/logros" element={<Logros />} />
        <Route path="/voluntariado" element={<Voluntariado />} />
      </Routes>
        </main>
      
      <Footer/>
      </div>
      

    </Router>
		</>
	);
}

export default App;
