import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion'; // Asumiendo que framer-motion se usa en Hero
import TestimonioTrapezoide from '../components/TestimonioTrapezoide';
import VidCarousel from '../components/VideoCarousel';
//import ReactPlayer from 'react-player'; // Ya no es necesario si el contenido del Hero va directamente
//import Hero from '../components/Hero'; // Ya no importamos el componente Hero por separado
import { api } from '../api/api';
import EditableHeaderImage from '../components/EditableHeaderImage';

// Importa la imagen por defecto desde la ruta de tu proyecto
import fondoDefault from '/Images/TestimonioFondo1.jpg'; 

const videos = [
  { url: 'https://youtu.be/CSfEwT8x6B0?si=OJpKv5GCK71caBu6' },
  { url: 'https://youtu.be/7AU0m2Du_VY?si=LTod5L0RJbvHzoPS' },
  { url: 'https://youtu.be/bx242zV3_ME?si=9_1EAN8m6DVhIagp' },
];

// Variantes de animación (si se usan en el Hero original)
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const PaginaTestimonios = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [testimonios, setTestimonios] = useState([]);
  const [headerImageUrl, setHeaderImageUrl] = useState(fondoDefault); // Inicializa con la imagen por defecto
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageError, setImageError] = useState("");

  const roles = [
    "Jugador Profesional – Categoría Infantil",
    "Jugador Profesional – Categoría Intermedia",
    "Jugador Profesional – Categoría Juvenil",
    "Madre de jugador – Categoría Juvenil",
  ];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoadingImages(true);
        const response = await api.get('/auth/images');
        const imagesMap = response.data.reduce((acc, current) => {
          if (current.type && current.url) {
            acc[current.type] = current.url;
          }
          return acc;
        }, {});
        
        // Carga la imagen del encabezado de testimonios si existe en la API
        if (imagesMap.testimonios_header) {
          setHeaderImageUrl(imagesMap.testimonios_header);
        } else {
          // Si no está en la API, mantiene la imagen por defecto
          setHeaderImageUrl(fondoDefault);
        }
      } catch (error) {
        console.error('Error al cargar la imagen de encabezado de testimonios:', error);
        setImageError('No se pudo cargar la imagen de encabezado.');
        setHeaderImageUrl(fondoDefault); // Asegura que siempre haya una imagen
      } finally {
        setLoadingImages(false);
      }
    };
    fetchImages();

    const fetchTestimonios = async () => {
      try {
        const res = await api.get('/auth/obtenertestimonios');
        const testimoniosData = res.data;
        const testimoniosLista = testimoniosData.map(testimonio => ({
          id: testimonio.id_testimonio,
          nombre: testimonio.nombre,
          cita: testimonio.contenido,
          imagen: testimonio.imagen,
        }));
        setTestimonios(testimoniosLista);
      } catch (err) {
        console.error('Error al obtener testimonios:', err);
      }
    };
    fetchTestimonios();
  }, []);

  const handleImageChange = async (file) => {
    try {
      if (!(file instanceof File)) {
        console.error('Error: No se seleccionó un archivo válido.');
        setImageError('Error: No se seleccionó un archivo válido.');
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await api.post('/auth/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const finalUrl = uploadResponse.data.url;
      await api.put('/auth/images', {
        type: 'testimonios_header',
        url: finalUrl,
      });
      
      setHeaderImageUrl(finalUrl);
      console.log(`Imagen de testimonios_header guardada y actualizada exitosamente.`);
    } catch (error) {
      console.error(`Error al actualizar la imagen de testimonios_header:`, error);
      setImageError(`Error al actualizar la imagen de testimonios_header.`);
    }
  };

  if (loadingImages) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ overflowX: 'hidden' }}> {/* Evita desbordamiento horizontal */}
      {/* ENCABEZADO CON IMAGEN, FILTRO Y BOTÓN DE EDITAR */}
      <Box
        sx={{
          height: '100vh', // Mantiene la altura completa de la vista
          backgroundImage: `url(${headerImageUrl})`, // Usa la URL cargada o la por defecto
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#ffffff',
          position: 'relative',
          paddingTop: { xs: '70px', sm: '85px' }, // Ajuste de padding para la barra de navegación
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
            // El filtro azul se aplica aquí
            backgroundColor: 'rgba(0, 0, 80, 0.75)', 
            zIndex: 1,
          }}
        />
        {/* Contenido del Hero original */}
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
              fontFamily: 'Bulletto, cursive', // Asegúrate de que esta fuente esté disponible
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
              fontFamily: 'ManropeEB, sans-serif', // Asegúrate de que esta fuente esté disponible
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
        {/* Botón de edición para el header */}
        <EditableHeaderImage onImageUpload={handleImageChange} />
      </Box>

      {/* Resto de la página */}
      {imageError && <Alert severity="error" sx={{ my: 2 }}>{imageError}</Alert>}

      {testimonios.map((testimonio, index) => {
        const invertir = index % 2 === 1;
        const superponer = index !== 0;
        const invertirDiagonal = index % 2 === 0;
        const zIndex = 9 - (index % 9); // zIndex para los testimonios
        const rol = roles[Math.floor(Math.random() * roles.length)];

        return (
          <TestimonioTrapezoide
            key={index}
            {...testimonio}
            rol={rol}
            invertir={invertir}
            superponer={superponer}
            invertirDiagonal={invertirDiagonal}
            colorFondo={index % 2 === 0 ? '#c65402' : '#044c94'}
            zIndex={zIndex}
            finalTest={index === testimonios.length - 1}
          />
        );
      })}
      <section className="testimonios-titulo">
        <h1>Testimonios en Video</h1>
      </section>
      <div style={{ marginBottom: '50px' }}>
        <VidCarousel videos={videos} />
      </div>
    </div>
  );
};

export default PaginaTestimonios;