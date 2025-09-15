import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { api } from '../api/api';
import EditableImage from '../components/EditableImage';
import EditableHeaderImage from '../components/EditableHeaderImage';

// Variantes de animación
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

function NuestraHistoria() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Estado para las imágenes del encabezado y la galería, cargadas desde la API
    const [headerImage, setHeaderImage] = useState('');
    const [galeriaImages, setGaleriaImages] = useState([]);

    // Estado para las imágenes de las secciones
    const [images, setImages] = useState({
        quienes_somos: '',
        nuestros_inicios: '',
        impacto_comunitario: '',
        nuestros_valores: '',
        historia_header: ''
    });

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await api.get('/auth/images');
                
                const imagesMap = response.data.reduce((acc, current) => {
                    if (current.type && current.url) {
                        acc[current.type] = current.url;
                    }
                    return acc;
                }, {});

                // Actualiza las imágenes de las secciones y el encabezado
                setImages(prevImages => ({
                    ...prevImages,
                    quienes_somos: imagesMap.quienes_somos || '',
                    nuestros_inicios: imagesMap.nuestros_inicios || '',
                    impacto_comunitario: imagesMap.impacto_comunitario || '',
                    nuestros_valores: imagesMap.nuestros_valores || '',
                    historia_header: imagesMap.historia_header || ''
                }));

                // Filtra y ordena las imágenes de la galería
                const galeriaImagesFromApi = response.data
                    .filter(img => img.type && img.type.startsWith('galeria_'))
                    .sort((a, b) => {
                        const numA = parseInt(a.type.split('_')[1]);
                        const numB = parseInt(b.type.split('_')[1]);
                        return numA - numB;
                    })
                    .map(img => img.url);

                setGaleriaImages(galeriaImagesFromApi);

            } catch (error) {
                console.error('Error al cargar las imágenes de la página de historia:', error);
                setError('No se pudieron cargar las imágenes. Inténtelo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleImageChange = async (type, file) => {
        try {
            if (!(file instanceof File)) {
                setError('Error: No se seleccionó un archivo válido.');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await api.post('/auth/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const finalUrl = uploadResponse.data.url;
            
            await api.put('/auth/images', {
                type,
                url: finalUrl,
            });
            
            // Actualizamos la imagen en el estado local
            if (type.startsWith('galeria_')) {
                const index = parseInt(type.split('_')[1]) - 1;
                setGaleriaImages(prevImages => {
                    const updatedImages = [...prevImages];
                    updatedImages[index] = finalUrl;
                    return updatedImages;
                });
            } else {
                 setImages(prevImages => ({
                    ...prevImages,
                    [type]: finalUrl,
                }));
            }
            
        } catch (error) {
            console.error(`Error al actualizar la imagen de ${type}:`, error);
            setError(`Error al actualizar la imagen de ${type}.`);
        }
    };
    
    const handleGalleryImageUpload = (index) => async (file) => {
        const type = `galeria_${index + 1}`;
        await handleImageChange(type, file);
    };

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
    }

    return (
        <>
            {/* ENCABEZADO CON IMAGEN */}
            <Box
                sx={{
                    position: 'relative', // Necesario para posicionar el overlay y el botón de editar
                    width: '100%',
                    minHeight: { xs: '75vh', md: '90vh' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${images.historia_header})`, // Usa la imagen de la API
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    py: { xs: 6, md: 8 },
                }}
            >
                {/* Overlay azul */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 80, 0.75)', // Filtro azul
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: 'relative', // Contenedor para el texto y el botón
                        zIndex: 2, // Asegura que el texto y el botón estén por encima del overlay azul
                        textAlign: 'center',
                    }}
                >
                    <motion.div
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true }}
                        variants={fadeUp}
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
                            NUESTRA HISTORIA
                        </Typography>
                    </motion.div>
                </Box>
                {/* BOTÓN EDITAR PARA EL HEADER */}
                <EditableHeaderImage onImageUpload={(file) => handleImageChange('historia_header', file)} />
            </Box>
            
            {/* SECCIÓN QUIÉNES SOMOS MEJORADA */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: { xs: 4, md: 6 },
                    px: { xs: 3, md: 12 },
                    py: 8,
                    bgcolor: '#e6691d',
                }}
            >
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1, position: 'relative' }}
                >
                    <EditableImage
                        src={images.quienes_somos}
                        alt='Equipo de béisbol'
                        onImageUpload={(file) => handleImageChange('quienes_somos', file)}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 4,
                            '& .edit-button': {
                                bottom: 8,
                                right: 8,
                            }
                        }}
                    />
                </motion.div>
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1.3 }}
                >
                    <Box sx={{ color: 'white' }}>
                        <Typography
                            variant='h3'
                            sx={{
                                fontFamily: '"Varsity", cursive',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: { xs: '3rem', md: '4rem' },
                            }}
                        >
                            ¿Quiénes somos?
                        </Typography>
                        <Typography
                            variant='body1'
                            sx={{
                                fontFamily: '"PeterMedium", sans-serif',
                                fontSize: '1rem',
                                lineHeight: 1.9,
                            }}
                        >
                            Desde 1948, la Asociación de Béisbol Menor Pilotos de Honduras
                            (FAH) forma integralmente a jóvenes, impulsando habilidades
                            deportivas, valores y liderazgo. Creamos espacios seguros con el
                            apoyo de voluntarios, entrenadores, familias y aliados, para que
                            cada atleta crezca en lo físico, emocional y social. Más que un
                            equipo, somos una comunidad que comparte pasión, esfuerzo y
                            sentido de pertenencia. ¡Gracias por ser parte de esta familia!
                        </Typography>
                    </Box>
                </motion.div>
            </Box>

            {/* SECCIÓN: NUESTROS INICIOS */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    px: { xs: 4, md: 12 },
                    py: 8,
                    bgcolor: '#f7d7c4',
                    gap: { xs: 4, md: 6 },
                }}
            >
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1.3 }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            color: '#e6691d',
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            mb: 3,
                        }}
                    >
                        Nuestros Inicios
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            fontSize: '1.3rem',
                            lineHeight: 1.9,
                            fontFamily: '"PeterMedium", sans-serif',
                            color: '#333',
                        }}
                    >
                        Desde nuestros humildes comienzos en 1948,
                        nuestro enfoque ha sido brindar oportunidades para jóvenes atletas
                        en comunidades rurales. A través del béisbol, construimos
                        disciplina, valores y comunidad.
                    </Typography>
                </motion.div>
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1, position: 'relative' }}
                >
                    <EditableImage
                        src={images.nuestros_inicios}
                        alt='Nuestros inicios'
                        onImageUpload={(file) => handleImageChange('nuestros_inicios', file)}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 4,
                            '& .edit-button': {
                                bottom: 8,
                                right: 8,
                            }
                        }}
                    />
                </motion.div>
            </Box>

            {/* SECCIÓN: IMPACTO COMUNITARIO */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row-reverse' },
                    alignItems: 'center',
                    px: { xs: 4, md: 12 },
                    py: 8,
                    bgcolor: '#ffe3dc',
                    gap: { xs: 4, md: 6 },
                }}
            >
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1.3 }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            color: '#e6691d',
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            mb: 3,
                        }}
                    >
                        Impacto Comunitario
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            fontSize: '1.3rem',
                            lineHeight: 1.9,
                            fontFamily: '"PeterMedium", sans-serif',
                            color: '#333',
                        }}
                    >
                        A lo largo de las décadas, hemos trabajado con
                        más de 10,000 niños, formando no solo jugadores sino líderes.
                        Nuestras iniciativas incluyen clínicas deportivas, programas de
                        mentoría y eventos familiares.
                    </Typography>
                </motion.div>
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1, position: 'relative' }}
                >
                    <EditableImage
                        src={images.impacto_comunitario}
                        alt='Impacto comunitario'
                        onImageUpload={(file) => handleImageChange('impacto_comunitario', file)}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 4,
                            '& .edit-button': {
                                bottom: 8,
                                right: 8,
                            }
                        }}
                    />
                </motion.div>
            </Box>

            {/* SECCIÓN: NUESTROS VALORES */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    px: { xs: 4, md: 12 },
                    py: 8,
                    bgcolor: '#e3f2fd',
                    gap: { xs: 4, md: 6 },
                }}
            >
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1.3 }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            color: '#e6691d',
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            mb: 3,
                        }}
                    >
                        Nuestros Valores
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            fontSize: '1.3rem',
                            lineHeight: 1.9,
                            fontFamily: '"PeterMedium", sans-serif',
                            color: '#333',
                        }}
                    >
                        Solidaridad, compromiso, respeto y pasión por el
                        deporte. Estos valores son la base de cada entrenamiento, partido y
                        actividad que realizamos como asociación.
                    </Typography>
                </motion.div>
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                    style={{ flex: 1, position: 'relative' }}
                >
                    <EditableImage
                        src={images.nuestros_valores}
                        alt='Nuestros valores'
                        onImageUpload={(file) => handleImageChange('nuestros_valores', file)}
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 4,
                            '& .edit-button': {
                                bottom: 8,
                                right: 8,
                            }
                        }}
                    />
                </motion.div>
            </Box>
            
            {/* SECCIÓN DE GALERÍA HISTÓRICA CON CARRUSEL */}
            <Box
                sx={{
                    py: 8,
                    px: { xs: 4, md: 12 },
                    bgcolor: '#fef6f2',
                    textAlign: 'center',
                }}
            >
                <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeUp}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            fontFamily: '"Varsity", cursive',
                            fontWeight: 'bold',
                            color: '#e6691d',
                            fontSize: { xs: '2.5rem', md: '3rem' },
                            mb: 4,
                        }}
                    >
                        Galería Histórica
                    </Typography>
                    <Slider {...sliderSettings}>
                        {galeriaImages.map((src, index) => (
                            <Box key={index} sx={{ px: 2, position: 'relative' }}>
                                <EditableImage
                                    src={src}
                                    alt={`Galería ${index + 1}`}
                                    onImageUpload={handleGalleryImageUpload(index)}
                                    sx={{
                                        maxWidth: '100%',
                                        width: { xs: '100%', md: '70%' },
                                        borderRadius: 3,
                                        boxShadow: 5,
                                        margin: '0 auto',
                                        '& .edit-button': {
                                            bottom: 8,
                                            right: 'calc(15% + 8px)',
                                            transform: 'translateX(50%)',
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Slider>
                </motion.div>
            </Box>
        </>
    );
}

export default NuestraHistoria;