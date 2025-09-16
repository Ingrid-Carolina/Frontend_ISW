import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import equipoImg from '/Images/greyimg.jpg';
import equipoImg2 from '/Images/equipo2.jpg';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { api } from '../api/api';
import React, { useState, useRef, useEffect } from 'react';


// Variantes de animación para la entrada en vista
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
};

const Voluntariado = () => {

  const [images, setImages] = useState({
    header: equipoImg, // antes usabas equipoImg fijo
    voluntariado: "https://projectbeisbol.org/wp-content/uploads/2023/05/Become-a-Volunteer-1024x768.jpeg",
  });
  const [isAdmin, setIsAdmin] = useState(false);



  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const handleImageChange = async (key, file) => {
    if (!(file instanceof File)) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await api.post("/auth/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const finalUrl = uploadResponse.data.url;

      await api.put("/auth/images", { type: key, url: finalUrl });

      setImages((prev) => ({
        ...prev,
        [key]: finalUrl,
      }));
    } catch (error) {
      console.error(`Error al actualizar la imagen de ${key}:`, error);
    }
  };

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



  return (
    <>
      {/* ENCABEZADO CON IMAGEN */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: { xs: '50vh', md: '70vh' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${images.header})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, md: 8 },
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
          marginTop: '90px',
        }}

      >
        {isAdmin && (
          <IconButton
            sx={{ position: 'absolute', top: 20, right: 20, zIndex: 20, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}
            component="label"
          >
            <EditIcon />
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageChange('header', e.target.files[0])} />
          </IconButton>
        )}

        {/* Capa de filtro de color semitransparente */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 80, 0.75)',
            zIndex: 1,
            clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
          }}
        />
        {/* Contenido del encabezado (títulos y SVG) */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            color: 'white',
            padding: '0 2rem',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'Varsity, sans-serif',
              fontSize: '5rem',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: 'Groteskbold, sans-serif',
                fontSize: '0.5em',
                display: 'block',
              }}
            >
              Se Parte De
            </Typography>
            Pilotos FAH
          </Typography>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            viewBox="0 0 364 93"
            style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
          >
            <path
              d="m337.02 67.25 2.6-10.25 2.5-9.96h18l-10.66 9.51z"
              fill="#be1e2d"
            />
            <path
              d="m337.02 26.82 2.6 10.25 2.5 9.96h18l-10.66-9.5z"
              fill="#ed1c24"
            />
            <path
              d="m282.53 71.76 3.18-12.54 3.06-12.17H310.78l-13.04 11.62z"
              fill="#be1e2d"
            />
            <path
              d="m282.53 22.32 3.18 12.53 3.06 12.18H310.78l-13.04-11.62z"
              fill="#ed1c24"
            />
            <path
              d="m220.48 76.71 3.82-15.04 3.67-14.62h26.43L238.74 61z"
              fill="#be1e2d"
            />
            <path
              d="m220.48 17.36 3.82 15.05 3.67 14.62h26.43l-15.66-13.95z"
              fill="#ed1c24"
            />
            <g>
              <path
                d="m151.74 81.97 4.49-17.71 4.33-17.21h31.11l-18.43 16.42z"
                fill="#be1e2d"
              />
              <path
                d="m151.74 12.11 4.49 17.7 4.33 17.21h31.11l-18.43-16.41z"
                fill="#ed1c24"
              />
            </g>
            <g>
              <path
                d="m77.91 86.39 5.06-19.95 4.87-19.39h35.04l-20.75 18.5z"
                fill="#be1e2d"
              />
              <path
                d="m77.91 7.69 5.06 19.95 4.87 19.38h35.04l-20.75-18.49z"
                fill="#ed1c24"
              />
            </g>
            <g>
              <path
                d="m4.2 89.74 5.48-21.65 5.29-21.04H53L30.48 67.12z"
                fill="#be1e2d"
              />
              <path
                d="m4.2 4.33 5.48 21.65 5.29 21.04H53L30.48 26.95z"
                fill="#ed1c24"
              />
            </g>
          </svg>
        </Box>
      </Box>

      {/* SECCIÓN DE TEXTO Y CONTENIDO */}
      <Box sx={{ padding: '40px 0', marginTop: '1rem' }}>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: '#333',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            padding: '0 2rem',
            font: 'bold',
          }}
        >
          ¿Te apasiona el béisbol y el servicio a la comunidad? Si es así, Pilotos FAH te está llamando. Al unirte a nuestra misión, te convertirás en parte fundamental de la próxima generación de líderes y, a través del espíritu del béisbol, fomentarás un cambio social positivo, llevando nuestra pasión a nuevas alturas. Descubre cómo puedes marcar la diferencia hoy mismo con Pilotos FAH.
        </Typography>

        {/* Sección de Voluntariado */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            backgroundColor: '#ff914d',
            padding: { xs: '3rem 2rem', md: '4rem 2rem' }, // Adjusted padding for mobile
            width: '100%',
            maxWidth: 'none',
            marginTop: '3rem',
            clipPath: 'polygon(0 8%, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* Contenedor del texto (con animación) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            style={{
              flex: 1,
              padding: '20px',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'Varsity, sans-serif',
                fontSize: '3rem',
                margin: '0 0 1rem',
                fontStyle: 'italic',
                fontWeight: '900',
              }}
            >
              Convierte en un Voluntario
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'Forte Forward, sans-serif',
                fontSize: '1.5rem',
                margin: '0 0 1rem',
                fontWeight: '700',
              }}
            >
              Tú oportunidad de hacer la diferencia
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
                lineHeight: '1.6',
                fontWeight: '500',
              }}
            >
              El voluntariado con Pilotos FAH es una oportunidad única para combinar tu pasión por el béisbol con un impacto real en la vida de los demás. Al unirte a nosotros, aprenderás valiosas habilidades de liderazgo, harás amigos y te convertirás en parte de algo más grande, contribuyendo a un cambio positivo en nuestra comunidad.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily:
                  '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
                lineHeight: '1.6',
                fontWeight: '500',
              }}
            >
              No importa tu edad o nivel de experiencia en el béisbol, en Pilotos FAH, damos la bienvenida a cualquier persona que desee trabajar como voluntario. Hay una oportunidad para todos de tener un impacto positivo y significativo.
            </Typography>
            <Box sx={{ marginTop: '1rem' }}>
              <Link
                to="/Contacto"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  color: '#fff',
                  borderRadius: '5px',
                  backgroundColor: '#10045c',
                  transition: 'background-color 0.3s ease',
                }}
              >
                Contáctanos
              </Link>
            </Box>
          </motion.div>

          {/* Contenedor de la imagen (con animación) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={scaleIn}
            style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isAdmin ? (
              <Box sx={{ position: 'relative', width: '90%' }}>
                <Box
                  component="img"
                  src={images.voluntariado}
                  alt="Voluntariado"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                  component="label"
                >
                  <EditIcon />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      handleImageChange('voluntariado', e.target.files[0])
                    }
                  />
                </IconButton>
              </Box>
            ) : (
              <Box
                component="img"
                src={images.voluntariado}
                alt="Voluntariado"
                sx={{
                  width: '90%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            )}
          </motion.div>

        </Box>
      </Box>
    </>
  );
};

export default Voluntariado;