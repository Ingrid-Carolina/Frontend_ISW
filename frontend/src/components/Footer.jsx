// components/Footer.jsx es un componente de React que representa el pie de página de nuestro sitio web. 
// Incluye enlaces de navegación, un logotipo y iconos de redes sociales. 
// Utiliza Material-UI para los estilos y los iconos.

import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YoutubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import logo from '/Images/Logo-pilotos.png';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

import '../components/styles.css';
// Componente funcional Footer
export default function Footer() {
	return (
		<footer className='footer'>
			<Box className='footer-container'>
				{/* IZQUIERDA DEL FOOTER: CONTACTO Y POLITICA DE PRIVACIDAD */}
				<Box className='footer-left'>
					<nav>
						<Link to='/Contacto'>Contacto</Link>
						<span> | </span>
						<Link to = '/PoliticaPrivacidad'>Política de Privacidad</Link>
					</nav>
				</Box>

				{/* CENTRO DEL FOOTER: LOGO DE PILOTOS*/}
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
							href='https://www.youtube.com/@marcoamaya26/shorts'
							target='_blank'
							rel='noopener noreferrer'
							> 
							<YoutubeIcon className = 'social-icon'/>

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

				{/* DERECHA DEL FOOTER*/}
				<Box className='footer-right'>
					<p>© 2025 - Mi Sitio Web. Todos los derechos reservados.</p>
				</Box>
			</Box>
		</footer>
	);
}
