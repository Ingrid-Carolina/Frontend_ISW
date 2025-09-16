import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api/api';

// Imagen inicial del header
import Img from '/Images/Categoria.png';

const categorias = [
  {
    slug: 'sub-8-escuelita',
    titleText: 'Sub-8 (Escuelita)',
    title: <>Sub-8<br />(Escuelita)</>,
    image: '/Images/Cat_Sub8.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Formativa',
    descripcion:
      'Niños de hasta 8 años que están dando sus primeros pasos en el béisbol. Se enfoca en el juego recreativo, el aprendizaje básico y el desarrollo motriz en un ambiente divertido, seguro y adaptado a su edad.',
  },
  {
    slug: 'sub-10-pre-infantil',
    titleText: 'Sub-10 (Pre-Infantil)',
    title: <>Sub-10<br />(Pre-Infantil)</>,
    image: '/Images/Cat_Sub10.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Formativa',
    descripcion:
      'Categoría para jóvenes hasta 10 años, desarrollo básico de técnica y juego. Se fortalecen habilidades como lanzamiento, bateo y reglas del juego, con una estructura pedagógica que incentiva la disciplina y el trabajo en equipo.',
  },
  {
    slug: 'sub-13-infantil',
    titleText: 'Sub-13 (Infantil)',
    title: <>Sub-13<br />(Infantil)</>,
    image: '/Images/Cat_Sub13.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Competitiva',
    descripcion:
      'Jugadores entre 11 y 13 años, nivel intermedio y enfoque competitivo. Se introducen estrategias de juego, entrenamientos más rigurosos, y participación en competencias regionales, preparando la base para etapas superiores.',
  },
  {
    slug: 'sub-16-pre-junior',
    titleText: 'Sub-16 (Pre-Junior)',
    title: <>Sub-16<br />(Pre-Junior)</>,
    image: '/Images/Cat_Sub16.png',
    logo: '/Images/Logo-pilotos.png',
    tipo: 'Avanzada',
    descripcion:
      'Jugadores avanzados, cerca de pasar a ligas mayores, entrenamiento intensivo. Se perfecciona el rendimiento técnico y mental del jugador, con seguimiento profesional y oportunidades para ascender a niveles élite del deporte.',
  },
];

const EditableImage = ({ src, alt, onImageUpload, imgSx }) => {
  const fileRef = React.useRef(null);

  const handleIconClick = (e) => {
    e.stopPropagation();
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file && typeof onImageUpload === 'function') onImageUpload(file);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        '&:hover .edit-icon': {
          opacity: 1, //aparece cuando hay hover
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...(imgSx || {}),
        }}
      />

      <IconButton
        size="small"
        onClick={handleIconClick}
        className="edit-icon"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          opacity: 0, // oculto inicialmente
          transition: 'opacity 0.3s ease',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
        }}
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </Box>
  );
};


const Categorias = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCards = 3;

  // estado que guarda las URLs actuales de cada categoría (inicial con imágenes locales)
  const [categoryImages, setCategoryImages] = useState(
    categorias.reduce((acc, cat) => {
      acc[cat.slug] = cat.image;
      return acc;
    }, {})
  );
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get('/auth/images');
        // response.data esperado como array: [{ type: 'sub-8-escuelita', url: '...' }, ...]
        const imagesMap = Array.isArray(response.data)
          ? response.data.reduce((acc, cur) => {
            if (cur.type && cur.url) acc[cur.type] = cur.url;
            return acc;
          }, {})
          : {};
        if (mounted) setCategoryImages(prev => ({ ...prev, ...imagesMap }));
      } catch (err) {
        console.error('Error al cargar imágenes de categorías:', err);
        if (mounted) setError('No se pudieron cargar las imágenes de categorías.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const r = await api.get('/auth/obtenerperfil', { withCredentials: true, skipAuthRedirect: true });
        const p = Array.isArray(r.data) ? r.data[0] : r.data;
        const role = String(p?.rol || '').toLowerCase();
        setIsAdmin(role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };
    checkRole();
  }, []);


  const handleImageChange = async (slug, file) => {
    if (!(file instanceof File)) {
      setError('No se seleccionó un archivo válido.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await api.post('/auth/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const finalUrl = uploadResponse.data.url;
      // Guardar la URL persistente en la tabla de imágenes
      await api.put('/auth/images', { type: slug, url: finalUrl });

      // Actualizar UI local
      setCategoryImages(prev => ({ ...prev, [slug]: finalUrl }));
    } catch (err) {
      console.error(`Error al actualizar la imagen de ${slug}:`, err);
      setError(`Error al actualizar la imagen de ${slug}.`);
    }
  };



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
                {isAdmin ? (
                  <EditableImage
                    src={categoryImages[categoria.slug]}
                    alt={categoria.titleText}
                    imgSx={{ width: '100%', height: '250px', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                    onImageUpload={(file) => handleImageChange(categoria.slug, file)}
                  />
                ) : (
                  <img
                    src={categoryImages[categoria.slug]}
                    alt={categoria.titleText}
                    style={{ width: '100%', height: '250px', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
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
            <Box sx={{ width: { xs: '100%', md: '40%' } }}>
              {isAdmin ? (
                <EditableImage
                  src={categoryImages[cat.slug]}
                  alt={cat.titleText}
                  imgSx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onImageUpload={(file) => handleImageChange(cat.slug, file)}
                />
              ) : (
                <img
                  src={categoryImages[cat.slug]}
                  alt={cat.titleText}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

            </Box>


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
                    mb: 0, // sin margen debajo
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
                  mt: -0.5, // subido un poquito más
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
      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

    </>
  );
};

export default Categorias;
