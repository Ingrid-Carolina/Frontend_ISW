import React from 'react';
import { Box, Typography } from '@mui/material';
import Imgjud from '/Images/Fondojugadores.png';
import TarjetaTecnico from '../components/TarjetaTecnico.jsx';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

export const cuerpoTecnico = [
    {
        nombre: 'Mauricio Chavarria',
        rol: 'Presidente',
        descripcion: 'Responsable de la toma de decisiones en la asociacion',
        imagen: '/Images/EnzoMaresca.jpeg',
    },
    {
        nombre: 'LEnard Rodriguez',
        rol: 'Vicepresidente',
        descripcion: 'Encargado del acondicionamiento físico y prevención de lesiones.',
        imagen: '/Images/LuisEnrique2.jpg',
    },
    {
        nombre: 'Karla Paz Reyes',
        rol: 'Secretaria',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },{
        nombre: 'Ely Suyapa Lagos',
        rol: 'Tesorera',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },{
        nombre: 'Norma Rivera',
        rol: 'Fiscal',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },{
        nombre: 'Alex Espinal',
        rol: 'Vocal I',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },{
        nombre: 'Elvin David Lagos',
        rol: 'Vocal II',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },{
        nombre: 'Manuel Ponce',
        rol: 'Vocal III',
        descripcion: 'Trabaja con los lanzadores para mejorar su técnica y rendimiento.',
        imagen: '/Images/PepGuardiola.jpg',
    },
    // Puedes añadir más miembros del cuerpo técnico aquí si lo deseas
];

const patrocinadores = [
    { id: 1, logo: '/storage/patrocinadores/May2020/SPbDx6Bxsbxvc6RKoxks.jpg' },
    { id: 2, logo: '/storage/patrocinadores/May2020/KdNBcOhgRN449B4cJG8E.jpg' },
    { id: 3, logo: '/storage/patrocinadores/May2020/TxsPtkOdB0EavPdwF92z.jpg' },
    { id: 4, logo: '/storage/patrocinadores/May2020/0OB519VMe0u7NTvtZy3a.jpg' },
    { id: 5, logo: '/storage/patrocinadores/March2025/31uYqwQRcmU0KO2VZZUK.jpg' },
    { id: 6, logo: '/storage/patrocinadores/March2025/bv7VZGDCB8ET7AFH6xgB.jpg' },
    { id: 7, logo: '/storage/patrocinadores/March2025/kRZwuBLxnA9EVfauhepp.jpg' },
    { id: 8, logo: '/storage/patrocinadores/March2025/9bWl4Prhsrsx8dlneoGE.jpg' },
    { id: 9, logo: '/storage/patrocinadores/March2025/tqWZh68han2tgwxccsD3.jpg' },
    { id: 10, logo: '/storage/patrocinadores/March2025/3oUh9A2PptjnzcNbgZc5.jpg' },
];

const Jugadores = () => {
    // Opciones para el carrusel de Patrocinadores
    const patrocinadorCarouselOptions = {
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2,
            },
            600: {
                items: 3,
            },
            1000: {
                items: 5,
            },
        },
    };

    // Opciones para el carrusel del Cuerpo Técnico
    const cuerpoTecnicoCarouselOptions = {
        loop: true,
        margin: 20, // Margen entre las tarjetas
        autoplay: true, // Puedes ponerlo en true si quieres que se mueva automáticamente
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        nav: false, // Muestra los botones de navegación (flechas)
        dots: false, // Muestra los puntos de navegación
        responsive: {
            0: {
                items: 1, // 1 tarjeta en pantallas muy pequeñas
            },
            600: {
                items: 2, // 2 tarjetas en pantallas medianas
            },
            900: {
                items: 3, // 3 tarjetas en pantallas más grandes
            },
            1200: {
                items: 4, // 4 tarjetas en pantallas de escritorio
            },
        },
    };

    return (
        <>
            {/* HEADER SECTION */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: '75vh', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${Imgjud})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 8 },
                }}
            >
                {/* Overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        //backgroundColor: 'rgba(0, 0, 80, 0.75)', // Puedes descomentar si quieres un overlay
                        zIndex: 1,
                    }}
                />

                {/* Texto centrado */}
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
                        NUESTRO EQUIPO
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    px: { xs: 3, md: 10 },
                    py: 6,
                    bgcolor: '#e6691d',
                }}
            >
                <Box sx={{ flex: 1, color: 'white' }}>
                    <Typography
                        variant='h3'
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '3rem', md: '4rem' },
                        }}
                    >
                        LOS JUGADORES
                    </Typography>

                    <Typography
                        variant='body1'
                        sx={{
                            fontFamily: '"PeterMedium", sans-serif',
                            fontSize: '1.5rem',
                            lineHeight: 1.8,
                        }}
                    >
                        {/* Aquí puedes añadir contenido sobre los jugadores */}
                    </Typography>
                </Box>
            </Box>

            {/* Sección del Cuerpo Técnico con Owl Carousel */}
            <Box sx={{ px: { xs: 3, md: 10 }, py: 6, bgcolor: '#f1f1f1' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: '"Varsity", cursive',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 4,
                        fontSize: { xs: '3rem', md: '4rem' },
                        color: '#10045c'
                    }}
                >
                    Junta Directiva
                </Typography>

                <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}> {/* Contenedor para el carrusel */}
                    <OwlCarousel className='owl-theme' {...cuerpoTecnicoCarouselOptions}>
                        {cuerpoTecnico.map((persona, index) => (
                            <Box key={index} className='item' sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                                <TarjetaTecnico
                                    nombre={persona.nombre}
                                    rol={persona.rol}
                                    descripcion={persona.descripcion}
                                    imagen={persona.imagen}
                                />
                            </Box>
                        ))}
                    </OwlCarousel>
                </Box>
            </Box>
            {/* Sección de Patrocinadores */}
            <Box sx={{ py: 6, bgcolor: '#ffffff', textAlign: 'center' }}>
                
            </Box>
        </>
    );
};

export default Jugadores;
