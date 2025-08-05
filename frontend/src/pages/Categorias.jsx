import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Img from '/Images/Categoria.png';

const categorias = [
  {
    title: 'Liga Mayor',
    image: '/Images/Cat1.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Profesional',
    descripcion:
      'Jugadores de nivel profesional que compiten en la liga principal. Participan en torneos oficiales y representan el máximo nivel del béisbol nacional, con entrenamientos exigentes y alto rendimiento técnico y físico.',
  },
  {
    title: 'Sub-7',
    image: '/Images/Cat2.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Formativa',
    descripcion:
      'Niños de hasta 7 años que están dando sus primeros pasos en el béisbol. Se enfoca en el juego recreativo, el aprendizaje básico y el desarrollo motriz en un ambiente divertido, seguro y adaptado a su edad.',
  },
  {
    title: 'Sub-10',
    image: '/Images/Cat3.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Formativa',
    descripcion:
      'Categoría para jóvenes hasta 10 años, desarrollo básico de técnica y juego. Se fortalecen habilidades como lanzamiento, bateo y reglas del juego, con una estructura pedagógica que incentiva la disciplina y el trabajo en equipo.',
  },
  {
    title: 'Sub-15',
    image: '/Images/Cat4.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Competitiva',
    descripcion:
      'Jugadores entre 11 y 15 años, nivel intermedio y enfoque competitivo. Se introducen estrategias de juego, entrenamientos más rigurosos, y participación en competencias regionales, preparando la base para etapas superiores.',
  },
  {
    title: 'Sub-18',
    image: '/Images/Cat5.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Avanzada',
    descripcion:
      'Jugadores avanzados, cerca de pasar a ligas mayores, entrenamiento intensivo. Se perfecciona el rendimiento técnico y mental del jugador, con seguimiento profesional y oportunidades para ascender a niveles élite del deporte.',
  },
];

const Categorias = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % categorias.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + categorias.length) % categorias.length);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < visibleCards; i++) {
      const index = (startIndex + i) % categorias.length;
      cards.push(categorias[index]);
    }
    return cards;
  };

  const scrollToCategory = (title) => {
    const element = document.getElementById(`detalle-${title}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* HEADER */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '75vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${Img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant='h2'
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '4rem', md: '7rem' },
              fontFamily: '"Varsity", cursive',
              color: 'white',
              textAlign: 'center',
            }}
          >
            CATEGORIAS
          </Typography>
        </Box>
      </Box>

      {/* CARRUSEL */}
      <Box
        sx={{
          py: 6,
          px: { xs: 3, md: 10 },
          backgroundImage: `url('/Images/Fondo_Carrusel_Categorias.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
          <Typography
            variant='h3'
            sx={{
              fontFamily: '"Varsity", cursive',
              fontWeight: 'bold',
              fontSize: { xs: '3rem', md: '4rem' },
              color: '#e6691d',
            }}
          >
            LAS CATEGORÍAS
          </Typography>
          <Typography
            variant='body1'
            sx={{
              fontFamily: '"PeterMedium", sans-serif',
              color: '#e6691d',
              fontSize: '1.5rem',
              lineHeight: 4.0,
            }}
          >
            Explora cada categoría del béisbol juvenil y profesional. ¡Deslizá las tarjetas para conocerlas todas!
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton
            onClick={handlePrev}
            sx={{
              backgroundColor: 'rgba(230, 105, 29, 0.7)',
              borderRadius: '50%',
              p: 1.5,
              '&:hover': { backgroundColor: 'rgba(230, 105, 29, 0.9)' },
            }}
          >
            <ArrowBackIosIcon sx={{ color: 'white' }} />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 3, overflow: 'hidden', width: '80%', justifyContent: 'center' }}>
            {getVisibleCards().map((categoria, i) => (
              <Box
                key={i}
                onClick={() => scrollToCategory(categoria.title)}
                sx={{
                  width: '250px',
                  transition: 'transform 0.5s ease',
                  borderRadius: 2,
                  boxShadow: 4,
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  component='img'
                  src={categoria.image}
                  alt={categoria.title}
                  sx={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: '"Varsity", cursive',
                    p: 2,
                    color: '#e6691d',
                    fontWeight: 'bold',
                  }}
                >
                  {categoria.title}
                </Typography>
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={handleNext}
            sx={{
              backgroundColor: 'rgba(230, 105, 29, 0.7)',
              borderRadius: '50%',
              p: 1.5,
              '&:hover': { backgroundColor: 'rgba(230, 105, 29, 0.9)' },
            }}
          >
            <ArrowForwardIosIcon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>

      {/* DETALLE DE CATEGORÍAS */}
      <Box
        sx={{
          py: 6,
          px: { xs: 3, md: 10 },
          backgroundColor: '#f26c23',
        }}
      >
        <Typography
          variant='h3'
          sx={{
            fontFamily: '"Varsity", cursive',
            color: '#fff',
            fontWeight: 'bold',
            mb: 5,
            textAlign: 'center',
          }}
        >
          Conocé cada categoría en detalle
        </Typography>

        {categorias.map((cat, index) => (
          <Box
            key={index}
            id={`detalle-${cat.title}`}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              backgroundColor: '#fff',
              borderRadius: 4,
              boxShadow: 3,
              mb: 5,
              overflow: 'hidden',
              maxWidth: '950px',
              mx: 'auto',
            }}
          >
            <Box
              component='img'
              src={cat.image}
              alt={cat.title}
              sx={{
                width: { xs: '100%', md: '40%' },
                objectFit: 'cover',
              }}
            />

            <Box sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box
                sx={{
                  height: '4px',
                  background: 'linear-gradient(to right, #f26c23, transparent)',
                  mb: 2,
                  borderRadius: 2,
                  width: '100%',
                }}
              />

              {cat.logo && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    component='img'
                    src={cat.logo}
                    alt='Logo equipo'
                    sx={{
                      width: 120,
                      height: 60,
                    }}
                  />
                  <Typography
                    variant='h5'
                    sx={{
                      fontFamily: '"Varsity", cursive',
                      color: '#f26c23',
                      fontWeight: 'bold',
                      letterSpacing: 1,
                    }}
                  >
                    PILOTOS
                  </Typography>
                </Box>
              )}

              <Typography
                variant='h4'
                sx={{
                  fontFamily: '"Varsity", cursive',
                  fontWeight: 'bold',
                  color: '#f26c23',
                }}
              >
                {cat.title}
              </Typography>

              <Typography
                variant='subtitle1'
                sx={{
                  fontFamily: '"PeterMedium", sans-serif',
                  color: '#888',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                Tipo de categoría: {cat.tipo}
              </Typography>

              <Typography
                variant='body1'
                sx={{
                  fontFamily: '"PeterMedium", sans-serif',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#444',
                  mb: 3,
                }}
              >
                {cat.descripcion}
              </Typography>

              <Box
                sx={{
                  height: '4px',
                  background: 'linear-gradient(to right, transparent, #f26c23)',
                  borderRadius: 2,
                  width: '100%',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Categorias;
