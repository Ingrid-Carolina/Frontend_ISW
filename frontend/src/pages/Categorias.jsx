import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { api } from '../api/api';

// Imagen inicial del header
import Img from '/Images/Categoria.png';

const Categorias = () => {
  // ======== estado para verificar admin ========
  const [isAdmin, setIsAdmin] = useState(false);

  // ======== estado para categorías ========
  const [categorias, setCategorias] = useState([]);
  const [headerImage, setHeaderImage] = useState(Img);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await api.get('/auth/check-admin');
        setIsAdmin(data?.isAdmin || false);
      } catch (err) {
        console.error('Error verificando admin:', err);
        setIsAdmin(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/auth/categorias');
        setCategorias(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
    fetchCategorias();
  }, []);

  // ======== subir imágenes ========
  const handleImageUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("target", target);

    try {
      const { data } = await api.post('/auth/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (target === 'header') {
        setHeaderImage(data.url);
      } else {
        setCategorias((prev) =>
          prev.map((c) =>
            c.slug === target ? { ...c, image: data.url } : c
          )
        );
      }
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      alert('No se pudo subir la imagen.');
    }
  };

  // ======== carrusel ========
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

  const scrollToCategory = (slug) => {
    const element = document.getElementById(`detalle-${slug}`);
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
          backgroundImage: `url(${headerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
        }}
      >
        {isAdmin && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'header')}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}
          />
        )}

        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
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
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url('/Images/Fondo_Carrusel_Categorias.png')`,
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
            {getVisibleCards().map((categoria) => (
              <Box
                key={categoria.slug}
                onClick={() => scrollToCategory(categoria.slug)}
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
                  alt={categoria.titleText}
                  sx={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                {isAdmin && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, categoria.slug)}
                    style={{ display: 'block', margin: '10px auto' }}
                  />
                )}
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

        {categorias.map((cat) => (
          <Box
            key={cat.slug}
            id={`detalle-${cat.slug}`}
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
              alt={cat.titleText}
              sx={{
                width: { xs: '100%', md: '40%' },
                objectFit: 'cover',
              }}
            />
            {isAdmin && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, cat.slug)}
                style={{ marginTop: '10px', marginLeft: '10px' }}
              />
            )}

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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0 }}>
                  <Box
                    component='img'
                    src={cat.logo}
                    alt='Logo equipo'
                    sx={{ width: 120, height: 60 }}
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
                  mt: -0.5,
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
