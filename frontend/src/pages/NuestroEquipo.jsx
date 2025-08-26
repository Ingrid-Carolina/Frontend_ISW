import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Imgjud from '/Images/Fondojugadores.png';

// Datos del cuerpo técnico (junta directiva)
export const cuerpoTecnico = [
    { nombre: 'Mauricio Chavarria', rol: 'Presidente' },
    { nombre: 'LEnard Rodriguez', rol: 'Vicepresidente' },
    { nombre: 'Karla Paz Reyes', rol: 'Secretaria' },
    { nombre: 'Ely Suyapa Lagos', rol: 'Tesorera' },
    { nombre: 'Norma Rivera', rol: 'Fiscal' },
    { nombre: 'Alex Espinal', rol: 'Vocal I' },
    { nombre: 'Elvin David Lagos', rol: 'Vocal II' },
    { nombre: 'Manuel Ponce', rol: 'Vocal III' },
];

const Jugadores = () => {
    // Tarjeta de miembro
    const MemberCard = ({ nombre, rol }) => (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 1.5, md: 2 },
                textAlign: 'center',
                bgcolor: 'white',
                borderRadius: 2,
                minWidth: { xs: 140, md: 180 },
                border: '2px solid #10045c',
            }}
        >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#10045c', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                {rol}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                {nombre}
            </Typography>
        </Paper>
    );

    // Línea vertical
    const VerticalLine = ({ height = 30 }) => (
        <Box sx={{ width: '2px', height: { xs: height / 2, md: height }, bgcolor: '#10045c', mx: 'auto' }} />
    );

    // Contenedor con línea horizontal conectando hijos
    const HorizontalConnector = ({ children }) => (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: '100%'
        }}>
            <Box sx={{
                position: 'absolute',
                top: { xs: '0', md: '20px' },
                left: 0,
                right: 0,
                height: '2px',
                bgcolor: '#10045c'
            }} />
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center',
                gap: { xs: 4, md: 6 },
                width: '100%'
            }}>
                {children}
            </Box>
        </Box>
    );

    return (
        <>
            {/* HEADER */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    minHeight: { xs: '60vh', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${Imgjud})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 8 },
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: { xs: '3rem', md: '7rem' },
                            fontFamily: '"Varsity", cursive',
                        }}
                    >
                        NUESTRO EQUIPO
                    </Typography>
                </Box>
            </Box>

            {/* SECCIÓN JUGADORES */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                    px: { xs: 3, md: 10 },
                    py: 6,
                    bgcolor: '#e6691d',
                    color: 'white',
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            mb: 2,
                            fontSize: { xs: '2.5rem', md: '4rem' },
                        }}
                    >
                        LOS JUGADORES
                    </Typography>
                </Box>
            </Box>

            {/* ORGANIGRAMA */}
            <Box sx={{ px: { xs: 3, md: 10 }, py: 6, bgcolor: '#f1f1f1' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontFamily: '"Varsity", cursive',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 6,
                        fontSize: { xs: '2.5rem', md: '4rem' },
                        color: '#10045c',
                    }}
                >
                    Junta Directiva
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    
                    {/* PRESIDENTE */}
                    <MemberCard {...cuerpoTecnico.find(m => m.rol === 'Presidente')} />

                    {/* Conexión hacia Vice, Secretaria y Tesorera */}
                    <VerticalLine />
                    <HorizontalConnector>
                        {cuerpoTecnico
                            .filter(m => ['Vicepresidente', 'Secretaria', 'Tesorera'].includes(m.rol))
                            .map((persona, idx) => (
                                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <VerticalLine height={20} />
                                    <MemberCard {...persona} />
                                </Box>
                            ))}
                    </HorizontalConnector>

                    {/* Conexión hacia Fiscal */}
                    <VerticalLine />
                    <MemberCard {...cuerpoTecnico.find(m => m.rol === 'Fiscal')} />

                    {/* Conexión hacia Vocales */}
                    <VerticalLine />
                    <HorizontalConnector>
                        {cuerpoTecnico
                            .filter(m => m.rol.includes('Vocal'))
                            .map((persona, idx) => (
                                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <VerticalLine height={20} />
                                    <MemberCard {...persona} />
                                </Box>
                            ))}
                    </HorizontalConnector>
                </Box>
            </Box>
        </>
    );
};

export default Jugadores;
