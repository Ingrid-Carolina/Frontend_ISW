// components/Footer.jsx

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import logo from '/Images/Logo-pilotos.png';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

import '../components/styles.css';

export default function Footer() {
	return (
		<footer className='footer'>
			<Box className='footer-container'>
				{/* IZQUIERDA */}
				<Box className='footer-left'>
					<nav>
						<Link to='/Contacto'>Contacto</Link>
						<span> | </span>
						<Link to = '/PoliticaPrivacidad'>Política de Privacidad</Link>
					</nav>
				</Box>

				{/* CENTRO */}
				<Box className='footer-center'>
					<img src={logo} alt='Logo Pilotos' className='footer-logo' />
					<div className='social-icons'>
						<a
							href='https://www.facebook.com/people/Organización-de-Baseball-Menor-Fuerza-Aérea-Hondureña/100057637951305/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FacebookIcon className='social-icon' />
						</a>

						<a
							href='https://www.instagram.com/beisbolfahn/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<InstagramIcon className='social-icon' />
						</a>
						<Link to='/Contacto'>
							<EmailIcon className='social-icon' />
						</Link>
					</div>
				</Box>

				{/* DERECHA */}
				<Box className='footer-right'>
					<p>© 2025 - Mi Sitio Web. Todos los derechos reservados.</p>
				</Box>
			</Box>
		</footer>
	);
}
