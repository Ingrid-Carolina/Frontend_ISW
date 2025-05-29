// components/Footer.jsx
import icono from '../ima/IconInsta.png';

import iconof from '../ima/IconF.png';
import logo from '../ima/Logo-pilotos.png';
import Box from '@mui/material/Box';
import '../components/styles.css';

export default function Footer() {
	return (
		<footer className='footer'>
			<Box className='footer-container'>
				{/* IZQUIERDA */}
				<Box className='footer-left'>
					<nav>
						<a href='#Contacto'>Contacto</a>
						<span> | </span>
						<a href='#privacidad'>Política de Privacidad</a>
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
							<img src={iconof} alt='Facebook Icon' className='social-icon' />
						</a>

						<a
							href='https://www.instagram.com/beisbolfahn/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<img src={icono} alt='Instagram Icon' className='social-icon' />
						</a>
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
