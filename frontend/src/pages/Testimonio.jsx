import React from 'react';
import { Container, Typography } from '@mui/material';
import TestimonioCapsula from '../components/TestimonioCapsula';

const testimonios = [
  {
    nombre: "Carlos 'El Rápido' Gómez",
    contenido:
      "Me encanta jugar béisbol aquí en Honduras. Mis amigos y yo aprendemos mucho y nos divertimos. ¡Es mi deporte favorito!",
    imagen: "/Images/AvatarBboy.jpeg"
  },
  {
    nombre: "Sofía 'La Estrella' Rodríguez",
    contenido:
      "Desde que empecé a jugar, he mejorado mucho. Los entrenadores son geniales y me ayudan a ser mejor cada día. ¡Sueño con ser profesional!",
    imagen:  "/Images/AvatarBgirl.jpg"
  },
  {
    nombre: "Carlos 'El Rápido' Gómez",
    contenido:
      "Me encanta jugar béisbol aquí en Honduras. Mis amigos y yo aprendemos mucho y nos divertimos. ¡Es mi deporte favorito!",
    imagen: "/Images/AvatarBboy.jpeg"
  },
  {
    nombre: "Sofía 'La Estrella' Rodríguez",
    contenido:
      "Desde que empecé a jugar, he mejorado mucho. Los entrenadores son geniales y me ayudan a ser mejor cada día. ¡Sueño con ser profesional!",
    imagen:  "/Images/AvatarBgirl.jpg"
  },
  {
    nombre: "Carlos 'El Rápido' Gómez",
    contenido:
      "Me encanta jugar béisbol aquí en Honduras. Mis amigos y yo aprendemos mucho y nos divertimos. ¡Es mi deporte favorito!",
    imagen: "/Images/AvatarBboy.jpeg"
  },
  {
    nombre: "Sofía 'La Estrella' Rodríguez",
    contenido:
      "Desde que empecé a jugar, he mejorado mucho. Los entrenadores son geniales y me ayudan a ser mejor cada día. ¡Sueño con ser profesional!",
    imagen:  "/Images/AvatarBgirl.jpg"
  },
];

const PaginaTestimonios = () => {
  return (
    <div style={{ paddingTop: '90px'}}>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: '64px',
          paddingBottom: '32px',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            align="center"
            sx={{
              fontFamily: 'Varsity',
              color: '#10045c',
              marginBottom: '48px'
            }}
          >
            Testimonios de Jugadores
          </Typography>

          {testimonios.map((t, i) => (
            <TestimonioCapsula
              key={i}
              nombre={t.nombre}
              contenido={t.contenido}
              imagen={t.imagen}
            />
          ))}
        </Container>
      </div>
    </div>
  );
};

export default PaginaTestimonios;
