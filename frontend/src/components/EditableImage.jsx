import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; // Importamos el icono de lápiz
import PropTypes from 'prop-types';

const EditableImage = ({ src, alt, onImageUpload, sx }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentSrc, setCurrentSrc] = useState(src);
    const fileInputRef = useRef(null); // Referencia para el input de archivo

    // Actualiza la URL de la imagen si la prop 'src' cambia desde el padre
    useEffect(() => {
        setCurrentSrc(src);
    }, [src]);

    const handleFileChange = (e) => {
        // Extrae el archivo del evento
        const file = e.target.files[0];
        if (file) {
            // Verifica que el archivo sea una imagen (esto podría ser más robusto si es necesario)
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecciona un archivo de imagen.');
                return;
            }
            
            // Crea una URL temporal para la vista previa inmediata
            const filePreviewUrl = URL.createObjectURL(file);
            
            // Actualiza la imagen mostrada con la vista previa
            setCurrentSrc(filePreviewUrl); 
            
            // Llama a la función del padre, pasando el objeto File
            onImageUpload(file); 
        }
    };

    const handleClick = () => {
        // Dispara el clic del input de archivo oculto
        fileInputRef.current.click();
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-block', // Permite que el contenedor se ajuste al tamaño de la imagen
                '&:hover .edit-icon': { // Muestra el icono de edición al pasar el mouse
                    opacity: 1,
                },
                ...sx // Permite pasar estilos personalizados desde el padre
            }}
        >
            {loading ? (
                <CircularProgress
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                    }}
                />
            ) : (
                <Box
                    component="img"
                    src={currentSrc}
                    alt={alt}
                    sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 2, // Bordes redondeados para un estilo suave
                        boxShadow: 4, // Sombra para dar profundidad
                        // Puedes añadir estilos específicos aquí si quieres que la imagen sea diferente
                        // ... (sx && sx['& .editable-image']) 
                    }}
                />
            )}
            
            {/* Input de archivo oculto */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp,image/avif" // Acepta formatos comunes de imagen
            />

            {/* Botón de edición con el icono de lápiz */}
            <IconButton
                className="edit-icon" // Clase para aplicar estilos de hover
                onClick={handleClick}
                aria-label="cambiar imagen"
                disabled={loading}
                sx={{
                    position: 'absolute',
                    bottom: 12, // Ajusta la posición según necesites
                    right: 12,  // Ajusta la posición según necesites
                    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo semitransparente blanco
                    backdropFilter: 'blur(5px)', // Efecto de desenfoque detrás del icono
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo más opaco al pasar el mouse
                    },
                    width: '40px', // Tamaño del botón
                    height: '40px', // Tamaño del botón
                    opacity: 0, // Inicialmente oculto, se muestra en hover
                    transition: 'opacity 0.3s ease', // Transición suave para la opacidad
                    // ... (sx && sx['& .edit-button']) // Permite sobrescribir estilos si se pasan via sx
                }}
            >
                <EditIcon fontSize="medium" /> {/* Icono de lápiz */}
            </IconButton>

            {error && (
                <Typography variant="caption" color="error" sx={{ 
                    position: 'absolute', 
                    bottom: -20, // Posiciona el error debajo de la imagen
                    left: 0, 
                    width: '100%',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo para el texto de error
                    padding: '2px 5px',
                    borderRadius: 1
                }}>
                    {error}
                </Typography>
            )}
        </Box>
    );
};

EditableImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onImageUpload: PropTypes.func.isRequired, // Esta prop ahora recibe el objeto File
    sx: PropTypes.object,
};

export default EditableImage;