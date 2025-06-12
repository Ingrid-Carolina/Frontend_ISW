import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  Avatar,
  useTheme
} from '@mui/material';

const TestimonioBeisbol = () => {
  const theme = useTheme();

  const testimonios = [
    {
      id: 1,
      nombre: "Carlos 'El Rápido' Gómez",
      empresa: "Pilotos",
      contenido: "Me encanta jugar béisbol aquí en Honduras. Mis amigos y yo aprendemos mucho y nos divertimos. ¡Es mi deporte favorito!",
      //avatar: "/avatar1.jpg"
    },
    {
      id: 2,
      nombre: "Sofía 'La Estrella' Rodríguez",
      empresa: "Pilotos",
      contenido: "Desde que empecé a jugar, he mejorado mucho. Los entrenadores son geniales y me ayudan a ser mejor cada día. ¡Sueño con ser profesional!",
      //avatar: "/avatar2.jpg"
    },
    {
      id: 3,
      nombre: "Miguel 'El Potente' Hernández",
      empresa: "Pilotos",
      contenido: "Este equipo es como mi segunda familia. Hemos ganado partidos y también aprendido de las derrotas. ¡El béisbol me ha enseñado disciplina!",
      //avatar: "/avatar3.jpg"
    }
  ];

  return (
    <Box
      component="section"
      sx={{
        py: 10, //padding vertical
        mt: 6,  // Margen superior adicional
        backgroundColor: 'white',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Container maxWidth="md">
        {/* Título principal */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            color: theme.palette.text.primary
          }}
        >
          Testimonios de nuestros jugadores
        </Typography>

        {/* Lista de testimonios */}
        <Stack spacing={4}>
          {testimonios.map((testimonio) => (
            <Box key={testimonio.id}>
              {/* Encabezado de empresa (solo si es diferente al anterior) */}
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 'medium',
                  mb: 2,
                  color: theme.palette.text.secondary
                }}
              >
                {testimonio.empresa}
              </Typography>

              {/* Contenido del testimonio */}
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
                pl: 2,
                borderLeft: `2px solid ${theme.palette.divider}`
              }}>
                <Avatar
                  src={testimonio.avatar}
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 3,
                    mt: 0.5
                  }}
                />
                <Box>
                  <Typography
                    variant="body1"
                    component="blockquote"
                    sx={{
                      fontStyle: 'italic',
                      mb: 1.5,
                      lineHeight: 1.6,
                      color: theme.palette.text.primary
                    }}
                  >
                    {testimonio.contenido}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    — {testimonio.nombre}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default TestimonioBeisbol;