import React, { useState } from 'react';
import { api } from '../api/api';
import { CircularProgress, Box } from '@mui/material'; // Importa Box de MUI
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PropTypes from 'prop-types'; // Para validar props

// El CSS para este componente se manejará en gran parte con sx prop
// Por lo tanto, el archivo EditableImage.css podría ser más simple o incluso eliminarse si todo se migra a sx

const EditableImage = ({ src, alt, onImageUpload, sx }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentSrc, setCurrentSrc] = useState(src); // Usamos un estado interno para la URL de la imagen

    // Actualiza el src interno si cambia la prop src
    React.useEffect(() => {
        setCurrentSrc(src);
    }, [src]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        setError('');

        try {
            // Simulación de subida: en un proyecto real, esto interactuaría con Supabase
            // const response = await api.post('/upload', formData, {
            //   headers: {
            //     'Content-Type': 'multipart/form-data',
            //   },
            // });
            // const newImageUrl = response.data.imageUrl;

            // Para propósito de demostración, crea una URL temporal para la imagen local
            const newImageUrl = URL.createObjectURL(file);

            setCurrentSrc(newImageUrl); // Actualiza la imagen mostrada
            onImageUpload(newImageUrl); // Notifica al componente padre
        } catch (err) {
            setError('Error al subir la imagen.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        document.getElementById(`file-input-${alt.replace(/\s/g, '-')}`).click(); // Usa un ID único
    };

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'inline-block', // Permite que el contenedor se ajuste al tamaño de la imagen
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
                    src={currentSrc} // Usa el src del estado interno
                    alt={alt}
                    sx={{
                        width: '100%', // Asegura que la imagen ocupe todo el ancho del contenedor
                        height: 'auto', // Mantiene la relación de aspecto
                        display: 'block', // Elimina espacios debajo de la imagen
                        borderRadius: 2,
                        boxShadow: 4,
                        ... (sx && sx['& .editable-image']), // Permite sobrescribir estilos de la imagen
                    }}
                />
            )}
            <input
                type="file"
                id={`file-input-${alt.replace(/\s/g, '-')}`} // ID único
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*" // Solo acepta archivos de imagen
            />
            <IconButton
                className="edit-button"
                onClick={handleClick}
                aria-label="cambiar imagen"
                disabled={loading}
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    ... (sx && sx['& .edit-button']), // Permite sobrescribir estilos del botón
                }}
            >
                <PhotoCameraIcon />
            </IconButton>
            {error && <Typography variant="caption" color="error" sx={{ position: 'absolute', bottom: 0, left: 8 }}>{error}</Typography>}
        </Box>
    );
};

EditableImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    sx: PropTypes.object, // Propiedad opcional para estilos de Material-UI
};

export default EditableImage;