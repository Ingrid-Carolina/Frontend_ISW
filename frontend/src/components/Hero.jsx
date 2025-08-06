import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import fondo from '/Images/TestimonioFondo1.jpg';


//Este es un componente tipo Hero que se utiliza en la pagina de testimonios, el cual muestra un fondo de pantalla completo con un mensaje inspirador y una breve descripción.
//No trae css aparte, ya que se maneja directamente con el sistema de estilos de Material UI.
const Hero = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#ffffff',
        position: 'relative',
        paddingTop: { xs: '70px', sm: '85px' },
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.4)', // Cambia el último valor para más/menos opacidad
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          width: '100%',
          maxWidth: '1200px',
          borderRadius: 2,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'Bulletto',
            mb: 2,
            fontSize: {
              xs: '4rem',
              sm: '5rem',
              md: '6rem',
              lg: '7rem',
            },
          }}
        >
          Historias que inspiran.
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontFamily: 'ManropeEB',
            fontSize: {
              xs: '1.2rem',
              sm: '1.5rem',
              md: '2rem',
            },
          }}
        >
          Nuestros pilotos de béisbol comparten sus experiencias y logros a lo largo de su trayectoria.
        </Typography>
      </Box>
    </Box>
  );
};

export default Hero;