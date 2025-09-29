// Componente TarjetaTecnico.jsx es un componente de React que utiliza Material-UI para mostrar una tarjeta con información de un técnico, incluyendo su nombre, rol, descripción e imagen.
// La tarjeta tiene un diseño atractivo con bordes redondeados y sombra, y utiliza tipografías personalizadas para cada sección de texto.
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const TarjetaTecnico = ({ nombre, rol, descripcion, imagen }) => {
	return (
		<Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 6 }}>
			<CardMedia
				component="img"
				height="300"
				image={imagen}
				alt={nombre}
				sx={{ objectFit: 'cover' }}
			/>
			<CardContent>
        <Box sx={{ textAlign: 'left' }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="#10045c"
            gutterBottom
            sx={{ fontFamily: '"Varsity", cursive' }} // Nombre
          >
            {nombre}
          </Typography>
          <Typography
            variant="h5"
            color="black"
            gutterBottom
            sx={{ fontFamily: '"GroteskBold", sans-serif' }} // Rol
          >
            {rol}
          </Typography>
          <Typography
            variant="body"
            color="text.primary"
            sx={{ fontFamily: '"PeterMedium", sans-serif' }} // Descripción
          >
            {descripcion}
          </Typography>
        </Box>
      </CardContent>
		</Card>
	);
};

export default TarjetaTecnico;
