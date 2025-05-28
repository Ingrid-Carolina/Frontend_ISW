// components/Footer.jsx
import icono from '../ima/IconInsta.png';
import iconof from '../ima/IconF.png';
import logo from '../ima/Logo-pilotos.png';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function Footer() {
  
  return (
    <footer style={{
      
      textAlign: 'center',
      padding: '10px 350px',
      backgroundColor: '#000757',
      color: ' rgb(246, 244, 248)',
      marginTop: '10000px',
    }}>
      
            <Link to='/'>
                <Box
                  component='img'
                  src={logo}
                  alt='Logo Pilotos'
                  sx={{ height: 50, cursor: 'pointer' }}
                />
            </Link>

      <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Link to='/'>
							<Box
								component='img'
								src={iconof}
								alt='IconF'
								sx={{ height: 40, cursor: 'pointer' }}
							/>
						</Link>
            
            <Link to='/'>
							<Box
								component='img'
								src={icono}
								alt='IconInsta'
								sx={{ height: 40, cursor: 'pointer' }}
							/>
             
						</Link>
           
            <p>© 2025 - Mi Sitio Web. Todos los derechos reservados.</p>
      </Box>
            
      
    </footer>
  );
}
