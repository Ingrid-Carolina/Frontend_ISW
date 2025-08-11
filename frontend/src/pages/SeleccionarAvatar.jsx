import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Array de avatares predefinidos (todos juntos)
const avataresPredefinidos = [
  // Avatares de béisbol
  { id: 1, imagen: '../public/images/guante.jpg' },
  { id: 2, imagen: '../public/images/bate.jpg' },
  { id: 3, imagen: '../public/images/pelota.jpg' },
  { id: 4, imagen: '../public/images/casco.jpg' },
  { id: 5, imagen: '../public/images/bate2.jpg' },
  { id: 6, imagen: '../public/images/pelota2.jpg' },
  { id: 7, imagen: '../public/images/pelota3.png' },
  { id: 8, imagen: '../public/images/silbato.jpg' },
  { id: 9, imagen: '../public/images/avatar1.jpg' },
  { id: 10, imagen: '../public/images/avatar2.jpg' },
  { id: 11, imagen: '../public/images/avatar3.jpg' },
  { id: 12, imagen: '../public/images/avatar4.jpg' },
  { id: 13, imagen: '../public/images/avatar5.jpg' },
  { id: 14, imagen: '../public/images/avatar6.jpg' },
  { id: 15, imagen: '../public/images/avatar7.jpg' },
  { id: 16, imagen: '../public/images/avatar8.png' },
  { id: 17, imagen: '../public/images/avatar9.jpg' },
  { id: 18, imagen: '../public/images/avatar10.jpg' },
  { id: 19, imagen: '../public/images/avatar11.jpg' },
  { id: 20, imagen: '../public/images/avatar12.png' },
  { id: 21, imagen: '../public/images/avatar13.png' },
  { id: 22, imagen: '../public/images/avatar14.png' },
];
const SeleccionarAvatar = () => {
  const navigate = useNavigate();

  const handleSeleccionarAvatar = (imagenUrl) => {
    console.log(`Avatar seleccionado: ${imagenUrl}`);

    navigate(`/perfil?avatar=${encodeURIComponent(imagenUrl)}`);
  };

  return (
    <Box
      sx={{
        p: 4,
        pt: 2,
        bgcolor: '#fff',
        minHeight: '100vh',
        color: '#000',
        textAlign: 'center',
        // Esto es lo que soluciona la superposición de la barra de navegación.
        // Ajusta el valor para que sea un poco mayor que la altura de tu barra de navegación.
        mt: { xs: '60px', sm: '80px' } 
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'Varsity',
          color: '#10045c',
          mb: 4,
          textAlign: 'center',
        }}
      >
        Elige un avatar
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {avataresPredefinidos.map((avatar) => (
          <Grid item key={avatar.id} xs={4} sm={3} md={2} lg={1}>
            <IconButton
              onClick={() => handleSeleccionarAvatar(avatar.imagen)}
              sx={{
                p: 0,
                // Mueve la lógica de hover aquí, ya que no es válida dentro del atributo 'style'
                '&:hover img': {
                  border: '3px solid #10045c',
                },
              }}
            >
              <img
                src={avatar.imagen}
                alt={`Avatar ${avatar.id}`}
                style={{
                  width: '100%',
                  borderRadius: '50%',
                  border: '3px solid transparent',
                  transition: 'border 0.2s',
                }}
              />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SeleccionarAvatar;