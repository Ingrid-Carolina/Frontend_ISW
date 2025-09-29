// Componente TestimonioCapsula.jsx es un componente de React que utiliza Material-UI para mostrar un testimonio en una cápsula estilizada.
// El componente presenta el nombre del testimonio, su contenido y una imagen asociada, con un diseño atractivo y responsivo.
import React from 'react';
import { Box, Typography, Avatar, Paper, useTheme } from '@mui/material';

const TestimonioCapsula = ({ nombre, contenido, imagen }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        borderRadius: 4,
        border: '3px solid #e06c14',
        backgroundColor: '#ffffff',
        mb: 4,
        gap: 3,
        flexWrap: 'wrap' // Se adapta en móvil
      }}
    >
      {/* Texto del testimonio */}
      <Box sx={{ flex: 1, minWidth: '250px' }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Rific',
            color: '#10045c',
            mb: 1
          }}
        >
          {nombre}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'ManropeEB',
            color: '#000000',
            lineHeight: 1.6
          }}
        >
          “{contenido}”
        </Typography>
      </Box>

      {/* Imagen del jugador */}
      <Avatar
        src={imagen}
        alt={nombre}
        sx={{
          width: 140,
          height: 140,
          border: '2px solid #e06c14'
        }}
      />
    </Paper>
  );
};

export default TestimonioCapsula;
