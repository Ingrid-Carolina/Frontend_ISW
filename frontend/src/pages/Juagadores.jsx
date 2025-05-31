import React from 'react';
import { Box, Typography } from '@mui/material';
import equipoImg from '../Ima/Fondojugadores.png';



const Jugadores = () => {
	return (
		<>
			{/* HEADER SECTION */}
			<Box
  sx={{
    position: 'relative',
    width: '100%',
    minHeight: { xs: '75vh', md: '90vh' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // <--- Cambiado
    backgroundImage: `url(${equipoImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    px: { xs: 3, md: 5 },
    py: { xs: 6, md: 8 },
    gap: { md: 4 },
  }}
>
  {/* Overlay */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      //backgroundColor: 'rgba(0, 0, 80, 0.75)',
      zIndex: 1,
    }}
  />

  {/* Texto */}
  <Box
    sx={{
      position: 'relative',
      zIndex: 2,
      textAlign: 'center', // <--- Centra el texto
    }}
  >
    <Typography
      variant='h2'
      sx={{
        fontWeight: 'bold',
        fontSize: { xs: '5.5rem', md: '4rem' },
        fontFamily: 'Aptos, Segoe UI, Arial, sans-serif',
		fontStyle: 'italic',
        color: 'white',
        textAlign: 'center', // <--- Asegura que esté centrado
      }}
    >
      <Box
        component='span'
        sx={{
          fontFamily: 'Pacifico, cursive',
          color: 'white',
        }}
      >
        Jugadores
      </Box>
    </Typography>
  </Box>
</Box>

			
		</>
	);
};

export default Jugadores;