import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CustomNavbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx'; 
import Home from './pages/Home';
import NuestraHistoria from './pages/NuestraHistoria';


function App() {
	return (
		<>
		<Router>
      <CustomNavbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<NuestraHistoria />} />
      </Routes>
      <Footer/>
    </Router>
		</>
	);
}

export default App;
